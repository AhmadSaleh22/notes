# Supply-Chain Risk Graph (Neo4j)

A graph-database portfolio project that ingests the npm package ecosystem plus
public vulnerability data (OSV.dev) into Neo4j, then runs analyses you cannot
reasonably express in a relational database:

- **Blast radius** — for a given CVE, which packages in the graph are
  transitively impacted and how many hops away?
- **Maintainer concentration** — which maintainers are single points of failure
  across many packages?
- **Maintainer drift** — did the maintainer set change between releases of a
  package? (a real supply-chain hijack signal)
- **Structural criticality** — PageRank on the dependency graph to rank
  packages by how much of the ecosystem leans on them.
- **Communities** — Louvain clusters reveal coherent framework families
  (e.g. the Babel constellation, the React stack).

## Why Neo4j

The questions above are all *path* questions: "what reaches what, through
what, in how many hops?". Expressed as recursive joins they are slow and
ugly; in Cypher they are one screen of code that the planner runs efficiently
because traversal is the storage engine's primary operation.

## Architecture

The codebase is intentionally hexagonal so the graph schema, the data sources,
and the analysis layer can each be swapped without touching the others:

```
              ┌────────────────────┐
              │     CLI (commander)│
              └─────────┬──────────┘
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   ingest/         loader/           analysis/
   ───────         ───────           ────────
   npm.ts          loader.ts          gds.ts
   osv.ts          (batched           reports.ts
   crawler.ts       UNWIND +          (Cypher
   vulnSync.ts      MERGE)             from disk)
        │               │                ▲
        └──────► domain/types.ts ◄───────┘
                 schema/constraints.cypher
                        │
                        ▼
                 config/neo4j.ts (driver + sessions)
```

### Graph schema

```
(Package {name})
  └─[:HAS_VERSION]─► (Version {id, version, publishedAt, license})
                       ├─[:DEPENDS_ON {range, kind}]─► (Package)
                       ├─[:MAINTAINED_BY]─► (Maintainer {username})
                       └─[:AFFECTED_BY]─► (Vulnerability {id, severity, cvss})
```

Two design choices worth calling out:

1. **`DEPENDS_ON` lives on `Version`, not `Package`.** Dependencies change per
   release, so attaching them to the Package would lose history and prevent
   accurate blast-radius queries against a specific CVE-affected version.
2. **`MAINTAINED_BY` also lives on `Version`.** Maintainer sets change over
   time, and detecting that change is itself a supply-chain signal — see
   `queries/maintainerDrift.cypher`.

## Quickstart

Prereqs: Docker, Node 20+, `npm`.

```bash
# 1. Bring Neo4j up (Community + APOC + GDS) on bolt://localhost:7687
make up

# 2. Install deps and apply schema (constraints + indexes)
cp .env.example .env
npm install
npm run schema:apply

# 3. Crawl from a few seed packages
npm run scg -- ingest packages --seed express,react,lodash --depth 3 --versions 25

# 4. Pull vulnerabilities for everything we just ingested
npm run scg -- ingest vulns

# 5. Run analyses
npm run scg -- analyze critical
npm run scg -- analyze maintainers
npm run scg -- analyze centrality       # PageRank (writes :Package.pagerank)
npm run scg -- analyze communities      # Louvain  (writes :Package.community)
npm run scg -- analyze blast --vuln GHSA-xxxx-yyyy-zzzz
npm run scg -- analyze drift --package express
```

Open Neo4j Browser at <http://localhost:7474> for interactive exploration.

## Engineering notes

Design choices that demonstrate the senior mindset behind this portfolio:

- **Idempotent ingestion.** Every write is `MERGE`-based, every constraint has
  `IF NOT EXISTS`. A re-run never duplicates and never crashes — important
  because the npm registry and OSV are both moving targets.
- **Batched UNWIND.** Loaders chunk rows into `INGEST_BATCH_SIZE` (default 200)
  and use a single parameterised `UNWIND` per chunk. This is the single most
  important performance lever in Neo4j, and you'd hit timeouts within minutes
  without it.
- **Constraint before data.** Uniqueness constraints (`Package.name`,
  `Version.id`, etc.) are applied before any ingestion. They are required for
  `MERGE` to be both correct and fast — without them, MERGE does a label scan
  instead of an index lookup.
- **Driver lifecycle.** A single `Driver` instance per process (it owns the
  connection pool); sessions are short-lived; `executeWrite` / `executeRead`
  give us automatic retry on transient errors (deadlocks, leader switches).
- **Polite crawling.** `INGEST_CONCURRENCY` (default 8) bounds concurrent
  registry calls; OSV calls go through `querybatch` to amortise round-trips.
- **Cypher in `.cypher` files.** Analysis queries live as readable, version-
  controlled SQL-equivalents — not strings buried in TypeScript. They can be
  pasted straight into Neo4j Browser for iteration.
- **Hexagonal layout.** `domain/` knows nothing about Neo4j or HTTP;
  `ingest/` knows nothing about Neo4j; `loader/` knows nothing about HTTP.
  Swap the data source (PyPI, Cargo) by adding one file under `ingest/`.
- **Strict TypeScript.** `exactOptionalPropertyTypes`, `noUnusedLocals`, no
  implicit any.
- **Testable seams.** HTTP is isolated in `ingest/http.ts`, so `tests/npm.test.ts`
  can stub the registry and assert the *projection* logic without a network or
  database dependency.

## Roadmap

- License-policy queries: detect copyleft licenses pulled into a permissive
  project via transitive deps.
- Typo-squatting heuristic: cluster packages by Levenshtein distance + recent
  publish date, flag suspicious newcomers near popular names.
- GraphQL API on top of the read queries so a frontend can render risk reports.
- Multi-ecosystem ingest (PyPI, Maven Central) sharing the same graph schema.

## Layout

```
neo4j-portfolio/
├── docker-compose.yml      # Neo4j 5.26 + APOC + GDS
├── Makefile
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env.example
├── src/
│   ├── cli/index.ts        # Commander entry point
│   ├── config/             # env + driver lifecycle
│   ├── domain/types.ts     # graph-shape TypeScript types
│   ├── schema/constraints.cypher
│   ├── ingest/             # npm + OSV adapters + crawler
│   ├── loader/             # batched MERGE loaders
│   ├── analysis/           # GDS runner + report runner
│   └── queries/*.cypher    # analysis queries
└── tests/                  # jest unit tests
```
