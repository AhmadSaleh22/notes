// criticalPackages.cypher
//
// Question: "Which packages are structurally critical — i.e. would cause the
//            most damage if compromised?"
//
// Heuristic: in-degree on DEPENDS_ON (how many distinct downstream packages
// depend on me, transitively, up to depth 4). This is a coarse proxy that runs
// in pure Cypher without GDS. For a true centrality score, run
// `analyze:central` which projects the dependency graph and runs PageRank.

MATCH (p:Package)
OPTIONAL MATCH (downstream:Package)-[:HAS_VERSION]->(:Version)-[:DEPENDS_ON*1..4]->(p)
WITH p, count(DISTINCT downstream) AS reverse_reach
MATCH (p)-[:HAS_VERSION]->(v:Version)
OPTIONAL MATCH (v)-[:AFFECTED_BY]->(vuln:Vulnerability)
WITH p,
     reverse_reach,
     count(DISTINCT vuln) AS known_vulns,
     count(DISTINCT vuln) FILTER (WHERE vuln.severity IN ['HIGH', 'CRITICAL']) AS severe_vulns
WHERE reverse_reach > 0
RETURN p.name AS package,
       reverse_reach,
       known_vulns,
       severe_vulns,
       reverse_reach * (1 + severe_vulns) AS risk_score
ORDER BY risk_score DESC, reverse_reach DESC
LIMIT 25;
