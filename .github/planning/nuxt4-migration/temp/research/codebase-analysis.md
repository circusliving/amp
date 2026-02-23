| `amp-module` | `1.0.0-beta.12` | **CRITICAL** — No Nuxt 3/4 support. Must be rebuilt or replaced |
| `nuxt-purgecss` | `^0.2.1` | **MEDIUM** — Replace with Nuxt 4 compatible CSS purging |
| `apollo-cache-inmemory` | `^1.6.3` | **HIGH** — Apollo Client 2.x → 3.x migration |
| `apollo-client` | `^2.0.0` | **HIGH** — Apollo Client 2.x → 3.x migration |
| `apollo-link` | `^1.0.0` | **HIGH** — Merged into `@apollo/client` v3 |
| `bootstrap` | `^4.3.1` | **MEDIUM** — Consider Bootstrap 5+ or Tailwind |
| `datocms-client` | `3.0.14` | **MEDIUM** — Check latest version compatibility |
| `dotenv` | `8.2.0` | **LOW** — Nuxt 4 has built-in runtime config |
| `dotenv-expand` | `^5.1.0` | **LOW** — Nuxt 4 has built-in runtime config |
| `express` | `^4.17.1` | **MEDIUM** — Nuxt 4 uses Nitro server; may not need Express |
| `serverless-http` | `^2.3.0` | **MEDIUM** — Nuxt 4/Nitro has built-in serverless presets |
| `string-strip-html` | `4.3.16` | **LOW** — Should still work |
| `lodash.clone` | `^4.5.0` | **LOW** — Replace with structuredClone() or spread |
| `consola` | `^2.10.1` | **LOW** — Update to latest |
| `concurrent-transform` | `^1.0.0` | **LOW** — Part of deploy pipeline |
| `gulp` | `4.0.2` | **LOW** — Deploy tooling, separate concern |
| `gulp-awspublish` | `^4.0.0` | **LOW** — Deploy tooling |
| `gulp-cloudfront-invalidate-aws-publish` | `1.0.0` | **LOW** — Deploy tooling |
| `gulp-rename` | `^2.0.0` | **LOW** — Deploy tooling |
| `fs-extra` | `^8.1.0` | **LOW** — Utility |
| `fs-nextra` | `^0.4.7` | **LOW** — Utility |
| `through2` | `^3.0.1` | **LOW** — Deploy tooling |
| `add` | `^2.0.6` | **LOW** — Likely accidental install |
| `yarn` | `^1.21.1` | **LOW** — Should not be a dependency. Remove |

### Dev Dependencies

| Package | Version | Migration Impact |
|---------|---------|-----------------|
| `@babel/runtime-corejs2` | `^7.8.4` | **HIGH** — Nuxt 4 uses Vite, no Babel needed |
| `@cypress/webpack-preprocessor` | `^4.1.1` | **HIGH** — Replace with Playwright |
| `@nuxtjs/eslint-config` | `^2.0.0` | **HIGH** — Replace with `@nuxt/eslint-config` |
| `@nuxtjs/eslint-module` | `^1.0.0` | **HIGH** — Replace with `@nuxt/eslint` module |
| `babel-eslint` | `^10.0.1` | **HIGH** — Replace with `@typescript-eslint/parser` |
| `core-js` | `^3.31.1` | **MEDIUM** — May not be needed with Vite |
| `eslint` | `^6.1.0` | **HIGH** — Upgrade to ESLint 9+ flat config |
| `eslint-config-standard` | `^14.1.0` | **HIGH** — Replace |
| `eslint-loader` | `^3.0.0` | **HIGH** — Not used with Vite |
| `eslint-plugin-html` | `6.0.0` | **MEDIUM** |
| `eslint-plugin-nuxt` | `>=0.4.2` | **HIGH** — Replace |
| `eslint-plugin-promise` | `^4.1.1` | **MEDIUM** |
| `eslint-plugin-standard` | `^4.0.0` | **MEDIUM** |
| `graphql-tag` | `^2.10.1` | **LOW** — Still needed |
| `sass` | `^1.57.0` | **LOW** — Still compatible |
| `sass-loader` | `^10.4.1` | **HIGH** — Vite handles SCSS natively |
| `pluralize` | `^8.0.0` | **LOW** |
| `vue-apollo` | `^3.0.0` | **HIGH** — Replace with `@vue/apollo-composable` v4 |
| `webpack` | `^4.41.0` | **CRITICAL** — Nuxt 4 uses Vite |

