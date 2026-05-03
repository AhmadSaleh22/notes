/**
 * Domain model for the supply-chain risk graph.
 *
 * Graph shape (label : key → other props):
 *
 *   (Package {name})
 *     └─ HAS_VERSION → (Version {id = name@version, version, publishedAt})
 *                         ├─ DEPENDS_ON {range, kind} → (Package)
 *                         ├─ MAINTAINED_BY → (Maintainer {username})
 *                         └─ AFFECTED_BY → (Vulnerability {id, severity, cvss})
 *
 *   (Vulnerability) -[:REFERENCES]-> (Advisory {id, source})
 *
 * Notes:
 *  - DEPENDS_ON edges live on Version (not Package) because deps change per release.
 *  - Maintainers are linked to Versions (publish-time), so we can detect maintainer
 *    drift between releases — a real-world supply-chain signal.
 */

export type DependencyKind = 'runtime' | 'dev' | 'peer' | 'optional';

export interface PackageNode {
  name: string;
  description?: string;
  homepage?: string;
}

export interface VersionNode {
  id: string; // `${name}@${version}` — the natural key
  name: string;
  version: string;
  publishedAt?: string; // ISO-8601
  license?: string;
  deprecated?: boolean;
}

export interface MaintainerNode {
  username: string;
  email?: string;
}

export interface DependencyEdge {
  fromVersionId: string; // `${name}@${version}`
  toPackageName: string;
  range: string; // semver range as published
  kind: DependencyKind;
}

export interface VulnerabilityNode {
  id: string; // OSV id, e.g. GHSA-xxxx-yyyy-zzzz
  summary?: string;
  severity?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';
  cvss?: number;
  publishedAt?: string;
  modifiedAt?: string;
}

export interface VulnerabilityAffects {
  vulnerabilityId: string;
  versionId: string; // `${name}@${version}`
}
