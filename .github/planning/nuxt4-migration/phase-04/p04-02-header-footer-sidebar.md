# Task: Header, Footer & Sidebar Components

**ID:** p04-02
**Status:** pending
**Depends on:** p04-01
**Context size:** medium
**Branch:** `p04-02-header-footer-sidebar`
**Target LOC:** ~200 (max 400)

## Goal

Create the header, footer, sidebar, and side-menu components. Replace AMP sidebar/accordion/menu-container with standard HTML + CSS transitions + Vue state.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p04-02-header-footer-sidebar`
3. Memory recall: Search Neo4j for `sidebar component`, `accordion`, `navigation menu`

## Inputs

- Phase context: `phase-04/context.md`
- Old `components/amp/Header.vue` — logo + sidebar toggle button (`on="tap:header-sidebar.toggle"`)
- Old `components/amp/Footer.vue` — simple footer with data()
- Old `components/amp/SideBar.vue` — `<amp-sidebar>` wrapper + close button
- Old `components/amp/AmpSideMenu.vue` — `<amp-accordion>` with `<nuxt-link>` menu items
- Pinia `useMenuStore()` (from p02-05)
- Pinia `useNavigationStore()` (from p02-05)

## Steps

1. Create `app/components/header-bar.vue`:
   - Replace `on="tap:header-sidebar.toggle"` with `@click="menuStore.toggle()"`
   - Replace `<amp-img>` logo with `<NuxtImg>` or `<img loading="lazy">`
   - Use `useMenuStore()` for sidebar state
   - Accessible hamburger button with `aria-expanded`, `aria-controls`
   ```vue
   <script setup lang="ts">
   const menuStore = useMenuStore();
   </script>
   <template>
     <header class="header-bar">
       <NuxtLink to="/" class="logo">
         <NuxtImg src="/logo.png" alt="Circus Living" width="200" height="50" />
       </NuxtLink>
       <button
         class="menu-toggle"
         :aria-expanded="menuStore.isOpen"
         aria-controls="sidebar"
         @click="menuStore.toggle()"
       >
         <Icon name="menu" />
       </button>
     </header>
   </template>
   ```

2. Create `app/components/footer-bar.vue`:
   - Simple footer with social links
   - Replace old `data()` with reactive refs
   - Use `<NuxtLink>` for internal links
   ```vue
   <script setup lang="ts">
   const currentYear = new Date().getFullYear();
   </script>
   ```

3. Create `app/components/side-bar.vue`:
   - Replace `<amp-sidebar id="header-sidebar" side="left" layout="nodisplay">` with:
     ```html
     <aside id="sidebar" class="side-bar" :class="{ 'is-open': menuStore.isOpen }">
     ```
   - CSS transition: `transform: translateX(-100%)` → `translateX(0)` when open
   - Overlay backdrop that closes sidebar on click
   - `Escape` key closes sidebar
   - Focus trap for accessibility
   - Use `useMenuStore()` for state

4. Create `app/components/side-menu.vue`:
   - Replace `<amp-accordion>` with `<details>/<summary>` elements
   - `<nuxt-link>` → `<NuxtLink>`
   - Use `useNavigationStore()` for menu items
   - Recursive rendering for nested menu items
   - Accessible keyboard navigation
   ```vue
   <script setup lang="ts">
   const navigationStore = useNavigationStore();
   </script>
   <template>
     <nav class="side-menu" aria-label="Main navigation">
       <ul>
         <li v-for="item in navigationStore.menuItems" :key="item.identifier">
           <details v-if="item.children?.length">
             <summary>{{ item.label }}</summary>
             <ul>
               <li v-for="child in item.children" :key="child.identifier">
                 <NuxtLink :to="child.url" @click="menuStore.close()">
                   {{ child.label }}
                 </NuxtLink>
               </li>
             </ul>
           </details>
           <NuxtLink v-else :to="item.url" @click="menuStore.close()">
             {{ item.label }}
           </NuxtLink>
         </li>
       </ul>
     </nav>
   </template>
   ```

5. Delete old component files:
   - `components/amp/Header.vue`
   - `components/amp/Footer.vue`
   - `components/amp/SideBar.vue`
   - `components/amp/AmpSideMenu.vue`

## Testing

- [ ] Header renders logo and toggle button
- [ ] Sidebar opens/closes with CSS transition
- [ ] Menu items render from navigation store
- [ ] Accordion (details/summary) is keyboard accessible
- [ ] Escape key closes sidebar
- [ ] All links use NuxtLink

## Outputs

- `app/components/header-bar.vue`
- `app/components/footer-bar.vue`
- `app/components/side-bar.vue`
- `app/components/side-menu.vue`

## Done When

- [ ] All 4 components typed and working
- [ ] No AMP elements
- [ ] Accessible (aria attributes, keyboard nav)
- [ ] Scoped styles
- [ ] Old files deleted

## Commits

Final commit: `p04-02-header-footer-sidebar`

## Rollback

- Delete new component files, restore old from git

## Handoff

Next: `phase-04/p04-03-card-components.md`
State: Layout shell complete with header, footer, sidebar, and side-menu. Navigation works.
