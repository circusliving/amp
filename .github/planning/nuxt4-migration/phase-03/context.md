# Phase 03: Composables & Utilities

## Purpose

Create Vue 3 composables that replace the old Nuxt 2 patterns (mixins, head() functions, image service). These composables eliminate all code duplication identified in the codebase analysis. This phase also migrates helper utilities and locale files to TypeScript.

## Shared Context

- **Composables replace mixins.** The old `webPageMixin.js` (used in 2+ pages) becomes `useWebPage()`. 
- **SEO head logic is deduplicated.** The `head()` function was duplicated 3+ times with nearly identical meta tags. Now it's a single `useSeoHead()` composable.
- **Image attributes are deduplicated.** Width/height/alt fetching logic was duplicated between PageBody, HeroTitle, articles page, and ImageService. Now it's `useImageAttrs()`.
- **Auto-imports:** Composables in `app/composables/` are auto-imported by Nuxt 4. No manual imports needed.
- **Luxon** is used for all date formatting (per project standards), replacing the old Vue 2 `filters`.
- **NuxtTime** for display per project standards.

## Key Files (Old → New)

| Old | New | Notes |
|-----|-----|-------|
| `modules/webPageMixin.js` | `app/composables/use-web-page.ts` | Mixin → composable |
| `head()` in 3+ files | `app/composables/use-seo-head.ts` | Deduplicated |
| `modules/ImageService.js` | `app/utils/image-service.ts` + `app/composables/use-image-attrs.ts` | Refactored |
| `modules/helpers.js` | `app/utils/helpers.ts` | TypeScript conversion |
| `locales/en.js`, `locales/fr.js` | `locales/en.ts`, `locales/fr.ts` | TypeScript + ESM |

## Constraints

- All composables must be fully typed
- No `this` context (Vue 3 Composition API)
- Use `useFetch` for data fetching (not `$fetch` on client)
- Use `useHead()` or `useSeoMeta()` for meta tags (not `head()` method)
- Use Luxon for date manipulation, NuxtTime for display
- Composables go in `app/composables/`, utils go in `app/utils/`
