# Phase 04: Layout & Core Components

## Purpose

Migrate all Vue components from Vue 2 Options API to Vue 3 Composition API with `<script setup lang="ts">`. Remove all AMP-specific markup and replace with standard HTML/CSS. Rename all files to kebab-case. All components are auto-imported by Nuxt 4.

## Shared Context

- **AMP removal:** All `<amp-*>` elements are replaced with standard HTML equivalents:
  - `<amp-img>` → `<NuxtImg>` (from `@nuxt/image`) or standard `<img loading="lazy">`
  - `<amp-sidebar>` → `<aside>` with CSS transition + Vue state
  - `<amp-accordion>` → `<details>/<summary>` or Vue component with `v-show`
  - `<amp-carousel>` → CSS scroll-snap or lightweight JS carousel
  - `<amp-analytics>` → GA4 via `nuxt-gtag` module or client plugin
  - `<amp-install-serviceworker>` → client plugin or `@vite-pwa/nuxt`
  - `on="tap:..."` → `@click` event handlers
  - `layout="responsive|fill|intrinsic"` → CSS (`object-fit`, `aspect-ratio`, `width:100%`)
  - `amp-fx="parallax"` → CSS + IntersectionObserver (or removed if not needed)

- **Component naming:** Nuxt 4 auto-imports from `app/components/`. Files are kebab-case. Component names in templates use PascalCase auto-resolved by Nuxt.

- **No manual imports:** Remove all `import X from '~/components/...'` and `components: { ... }` registrations.

- **No Options API patterns:**
  - `data()` → `ref()` / `reactive()`
  - `computed: {}` → `computed()`
  - `methods: {}` → plain functions
  - `created` → code in `<script setup>` body or `onMounted()`
  - `filters` → helper functions (Vue 3 removed filters)
  - `mixins` → composables
  - `props: []` → `defineProps<{ ... }>()`
  - `$store` → Pinia composables
  - `$route` → `useRoute()`

- **Scoped styles:** All component `<style>` blocks must be `<style scoped lang="scss">` unless intentionally global.

## Key Component Mapping (Old → New)

| Old Path | New Path | Notes |
|----------|----------|-------|
| `components/amp/Card.vue` | `app/components/card.vue` | Drop amp/ prefix |
| `components/amp/CardCL.vue` | `app/components/card-cl.vue` | |
| `components/amp/CardImgMiddle.vue` | `app/components/card-img-middle.vue` | |
| `components/amp/CardList.vue` | `app/components/card-list.vue` | |
| `components/amp/Footer.vue` | `app/components/footer-bar.vue` | Renamed to avoid HTML conflict |
| `components/amp/Header.vue` | `app/components/header-bar.vue` | Renamed to avoid HTML conflict |
| `components/amp/HeroTitle.vue` | `app/components/hero-title.vue` | |
| `components/amp/ImageList.vue` | `app/components/image-list.vue` | |
| `components/amp/PageBody.vue` | `app/components/page-body.vue` | |
| `components/amp/PopularPosts.vue` | `app/components/popular-posts.vue` | |
| `components/amp/SideBar.vue` | `app/components/side-bar.vue` | |
| `components/amp/AmpSideMenu.vue` | `app/components/side-menu.vue` | Drop Amp prefix |
| `components/amp/AmpQuote.vue` | `app/components/quote-block.vue` | Renamed for clarity |
| `components/amp/AmpQuotes.vue` | `app/components/quotes-carousel.vue` | Renamed for clarity |
| `components/amp/AmpSectionHeaderH2.vue` | `app/components/section-header-h2.vue` | |
| `components/amp/AmpSectionHeaderH3.vue` | `app/components/section-header-h3.vue` | |
| `components/amp/ThreeCards.vue` | `app/components/three-cards.vue` | |
| `components/CLIcons.vue` | `app/components/cl-icons.vue` | |
| `components/Icon.vue` | `app/components/icon.vue` | |
| `components/SocialBar.vue` | `app/components/social-bar.vue` | |

## Constraints

- All components use `<script setup lang="ts">`
- All props use `defineProps<T>()` with TypeScript interface
- All emits use `defineEmits<T>()`
- All styles are `<style scoped lang="scss">`
- Use `<NuxtLink>` for internal links (not `<nuxt-link>` or `<a>`)
- Use `<NuxtImg>` for images where beneficial (DatoCMS CDN integration)
- No manual component imports or registrations
- No code duplication between components
- Slot syntax: `<template #slotName>` (not `slot="slotName"`)
