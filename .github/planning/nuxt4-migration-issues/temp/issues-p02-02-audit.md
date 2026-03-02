# Issues — p02-02: Audit Articles, Image Objects, Galleries & Code Review

**Audited:** 2026-03-02
**Local:** http://localhost:3000/
**Scope:** Article APIs, Image Object APIs, Gallery routes, 9 source files

---

## Task 1: Article API Findings

### Endpoint: `GET /api/articles`

- **HTTP Status:** 200
- **Total count returned:** 100
- **Fields per item:** `identifier`, `name`, `image` (3 fields only)
- **Field presence:**
  | Field | Present |
  |-------|---------|
  | name | 100/100 |
  | identifier | 100/100 |
  | image | 100/100 |
  | description | 0/100 |
  | coverImage | 0/100 |
  | url | 0/100 |
  | text | 0/100 |
  | articleSection | 0/100 |

### Endpoint: `GET /api/articles/latest?limit=3`

- **HTTP Status:** 200
- **Count returned:** 3
- **Fields per item:** `identifier`, `name`, `image`, `_updatedAt`, `jsonLd`
- **Field presence:**
  | Field | Present |
  |-------|---------|
  | name | 3/3 |
  | identifier | 3/3 |
  | image | 3/3 |
  | _updatedAt | 3/3 |
  | jsonLd | 0/3 (empty string) |
  | description | 0/3 |
  | coverImage | 0/3 |
  | url | 0/3 |

### Endpoint: `GET /api/articles/{id}` (3 samples)

All return HTTP 200. Fields returned: `name`, `alternateName`, `text`, `image`, `coverImage`.

| Article ID | name | description | image | coverImage | url | text | articleSection | identifier |
|------------|------|-------------|-------|------------|-----|------|----------------|------------|
| montreal-with-teenagers | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| atelier-evia | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| la-fabrique-ethique | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |

### Article Pages: `GET /articles/{id}`

| URL | Status |
|-----|--------|
| /articles/montreal-with-teenagers | 200 |
| /articles/atelier-evia | 200 |
| /articles/la-fabrique-ethique | 200 |

---

## Task 2: Image Object API Findings

### Endpoint: `GET /api/image-objects/`

- **Status:** 200 but returns **HTML** (the Nuxt page, not JSON)
- **Root cause:** No `server/api/image-objects/index.get.ts` exists. The trailing-slash URL falls through to the Nuxt page router instead of the API.

### Endpoint: `GET /api/image-objects/{id}` (tried IDs: 100, 200, 500, 1000, 50000, 100000)

- All return **404** — no valid image object IDs found with numeric test values
- The `IMAGE_OBJECT_BY_IDENTIFIER_QUERY` uses `$identifierId: ItemId!` which requires a DatoCMS record ID. Without a list endpoint or known IDs, image objects are effectively unreachable.

### Image Object Pages: `GET /image-objects/{id}`

| URL | Status |
|-----|--------|
| /image-objects/100 | 503 (upstream API failure) |

---

## Task 3: Code-Level Findings (9 files)

---

### Issue #14: `ALL_ARTICLES_QUERY` missing critical fields

- **File:** `server/utils/graphql-queries.ts` (`ALL_ARTICLES_QUERY`)
- **Severity:** major
- **Category:** data
- **Bug:** Query selects only `identifier`, `name`, `image`. Missing: `description`, `url`, `coverImage`, `alternateName`.
- **Impact:** Any component rendering article list items (CardList, Card, CardCl, ImageList, PopularPosts) that accesses `article.description`, `article.url`, or `article.coverImage` gets `undefined`.
- **Downstream effects:**
  - `Card.vue` renders `v-html="article.description"` → empty paragraph
  - `CardCl.vue` / `CardImgMiddle.vue` truncate `article.description ?? ''` → empty text
  - `getPath(article)` returns `""` because `article.url` is missing → all card links (`<NuxtLink :to="path">`) point to `""` (current page) instead of the article detail page
  - `useImageAttrs` falls back to `article.image` (which works), but `article.coverImage` is never available for preference

---

### Issue #15: `LATEST_ARTICLES_WITH_LIMIT_QUERY` missing `description`, `url`, `coverImage`

- **File:** `server/utils/graphql-queries.ts` (`LATEST_ARTICLES_WITH_LIMIT_QUERY`)
- **Severity:** major
- **Category:** data
- **Bug:** Selects `identifier`, `name`, `image`, `_updatedAt`, `jsonLd(markdown: false)`. Missing: `description`, `url`, `coverImage`, `alternateName`.
- **Impact:** Homepage `index.vue` fetches latest articles with limit=6 and passes them to `<CardList>` → `<Card>`. Cards render with no description text and broken links (links to `""` because `url` is missing).
- **Note:** `jsonLd` field returns empty strings for all tested articles — may be deprecated or unconfigured in DatoCMS.

