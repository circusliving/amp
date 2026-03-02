# Task: Audit Console & Network Errors

**ID:** p03-05
**Status:** pending
**Depends on:** p03-04
**Context size:** medium

## Goal

Systematically check every page for JavaScript console errors/warnings and failed network requests on the local site. Console errors from Phase 02 page audits may have been noted individually — this task does a comprehensive sweep.

## Inputs

- Phase context: `phase-03/context.md`
- URL list: `temp/research/url-list.md`
- Issue count from p03-04

## Steps

1. **For every URL in the master URL list**, navigate on local site and collect:
   a. **Console messages:** errors, warnings, unhandled promise rejections
      - Use `mcp_playwright_browser_console_messages` or `mcp_chrome-devtoo_list_console_messages`
      - Record: message text, leve      - Record: message text, leve      - Record: message text, leve      - Record: message text, ltus
      - Use `mcp_playwright_browser_network_requests` or `mcp_chrome-devtoo_list_network_requests`
      - Record: URL, method, status code, response body (truncated)
   c. **Failed resource loads:** images, scripts, stylesheets, fonts returning errors

2. **Categorize errors:**
   - API errors (503 from DatoCMS endpoints)
   - Missing resource errors (404 for images, fonts, etc.)
   - JavaScript runtime errors (undefined properties, type errors)
   - Vue/Nuxt warnings (component registration, prop validation)
   - CORS errors
   - Mixed content warnings (HTTP resources on HTTPS page, or vice versa)

3. **Deduplicate:** If the same error appears on every page (e.g., a global script error), document it once but note it affects all pages.

4. **Check the live site too** for a few pages — does it have console errors? This helps distinguish pre-existing issues from migration-introduced ones.

5. **Check server-side errors:**
   - Run the local dev server and watch terminal output for SSR errors
   - Are there any unhandled exceptions during server-side rendering?

## Outputs

- Complete console error list (deduplicated) with affected pages
- Complete network failure list with affected pages
- Continued issue list
- Categorization of errors by type

## Done When

- [ ] Every URL checked for console errors
- [ ] Every URL checked for network failures
- [ ] Errors deduplicated and categorized
- [ ] Pre-existing vs new errors distinguished
- [ ] SSR errors checked
- [ ] All issues numbered

## Handoff

Next: `phase-03/p03-06-audit-accessibility.md`
State: Issue count + error patterns
