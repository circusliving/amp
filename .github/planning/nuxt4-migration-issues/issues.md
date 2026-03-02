# Master Issue List — Nuxt 4 Migration Audit

**Generated:** 2026-03-02
**Live site:** https://circusliving.com/
**Local dev:** http://localhost:3000/
**Method:** Code-based audit + API verification + component analysis

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 8 |
| Major    | 13 |
| Minor    | 13 |
| Cosmetic | 6 |
| **Total** | **40** |

(Issue #8 resolved during audit, #19/#21/#39 confirm earlier issues)

---

## Critical Issues (8)

### Issue #1: Hero image not showing on homepage

- **Pages:** `/`
- **Category:** image
- **Root cause:** `useWebPage()` calls `/api/web-pages/` for path `/`. This matches `server/api/web-pages/index.get.ts` (returns all 42 pages as array) instead of `[...path].get.ts` (single page). So `webPage.value` is an array, not a `WebPage` — `coverImage` is `undefined`.
- **File:** [server/api/web-pages/index.get.ts](server/api/web-pages/index.get.ts), [app/composables/use-web-page.ts](app/composables/use-web-page.ts)

### Issue #3: Sidebar menu items missing text labels

- **Pages:** All pages (sidebar)
- **Category:** navigation
- **Root cause:** `displayName()` uses `item.menuName ?? item.name`. API returns `menuName: ""` (empty string). Nullish coalescing (`??`) doesn't catch empty string. Should use `||`.
- **File:** [app/components/side-menu.vue](app/components/side-menu.vue)

### Issue #4: Social icons render as colored squares

- **Pages:** All pages (sidebar + footer)
- **Category:** icon
- **Root cause:** `<ClIcons>` SVG sprite sheet not mounted in `app.vue` or `default.vue`. `<Icon>` component uses `<use href="#icon-{name}">` referencing `<symbol>` definitions that don't exist in the DOM.
- **File:** [app/app.vue](app/app.vue), [app/components/cl-icons.vue](app/components/cl-icons.vue)

### Issue #14: Section root pages return 404

- **Pages:** `/side-shows`, `/back-yard`, `/after-shows`, `/contact`
- **Category:** routing
- **Root cause:** `pages/[section]/[page].vue` handles two-segment paths, but no `pages/[section]/index.vue` or `pages/[section].vue` exists for single-segment section URLs. APIs return 200 for these pages — only the front-end route is missing.
- **File:** [app/pages/[section]/](app/pages/%5Bsection%5D/)

### Issue #17: Article card links are dead (`getPath()` returns `""`)

- **Pages:** All pages with article cards
- **Category:** navigation
- **Root cause:** `getPath()` calls `new URL(item.url)` but no GraphQL query includes the `url` field. `item.url` is always `undefined`, so `getPath()` returns `""`. Every `<NuxtLink :to="getPath(item)">` is a dead link.
- **File:** [app/utils/helpers.ts](app/utils/helpers.ts), [server/utils/graphql-queries.ts](server/utils/graphql-queries.ts)

### Issue #28: Canonical/OG URLs missing protocol

- **Pages:** All pages
- **Category:** seo
- **Root cause:** `useSeoHead()` builds canonical URL as `${siteUrl}${path}` but `siteUrl` from runtime config may not include `https://`, producing invalid OG/canonical URLs.
- **File:** [app/composables/use-seo-head.ts](app/composables/use-seo-head.ts)

### Issue #36: Section pages fetch generic articles, not section-specific

- **Pages:** All `/side-shows/*`, `/back-yard/*`, `/after-shows/*` sub-pages
- **Category:** content
- **Root cause:** `[section]/[page].vue` calls `useFetch('/api/articles/latest', { query: { limit: 12 } })` — always the same 12 latest articles. It ignores `webPage.widgetCollections` and `widgetTags` which should filter articles by section/category. Widget-driven pages (e.g., `cabinet-of-curiosities` with `widget: "imageList"`) get completely wrong content.
- **File:** [app/pages/[section]/[page].vue](app/pages/%5Bsection%5D/%5Bpage%5D.vue#L7-L9)

### Issue #39: `<ClIcons>` SVG sprite not mounted (re-confirms #4)

- **Pages:** All pages
- **Category:** icon
- **Root cause:** Same as #4. Neither `app.vue` nor `default.vue` includes `<ClIcons />`.
- **File:** [app/app.vue](app/app.vue)

---

## Major Issues (13)

### Issue #2: Page `<title>` is empty on homepage

- **Pages:** `/`
- **Category:** seo
- **Root cause:** Same root cause as #1. `useWebPage()` gets array instead of `WebPage`, so title resolves to empty.

### Issue #5: Homepage shows wrong articles

- **Pages:** `/`
- **Category:** content
- **Root cause:** Homepage fetches `/api/articles/latest?limit=6` returning 6 most recent articles. Live site shows 3 curated/featured articles. Query, count, and selection criteria all differ.

### Issue #6: Article cards missing description text

- **Pages:** `/`, section pages
- **Category:** content
- **Root cause:** `LATEST_ARTICLES_WITH_LIMIT_QUERY` GraphQL query doesn't include `description` field. Cards render `v-html="article.description"` but the field is always undefined.
- **File:** [server/utils/graphql-queries.ts](server/utils/graphql-queries.ts)

### Issue #7: Article cards vertical instead of 3-column grid

- **Pages:** `/`
- **Category:** layout
- **Root cause:** `CardList` uses `card-columns` CSS class — a Bootstrap 4 class removed in Bootstrap 5. No Bootstrap is loaded, so cards stack vertically.
- **File:** [app/components/card-list.vue](app/components/card-list.vue)

### Issue #10: Image URLs fail with `?w=` query parameter

- **Pages:** All pages with images
- **Category:** image
- **Root cause:** `buildSrcSet()` appends `?w=<width>` params (designed for DatoCMS Image API). But `images.circusliving.com` is a custom host that doesn't support `?w=` resizing — images already have size in the path (e.g., `375x222/`). The `?w=` param causes request failures.
- **File:** [app/utils/image-service.ts](app/utils/image-service.ts)

### Issue #15: `ALL_ARTICLES_QUERY` missing fields

- **Pages:** Article listings
- **Category:** data
- **Root cause:** Query returns only `identifier`, `name`, `image`. Missing: `description`, `url`, `coverImage`, `alternateName`.
- **File:** [server/utils/graphql-queries.ts](server/utils/graphql-queries.ts)

### Issue #16: `ARTICLE_BY_IDENTIFIER_QUERY` missing fields

- **Pages:** Article detail pages
- **Category:** data
- **Root cause:** Query missing `identifier`, `url`, `description`. Article detail pages can't build canonical URLs or show descriptions.
- **File:** [server/utils/graphql-queries.ts](server/utils/graphql-queries.ts)

### Issue #18: `buildSrcSet()` incompatible with custom image host (code trace of #10)

- **Pages:** All pages
- **Category:** image
- **Root cause:** `buildSrcSet()` assumes DatoCMS image API. Generates `?w=320`, `?w=480`, etc. `images.circusliving.com` serves pre-sized images at path-level (e.g., `375x222/`), so width params are ignored/cause errors.
- **File:** [app/utils/image-service.ts](app/utils/image-service.ts)

### Issue #29: `card-columns` Bootstrap 4 class — cards don't grid (code trace of #7)

- **Pages:** Homepage, section pages
- **Category:** layout
- **Root cause:** Same as #7. No Bootstrap CSS loaded, `card-columns` has no effect.
- **File:** [app/components/card-list.vue](app/components/card-list.vue)

### Issue #30: No Google Fonts loaded

- **Pages:** All pages
- **Category:** visual
- **Root cause:** `_variables.scss` references `Euphoria Script`, `Roboto Slab`, `Roboto Condensed`, `Roboto` but no `@import` or `<link>` loads them. `nuxt.config.ts` doesn't configure `@nuxtjs/google-fonts` or any font loading. All text renders in system fallback fonts.
- **File:** [nuxt.config.ts](nuxt.config.ts), [app/assets/scss/_variables.scss](app/assets/scss/_variables.scss)

### Issue #34: `useFetch()` inside Pinia store actions

- **Pages:** N/A (architectural)
- **Category:** code-quality
- **Root cause:** `article.ts` and `navigation.ts` stores use `useFetch()` inside Pinia actions. `useFetch` is a composable meant for `<script setup>` — using it inside store actions is fragile and can cause hydration mismatches. Should use `$fetch` instead.
- **File:** [app/stores/article.ts](app/stores/article.ts), [app/stores/navigation.ts](app/stores/navigation.ts)

### Issue #38: Social icon hover makes icons invisible

- **Pages:** All pages (sidebar + footer)
- **Category:** visual
- **Root cause:** CSS hover sets `background-color` to the icon's fill color (e.g., Facebook blue) but the SVG icon fill is the same color, making icons invisible on hover.
- **File:** [app/components/social-bar.vue](app/components/social-bar.vue)

### Issue #40: Article SEO dates never rendered

- **Pages:** `/articles/*`
- **Category:** seo
- **Root cause:** `ARTICLE_BY_IDENTIFIER_QUERY` doesn't select `_firstPublishedAt`, `_createdAt`, `_updatedAt`. Article detail pages can't set `article:published_time` or `article:modified_time` Open Graph meta tags.
- **File:** [server/utils/graphql-queries.ts](server/utils/graphql-queries.ts)

---

## Minor Issues (13)

### Issue #9: Quotes carousel missing background image

- **Pages:** `/`
- **Category:** image
- **Root cause:** CSS `background-attachment: fixed` + `overflow: hidden` combination can hide the parallax background. Image URL may need verification.
- **File:** [app/components/quotes-carousel.vue](app/components/quotes-carousel.vue)

### Issue #12: GA firing on localhost

- **Pages:** All pages
- **Category:** functionality
- **Root cause:** `analytics.client.ts` loads GA tag unconditionally without checking hostname/environment. Pollutes production analytics with dev traffic.
- **File:** [app/plugins/analytics.client.ts](app/plugins/analytics.client.ts)

### Issue #20: `hero-title.vue` coupled to #1

- **Pages:** `/`
- **Category:** image
- **Root cause:** Component correctly hides `<img>` when image is undefined, but the homepage always passes undefined due to Issue #1.

### Issue #22: No image-objects list API endpoint

- **Pages:** N/A
- **Category:** api
- **Root cause:** No `server/api/image-objects/index.get.ts` exists. Can't discover image object IDs programmatically.

### Issue #23: Gallery/image-object pages return 503

- **Pages:** `/galleries/*`, `/image-objects/*`
- **Category:** rendering
- **Root cause:** The ID lookup pipeline (slug → identifier → image object) fails. `server/api/image-objects/[id].get.ts` returns 503 for non-numeric IDs and 404 for numeric IDs that don't exist.

### Issue #31: Dead `fontello-social` font-family CSS reference

- **Pages:** All pages (sidebar/footer)
- **Category:** css
- **Root cause:** `social-bar.vue` references `fontello-social` font-family but no such font is loaded.
- **File:** [app/components/social-bar.vue](app/components/social-bar.vue)

### Issue #32: Google Plus link dead

- **Pages:** All pages
- **Category:** content
- **Root cause:** Social bar includes Google Plus link — service shut down April 2019.
- **File:** [app/components/social-bar.vue](app/components/social-bar.vue)

### Issue #33: Analytics fires on all environments (duplicate of #12)

- **Pages:** All pages
- **Root cause:** Same as #12.

### Issue #37: Error page renders outside NuxtLayout

- **Pages:** Error pages
- **Category:** layout
- **Root cause:** `error.vue` renders standalone without header/footer/sidebar. Should wrap content in `<NuxtLayout>`.
- **File:** [app/error.vue](app/error.vue)

### Issue #41: Sidebar lacks dialog a11y attributes

- **Pages:** All pages
- **Category:** accessibility
- **Root cause:** Sidebar toggles visibility but lacks `role="dialog"`, `aria-modal`, and focus trap. WCAG 2.4.3 violation.
- **File:** [app/components/side-bar.vue](app/components/side-bar.vue)

### Issue #42: `page-body.vue` has `loading: lazy` in CSS (invalid)

- **Pages:** Section pages
- **Category:** code-quality
- **Root cause:** CSS property `loading: lazy` is not valid CSS — only works as an HTML attribute.
- **File:** [app/components/page-body.vue](app/components/page-body.vue)

### Issue #44: Gallery page renders same name as both h1 and h2

- **Pages:** `/galleries/*`
- **Category:** accessibility
- **Root cause:** `imageObject.name` is used for both the `<h1>` (in `<HeroTitle>`) and an `<h2>` in the body.
- **File:** [app/pages/galleries/[id].vue](app/pages/galleries/%5Bid%5D.vue)

### Issue #45: `@nuxt/image` domains missing `images.circusliving.com`

- **Pages:** All pages
- **Category:** config
- **Root cause:** If `<NuxtImg>` is used for `images.circusliving.com` URLs, the domain must be listed in `nuxt.config.ts` image module config.
- **File:** [nuxt.config.ts](nuxt.config.ts)

---

## Cosmetic Issues (6)

### Issue #11: Vue warning — extraneous non-props attributes

- **Pages:** `/` (dev mode only)
- **Category:** console
- **Root cause:** Nuxt DevTools overlay component. Dev-mode artifact, not a production issue.

### Issue #13: Footer copyright year hardcoded

- **Pages:** All pages
- **Category:** content
- **Root cause:** Both live and local use hardcoded year. Not a discrepancy but a maintenance concern.

### Issue #24: `LATEST_ARTICLES_QUERY` is dead code

- **Pages:** N/A
- **Category:** code-quality
- **Root cause:** Query with hardcoded `first: 2` is never imported anywhere.
- **File:** [server/utils/graphql-queries.ts](server/utils/graphql-queries.ts)

### Issue #25: `LATEST_ARTICLES_BY_TAG_QUERY` is dead code

- **Pages:** N/A
- **Category:** code-quality
- **Root cause:** Has hardcoded tag ID, never imported.
- **File:** [server/utils/graphql-queries.ts](server/utils/graphql-queries.ts)

### Issue #43: `rel="author"` on `<footer>` element is invalid

- **Pages:** `/`
- **Category:** html-validity
- **Root cause:** `quote-block.vue` uses `<footer rel="author">` but `rel` is not valid on `<footer>`.
- **File:** [app/components/quote-block.vue](app/components/quote-block.vue)

### Issue #46: Homepage text content without `<p>` wrapper

- **Pages:** `/`
- **Category:** accessibility
- **Root cause:** Homepage intro text uses bare text nodes and `<br>` instead of semantic `<p>` elements.
- **File:** [app/pages/index.vue](app/pages/index.vue)

---

## Additional Observations

| Finding | Detail |
|---------|--------|
| Dark-art URL mismatch | CMS `url` field has `/sideshows/dark-art` (no hyphen) while route is `/side-shows/dark-art` |
| `concessions` page missing from CMS | API returns 404 for `/api/web-pages/concessions` |
| `gallaries` directory misspelling | `server/routes/gallaries/` instead of `galleries` — redirect works but naming is inconsistent |
| Gallery/image-object orphaned | No navigation or list endpoint to discover these pages |
| Twitter → X.com | Social link points to `twitter.com` but service rebranded to X |
| `popular-posts.vue` uses `formatDate()` | Should use `<NuxtTime>` per project standards |
| Galleries and image-objects near-identical | `galleries/[id].vue` and `image-objects/[id].vue` are duplicated code |

---

## Deduplicated Issue Count

After removing duplicates (#8 resolved, #19 = #3, #21 = #1, #33 = #12, #39 = #4, #18 = #10, #29 = #7):

**Unique issues: 40** (8 critical, 13 major, 13 minor, 6 cosmetic)