---

### Issue #16: `ARTICLE_BY_IDENTIFIER_QUERY` missing `identifier`, `url`, `description`

- **File:** `server/utils/graphql-queries.ts` (`ARTICLE_BY_IDENTIFIER_QUERY`)
- **Severity:** major
- **Category:** data
- **Bug:** Selects `name`, `alternateName`, `text`, `image`, `coverImage`. Missing: `identifier`, `url`, `description`.
- **Impact:**
  - `articles/[id].vue` uses `article.description` in `useSeoHead()` → always empty string for meta description
  - The page renders correctly (has `text`, `name`, `coverImage`, `image`) but SEO is degraded
  - No `identifier` returned means any downstream code relying on it gets `undefined`

---

### Issue #17: Article card links are dead — `getPath()` returns empty string

- **File:** `app/components/card.vue`, `card-cl.vue`, `card-img-middle.vue`, `image-list.vue`, `popular-posts.vue`
- **Severity:** critical
- **Category:** navigation
- **Bug:** All card components call `getPath(article)` which extracts `article.url`. But neither `ALL_ARTICLES_QUERY` nor `LATEST_ARTICLES_WITH_LIMIT_QUERY` includes `url` in its field selection. `getPath()` returns `""`, so every `<NuxtLink :to="path">` effectively links to the current page.
- **Impact:** Users cannot navigate to any article from card components. All article cards are non-functional links.
- **Fix:** Add `url` to `ALL_ARTICLES_QUERY` and `LATEST_ARTICLES_WITH_LIMIT_QUERY`, OR change `getPath()` to fall back to `/articles/${article.identifier}` when `url` is missing.

---

### Issue #18: `buildSrcSet()` adds `?w=` params incompatible with `images.circusliving.com`

- **File:** `app/utils/image-service.ts` (line 68–76)
- **Severity:** major
- **Category:** image
- **Bug:** `buildSrcSet()` appends `?w=320`, `?w=480`, etc. to image URLs. This works for DatoCMS image API (`datocms-assets.com`) but NOT for the custom image host `images.circusliving.com`, which doesn't support query-param resizing.
- **Impact:** All `srcset` attributes contain broken URLs. Browsers may fail to load responsive variants. The `src` attribute (original URL without `?w=`) works as fallback, so images render at full size only.
- **Note:** Already identified as Issue #10 in p02-01. Including here for code-level root cause traceability.
- **Affected components:** Every component using `useImageAttrs()` or calling `buildSrcSet()` directly — `card.vue`, `card-cl.vue`, `card-img-middle.vue`, `hero-title.vue`, `image-list.vue`, `popular-posts.vue`, `galleries/[id].vue`, `image-objects/[id].vue`.

---

### Issue #19: `side-menu.vue` `displayName()` uses `??` instead of `||`

- **File:** `app/components/side-menu.vue` (line 7)
- **Severity:** critical
- **Category:** navigation
- **Bug:** `return item.menuName ?? item.name;` — Nullish coalescing (`??`) only catches `null`/`undefined`, NOT empty string `""`. The API returns `menuName: ""` for many items, so `displayName()` returns `""` and menu labels are invisible.
- **Fix:** Change to `return item.menuName || item.name;`
- **Note:** Already identified as Issue #3 in p02-01. Including here for code-level confirmation. The exact line is `side-menu.vue:8`.

---

### Issue #20: `hero-title.vue` coupled to `HeroImage` interface — no fallback for string image URLs

- **File:** `app/components/hero-title.vue` (lines 3–8)
- **Severity:** minor
- **Category:** robustness
- **Props type:** `image?: HeroImage` where `HeroImage = { url: string; alt?: string; }`
- **Behavior:** The component expects an object with `url` property. This works correctly when called from `index.vue` (which constructs `{ url: webPage.value.coverImage }`) and `articles/[id].vue`. No bug per se, but:
  - If `props.image` is undefined (no hero image available), `src` computes to `""` and the `v-if="src"` correctly hides the `<img>` — black background shows instead.
  - Coupled with Issue #1 (homepage gets array instead of WebPage), the hero is always empty on homepage.

---

### Issue #21: Web pages API routing conflict — `index.get.ts` shadows `[...path].get.ts` for root path

