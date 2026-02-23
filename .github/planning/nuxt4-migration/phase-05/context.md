# Phase 05: Pages & Routing

## Purpose

Migrate all page files from Nuxt 2 to Nuxt 4. Convert dynamic routes from `_param` to `[param]` syntax. Replace `asyncData` with `useAsyncData`/`useFetch`. Replace `head()` with `useSeoHead()`. Convert from Options API to Composition API. Fix the misspelled "gallaries" → "galleries".

## Shared Context

- **Dynamic route syntax change:** `_param` → `[param]` (Nuxt 4)
- **asyncData is gone:** Use `useAsyncData()` or `useFetch()` composables instead
- **head() is gone:** Use `useSeoHead()` composable (from p03-01)
- **Slot syntax:** Vue 2 `slot="name"` → Vue 3 `<template #name>` or `v-slot:name`
- **Mixins are gone:** Use `useWebPage()` composable (from p03-02)
- **$route / $store:** Use `useRoute()` / Pinia stores
- **$ToAMP / $axios:** Removed entirely (AMP dropped, axios replaced by useFetch)
- **payload pattern:** Nuxt 4 handles payloads natively via `useAsyncData`

## Key Route Mapping

| Old Route File | New Route File | URL Pattern |
|---------------|----------------|-------------|
| `pages/index.vue` | `app/pages/index.vue` | `/` |
| `pages/_section/_page.vue` | `app/pages/[section]/[page].vue` | `/:section/:page` |
| `pages/articles/_id.vue` | `app/pages/articles/[id].vue` | `/articles/:id` |
| `pages/gallaries/_id.vue` | `app/pages/galleries/[id].vue` | `/galleries/:id` (typo fixed) |
| `pages/image-objects/_id.vue` | `app/pages/image-objects/[id].vue` | `/image-objects/:id` |

## Key Files (Old)

| File | Complexity | Key Issues |
|------|-----------|------------|
| `pages/index.vue` | HIGH | Mixin, Options API, head(), slot v2 syntax |
| `pages/_section/_page.vue` | HIGH | Mixin usage, dynamic route |
| `pages/articles/_id.vue` | VERY HIGH | asyncData, apolloProvider, $ToAMP, $axios, head(), complex image processing |
| `pages/gallaries/_id.vue` | LOW | Stub, likely unused, misspelled |
| `pages/image-objects/_id.vue` | LOW | Empty stub |

## Constraints

- All pages use `<script setup lang="ts">`
- All data fetching via `useFetch()` (per project standards)
- All SEO via `useSeoHead()` composable
- CMS-driven pages use `useWebPage()` composable
- Dynamic params accessed via `useRoute().params`
- No `asyncData`, `head()`, `mixins`, `$store`, `$route`, `$axios`, `$ToAMP`
