# Task: app.vue, error.vue & Default Layout

**ID:** p04-01
**Status:** pending
**Depends on:** p03-01
**Context size:** medium
**Branch:** `p04-01-layout`
**Target LOC:** ~150 (max 400)

## Goal

Create the root `app.vue`, error page, and default layout. Remove all AMP boilerplate from the layout. Set up GA4 analytics via client plugin.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p04-01-layout`
3. Memory recall: Search Neo4j for `nuxt layout`, `app.vue`, `error page`, `analytics`

## Inputs

- Phase context: `phase-04/context.md`
- Old `layouts/default.vue` — AMP layout with `<amp-menu-container>`, `<amp-analytics>`, `<amp-install-serviceworker>`, `<nuxt/>`
- Old `pages/offline.vue-todo` — reference for offline page pattern
- `app/composables/use-seo-head.ts` (from p03-01)

## Steps

1. Update `app/app.vue` (minimal, already created in p01-01):
   ```vue
   <template>
     <NuxtLayout>
       <NuxtPage />
     </NuxtLayout>
   </template>
   ```

2. Create `app/error.vue`:
   ```vue
   <script setup lang="ts">
   import type { NuxtError } from '#app';
   
   const props = defineProps<{ error: NuxtError }>();
   
   const handleClearError = () => clearError({ redirect: '/' });
   </script>
   
   <template>
     <div class="container text-center py-5">
       <h1>{{ error.statusCode }}</h1>
       <p>{{ error.statusMessage || 'An error occurred' }}</p>
       <button class="btn btn-primary" @click="handleClearError">
         Go Home
       </button>
     </div>
   </template>
   ```

3. Create `app/layouts/default.vue`:
   - Replace `<nuxt/>` with `<slot />`
   - Remove ALL AMP elements:
     - `<amp-menu-container>` → remove (sidebar toggling via Vue state)
     - `<amp-install-serviceworker>` → remove (handle in plugin if needed)
     - `<amp-analytics>` → remove (replaced by GA4 plugin)
   - Port the layout structure:
     ```vue
     <script setup lang="ts">
     const navigationStore = useNavigationStore();
     const menuStore = useMenuStore();
     
     // Fetch navigation menu on app load
     await useAsyncData('navigation', () => $fetch('/api/menu'));
     </script>
     
     <template>
       <div class="site-wrapper">
         <HeaderBar />
         <SideBar />
         <main>
           <slot />
         </main>
         <FooterBar />
       </div>
     </template>
     ```
   - Remove Options API (`data()`, `computed`, `head()`, `$store` access)
   - Use `useSeoHead()` for default meta tags
   - Scoped SCSS styles

4. Create `app/plugins/analytics.client.ts`:
   - Client-only plugin for Google Analytics 4
   ```typescript
   export default defineNuxtPlugin(() => {
     const config = useRuntimeConfig();
     const tagId = config.public.gaTagId;
     if (!tagId) return;
     
     // Load gtag.js
     useHead({
       script: [
         { src: `https://www.googletagmanager.com/gtag/js?id=${tagId}`, async: true },
         { innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${tagId}');` },
       ],
     });
   });
   ```

5. Delete old layout:
   - `layouts/default.vue`

## Testing

- [ ] Layout renders with header, main slot, and footer
- [ ] Navigation data loads on app init
- [ ] GA4 script injected when tag ID is set
- [ ] No AMP elements in rendered HTML
- [ ] Error page displays for 404s

## Outputs

- `app/app.vue` (updated)
- `app/error.vue`
- `app/layouts/default.vue`
- `app/plugins/analytics.client.ts`

## Done When

- [ ] Layout renders standard HTML (zero AMP)
- [ ] Error page works
- [ ] Analytics loads client-side
- [ ] All styles scoped
- [ ] Old layout deleted

## Commits

Final commit: `p04-01-layout`

## Rollback

- Revert layout files, restore old layout from git

## Handoff

Next: `phase-04/p04-02-header-footer-sidebar.md`
State: Layout shell complete. Header/Footer/Sidebar components referenced but not yet created.
