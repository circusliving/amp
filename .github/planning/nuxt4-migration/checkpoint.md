# Checkpoint

**Current phase:** Phase 04 in progress
**Last completed:** `phase-04/p04-02-header-footer-sidebar`
**Next task:** `phase-04/p04-03-card-components.md`
**Updated:** 2026-02-24T09:45:00Z

## State

- Phase 01 fully implemented (all 4 tasks)
- Phase 02 task 1 complete (types + queries)
- Phase 02 task 2 complete (DatoCMS client + typed fetch functions)
- Phase 02 task 3 complete (Nitro API routes for articles + web pages + HTML processor)
- Phase 02 task 4 complete (Nitro API routes for menus, images, places, identifiers)
- Phase 02 task 5 complete (Pinia stores: menu, article, navigation)
- Phase 03 task 1 complete (useSeoHead composable)
- Phase 03 task 2 complete (useWebPage composable + router.options.ts)
- Phase 03 task 3 complete (image-service.ts util + useImageAttrs composable)
- Phase 03 task 4 complete (helpers.ts, date-format.ts, locale JS files deleted)
- Phase 04 task 1 complete (app.vue verified, error.vue, app/layouts/default.vue, analytics.client.ts plugin; old layouts/default.vue deleted)
- Phase 04 task 2 complete (header-bar.vue, footer-bar.vue, social-bar.vue, side-bar.vue, side-menu.vue; old AMP components deleted)
- `pnpm test` passes — 178 tests across 22 test files
- Committed on branch `p04-02-header-footer-sidebar`

## Notes

