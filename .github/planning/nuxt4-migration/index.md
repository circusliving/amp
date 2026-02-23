# Nuxt 4 Migration Plan

**Plan Name:** nuxt4-migration  
**Repository:** circusliving/amp  
**Created:** 2026-02-23  
**Status:** DRAFT  

## Summary

Migrate circusliving/amp from Nuxt 2 + Vue 2 + JavaScript + AMP to Nuxt 4 + Vue 3 + TypeScript with Docker SSR. AMP is being dropped entirely (Google no longer prioritizes AMP pages). The project will be completely rewritten with zero code duplication, kebab-case filenames, camelCase identifiers, full TypeScript, and modern Nuxt 4 patterns.

## Current State

- **Framework:** Nuxt 2.11 / Vue 2 / JavaScript (no TypeScript)
- **Build:** Webpack 4 + Babel + AMP module (post-render HTML transformation)
- **State:** Vuex 3 stores (index, article, menu)
- **Data:** Apollo Client v2 → DatoCMS GraphQL API
- **Routing:** File-based with `_param` prefix (Nuxt 2 style)
- **Components:** 20+ Vue 2 Options API components in `components/amp/`
- **Deploy:** Serverless Framework (AWS Lambda) + Gulp S3 deploy
- **Tests:** None
- **CSS:** Bootstrap 4.3.1 SCSS
- **Package Manager:** yarn (migrating to pnpm)
- **Dependencies:** All use `^` caret ranges (violates pinned version requirement)

## Target State

- **Framework:** Nuxt 4.3.1 / Vue 3.5.28 / TypeScript 5.9.3 (strict)
- **Build:** Vite (Nuxt 4 default)
- **State:** Pinia 3.0.4 stores
- **Data:** Nitro server API routes + `useFetch` (DatoCMS GraphQL via `graphql-request` 7.4.0)
- **Routing:** File-based with `[param]` bracket syntax (Nuxt 4 style), vue-router 5.0.3
- **Components:** Vue 3 Composition API `<script setup lang="ts">`, auto-imported
- **Deploy:** Docker SSR (multi-stage Dockerfile), Nitro server
- **Tests:** Vitest 4.0.18 (unit) + Playwright 1.58.2 (e2e)
- **CSS:** Bootstrap 5.3.8 SCSS, scoped styles, no duplication
- **Lint:** ESLint 10.0.1 (flat config only) + Prettier 3.8.1
- **Directory:** Nuxt 4 `app/` structure

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Drop AMP entirely | Google no longer prioritizes AMP in search results |
| Docker SSR (not prerender) | User requirement; models scbd/bioland-head Dockerfile |
| Replace Apollo with useFetch + server API | Simpler, Nuxt-native; per project instructions |
| Pinia over Vuex | Nuxt 4 standard; composable-native |
| Bootstrap 5 (not Tailwind) | Minimal migration risk from Bootstrap 4 |
| pnpm (not yarn/npm) | Per project standards |
| No serverless deployment | Replaced by Docker; sls/ directory removed |
| `@nuxt/image` for images | Replaces AMP image handling + manual dimension fetching |

## Target Directory Structure

```
amp/
├── nuxt.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── Dockerfile
├── .dockerignore
├── eslint.config.mjs
├── .prettierrc
├── app/
│   ├── app.vue
│   ├── error.vue
│   ├── assets/
│   │   └── scss/
│   │       ├── main.scss
│   │       └── _variables.scss
│   ├── components/
│   │   ├── card.vue
│   │   ├── card-cl.vue
│   │   ├── card-img-middle.vue
│   │   ├── card-list.vue
│   │   ├── cl-icons.vue
│   │   ├── footer-bar.vue
│   │   ├── header-bar.vue
│   │   ├── hero-title.vue
│   │   ├── icon.vue
│   │   ├── image-list.vue
│   │   ├── page-body.vue
│   │   ├── popular-posts.vue
│   │   ├── quote-block.vue
│   │   ├── quotes-carousel.vue
│   │   ├── section-header-h2.vue
│   │   ├── section-header-h3.vue
│   │   ├── side-bar.vue
│   │   ├── side-menu.vue
│   │   ├── social-bar.vue
│   │   └── three-cards.vue
│   ├── composables/
│   │   ├── use-seo-head.ts
│   │   ├── use-web-page.ts
│   │   └── use-image-attrs.ts
│   ├── layouts/
│   │   └── default.vue
│   ├── middleware/
│   ├── pages/
│   │   ├── index.vue
│   │   ├── [section]/
│   │   │   └── [page].vue
│   │   ├── articles/
│   │   │   └── [id].vue
│   │   ├── galleries/
│   │   │   └── [id].vue
│   │   └── image-objects/
│   │       └── [id].vue
│   ├── plugins/
│   │   └── analytics.client.ts
│   └── utils/
│       ├── image-service.ts
│       └── helpers.ts
├── server/
│   ├── api/
│   │   ├── articles/
│   │   │   ├── index.get.ts
│   │   │   ├── [id].get.ts
│   │   │   └── latest.get.ts
│   │   ├── web-pages/
│   │   │   ├── [path].get.ts
│   │   │   └── index.get.ts
│   │   ├── image-objects/
│   │   │   └── [id].get.ts
│   │   └── menu.get.ts
│   └── utils/
│       ├── dato-client.ts
│       └── graphql-queries.ts
├── shared/
│   └── types/
│       ├── article.ts
│       ├── web-page.ts
│       ├── image-object.ts
│       └── menu.ts
├── public/
│   ├── browserconfig.xml
│   └── favicon.ico
├── locales/
│   ├── en.ts
│   └── fr.ts
└── modules/
```

## Estimated Effort

| Phase | Description | Estimated Hours |
|-------|-------------|-----------------|
| Phase 01 | Project Skeleton & Config | 8-12 |
| Phase 02 | Data Layer (Server API + Types) | 12-16 |
| Phase 03 | Composables & Utils | 8-12 |
| Phase 04 | Layout & Core Components | 12-16 |
| Phase 05 | Pages & Routing | 12-18 |
| Phase 06 | Testing, Docker & Polish | 16-24 |
| **Total** | | **68-98 hours** |
