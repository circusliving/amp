# Task: Index Page

**ID:** p05-01
**Status:** pending
**Depends on:** p04-03, p04-04
**Context size:** medium
**Branch:** `p05-01-index-page`
**Target LOC:** ~100 (max 400)

## Goal

Migrate the index (home) page from Nuxt 2 Options API + mixin to Nuxt 4 Composition API with useFetch and useSeoHead.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p05-01-index-page`
3. Memory recall: Search Neo4j for `index page`, `home page migration`

## Inputs

- Phase context: `phase-05/context.md`
- Old `pages/index.vue` — uses webPageMixin, Options API, head(), Vue 2 slot syntax
- `app/composables/use-web-page.ts` (from p03-02)
- `app/composables/use-seo-head.ts` (from p03-01)
- Card, quote, and section header components (from Phase 04)

## Steps

1. Create `app/pages/index.vue`:
   - Replace `mixins: [webPageMixin]` with `useWebPage()` composable
   - Replace `head()` method with `useSeoHead()` (handled by useWebPage)
   - Replace Vue 2 slot syntax: `<AmpCard slot="first" .../>` → `<template #first><Card ... /></template>`
   - Replace old component names:
     - `<AmpCard>` → `<Card>`
     - `<AmpQuote>` → `<QuoteBlock>`
     - `<AmpQuotes>` → `<QuotesCarousel>`
     - `<ThreeCards>` → `<ThreeCards>` (unchanged)
     - `<AmpSectionHeaderH2>` → `<SectionHeaderH2>`
     - `<AmpSectionHeaderH3>` → `<SectionHeaderH3>`
   - Remove all manual component imports (auto-imported)
   - Remove `components: { ... }` registration
   - Convert to `<script setup lang="ts">`
   - Fetch any additional page-specific data with `useFetch`

2. Fix template structure:
   - The old index page arranges cards, quotes, and sections in a specific layout
   - Preserve the visual layout but use new component names
   - All component references are PascalCase in template (Nuxt resolves from kebab-case files)

3. Delete old page:
   - `pages/index.vue`

## Testing

- [ ] Home page renders with data from CMS
- [ ] SEO meta tags are set correctly
- [ ] All components render (cards, quotes, sections)
- [ ] No Vue 2 slot syntax remains
- [ ] TypeScript compiles

## Outputs

- `app/pages/index.vue`

## Done When

- [ ] Home page fully functional
- [ ] Uses composables (not mixin)
- [ ] All component names updated
- [ ] Slot syntax is Vue 3
- [ ] Old page deleted

## Commits

Final commit: `p05-01-index-page`

## Rollback

- Delete `app/pages/index.vue`, restore old from git

## Handoff

Next: `phase-05/p05-02-article-page.md`
State: Index page complete. Home page renders with CMS data and all components.
