# Memory Recall Instructions

These rules govern **when** to recall memory and **what** to retrieve for the current task.

If the `memory-recall` agent is available, delegate recall to it. If not, follow this document directly.

Related:
- Agent: `.github/agents/memory-recall.agent.md`
- Memory creation: `.github/instructions/memory-creation.md`

---

## Modes

| Mode | Memory Recall | Notes |
|------|--------------|-------|
| **FAST** | Disabled | Do not query memory. Use only current context. |
| **NORMAL** | Strategic | Recall only when clear triggers match. |
| **FULL** | Default | Recall unless a hard skip trigger applies. |

### Mode triggers (user phrases)
- “fast mode” / “coding mode” / “quiet mode” → FAST
- “full context” / “remember everything” → FULL
- “normal mode” → NORMAL (default)

---

## Token Budget Awareness (conversation window only)

Neo4j storage is unlimited; these limits apply only to how much can fit in the current conversation context.

Auto-mode guidance:
- Conversation < 30k tokens → NORMAL
- Conversation 30k–60k tokens → warn and suggest FAST
- Conversation > 60k tokens → switch to FAST to avoid context bloat

---

## Memory Decay Tiers (recall priority)

Use decay tiers to decide what to surface automatically:
- **ACTIVE (0–14 days):** always eligible for recall
- **RECENT (15–30 days):** recall when the project is mentioned
- **ARCHIVE (31–90 days):** recall only when explicitly referenced
- **DORMANT (90+ days):** exclude from auto-recall; manual only

Demotion triggers (examples):
- Project not mentioned in 30 days → demote toward ARCHIVE
- Entity not referenced in 60 days → reduce priority
- Contradicted information → flag; do not auto-surface

Note: dormant data remains stored; it is just excluded from automatic recall.

---

## Smart Detection Checklist

Before recalling memory, answer:
1. Is the task self-contained (code/error/stack trace provided)? → **SKIP**
2. Did the user provide an explicit file path or exact content to modify? → **SKIP**
3. Is the user referencing past work/decisions/protocols/patterns? → **RECALL**
4. Would recall save more time than asking one clarifying question? → **RECALL**
5. When in doubt → **SKIP** and proceed

---

## Observable Triggers

### Always recall (unless hard skip)
- “continue [project]” / “resume [work]”
- “like before” / “like we did” / “same approach”
- “run [protocol]”
- “what did we decide” / “our approach/pattern/method”
- Project name mentioned and the project profile says `memory: ALWAYS`
- User requests “full context” / “remember everything”

### Hard skip (do not recall)
- FAST mode is active
- A code block is present
- An error/stack trace is present
- “fix/debug this”, “explain this code”, “what does this do”, or equivalent
- Explicit file path provided (direct file task)
- Generic API/syntax/documentation question

### Ask before recalling (or skip)
- Unclear which project/repo is in scope
- User references “our approach” but does not name a topic or project

Default: **skip** and proceed.

---

## Project Profiles (memory behavior)

Use project profiles to decide default recall behavior:

```yaml
hooligan-mcp:
  memory: ALWAYS
  context: [mcp-development, nodejs, tool-patterns]

bioland:
  memory: ALWAYS
  context: [drupal, nuxt, cbd-infrastructure, docker]

email-protocol:
  memory: ALWAYS
  context: [automation, hooligan-mcp-mail]
  file: /Users/randyhoulahan/Library/Mobile Documents/com~apple~CloudDocs/ai-projects/ai-assistants/email/cleaning/email-cleaning-protocal.md

quick-scripts:
  memory: NEVER

land-rover:
  memory: ON_REQUEST
  context: [vehicle, def-dpf, maintenance]

gold-panning:
  memory: ON_REQUEST
  context: [hobby, property]

DEFAULT:
  memory: STRATEGIC
```

---

## Repo Auto-Detection (project inference)

When the user does not explicitly name the project:
- If working in a git repo, infer from repo name and/or remote origin.
- Use `package.json` name field (or similar project marker) as a strong hint.
- Map inferred project → project profile; otherwise use DEFAULT.
- If you still cannot confidently infer scope, ask one question.

---

## What to Retrieve (keep it small and actionable)

Aim for a compact bundle (5–12 bullets total):
- Project identity + relevant constraints
- Recent decisions and rationale
- Known issues/gotchas
- Likely files/areas to inspect
- Relevant symbols (functions/classes/components)
- Dependency chain (callers/callees, imports)
- Test locations and validation steps

If memory is unavailable or not useful, say so explicitly and proceed without it.

---

## Codebase Context Retrieval Patterns

### When working on a function
Retrieve:
1. The function (name, signature, location)
2. The containing file
3. Direct dependencies (imports)
4. Callers (where it is used)
5. Related tests
6. Recent notes/decisions and known issues

### When working on a feature area
Retrieve:
1. Main entry points for the feature
2. Key files and key symbols
3. Configuration files involved
4. Tests and known gaps
5. Prior decisions and known issues

### When debugging
Retrieve:
1. Likely files and symbols related to the error area
2. Error handling paths
3. Related configuration
4. Prior similar issues and fixes (if any)

---

## Context Retrieval Checklist (before coding work)

If the project is known:
- Project exists in memory?
  - Yes: load project metadata
  - No: register project (or proceed without memory if in FAST / skip triggers)
- Working on a specific function?
  - Yes: load function + file + dependencies + tests
- Working on a feature area?
  - Yes: load related files and key functions
- Debugging?
  - If not self-contained: load error-related code + config + past issues

Present a compact context summary:
- Files involved
- Key functions/symbols
- Dependencies
- Test locations
- Recent decisions
- Known issues

---

## Output Contract (for recall summaries)

Use this format:

```markdown
## Memory Recall

**Recall Decision:** SKIP | RECALL | ASK
**Mode:** FAST | NORMAL | FULL
**Why:** [observable trigger(s), or why it was skipped]

### Context Summary
- [bullets...]

### Likely Files / Areas
- `path/to/file`

### Relevant Symbols
- `functionName`, `ClassName.method`

### Tests / Validation
- `tests/...`

### Questions (if needed)
1. [single question]
```

---

## Troubleshooting: `search_memories` / `read_graph` Validation Errors

If `search_memories` or `read_graph` returns:
```
Error: 1 validation error for Entity
type
  String should match pattern '^[A-Za-z_][A-Za-z0-9_]*$'
```

This means the graph contains **at least one entity whose `type` field has spaces or special characters** (e.g. `"Technical Issue"`, `"file system"`, `"Vehicle/Equipment"`). A single bad entity poisons **all** graph-wide queries until fixed.

**Immediate action:**
1. Do NOT retry `search_memories` or `read_graph` — they will keep failing.
2. Use `find_memories_by_name` with specific known entity names — it still works for individual lookups.
3. Fix bad entities via direct Cypher (see the fix script in `memory-creation.md` → "Fixing invalid-type entities" section).
4. After fixing, both tools work again immediately — no restart needed.

**Prevention:** always use `snake_case` for entity `type`. See `memory-creation.md` for the full type constraint and correct tool call shapes.

---

## If the `memory-recall` agent is unavailable

1. Read this file and apply the rules above.
2. If recall is warranted and Neo4j is available, query Neo4j memory directly.
3. If Neo4j is unavailable, proceed without memory and ask one clarifying question if needed.
