import { env } from '../config/env';
import {
  DependencyEdge,
  MaintainerNode,
  PackageNode,
  VersionNode,
} from '../domain/types';
import { getJson } from './http';

/**
 * Subset of the npm registry "packument" we care about.
 * See: https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md
 */
interface NpmPackument {
  name: string;
  description?: string;
  homepage?: string;
  'dist-tags'?: { latest?: string };
  versions: Record<string, NpmManifest>;
  time?: Record<string, string>;
  maintainers?: Array<{ name: string; email?: string }>;
}

interface NpmManifest {
  name: string;
  version: string;
  license?: string | { type: string };
  deprecated?: string | boolean;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  maintainers?: Array<{ name: string; email?: string }>;
  _npmUser?: { name: string; email?: string };
}

export interface NpmFetchResult {
  pkg: PackageNode;
  versions: VersionNode[];
  maintainers: MaintainerNode[];
  dependencies: DependencyEdge[];
  /** version-id → maintainer usernames */
  maintainedBy: Array<{ versionId: string; username: string }>;
}

const versionId = (name: string, version: string): string => `${name}@${version}`;

function normalizeLicense(lic: NpmManifest['license']): string | undefined {
  if (!lic) return undefined;
  return typeof lic === 'string' ? lic : lic.type;
}

function depsFromManifest(m: NpmManifest): DependencyEdge[] {
  const out: DependencyEdge[] = [];
  const fromVersionId = versionId(m.name, m.version);
  const buckets: Array<[Record<string, string> | undefined, DependencyEdge['kind']]> = [
    [m.dependencies, 'runtime'],
    [m.devDependencies, 'dev'],
    [m.peerDependencies, 'peer'],
    [m.optionalDependencies, 'optional'],
  ];
  for (const [deps, kind] of buckets) {
    if (!deps) continue;
    for (const [toPackageName, range] of Object.entries(deps)) {
      out.push({ fromVersionId, toPackageName, range, kind });
    }
  }
  return out;
}

/**
 * Fetch an npm packument and project it into our graph-shaped tuples.
 * A `versionsLimit` of N keeps the latest N releases — useful when starting from
 * a popular package with hundreds of versions.
 */
export async function fetchNpmPackument(
  packageName: string,
  opts: { versionsLimit?: number } = {},
): Promise<NpmFetchResult | null> {
  const url = `${env.npmRegistry}/${encodeURIComponent(packageName).replace('%40', '@')}`;
  const doc = await getJson<NpmPackument>(url);
  if (!doc) return null;

  const allVersions = Object.keys(doc.versions ?? {});
  // Sort by published time (desc) when available; otherwise registry order.
  const sorted = doc.time
    ? allVersions.slice().sort((a, b) => (doc.time![b] ?? '').localeCompare(doc.time![a] ?? ''))
    : allVersions.reverse();
  const kept = opts.versionsLimit ? sorted.slice(0, opts.versionsLimit) : sorted;

  const pkg: PackageNode = {
    name: doc.name,
    ...(doc.description ? { description: doc.description } : {}),
    ...(doc.homepage ? { homepage: doc.homepage } : {}),
  };

  const versions: VersionNode[] = [];
  const dependencies: DependencyEdge[] = [];
  const maintainersByName = new Map<string, MaintainerNode>();
  const maintainedBy: NpmFetchResult['maintainedBy'] = [];

  for (const v of kept) {
    const m = doc.versions[v];
    if (!m) continue;
    const id = versionId(doc.name, v);
    versions.push({
      id,
      name: doc.name,
      version: v,
      ...(doc.time?.[v] ? { publishedAt: doc.time[v] } : {}),
      ...(normalizeLicense(m.license) ? { license: normalizeLicense(m.license)! } : {}),
      ...(m.deprecated ? { deprecated: true } : {}),
    });
    dependencies.push(...depsFromManifest(m));

    const versionMaintainers = m.maintainers ?? doc.maintainers ?? [];
    for (const mt of versionMaintainers) {
      if (!mt?.name) continue;
      maintainersByName.set(mt.name, {
        username: mt.name,
        ...(mt.email ? { email: mt.email } : {}),
      });
      maintainedBy.push({ versionId: id, username: mt.name });
    }
  }

  return {
    pkg,
    versions,
    maintainers: [...maintainersByName.values()],
    dependencies,
    maintainedBy,
  };
}
