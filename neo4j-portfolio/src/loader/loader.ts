import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { withSession } from '../config/neo4j';
import { env } from '../config/env';
import {
  DependencyEdge,
  MaintainerNode,
  PackageNode,
  VersionNode,
  VulnerabilityAffects,
  VulnerabilityNode,
} from '../domain/types';
import { NpmFetchResult } from '../ingest/npm';
import { chunks } from './batch';

/**
 * All Cypher writes go through MERGE so re-running an ingest is safe and
 * idempotent. Every batch is one transaction; `executeWrite` retries
 * automatically on transient errors (deadlock, leader switch, etc.).
 */

const SCHEMA_FILE = join(__dirname, '..', 'schema', 'constraints.cypher');

export async function applySchema(): Promise<void> {
  const file = readFileSync(SCHEMA_FILE, 'utf8');
  // Cypher allows multiple statements separated by `;` but the driver expects
  // one statement per call, so we split. Empty / comment-only fragments are skipped.
  const stmts = file
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('//'));
  await withSession(async (s) => {
    for (const stmt of stmts) {
      await s.executeWrite((tx) => tx.run(stmt));
    }
  });
}

async function batchWrite<T>(rows: T[], cypher: string, paramName = 'rows'): Promise<void> {
  if (rows.length === 0) return;
  for (const batch of chunks(rows, env.ingest.batchSize)) {
    await withSession(async (s) => {
      await s.executeWrite((tx) => tx.run(cypher, { [paramName]: batch }));
    });
  }
}

export async function loadPackages(packages: PackageNode[]): Promise<void> {
  await batchWrite(
    packages,
    `
    UNWIND $rows AS row
    MERGE (p:Package {name: row.name})
    SET p.description = coalesce(row.description, p.description),
        p.homepage    = coalesce(row.homepage, p.homepage)
    `,
  );
}

export async function loadVersions(versions: VersionNode[]): Promise<void> {
  await batchWrite(
    versions,
    `
    UNWIND $rows AS row
    MERGE (p:Package {name: row.name})
    MERGE (v:Version {id: row.id})
    SET v.name        = row.name,
        v.version     = row.version,
        v.publishedAt = coalesce(row.publishedAt, v.publishedAt),
        v.license     = coalesce(row.license, v.license),
        v.deprecated  = coalesce(row.deprecated, v.deprecated)
    MERGE (p)-[:HAS_VERSION]->(v)
    `,
  );
}

export async function loadMaintainers(maintainers: MaintainerNode[]): Promise<void> {
  await batchWrite(
    maintainers,
    `
    UNWIND $rows AS row
    MERGE (m:Maintainer {username: row.username})
    SET m.email = coalesce(row.email, m.email)
    `,
  );
}

export async function linkMaintainers(
  edges: Array<{ versionId: string; username: string }>,
): Promise<void> {
  await batchWrite(
    edges,
    `
    UNWIND $rows AS row
    MATCH (v:Version {id: row.versionId})
    MERGE (m:Maintainer {username: row.username})
    MERGE (v)-[:MAINTAINED_BY]->(m)
    `,
  );
}

export async function loadDependencies(edges: DependencyEdge[]): Promise<void> {
  await batchWrite(
    edges,
    `
    UNWIND $rows AS row
    MATCH (from:Version {id: row.fromVersionId})
    MERGE (to:Package {name: row.toPackageName})
    MERGE (from)-[d:DEPENDS_ON {kind: row.kind}]->(to)
    SET d.range = row.range
    `,
  );
}

export async function loadVulnerabilities(vulns: VulnerabilityNode[]): Promise<void> {
  await batchWrite(
    vulns,
    `
    UNWIND $rows AS row
    MERGE (v:Vulnerability {id: row.id})
    SET v.summary     = coalesce(row.summary, v.summary),
        v.severity    = coalesce(row.severity, v.severity),
        v.cvss        = coalesce(row.cvss, v.cvss),
        v.publishedAt = coalesce(row.publishedAt, v.publishedAt),
        v.modifiedAt  = coalesce(row.modifiedAt, v.modifiedAt)
    `,
  );
}

export async function linkVulnerabilities(edges: VulnerabilityAffects[]): Promise<void> {
  await batchWrite(
    edges,
    `
    UNWIND $rows AS row
    MATCH (v:Version {id: row.versionId})
    MATCH (vuln:Vulnerability {id: row.vulnerabilityId})
    MERGE (v)-[:AFFECTED_BY]->(vuln)
    `,
  );
}

/** Convenience: load an entire npm packument projection in dependency order. */
export async function loadNpmResult(r: NpmFetchResult): Promise<void> {
  await loadPackages([r.pkg]);
  await loadVersions(r.versions);
  await loadMaintainers(r.maintainers);
  await linkMaintainers(r.maintainedBy);
  await loadDependencies(r.dependencies);
}
