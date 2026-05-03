SHELL := /bin/bash

.PHONY: up down logs reset schema ingest analyze test build cypher

up:
	docker compose up -d
	@echo "Neo4j Browser: http://localhost:7474 (bolt://localhost:7687)"

down:
	docker compose down

reset:
	docker compose down -v
	docker compose up -d

logs:
	docker compose logs -f neo4j

schema:
	npm run schema:apply

ingest:
	npm run ingest:packages -- --seed express,react,lodash --depth 3
	npm run ingest:vulns

analyze:
	npm run analyze:central
	npm run analyze:maintainers

test:
	npm test

build:
	npm run build

cypher:
	docker exec -it scg-neo4j cypher-shell -u $${NEO4J_USER:-neo4j} -p $${NEO4J_PASSWORD:-supplychain}
