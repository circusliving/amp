# Phase 02: Data Layer (Server API + Stores + Types)

## Purpose

Replace Apollo Client v2 with Nitro server API routes that query DatoCMS GraphQL directly using `graphql-request`. Replace Vuex stores with Pinia. Define shared TypeScript types for all data models. This phase produces a fully typed data layer that pages and components will consume via `useFetch`.

## Shared Context

- **DatoCMS** is the headless CMS. All content (articles, web pages, images, menus) comes from its GraphQL API.
- **API Token:** DatoCMS API token is in `runtimeConfig.datoApiToken` (server-only). Never expose to client.
- **GraphQL queries** are currently in `apollo/*.js` and `apollo/*.gql` files. These will be consolidated into `server/utils/graphql-queries.ts`.
- **Data flow:** Client → `useFetch('/api/articles/latest')` → Nitro server route → `graphql-request` → DatoCMS GraphQL → typed response → client.
- **graphql-request v7 (7.4.0)** is ESM-only with a redesigned API (breaking from v5). Use `import { GraphQLClient } from 'graphql-request'` and its typed `request()` method. No `graphql-tag` needed — plain string queries work.
- **Vuex stores** (index.js, article.js, menu.js) are replaced by Pinia 3 stores that use `useFetch` internally.
- **Image dimensions** were fetched via HTTP HEAD to S3 (reading custom headers). Replace with `@nuxt/image` which handles sizing natively, or preserve minimal dimension-fetching server utility if DatoCMS image API provides width/height.

## Key Files (Old)

| File | Purpose |
|------|---------|
| `apollo/config.js` | Apollo Client config with DatoCMS API token |
| `apollo/allArticles.gql` | GraphQL: fetch all articles |
| `apollo/articleByIdentifier.js` | GraphQL: single article by identifier |
| `apollo/latestArticles.js` | GraphQL: latest N articles |
| `apollo/latestArticlesByTag.js` | GraphQL: articles by tag |
| `apollo/allWebPages.js` | GraphQL: all web pages |
| `apollo/webpageByPath.js` | GraphQL: web page by URL path |
| `apollo/imageObjectByIdentifier.js` | GraphQL: image object by ID |
| `apollo/placeByIdentifier.js` | GraphQL: place by ID |
| `apollo/identifierByValue.js` | GraphQL: identifier lookup |
| `store/index.js` | Vuex root: nuxtServerInit, menu tree building |
| `store/article.js` | Vuex: article state, getters, actions |
| `store/menu.js` | Vuex: menu open/close state |
| `modules/Dato.js` | DatoCMS client wrapper |
| `modules/configs/apollo.js` | Apollo connection config |

## Key Files (New)

| File | Purpose |
|------|---------|
| `shared/types/article.ts` | Article interface |
| `shared/types/web-page.ts` | WebPage interface |
| `shared/types/image-object.ts` | ImageObject interface |
| `shared/types/menu.ts` | Menu interfaces |
| `server/utils/dato-client.ts` | GraphQL client factory (graphql-request) |
| `server/utils/graphql-queries.ts` | All GraphQL query strings |
| `server/api/articles/index.get.ts` | GET /api/articles |
| `server/api/articles/[id].get.ts` | GET /api/articles/:id |
| `server/api/articles/latest.get.ts` | GET /api/articles/latest |
| `server/api/web-pages/[...path].get.ts` | GET /api/web-pages/:path |
| `server/api/image-objects/[id].get.ts` | GET /api/image-objects/:id |
| `server/api/menu.get.ts` | GET /api/menu |
| `app/stores/article.ts` | Pinia article store |
| `app/stores/menu.ts` | Pinia menu store |

## Constraints

- Never expose DatoCMS API token to the client (server-only runtimeConfig)
- All GraphQL queries run server-side only (in Nitro API routes)
- All API responses must be fully typed
- Use `graphql-request` (lightweight) instead of Apollo Client
- Pin `graphql-request` version in package.json
