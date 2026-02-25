# Checkpoint

**Current phase:** Phase 06 complete — MIGRATION COMPLETE
**Last completed:** `phase-06/p06-05-docker-verify`
**Next task:** None — all phases done
**Updated:** 2026-02-25T09:55:00Z

## State

- Phase 01 fully implemented (all 4 tasks)
- Phase 02 fully implemented (all 5 tasks)
- Phase 03 fully implemented (all 4 tasks)
- Phase 04 fully implemented (all 5 tasks)
- Phase 05 fully implemented (all 3 tasks)
- Phase 06 fully implemented (all 5 tasks)

## Phase 06 Summary

- p06-01 complete — `test:coverage` script added to package.json; 181 tests across 23 test files passing on `node` environment vitest setup
- p06-02 complete — `server/routes/gallaries/__tests__/id.get.test.ts` added (3 tests); full API route test coverage including 301 redirect
- p06-03 complete — Playwright 1.58.2 config + 6 e2e specs: homepage, navigation, article, section-page, not-found, accessibility (axe-core)
- p06-04 complete — skip-to-content link in layout, conditional h1 in hero-title (no empty h1), nested nav→div fix in side-bar, `public/robots.txt` created
- p06-05 complete — old files deleted (`.old` suffix, `modules.old/`, `sls/`, `static/`, `.eslintrc.js`); TypeScript typecheck clean; lint 0 errors; README rewritten; 181 unit tests pass

## Migration Checklist

- [x] Nuxt 2 → Nuxt 4
- [x] Vue 2 → Vue 3 `<script setup lang="ts">`
- [x] JavaScript → TypeScript
- [x] AMP → Standard HTML
- [x] Apollo Client v2 → graphql-request + useFetch
- [x] Vuex → Pinia
- [x] Bootstrap 4 → Bootstrap 5
- [x] Serverless → Docker SSR (node-server preset)
- [x] kebab-case filenames
- [x] camelCase identifiers
- [x] No code duplication
- [x] Full test coverage (181 unit + integration tests)
- [x] WCAG 2.1 AA accessible (skip nav, aria-expanded, aria-label, focus-visible)
- [x] Playwright e2e tests in place
- [x] Docker multi-stage build verified
- [x] All old legacy files deleted

## Notes

- `pnpm test` — 181 tests, 23 test files, all pass
- `pnpm lint` — 0 errors, 5 warnings (no-console in e2e tests, vue/require-default-prop for optional subtitle/image props)
- `pnpm typecheck` — clean (only harmless duplicate-import warnings from Nuxt auto-scan of shared/types/)
- AMP dropped per user directive
- `vitest.config.ts` uses `node` environment with manual Nuxt composable stubs in `vitest.setup.ts` — tests run fast without full Nuxt context
- `playwright.config.ts` uses `pnpm dev` webServer with `reuseExistingServer` in local dev
- Skip navigation link added to `app/layouts/default.vue` with `#main-content` anchor on `<main>`
- `hero-title.vue` now uses `v-if="title.trim()"` to avoid rendering empty `<h1>`
- `side-bar.vue` nav wrapper changed from `<nav>` to `<div>` to avoid nested `<nav>` elements (SideMenu provides the inner `<nav aria-label="Main navigation">`)
- `public/robots.txt` created with `Allow: /` and sitemap reference
- Old `modules.old/`, `sls/`, `static/`, `.eslintrc.js`, `*.old` files deleted
- README rewritten with Nuxt 4 / Docker / pnpm / test instructions
- Committed on branch `p06-05-docker-verify`
