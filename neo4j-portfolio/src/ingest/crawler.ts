import pLimit from 'p-limit';
import { env } from '../config/env';
import { fetchNpmPackument, NpmFetchResult } from './npm';
import {
  loadDependencies,
  loadMaintainers,
  loadPackages,
  loadVersions,
  linkMaintainers,
} from '../loader/loader';

export interface CrawlOptions {
  seeds: string[];
  /** Cap transitive depth so the crawl terminates on huge ecosystems. */
  maxDepth?: number;
  /** Keep only the most recent N versions per package. */
  versionsLimit?: number;
}

export interface CrawlReport {
  visited: string[];
  fetched: number;
  totalVersions: number;
  totalDependencies: number;
}

/**
 * Breadth-first crawl across the npm dependency graph.
 *
 * Each visited package is fetched once, projected into graph rows, and persisted
 * before its runtime dependencies are queued — this keeps memory bounded and
 * lets the loader make forward progress even on a partial/aborted run.
 *
 * Concurrency is bounded by INGEST_CONCURRENCY (default 8) to be a polite
 * registry citizen.
 */
export async function crawl(opts: CrawlOptions): Promise<CrawlReport> {
  const maxDepth = opts.maxDepth ?? env.ingest.maxDepth;
  const limit = pLimit(env.ingest.concurrency);
  const visited = new Set<string>();
  const queue: Array<{ name: string; depth: number }> = opts.seeds.map((s) => ({ name: s, depth: 0 }));

  let fetched = 0;
  let totalVersions = 0;
  let totalDependencies = 0;

  const fetchOpts: Parameters<typeof fetchNpmPackument>[1] =
    opts.versionsLimit !== undefined ? { versionsLimit: opts.versionsLimit } : {};

  while (queue.length > 0) {
    const wave = queue.splice(0, queue.length);
    const results = await Promise.all(
      wave.map(({ name, depth }) =>
        limit(async (): Promise<{ depth: number; result: NpmFetchResult | null } | null> => {
          if (visited.has(name)) return null;
          visited.add(name);
          const result = await fetchNpmPackument(name, fetchOpts).catch((err) => {
            console.error(`[crawler] fetch failed for ${name}:`, err.message);
            return null;
          });
          return { depth, result };
        }),
      ),
    );

    const allDeps: NpmFetchResult['dependencies'] = [];
    for (const r of results) {
      if (!r?.result) continue;
      const { result, depth } = r;
      fetched += 1;
      totalVersions += result.versions.length;
      totalDependencies += result.dependencies.length;

      // Persist nodes first, edges second — referential targets must exist.
      await loadPackages([result.pkg]);
      await loadVersions(result.versions);
      await loadMaintainers(result.maintainers);
      await linkMaintainers(result.maintainedBy);
      allDeps.push(...result.dependencies);

      if (depth < maxDepth) {
        for (const dep of result.dependencies) {
          if (dep.kind !== 'runtime') continue; // dev/peer/optional don't ship
          if (!visited.has(dep.toPackageName)) {
            queue.push({ name: dep.toPackageName, depth: depth + 1 });
          }
        }
      }
    }
    if (allDeps.length > 0) await loadDependencies(allDeps);
  }

  return {
    visited: [...visited],
    fetched,
    totalVersions,
    totalDependencies,
  };
}
