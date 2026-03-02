# Phase 03: Cross-Cutting Audits & Final Compilation

## Purpose

Audit concerns that span all pages — layout shell, icons/fonts, SEO meta, responsive behavior, console/network errors, accessibility — then compile every issue into a single master list.

## Shared Context

- These tasks examine behavior across ALL pages, not one page at a time
- Issue numbering continues from Phase 02 (do NOT restart)
- The final task (p03-07) merges all issues from Phase 02 and Phase 03 into a single numbered list
- The master issue list is written to `.github/planning/nuxt4-migration-issues/issues.md`

## Key Files

| File | Purpose |
|------|---------|
| `app/layouts/default.vue` | Layout shell — header, sidebar, footer |
| `app/components/header-bar.vue` | Site header |
| `app/components/footer-bar.vue` | Site footer |
| `app/components/side-bar.vue` | Sidebar drawer controller |
| `app/components/side-menu.vue` | Menu links in sidebar |
| `app/components/social-bar.vue` | Social media icon links |
| `app/components/cl-icons.vue` | SVG sprite sheet (youtube, facebook, etc.) |
| `app/components/icon.vue` | SVG `<use>` icon component |
| `app/assets/scss/main.scss` | Global styles |
| `app/assets/scss/_variables.scss` | SCSS variables |
| `app/app.vue` | App root — check if ClIcons is mounted |
| `nuxt.config.ts` | Nuxt config — SEO defaults, modules, etc. |

## Constraints

- Do NOT fix issues — only document them
- Cross-cutting issues should reference ALL affected pages
- Responsive testing: test at 375px (mobile), 768px (tablet), 1280px (desktop)
- Console errors: capture the exact error message and stack trace
- Network errors: capture the URL, status code, and response body
- SEO: compare `<title>`, `<meta description>`, og:tags, canonical URL, structured data
- Accessibility: check landmarks, alt text, heading hierarchy, focus management, color contrast
