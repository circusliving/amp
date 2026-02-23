# Task: Shared Types & GraphQL Queries

**ID:** p02-01
**Status:** complete
**Depends on:** p01-02
**Context size:** medium
**Branch:** `p02-01-types-and-queries`
**Target LOC:** ~200 (max 400)

## Goal

Define TypeScript interfaces for all data models and consolidate all GraphQL query strings into a single typed server utility.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p02-01-types-and-queries`
3. Memory recall: Search Neo4j for `datocms graphql`, `typescript interfaces`

## Inputs

- Phase context: `phase-02/context.md`
- Old `apollo/*.js` and `apollo/*.gql` files — extract all GraphQL query strings
- Old `store/article.js` — understand article data shape
- Old `store/index.js` — understand menu/webPage data shapes

## Steps

1. Create `shared/types/article.ts`:
   - `Article` interface with all fields from DatoCMS (identifier, title, text, description, image, tags, dates, etc.)
   - Export type for article list responses

2. Create `shared/types/web-page.ts`:
   - `WebPage` interface with path, title, description, sections, image, etc.

3. Create `shared/types/image-object.ts`:
   - `ImageObject` interface with identifier, url, width, height, alt, description

4. Create `shared/types/menu.ts`:
   - `MenuItem` interface (label, url, children, identifier)
   - `MenuTree` type for nested menu structure

5. Create `shared/types/index.ts`:
   - Re-export all types for convenient imports

6. Create `server/utils/graphql-queries.ts`:
   - Consolidate ALL GraphQL queries from `apollo/` directory:
     - `ALL_ARTICLES_QUERY`
     - `ARTICLE_BY_IDENTIFIER_QUERY`
     - `LATEST_ARTICLES_QUERY`
     - `LATEST_ARTICLES_BY_TAG_QUERY`
     - `ALL_WEB_PAGES_QUERY`
     - `WEB_PAGE_BY_PATH_QUERY`
     - `IMAGE_OBJECT_BY_IDENTIFIER_QUERY`
     - `PLACE_BY_IDENTIFIER_QUERY`
     - `IDENTIFIER_BY_VALUE_QUERY`
   - Type each query's expected response shape
   - Use template literals (no `gql` tag needed for `graphql-request`)

7. Delete old `apollo/` directory entirely (all files).

## Testing

- [ ] All types compile without errors (`pnpm typecheck`)
- [ ] GraphQL query strings are syntactically valid
- [ ] No duplicate query definitions

## Outputs

- `shared/types/article.ts`
- `shared/types/web-page.ts`
- `shared/types/image-object.ts`
- `shared/types/menu.ts`
- `shared/types/index.ts`
- `server/utils/graphql-queries.ts`

## Done When

- [x] All DatoCMS data models have TypeScript interfaces
- [x] All GraphQL queries consolidated in one file
- [x] Types compile in strict mode
- [x] Old `apollo/` directory deleted

## Commits

Final commit: `p02-01-types-and-queries`

## Rollback

- Delete `shared/types/` and `server/utils/graphql-queries.ts`

## Handoff

Next: `phase-02/p02-02-dato-client.md`
State: Types and queries defined. Ready to create the GraphQL client that uses them.
