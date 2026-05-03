#!/usr/bin/env node
import { Command } from 'commander';
import { closeDriver, verifyConnectivity } from '../config/neo4j';
import { applySchema } from '../loader/loader';
import { crawl } from '../ingest/crawler';
import { syncVulnerabilities } from '../ingest/vulnSync';
import { runCommunityDetection, runPageRank } from '../analysis/gds';
import {
  blastRadius,
  criticalPackages,
  maintainerDrift,
  maintainerRisk,
} from '../analysis/reports';

const program = new Command();
program
  .name('scg')
  .description('Supply-chain risk graph — ingest, analyze, report.')
  .version('0.1.0');

const schema = program.command('schema').description('Database schema management');
schema
  .command('apply')
  .description('Create constraints and indexes (idempotent)')
  .action(wrap(async () => {
    await applySchema();
    console.log('Schema applied.');
  }));

const ingest = program.command('ingest').description('Pull data into the graph');
ingest
  .command('packages')
  .description('Crawl npm starting from --seed packages, up to --depth')
  .requiredOption('-s, --seed <names>', 'Comma-separated package names', commaList)
  .option('-d, --depth <n>', 'Max transitive depth', toInt, 3)
  .option('-v, --versions <n>', 'Latest versions per package', toInt, 25)
  .action(wrap(async (opts: { seed: string[]; depth: number; versions: number }) => {
    const report = await crawl({
      seeds: opts.seed,
      maxDepth: opts.depth,
      versionsLimit: opts.versions,
    });
    console.log(JSON.stringify(report, null, 2));
  }));

ingest
  .command('vulns')
  .description('Query OSV.dev for every Version in the graph and link AFFECTED_BY edges')
  .action(wrap(async () => {
    const report = await syncVulnerabilities();
    console.log(JSON.stringify(report, null, 2));
  }));

const analyze = program.command('analyze').description('Run analysis queries');
analyze
  .command('blast')
  .description('Blast radius for a single vulnerability')
  .requiredOption('--vuln <id>', 'Vulnerability id (e.g. GHSA-xxxx-yyyy-zzzz)')
  .action(wrap(async (opts: { vuln: string }) => {
    console.log(JSON.stringify(await blastRadius(opts.vuln), null, 2));
  }));
analyze
  .command('maintainers')
  .description('Top maintainers by concentration risk')
  .action(wrap(async () => {
    console.log(JSON.stringify(await maintainerRisk(), null, 2));
  }));
analyze
  .command('drift')
  .description('Maintainer-set drift between consecutive versions')
  .requiredOption('--package <name>', 'Package name')
  .action(wrap(async (opts: { package: string }) => {
    console.log(JSON.stringify(await maintainerDrift(opts.package), null, 2));
  }));
analyze
  .command('critical')
  .description('Structurally critical packages (Cypher-only heuristic)')
  .action(wrap(async () => {
    console.log(JSON.stringify(await criticalPackages(), null, 2));
  }));
analyze
  .command('centrality')
  .description('PageRank on the package dependency graph (writes :Package.pagerank)')
  .action(wrap(async () => {
    console.log(JSON.stringify(await runPageRank(), null, 2));
  }));
analyze
  .command('communities')
  .description('Louvain community detection (writes :Package.community)')
  .action(wrap(async () => {
    console.log(JSON.stringify(await runCommunityDetection(), null, 2));
  }));

program.parseAsync(process.argv).catch(async (err) => {
  console.error(err);
  await closeDriver();
  process.exit(1);
});

function wrap<T>(fn: (opts: T) => Promise<void>): (opts: T) => Promise<void> {
  return async (opts: T) => {
    try {
      await verifyConnectivity();
      await fn(opts);
    } finally {
      await closeDriver();
    }
  };
}

function commaList(raw: string): string[] {
  return raw.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
}

function toInt(raw: string): number {
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n)) throw new Error(`Expected integer, got: ${raw}`);
  return n;
}
