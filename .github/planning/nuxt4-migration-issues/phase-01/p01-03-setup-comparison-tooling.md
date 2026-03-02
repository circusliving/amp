# Task: Set Up Comparison Tooling

**ID:** p01-03
**Status:** pending
**Depends on:** p01-01
**Context size:** small

## Goal

Establish a repeatable methodology for comparing live vs local pages using available MCP tools (Playwright and/or Chrome DevTools).

## Inputs

- Phase context: `phase-01/context.md`
- Available MCP tools: `mcp_playwright_*`, `mcp_chrome-devtoo_*`

## Steps

1. **Verify Playwright MCP** is available and can:
   - Navigate to a URL (`mcp_playwright_browser_navigate`)
   - Take screenshots (`mcp_playwright_browser_take_screenshot`)
   - Take accessibility snapshots (`mcp_playwright_browser_snapshot`)
   - Read console messages (`mcp_playwright_browser_console_messages`)
   - Read network requests (`mcp_playwright_browser_network_requests`)
   - Click elements (`mcp_playwright_browser_click`)
   - Resize viewport (`mcp_playwright_browser_resize`)

2. **Verify Chrome DevTools MCP** is available and can:
   - Navigate pages (`mcp_chrome-devtoo_navigate_page`)
   - Take screenshots (`mcp_chrome-devtoo_take_screenshot`)
   - List console messages (`mcp_chrome-devtoo_list_console_messages`)
   - List network requests (`mcp_chrome-devtoo_list_network_requests`)
   - Emulate devices (`mcp_chrome-devtoo_emulate`)

3. **Define the comparison checklist** used for every page:
   - [ ] Full-page screenshot at 1280×800 (live)
   - [ ] Full-page screenshot at 1280×800 (local)
   - [ ] Hero image: present? correct src? correct dimensions?
   - [ ] Page title text matches
   - [ ] Navigation links present and correct
   - [ ] Body content rendered (not empty/blank)
   - [ ] Images load (no broken images)
   - [ ] Icons render (not empty squares)
   - [ ] Cards/lists populated with content
   - [ ] Footer present with correct content
   - [ ] Console: no errors or warnings
   - [ ] Network: no failed requests (4xx/5xx)
   - [ ] Links: all internal links resolve
   - [ ] Typography: fonts, sizes, weights match
   - [ ] Colors: backgrounds, text, accents match
   - [ ] Spacing: margins, padding, gaps match
   - [ ] Animations/transitions: present and correct

4. **Create screenshot directory**: `temp/screenshots/`

5. **Document the methodology** so all Phase 02 tasks follow the same process

## Outputs

- Confirmed MCP tool availability
- Comparison checklist (embedded in this task for reference)
- `temp/screenshots/` directory created
- Methodology documentation for Phase 02 agents

## Done When

- [ ] MCP tools verified working
- [ ] Comparison checklist finalized
- [ ] Screenshot directory created
- [ ] Methodology documented

## Handoff

Next: `phase-02/p02-01-audit-homepage.md`
State: Comparison methodology is defined in this task file — Phase 02 tasks reference it
