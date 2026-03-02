# Issues — p04: Deep Audit (Galleries, APIs, A11y, Config, TypeScript)

**Audited:** 2026-03-02
**Local:** <http://localhost:3000/>
**Scope:** Gallery/image-object routes, all server API endpoints, accessibility, nuxt.config.ts, tsconfig.json

---

## Task 1: Gallery Route Investigation

### Findings

- **`server/routes/gallaries/[id].get.ts`** — 301 redirect from misspelled `/gallaries/:id` to `/galleries/:id`. Redirect works correctly (`HTTP 301`, confirmed via `curl`).
- **`app/pages/galleries/[id].vue`** — Fetches from `/api/image-objects/${id}`. Renders hero + image + caption + PopularPosts sidebar.
- **`app/pages/image-objects/[id].vue`** — Also fetches from `/api/image-objects/${id}`. Nearly identical template with different layout (full-width instead of 8/4 grid).
- **Gallery page with ID `141628419`:** Redirect chain `/gallaries/141628419` → 301 → `/galleries/141628419` → 404 (image object not found).
- **Root cause:** The `IMAGE_OBJECT_BY_IDENTIFIER_QUERY` requires a DatoCMS `ItemId` for the *identifier junction record*, not the image object's own record ID. Without a known valid identifier ItemId, no gallery or image-object page renders. (Cross-ref: Issue #23)

---

## Task 2: Image Object API

### Findings

- `GET /api/image-objects/141628419` → **404** — "Image object not found: 141628419"
- `GET /api/image-objects/some-slug-name` → **503** — "Content service unavailable" (DatoCMS query fails because `some-slug-name` is not a valid `ItemId` format)
- The `[id].get.ts` handler passes the raw URL param to `fetchImageObject(id)`, which sends it to DatoCMS as `$identifierId: ItemId!`. Non-numeric values cause a GraphQL type error → 503.
- Test file `server/api/image-objects/__tests__/id.get.test.ts` exists and covers 200, 404, and 400 cases.

---

## Task 3: Article Detail Rendering

### Findings

- `GET /articles/atelier-evia` → **200** (page renders)
- `GET /api/articles/atelier-evia` → **200** with fields: `name`, `alternateName`, `text`, `image`, `coverImage`
- **Missing fields:** `identifier`, `description`, `url`, `_updatedAt`, `_firstPublishedAt`, `_createdAt` (confirmed via response)
- The article page uses `article._firstPublishedAt` and `article._updatedAt` in `useSeoHead()` for `article:published_time` and `article:modified_time` — both will always be `undefined`.

---

## Task 4: Menu API

### Findings

- `GET /api/menu` → **200** with 5 top-level items + home:
  - `/side-shows` (11 children)
  - `/back-yard` (5 children)
  - `/after-shows` (4 children)
  - `/contact` (3 children)
  - `/` (home, 0 children, appended last per algorithm)
