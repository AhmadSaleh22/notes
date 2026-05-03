import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { withSession } from '../config/neo4j';

const QUERIES_DIR = join(__dirname, '..', 'queries');

const loadCypher = (name: string): string =>
  readFileSync(join(QUERIES_DIR, `${name}.cypher`), 'utf8');

export async function blastRadius(vulnId: string): Promise<unknown[]> {
  return runRead(loadCypher('blastRadius'), { vulnId });
}

export async function maintainerRisk(): Promise<unknown[]> {
  return runRead(loadCypher('maintainerRisk'), {});
}

export async function criticalPackages(): Promise<unknown[]> {
  return runRead(loadCypher('criticalPackages'), {});
}

export async function maintainerDrift(packageName: string): Promise<unknown[]> {
  return runRead(loadCypher('maintainerDrift'), { packageName });
}

async function runRead(cypher: string, params: Record<string, unknown>): Promise<unknown[]> {
  return withSession(async (s) => {
    const res = await s.executeRead((tx) => tx.run(cypher, params));
    return res.records.map((r) => r.toObject());
  }, 'read');
}
