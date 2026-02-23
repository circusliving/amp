# Checkpoint

**Current phase:** Phase 02 complete
**Last completed:** `phase-02/p02-05-pinia-stores`
**Next task:** `phase-03/p03-01-use-seo-head.md`
**Updated:** 2026-02-23T15:15:00Z

## State

- Phase 01 fully implemented (all 4 tasks)
- Phase 02 task 1 complete (types + queries)
- Phase 02 task 2 complete (DatoCMS client + typed fetch functions)
- Phase 02 task 3 complete (Nitro API routes for articles + web pages + HTML processor)
- Phase 02 task 4 complete (Nitro API routes for menus, images, places, identifiers)
- Phase 02 task 5 complete (Pinia stores: menu, article, navigation)
- Nuxt 4 dev server boots successfully
- `pnpm typecheck` passes with zero errors
- `pnpm test` passes — 82 tests across 16 test files
- Committed on branch `p02-05-pinia-stores`

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
