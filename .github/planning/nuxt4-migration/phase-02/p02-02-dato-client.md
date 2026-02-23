# Task: DatoCMS Client & Server Utils

**ID:** p02-02
**Status:** pending
**Depends on:** p02-01
**Context size:** small
**Branch:** `p02-02-dato-client`
**Target LOC:** ~80 (max 400)

## Goal

Create a typed `graphql-request` client for DatoCMS that reads the API token from runtime config. Create server utility functions for common data-fetching patterns.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p02-02-dato-client`
3. Memory recall: Search Neo4j for `graphql-request`, `dato client`, `nitro server utils`

## Inputs

- Phase context: `phase-02/context.md`
- Old `apollo/config.js` — DatoCMS endpoint and auth config
- Old `modules/Dato.js` — DatoCMS client wrapper
- `server/utils/graphql-queries.ts` (from p02-01)

## Steps

1. Create `server/utils/dato-client.ts`:
   ```typescript
   import { GraphQLClient } from 'graphql-request';

   let client: GraphQLClient | null = null;

   export function useDatoClient(): GraphQLClient {
     if (!client) {
       const config = useRuntimeConfig();
       client = new GraphQLClient('https://graphql.datocms.com', {
         headers: {
           Authorization: `Bearer ${config.datoApiToken}`,
           'X-Environment': 'main',
         },
       });
     }
     return client;
   }
   ```
   **Note:** `graphql-request` v7.4.0 is ESM-only. Import with `import { GraphQLClient } from 'graphql-request'`. The `request()` method supports typed responses: `client.request<T>(query, variables)`. No `graphql-tag` needed — plain string queries work directly.
   (Nitro auto-imports `useRuntimeConfig` in server utils.)

2. Create typed wrapper functions in `server/utils/dato-fetch.ts`:
   - `fetchArticles()` — returns `Article[]`
   - `fetchArticleByIdentifier(id: string)` — returns `Article | null`
   - `fetchLatestArticles(limit?: number)` — returns `Article[]`
   - `fetchWebPageByPath(path: string)` — returns `WebPage | null`
   - `fetchAllWebPages()` — returns `WebPage[]`
   - `fetchImageObject(id: string)` — returns `ImageObject | null`
   - `fetchMenuItems()` — returns `MenuItem[]`

   Each function uses `useDatoClient()` and the queries from `graphql-queries.ts`.

3. Delete old files:
   - `modules/Dato.js`
   - `modules/configs/apollo.js`

## Testing

- [ ] Unit test `dato-client.ts`: mock `useRuntimeConfig`, verify client creation
- [ ] Unit test `dato-fetch.ts`: mock GraphQL client, verify typed responses
- [ ] TypeScript compiles without errors

## Outputs

- `server/utils/dato-client.ts`
- `server/utils/dato-fetch.ts`

## Done When

- [ ] DatoCMS client reads token from runtimeConfig
- [ ] All fetch functions are typed
- [ ] Old Apollo/Dato files deleted
- [ ] Unit tests pass

## Commits

Final commit: `p02-02-dato-client`

## Rollback

- Delete `server/utils/dato-client.ts` and `server/utils/dato-fetch.ts`

## Handoff

Next: `phase-02/p02-03-api-articles-webpages.md`
State: DatoCMS client and typed fetch functions ready. Server API routes can now use them.
