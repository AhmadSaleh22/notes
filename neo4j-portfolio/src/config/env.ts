import 'dotenv/config';

function required(key: string, fallback?: string): string {
  const v = process.env[key] ?? fallback;
  if (v === undefined || v === '') {
    throw new Error(`Missing required env var: ${key}`);
  }
  return v;
}

function asInt(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) throw new Error(`Env ${key} must be an integer, got: ${raw}`);
  return n;
}

export const env = {
  neo4j: {
    uri: required('NEO4J_URI', 'bolt://localhost:7687'),
    user: required('NEO4J_USER', 'neo4j'),
    password: required('NEO4J_PASSWORD', 'supplychain'),
    database: required('NEO4J_DATABASE', 'neo4j'),
  },
  npmRegistry: required('NPM_REGISTRY', 'https://registry.npmjs.org'),
  osvApi: required('OSV_API', 'https://api.osv.dev/v1'),
  ingest: {
    concurrency: asInt('INGEST_CONCURRENCY', 8),
    batchSize: asInt('INGEST_BATCH_SIZE', 200),
    maxDepth: asInt('MAX_TRANSITIVE_DEPTH', 4),
    httpTimeoutMs: asInt('HTTP_TIMEOUT_MS', 15000),
  },
} as const;
