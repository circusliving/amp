# Task: Pinia Stores

**ID:** p02-05
**Status:** pending
**Depends on:** p02-03
**Context size:** small
**Branch:** `p02-05-pinia-stores`
**Target LOC:** ~100 (max 400)

## Goal

Create Pinia stores to replace Vuex. These provide client-side state for menu visibility and article caching, using `useFetch` to call the new server API routes.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p02-05-pinia-stores`
3. Memory recall: Search Neo4j for `pinia store`, `vuex to pinia`

## Inputs

- Phase context: `phase-02/context.md`
- Old `store/menu.js` — menu open/close state  
- Old `store/article.js` — article state, getters (latestArticles, etc.)
- Server API routes (from p02-03, p02-04)

## Steps

1. Create `app/stores/menu.ts`:
   ```typescript
   export const useMenuStore = defineStore('menu', () => {
     const isOpen = ref(false);
     
     function toggle() { isOpen.value = !isOpen.value; }
     function open() { isOpen.value = true; }
     function close() { isOpen.value = false; }
     
     return { isOpen, toggle, open, close };
   });
   ```

2. Create `app/stores/article.ts`:
   ```typescript
   export const useArticleStore = defineStore('article', () => {
     const latestArticles = ref<Article[]>([]);
     
     async function fetchLatest(limit = 6) {
       const { data } = await useFetch('/api/articles/latest', {
         query: { limit },
       });
       if (data.value)
         latestArticles.value = data.value;
     }
     
     return { latestArticles, fetchLatest };
   });
   ```

3. Create `app/stores/navigation.ts`:
   ```typescript
   export const useNavigationStore = defineStore('navigation', () => {
     const menuItems = ref<MenuItem[]>([]);
     
     async function fetchMenu() {
       const { data } = await useFetch('/api/menu');
       if (data.value)
         menuItems.value = data.value;
     }
     
     return { menuItems, fetchMenu };
   });
   ```
   (This replaces the menu tree that was fetched in `nuxtServerInit`.)

4. Ensure all stores:
   - Use `defineStore` with setup syntax (not options syntax)
   - Are fully typed
   - Use `useFetch` to call server API routes (per project standards)
   - Are auto-imported via Pinia Nuxt module

## Testing

- [ ] Unit test each store (mock useFetch)
- [ ] Verify reactive state updates
- [ ] Verify store composables are auto-imported

## Outputs

- `app/stores/menu.ts`
- `app/stores/article.ts`
- `app/stores/navigation.ts`

## Done When

- [ ] All stores typed and tested
- [ ] No Vuex references remain anywhere in codebase
- [ ] Stores use useFetch (not $fetch directly on client)

## Commits

Final commit: `p02-05-pinia-stores`

## Rollback

- Delete `app/stores/` directory

## Handoff

Next: `phase-03/p03-01-use-seo-head.md`
State: Phase 02 complete. Full data layer: server API routes + Pinia stores + shared types. All old Apollo/Vuex/Dato code deleted.
