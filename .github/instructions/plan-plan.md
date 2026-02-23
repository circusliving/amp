## Agent Task Planning

**Location:** `.github/planning/${$planNameFromUser}/`

### Naming the Plan

If the user does **not** supply `$planNameFromUser`, derive the name automatically:

1. Identify the single main goal or deliverable of the request (one noun-phrase).
2. Kebab-case it, max 4 words. Examples: `nuxt4-migration`, `auth-refactor`, `seo-audit`.
3. Use that as `$planNameFromUser` for all paths below.
4. Record the derived name in `index.md` under **Plan Name**.

### Structure

```
.github/planning/${$planNameFromUser}/
├── index.md              # Overview + current state
├── roadmap.md            # Task order + dependencies
├── checkpoint.md         # Last completed task + resume point
├── temp/                 # All research, scratch files, and scripts (never committed as deliverables)
│   ├── drafting-plan/    # Mini-plan tracking the act of writing this plan
│   │   ├── context.md
│   │   ├── checkpoint.md
│   │   ├── continue.md
│   │   └── d01-research.md, d02-structure.md, ...  (drafting tasks)
│   ├── research/         # Raw notes, API docs, grep outputs, etc.
│   └── scripts/          # One-off helper scripts used during planning
├── phase-01/
│   ├── context.md        # Shared context for all phase-01 tasks
│   ├── p01-01-task-name.md
│   ├── p01-02-task-name.md
│   └── ...
├── phase-02/
│   ├── context.md        # Shared context for all phase-02 tasks
│   ├── p02-01-task-name.md
│   ├── p02-02-task-name.md
│   └── ...
└── ...
```

### Rules

1. **One task per file** - Minimize context, not eliminate it
2. **Phase context is shared** - Load `context.md` once per phase, applies to all tasks within
3. **Tasks can reference external files** - But list them explicitly in Inputs
4. **Checkpoint after each task** - Update checkpoint.md with completion status
5. **Handoff block** - End each task with next task and any state to pass forward
6. **Save all research and temp artifacts to `temp/`** - Any file that is research, a scratch note, a helper script, or intermediate output goes in `temp/` (or a sub-folder). Never leave temp files loose in the plan root.
7. **Auto-name the plan** - If `$planNameFromUser` is not given, derive a kebab-case name from the main goal (see *Naming the Plan* above).
8. **Drafting plan before writing the plan** - Before writing any phase or task files, create and maintain a mini-plan in `temp/drafting-plan/`. Take a drafting checkpoint at least every 3–5 minutes of wall-clock plan-drafting time.
9. If you anticipate a very long response from the agent break it into smaller tasks with clear dependencies.
10. When given the checkpoint file with start or continue, it should be designed in a way so you can continue from the last task without redoing any work, losing context or acquiring new unrelated context.

### Phase Context Template

```markdown
# Phase 01: [Phase Name]

## Purpose

[What this phase accomplishes]

## Shared Context

- [Key concepts the agent needs for all tasks in this phase]
- [Relevant file paths]
- [Decisions already made]

## Key Files

| File | Purpose |
|------|---------|
| `src/example.ts` | [Why this file matters for this phase] |

## Constraints

- [Rules that apply to all tasks in this phase]
```

### Task File Template

```markdown
# Task: [Name]

**ID:** p01-03
**Status:** pending | in-progress | complete
**Depends on:** p01-02 | none
**Context size:** small | medium | large

## Goal

[One sentence]

## Inputs

- Phase context: `phase-01/context.md`
- [External files needed - be explicit]

## Steps

1. ...

## Outputs

- [What this task produces]

## Done When

- [ ] [Acceptance criteria]

## Rollback

- [How to undo if task fails mid-way]

## Handoff

Next: `phase-01/p01-04-task-name.md`
State: [Any context the next task needs beyond phase context]
```

### Checkpoint File Template

```markdown
# Checkpoint

**Current phase:** phase-01
**Last completed:** `phase-01/p01-03-task-name.md`
**Next task:** `phase-01/p01-04-task-name.md`
**Updated:** 2025-01-15T14:30:00Z

## State

- [Key variables or context to carry forward]
- [Decisions made during last task]

## Notes

- [Any issues encountered]
```

