import { withSession } from '../config/neo4j';
import { fetchVulnerabilities, queryBatchVulns } from './osv';
import { loadVulnerabilities, linkVulnerabilities } from '../loader/loader';
import { chunks } from '../loader/batch';
import { VulnerabilityAffects } from '../domain/types';

const OSV_BATCH = 200; // OSV recommends ~1000, we stay under for stability.

export interface VulnSyncReport {
  versionsScanned: number;
  vulnsFound: number;
  affectsCreated: number;
}

/**
 * Walk every Version currently in the graph, ask OSV which are affected,
 * hydrate the vulnerability records, then persist (Version)-[:AFFECTED_BY]->(Vuln) edges.
 *
 * This deliberately re-queries everything on each run: vulnerabilities are
 * disclosed continuously, so a previously "safe" version may no longer be.
 */
export async function syncVulnerabilities(): Promise<VulnSyncReport> {
  const pairs = await withSession(async (s) => {
    const res = await s.executeRead((tx) =>
      tx.run('MATCH (v:Version) RETURN v.name AS name, v.version AS version'),
    );
    return res.records.map((r) => ({
      name: r.get('name') as string,
      version: r.get('version') as string,
    }));
  }, 'read');

  const allAffects: VulnerabilityAffects[] = [];
  const allIds = new Set<string>();

  for (const batch of chunks(pairs, OSV_BATCH)) {
    const { vulnIds, affects } = await queryBatchVulns(batch);
    for (const id of vulnIds) allIds.add(id);
    allAffects.push(...affects);
  }

  let vulnsFound = 0;
  if (allIds.size > 0) {
    const vulns = await fetchVulnerabilities([...allIds]);
    vulnsFound = vulns.length;
    // Hydrate first so that the edge MATCH on :Vulnerability succeeds.
    await loadVulnerabilities(vulns);
    await linkVulnerabilities(allAffects);
  }

  return { versionsScanned: pairs.length, vulnsFound, affectsCreated: allAffects.length };
}
