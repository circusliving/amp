# Task: Server API Routes — Menus, Images, Misc

**ID:** p02-04
**Status:** pending
**Depends on:** p02-02
**Context size:** small
**Branch:** `p02-04-api-menus-images`
**Target LOC:** ~120 (max 400)

## Goal

Create remaining Nitro server API routes for menus, image objects, and places. This completes the server data layer.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p02-04-api-menus-images`
3. Memory recall: Search Neo4j for `menu tree building`, `image object api`

## Inputs

- Phase context: `phase-02/context.md`
- `server/utils/dato-fetch.ts` (from p02-02)
- Old `store/index.js` — menu tree building logic in `nuxtServerInit`
- Old `modules/ImageService.js` — image dimension fetching

## Steps

1. Create `server/api/menu.get.ts`:
   - Calls `fetchAllWebPages()` to get all web pages
   - Builds the menu tree structure from flat web page list (port the tree-building logic from `store/index.js` `nuxtServerInit`)
   - Returns typed `MenuItem[]` (nested tree)

2. Create `server/api/image-objects/[id].get.ts`:
   - Calls `fetchImageObject(id)`
   - Returns typed `ImageObject`
   - 404 if not found

3. Create `server/api/places/[id].get.ts`:
   - Calls `fetchPlaceByIdentifier(id)` (add to dato-fetch if not already there)
   - Returns typed response
   - 404 if not found

4. Create `server/api/identifiers/[value].get.ts`:
   - Calls `fetchIdentifierByValue(value)` 
   - Returns identifier resolution result
   - Used for URL slug → identifier lookup

5. Port the menu tree-building algorithm from `store/index.js`:
   - The old `nuxtServerInit` flattens all web pages and builds parent-child relationships
   - Create `server/utils/menu-builder.ts` with a pure function `buildMenuTree(pages: WebPage[]): MenuItem[]`
   - No Vuex dependency, just pure data transformation

6. Delete old files:
   - `store/index.js` (Vuex root store)
   - `store/article.js` (Vuex article store)  
   - `store/menu.js` (Vuex menu store)
   - `modules/SiteMap.js` (SSG route generation — not needed for SSR)

## Testing

- [ ] Unit test `menu-builder.ts` with sample web page data
- [ ] Unit test each API route with mocked dato-fetch
- [ ] Verify menu tree nesting is correct
- [ ] Verify 404 handling

## Outputs

- `server/api/menu.get.ts`
- `server/api/image-objects/[id].get.ts`
- `server/api/places/[id].get.ts`
- `server/api/identifiers/[value].get.ts`
- `server/utils/menu-builder.ts`

## Done When

- [ ] Menu API returns correctly nested tree
- [ ] All API routes typed and tested
- [ ] Old Vuex store files deleted
- [ ] Old SiteMap module deleted

## Commits

Final commit: `p02-04-api-menus-images`

## Rollback

- Delete new server/api files, restore old store files from git

## Handoff

Next: `phase-02/p02-05-pinia-stores.md`
State: All server API routes complete. Menu tree building works server-side. Old Vuex stores deleted.
