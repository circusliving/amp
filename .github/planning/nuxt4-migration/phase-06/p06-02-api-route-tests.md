# Task: Server API Route Integration Tests

**ID:** p06-02
**Status:** pending
**Depends on:** p06-01
**Context size:** small
**Branch:** `p06-02-api-route-tests`
**Target LOC:** ~200 (max 400)

## Goal

Write integration tests for all Nitro server API routes using @nuxt/test-utils, mocking the DatoCMS GraphQL responses.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p06-02-api-route-tests`
3. Memory recall: Search Neo4j for `nitro api test`, `server route testing nuxt`

## Inputs

- Phase context: `phase-06/context.md`
- `server/api/articles/index.get.ts` (from p02-03)
- `server/api/articles/[identifier].get.ts` (from p02-03)
- `server/api/articles/latest.get.ts` (from p02-03)
- `server/api/articles/by-tag/[tag].get.ts` (from p02-03)
- `server/api/web-pages/[...path].get.ts` (from p02-03)
- `server/api/menus/index.get.ts` (from p02-04)
- `server/api/image-objects/[identifier].get.ts` (from p02-04)
- `server/api/places/[identifier].get.ts` (from p02-04)
- `server/routes/gallaries/[id].get.ts` (redirect, from p05-03)

## Steps

1. Create test fixtures:
   - `server/api/__tests__/fixtures/article.ts` — mock Article data
   - `server/api/__tests__/fixtures/web-page.ts` — mock WebPage data
   - `server/api/__tests__/fixtures/image-object.ts` — mock ImageObject data
   - `server/api/__tests__/fixtures/menu-items.ts` — mock menu page items

2. Create mock for dato-client:
   - `server/api/__tests__/mocks/dato-client.ts`
   - Mock `graphql-request` at module level using `vi.mock()`
   - Return fixture data for each query type

3. Test articles API (`server/api/__tests__/articles.test.ts`):
   - GET `/api/articles` → list of articles
   - GET `/api/articles/some-identifier` → single article
   - GET `/api/articles/latest` → latest articles
   - GET `/api/articles/by-tag/some-tag` → filtered articles
   - Test 404 for non-existent article
   - Test query parameter handling (limit, offset)

4. Test web-pages API (`server/api/__tests__/web-pages.test.ts`):
   - GET `/api/web-pages/section/page` → web page data
   - Test catch-all route parameter parsing
   - Test 404 for non-existent page

5. Test menus API (`server/api/__tests__/menus.test.ts`):
   - GET `/api/menus` → menu tree
   - Verify tree structure (nested sections)

6. Test image-objects API (`server/api/__tests__/image-objects.test.ts`):
   - GET `/api/image-objects/some-id` → image object
   - Test 404 for non-existent image

7. Test places API (`server/api/__tests__/places.test.ts`):
   - GET `/api/places/some-id` → place data

8. Test redirect route (`server/api/__tests__/gallaries-redirect.test.ts`):
   - GET `/gallaries/some-id` → 301 redirect to `/galleries/some-id`
   - Verify Location header

9. Run all tests: `pnpm test`

## Testing

- [ ] All API routes tested with mocked DatoCMS responses
- [ ] Error cases tested (404, malformed data)
- [ ] Redirect route tested
- [ ] All tests pass

## Outputs

- `server/api/__tests__/fixtures/article.ts`
- `server/api/__tests__/fixtures/web-page.ts`
- `server/api/__tests__/fixtures/image-object.ts`
- `server/api/__tests__/fixtures/menu-items.ts`
- `server/api/__tests__/mocks/dato-client.ts`
- `server/api/__tests__/articles.test.ts`
- `server/api/__tests__/web-pages.test.ts`
- `server/api/__tests__/menus.test.ts`
- `server/api/__tests__/image-objects.test.ts`
- `server/api/__tests__/places.test.ts`
- `server/api/__tests__/gallaries-redirect.test.ts`

## Done When

- [ ] All server API routes have integration tests
- [ ] Mocking strategy clean and reusable
- [ ] All tests pass

## Commits

Final commit: `p06-02-api-route-tests`

## Rollback

- Delete test files and fixtures

## Handoff

Next: `phase-06/p06-03-playwright-e2e.md`
State: All server-side code fully tested. Next: browser-level e2e tests.