- AMP dropped per user directive
- Old files renamed with `.old` suffix — originals in git history
- Old `modules/` renamed to `modules.old/`
- Old `package.json` preserved as `package.json.old`
- `apollo/` directory deleted (all queries consolidated into `server/utils/graphql-queries.ts`)
- `nuxt.config.ts` `lazy: true` removed from i18n config (v10 breaking change — lazy is automatic when `file` is set)
- Duplicate import warnings in typecheck are from Nuxt's auto-import scanning `shared/types/index.ts` alongside individual files; harmless
- `modules.old/Dato.js` and `modules.old/configs/apollo.js` are neutralised (already in `.old` directory); originals preserved in git history
- `server/utils/dato-client.ts` — singleton `GraphQLClient` factory; reads `datoApiToken` from `runtimeConfig`; exports `_resetDatoClient()` for test isolation
- `server/utils/dato-fetch.ts` — 9 typed async fetch functions; explicitly imports `useDatoClient` for testability
- `LATEST_ARTICLES_WITH_LIMIT_QUERY` added to `graphql-queries.ts` to support variable `limit` in `fetchLatestArticles`
- `vitest.config.ts` created with `node` environment and path alias resolution
- `vitest.setup.ts` stubs Nitro auto-imports (`defineEventHandler`, `getQuery`, `getRouterParam`, `createError`) so API route files can be imported and tested directly in vitest without the Nitro runtime
- `server/utils/html-processor.ts` — adds `loading="lazy"` to `<img>` tags in article body HTML (AMP `<amp-img>` conversion dropped)
- `server/utils/menu-builder.ts` — pure `buildMenuTree(items)` function; ports the legacy Vuex `store/index.js` `makeTree` algorithm; supports one level of nesting
- API routes use Nitro auto-import style (no explicit h3 imports in route files)
- Article `[id].get.ts` passes body HTML through `processArticleHtml` before returning
- `store/index.js`, `store/article.js`, `store/menu.js` deleted (Vuex stores no longer needed)
- `fetchPlaceByIdentifier` and `fetchIdentifierByValue` added to `dato-fetch.ts`
- `app/stores/menu.ts` — `useMenuStore` with `isOpen`, `toggle()`, `open()`, `close()`; replaces Vuex `store/menu.js`
- `app/stores/article.ts` — `useArticleStore` with `latestArticles` + `fetchLatest(limit?)`; calls `useFetch('/api/articles/latest')`
- `app/stores/navigation.ts` — `useNavigationStore` with `menuItems` + `fetchMenu()`; calls `useFetch('/api/menu')`; replaces Vuex `nuxtServerInit` menu fetch
- `~~/shared/types/*` alias used in `app/stores/` files — `~~` resolves to rootDir (project root) in Nuxt 4 where `~` resolves to srcDir (`app/`)
- `vitest.setup.ts` extended with `useFetch` global stub returning `{ data: ref(null), error: ref(null), pending: ref(false), refresh: vi.fn() }`; individual store tests override per scenario via `vi.stubGlobal`
- No Vuex references remain in any `.ts`, `.vue`, or `.js` file outside `.old` suffixed files
- `app/composables/use-seo-head.ts` — `useSeoHead(options: MaybeRefOrGetter<SeoHeadOptions>)` composable; uses `useSeoMeta()` for all meta tags + `useHead()` for canonical link; reads `canonicalBaseUrl` from `useRuntimeConfig().public`; supports `website` and `article` og types; article-specific tags (`articlePublishedTime`, `articleModifiedTime`) only rendered when `type === 'article'`; fully reactive via getter functions passed to `useSeoMeta`
- 24 unit tests for `useSeoHead` cover basic meta, canonical URL construction, image tags, article-specific tags, and reactive getter behaviour
- `app/composables/use-web-page.ts` — `useWebPage()` composable; replaces `webPageMixin.js`; uses `useFetch(() => \`/api/web-pages${path}\`)` with reactive URL getter; passes `alternateName || name` as title to `useSeoHead`; throws `createError({ statusCode: 404 })` when fetch errors; returns `{ webPage, error, status }`
- `app/router.options.ts` — global scroll-to-top on navigation (replaces per-component `scrollToTop: true`); restores saved position for browser back/forward
- 16 unit tests for `useWebPage` cover URL construction, SEO option derivation (title fallback, image, description, canonicalPath), return value, and 404 error handling; `useSeoHead` is module-mocked to isolate the unit
- `app/utils/image-service.ts` — `parseImageUrl(url)` returns `{pathname, filename, extension}`; `buildSrcSet(url, widths)` generates responsive srcset using DatoCMS `?w=<width>` query params; `DEFAULT_WIDTHS = [320,480,640,768,960,1280]`; drops old HTTP HEAD dimension-fetching pattern from `modules/ImageService.js`
- `app/composables/use-image-attrs.ts` — `useImageAttrs(options: ImageAttrsOptions)` composable; accepts `url`, `alt` as `MaybeRefOrGetter`; returns reactive `{ src, srcSet, alt }` computed refs; replaces duplicated width/height/alt logic in PageBody, HeroTitle, articles page
- 16 unit tests for `image-service` cover URL parsing edge cases and srcset format; 15 unit tests for `useImageAttrs` cover reactivity, defaults, and return shape
- `app/utils/helpers.ts` — `truncateText(text, maxLength?)` truncates at Unicode code point boundaries (emoji-safe, spreads to `[...text]`); `getPath(item)` extracts URL pathname, replaces `modules/helpers.js`
- `app/utils/date-format.ts` — `formatDate(isoDate, format?)` wraps Luxon `DateTime.fromISO`; returns empty string for invalid dates; replaces Vue 2 `filters.dateFormat`
- `locales/en.js` and `locales/fr.js` deleted — `locales/en.ts` and `locales/fr.ts` already existed with ESM default exports; `nuxt.config.ts` references `.ts` files
- 14 unit tests for `helpers` cover truncation, edge cases, emoji safety, and URL path extraction; 11 unit tests for `date-format` cover default/custom formats, edge cases, and invalid inputs
- `app/error.vue` — `NuxtError` prop; `clearError({ redirect: '/' })` on button click; scoped SCSS
- `app/layouts/default.vue` — SSR navigation fetch via `useAsyncData`+`$fetch`; wraps `<HeaderBar />`, `<SideBar />`, `<FooterBar />`; `useSeoHead()` for default meta; `site-wrapper--menu-open` class bound to `menuStore.isOpen`; scoped SCSS flexbox shell
- `app/plugins/analytics.client.ts` — injects `gtag.js` + inline init script when `config.public.gaTagId` is set; client-only (`.client.ts` suffix)
- `layouts/default.vue` deleted — all AMP elements (`<amp-menu-container>`, `<amp-analytics>`, `<amp-install-serviceworker>`) removed
- `app/components/header-bar.vue` — fixed header; `useMenuStore().toggle()` replaces `on="tap:header-sidebar.toggle"`; `<NuxtImg>` logo; accessible hamburger with `aria-expanded`/`aria-controls`
- `app/components/footer-bar.vue` — copyright year via `new Date().getFullYear()`; `<SocialBar>` auto-imported; Options API `data()` removed
- `app/components/social-bar.vue` — migrated from Vue 2 Options API; manual `Icon` import removed (Nuxt auto-import); links as const array; scoped SCSS
- `app/components/side-bar.vue` — `<aside id="sidebar">` replaces `<amp-sidebar>`; CSS `translateX(-100%) → translateX(0)` transition; backdrop overlay; `Escape` key handler; `useMenuStore()` for open/close state; contains `<SideMenu>` and `<SocialBar>`
- `app/components/side-menu.vue` — `<details>/<summary>` accordion replaces `<amp-accordion>`; `<NuxtLink>` replaces `<nuxt-link>`; `useNavigationStore()` for items; `item.menuName ?? item.name` for display; calls `menuStore.close()` on link click
- `components/SocialBar.vue`, `components/amp/Header.vue`, `components/amp/Footer.vue`, `components/amp/SideBar.vue`, `components/amp/AmpSideMenu.vue` deleted