### Key Observations
- **ALL dependencies use `^` (caret ranges)** — violates pinned version requirement
- **No TypeScript** — entire project is JavaScript
- **No test framework** installed (mentions Cypress preprocessor but no test files)
- `yarn` as a dependency is incorrect — should be a dev tool only
- `add` package appears accidental

---

## 2. Nuxt 2 Specific Patterns

### 2.1 `nuxtServerInit` (Vuex Store Action)
- **File:** `store/index.js`
- **Pattern:** `nuxtServerInit` action dispatches store mutations on server start
- **Migration:** Replace with Nuxt 4 `app:created` hook or composables with `callOnce()`

### 2.2 `asyncData` (Nuxt 2 Page Hook)
- **Files:** 
  - `modules/webPageMixin.js` — asyncData in mixin
  - `pages/articles/_id.vue` — asyncData with apollo queries
  - `pages/image-objects/_id.vue` — empty asyncData stub
- **Migration:** Replace with `useAsyncData()` composable

### 2.3 `head()` Method (vue-meta)
- **Files:**
  - `modules/webPageMixin.js` — head() method in mixin
  - `pages/index.vue` — head() function
  - `pages/articles/_id.vue` — head() function
  - `layouts/default.vue` — head() function
- **Migration:** Replace with `useHead()` composable or `useSeoMeta()`

### 2.4 Nuxt 2 Modules (incompatible with Nuxt 4)
- `@nuxtjs/apollo` (v4 rc) — No Nuxt 3/4 support in this version
- `@nuxtjs/axios` — Removed. Use `useFetch`/`$fetch`
- `@nuxtjs/pwa` — No Nuxt 3/4 port. Use `@vite-pwa/nuxt`
- `amp-module` — **No Nuxt 3/4 equivalent exists**
- `nuxt-purgecss` — Replace with Nuxt 4 compatible version

### 2.5 `nuxt.config.js` Patterns (CommonJS)
- Uses `module.exports` (CJS) — Nuxt 4 uses `defineNuxtConfig()` in `nuxt.config.ts`
- `env` property — Replace with `runtimeConfig`
- `build.cache`, `build.parallel` — Vite-based, different config
- `css` array with `lang` property — Slightly different format in Nuxt 4
- `modules` array format — Same concept but different module APIs
- `render.resourceHints` — Not applicable in Nuxt 4
- `generate.routes` — Nuxt 4 uses `nitro.prerender.routes` or crawling
- `manifest` — PWA config changes
- `workbox` — Different PWA approach
- `toAmp` — Custom AMP module config, no Nuxt 4 equivalent
- `purgeCSS` — Different approach in Nuxt 4

### 2.6 `<nuxt/>` Component
- **File:** `layouts/default.vue` — Uses `<nuxt/>` 
- **Migration:** Replace with `<NuxtPage/>` (or `<slot/>` in Nuxt 4 layouts)

### 2.7 `<nuxt-link>` Component
- **Files:** Multiple components use `<nuxt-link>`
  - `components/amp/AmpSideMenu.vue`
  - `components/amp/Card.vue`
  - `components/amp/CardCL.vue`
  - `components/amp/CardImgMiddle.vue`
  - `components/amp/ImageList.vue`
  - `components/amp/PopularPosts.vue`
- **Migration:** Replace with `<NuxtLink>` (auto-imported in Nuxt 4)

### 2.8 `$store` Direct Access
- **File:** `layouts/default.vue` — `this.$store.state.menu`
- **Migration:** Replace Vuex with Pinia stores

