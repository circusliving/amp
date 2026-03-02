# Issues — p03: Layout/Shell Component & Cross-Cutting Audit

**Audited:** 2026-03-02
**Local:** http://localhost:3000/
**Scope:** app.vue, layouts/default.vue, error.vue, 10 shell/UI components, analytics plugin, 3 stores, SCSS, section/article pages

---

## Issue #28: Canonical URL and OG URL missing `https://` protocol

- **File:** [app/composables/use-seo-head.ts](app/composables/use-seo-head.ts#L27-L30) + runtime config
- **Severity:** critical
- **Category:** seo
- **Bug:** `useSeoHead()` constructs canonical URLs as `${canonicalBaseUrl}${path}`. The runtime config `NUXT_PUBLIC_CANONICAL_BASE_URL` is set to `www.circusliving.com` (no protocol). The rendered HTML shows:
  - `<link rel="canonical" href="www.circusliving.com/">`
  - `<meta property="og:url" content="www.circusliving.com/">`
- **Impact:** Search engines interpret relative canonical URLs differently. Google treats `www.circusliving.com/` as a relative path (not a URL), breaking canonical signal for every page. OG URLs are also invalid per the Open Graph protocol which requires absolute URLs with scheme.
- **Fix:** Either:
  1. Change env var value to `https://www.circusliving.com`
  2. Add protocol fallback in `useSeoHead()`: `const base = ensureProtocol(config.public.canonicalBaseUrl)`

---

## Issue #29: `card-list.vue` uses Bootstrap 4's `card-columns` class (removed in Bootstrap 5)

- **File:** [app/components/card-list.vue](app/components/card-list.vue#L5)
- **Severity:** major
- **Category:** layout
- **Bug:** `<div class="card-columns">` was a Bootstrap 4 CSS class that arranged cards in a masonry-style column layout. Bootstrap 5 (v5.3.8, used by this project) removed `card-columns` entirely. The class has no CSS rules, so cards stack vertically with no columnar layout.
- **Impact:** Homepage "latest articles" section and all section pages render cards in a single vertical stack instead of a multi-column grid. Visually broken compared to the live site.
- **Fix:** Replace with Bootstrap 5 grid system (`row` + `col-md-4`) or CSS `columns` / Masonry layout.
- **Confirmed:** Rendered HTML shows `<div class="card-columns">` with no matching CSS rules.

---

## Issue #30: No Google Fonts loaded

- **File:** [nuxt.config.ts](nuxt.config.ts) (missing), [app/assets/scss/_variables.scss](app/assets/scss/_variables.scss)
- **Severity:** major
- **Category:** visual
- **Bug:** CSS references these Google Fonts but none are loaded via `<link>`, `@import`, or `@font-face`:
  - `Roboto` (body font in `$font-family-sans-serif`)
  - `Roboto Slab` (headings in hero-title, articles, galleries, card-cl)
  - `Roboto Condensed` (popular-posts heading)
  - `Euphoria Script` (index.vue h1/h2, card-img-middle h4, card-cl h4)
- **Impact:** All text renders in system fallback fonts. The site's visual identity (gothic/serif headings, handwriting accent font) is completely lost.
- **Fix:** Add Google Fonts link to `nuxt.config.ts` via `app.head.link` or use `@nuxtjs/google-fonts` module.
- **Files affected:** [app/pages/index.vue](app/pages/index.vue#L117), [app/components/hero-title.vue](app/components/hero-title.vue#L84), [app/components/card-cl.vue](app/components/card-cl.vue#L56-L62), [app/components/card-img-middle.vue](app/components/card-img-middle.vue#L66), [app/components/popular-posts.vue](app/components/popular-posts.vue#L84), [app/pages/articles/[id].vue](app/pages/articles/%5Bid%5D.vue#L88)

---

## Issue #31: Dead `fontello-social` font-family in social-bar CSS

- **File:** [app/components/social-bar.vue](app/components/social-bar.vue#L48)
- **Severity:** minor
- **Category:** code-quality
- **Bug:** `.social-bar__item` declares `font-family: 'fontello-social'`. This was the icon font used by the old AMP site. The migration replaced font icons with SVG sprites (`<Icon>` + `<ClIcons>`), but the CSS reference was not removed.
- **Impact:** No visual impact (font doesn't load, browser falls back to default serif). The declaration is dead code that creates confusion about the rendering approach.
- **Fix:** Remove `font-family: 'fontello-social';` from `.social-bar__item`.

---

## Issue #32: Google Plus dead link in social bar

- **File:** [app/components/social-bar.vue](app/components/social-bar.vue#L5)
- **Severity:** minor
- **Category:** content
- **Bug:** Social links include `{ href: 'https://plus.google.com/+CircusLiving', label: 'Google Plus', ... }`. Google Plus was shut down on April 2, 2019. The URL redirects to a Google support page.
- **Impact:** Users clicking the Google Plus icon are sent to a dead service page. The icon also takes up visual space for a non-functional service.
- **Fix:** Remove the Google Plus entry from the `links` array. Also remove the `icon-google-plus` symbol from `cl-icons.vue`.

---

## Issue #33: Analytics plugin fires GA on all environments

- **File:** [app/plugins/analytics.client.ts](app/plugins/analytics.client.ts#L6-L8)
- **Severity:** minor
- **Category:** privacy/analytics
- **Bug:** The plugin checks `if (!tagId) return;` but does NOT check the environment. The `NUXT_PUBLIC_GA_TAG_ID` is set to `G-RYK95E2EV9` (confirmed in rendered `__NUXT__` payload), so GA tracking fires on localhost/dev/staging.
- **Impact:** Dev/testing page views pollute production analytics data. Also a privacy concern for developers.
- **Fix:** Add environment check:
  ```typescript
  if (!tagId || import.meta.dev) return;
  ```
  Or check `process.env.NODE_ENV !== 'production'`.

---

## Issue #34: `useFetch` inside Pinia store actions — anti-pattern

- **File:** [app/stores/article.ts](app/stores/article.ts#L18-L22), [app/stores/navigation.ts](app/stores/navigation.ts#L17-L21)
- **Severity:** major
- **Category:** architecture
- **Bug:** Both stores call `useFetch()` inside action methods:
  - `article.ts` → `fetchLatest()` calls `useFetch('/api/articles/latest', ...)`
  - `navigation.ts` → `fetchMenu()` calls `useFetch('/api/menu')`

  `useFetch` is a Nuxt composable that must be called during component/composable setup context. Calling it inside a store action is fragile because:
  1. The `useFetch` caching key is auto-generated and not deterministic across calls
  2. Each invocation creates a new watcher and deduplication entry
  3. If the action is called from a non-setup context (event handler, timer), it will fail with "nuxt instance unavailable"
  4. Multiple components calling the same action create duplicate watchers
- **Currently works because:** `popular-posts.vue` calls `articleStore.fetchLatest()` from `<script setup>` body (Nuxt context IS available). But this is coincidental, not architectural.
- **Fix:** Replace `useFetch` with `$fetch` inside store actions (which is what the layout already does for navigation data).
- **Cross-reference:** The layout's `default.vue` correctly uses `useAsyncData('navigation', () => $fetch(...))` — this is the proper pattern.

---

## Issue #35: Navigation store `fetchMenu()` is dead code

- **File:** [app/stores/navigation.ts](app/stores/navigation.ts#L16-L22)
- **Severity:** cosmetic
- **Category:** code-quality
- **Bug:** The `fetchMenu()` action in the navigation store is never called anywhere. The layout (`default.vue`) fetches menu data directly via `useAsyncData('navigation', () => $fetch<MenuItem[]>('/api/menu'))` and assigns the result to `navigationStore.menuItems`. The store's `fetchMenu()` method is dead code containing the anti-pattern from Issue #34.
- **Impact:** No functional impact. Maintenance confusion — two different data-fetch patterns for the same data.
- **Fix:** Remove `fetchMenu()` from the navigation store.

---

## Issue #36: `[section]/[page].vue` fetches generic latest articles, not section-filtered

- **File:** [app/pages/[section]/[page].vue](app/pages/%5Bsection%5D/%5Bpage%5D.vue#L7-L9)
- **Severity:** critical
- **Category:** data
- **Bug:** The section page fetches articles with:
  ```typescript
  const { data: articles } = await useFetch<Article[]>('/api/articles/latest', {
    query: { limit: 12 },
  });
  ```
  This returns the 12 most recently updated articles globally, regardless of section. The `webPage` object has `widgetCollections` and `widgetTags` properties specifically designed to filter content per section, but neither is used.
- **Impact:** Every section page (e.g., `/side-shows/dark-art`, `/back-yard/montreal-visit-with-kids`) shows the same 12 generic latest articles instead of section-relevant content. The section structure is meaningless — all section pages display identical article lists.
- **Fix:** Use `webPage.widgetTags` or `webPage.widgetCollections` to pass tag/collection filters to the API:
  ```typescript
  const tagIds = computed(() => webPage.value?.widgetTags?.map(t => t.id) ?? []);
  const { data: articles } = await useFetch<Article[]>('/api/articles', {
    query: { tags: tagIds, limit: 12 },
  });
  ```
  This also requires a corresponding server API endpoint that accepts tag filters.
- **Cross-reference:** Issue #25 (`LATEST_ARTICLES_BY_TAG_QUERY` exists but is dead code with hardcoded tag ID) is related — the query infrastructure exists but isn't wired up.

---

## Issue #37: `error.vue` renders outside NuxtLayout — no site navigation

- **File:** [app/error.vue](app/error.vue)
- **Severity:** minor
- **Category:** ux
- **Bug:** The error page renders as a standalone page without `<NuxtLayout>`. This means 404/500 error pages have:
  - No header bar
  - No sidebar navigation
  - No footer
  - No social links
  - Only a "Go Home" button for navigation
- **Verified:** `curl http://localhost:3000/nonexistent-page` returns 404 with error content but no layout chrome.
- **Impact:** Users who reach a 404 page are stranded without site navigation. They can only click "Go Home" — no menu, no search, no section browsing.
- **Fix:** Wrap `error.vue` content in `<NuxtLayout>`:
  ```vue
  <template>
    <NuxtLayout>
      <div class="error-page">...</div>
    </NuxtLayout>
  </template>
  ```
  Note: This requires the layout's `useAsyncData` call to handle errors gracefully if the menu API also fails.

---

## Issue #38: Social icon hover makes icons invisible

- **File:** [app/components/social-bar.vue](app/components/social-bar.vue#L97-L107)
- **Severity:** major (after Issue #3 ClIcons fix)
- **Category:** visual
- **Bug:** The hover CSS changes the `<i>` element's background to the brand color but does NOT change the icon's fill/text color to a contrasting color:
  ```scss
  &.icon-pinterest { color: #d8545d; } // default: icon color = brand color
  &__link:hover > .icon-pinterest { background-color: #d8545d; } // hover: bg = same brand color
  ```
  The SVG `<Icon>` inherits `color` via `fill: currentColor`. On hover, the background becomes the same color as the icon fill, making the icon invisible.
- **Impact:** Currently masked because `<ClIcons>` isn't mounted (icons don't render at all, Issue #3). Once ClIcons is fixed, hovering over social icons will make them disappear against the colored background.
- **Fix:** Add `color: #fff;` (or appropriate contrast color) to each hover rule:
  ```scss
  &__link:hover > .icon-pinterest { background-color: #d8545d; color: #fff; }
  ```

---

## Issue #39: `app.vue` does not mount `<ClIcons>` — SVG sprite sheet missing from DOM

- **File:** [app/app.vue](app/app.vue)
- **Severity:** critical
- **Category:** visual
- **Bug:** `app.vue` is the root component but only contains `<NuxtLayout><NuxtPage /></NuxtLayout>`. The `<ClIcons>` component (which defines SVG `<symbol>` elements for facebook, twitter, pinterest, instagram, youtube, google-plus) is never mounted anywhere in the component tree. All `<Icon>` components render `<svg><use href="#icon-{name}"></svg>` referencing symbols that don't exist in the DOM.
- **Impact:** All social icons in the footer and sidebar render as empty/invisible boxes. Confirmed in rendered HTML: `<use href="#icon-facebook">` but no `<symbol id="icon-facebook">` exists in the page.
- **Fix:** Add `<ClIcons />` to `app.vue` or `default.vue`:
  ```vue
  <template>
    <ClIcons />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </template>
  ```
- **Cross-reference:** Previously identified as Issues #3 and #10 in earlier audits. Confirmed still unresolved.

---

## Summary

| # | Title | Severity | Category |
|---|-------|----------|----------|
| 28 | Canonical/OG URLs missing `https://` protocol | critical | seo |
| 29 | `card-columns` class removed in Bootstrap 5 — broken card layout | major | layout |
| 30 | No Google Fonts loaded — 4 font families missing | major | visual |
| 31 | Dead `fontello-social` font-family in social-bar CSS | minor | code-quality |
| 32 | Google Plus dead link (service shut down 2019) | minor | content |
| 33 | Analytics plugin fires GA on all environments | minor | privacy |
| 34 | `useFetch` inside Pinia store actions — anti-pattern | major | architecture |
| 35 | Navigation store `fetchMenu()` dead code | cosmetic | code-quality |
| 36 | Section pages fetch generic articles, not section-filtered | critical | data |
| 37 | `error.vue` renders outside NuxtLayout — no navigation | minor | ux |
| 38 | Social icon hover makes icons invisible (color = background) | major | visual |
| 39 | `<ClIcons>` SVG sprite not mounted (re-confirmed) | critical | visual |

**Critical:** 3 (#28, #36, #39) | **Major:** 4 (#29, #30, #34, #38) | **Minor:** 4 (#31, #32, #33, #37) | **Cosmetic:** 1 (#35)

**Total new issues: 12** (numbered #28–#39)

---

## Dependency Graph

```
#39 (ClIcons not mounted) ──► #38 (hover bug masked — will surface after fix)
#28 (missing protocol) ──► all pages have invalid canonical + OG URLs
#36 (no section filtering) ──► all section pages show identical content
#34 (useFetch in store) ──► #35 (dead code uses same anti-pattern)
#29 (card-columns) ──► homepage + section page card grids broken
#30 (no Google Fonts) ──► entire site renders in system fonts
```

---

## Cross-References to Previous Issues

| Previous Issue | This Audit | Relationship |
|---------------|-----------|--------------|
| #3 (SVG icons not rendering) | #39 | Re-confirmed: ClIcons still not mounted |
| #10 (ClIcons unmounted) | #39 | Same issue, re-confirmed |
| #25 (tag query dead code) | #36 | Related: query exists but isn't wired to section pages |
| #17 (card links dead) | #29 | Compounding: cards have no links AND no layout |

---

## Task-by-Task Notes

### Task 2: Analytics Plugin
- Plugin correctly uses runtime config
- Only guards on `!tagId`, no environment check
- `G-RYK95E2EV9` confirmed in SSR payload — fires on all envs

### Task 3: Stores
- **Menu store:** Simple toggle state, no issues
- **Navigation store:** `fetchMenu()` action is dead code; layout fetches directly
- **Article store:** `fetchLatest()` uses fragile `useFetch` in action pattern
- All stores are well-typed and use Pinia composition API correctly (excluding useFetch issue)

### Task 4: SCSS
- Bootstrap 5.3.8 core imported correctly via `@import 'bootstrap/scss/bootstrap'`
- Variable overrides applied before Bootstrap import (correct order)
- Sass deprecation warnings silenced via `quietDeps` + `silenceDeprecations` (appropriate)
- **Missing:** Google Fonts (Issue #30)
- **Dead reference:** `fontello-social` (Issue #31)

### Task 5: Section/Page Rendering
- `useWebPage()` composable correctly fetches WebPage for the route path
- Section filtering completely absent — every section shows same 12 articles (Issue #36)
- `ImageList` vs `CardList` toggle based on `webPage.widget` works structurally

### Task 6: Article Detail Page
- Article page renders core fields (name, alternateName, text, image, coverImage) correctly
- `useSeoHead()` receives empty description due to Issue #16 (missing query field)
- `PopularPosts` sidebar widget works but uses anti-pattern (Issue #34)
- Error handling (`fetchError` → `createError`) is correct

### Task 7: Error Page
- Returns 404 status code correctly
- Returns JSON to non-browser clients (API behavior — correct)
- Returns HTML to browser clients with `Accept: text/html`
- Renders without layout chrome (Issue #37)
