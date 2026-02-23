# Task: Utility Components (Icon, CLIcons, SocialBar, PopularPosts, ImageList)

**ID:** p04-05
**Status:** pending
**Depends on:** p03-03, p04-03
**Context size:** medium
**Branch:** `p04-05-utility-components`
**Target LOC:** ~200 (max 400)

## Goal

Migrate remaining utility components. Fix PopularPosts (heaviest migration: Vuex mapGetters, filters, created hook, dead code). Fix ImageList AMP fly-in animations.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p04-05-utility-components`
3. Memory recall: Search Neo4j for `popular posts`, `image list`, `svg icons`

## Inputs

- Phase context: `phase-04/context.md`
- Old `components/CLIcons.vue` — SVG sprite definitions
- Old `components/Icon.vue` — SVG `<use xlink:href>` icon component
- Old `components/SocialBar.vue` — social media link buttons
- Old `components/amp/PopularPosts.vue` — Vuex mapGetters, filters, created hook, dead `src()` function
- Old `components/amp/ImageList.vue` — `<amp-img>`, `amp-fx="fly-in-bottom"`, `<nuxt-link>`
- Pinia `useArticleStore()` (from p02-05)
- `app/utils/date-format.ts` (from p03-04)

## Steps

1. Create `app/components/cl-icons.vue`:
   - Keep inline SVG sprite definitions
   - Convert to `<script setup lang="ts">`
   - Deduplicate `.icon` CSS (was duplicated with Icon.vue)

2. Create `app/components/icon.vue`:
   - Props: `defineProps<{ name: string; size?: number }>()`
   - Replace `xlink:href` (deprecated) with `href` (SVG 2)
   - Remove duplicated `.icon` CSS → share via SCSS mixin or single source
   - Use `<CLIcons>` as sibling or move SVG defs to a global approach

3. Create `app/components/social-bar.vue`:
   - Convert hardcoded social links to typed array
   - Replace manual component imports with auto-imports
   - Use `<NuxtLink>` with `external` for social URLs

4. Create `app/components/popular-posts.vue` (MOST COMPLEX):
   - Replace `import { mapGetters } from 'vuex'` with `useArticleStore()`
   - Replace `filters: { dateFormat }` with `formatDate()` function call in template
     - Was: `{{ a._updatedAt | dateFormat }}`
     - Now: `{{ formatDate(a._updatedAt) }}` or `<NuxtTime :datetime="a._updatedAt" />`
   - Replace `created()` hook with code in `<script setup>` body:
     ```typescript
     const articleStore = useArticleStore();
     await articleStore.fetchLatest();
     ```
   - Remove dead `src()` function (was copy-pasted but never called)
   - Fix `v-bind:key` bug (missing value) → `:key="article.identifier"`
   - Replace `<nuxt-link>` with `<NuxtLink>`
   - Replace `<amp-img>` with `<img loading="lazy">`

5. Create `app/components/image-list.vue`:
   - Replace `<amp-img layout="responsive" amp-fx="fly-in-bottom">` with:
     - `<img loading="lazy">` with CSS `width: 100%; height: auto;`
     - Optional fly-in animation with CSS + IntersectionObserver or remove entirely
   - Replace `<nuxt-link>` with `<NuxtLink>`
   - Replace helpers.js method imports with utility functions

6. Delete old files:
   - `components/CLIcons.vue`
   - `components/Icon.vue`
   - `components/SocialBar.vue`
   - `components/amp/PopularPosts.vue`
   - `components/amp/ImageList.vue`

7. Delete the entire old `components/amp/` directory (should be empty now)
8. Delete old `components/` root files (should be empty now)

## Testing

- [ ] PopularPosts fetches and displays latest articles
- [ ] Date formatting works (Luxon/NuxtTime)
- [ ] No dead code in PopularPosts
- [ ] `v-bind:key` bug fixed
- [ ] SVG icons render correctly
- [ ] Image list renders with lazy loading
- [ ] All links use NuxtLink

## Outputs

- `app/components/cl-icons.vue`
- `app/components/icon.vue`
- `app/components/social-bar.vue`
- `app/components/popular-posts.vue`
- `app/components/image-list.vue`

## Done When

- [ ] 5 utility components migrated
- [ ] PopularPosts uses Pinia (no Vuex)
- [ ] No Vue 2 filters
- [ ] No dead code
- [ ] All bugs fixed (v-bind:key)
- [ ] Old components/ directory completely empty and deleted
- [ ] Old components/amp/ directory deleted

## Commits

Final commit: `p04-05-utility-components`

## Rollback

- Delete new component files, restore old from git

## Handoff

Next: `phase-05/p05-01-index-page.md`
State: Phase 04 complete. ALL components migrated to Vue 3 + TypeScript. No AMP. No code duplication. Old components/ directory deleted.