- All items have `menuName: ""` — empty string, not null. (Cross-ref: Issue #19)
- Menu tree building logic (`buildMenuTree`) works correctly.
- `side-menu.vue` uses `item.path` for `<NuxtLink :to>`, so navigation works despite empty `url` fields.

---

## Task 5: Identifiers API

### Findings

- `GET /api/identifiers/some-value` → **404** — "Identifier not found: some-value"
- `GET /api/identifiers/atelier-evia` → **404** — "Identifier not found: atelier-evia"
- The handler and query (`IDENTIFIER_BY_VALUE_QUERY`) work correctly — they query by `value: { eq: $value }`. No matching records in DatoCMS for tested values.
- This endpoint supports the 2-step resolution for image objects (slug → identifier record → image object), but the chain is incomplete because the gallery/image-object pages don't use it.

---

## Task 6: Accessibility / Responsive Findings

### `side-bar.vue`
- ✅ `aria-hidden` toggles with open state
- ✅ `aria-label` on close button
- ✅ Keyboard escape handler closes sidebar
- ❌ No `role="dialog"` or `aria-modal="true"` — sidebar acts as modal overlay but doesn't announce as one
- ❌ No focus trap — keyboard users can tab behind the backdrop

### `page-body.vue`
- ❌ CSS has `.page-body__text :deep(img) { loading: lazy; }` — `loading` is not a CSS property; this rule is silently ignored
- ❌ `v-html` renders CMS web page content without server-side HTML processing (articles go through `processArticleHtml()` but web pages don't)

### `section-header-h2.vue` / `section-header-h3.vue`
- ✅ Proper heading semantics (`<h2>`, `<h3>`)
- ✅ Decorative lines via CSS pseudo-elements (no a11y impact)
- No issues found.

### `quote-block.vue`
- ❌ `rel="author"` on `<footer>` element — invalid HTML attribute for that element
- ✅ `<blockquote>` semantics correct
- ✅ Absolute positioning is intentional (overlays carousel background)

---

## Task 7: nuxt.config.ts Audit

### Configuration present and correct:
- `compatibilityDate: '2026-02-23'` ✅
- `modules`: @pinia/nuxt, @nuxt/image, @nuxtjs/i18n, @nuxt/eslint ✅
- `runtimeConfig`: datoApiToken, public.baseUrl, public.canonicalBaseUrl, public.gaTagId ✅
- `css`: main.scss ✅
- `ssr: true` ✅
- `typescript.strict: true` ✅
- Sass deprecation silencing via `vite.css.preprocessorOptions.scss` ✅

### Missing configuration:
- **No Google Fonts loading** — 4 font families referenced in CSS but never loaded (Cross-ref: Issue #30)
- **No `app.head` configuration** — no favicon, no preconnect hints, no theme-color meta tag
- **`image.domains` incomplete** — only `www.datocms-assets.com`, missing `images.circusliving.com`

---

## Task 8: TypeScript Compilation

- `tsconfig.json` correctly extends `.nuxt/tsconfig.json` (standard Nuxt 4 pattern)
- `get_errors` returned 0 TypeScript compilation errors — only markdown lint warnings
- `typescript.strict: true` in nuxt.config.ts ✅
- Dependencies pinned (no `^` or `~`) ✅

---

## New Issues (#40+)

---

### Issue #40: `ARTICLE_BY_IDENTIFIER_QUERY` missing date/metadata fields for article SEO

- **File:** [server/utils/graphql-queries.ts](server/utils/graphql-queries.ts) (`ARTICLE_BY_IDENTIFIER_QUERY`)
- **Severity:** major
- **Category:** seo
- **Bug:** Query selects `name`, `alternateName`, `text`, `image`, `coverImage` but is missing `_firstPublishedAt`, `_createdAt`, `_updatedAt`. The article detail page passes these to `useSeoHead()`:
  ```typescript
  publishedTime: article.value?._firstPublishedAt ?? article.value?._createdAt,
  modifiedTime: article.value?._updatedAt,
  ```
  Both resolve to `undefined`, so `article:published_time` and `article:modified_time` Open Graph meta tags are never rendered.
- **Impact:** Search engines (especially Google News, Google Discover) use `article:published_time` to determine freshness. Without it, articles may rank lower in time-sensitive search features.
- **Fix:** Add `_firstPublishedAt`, `_createdAt`, `_updatedAt` to `ARTICLE_BY_IDENTIFIER_QUERY`:
  ```graphql
  query article($identifier: String!) {
    article(filter: { identifier: { eq: $identifier } }) {
      name
      alternateName
      text
      image
      coverImage
      description
      identifier
      url
      _firstPublishedAt
      _createdAt
      _updatedAt
    }
  }
  ```
- **Cross-reference:** Issue #16 (same query missing `identifier`, `url`, `description`). This issue covers the additional date fields.

---

### Issue #41: Sidebar lacks focus trap and ARIA dialog semantics

- **File:** [app/components/side-bar.vue](app/components/side-bar.vue)
- **Severity:** major
- **Category:** accessibility
- **Bug:** The sidebar overlay behaves as a modal dialog (has backdrop, escape-to-close, overlays all content) but:
  1. Missing `role="dialog"` and `aria-modal="true"` on the sidebar `<aside>` element
  2. No focus trap — when the sidebar is open, keyboard users can `Tab` to elements behind the backdrop (header buttons, page links, etc.)
  3. Focus is not moved to the sidebar when it opens
  4. Focus is not returned to the trigger button when it closes
- **Impact:** Screen reader users don't hear "dialog" announcement. Keyboard-only users can interact with obscured content behind the backdrop. WCAG 2.4.3 (Focus Order) and 2.4.7 (Focus Visible) violations.
- **Fix:**
  - Add `role="dialog"` and `aria-modal="true"` to the `<aside>` when open
  - Implement focus trap (trap `Tab`/`Shift+Tab` within sidebar while open)
  - Move focus to close button on open, return focus to menu toggle on close

---

### Issue #42: `page-body.vue` CSS uses `loading: lazy` — invalid CSS property

- **File:** [app/components/page-body.vue](app/components/page-body.vue#L55)
- **Severity:** minor
- **Category:** code-quality
- **Bug:** CSS rule `.page-body__text :deep(img) { loading: lazy; }` is invalid. `loading` is an HTML attribute (valid on `<img>` and `<iframe>`), not a CSS property. The browser silently ignores it.
- **Intent:** Add lazy loading to images inside CMS-rendered HTML content.
- **Impact:** CMS images in web page body text are not lazy-loaded. No visual/functional bug, but a missed performance optimization.
- **Fix:** Remove the invalid CSS rule. Either:
  1. Create a `processWebPageHtml()` function (similar to `processArticleHtml()`) that adds `loading="lazy"` to `<img>` tags server-side
  2. Use a client-side `IntersectionObserver` directive

---

### Issue #43: `quote-block.vue` uses invalid `rel="author"` on `<footer>` element

- **File:** [app/components/quote-block.vue](app/components/quote-block.vue#L12)
- **Severity:** cosmetic
- **Category:** html-validity
- **Bug:** `<footer v-if="author" class="quote-block__author" rel="author">` — the `rel` attribute is only valid on `<a>`, `<area>`, and `<link>` elements per HTML spec. On `<footer>`, it's invalid and ignored.
- **Impact:** No functional impact. HTML validators will flag it.
- **Fix:** Remove `rel="author"` from the `<footer>`. If author attribution semantics are needed, use:
  ```html
  <footer v-if="author" class="quote-block__author">
    <cite>{{ author }}</cite>
  </footer>
  ```

---

### Issue #44: Gallery page renders duplicate heading (same text in `<h1>` and `<h2>`)

- **File:** [app/pages/galleries/\[id\].vue](app/pages/galleries/%5Bid%5D.vue#L38-L45)
- **Severity:** minor
- **Category:** accessibility/seo
- **Bug:** The gallery page passes `imageObject.name` to `<HeroTitle :title>` (which renders `<h1>{{ title }}</h1>`) AND renders `<h2 v-if="imageObject?.name">{{ imageObject.name }}</h2>` in the body. The same text appears twice on the page — once as `<h1>` in the hero overlay and once as `<h2>` in the content body.
- **Comparison:** The article page correctly uses a DIFFERENT text for `<h2>` (shows `alternateName` only when it differs from `name`). The gallery page lacks this guard.
- **Impact:** Redundant heading text. Screen readers announce the same title twice. Minor SEO dilution from duplicate heading content.
- **Fix:** Either remove the `<h2>` from the gallery body or add a guard like articles:
  ```html
  <h2 v-if="imageObject?.alternateName && imageObject.alternateName !== imageObject.name">
    {{ imageObject.alternateName }}
  </h2>
  ```

---

### Issue #45: `@nuxt/image` domains config missing `images.circusliving.com`

- **File:** [nuxt.config.ts](nuxt.config.ts) (`image.domains`)
- **Severity:** minor
- **Category:** config
- **Bug:** `image.domains` only includes `['www.datocms-assets.com']` but several `<NuxtImg>` components use `images.circusliving.com` URLs:
  - `header-bar.vue`: `src="https://images.circusliving.com/347x50/circus-living-logo.png"`
  - `side-bar.vue`: `src="https://images.circusliving.com/circus-living-logo.png"`
- **Impact:** `<NuxtImg>` may fall back to plain `<img>` rendering for these URLs, bypassing image optimization. In strict mode, it could generate console warnings.
- **Fix:** Add `images.circusliving.com` to the domains array:
  ```typescript
  image: {
    domains: ['www.datocms-assets.com', 'images.circusliving.com'],
  },
  ```

---

### Issue #46: Homepage text content uses bare text nodes without semantic `<p>` wrapper

- **File:** [app/pages/index.vue](app/pages/index.vue#L62-L68)
- **Severity:** minor
- **Category:** accessibility/semantics
- **Bug:** The homepage `.text-section` contains bare text nodes separated by `<br>` tags:
  ```html
  <h1>Greetings Friend</h1>
  We've been eagerly awaiting your arrival.<br>
  Fate has delivered you to us at our entreat.<br>
  ...
  <h2>…welcome to Circus Living.</h2>
  ```
  Text between the `<h1>` and `<h2>` is not wrapped in `<p>` tags. This is technically valid HTML but:
  - Screen readers may not announce it as a paragraph
  - CSS styling via `p` selectors won't apply
  - Semantic meaning is lost
- **Impact:** Minor accessibility degradation. Text is rendered visually but lacks semantic structure.
- **Fix:** Wrap the text in a `<p>` element:
  ```html
  <h1>Greetings Friend</h1>
  <p>
    We&rsquo;ve been eagerly awaiting your arrival.<br>
    ...
  </p>
  <h2>&hellip;welcome to Circus Living.</h2>
  ```

---

### Issue #47: `nuxt.config.ts` missing `app.head` configuration (favicon, preconnect, theme-color)

- **File:** [nuxt.config.ts](nuxt.config.ts)
- **Severity:** minor
- **Category:** config
- **Bug:** No `app.head` or `head` configuration exists. The rendered HTML lacks:
  - Favicon (`<link rel="icon">`)
  - Preconnect hints for external origins (`fonts.googleapis.com`, `images.circusliving.com`, `www.datocms-assets.com`)
  - Theme color meta tag (`<meta name="theme-color">`)
  - Apple touch icon
- **Impact:** No favicon in browser tabs (shows default browser icon). No performance optimization from preconnect hints. Missing mobile browser theming.
- **Fix:** Add `app.head` to nuxt.config.ts:
  ```typescript
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://images.circusliving.com' },
      ],
      meta: [
        { name: 'theme-color', content: '#000000' },
      ],
    },
  },
  ```

---

### Issue #48: Web page `text` rendered via `v-html` without server-side HTML processing

- **File:** [app/components/page-body.vue](app/components/page-body.vue#L32), [server/api/web-pages/\[...path\].get.ts](server/api/web-pages/%5B...path%5D.get.ts)
- **Severity:** minor
- **Category:** consistency
- **Bug:** Article bodies are processed through `processArticleHtml()` which adds `loading="lazy"` to `<img>` tags. But web page `text` content (served by `[...path].get.ts` and rendered in `page-body.vue` via `v-html="text"`) is returned raw without any HTML processing.
- **Impact:** Images in web page body content load eagerly (no lazy loading), increasing initial page weight and LCP time. Inconsistent behavior between articles and web pages.
- **Fix:** Apply the same `processArticleHtml()` (or rename to `processHtml()`) to web page text in the `[...path].get.ts` handler:
  ```typescript
  return {
    ...page,
    text: page.text ? processArticleHtml(page.text) : page.text,
  };
  ```

---

### Issue #49: `popular-posts.vue` uses `formatDate()` instead of `<NuxtTime>` per project standards

- **File:** [app/components/popular-posts.vue](app/components/popular-posts.vue#L66-L70)
- **Severity:** cosmetic
- **Category:** standards
- **Bug:** The component uses `formatDate(article._updatedAt)` (Luxon) for date display:
  ```html
  <time :datetime="article._updatedAt">{{ formatDate(article._updatedAt) }}</time>
  ```
  Per project instructions: "use `<NuxtTime>` for display and luxon for any date conversions or manipulations."
- **Impact:** No functional impact. Inconsistent with project standards. `<NuxtTime>` provides locale-aware rendering and timezone handling out of the box.
- **Fix:** Replace with `<NuxtTime>`:
  ```html
  <NuxtTime :datetime="article._updatedAt" date-style="long" />
  ```

---

### Issue #50: Gallery and image-object pages are near-identical code duplicates

- **File:** [app/pages/galleries/\[id\].vue](app/pages/galleries/%5Bid%5D.vue) and [app/pages/image-objects/\[id\].vue](app/pages/image-objects/%5Bid%5D.vue)
- **Severity:** cosmetic
- **Category:** code-quality
- **Bug:** Both pages:
  - Fetch from `/api/image-objects/${route.params.id}`
  - Import `ImageObject` type
  - Use `useImageAttrs()` and `useSeoHead()` identically
  - Render hero + image + caption

  Differences are minor:
  - Gallery uses 8/4 grid + `<PopularPosts>` sidebar; image-object uses full-width
  - Gallery uses `<h2>`; image-object uses `<h1>`
  - Different CSS class names
  - Different canonical paths
- **Impact:** Code duplication. Changes to image object rendering logic must be applied in two places.
- **Fix:** Extract shared logic into a composable or shared component. One option: make `image-objects/[id].vue` the canonical page and have `galleries/[id].vue` be a thin wrapper or redirect.

---

### Issue #51: Image object API returns 503 for non-numeric IDs instead of 400

- **File:** [server/api/image-objects/\[id\].get.ts](server/api/image-objects/%5Bid%5D.get.ts#L14-L19), [server/utils/graphql-queries.ts](server/utils/graphql-queries.ts) (`IMAGE_OBJECT_BY_IDENTIFIER_QUERY`)
- **Severity:** minor
- **Category:** error-handling
- **Bug:** The `IMAGE_OBJECT_BY_IDENTIFIER_QUERY` uses `$identifierId: ItemId!` which expects a numeric DatoCMS record ID. When a non-numeric value (e.g., `some-slug-name`) is passed, DatoCMS returns a GraphQL type validation error. The handler catches this as a generic error and throws 503 ("Content service unavailable").
- **Impact:** 503 implies the service is down, but the real issue is invalid input. Users/crawlers may retry 503 errors thinking the issue is transient.
- **Fix:** Validate the `id` parameter is numeric before sending the query:
  ```typescript
  if (!/^\d+$/.test(id)) {
    throw createError({ statusCode: 400, message: 'Image object identifier must be numeric' });
  }
  ```

---

### Issue #52: No gallery/image-object ID discovery mechanism — pages are orphaned

- **File:** [app/pages/galleries/\[id\].vue](app/pages/galleries/%5Bid%5D.vue), [server/api/image-objects/](server/api/image-objects/)
- **Severity:** major
- **Category:** architecture
- **Bug:** There is no way to discover valid image object IDs:
  1. No list endpoint (`/api/image-objects/` returns HTML, not JSON — Issue #22)
  2. The `identifier` junction table requires `ItemId` values not exposed in any API response
  3. The `identifiers/[value].get.ts` endpoint exists for slug→ID resolution but tested slugs don't return results
  4. No sitemap, no internal links, no navigation items point to gallery/image-object pages

  The 2-step resolution chain (slug → identifier → image object) exists in the backend but is not wired together in any frontend page.
- **Impact:** Gallery and image-object pages are completely inaccessible. No user flow reaches them. They exist as dead routes.
- **Fix:** Either:
  1. Add the 2-step resolution to gallery pages: call `/api/identifiers/${slug}` first, then use returned ID for `/api/image-objects/${id}`
  2. Change the image object query to accept slug values directly (requires DatoCMS schema investigation)
  3. Add a list endpoint and navigation links to gallery browsing

---

### Issue #53: Twitter social link points to `twitter.com` (now `x.com`)

- **File:** [app/components/social-bar.vue](app/components/social-bar.vue#L4)
- **Severity:** cosmetic
- **Category:** content
- **Bug:** Social links include `href: 'https://twitter.com/cathoulahan'`. Twitter rebranded to X in 2023 and the domain is now `x.com`. While `twitter.com` still redirects, the link and icon name reference the old brand.
- **Impact:** Users are redirected from `twitter.com` to `x.com`. The extra redirect adds latency. The "Twitter" label and icon reference a no-longer-existing brand.
- **Fix:** Update href to `https://x.com/cathoulahan`, label to `'X'`, and icon/cssClass if an X icon is available. Otherwise, keep the current icon but update the URL.

---

## Summary

| # | Title | Severity | Category |
|---|-------|----------|----------|
| 40 | Article query missing date fields for SEO meta | major | seo |
| 41 | Sidebar lacks focus trap and ARIA dialog role | major | accessibility |
| 42 | `page-body.vue` CSS `loading: lazy` — invalid CSS property | minor | code-quality |
| 43 | `quote-block.vue` invalid `rel="author"` on `<footer>` | cosmetic | html-validity |
| 44 | Gallery page duplicate heading (same text h1 + h2) | minor | accessibility |
| 45 | `@nuxt/image` domains missing `images.circusliving.com` | minor | config |
| 46 | Homepage text bare nodes without `<p>` wrapper | minor | accessibility |
| 47 | `nuxt.config.ts` missing `app.head` config | minor | config |
| 48 | Web page text not HTML-processed (unlike articles) | minor | consistency |
| 49 | `popular-posts.vue` uses `formatDate` instead of `<NuxtTime>` | cosmetic | standards |
| 50 | Gallery/image-object pages are near-identical duplicates | cosmetic | code-quality |
| 51 | Image object API returns 503 for non-numeric IDs | minor | error-handling |
| 52 | No gallery/image-object ID discovery — pages orphaned | major | architecture |
| 53 | Twitter link uses legacy `twitter.com` domain | cosmetic | content |

**Critical:** 0 | **Major:** 3 (#40, #41, #52) | **Minor:** 7 (#42, #44, #45, #46, #47, #48, #51) | **Cosmetic:** 4 (#43, #49, #50, #53)

**Total new issues: 14** (numbered #40–#53)

---

## Cumulative Issue Count

| Phase | Issues | Critical | Major | Minor | Cosmetic |
|-------|--------|----------|-------|-------|----------|
| p02-01 (Homepage) | #1–#13 | 2 | 6 | 2 | 2 |
| p02-02 (Articles/Images/Galleries) | #14–#27 | 3 | 6 | 4 | 1 |
| p03 (Layout/Shell) | #28–#39 | 3 | 4 | 4 | 1 |
| p04 (Deep Audit) | #40–#53 | 0 | 3 | 7 | 4 |
| **Total** | **53** | **8** | **19** | **17** | **8** |

---

## Dependency Graph (New Issues)

```
#40 (missing date fields) ──► extends #16 (same query, additional fields)
#41 (focus trap) ──► independent, a11y compliance
#42 (CSS loading) ──► related to #48 (web page HTML not processed)
#48 (no HTML processing) ──► web page images load eagerly
#52 (orphaned pages) ──► extends #22 (no list endpoint) + #23 (pages broken)
#51 (503 vs 400) ──► mitigates confusion from #52 chain
```