### 2.9 `apolloProvider` Access Pattern
- **Files:** `store/index.js`, `store/article.js`, `modules/webPageMixin.js`, `pages/articles/_id.vue`
- **Pattern:** `app.apolloProvider.defaultClient.query()`
- **Migration:** Replace with composable-based Apollo or `useFetch` with GraphQL

### 2.10 `$ToAMP` Plugin Access
- **File:** `pages/articles/_id.vue`
- **Pattern:** `app.$ToAMP.loadHtml()`, `app.$ToAMP.loadImages()`, `app.$ToAMP.convertImages()`, `app.$ToAMP.toHTML()`
- **Migration:** From `amp-module` plugin — must be completely rewritten

### 2.11 `$axios` Dependency
- **Files:** `modules/webPageMixin.js`, `pages/articles/_id.vue`
- **Pattern:** `app.$axios.head()`
- **Migration:** Replace with `$fetch` or `ofetch`

### 2.12 `$route` Access
- **Files:** `layouts/default.vue`, `pages/index.vue`, `pages/articles/_id.vue`, `modules/webPageMixin.js`
- **Pattern:** `this.$route.path`
- **Migration:** Use `useRoute()` composable

### 2.13 File-based Routing (Underscore Prefix)
- **Files:** `pages/_section/_page.vue`, `pages/articles/_id.vue`, `pages/gallaries/_id.vue`, `pages/image-objects/_id.vue`
- **Pattern:** Nuxt 2 uses `_param` for dynamic routes
- **Migration:** Nuxt 4 uses `[param]` bracket syntax

### 2.14 `payload` in `asyncData`
- **Files:** `modules/webPageMixin.js`, `pages/articles/_id.vue`
- **Pattern:** `payload` parameter in asyncData for pre-generated content
- **Migration:** Nuxt 4 has built-in payload support via `useAsyncData`

---

## 3. Vue 2 Specific Patterns

### 3.1 Options API (ALL Components)
Every single component and page uses Options API:
- `export default { name, props, data, computed, methods, components, head, asyncData, created, filters, mixins }`
- **Migration:** Convert to `<script setup lang="ts">` with Composition API

### 3.2 Vue 2 `filters` (Removed in Vue 3)
- **File:** `components/amp/PopularPosts.vue`
- **Pattern:** `filters: { dateFormat }` and template usage `{{ a._updatedAt | dateFormat }}`
- **Migration:** Filters are **completely removed** in Vue 3. Convert to methods or computed properties.

### 3.3 Mixins (Discouraged in Vue 3)
- **File:** `modules/webPageMixin.js` — Used in `pages/index.vue` and `pages/_section/_page.vue`
- **Pattern:** `mixins: [ webPageMixin ]`
- **Migration:** Convert to composables (`useWebPage()`)

### 3.4 `data()` Function
- **Files:** `components/amp/Footer.vue`, `layouts/default.vue`
- **Pattern:** `data() { return { ... } }`
- **Migration:** Use `ref()` / `reactive()` in Composition API

### 3.5 `computed` as Object Property
- **Files:** Multiple components (Card.vue, ImageList.vue, PageBody.vue, PopularPosts.vue, HeroTitle.vue)
- **Pattern:** `computed: { fn1, fn2 }`
- **Migration:** Use `computed()` from Vue 3 Composition API

### 3.6 `methods` as Object Property
- **Files:** CardCL.vue, CardImgMiddle.vue, ImageList.vue, PageBody.vue, PopularPosts.vue, layouts/default.vue
- **Migration:** Just regular functions in `<script setup>`

### 3.7 `created` Lifecycle Hook
- **File:** `components/amp/PopularPosts.vue`
- **Pattern:** `created` hook
- **Migration:** Code in `created` runs in `<script setup>` body or `onBeforeMount()`

### 3.8 `destroyed` Lifecycle Hook (Renamed in Vue 3)
- **File:** `pages/offline.vue-todo`
- **Pattern:** `destroyed()` hook
- **Migration:** Renamed to `onUnmounted()` in Vue 3

