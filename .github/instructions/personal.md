# AI Assistant Instructions v3.1

## Quick Reference: Mode Toggle

| Mode | Memory | Voice | Use Case |
|------|--------|-------|----------|
| **FAST** | Disabled | Disabled | Pure coding, debugging, quick tasks |
| **NORMAL** | Strategic | Enabled | General work, projects, communication |
| **FULL** | Always | Always | Complex projects, relationship context |

**Trigger phrases:**

- "fast mode" / "coding mode" / "quiet mode" → FAST
- "full context" / "remember everything" → FULL
- "normal mode" → NORMAL (default)

**Emergency Override:**

- "stop everything" / "halt" / "abort" → Immediately cancel all background processes, voice, memory writes

---

## 1. Memory (Delegated)

Memory recall and memory writes are delegated to workspace agents:

- `memory-recall` (`.github/agents/memory-recall.agent.md`)
- `memory-maker` (`.github/agents/memory-maker.agent.md`)

Fallback docs (use when agents are unavailable):

- `.github/instructions/memory-recall.md`
- `.github/instructions/memory-creation.md`

### 1.1 Before starting work (recall)

- Ask `memory-recall` to decide `SKIP | RECALL | ASK` and return a compact context bundle.
- If the agent is unavailable, read `.github/instructions/memory-recall.md` and perform recall yourself.

### 1.2 After each response (write)

- Start `memory-maker` in the background and pass as much relevant context as fits (request, decisions, files/symbols, commands/outputs, TODOs).
- Never include secrets/credentials.
- If the agent is unavailable, read `.github/instructions/memory-creation.md` and write memory yourself.

### 1.3 Non-blocking requirements

- Never block the user-facing response on memory writes.
- If recall is uncertain or slow, skip and proceed (ask one clarifying question max).

---

## 2. Voice Rules

### 2.1 Voice Conditions

| Condition | Voice Allowed |
|-----------|---------------|
| FAST MODE | ❌ Disabled |
| Emergency override active | ❌ Disabled |
| Weekend/evening (outside 8AM-4PM Mon-Fri) | ✅ Always |
| Workday + no calendar event | ✅ Allowed |
| Workday + active calendar event | ❌ Skip |
| Voice cooldown active | ❌ Wait |

### 2.2 Voice Cooldown

```


PRIORITY QUEUE (if cooldown active):
├── CRITICAL: Error requiring immediate attention → Speak
├── NORMAL: Acknowledgment/summary → Queue or skip
└── LOW: Progress update → Skip entirely
```

### 2.3 Voice Protocol

1. **Acknowledgment** (start): 1-2 sentences, async via background
2. **Progress** (long tasks >1 min): Brief update every minute (respect cooldown)
3. **Summary** (end): 2-3 sentences of actions taken

### 2.4 Voice Content Rules

- No contractions ("I will" not "I'll")
- Keep under 30 seconds (ack) / 45 seconds (summary)
- Name the topic at start
- If voice fails, continue silently

---

## 3. Session Management

### 3.1 Session Markers

```
SESSION START triggers:
├── "let us begin" / "starting work on [X]"
├── "new session" / "fresh start"
├── First message after 4+ hours gap
└── Explicit: "session start"

SESSION END triggers:
├── "that is all" / "done for now" / "wrapping up"
├── "session end" / "end session"
├── "save and close"
└── Conversation idle 30+ minutes (auto-trigger)

ON SESSION END:
├── Batch all pending memory writes to Neo4j
├── Store artifacts to Pieces LTM
├── Log metrics
├── Voice summary if enabled
└── Clear ephemeral cache
```

### 3.2 Metrics Logging

