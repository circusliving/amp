# Roadmap

## Phase 01: Project Skeleton & Configuration

**Context:** [phase-01/context.md](phase-01/context.md)

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p01-01 | [Initialize Nuxt 4 project & package.json](phase-01/p01-01-init-nuxt4-project.md) | ✅ complete | none |
| p01-02 | [nuxt.config.ts & runtime config](phase-01/p01-02-nuxt-config.md) | ✅ complete | p01-01 |
| p01-03 | [TypeScript, ESLint & Prettier config](phase-01/p01-03-ts-eslint-prettier.md) | ✅ complete | p01-01 |
| p01-04 | [Dockerfile & .dockerignore](phase-01/p01-04-dockerfile.md) | ✅ complete | p01-01 |

## Phase 02: Data Layer (Server API + Stores + Types)

**Context:** [phase-02/context.md](phase-02/context.md)
**Requires:** Phase 01 complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p02-01 | [Shared types & GraphQL queries](phase-02/p02-01-types-and-queries.md) | ⬜ pending | p01-02 |
| p02-02 | [DatoCMS client & server utils](phase-02/p02-02-dato-client.md) | ⬜ pending | p02-01 |
| p02-03 | [Server API routes: articles & web-pages](phase-02/p02-03-api-articles-webpages.md) | ⬜ pending | p02-02 |
| p02-04 | [Server API routes: menus, images, misc](phase-02/p02-04-api-menus-images.md) | ⬜ pending | p02-02 |
| p02-05 | [Pinia stores](phase-02/p02-05-pinia-stores.md) | ⬜ pending | p02-03 |

## Phase 03: Composables & Utilities

**Context:** [phase-03/context.md](phase-03/context.md)
**Requires:** Phase 02 complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p03-01 | [useSeoHead composable](phase-03/p03-01-use-seo-head.md) | ⬜ pending | p02-01 |
| p03-02 | [useWebPage composable](phase-03/p03-02-use-web-page.md) | ⬜ pending | p02-03, p03-01 |
| p03-03 | [useImageAttrs composable & image-service util](phase-03/p03-03-use-image-attrs.md) | ⬜ pending | p02-01 |
| p03-04 | [Helpers util & locale files](phase-03/p03-04-helpers-and-locales.md) | ⬜ pending | p01-02 |

## Phase 04: Layout & Core Components

**Context:** [phase-04/context.md](phase-04/context.md)
**Requires:** Phase 03 complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p04-01 | [app.vue, error.vue & default layout](phase-04/p04-01-layout.md) | ⬜ pending | p03-01 |
| p04-02 | [Header, footer & sidebar components](phase-04/p04-02-header-footer-sidebar.md) | ⬜ pending | p04-01 |
| p04-03 | [Card components (card, card-cl, card-img-middle, card-list, three-cards)](phase-04/p04-03-card-components.md) | ⬜ pending | p03-03 |
| p04-04 | [Content components (hero-title, page-body, quotes, section-headers)](phase-04/p04-04-content-components.md) | ⬜ pending | p03-03 |
| p04-05 | [Utility components (icon, cl-icons, social-bar, popular-posts, image-list)](phase-04/p04-05-utility-components.md) | ⬜ pending | p03-03, p04-03 |

## Phase 05: Pages & Routing

**Context:** [phase-05/context.md](phase-05/context.md)
**Requires:** Phase 04 complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p05-01 | [Index page](phase-05/p05-01-index-page.md) | ⬜ pending | p04-03, p04-04 |
| p05-02 | [Article detail page](phase-05/p05-02-article-page.md) | ⬜ pending | p04-04, p03-02 |
| p05-03 | [Section/page & gallery/image-object pages](phase-05/p05-03-remaining-pages.md) | ⬜ pending | p03-02 |

## Phase 06: Testing, Docker & Polish

**Context:** [phase-06/context.md](phase-06/context.md)
**Requires:** Phase 05 complete

| ID | Task | Status | Depends On |
|----|------|--------|------------|
| p06-01 | [Vitest setup & unit tests for composables/utils](phase-06/p06-01-vitest-setup.md) | ⬜ pending | p05-03 |
| p06-02 | [Server API route integration tests](phase-06/p06-02-api-route-tests.md) | ⬜ pending | p06-01 |
| p06-03 | [Playwright setup & e2e tests](phase-06/p06-03-playwright-e2e.md) | ⬜ pending | p06-02 |
| p06-04 | [SCSS cleanup, accessibility & performance](phase-06/p06-04-scss-a11y-perf.md) | ⬜ pending | p06-03 |
| p06-05 | [Docker build verification & cleanup](phase-06/p06-05-docker-verify.md) | ⬜ pending | p06-04 |

## Status Legend

- ⬜ pending
- 🔄 in-progress
- ✅ complete
- ❌ blocked
- ⏸️ paused
