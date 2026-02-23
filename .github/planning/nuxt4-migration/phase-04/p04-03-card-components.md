# Task: Card Components

**ID:** p04-03
**Status:** pending
**Depends on:** p03-03
**Context size:** medium
**Branch:** `p04-03-card-components`
**Target LOC:** ~200 (max 400)

## Goal

Migrate all card-related components to Vue 3 Composition API with TypeScript. Remove AMP markup. Deduplicate the `needsSpace()` pattern.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p04-03-card-components`
3. Memory recall: Search Neo4j for `card component`, `needsSpace`

## Inputs

- Phase context: `phase-04/context.md`
- Old `components/amp/Card.vue` — card with computed image src (from helpers), `<nuxt-link>`
- Old `components/amp/CardCL.vue` — card variant with `needsSpace()` (threshold 152)
- Old `components/amp/CardImgMiddle.vue` — card with image in middle, `needsSpace()` (threshold 130)
- Old `components/amp/CardList.vue` — renders list of Card components
- Old `components/amp/ThreeCards.vue` — named slots for 3 cards
- `app/composables/use-image-attrs.ts` (from p03-03)
- `app/utils/helpers.ts` (from p03-04) — `truncateText()`

## Steps

1. Create `app/components/card.vue`:
   - Props: `{ article: Article }` (typed)
   - Replace `<amp-img>` with `<NuxtImg>` or `<img loading="lazy">`
   - Replace `<nuxt-link>` with `<NuxtLink>`
   - Remove computed import from helpers.js, use `useImageAttrs()` if needed
   - Scoped styles

2. Create `app/components/card-cl.vue`:
   - Props: `{ article: Article }`
   - Deduplicate `needsSpace()`: use `truncateText()` from helpers util
   - Replace `<nuxt-link>` with `<NuxtLink>`

3. Create `app/components/card-img-middle.vue`:
   - Props: `{ article: Article }`
   - Same `needsSpace()` deduplication using `truncateText()`
   - Replace `<nuxt-link>` with `<NuxtLink>`

4. Create `app/components/card-list.vue`:
   - Props: `{ articles: Article[] }`
   - Remove manual component import (`Card` auto-imported)

5. Create `app/components/three-cards.vue`:
   - Named slots: `#first`, `#second`, `#third`
   - Update slot syntax from Vue 2 to Vue 3

6. Delete old files:
   - `components/amp/Card.vue`
   - `components/amp/CardCL.vue`
   - `components/amp/CardImgMiddle.vue`
   - `components/amp/CardList.vue`
   - `components/amp/ThreeCards.vue`

## Testing

- [ ] Each card renders article data correctly
- [ ] Images use lazy loading
- [ ] Links are NuxtLink
- [ ] No code duplication (needsSpace replaced by truncateText)
- [ ] TypeScript compiles

## Outputs

- `app/components/card.vue`
- `app/components/card-cl.vue`
- `app/components/card-img-middle.vue`
- `app/components/card-list.vue`
- `app/components/three-cards.vue`

## Done When

- [ ] 5 card components migrated
- [ ] Zero code duplication
- [ ] All typed with `<script setup lang="ts">`
- [ ] No AMP markup
- [ ] Old files deleted

## Commits

Final commit: `p04-03-card-components`

## Rollback

- Delete new card files, restore old from git

## Handoff

Next: `phase-04/p04-04-content-components.md`
State: Card components complete. Ready for content components (hero, page body, quotes, headers).
