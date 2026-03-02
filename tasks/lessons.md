# Lessons Learned

## 2026-02-23 — Phase 01 Init

### Old `modules/` directory auto-scanned
- **Problem:** Nuxt 4 auto-scans the root `modules/` directory and tried to load old Nuxt 2 modules (Dato.js, SiteMap.js) which depend on removed packages
- **Fix:** Renamed `modules/` → `modules.old/` before running `nuxt prepare`
- **Rule:** When migrating in-place, rename conflicting old directories before running any Nuxt 4 commands

### Old `nuxt.config.js` blocks Nuxt 4
- **Problem:** Nuxt 4 picks up the old `nuxt.config.js` which uses CommonJS and references removed dependencies
- **Fix:** Rename to `nuxt.config.js.old` before creating `nuxt.config.ts`
- **Rule:** Always move old config out of the way first — the new `nuxt.config.ts` takes precedence only if the `.js` version is gone

## 2026-03-02 — Voice Protocol Compliance

### Not following Voice Protocol every session
- **Problem:** personal.md §2.3 requires acknowledgment (start), progress (long tasks), and summary (end) voice notifications every session in NORMAL/FULL mode. I was not attempting them.
- **Fix:** Always attempt the 3-step voice protocol: (1) acknowledge at request start, (2) progress on tasks >1 min, (3) summary at end. If hooligan-mcp fails, continue silently per §2.4 but still attempt.
- **Rule:** EVERY session in NORMAL/FULL mode must attempt voice protocol. Check hooligan-mcp availability early. If it fails, note it silently and move on — but never skip the attempt.
- **Note:** hooligan-mcp server is currently failing to start (exit code 1). Needs investigation/fix to restore voice capability.

## 2026-03-02 — API 503 Root Cause: DatoCMS Environment Header

### Invalid `X-Environment: main` header caused all API 503s
- **Problem:** `server/utils/dato-client.ts` sent `X-Environment: main` header to DatoCMS GraphQL API. The DatoCMS project doesn't have an environment named "main" — it returns `INVALID_ENVIRONMENT` (404), which the catch blocks wrapped as 503.
- **Fix:** Removed the `X-Environment: main` header from the GraphQL client. The default DatoCMS environment works without any explicit header.
- **Rule:** Don't assume DatoCMS environment names. Test the token directly with `curl` against `https://graphql.datocms.com/` before adding environment headers. If the DatoCMS project uses only the default environment, omit the header entirely.

### GraphQL queries referenced non-existent fields/filters
- **Problem:** `ALL_ARTICLES_QUERY` filtered by `articleSection` (doesn't exist on ArticleModelFilter) and selected `img` and `articleSection` fields (don't exist on ArticleRecord). `PLACE_BY_IDENTIFIER_QUERY` selected `text` and `coverImage` (don't exist on PlaceRecord) and `image` without sub-selections (it's a linked record). Both image-object and place queries used `String!` for `identifierId` but the `anyIn` filter expects `ItemId`.
- **Fix:** Removed invalid filter/fields from articles query. Changed variable types to `ItemId!`. Fixed place query to select only valid fields with proper sub-selections.
- **Rule:** Always introspect the DatoCMS schema before writing queries. Use `{ __type(name: "ModelRecord") { fields { name } } }` and `{ __type(name: "ModelFilter") { inputFields { name } } }` to validate field/filter names. Link fields require sub-selections and `ItemId` type for filters.

### Singleton GraphQL client caches stale configuration across hot reloads
- **Problem:** `dato-client.ts` singleton caches the first `GraphQLClient` instance. When updating headers or config during dev, the cached client still uses the old configuration. Hot reload updates the source code but doesn't reset the singleton.
- **Fix:** Restart the dev server after changing `dato-client.ts` to clear the singleton cache.
- **Rule:** After modifying singleton factory functions in Nitro server code, **restart the dev server** — HMR won't reset already-created singletons.

## 2026-03-03 — Issue Fix Phase

### Nullish coalescing (`??`) vs OR (`||`) for empty strings
- **Problem:** `side-menu.vue` used `item.menuName ?? item.name`. API returns `menuName: ""` (empty string). `??` only catches `null`/`undefined`, not empty strings.
- **Fix:** Use `||` when empty string should fall through to the fallback value.
- **Rule:** When an API field can be an empty string and should not display, always use `||` not `??`.

### `useFetch` inside Pinia store actions causes hydration issues
- **Problem:** `useFetch()` is a composable designed for `<script setup>` context. Using it inside Pinia store actions is fragile and can cause hydration mismatches.
- **Fix:** Use `$fetch` (the plain fetch utility) inside store actions. It returns data directly, not wrapped in refs.
- **Rule:** Only use `useFetch` in component setup context. In Pinia stores, event handlers, or utility functions, use `$fetch`.

### Test mocks must match implementation internals
- **Problem:** After changing store actions from `useFetch` to `$fetch`, tests failed because mocks still returned `{ data: ref(...) }` format instead of direct data.
- **Fix:** Updated test mocks to use `vi.stubGlobal('$fetch', ...)` returning data directly.
- **Rule:** When changing the fetch mechanism in code, always update corresponding test mocks to match the new return shape.

### `buildSrcSet()` must check image host before adding query params
- **Problem:** `buildSrcSet()` added `?w=` params to all image URLs, but `images.circusliving.com` uses path-based sizing (e.g., `375x222/`), not query params. Only DatoCMS URLs (`datocms-assets.com`) support `?w=`.
- **Fix:** Check if URL contains `datocms-assets.com` before generating srcset with `?w=` params. Return empty string for non-DatoCMS URLs.
- **Rule:** Always validate the image host supports the resizing mechanism before applying it.

### Nuxt API route naming: `index.get.ts` catches root path
- **Problem:** `server/api/web-pages/index.get.ts` catches `/api/web-pages/` (root), conflicting with `[...path].get.ts` for the homepage path `/`.
- **Fix:** Renamed to `list.get.ts` so it only matches `/api/web-pages/list`.
- **Rule:** Don't use `index.get.ts` in an API directory that also has a catch-all route. Use a descriptive name like `list.get.ts`.
