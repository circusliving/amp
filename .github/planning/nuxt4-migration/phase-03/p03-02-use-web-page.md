# Task: useWebPage Composable

**ID:** p03-02
**Status:** pending
**Depends on:** p02-03, p03-01
**Context size:** medium
**Branch:** `p03-02-use-web-page`
**Target LOC:** ~120 (max 400)

## Goal

Create `useWebPage()` composable to replace the old `webPageMixin.js`. This is the app's central data-fetching composable for CMS-driven pages.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p03-02-use-web-page`
3. Memory recall: Search Neo4j for `webPageMixin`, `asyncData composable`, `useAsyncData`

## Inputs

- Phase context: `phase-03/context.md`
- Old `modules/webPageMixin.js` — the MOST complex file to migrate
- `app/composables/use-seo-head.ts` (from p03-01)
- Server API routes (from p02-03)

## Steps

1. Analyze what `webPageMixin.js` does:
   - `asyncData`: Fetches web page from DatoCMS by route path, resolves identifier
   - `head()`: Sets SEO meta tags from fetched data
   - `scrollToTop`: true
   - Handles 404 when page not found
   - Processes both web pages and articles

2. Create `app/composables/use-web-page.ts`:
   ```typescript
   export function useWebPage() {
     const route = useRoute();
     const path = computed(() => route.path);
     
     // Fetch web page data from server API
     const { data: webPage, error, status } = useFetch(
       () => `/api/web-pages/${path.value}`,
       { key: `web-page-${path.value}` }
     );
     
     // Set SEO head from fetched data
     useSeoHead(computed(() => ({
       title: webPage.value?.title ?? '',
       description: webPage.value?.description ?? '',
       canonicalPath: path.value,
       image: webPage.value?.image ? {
         url: webPage.value.image.url,
         width: webPage.value.image.width,
         height: webPage.value.image.height,
       } : undefined,
     })));
     
     // Handle 404
     if (error.value)
       throw createError({ statusCode: 404, statusMessage: 'Page not found' });
     
     return { webPage, error, status };
   }
   ```

3. Handle scroll-to-top behavior:
   - Use `router.options.scrollBehavior` in `app/router.options.ts` instead of per-component `scrollToTop`
   - Create `app/router.options.ts` with scroll-to-top on route change

4. Delete old file:
   - `modules/webPageMixin.js`

## Testing

- [ ] Unit test composable with mocked useFetch
- [ ] Verify SEO head is set from fetched data
- [ ] Verify 404 error handling
- [ ] Verify reactive path updates trigger refetch

## Outputs

- `app/composables/use-web-page.ts`
- `app/router.options.ts`

## Done When

- [ ] Composable replaces webPageMixin fully
- [ ] SEO tags auto-set from CMS data
- [ ] 404 handling works
- [ ] Scroll-to-top on navigation works
- [ ] Old mixin deleted
- [ ] Unit tests pass

## Commits

Final commit: `p03-02-use-web-page`

## Rollback

- Delete `app/composables/use-web-page.ts` and `app/router.options.ts`

## Handoff

Next: `phase-03/p03-03-use-image-attrs.md`
State: Web page composable ready. Pages using the old mixin can now use `useWebPage()`.