### 3.9 `v-bind:key` Without Value
- **File:** `components/amp/PopularPosts.vue`
- **Pattern:** `v-for="a in latest" v-bind:key` (missing key value!)
- **Bug:** This is invalid even in Vue 2. Must be `v-bind:key="a.identifier"` or `:key="a.identifier"`

### 3.10 Manual Component Registration
- **All files** use `components: { ... }` for local registration
- **Migration:** Nuxt 4 auto-imports all components from `components/` directory

### 3.11 Manual Component Imports
- All components manually import their children via `import X from '~/components/...'`
- **Migration:** Auto-imports in Nuxt 4 eliminate need for manual imports

### 3.12 `scrollToTop` Property
- **Files:** `modules/webPageMixin.js`, `pages/articles/_id.vue`
- **Migration:** Not a standard Nuxt 4 option. Use middleware or router scrollBehavior.

### 3.13 Mappers from Vuex
- **File:** `components/amp/PopularPosts.vue`
- **Pattern:** `import { mapGetters } from 'vuex'`, `...gettersMap()`
- **Migration:** Replace with Pinia store composables

### 3.14 Slots with `slot` Attribute (Vue 2 Syntax)
- **File:** `pages/index.vue`
- **Pattern:** `<AmpCard slot="first" .../>`, `<AmpQuote slot="quoteOne" .../>`
- **Migration:** Vue 3 uses `<template #first>` or `v-slot:first`

---

## 4. File-by-File Migration Analysis

### Configuration Files

| File | Status | Notes |
|------|--------|-------|
| `nuxt.config.js` | **REWRITE** | CJS → ESM, `defineNuxtConfig`, runtimeConfig, remove env, Vite build |
| `vue.config.js` | **DELETE** | Not used in Nuxt 4 (Vite-based) |
| `package.json` | **REWRITE** | All deps change, pin versions, add TypeScript |
| `gulpfile.js` | **KEEP/UPDATE** | Deploy tool, separate concern |
| `serverless.yml` | **REWRITE** | Nuxt 4 Nitro has serverless presets, runtime nodejs10.x → 20.x+ |

### Layouts

| File | Complexity | Key Issues |
|------|-----------|------------|
| `layouts/default.vue` | **HIGH** | `<nuxt/>` → `<slot/>`, Options API, `$store` access, `head()`, GA analytics template, `amp-menu-container`/`amp-install-serviceworker`/`amp-analytics` AMP components |

### Pages

| File | Complexity | Key Issues |
|------|-----------|------------|
| `pages/index.vue` | **HIGH** | Mixin, Options API, `head()`, slot v2 syntax, path import |
| `pages/_section/_page.vue` | **HIGH** | `_param` → `[param]`, mixin, asyncData via mixin |
| `pages/articles/_id.vue` | **VERY HIGH** | asyncData, apolloProvider, $ToAMP, $axios, head(), complex image processing |
| `pages/gallaries/_id.vue` | **LOW** | Stub/incomplete page, likely unused. Note: "gallaries" is misspelled ("galleries") |
| `pages/image-objects/_id.vue` | **LOW** | Empty stub, asyncData empty |
| `pages/offline.vue-todo` | **LOW** | Disabled file, uses `destroyed` hook |

### Components (Root)

| File | Complexity | Key Issues |
|------|-----------|------------|
| `components/CLIcons.vue` | **LOW** | Options API, inline SVG sprites |
| `components/Icon.vue` | **LOW** | Options API, props array syntax, `xlink:href` SVG |
| `components/SocialBar.vue` | **LOW** | Options API, manual component import, hardcoded social links |

### Components (amp/)

