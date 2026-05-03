import { env } from '../config/env';
import { VulnerabilityAffects, VulnerabilityNode } from '../domain/types';
import { postJson } from './http';

/**
 * OSV.dev "querybatch" — single round-trip for many (package, version) pairs.
 * Docs: https://google.github.io/osv.dev/post-v1-querybatch/
 */
interface OsvQueryBatchRequest {
  queries: Array<{
    package: { name: string; ecosystem: 'npm' };
    version: string;
  }>;
}

interface OsvQueryBatchResponse {
  results: Array<{ vulns?: Array<{ id: string; modified?: string }> }>;
}

interface OsvVulnerability {
  id: string;
  summary?: string;
  details?: string;
  published?: string;
  modified?: string;
  database_specific?: { severity?: string };
  severity?: Array<{ type: string; score: string }>;
  affected?: Array<{
    package?: { name: string; ecosystem: string };
    versions?: string[];
    ranges?: Array<{ type: string; events: Array<Record<string, string>> }>;
  }>;
}

type Severity = NonNullable<VulnerabilityNode['severity']>;

const SEV_RANK: Record<string, Severity> = {
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  MEDIUM: 'MODERATE',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

function normalizeSeverity(v: OsvVulnerability): Severity {
  const dbSev = v.database_specific?.severity?.toUpperCase();
  if (dbSev) {
    const mapped = SEV_RANK[dbSev];
    if (mapped) return mapped;
  }
  return 'UNKNOWN';
}

function extractCvss(v: OsvVulnerability): number | undefined {
  const cvss = v.severity?.find((s) => s.type?.startsWith('CVSS'));
  if (!cvss) return undefined;
  // CVSS vector strings are non-numeric; we don't compute the score here —
  // we only surface a numeric score if the source exposed one.
  const match = /\/(\d+\.\d+)$/.exec(cvss.score);
  return match ? Number.parseFloat(match[1]!) : undefined;
}

/**
 * Step 1: ask OSV which (name, version) pairs have any vuln, in one batch call.
 * Returns the unique vulnerability ids referenced and the affects edges.
 */
export async function queryBatchVulns(
  pairs: Array<{ name: string; version: string }>,
): Promise<{ vulnIds: string[]; affects: VulnerabilityAffects[] }> {
  if (pairs.length === 0) return { vulnIds: [], affects: [] };
  const body: OsvQueryBatchRequest = {
    queries: pairs.map((p) => ({ package: { name: p.name, ecosystem: 'npm' }, version: p.version })),
  };
  const res = await postJson<OsvQueryBatchResponse>(`${env.osvApi}/querybatch`, body);
  const ids = new Set<string>();
  const affects: VulnerabilityAffects[] = [];
  res.results.forEach((r, idx) => {
    const pair = pairs[idx]!;
    for (const v of r.vulns ?? []) {
      ids.add(v.id);
      affects.push({ vulnerabilityId: v.id, versionId: `${pair.name}@${pair.version}` });
    }
  });
  return { vulnIds: [...ids], affects };
}

/**
 * Step 2: hydrate each vulnerability id with its full record, so we can store
 * severity, summary, and timestamps.
 */
export async function fetchVulnerabilities(ids: string[]): Promise<VulnerabilityNode[]> {
  const out: VulnerabilityNode[] = [];
  for (const id of ids) {
    const v = await postJson<OsvVulnerability>(`${env.osvApi}/vulns/${encodeURIComponent(id)}`, {});
    const cvss = extractCvss(v);
    out.push({
      id: v.id,
      ...(v.summary ? { summary: v.summary } : {}),
      severity: normalizeSeverity(v),
      ...(cvss !== undefined ? { cvss } : {}),
      ...(v.published ? { publishedAt: v.published } : {}),
      ...(v.modified ? { modifiedAt: v.modified } : {}),
    });
  }
  return out;
}
