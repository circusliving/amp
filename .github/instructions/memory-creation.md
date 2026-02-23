# Memory Creation Instructions

These rules govern **what** to store in memory and **when/how** to write it.

If the `memory-maker` agent is available, delegate memory writes to it (in the background). If not, follow this document directly.

Related:
- Agent: `.github/agents/memory-maker.agent.md`
- Memory recall: `.github/instructions/memory-recall.md`

---

## Storage Priority

1. **Neo4j (PRIMARY)**: entities, relationships, observations, decisions, session summaries (no storage limits)
2. **Artifact store (SECONDARY, if available)**: large code/text artifacts; reference from Neo4j
3. **File-based fallback**: only if primary systems are unavailable

---

## Memory Decay Rules (storage vs recall)

Decay affects **automatic recall**, not whether data remains stored.

Priority tiers (recommended):
- **ACTIVE (0–14 days)**
- **RECENT (15–30 days)**
- **ARCHIVE (31–90 days)**
- **DORMANT (90+ days)** (manual recall only)

Decay triggers (examples):
- Project not mentioned in 30 days → demote toward ARCHIVE
- Entity not referenced in 60 days → reduce priority
- Contradicted information → flag for review
- User says “forget [X]” → mark DORMANT

Note: dormant data remains in Neo4j indefinitely; it is just excluded from auto-recall.

---

## Safety: What NOT to Store

Never store:
- Passwords, tokens, API keys, private keys, credentials
- Secrets in configs/logs
- Unneeded personal data

If uncertain, ask the user before storing.

---

## When to Write Memory

### Write immediately only when
- The user explicitly requests it (“remember this”, “save this”, “for future reference”, “capture this decision”)
- A high-impact decision/constraint will be needed later in the same session

### Otherwise
- **Never block** active work waiting on memory writes
- Prefer **batching** at session end (NORMAL/FULL)
- In **FAST** mode, defer all writes unless explicitly requested

---

## What to Store (high leverage only)

### Entities (create when 2+ criteria met)
Create an entity when at least two are true:
- Stable identifier (project name, person/org name, protocol name)
- Role/purpose matters
- Likely referenced again
- Anchors multiple observations/relationships

### Observations (atomic facts)
Store an observation when it is:
- Specific and testable
- Actionable
- Non-duplicative (merge if already present)

Examples:
- Good: “Decision: Neo4j is primary memory; artifacts are secondary; date: 2025-12-15; source: personal instructions”
- Bad: “We improved memory a lot”

### Relationships (create when it improves retrieval)
Use consistent, descriptive relationship types, for example:
- `WORKS_ON`, `OWNS`, `CONTRIBUTES_TO`
- `DECIDED`, `REFERENCED`, `RELATED_TO`
- `DEPENDS_ON`, `IMPORTS`, `CALLS`, `TESTS`

If metadata is needed (date, rationale, status), store it as an observation instead of encoding it into the relationship.

### Artifacts (when deciding to store large content)
Treat something as an artifact worth storing/referencing when it took more than ~5 minutes to create or will be reused.

---

## Entity Detection (automatic, when memory is active)

When memory is active (not FAST mode), auto-create entities and observations from:
- Email participants
- Calendar attendees
- Message contacts
- People mentioned in content

Keep this minimal and non-sensitive (names/roles/relationships only when relevant).

---

## Deduplication and Merge

Before writing:
1. Search for an existing entity by exact name and close variants.
2. If found, append observations instead of creating duplicates.
3. Prefer a canonical name and consolidate observations there.
4. If duplicates already exist and you cannot merge/delete programmatically, mark non-canonical entities with an observation like “DUPLICATE of: [canonical name]” and stop writing to them.

---

## Neo4j Storage Schema (baseline)

Recommended baseline entities:
- **Person**: name, role, org, email, observations[]
- **Project**: name, status, priority_tier, last_touched, observations[]
- **Organization**: name, type, observations[]
- **Decision**: date, context, outcome, project_ref, observations[]
- **Session**: id, date, duration, metrics{}