| File | Complexity | Key Issues |
|------|-----------|------------|
| `amp/AmpQuote.vue` | **LOW** | Options API, manual import |
| `amp/AmpQuotes.vue` | **LOW** | Options API, AMP carousel/parallax, named slots |
| `amp/AmpSectionHeaderH2.vue` | **LOW** | Options API |
| `amp/AmpSectionHeaderH3.vue` | **LOW** | Options API |
| `amp/AmpSideMenu.vue` | **MEDIUM** | Options API, `nuxt-link`, `amp-accordion` |
| `amp/Card.vue` | **MEDIUM** | Options API, computed import from helpers, `nuxt-link` |
| `amp/CardCL.vue` | **LOW** | Options API, `nuxt-link` |
| `amp/CardImgMiddle.vue` | **LOW** | Options API, `nuxt-link` |
| `amp/CardList.vue` | **LOW** | Options API, manual component import |
| `amp/Footer.vue` | **LOW** | Options API, `data()` |
| `amp/Header.vue` | **LOW** | Options API, AMP sidebar trigger (`on="tap:..."`) |
| `amp/HeroTitle.vue` | **HIGH** | Options API, Node.js `url`/`path` modules (CJS `require`), complex computed |
| `amp/ImageList.vue` | **MEDIUM** | Options API, method import from helpers, `nuxt-link` |
| `amp/PageBody.vue` | **MEDIUM** | Options API, ImageService methods, v-html |
| `amp/PopularPosts.vue` | **VERY HIGH** | Vuex mapGetters, filters (removed in Vue 3), created hook, async methods, dead code (`src` function), `v-bind:key` bug |
| `amp/SideBar.vue` | **MEDIUM** | Options API, AMP sidebar, `nuxt-link` |
| `amp/ThreeCards.vue` | **LOW** | Options API, named slots |

### Store (Vuex)

| File | Complexity | Key Issues |
|------|-----------|------------|
| `store/index.js` | **HIGH** | `nuxtServerInit`, apolloProvider, tree-building logic, ES module imports |
| `store/article.js` | **HIGH** | apolloProvider access via `this.app`, Vuex state/getters/mutations/actions |
| `store/menu.js` | **LOW** | Simple state + mutation |

### Modules

| File | Complexity | Key Issues |
|------|-----------|------------|
| `modules/webPageMixin.js` | **VERY HIGH** | Mixin (→ composable), asyncData, head(), apolloProvider, $axios, gql, complex data fetching, inline GraphQL queries |
| `modules/helpers.js` | **MEDIUM** | Uses Node.js `url` module, `this` context (bound to Vue instance), exports computed property |
| `modules/ImageService.js` | **HIGH** | Singleton class with static methods, mutable module-level state (DIMENSIONS), axios for HEAD requests |
| `modules/SiteMap.js` | **MEDIUM** | DatoCMS client, route generation for static export |
| `modules/Dato.js` | **LOW** | DatoCMS client wrapper |
| `modules/configs/amp.js` | **HIGH** | AMP HTML transformation, string manipulation — no Nuxt 4 equivalent |
| `modules/configs/apollo.js` | **MEDIUM** | Apollo config (CJS) |
| `modules/configs/nuxt-i18n.js` | **MEDIUM** | i18n config, Vuex module reference |

### Apollo Queries

| File | Complexity | Notes |
|------|-----------|-------|
| `apollo/config.js` | **HIGH** | Uses `apollo-cache-inmemory` v2, exposes API token in code |
| `apollo/allArticles.gql` | **LOW** | Raw GQL file |
| `apollo/allWebPages.js` | **LOW** | `gql` tagged template |
| `apollo/articleByIdentifier.js` | **LOW** | `gql` tagged template |
| `apollo/identifierByValue.js` | **LOW** | Raw query (not wrapped in gql tag) |
| `apollo/imageObjectByIdentifier.js` | **LOW** | Raw query (not wrapped in gql tag) |
| `apollo/latestArticles.js` | **LOW** | `gql` tagged template |
| `apollo/latestArticlesByTag.js` | **LOW** | `gql` tagged template, hardcoded tag ID |
| `apollo/placeByIdentifier.js` | **LOW** | Raw query (not wrapped in gql tag) |
| `apollo/webpageByPath.js` | **LOW** | `gql` tagged template |

### Serverless / Deploy

