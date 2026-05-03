// maintainerRisk.cypher
//
// Question: "Which maintainers are single points of failure across the
//            ecosystem we've ingested?" — i.e. control many packages, including
//            high-traffic ones, with few co-maintainers.
//
// A maintainer is risky when:
//   - they publish to many distinct Packages (breadth)
//   - and several of those Packages have few other maintainers (concentration)
//
// We rank by a composite "blast surface": packages_owned * sum(1 / co_maintainer_count).
// That score grows when a maintainer owns more packages AND those packages
// have few backup maintainers — modelling concentration risk explicitly.

MATCH (m:Maintainer)<-[:MAINTAINED_BY]-(:Version)<-[:HAS_VERSION]-(p:Package)
WITH m, p, count(DISTINCT p) AS pkg_count
// Per-package: how many maintainers does this package have on its latest
// known versions? We approximate "latest" as max(publishedAt).
MATCH (p)-[:HAS_VERSION]->(v:Version)
WITH m, p, max(v.publishedAt) AS latestAt
MATCH (p)-[:HAS_VERSION]->(latest:Version {publishedAt: latestAt})-[:MAINTAINED_BY]->(co:Maintainer)
WITH m, p, count(DISTINCT co) AS co_maintainers
WITH m,
     count(DISTINCT p) AS packages_owned,
     collect({pkg: p.name, co_maintainers: co_maintainers}) AS detail,
     sum(1.0 / co_maintainers) AS concentration
RETURN m.username AS maintainer,
       packages_owned,
       round(packages_owned * concentration, 2) AS blast_surface,
       detail
ORDER BY blast_surface DESC
LIMIT 25;