Common relationships:
- `WORKS_WITH`, `REPORTS_TO`, `FAMILY_OF`
- `WORKS_ON`, `OWNS`, `CONTRIBUTES_TO`
- `DECIDED`, `REFERENCED`, `MENTIONED`
- `RELATED_TO` (generic; keep a `type` observation if needed)

Observations should be timestamped facts with source attribution when possible.

---

## Codebase & Project Memory (Indexing Model)

This section defines how to represent projects/codebases so function- and feature-level context can be recalled quickly.

### Project Registration (Neo4j)

**Project entity fields (recommended):**
- `name` (unique)
- `path` (absolute root)
- `type` (nodejs, drupal, nuxt, python, docker, other)
- `stack[]`
- `repo_url` (from git remote)
- `last_indexed`, `last_touched`
- `priority_tier` (ACTIVE/RECENT/ARCHIVE/DORMANT)
- `entry_points[]`
- `config_files[]`
- `observations[]`

**Auto-register projects when:**
- First time working in a directory with `package.json` / `composer.json` / `pyproject.toml`
- A git repo is detected and worked on for >10 minutes
- The user explicitly names a project
- Multiple files are edited in the same directory tree
- Docker/config files indicate a project structure

**Project type detection (examples):**
- Node.js: `package.json`
- Drupal: `composer.json` with `drupal/core`
- Nuxt: `nuxt.config.ts|js`
- Docker: `Dockerfile` / `docker-compose.yml`

### File Indexing (Neo4j)

**File entity fields (recommended):**
- `path` (relative), `absolute_path`
- `type` (source/config/test/doc/asset/other), `language`
- `exports[]`
- Relationships: `IMPORTS` / `IMPORTED_BY`
- `last_modified`, `last_indexed`, `size_lines`, `complexity`
- `observations[]`

**Always index:**
- Entry points (`app.vue`, `main.ts`, `index.js`)
- Config (`package.json`, `tsconfig.json`, `nuxt.config.*`, `composer.json`)
- Source folders (`app/`, `server/`, `src/`, custom modules/themes)
- Tests (`tests/`, `__tests__/`, `*.spec.*`, `*.test.*`)
- Docs (`README`, `docs/`, root `*.md`)
- Deploy (`Dockerfile`, `docker-compose`, `k8s/`)

**Skip indexing:**
- `node_modules/`, `vendor/`, `.git/`
- `dist/`, `build/`, `.output/`
- caches, logs, generated files, large binaries

**Index depth:**
- Level 1 (structure): exists/type/metadata
- Level 2 (exports): exports/imports/purpose summary
- Level 3 (active work): related tests + key TODOs/FIXMEs + minimal git context

### Function & Component Indexing (Neo4j)

**Function entity fields (recommended):**
- `name`, `type` (function/method/class/component/hook/api-route)
- `signature`, `description`
- `line_start`, `line_end`
- Relationships: `DEFINED_IN` (file), `CALLS` / `CALLED_BY`
- `dependencies[]`, `complexity`, `last_modified`
- `observations[]`, `tags[]`

**Index as functions:**
- Named exports, default exports (when describable)
- Class methods (public + significant private)
- Vue components/composables/hooks
- API route handlers
- Drupal hooks/callbacks

Skip:
- Anonymous callbacks unless significant
- Generated code
- trivial getters/setters

### Import Tracking (Dependency Graph)

Represent:
- `File -[:IMPORTS { import_type, imported_names, line_number }]-> File`
- `Function -[:CALLS]-> Function`
- `File -[:TESTS]-> File` (test-to-source links)

---

## Auto-Discovery Paths (project detection hints)

Watch for new projects under:
- `~/projects/`
- `~/code/`
- `~/dev/`
- `~/work/`
- Any path the user works in repeatedly

---

## Pre-Write Checklist (quick)

Before writing, confirm:
1. The content is non-sensitive.
2. It is specific and likely to be reused.
3. Dedupe search is done.
4. Entity names are stable/unambiguous.
5. Observations are atomic facts.
6. Relationships add retrieval value.
7. Timing is correct (immediate vs batched vs deferred).

---

## Background Requirement (preferred)

When possible, run memory writes in the background and never block the user-facing response.