| File | Complexity | Key Issues |
|------|-----------|------------|
| `sls/deploy.js` | **MEDIUM** | Gulp + AWS S3 deploy, CJS, separate from Nuxt |
| `sls/generator.js` | **HIGH** | Uses Nuxt 2 `Nuxt`, `Generator`, `Builder` classes directly |
| `sls/index.js` | **HIGH** | Express serverless handler, Nuxt generate, AWS S3 deploy |

### Other Files

| File | Notes |
|------|-------|
| `assets/main.css` | Global styles, lots of commented-out code |
| `assets/main.scss` | Imports Bootstrap 4 SCSS partials |
| `locales/en.js`, `locales/fr.js` | i18n locale files, return Promise (unusual) |
| `static/browserconfig.xml` | MS tile config |
| `static/install-sw.html` | Service worker installer (has `<hed>` typo) |

---

## 5. Code Duplication

### 5.1 `head()` Function — HEAVY Duplication
The `head()` function with SEO meta tags is duplicated in 3+ places:
- `modules/webPageMixin.js` (lines 48-81)
- `pages/index.vue` (lines 97-128)  
- `pages/articles/_id.vue` (lines 146-187)

All three have nearly identical meta tag structures (twitter, og, description, title, canonical).

**Recommendation:** Create a single `useSeoHead()` composable.

### 5.2 `ImageService` Usage — Repeated width/height/alt Pattern
The pattern of getting width, height, alt from ImageService is duplicated:
- `pages/articles/_id.vue` — `width()`, `height()`, `alt()` computed properties
- `components/amp/PageBody.vue` — Same `width()`, `height()`, `alt()` computed + `getSrcSet()`

### 5.3 `src()` Function — Copy-Pasted Dead Code
The `src()` function for URL parsing is duplicated:
- `components/amp/HeroTitle.vue` (lines 23-42) — Active, used as computed
- `components/amp/PopularPosts.vue` (lines 79-94) — **Dead code**, never called

### 5.4 `getImageAttrs()` Function
Similar image attribute fetching logic in:
- `pages/articles/_id.vue` (lines 92-112) 
- `modules/ImageService.js` (lines 65-91)

### 5.5 `.icon` CSS Styles
Duplicated between:
- `components/CLIcons.vue`
- `components/Icon.vue`

### 5.6 `.card-img-middle` Styles
Duplicated between:
- `components/amp/ImageList.vue` (scoped styles)
- `assets/main.css` (commented-out, but shows the duplication origin)

### 5.7 Global Style Bleeding
Multiple components have unscoped `<style>` blocks that could conflict:
- `components/amp/AmpQuotes.vue` — `.cover > img`, `.parallax-image-window amp-img`
- `components/amp/HeroTitle.vue` — `.cover > img`, `.hero-parallax-image-window amp-img`
- `pages/articles/_id.vue` — `.container`, `.section-title h3`, `.debug`
- `layouts/default.vue` (no scoped styles at all)

### 5.8 `needsSpace()` Method
Duplicated (with different thresholds):
- `components/amp/CardCL.vue` — `description.length <= 152`
- `components/amp/CardImgMiddle.vue` — `description.length <= 130`

---

## 6. File Naming Issues

### 6.1 Non-Kebab-Case Component Files (Violation)
Nuxt 4 convention requires kebab-case filenames. Current violations:

| Current Name | Should Be |
|-------------|-----------|
| `CLIcons.vue` | `cl-icons.vue` |
| `Icon.vue` | `icon.vue` |
| `SocialBar.vue` | `social-bar.vue` |
| `AmpQuote.vue` | `amp-quote.vue` |
| `AmpQuotes.vue` | `amp-quotes.vue` |
| `AmpSectionHeaderH2.vue` | `amp-section-header-h2.vue` |
| `AmpSectionHeaderH3.vue` | `amp-section-header-h3.vue` |
| `AmpSideMenu.vue` | `amp-side-menu.vue` |
| `Card.vue` | `card.vue` |
| `CardCL.vue` | `card-cl.vue` |
| `CardImgMiddle.vue` | `card-img-middle.vue` |
| `CardList.vue` | `card-list.vue` |
| `Footer.vue` | `footer.vue` |
| `Header.vue` | `header.vue` |
| `HeroTitle.vue` | `hero-title.vue` |
| `ImageList.vue` | `image-list.vue` |
| `PageBody.vue` | `page-body.vue` |
| `PopularPosts.vue` | `popular-posts.vue` |
| `SideBar.vue` | `side-bar.vue` |
| `ThreeCards.vue` | `three-cards.vue` |

