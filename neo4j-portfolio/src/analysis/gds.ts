import { withSession } from '../config/neo4j';

/**
 * Wrappers around Neo4j Graph Data Science (GDS) procedures. Each helper:
 *   1. Drops any pre-existing in-memory projection with the same name.
 *   2. Projects the relevant subgraph.
 *   3. Runs the algorithm in `write` mode so results land back as node properties.
 *   4. Cleans up the projection.
 *
 * Idempotent — safe to re-run after each ingest.
 */

const PROJECTION = 'scg-deps';

async function dropProjection(): Promise<void> {
  await withSession(async (s) => {
    await s.executeWrite((tx) =>
      tx.run(
        "CALL gds.graph.drop($name, false) YIELD graphName RETURN graphName",
        { name: PROJECTION },
      ),
    );
  });
}

/**
 * Project (Package)-[DEPENDS_ON-via-Version]->(Package) by collapsing through
 * Version. We only treat *runtime* deps as edges — dev/peer/optional don't ship.
 */
async function projectPackageGraph(): Promise<void> {
  await dropProjection();
  await withSession(async (s) => {
    await s.executeWrite((tx) =>
      tx.run(
        `
        CALL gds.graph.project.cypher(
          $name,
          'MATCH (p:Package) RETURN id(p) AS id, p.name AS name',
          'MATCH (a:Package)-[:HAS_VERSION]->(:Version)-[d:DEPENDS_ON]->(b:Package)
           WHERE d.kind = "runtime"
           RETURN id(a) AS source, id(b) AS target'
        )
        `,
        { name: PROJECTION },
      ),
    );
  });
}

/**
 * PageRank on the package dependency graph. A package's score is high when it
 * is depended on by many packages that themselves are highly depended on —
 * this is a far better "criticality" signal than raw in-degree.
 */
export async function runPageRank(): Promise<Array<{ name: string; score: number }>> {
  await projectPackageGraph();
  try {
    return await withSession(async (s) => {
      const res = await s.executeWrite((tx) =>
        tx.run(
          `
          CALL gds.pageRank.write($name, {
            writeProperty: 'pagerank',
            maxIterations: 30,
            dampingFactor: 0.85
          })
          YIELD nodePropertiesWritten
          WITH nodePropertiesWritten
          MATCH (p:Package) WHERE p.pagerank IS NOT NULL
          RETURN p.name AS name, p.pagerank AS score
          ORDER BY score DESC LIMIT 25
          `,
          { name: PROJECTION },
        ),
      );
      return res.records.map((r) => ({
        name: r.get('name') as string,
        score: r.get('score') as number,
      }));
    });
  } finally {
    await dropProjection();
  }
}

/**
 * Louvain community detection — exposes clusters of packages that depend on
 * each other heavily. Useful for "framework" detection (e.g. the Babel cluster,
 * the React cluster).
 */
export async function runCommunityDetection(): Promise<
  Array<{ community: number; size: number; sample: string[] }>
> {
  await projectPackageGraph();
  try {
    return await withSession(async (s) => {
      const res = await s.executeWrite((tx) =>
        tx.run(
          `
          CALL gds.louvain.write($name, { writeProperty: 'community' })
          YIELD communityCount
          WITH communityCount
          MATCH (p:Package) WHERE p.community IS NOT NULL
          WITH p.community AS community, collect(p.name) AS members
          RETURN community, size(members) AS size, members[0..5] AS sample
          ORDER BY size DESC LIMIT 15
          `,
          { name: PROJECTION },
        ),
      );
      return res.records.map((r) => ({
        community: (r.get('community') as { toNumber?: () => number }).toNumber?.() ??
          (r.get('community') as number),
        size: (r.get('size') as { toNumber?: () => number }).toNumber?.() ??
          (r.get('size') as number),
        sample: r.get('sample') as string[],
      }));
    });
  } finally {
    await dropProjection();
  }
}
