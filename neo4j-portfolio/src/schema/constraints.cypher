// Schema: constraints + indexes.
// Apply BEFORE any ingestion — uniqueness constraints make MERGE both correct and fast.

CREATE CONSTRAINT package_name_unique IF NOT EXISTS
FOR (p:Package) REQUIRE p.name IS UNIQUE;

CREATE CONSTRAINT version_id_unique IF NOT EXISTS
FOR (v:Version) REQUIRE v.id IS UNIQUE;

CREATE CONSTRAINT maintainer_username_unique IF NOT EXISTS
FOR (m:Maintainer) REQUIRE m.username IS UNIQUE;

CREATE CONSTRAINT vulnerability_id_unique IF NOT EXISTS
FOR (v:Vulnerability) REQUIRE v.id IS UNIQUE;

CREATE CONSTRAINT advisory_id_unique IF NOT EXISTS
FOR (a:Advisory) REQUIRE a.id IS UNIQUE;

// Search indexes — used for ad-hoc queries / analysis.
CREATE INDEX version_name IF NOT EXISTS FOR (v:Version) ON (v.name);
CREATE INDEX version_published_at IF NOT EXISTS FOR (v:Version) ON (v.publishedAt);
CREATE INDEX vulnerability_severity IF NOT EXISTS FOR (v:Vulnerability) ON (v.severity);