- **File:** `server/api/web-pages/index.get.ts` + `server/api/web-pages/[...path].get.ts`
- **Severity:** critical
- **Category:** routing
- **Bug:** `GET /api/web-pages/` matches `index.get.ts` (returns ALL pages as array) instead of `[...path].get.ts` with path=`/` (returns single homepage WebPage). The `useWebPage()` composable calls `useFetch('/api/web-pages/')` for the homepage path `/`, which resolves to the index route.
- **Impact:** Homepage gets an array of 42 WebPages instead of the single homepage WebPage object. This cascades to Issues #1 (no hero image), #2 (empty title).
- **Fix options:**
  1. Rename `index.get.ts` to something like `list.get.ts` and expose at `/api/web-pages-list`
  2. Add disambiguation in the catch-all handler for root path
  3. Change `useWebPage()` to use a different URL pattern for homepage (e.g., `/api/web-pages/home`)
- **Note:** Already identified as Issue #1 root cause in p02-01. Confirmed: `curl http://localhost:3000/api/web-pages/` returns array of 42 items.

---

### Issue #22: No image-objects list API endpoint

- **File:** `server/api/image-objects/` (only has `[id].get.ts`)
- **Severity:** minor
- **Category:** api
- **Bug:** There is no `index.get.ts` for `/api/image-objects/`. Requesting `/api/image-objects/` falls through to the Nuxt page router and returns HTML (200 with HTML content type).
- **Impact:** Cannot enumerate image objects via API. Gallery/image-object pages require knowing exact DatoCMS ItemId values, which are not discoverable through any API endpoint.
- **Note:** The `IMAGE_OBJECT_BY_IDENTIFIER_QUERY` uses `$identifierId: ItemId!`, meaning the URL param must be a DatoCMS numeric record ID, not a human-readable slug. Without a list endpoint or ID resolution mechanism, these pages are effectively orphaned.

---

### Issue #23: Image object/gallery pages return 503

- **File:** `app/pages/galleries/[id].vue`, `app/pages/image-objects/[id].vue`
- **Severity:** major
- **Category:** routing
- **Bug:** Both pages fetch from `/api/image-objects/${route.params.id}` which calls `fetchImageObject(id)`. When given non-existent IDs, the API returns 404. But even with plausible IDs, the query structure (`identifier: { anyIn: [$identifierId] }`) requires the DatoCMS ItemId of an "identifier" junction record, not the image object's own ID.
- **Result:** `GET /galleries/test-id` → 503, `GET /image-objects/100` → 503
- **Root cause:** The gallery/image-object lookup pipeline uses a 2-step resolution (value → identifier record → image object) but the page only does a single direct lookup. The `identifiers/[value].get.ts` API exists but none of the tested values resolve.
- **Impact:** No gallery or image-object detail page is functional.

---

### Issue #24: `LATEST_ARTICLES_QUERY` hardcoded to `first: 2` — unused but misleading

- **File:** `server/utils/graphql-queries.ts` (`LATEST_ARTICLES_QUERY`)
- **Severity:** cosmetic
- **Category:** code-quality
- **Bug:** `LATEST_ARTICLES_QUERY` hardcodes `first: 2` and is defined but never imported/used. `dato-fetch.ts` imports and uses `LATEST_ARTICLES_WITH_LIMIT_QUERY` instead. Dead code.
- **Impact:** None functional. Maintenance confusion — two queries with overlapping names.

---

### Issue #25: `LATEST_ARTICLES_BY_TAG_QUERY` has hardcoded tag ID `"731168"`

- **File:** `server/utils/graphql-queries.ts` (`LATEST_ARTICLES_BY_TAG_QUERY`)
- **Severity:** minor
- **Category:** code-quality
- **Bug:** Hardcoded magic number tag ID `"731168"` in the GraphQL filter. This query is also not imported by `dato-fetch.ts` (dead code).
- **Impact:** None functional (unused), but if it were used, the hardcoded ID is fragile and environment-specific.

---

### Issue #26: `Place` type in `menu.ts` missing `description` and `url`

- **File:** `shared/types/menu.ts` (`Place` interface)
- **Severity:** minor
- **Category:** types
- **Bug:** `Place` interface has `name`, `alternateName`, `text`, `image`, `coverImage` but not `description` or `url`. The `PLACE_BY_IDENTIFIER_QUERY` selects `name`, `alternateName`, `description`, `url` and `image { ... }` — `description` is queried but not typed.
- **Impact:** TypeScript won't surface `place.description` from API responses. Minor type safety gap.

---

### Issue #27: Article detail page SEO — `description` meta always empty