**ALL 20 component files need renaming.**

### 6.2 Module Files (PascalCase)
| Current | Should Be |
|---------|-----------|
| `ImageService.js` | `image-service.ts` |
| `SiteMap.js` | `site-map.ts` |
| `Dato.js` | `dato.ts` |

### 6.3 Page Naming (Dynamic Routes)
| Current (Nuxt 2) | Required (Nuxt 4) |
|-------------------|--------------------|
| `pages/_section/_page.vue` | `pages/[section]/[page].vue` |
| `pages/articles/_id.vue` | `pages/articles/[id].vue` |
| `pages/gallaries/_id.vue` | `pages/gallaries/[id].vue` (also fix typo → `galleries`) |
| `pages/image-objects/_id.vue` | `pages/image-objects/[id].vue` |

### 6.4 Misspellings
- `pages/gallaries/` → should be `pages/galleries/`
- `CACONICAL_BASE_URL` → should be `CANONICAL_BASE_URL`

---

## 7. Architecture Overview

### Current Architecture

```
+----------------------------------------------------------+
|                    Nuxt 2 Application                    |
+----------------------------------------------------------+
|   Static Generation    |     Serverless SSR              |
|   (nuxt generate)      |  (Express + serverless-http)    |
+----------------------------------------------------------+
|                     AMP Module                           |
|          (HTML transformation post-render)                |
+----------------------------------------------------------+
|                    Vue 2 / Options API                    |
|   +----------+  +---------+  +----------+                |
|   |  Pages   |  | Layouts |  |Components|                |
|   | (5 total)|  |(1 total)|  |(20 total)|                |
|   +----+-----+  +----+----+  +----+-----+               |
|        |              |            |                      |
|   +----v--------------v------------v------+              |
|   |           webPageMixin.js              |              |
|   |     (asyncData, head, SEO meta)        |              |
|   +----------------+----------------------+              |
+----------------------------------------------------------+
|        +-----------v------------+                         |
|        |   Vuex Store (3 files) |                         |
|        |  index.js, article.js  |                         |
|        |       menu.js          |                         |
|        +-----------+------------+                         |
+----------------------------------------------------------+
|   Data Layer       |                                      |
|   +----------------v--------------+                       |
|   |    Apollo Client v2           |                       |
|   |    (DatoCMS GraphQL)          |                       |
|   +-------------------------------+                       |
|   +-------------------------------+                       |
|   |    ImageService               |                       |
|   |  (HTTP HEAD for dims)         |                       |
|   +-------------------------------+                       |
+----------------------------------------------------------+
|   Deploy Pipeline                                         |
|   +------------+  +---------------+  +---------------+   |
|   |  Gulp task |  |  AWS S3 push  |  | CloudFront    |   |
|   |  (deploy)  |  |  (awspublish) |  | (invalidate)  |   |
|   +------------+  +---------------+  +---------------+   |
|   +------------------------------------------------------+|
|   |  Serverless Framework (AWS Lambda for on-demand       ||
|   |  regeneration of single routes via DatoCMS hooks)     ||
|   +------------------------------------------------------+|
+----------------------------------------------------------+
```

### Key Data Flow
1. **Build time:** DatoCMS → SiteMap.js → Nuxt generate routes
2. **Runtime (SSG):** Apollo GraphQL → DatoCMS API → asyncData → Page render → AMP transformation
3. **Image dimensions:** HTTP HEAD requests to image CDN to get `x-amz-meta-width/height` headers
4. **AMP processing:** Post-render HTML transformation: remove scripts, add AMP boilerplate, consolidate styles
5. **Deploy:** Nuxt generate → Gulp → S3 upload → CloudFront invalidation
6. **On-demand regen:** DatoCMS webhook → Lambda → Nuxt generate single route → S3 upload

