# Issues — p02-01: Audit Homepage

**Audited:** 2026-03-02
**Live:** https://circusliving.com/
**Local:** http://localhost:3000/
**Screenshots:** `temp/screenshots/live-homepage.png`, `local-homepage.png`, `live-homepage-menu.png`, `local-homepage-menu.png`

---

### Issue #1: Hero image not showing on homepage

- **Page:** /
- **Severity:** critical
- **Category:** image
- **Live behavior:** Large hero image (painting of circus tents at night) fills the top ~550px of the page
- **Local behavior:** Black empty rectangle (550px tall) with no image rendered
- **Likely root cause:** `useWebPage()` calls `useFetch('/api/web-pages/')` for path `/`. This matches `server/api/web-pages/index.get.ts` (returns **all** web pages as an array) instead of `[...path].get.ts` (returns a single page). So `webPage.value` is an array, not a `WebPage` object — `webPage.value?.coverImage` is `undefined`, the hero `v-if="src"` is false, and no `<img>` renders.
- **Screenshot:** live-homepage.png vs local-homepage.png

---

### Issue #2: Page `<title>` is empty

- **Page:** /
- **Severity:** major
- **Category:** seo
- **Live behavior:** `<title>Big Top/Home</title>`
- **Local behavior:** `<title></title>` (empty)
- **Likely root cause:** Same as #1 — `useWebPage()` gets an array instead of a `WebPage`, so `webPage.value?.alternateName || webPage.value?.name` resolves to empty, and `useSeoHead` sets an empty title.
- **Screenshot:** browser tab title visible in screenshots

---

### Issue #3: Sidebar menu items missing text labels

- **Page:** / (sidebar)
- **Severity:** critical
- **Category:** navigation
- **Live behavior:** Sidebar shows "Side Shows", "Back Yard", "After Shows", "Contact", "Big Top/Home" as menu items
- **Local behavior:** Sidebar shows only `▼` arrows for the 4 parent items — no text labels visible. "Big Top/Home" link renders correctly.
- **Likely root cause:** In `side-menu.vue`, `displayName()` uses `item.menuName ?? item.name`. The API returns `menuName: ""` (empty string). Nullish coalescing (`??`) does not catch empty string — it only catches `null`/`undefined`. So `displayName()` returns `""` for all items. Fix: use `item.menuName || item.name`.
- **Screenshot:** local-homepage-menu.png

---

### Issue #4: Social icons render as colored bordered squares instead of SVG icons

- **Page:** / (sidebar + footer)
- **Severity:** major
- **Category:** icon
- **Live behavior:** Social icons (Facebook, Twitter, Google+, Pinterest, Instagram, YouTube) render as recognizable colored SVG icons in both the sidebar and footer
- **Local behavior:** Icons render as small colored bordered squares with no visible icon glyph inside
- **Likely root cause:** `<ClIcons>` SVG sprite sheet is not mounted anywhere in the component tree. Neither `app.vue` nor `default.vue` includes `<ClIcons />`. The `<Icon>` component uses `<use href="#icon-{name}">` which references SVG `<symbol>` definitions that don't exist in the DOM.
- **Screenshot:** local-homepage-menu.png (sidebar), local-homepage.png (footer)

---

### Issue #5: Article cards show wrong content — different articles from live site

- **Page:** /
- **Severity:** major
- **Category:** content
- **Live behavior:** Shows 3 article cards: "Mahlimae (Doll Artist)", "When Dead Animals Teach", "Chocolate Maple Frogs"
- **Local behavior:** Shows 6 article cards: "Morsures d'Amour Chimneys", "Atelier Evia", "La Fabrique Éthique", "La Khaïma Cuisine Nomade", "TOKI", "Lady Porcelaine"
- **Likely root cause:** Local homepage fetches `/api/articles/latest?limit=6` which returns the 6 most recently published articles (ordered by `_firstPublishedAt_DESC`). The live AMP site appears to use a curated/featured selection of 3 articles. The query, sort order, and/or selection criteria differ.
- **Screenshot:** compare bottom sections of both screenshots

---

### Issue #6: Article cards missing description text

- **Page:** /
- **Severity:** major
- **Category:** content
- **Live behavior:** Each article card shows a paragraph of descriptive text below the title
- **Local behavior:** Article cards from `CardList` → `Card` component render `v-html="article.description"` but the `description` field is empty/undefined in the API response. Cards show title and image but no description text.
- **Likely root cause:** The `LATEST_ARTICLES_WITH_LIMIT_QUERY` GraphQL query does not include `description` in its field selection — it only selects `identifier`, `name`, `image`, `_updatedAt`, `jsonLd`.
- **Screenshot:** local-homepage.png

---

### Issue #7: Article cards layout vertical instead of horizontal 3-column

