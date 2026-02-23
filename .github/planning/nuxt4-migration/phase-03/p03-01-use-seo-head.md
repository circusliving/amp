# Task: useSeoHead Composable

**ID:** p03-01
**Status:** complete
**Depends on:** p02-01
**Context size:** small
**Branch:** `p03-01-use-seo-head`
**Target LOC:** ~80 (max 400)

## Goal

Create a single `useSeoHead()` composable that replaces the 3+ duplicated `head()` functions across the codebase.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p03-01-use-seo-head`
3. Memory recall: Search Neo4j for `useHead`, `useSeoMeta`, `seo composable`

## Inputs

- Phase context: `phase-03/context.md`
- Old `modules/webPageMixin.js` lines ~48-81 — head() with full meta tags
- Old `pages/index.vue` lines ~97-128 — head() duplicate
- Old `pages/articles/_id.vue` lines ~146-187 — head() duplicate

## Steps

1. Create `app/composables/use-seo-head.ts`:
   - Accept a typed options object:
     ```typescript
     interface SeoHeadOptions {
       title: string;
       description: string;
       canonicalPath: string;
       image?: {
         url: string;
         width?: number;
         height?: number;
         alt?: string;
       };
       type?: 'website' | 'article';
       locale?: string;
       publishedTime?: string;
       modifiedTime?: string;
     }
     ```
   - Use `useSeoMeta()` for standard meta tags (title, description, og:*, twitter:*)
   - Use `useHead()` for canonical link and any custom head elements
   - Read `canonicalBaseUrl` from `useRuntimeConfig().public`
   - Support both static and reactive (computed) options via `MaybeRefOrGetter`

2. The composable should generate:
   - `<title>` tag
   - `<meta name="description">`
   - `<link rel="canonical">`
   - Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`
   - Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
   - Article-specific: `article:published_time`, `article:modified_time` (when type is 'article')

3. Use `useSeoMeta()` (Nuxt 4 recommended) instead of manually building meta arrays.

## Testing

- [ ] Unit test with various option combinations
- [ ] Verify canonical URL construction
- [ ] Verify all meta tags generated correctly
- [ ] Verify reactive updates when options change

## Outputs

- `app/composables/use-seo-head.ts`

## Done When

- [ ] Single composable replaces all 3+ head() duplications
- [ ] Fully typed with strict TypeScript
- [ ] Uses `useSeoMeta()` + `useHead()`
- [ ] Unit tests pass

## Commits

Final commit: `p03-01-use-seo-head`

## Rollback

- Delete `app/composables/use-seo-head.ts`

## Handoff

Next: `phase-03/p03-02-use-web-page.md`
State: SEO head composable ready. Pages can call `useSeoHead({ title, description, ... })` instead of duplicating head() logic.
