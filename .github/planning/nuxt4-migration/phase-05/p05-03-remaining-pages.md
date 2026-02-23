# Task: Section/Page & Gallery/Image-Object Pages

**ID:** p05-03
**Status:** pending
**Depends on:** p03-02
**Context size:** small
**Branch:** `p05-03-remaining-pages`
**Target LOC:** ~120 (max 400)

## Goal

Migrate the remaining pages: dynamic section/page, galleries (fixing typo), and image objects. These are simpler pages that mostly use the useWebPage composable.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p05-03-remaining-pages`
3. Memory recall: Search Neo4j for `dynamic routes nuxt4`, `catch-all route`

## Inputs

- Phase context: `phase-05/context.md`
- Old `pages/_section/_page.vue` — uses webPageMixin, dynamic nested route
- Old `pages/gallaries/_id.vue` — stub page, misspelled ("gallaries" → "galleries")
- Old `pages/image-objects/_id.vue` — stub page with empty asyncData
- `app/composables/use-web-page.ts` (from p03-02)

## Steps

1. Create `app/pages/[section]/[page].vue`:
   - Replace `_section/_page.vue` dynamic route syntax
   - Replace `mixins: [webPageMixin]` with `useWebPage()`
   - Access params via `useRoute().params.section` and `useRoute().params.page`
   - `<script setup lang="ts">`

2. Create `app/pages/galleries/[id].vue` (note: typo fixed from "gallaries"):
   - Create proper gallery page (old was a stub)
   - Fetch gallery data via `useFetch('/api/image-objects/${id}')`
   - Use `useSeoHead()` for meta tags
   - Display gallery images using `<NuxtImg>` or image list component
   - `<script setup lang="ts">`

3. Create `app/pages/image-objects/[id].vue`:
   - Create proper image object detail page (old was empty stub)
   - Fetch image object via `useFetch('/api/image-objects/${id}')`
   - Use `useSeoHead()` for meta tags
   - Display full-size image with metadata
   - `<script setup lang="ts">`

4. Add redirect for old misspelled URL:
   - Create `server/routes/gallaries/[id].get.ts` that redirects to `/galleries/[id]`
   - 301 redirect for SEO
   ```typescript
   export default defineEventHandler((event) => {
     const id = getRouterParam(event, 'id');
     return sendRedirect(event, `/galleries/${id}`, 301);
   });
   ```

5. Delete old page files:
   - `pages/_section/_page.vue`
   - `pages/gallaries/_id.vue`
   - `pages/image-objects/_id.vue`
   - `pages/index.vue` (if not already deleted in p05-01)
   - `pages/offline.vue-todo` (dead file)

6. Delete the entire old `pages/` directory (should be empty)

7. Clean up remaining old files:
   - `assets/main.css` (replaced by app/assets/scss/main.scss)
   - `assets/main.scss` (replaced)
   - `middleware/README.md` (empty, replaced by app/middleware/)
   - All README.md files in old directories (components/, plugins/, store/, etc.)

## Testing

- [ ] `/section/page` routes work with CMS data
- [ ] `/galleries/id` routes work
- [ ] `/image-objects/id` routes work
- [ ] `/gallaries/id` redirects to `/galleries/id` (301)
- [ ] 404 for non-existent routes
- [ ] All pages use composables
- [ ] TypeScript compiles

## Outputs

- `app/pages/[section]/[page].vue`
- `app/pages/galleries/[id].vue`
- `app/pages/image-objects/[id].vue`
- `server/routes/gallaries/[id].get.ts` (redirect)

## Done When

- [ ] All pages migrated to Nuxt 4
- [ ] Dynamic route syntax updated
- [ ] Typo fixed with redirect for SEO
- [ ] All old pages/, components/, assets/, store/, modules/ directories deleted
- [ ] No old Nuxt 2 files remain

## Commits

Final commit: `p05-03-remaining-pages`

## Rollback

- Delete new page files, restore old from git

## Handoff

Next: `phase-06/p06-01-vitest-setup.md`
State: Phase 05 complete. ALL pages migrated. No old Nuxt 2 code remains. Full app should be navigable.