- **Page:** /
- **Severity:** major
- **Category:** layout
- **Live behavior:** 3 article cards displayed in a horizontal row with equal width columns
- **Local behavior:** 6 article cards stacked vertically in a single column (first card has a large image, rest are smaller with bordered boxes)
- **Likely root cause:** The `CardList` component uses `card-columns` CSS class but no explicit grid/flexbox for 3-column layout. The live AMP site uses a different card component and responsive column layout. The `card-columns` class may be a Bootstrap dependency that isn't loaded.
- **Screenshot:** local-homepage.png

---

### Issue #8: Sideshow cards not clickable as links on the image/figure

- **Page:** /
- **Severity:** minor
- **Category:** functionality
- **Live behavior:** Sideshow card images are wrapped in `<a>` linking to the section page (e.g., `/side-shows/mysterious-monster-marvels`)
- **Local behavior:** `CardCl` component wraps images in `<NuxtLink>` which renders correctly — the images are clickable. **On closer inspection, this works on local too** via the `<NuxtLink :to="path">` in `card-cl.vue`.
- **Likely root cause:** N/A — this issue was expected from prior recon but actually works. Marking as resolved.
- **Screenshot:** N/A

---

### Issue #9: Quotes carousel missing background image

- **Page:** /
- **Severity:** minor
- **Category:** image
- **Live behavior:** "HERALD" quotes section has a dark background with a visible "hooligan clowns in a row" image behind the quote text
- **Local behavior:** Quotes carousel has a dark background but the parallax background image (`CircusLivingParallax.jpg`) does not render visibly — background appears as a solid dark area
- **Likely root cause:** CSS `background-attachment: fixed` combined with `overflow: hidden` on the carousel container can cause the background image to be invisible in some rendering contexts. The image URL `https://images.circusliving.com/CircusLivingParallax.jpg` may need verification. Also, `background-attachment: fixed` doesn't work well with `overflow: hidden` on ancestor elements.
- **Screenshot:** local-homepage.png (middle dark section)

---

### Issue #10: Image URLs fail with `?w=320` query parameter

- **Page:** /
- **Severity:** major
- **Category:** image
- **Live behavior:** Images load correctly via `<amp-img>` with direct URLs
- **Local behavior:** Multiple image requests fail with `net::ERR_ABORTED` — e.g., `https://images.circusliving.com/375x222/mysteriousmonstermarvels.min.jpg?w=320`
- **Likely root cause:** `buildSrcSet()` in `image-service.ts` appends `?w=<width>` query params (designed for DatoCMS image API). But `images.circusliving.com` is a custom image host that doesn't support `?w=` resizing — images already have size in the path (e.g., `375x222`). The `?w=` param causes a redirect or abort.
- **Screenshot:** Network tab shows 8 failed image requests

---

### Issue #11: Vue warning — extraneous non-props attributes

- **Page:** /
- **Severity:** cosmetic
- **Category:** console-error
- **Live behavior:** No Vue warnings (AMP site uses vanilla JS)
- **Local behavior:** Console warning: `[Vue warn]: Extraneous non-props attributes (style) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`
- **Likely root cause:** Nuxt DevTools overlay component. This is a dev-mode artifact from `@nuxt/devtools` and not a production issue.
- **Screenshot:** N/A (console only)

---

### Issue #12: Google Analytics firing on localhost with production tag

- **Page:** /
- **Severity:** minor
- **Category:** functionality
- **Live behavior:** Google Analytics (G-RYK95E2EV9) collects data on the production site
- **Local behavior:** Same GA tag fires on localhost, sending `dl=http://localhost/` page_view events to production analytics
- **Likely root cause:** `analytics.client.ts` plugin loads the GA tag unconditionally, without checking the hostname/environment. This pollutes production analytics data with local dev traffic.
- **Screenshot:** N/A (network tab shows POST to analytics.google.com)

---

### Issue #13: Footer copyright year hardcoded

- **Page:** /
- **Severity:** cosmetic
- **Category:** content
- **Live behavior:** "©2026 Circus Living. All rights reserved."
- **Local behavior:** "©2026 Circus Living. All rights reserved." — matches currently, but is hardcoded
- **Likely root cause:** Both live and local use hardcoded year. Not a discrepancy now but a maintenance concern. The local footer should use a dynamic year.
- **Screenshot:** N/A

---

## Summary

| # | Title | Severity | Category |
|---|-------|----------|----------|
| 1 | Hero image not showing | critical | image |
| 2 | Page title empty | major | seo |
| 3 | Sidebar menu items missing labels | critical | navigation |
| 4 | Social icons as colored squares | major | icon |
| 5 | Wrong articles in card section | major | content |
| 6 | Article cards missing description | major | content |
| 7 | Article cards vertical layout | major | layout |
| 8 | ~~Sideshow cards not clickable~~ | N/A | resolved |
| 9 | Carousel background image not visible | minor | image |
| 10 | Image URLs fail with ?w= param | major | image |
| 11 | Vue warning in console | cosmetic | console-error |
| 12 | GA firing on localhost | minor | functionality |
| 13 | Footer copyright year hardcoded | cosmetic | content |

**Critical:** 2 | **Major:** 6 | **Minor:** 2 | **Cosmetic:** 2 | **Total:** 12 (excluding #8 resolved)