### Roadmap Template

```markdown
# Roadmap

## Phase 01: [Phase Name]

**Context:** [phase-01/context.md](phase-01/context.md)

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p01-01 | [Task name](phase-01/p01-01-task.md) | ⬜ pending | none |
| p01-02 | [Task name](phase-01/p01-02-task.md) | ⬜ pending | p01-01 |
| p01-03 | [Task name](phase-01/p01-03-task.md) | ⬜ pending | p01-01 |

## Phase 02: [Phase Name]

**Context:** [phase-02/context.md](phase-02/context.md)
**Requires:** Phase 01 complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p02-01 | [Task name](phase-02/p02-01-task.md) | ⬜ pending | p01-03 |
| p02-02 | [Task name](phase-02/p02-02-task.md) | ⬜ pending | p02-01 |

## Status Legend

- ⬜ pending
- 🔄 in-progress
- ✅ complete
- ❌ blocked
- ⏸️ paused
```

### Drafting Plan

Before writing any phase or task files, bootstrap the drafting plan at `temp/drafting-plan/`. This is a lightweight self-tracking loop for the act of writing the plan itself.

**Drafting Plan Structure:**

```
temp/drafting-plan/
├── context.md      # Goal, constraints, files already scanned
├── checkpoint.md   # Last drafting step completed + timestamp
├── continue.md     # Minimal prompt to resume without re-reading anything
└── d01-research.md, d02-structure.md, d03-phases.md, ...  (one file per drafting step)
```

**Drafting Checkpoint Rule:** Update `temp/drafting-plan/checkpoint.md` and `continue.md` at least every 3–5 minutes of plan-drafting time, or after each drafting task file is completed — whichever comes first.

**Drafting Task File Template:**

```markdown
# Drafting Task: [Name]

**ID:** d01
**Status:** pending | in-progress | complete
**Started:** ISO timestamp
**Completed:** ISO timestamp | —

## Goal

[One sentence]

## Steps

1. ...

## Output

- [Files written or updated]

## Done When

- [ ] [Acceptance criteria]

## Handoff

Next: `d02-structure.md`
State: [What the next drafting task needs to know]
```

**Drafting Checkpoint Template:**

```markdown
# Drafting Checkpoint

**Plan name:** ${$planNameFromUser}
**Last completed drafting task:** d02-structure
**Next drafting task:** d03-phases
**Updated:** ISO timestamp

## State

- [Key decisions made so far]
- [Files already written]
- [Open questions]

## Notes

- [Any blockers or surprises]
```

**`continue.md` Template (pass this to resume the agent):**

```markdown
# Resume: ${$planNameFromUser} Plan Drafting

Load these files (in order) and continue — do NOT re-research anything already in them:

1. `temp/drafting-plan/context.md`
2. `temp/drafting-plan/checkpoint.md`
3. `temp/drafting-plan/[next-drafting-task].md`

Current status: [one sentence summary from checkpoint]
Next action: [exact next step]
```

---

### Context Loading Strategy

```
When agent starts a task:

1. Load checkpoint.md (small, always)
2. Load phase-XX/context.md (once per phase)
3. Load task file (p01-03-task.md)
4. Load explicit inputs listed in task
5. Execute task
6. Update checkpoint.md
7. Proceed to next task (skip step 2 if same phase)
8. Create a continue.md file that can be passed to the agent to continue from last
   checkpoint without redoing any work or losing context or acquiring new unrelated context.
```

### Temp Directory Convention

```
temp/
├── drafting-plan/    # Mini-plan for the act of writing this plan (see above)
├── research/         # Raw notes, grep outputs, API docs, web fetches
└── scripts/          # One-off helper scripts written during planning
```

- **Everything in `temp/` is disposable** - It exists to support plan creation, not as a deliverable.
- **Never reference `temp/` files from phase task files** - Phase tasks should be self-contained.
- **Scripts in `temp/scripts/` should be documented** inline so they can be re-run or understood later.
```
