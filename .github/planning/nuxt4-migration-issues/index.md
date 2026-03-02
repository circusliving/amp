# Plan: nuxt4-migration-issues

## Plan Name

`nuxt4-migration-issues`

## Goal

Systematically compare every page of the live site (`https://circusliving.com/`) against the local Nuxt 4 migration (`http://localhost:3000/`) and document **every** visual, functional, content, and technical discrepancy. The issue list should grow past 20 — there is no upper limit. Issues are documented only, not fixed.

## Background

The Nuxt 2 → Nuxt 4 migration (6 phases, 181 tests passing) is functionally complete. The live site runs AMP/Nuxt 2/Vue 2/Vuex on S3 static hosting. The local site runs Nuxt 4/Vue 3/Pinia with SSR. Post-migration, at least 4 visual issues were already identified in `human.md`:

1. Hero image not showing on pages
2. Menu items missing from sidebar
3. Social icons rendering as colored squares instead of SVG icons
4. Latest articles card section missing from homepage

Initial recon uncovered deeper problems: all DatoCMS API endpoints returning 503, the `<ClIcons>` SVG sprite component not mounted anywhere, and cascading empty renders throughout the site.

## Approach

### Phase 01: Prerequisites (3 tasks)
Verify the dev server and APIs are healthy, enumerate every auditable URL, and establish a repeatable comparison methodology using Playwright MCP and Chrome DevTools MCP.

### Phase 02: Page-by-Page Audit (10 tasks)
Audit all 1,347 content items:
- **42 web pages** in 4 batch tasks (~10 pages each): Side Shows, Back Yard + After Shows, Contact + Concessions, Sideshows duplicates
- **222 articles**: 1 detailed sample task (5–10 articles) + 1 programmatic sweep task (all 222)
- **971 image objects**: 1 programmatic sweep task (all 971)
- Gallery pages + Error page: 2 tasks

### Phase 03: Cross-Cutting Audit (7 tasks)
Audit concerns that span all pages — layout shell (header/sidebar/footer), icons & fonts, SEO meta tags, responsive behavior, console & network errors, accessibility — then compile all issues into a master list.

## Constraints

- **Do NOT fix issues** — document only
- **No upper limit** on issue count — find them all
- Use Playwright MCP (`mcp_playwright_*`) and Chrome DevTools MCP (`mcp_chrome-devtoo_*`) for visual comparison
- Issue numbering is sequential across all tasks (never restart at 1)
- Screenshots stored in `temp/screenshots/`
- Final deliverable: `issues.md` in plan root

## Known Issues (from prior recon)

| # | Issue | Root Cause |
|---|-------|-----------|
| 1 | Hero images not showing | API 503 → no coverImage → `v-if="src"` false |
| 2 | Sidebar menu empty | API 503 → `navigationStore.menuItems` empty |
| 3 | Social icons as colored squares | `<ClIcons>` SVG sprite not mounted in app.vue or default.vue |
| 4 | Article cards missing on homepage | API 503 → `latestArticles` empty |
| 5 | All DatoCMS API endpoints 503 | Token may not be reaching runtime config |
| 6 | Section pages show black hero + blank content | Cascading from API 503 |
| 7 | Article detail pages show 503 error page | API 503 for article data |
| 8 | `server/routes/gallaries/` directory misspelled | "gallaries" instead of "galleries" |

## Files

- [roadmap.md](roadmap.md) — Task order and dependencies
- [checkpoint.md](checkpoint.md) — Current progress
- [phase-01/context.md](phase-01/context.md) — Prerequisites phase context
- [phase-02/context.md](phase-02/context.md) — Page audit phase context
- [phase-03/context.md](phase-03/context.md) — Cross-cutting audit phase context