When delegating to `memory-maker`, pass as much relevant context as fits:
- User request + acceptance criteria
- Summary of what changed and why
- Files touched and key symbols
- Commands run and important outputs/errors
- Decisions made and tradeoffs
- TODOs/unresolved items

---

## Neo4j Memory Tool API Reference

**Package:** `mcp-neo4j-memory@0.4.5` (pinned in `~/Library/Application Support/Code/User/mcp.json`)
**Tested:** 2026-02-23

### CRITICAL: Entity `type` constraint

The `type` field on all entities **MUST** match `^[A-Za-z_][A-Za-z0-9_]*$`:
- ✅ Valid: `project`, `person`, `Technical_Issue`, `file_system`
- ❌ Invalid: `"Technical Issue"`, `"file system"`, `"Documentation Project"`, `"Vehicle/Equipment"`

**Why it matters:** A single entity with an invalid type **poisons all queries globally**. `search_memories` and `read_graph` will return a Pydantic validation error for every call until the bad entity is fixed — regardless of whether that entity was directly requested. This is a known bug in `mcp-neo4j-memory` ≤ 0.4.5.

**Rule:** always use `snake_case` for entity types. Never use spaces, slashes, hyphens, or other special characters.

### Correct tool call shapes (verified 2026-02-23)

#### `create_entities`
```json
{
  "entities": [
    { "name": "my_entity", "type": "project", "observations": ["fact 1", "fact 2"] }
  ]
}
```

#### `add_observations`
```json
{
  "observations": [
    { "entityName": "my_entity", "observations": ["new fact 1", "new fact 2"] }
  ]
}
```
⚠️ Both outer and inner fields are named `observations` — the outer array items each contain `entityName` + a nested `observations` array.

#### `create_relations`
```json
{
  "relations": [
    { "source": "entity_a", "target": "entity_b", "relationType": "RELATED_TO" }
  ]
}
```
⚠️ Use `source`/`target` — **not** `from_`/`to_` (those will fail with "must have required property 'source'").

#### `find_memories_by_name`
```json
{ "names": ["entity_name_1", "entity_name_2"] }
```
⚠️ `names` is a **required array** — passing a single string returns "must have required property 'names'".

#### `delete_entities`
```json
{ "entityNames": ["entity_one", "entity_two"] }
```

#### `delete_relations`
```json
{
  "relations": [
    { "source": "entity_a", "target": "entity_b", "relationType": "RELATED_TO" }
  ]
}
```

#### `delete_observations`
```json
{
  "deletions": [
    { "entityName": "my_entity", "observations": ["exact observation text to remove"] }
  ]
}
```

### Fixing invalid-type entities (emergency workaround)

When `search_memories` or `read_graph` returns a Pydantic `Entity.type` validation error, run this one-liner to find and fix all bad entities directly via the Neo4j Python driver:

```bash
uvx --from neo4j python3 /path/to/fix_neo4j_types.py
```

Script content:

```python
import re, sys
with open('/Users/randyhoulahan/Library/Application Support/Code/User/mcp.json') as f:
    content = f.read()
start = content.find('"neo4j-memory"')
args = re.findall(r'"([^"]+)"', content[start:start+700])
params = {}
for i, a in enumerate(args):
    if a.startswith('--') and i + 1 < len(args):
        params[a] = args[i + 1]
from neo4j import GraphDatabase
driver = GraphDatabase.driver(params['--db-url'], auth=(params['--username'], params['--password']))
with driver.session(database=params['--database']) as session:
    bad = session.run(
        "MATCH (e) WHERE e.type IS NOT NULL "
        "AND (e.type =~ '.*[^A-Za-z0-9_].*' OR NOT e.type =~ '^[A-Za-z_].*') "
        "RETURN e.name AS name, e.type AS type"
    )
    for r in bad:
        fixed = re.sub(r'[^A-Za-z0-9_]', '_', r['type']).strip('_') or 'unknown'
        session.run("MATCH (e {name: $n}) SET e.type = $t", n=r['name'], t=fixed)
        print(f"Fixed: {r['name']!r} [{r['type']!r}] -> [{fixed!r}]")
driver.close()
```

Delete the script after running (it reads credentials from `mcp.json`).
