// maintainerDrift.cypher
//
// Question: "For a given package, did the maintainer set change between
//            consecutive versions?" — a real signal for supply-chain hijack.
//
// We compare each adjacent pair of versions (by publishedAt) and report
// versions where a brand-new maintainer appears.
//
// Parameter: $packageName

MATCH (p:Package {name: $packageName})-[:HAS_VERSION]->(v:Version)
WITH v ORDER BY v.publishedAt ASC
WITH collect(v) AS versions
UNWIND range(1, size(versions) - 1) AS i
WITH versions[i - 1] AS prev, versions[i] AS curr
MATCH (prev)-[:MAINTAINED_BY]->(prevM:Maintainer)
WITH curr, prev, collect(DISTINCT prevM.username) AS prev_maintainers
MATCH (curr)-[:MAINTAINED_BY]->(currM:Maintainer)
WITH curr, prev, prev_maintainers, collect(DISTINCT currM.username) AS curr_maintainers
WITH curr,
     prev.version AS prev_version,
     curr.version AS curr_version,
     [u IN curr_maintainers WHERE NOT u IN prev_maintainers] AS newcomers,
     [u IN prev_maintainers WHERE NOT u IN curr_maintainers] AS departed
WHERE size(newcomers) > 0 OR size(departed) > 0
RETURN prev_version, curr_version, curr.publishedAt AS at, newcomers, departed
ORDER BY at ASC;
