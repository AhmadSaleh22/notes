// blastRadius.cypher
//
// Question: "If vulnerability $vulnId hits, which packages in our graph are
//            transitively impacted, and how far away are they?"
//
// Strategy:
//   1. Find every Version directly AFFECTED_BY the vulnerability.
//   2. Walk dependency edges *backwards* — a downstream package that DEPENDS_ON
//      a Package whose Version is affected is itself impacted.
//   3. Return the shortest impact-path length per affected downstream package
//      so the report ranks "1 hop away" before "5 hops away".
//
// Parameters: $vulnId (string)

MATCH (vuln:Vulnerability {id: $vulnId})<-[:AFFECTED_BY]-(affected:Version)
WITH affected, vuln
MATCH (affected)<-[:HAS_VERSION]-(directPkg:Package)
WITH directPkg, vuln
// Walk DEPENDS_ON edges *backwards* with bounded depth — avoids runaway
// traversals on hub packages. allShortestPaths returns one path per (start,end)
// pair so we don't double-count diamond dependencies.
MATCH p = allShortestPaths(
  (downstream:Package)-[:HAS_VERSION|DEPENDS_ON*1..6]->(directPkg)
)
WITH downstream, vuln, min(length(p)) AS hops
RETURN downstream.name AS impactedPackage,
       hops,
       vuln.id AS vulnerability,
       vuln.severity AS severity
ORDER BY hops ASC, severity DESC, impactedPackage ASC;
