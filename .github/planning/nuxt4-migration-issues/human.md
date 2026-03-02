# Nuxt 4 Migration — Visual & Functional Issues

Comparison: **Live** (https://circusliving.com) vs **Local** (http://localhost:3000)
Date: 2026-03-01 | Branch: `p06-05-docker-verify`

---

## User-Reported Issues (confirmed)

[ ] 1. **Hero image not visible on homepage** — Hero area renders as solid black (#000 background). The `useWebPage()` composable returns `coverImage: undefined` because the `/api/web-pages/` endpoint returns 503 (DatoCMS unreachable). The `<img v-if="src">` never renders since `src` is empty. Affects ALL pages that use `<HeroTitle :image="heroImage">` — homepage, section pages, article pages.

[ ] 2. **Menu sidebar has no navigation items** — Sidebar opens but the `<ul class="side-menu__list">` is empty. The `/api/menu` API returns 503. The `navigationStore.menuItems` array stays empty, so `v-for="item in navigationStore.menuItems"` renders nothing. Social icon squares appear but icons inside are invisible (issue #3).

[ ] 3. **Social icons not rendering (footer + sidebar)** — The `<Icon>` component uses `<svg><use href="#icon-facebook"></svg>` to reference SVG symbols defined in `<ClIcons>`. However, `<ClIcons>` is **never mounted** anywhere in the app. It exists as `app/components/cl-icons.vue` but is not included in `app.vue`, `default.vue`, or any layout. The SVG `<use>` elements reference `#icon-*` IDs that don't exist in the DOM, so icons render as empty invisible boxes.

[ ] 4. **Card list section below carousel not rendering on homepage** — The `<CardList>` component depends on `/api/articles/latest?limit=6` which returns 503. `latestArticles` is null/empty, so `<Card v-for>` renders nothing. The `<div class="wagon">` section appears empty.

---

## Discovered Issues (from automated comparison)

[ ] 5. **ALL API endpoints return 503** — `/api/menu`, `/api/web-pages/`, `/api/articles/latest`, `/api/articles/:id`, all return `{"statusCode":503,"message":"Content service unavailable"}`. Root cause: DatoCMS GraphQL client fails. `.env` contains `NUXT_DATO_API_TOKEN` but the token may be expired/invalid, or the API endpoint is unreachable. This is the **root cause** of issues 1, 2, 4, and 7-9.

[ ] 6. **`/contact` returns 404** — The live site serves `/contact` as a CMS-driven page (hero + title). Locally, Nuxt's file-based routing has `[section]/[page].vue` which requires TWO path segments, but `/contact` has only ONE segment. No `app/pages/[...slug].vue` catch-all or `app/pages/contact.vue` exists, so Nuxt returns 404.

[ ] 7. **Article pages show 503 error screen** — Navigating to `/articles/mahlimae` shows the Nuxt error page ("An error has occurred, 503"). The `articles/[id].vue` page calls `useFetch('/api/articles/${id}')` which fails with 503, then `throw createError({ statusCode: 503 })` surfaces as a full-page error.

[ ] 8. **Section pages show empty content** — `/side-shows/mysterious-monster-marvels` renders the hero (black, no image) and footer, but the page body area between them is completely empty. The `useWebPage()` composable silently swallows 503 errors (only throws on 404), so `webPage` is null → `<PageBody v-if="webPage?.text">` doesn't render, `<ImageList>` and `<CardList>` get empty arrays.

[ ] 9. **Popular posts sidebar empty on article pages** — `articleStore.fetchLatest()` calls `/api/articles/latest` which returns 503. The `latestArticles` array stays empty, and the sidebar shows "Loading…" permanently.

[ ] 10. **`<ClIcons>` SVG sprite sheet not mounted in DOM** — The SVG symbol definitions for all icons (facebook, twitter, pinterest, instagram, youtube, google-plus) exist in `app/components/cl-icons.vue` but this component is never rendered. It must be included in `app.vue` or `default.vue` layout.

[ ] 11. **Homepage hero title is empty whitespace** — `index.vue` passes `title=" "` (single space) to `<HeroTitle>`. The component has `v-if="title.trim()"` which correctly hides the empty `<h1>`. On the live site, the homepage hero also has no visible title. This is **intentional** but confirms the hero area should show only the image — which makes issue #1 more critical since the hero is 100% image-dependent.

[ ] 12. **Canvas/OG meta tags are empty** — The SSR HTML shows `<meta property="og:title" content>`, `<meta property="og:description" content>`, `<meta name="description" content>` all with empty values. This is because `useSeoHead()` in `useWebPage()` receives empty strings when `webPage` is null (503 response).

[ ] 13. **Canonical URL missing protocol** — `<link rel="canonical" href="www.circusliving.com/">` lacks `https://` prefix. The `NUXT_PUBLIC_CANONICAL_BASE_URL` env var is set to `www.circusliving.com` without the protocol, producing invalid canonical URLs.

[ ] 14. **`/contact` route missing from Nuxt pages** — The live site has `/contact` as a single-segment path. The local app only has `[section]/[page].vue` (two segments). A catch-all `[...slug].vue` or a dedicated `contact.vue` page is needed.

[ ] 15. **Homepage article cards render empty when API works** — Even if the API were working, `<CardList>` checks `v-if="!webPage?.widget"` — but `webPage` may be null (503), so `!null?.widget` is truthy and it tries to render with an empty articles array. Should guard against null `latestArticles`.

[ ] 16. **No Google Fonts loaded** — The CSS references `'Euphoria Script'`, `'Roboto Slab'`, `'Roboto Condensed'` fonts but there is no `<link>` or `@import` to load them from Google Fonts. The live AMP site loads these via `<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=...">`. Locally, text falls back to system serif/sans-serif.

[ ] 17. **Vue warning: "Extraneous non-props attributes"** — Console shows `[Vue warn]: Extraneous non-props attributes (class) were passed to component but could not be automatically inherited.` This suggests a component has `inheritAttrs: false` missing or a multi-root template that doesn't forward `$attrs`.

[ ] 18. **Sidebar logo partially obscured** — When the sidebar opens on the local site, the close button `✕` overlaps with the "CIRCUS LIVING" logo text, cutting off part of it. On the live site the logo and close button are properly spaced.

[ ] 19. **No fontello/icon font loaded** — The live site uses a `fontello-social` icon font (CSS font with glyphs) for social icons. The migrated version uses inline SVG sprites via `<ClIcons>`. The SVG approach is correct but requires `<ClIcons>` to be mounted (issue #10). The `social-bar__item` still references `font-family: 'fontello-social'` in its CSS which is a dead reference.

[ ] 20. **Card images not rendering when API returns data** — The `<CardList>` and `<Card>` components should work when the API is functional, but the `card-columns` Bootstrap 4 class used in `card-list.vue` does not exist in Bootstrap 5 (it was removed). Cards may not lay out correctly when data is available.