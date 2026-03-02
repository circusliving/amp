# Phase 02: Page-by-Page Visual Audit

## Purpose

Systematically compare every page on the live site vs local dev, capturing screenshots and documenting every visual, functional, and content discrepancy. This is the primary issue-finding phase.

## Shared Context

- All tasks in this phase follow the same methodology:
  1. Navigate Playwright to live URL → take full-page screenshot
  2. Navigate Playwright to local URL → take full-page screenshot
  3. Compare visually: hero image, layout, typography, spacing, colors, icons, images, cards, links
  4. Check browser console for errors/warnings
  5. Check network tab for failed requests (4xx, 5xx)
  6. Document each discrepancy as a numbered issue in the task output
- Issue numbering continues sequentially across all tasks (do NOT restart at 1)
- Screenshots are saved to `.github/planning/nuxt4-migration-issues/temp/screenshots/`
- Use Playwright MCP (`mcp_playwright_*`) or Chrome DevTools MCP (`mcp_chrome-devtoo_*`)

## Issue Documentation Format

Each issue MUST include:

```markdown
### Issue #NN: [Short Title]

- **Page:** /path/to/page
- **Severity:** critical | major | minor | cosmetic
- **Category:** layout | content | image | icon | navigation | typography | color | spacing | animation | functionality | console-error | network-error | seo
- **Live behavior:** [What the live site shows]
- **Local behavior:** [What the local site shows]
- **Likely root cause:** [Component or file involved, if known]
- **Screenshot:** [filename or "see task screenshots"]
```

## Key Files

| File | Purpose |
|------|---------|
| `app/pages/index.vue` | Homepage |
| `app/pages/[section]/[page].vue` | Section pages (e.g., /side-shows/cabinet-of-curiosities) |
| `app/pages/articles/[id].vue` | Article detail pages |
| `app/pages/galleries/[id].vue` | Gallery pages |
| `app/pages/image-objects/[id].vue` | Image object detail pages |
| `app/error.vue` | Error page |
| `app/layouts/default.vue` | Default layout (header, sidebar, footer) |

## Constraints

- Do NOT fix issues — only document them
- Take screenshots for evidence where possible
- Every discrepancy is an issue, no matter how small
- Check interactive elements: links, hover states, menu open/close, scroll behavior
- Test at desktop viewport (1280×800) as baseline; responsive is Phase 03
