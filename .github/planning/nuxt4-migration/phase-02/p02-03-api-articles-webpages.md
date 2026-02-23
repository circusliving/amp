# Task: Server API Routes — Articles & Web Pages

**ID:** p02-03
**Status:** pending
**Depends on:** p02-02
**Context size:** medium
**Branch:** `p02-03-api-articles-webpages`
**Target LOC:** ~150 (max 400)

## Goal

Create Nitro server API routes for articles and web pages. These replace the old Apollo Client queries that ran in `asyncData` and Vuex actions.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p02-03-api-articles-webpages`
3. Memory recall: Search Neo4j for `nitro api routes`, `useFetch server`

## Inputs

- Phase context: `phase-02/context.md`
- `server/utils/dato-fetch.ts` (from p02-02)
- Old `store/article.js` — understand article fetching patterns
- Old `store/index.js` — understand webPage fetching in nuxtServerInit
- Old `pages/articles/_id.vue` — understand article data needs

## Steps

1. Create `server/api/articles/index.get.ts`:
   - Calls `fetchArticles()`
   - Returns typed `Article[]`
   - Supports query param `?tag=xxx` for tag filtering

2. Create `server/api/articles/latest.get.ts`:
   - Calls `fetchLatestArticles(limit)`
   - Query param `?limit=6` (default 6)
   - Returns typed `Article[]`

3. Create `server/api/articles/[id].get.ts`:
   - Calls `fetchArticleByIdentifier(id)`
   - Returns typed `Article`
   - Throws `createError({ statusCode: 404 })` if not found

4. Create `server/api/web-pages/index.get.ts`:
   - Calls `fetchAllWebPages()`
   - Returns typed `WebPage[]`

5. Create `server/api/web-pages/[...path].get.ts`:
   - Catch-all route for `/api/web-pages/section/page`
   - Calls `fetchWebPageByPath(path)`
   - Returns typed `WebPage`
   - Throws 404 if not found

6. Handle the article body HTML processing:
   - The old code used `$ToAMP` to convert `<img>` to `<amp-img>` in article body
   - Since we're dropping AMP, article body HTML passes through as-is
   - Add `loading="lazy"` and `width`/`height` attrs to `<img>` tags in article body (server-side) using a simple regex or DOM parser
   - Create `server/utils/html-processor.ts` for this

## Testing

- [ ] Unit test each API route with mocked dato-fetch functions
- [ ] Verify 404 handling for missing articles/pages
- [ ] Verify query param parsing (limit, tag)
- [ ] Verify HTML processor adds lazy loading to images

## Outputs

- `server/api/articles/index.get.ts`
- `server/api/articles/latest.get.ts`
- `server/api/articles/[id].get.ts`
- `server/api/web-pages/index.get.ts`
- `server/api/web-pages/[...path].get.ts`
- `server/utils/html-processor.ts`

## Done When

- [ ] All API routes return typed data
- [ ] Error handling for missing resources
- [ ] Query params work correctly
- [ ] Article body images get lazy loading
- [ ] All tests pass

## Commits

Final commit: `p02-03-api-articles-webpages`

## Rollback

- Delete `server/api/articles/` and `server/api/web-pages/`

## Handoff

Next: `phase-02/p02-04-api-menus-images.md`
State: Article and web page API routes complete. HTML processor handles article body images.
