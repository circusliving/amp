# Task: Article Detail Page

**ID:** p05-02
**Status:** pending
**Depends on:** p04-04, p03-02
**Context size:** large
**Branch:** `p05-02-article-page`
**Target LOC:** ~150 (max 400)

## Goal

Migrate the article detail page — the most complex page in the app. Replace asyncData, $ToAMP, $axios, apolloProvider, head(), and complex image processing with Nuxt 4 patterns.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p05-02-article-page`
3. Memory recall: Search Neo4j for `article page`, `asyncData migration`, `image processing`

## Inputs

- Phase context: `phase-05/context.md`
- Old `pages/articles/_id.vue` — THE most complex file:
  - `asyncData` with apollo queries, $ToAMP image conversion, $axios HEAD requests
  - `head()` with full SEO meta
  - Multiple computed properties for image dimensions
  - `scrollToTop: true`
- `app/composables/use-seo-head.ts` (from p03-01)
- `app/composables/use-image-attrs.ts` (from p03-03)
- Server API route `server/api/articles/[id].get.ts` (from p02-03) — handles HTML processing
- Server API `server/utils/html-processor.ts` (from p02-03) — adds lazy loading to body images

## Steps

1. Create `app/pages/articles/[id].vue`:
   - Dynamic route: `_id.vue` → `[id].vue`
   - Replace `asyncData` with `useFetch`:
     ```typescript
     const route = useRoute();
     const { data: article } = await useFetch(`/api/articles/${route.params.id}`);
     ```
   - The server API route now handles:
     - Fetching article from DatoCMS
     - Processing body HTML (adding lazy loading to images)
     - No more $ToAMP needed
   
2. Replace `head()` with `useSeoHead()`:
   ```typescript
   useSeoHead(computed(() => ({
     title: article.value?.title ?? '',
     description: article.value?.description ?? '',
     canonicalPath: `/articles/${route.params.id}`,
     type: 'article',
     image: article.value?.image ? {
       url: article.value.image.url,
       width: article.value.image.width,
       height: article.value.image.height,
       alt: article.value.image.alt,
     } : undefined,
     publishedTime: article.value?._createdAt,
     modifiedTime: article.value?._updatedAt,
   })));
   ```

3. Replace image dimension computed properties:
   - Old: multiple computed (width, height, alt) that call ImageService
   - New: use `useImageAttrs()` composable or direct property access from typed Article

4. Replace `$axios.head()` for SEO image dimensions:
   - This was used to fetch image width/height via HTTP HEAD to CDN
   - Now: DatoCMS responsive image API provides dimensions in the GraphQL response
   - Or: `@nuxt/image` handles dimensions automatically

5. Remove all old patterns:
   - `asyncData` → `useFetch`
   - `app.apolloProvider.defaultClient.query()` → removed (server API handles it)
   - `app.$ToAMP.loadHtml()` → removed (AMP dropped)
   - `app.$ToAMP.loadImages()` → removed
   - `app.$ToAMP.convertImages()` → removed  
   - `app.$ToAMP.toHTML()` → removed
   - `app.$axios.head()` → removed
   - `scrollToTop: true` → handled by `app/router.options.ts`

6. Template updates:
   - Replace `<amp-img>` with `<NuxtImg>` or `<img loading="lazy">`
   - Replace `<nuxt-link>` with `<NuxtLink>`
   - Use components: `<HeroTitle>`, `<PageBody>`, `<PopularPosts>`, `<SideBar>`

7. Delete old page:
   - `pages/articles/_id.vue`

## Testing

- [ ] Article page renders with CMS data
- [ ] Article body HTML renders correctly (v-html)
- [ ] Body images have lazy loading
- [ ] SEO meta tags set with article data
- [ ] Hero image renders with proper dimensions
- [ ] Popular posts sidebar loads
- [ ] 404 for non-existent articles
- [ ] TypeScript compiles

## Outputs

- `app/pages/articles/[id].vue`

## Done When

- [ ] Fully functional article page
- [ ] No asyncData, $ToAMP, $axios, apolloProvider
- [ ] Uses useFetch + server API
- [ ] SEO via useSeoHead
- [ ] All images handled properly
- [ ] Old page deleted

## Commits

Final commit: `p05-02-article-page`

## Rollback

- Delete `app/pages/articles/[id].vue`, restore old from git

## Handoff

Next: `phase-05/p05-03-remaining-pages.md`
State: Article page complete. Most complex migration done.
