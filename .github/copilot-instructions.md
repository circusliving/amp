# GitHub Copilot Repo Instructions
## 🔒 CRITICAL SECURITY RULE

**NEVER display passwords, secrets, API keys, or credentials in chat responses. Never delete files uncommited without stashing them first **

- Reference them as "from .env" or "environment variable" only
- Never copy/paste actual password values  
- Never display them in code examples or command outputs
- If user needs password, tell them to check .env file directly
- This applies to ALL contexts: chat, code, documentation, handoff notes
- you should not read .env file contents directly, only reference them as needed for code generation or instructions

---

## Instruction Precedence (Highest → Lowest)

| Priority | File | Governs |
|----------|------|---------|
| 1 | `personal.md` | Memory, voice, user context, communication style |
| 2 | `default.instructions.md` | Code standards, naming, tools, architecture |
| 3 | `copilot-instructions.md` | Project overview, domain context |

**Conflict Resolution:**
- When instructions conflict, **higher priority wins**
- If same priority level, **more specific rule wins** over general rule
- If still ambiguous, **ask user** before proceeding
- Never silently ignore a conflict—flag it in your response

## Important!
- Follow memory rules from `.github/instructions/personal.md` for every response
- Follow code standards from `.github/instructions/default.instructions.md` as canonical source

This repository uses for Nuxt.js, Vue 3, TypeScript, and Node.js. Copilot should adhere to these rules and the project anchor.

Key rules for Copilot:
- if this exists follow these memory rules every questions `.github/instructions/memory.md`
- if it exists the default guidance at `.github/instructions/default.instructions.md` is the canonical source of instructions.
- Prefer small, reviewable diffs and keep public APIs stable.
- Follow Nuxt conventions (Vue 3 `<script setup lang="ts">`, kebab-case filenames, semicolons).
- Add/maintain minimal tests (Vitest for unit, Playwright for e2e) when changing public behavior.
- Use pnpm scripts and strict TypeScript settings.
- Ground planning in `.github/requirements/index.md` (Purpose, Scope, Users, Functional/NFRs) otherwise provided in context if it exists, otherwise create it.
- Use shared utilities/composables placement rules described in the default instructions.
- ensure all dependancies and dev dependancies have no ^ in package.json
- ensure all package versions are pinned (no ^ or ~)
- use [<NuxtTime>](https://nuxt.com/docs/4.x/api/components/nuxt-time) for display and  luxon for any date conversions or manipulations
- document any architectural decisions or trade-offs made during development
- always use the runtime config for any environment variables from nuxtjs https://nuxt.com/docs/4.x/guide/going-further/runtime-config
- ensure all new code is covered by unit tests where applicable
- ensure all new code is covered by e2e tests where applicable
- ensure all tests pass before suggesting code changes
- ensure all code is formatted with prettier and linted before suggesting code changes
- ensure all new code is accessible and follows WCAG guidelines
- ensure all new code is optimized for performance, is secure, maintainable, scailable and follows best practices
- Always use useFetch instead of fetch for HTTP requests in Nuxt applications or useLazyFetch for lazy loading data where appropriate.  Use $fetch on the server.
- always use https://vue-multiselect.js.org  for select inputs.
- always use NuxtLink for <a> links within nuxtjs applications, except where the component will be exported alone out of nuxtjs.
- always follow nuxtjs4 directory structure.  https://nuxt.com/docs/4.x/guide/directory-structure


Memory & voice workflow (for Copilot Chat in VS Code):

- Start responses with "Remembering..." and consult any memory mcps installed.

If both `.github/copilot-instructions.md` and `.github/instructions/default.instructions.md` exist, treat the latter as the canonical source. This file is a short summary for Copilot context injection.


## Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately – don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One tack per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes – don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests – then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.