- **File:** `app/pages/articles/[id].vue` (line 30)
- **Severity:** major
- **Category:** seo
- **Bug:** `useSeoHead()` uses `article.value?.description ?? ''` for meta description, but `ARTICLE_BY_IDENTIFIER_QUERY` does not select `description`. Result: every article page has `<meta name="description" content="">`.
- **Impact:** Google and other search engines see empty meta descriptions for all article pages, degrading SEO.
- **Fix:** Add `description` to `ARTICLE_BY_IDENTIFIER_QUERY`.

---

## Task 4: Gallery Routes Findings

### Misspelled redirect route

- **File:** `server/routes/gallaries/[id].get.ts`
- **Behavior:** 301 redirect from `/gallaries/{id}` → `/galleries/{id}` — **working correctly**
- **Note:** The directory name `gallaries` is intentionally misspelled to match legacy URLs and redirect to the correct spelling. This is appropriate SEO preservation.

### Gallery pages

| URL | Status | Notes |
|-----|--------|-------|
| `/gallaries/test-id` | 301 → `/galleries/test-id` | Redirect works correctly |
| `/galleries/test-id` | 503 | Upstream API error — image object lookup fails |
| `/galleries/100` | 503 | Same — no valid image object found |

### Gallery → Image Object API chain

The gallery page (`galleries/[id].vue`) calls `/api/image-objects/{id}` which uses `IMAGE_OBJECT_BY_IDENTIFIER_QUERY` with `$identifierId: ItemId!`. The chain is:
1. URL slug (e.g., `some-image-name`) → needs resolution to DatoCMS ItemId
2. No automatic slug → ItemId resolution exists in the gallery page
3. The `identifiers/[value].get.ts` endpoint exists but tested values don't resolve
4. **Result:** All gallery pages are broken — 503 for any ID

---

## Summary of New Issues (continuing from #13)

| # | Title | Severity | Category | File(s) |
|---|-------|----------|----------|---------|
| 14 | `ALL_ARTICLES_QUERY` missing description, url, coverImage, alternateName | major | data | graphql-queries.ts |
| 15 | `LATEST_ARTICLES_WITH_LIMIT_QUERY` missing description, url, coverImage | major | data | graphql-queries.ts |
| 16 | `ARTICLE_BY_IDENTIFIER_QUERY` missing identifier, url, description | major | data | graphql-queries.ts |
| 17 | Article card links dead — `getPath()` returns empty string | critical | navigation | card.vue, card-cl.vue, etc. |
| 18 | `buildSrcSet()` `?w=` params break `images.circusliving.com` URLs | major | image | image-service.ts |
| 19 | `displayName()` uses `??` not `||` for empty menuName | critical | navigation | side-menu.vue |
| 20 | `hero-title.vue` no fallback for undefined image | minor | robustness | hero-title.vue |
| 21 | Web pages API routing conflict — index shadows catch-all for `/` | critical | routing | web-pages/index.get.ts |
| 22 | No image-objects list API endpoint | minor | api | server/api/image-objects/ |
| 23 | Image object/gallery pages return 503 | major | routing | galleries/[id].vue, image-objects/[id].vue |
| 24 | `LATEST_ARTICLES_QUERY` dead code | cosmetic | code-quality | graphql-queries.ts |
| 25 | `LATEST_ARTICLES_BY_TAG_QUERY` hardcoded tag + dead code | minor | code-quality | graphql-queries.ts |
| 26 | `Place` type missing `description` and `url` | minor | types | shared/types/menu.ts |
| 27 | Article detail page SEO meta description always empty | major | seo | articles/[id].vue |

**Critical:** 3 (#17, #19, #21) | **Major:** 6 (#14, #15, #16, #18, #23, #27) | **Minor:** 4 (#20, #22, #25, #26) | **Cosmetic:** 1 (#24)

**Total new issues: 14** (numbered #14–#27)

---

## Cross-References to p02-01 Issues

| p02-01 Issue | p02-02 Issue | Relationship |
|-------------|-------------|--------------|
| #1 (Hero image not showing) | #21 | Same root cause confirmed |
| #2 (Page title empty) | #21 | Same root cause confirmed |
| #3 (Menu items missing labels) | #19 | Same bug confirmed at code level |
| #6 (Cards missing description) | #14, #15 | Root cause: GraphQL queries |
| #10 (Image URLs fail with ?w=) | #18 | Same issue, code-level trace |

---

## Dependency Graph

```
#21 (routing conflict) ──► #1 (no hero) + #2 (no title)
#14, #15 (missing query fields) ──► #6 (no description) + #17 (dead links)
#17 (dead links) ──► all card/list components non-navigable
#22 (no list endpoint) + #23 (503 pages) ──► galleries/image-objects completely broken
#18 (?w= params) ──► degraded image loading across all components
```
