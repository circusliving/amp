# Checkpoint

**Current phase:** Phase 02 in progress
**Last completed:** `phase-02/p02-02-dato-client`
**Next task:** `phase-02/p02-03-api-articles-webpages.md`
**Updated:** 2026-02-23T15:00:00Z

## State

- Phase 01 fully implemented (all 4 tasks)
- Phase 02 task 1 complete (types + queries)
- Phase 02 task 2 complete (DatoCMS client + typed fetch functions)
- Nuxt 4 dev server boots successfully
- `pnpm typecheck` passes with zero errors
- `pnpm test` passes — 16 tests across 2 test files
- Committed on branch `p02-02-dato-client`

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
- `server/utils/dato-fetch.ts` — 7 typed async fetch functions; explicitly imports `useDatoClient` for testability
- `LATEST_ARTICLES_WITH_LIMIT_QUERY` added to `graphql-queries.ts` to support variable `limit` in `fetchLatestArticles`
- `vitest.config.ts` created with `node` environment and path alias resolution