### Key Architectural Concerns for Migration
1. **AMP Module is the biggest risk** — No Nuxt 3/4 equivalent. Must decide: keep AMP? Rebuild module?
2. **Image dimension fetching via HTTP HEAD** — Unusual pattern; consider using DatoCMS image API directly
3. **Apollo Client v2 → v3** — Significant API changes
4. **Vuex → Pinia** — Straightforward but touches many files
5. **webPageMixin.js** is the central nervous system — Most complex migration target
6. **Serverless deploy pipeline** — Nuxt 4 Nitro has built-in AWS Lambda preset, may simplify
7. **Static generation** pattern changes significantly in Nuxt 4

---

## 8. Migration Complexity Estimate

### Overall Complexity: **HIGH** (7/10)

### Breakdown by Area

| Area | Complexity | Effort | Notes |
|------|-----------|--------|-------|
| **AMP Module** | Very High | 40-60h | No Nuxt 4 equivalent. Biggest risk. Must decide architecture. |
| **webPageMixin → composable** | Very High | 16-24h | Central to app, complex data fetching, inline GraphQL |
| **Vuex → Pinia** | Medium | 8-12h | 3 store files, apolloProvider access pattern |
| **Options API → Composition API** | Medium | 16-24h | 20+ components, all need conversion |
| **asyncData → useAsyncData** | Medium | 8-12h | 3 usages, complex in articles page |
| **head() → useHead()** | Low | 4-6h | 3-4 usages, create shared composable |
| **Apollo Client v2 → v3** | Medium | 8-12h | Config + all query patterns |
| **nuxt.config.js rewrite** | Medium | 4-8h | runtimeConfig, Vite, modules |
| **File renaming** | Low | 2-4h | All 20+ files need kebab-case |
| **Dynamic route params** | Low | 1-2h | `_param` → `[param]` |
| **nuxt-link → NuxtLink** | Low | 1-2h | Find/replace |
| **Slot syntax** | Low | 1-2h | `slot="x"` → `#x` |
| **Filters removal** | Low | 1h | 1 filter usage |
| **TypeScript conversion** | Medium | 16-24h | Entire codebase is JS |
| **Deploy pipeline update** | Medium | 8-12h | Nuxt 4 generate, Nitro presets |
| **Test creation** | Medium | 16-24h | Currently zero tests |
| **CSS/SCSS cleanup** | Low | 4-8h | Bootstrap 4→5, deduplicate styles |

### Estimated Total: **150-230 hours** (5-8 weeks for a single developer)

### Risk Factors
1. **AMP module has no migration path** — May require fundamental architecture decision
2. **No tests exist** — No safety net during migration
3. **Image dimension fetching is fragile** — HTTP HEAD to CDN is unreliable pattern
4. **API token exposed in code** (`apollo/config.js`) — Security issue to fix
5. **Dead code and incomplete pages** — Need cleanup decisions
6. **DatoCMS API compatibility** — Must verify DatoCMS client works with new setup

### Recommended Migration Strategy
1. **Phase 0:** Decision on AMP — Keep, rebuild, or abandon?
2. **Phase 1:** Setup Nuxt 4 project skeleton, nuxt.config.ts, runtimeConfig
3. **Phase 2:** Migrate data layer (Apollo → useFetch or @apollo/client v3, Pinia stores)
4. **Phase 3:** Convert webPageMixin to composable
5. **Phase 4:** Migrate components (rename + Composition API + TypeScript)
6. **Phase 5:** Migrate pages (dynamic routes, useAsyncData, useHead)
7. **Phase 6:** Migrate layout (default.vue)
8. **Phase 7:** AMP solution (if keeping)
9. **Phase 8:** Deploy pipeline (Nitro presets, update serverless)
10. **Phase 9:** Testing (Vitest + Playwright)
11. **Phase 10:** CSS cleanup, accessibility audit, performance optimization