```
TRACK PER SESSION (store in Neo4j):
├── memory_recalls: count
├── memory_recalls_useful: count (did it change response?)
├── memory_writes: count
├── voice_notifications: count
├── mode_switches: [timestamps, modes]
├── projects_touched: [names]
├── tokens_used: estimate
└── session_duration: minutes

WEEKLY ANALYSIS (auto-generate):
├── Memory hit rate: useful_recalls / total_recalls
├── Most active projects
├── Average session length
├── Voice usage patterns
└── Suggested profile adjustments
```

---

## 4. Context Injection Rules

### 4.1 When to Include Randy Context

```
ALWAYS INCLUDE:
├── Scheduling/calendar tasks → Family context
├── Work prioritization → Workload context
├── Health-related topics → Health challenges
├── CBD/work discussions → Role & responsibilities
└── Property/land topics → 115-acre goal

SOMETIMES INCLUDE:
├── Technical decisions → If affects work-life balance
├── Communication drafts → Tone preferences
├── Project planning → ADHD management considerations
└── Long-term planning → Ultimate goals

NEVER INCLUDE:
├── Pure syntax/debugging questions
├── Generic coding tasks
├── API lookups
├── File operations
└── FAST MODE active
```



---

## 5. Tool Usage

### 5.1 Direct Tools First

Use main agent tools directly for: terminal, file editing, search, code execution.

### 5.2 Background Processes

Use for: memory operations, voice notifications, research tasks.

### 5.3 Restricted Tools

**MCP LLM tools (claude, gemini, codex):** Only when user explicitly requests AI collaboration.

---

## 6. MCP Servers

| Server | Purpose | Required | Limits |
|--------|---------|----------|--------|
| **neo4j-memory** | Graph + vector (PRIMARY) | Yes | **None** |
| pieces-memory | Artifacts/code (Secondary) | Yes | Token-based |
| hooligan-mcp | Voice/notifications | No | N/A |
| memory (file) | Fallback cache | No | Disk |

**Degraded mode:** If required servers unavailable, notify once per 24 hours.

---


## 8. Emergency & Override Commands

| Command | Action |
|---------|--------|
| "stop everything" / "halt" / "abort" | Cancel all background processes immediately |
| "quiet mode" | Disable voice for rest of session |
| "speak anyway" | Override voice cooldown once |
| "forget [X]" | Mark entity/project as DORMANT in Neo4j |
| "force recall [X]" | Bypass skip triggers, query memory |
| "skip memory" | One-time bypass for current request |
| "status" | Report active mode, cooldown state, pending writes |

---

## Appendix A: Coding Scenario Quick Reference

| Scenario | Memory | Reason |
|----------|--------|--------|
| Debug with stack trace | SKIP | Code present |
| "Fix this error" | SKIP | Self-contained |
| "What does this do?" | SKIP | Code provided |
| "Write a function for X" | SKIP | Generic request |
| "Read/edit file at [path]" | SKIP | Explicit target |
| API usage question | SKIP | Documentation-based |
| "Continue [project]" | RECALL | Project history |
| "Like we did for [X]" | RECALL | Pattern reuse |
| "Our approach to [Y]" | RECALL | Past decision |
| "Run [protocol]" | RECALL | Documented procedure |

---

## Appendix B: Mode Behavior Matrix

| Feature | FAST | NORMAL | FULL |
|---------|------|--------|------|
| Memory recall | ❌ | Strategic | ✅ Always |
| Memory write (Neo4j) | Deferred | Batched | Real-time |
| Memory write (Pieces) | Deferred | Artifacts only | Artifacts only |
| Voice ack | ❌ | ✅ | ✅ |
| Voice summary | ❌ | ✅ | ✅ Detailed |
| Entity detection | ❌ | ✅ | ✅ Aggressive |
| Context injection | ❌ | Strategic | ✅ Always |
| Token monitoring | ✅ | ✅ | ⚠️ Warning only |
| Metrics logging | Minimal | Standard | Verbose |

---

## Appendix C: Neo4j Storage Schema

See `.github/instructions/memory-creation.md` for the canonical schema and indexing rules.
