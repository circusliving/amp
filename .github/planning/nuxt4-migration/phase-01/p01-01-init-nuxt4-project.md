# Task: Initialize Nuxt 4 Project & package.json

**ID:** p01-01
**Status:** pending
**Depends on:** none
**Context size:** medium
**Branch:** `p01-01-init-nuxt4-project`
**Target LOC:** ~100 (max 400)

## Goal

Create a fresh Nuxt 4 project structure with `package.json` containing all pinned dependencies.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p01-01-init-nuxt4-project`
3. Memory recall: Search Neo4j for `nuxt4 migration`, `project init`, `pnpm setup`

## Inputs

- Phase context: `phase-01/context.md`
- Old `package.json` for dependency reference
- Old `nuxt.config.js` for module list reference

## Steps

1. Create `app/` directory (Nuxt 4 `srcDir`)
2. Create the Nuxt 4 directory structure:
   ```
   app/
   ├── assets/scss/
   ├── components/
   ├── composables/
   ├── layouts/
   ├── middleware/
   ├── pages/
   ├── plugins/
   └── utils/
   server/
   ├── api/
   └── utils/
   shared/
   └── types/
   public/
   locales/
   modules/
   ```
3. Create `package.json` with pinned dependencies (no `^` or `~`):

   **Dependencies:**
   - `nuxt` `4.3.1`
   - `vue` `3.5.28`
   - `vue-router` `5.0.3`
   - `pinia` `3.0.4`
   - `@pinia/nuxt` `0.11.3`
   - `@nuxt/image` `2.0.0`
   - `@nuxtjs/i18n` `10.2.3`
   - `bootstrap` `5.3.8`
   - `@popperjs/core` `2.11.8` (Bootstrap 5 peer dep)
   - `luxon` `3.7.2` (date manipulation per project standards)
   - `graphql` `16.12.0`
   - `graphql-request` `7.4.0` (ESM-only since v6; lightweight GraphQL client for server-side)
   - `vue-multiselect` `3.4.0` (Vue 3 compatible; per project standards for select inputs)
   - `string-strip-html` `13.5.3` (used in article meta description generation — carried forward from old project)
   - `pluralize` `8.0.0` (used in web page collection query building — carried forward from old project)

   **Dev Dependencies:**
   - `typescript` `5.9.3`
   - `vue-tsc` `3.2.5`
   - `@nuxt/eslint` `1.15.1`
   - `eslint` `10.0.1` (ESLint 10 — flat config only, no legacy `.eslintrc`)
   - `prettier` `3.8.1`
   - `eslint-config-prettier` `10.1.8`
   - `sass` `1.97.3` (Dart Sass; `node-sass` / `sass-loader` no longer needed with Vite)
   - `vitest` `4.0.18` (Vitest 4 — note breaking changes from v1/v2)
   - `@vitest/coverage-v8` `4.0.18` (must match vitest version)
   - `@nuxt/test-utils` `4.0.0`
   - `@vue/test-utils` `2.4.6`
   - `@playwright/test` `1.58.2`
   - `@axe-core/playwright` `4.11.1` (accessibility testing)
   - `happy-dom` `20.7.0` (DOM implementation for Vitest)
   - `@types/luxon` `3.7.1`

   **Removed (not carried forward):**
   - `@nuxtjs/apollo`, `apollo-client`, `apollo-cache-inmemory`, `apollo-link`, `vue-apollo`, `graphql-tag` — replaced by `graphql-request`
   - `@nuxtjs/axios` — replaced by `useFetch` / `$fetch`
   - `@nuxtjs/pwa` — no PWA requirement this iteration
   - `amp-module` — AMP dropped entirely
   - `nuxt-purgecss` — Vite tree-shakes CSS; not needed
   - `datocms-client` — replaced by `graphql-request` direct queries
   - `dotenv`, `dotenv-expand` — Nuxt 4 runtimeConfig handles env vars
   - `express`, `serverless-http` — replaced by Nitro server
   - `gulp`, `gulp-awspublish`, `gulp-cloudfront-invalidate-aws-publish`, `gulp-rename` — deploy tooling replaced by Docker
   - `concurrent-transform`, `through2`, `fs-extra`, `fs-nextra` — deploy/build tooling no longer needed
   - `consola` — Nuxt 4 has built-in logging
   - `lodash.clone` — use `structuredClone()` or spread operator
   - `add` — accidental install
   - `yarn` — should never have been a dependency
   - `@babel/runtime-corejs2`, `core-js`, `babel-eslint` — Vite replaces Babel
   - `webpack`, `sass-loader`, `eslint-loader` — Vite replaces Webpack
   - `@cypress/webpack-preprocessor` — replaced by Playwright
   - All old eslint plugins (`eslint-config-standard`, `eslint-plugin-html`, `eslint-plugin-nuxt`, `eslint-plugin-promise`, `eslint-plugin-standard`, `@nuxtjs/eslint-config`, `@nuxtjs/eslint-module`) — replaced by `@nuxt/eslint` flat config

4. Create `pnpm-workspace.yaml` if needed (likely not for this project)
5. Add pnpm scripts:
   ```json
   {
     "scripts": {
       "dev": "nuxt dev",
       "build": "nuxt build",
       "preview": "nuxt preview",
       "generate": "nuxt generate",
       "postinstall": "nuxt prepare",
       "lint": "eslint .",
       "lint:fix": "eslint . --fix",
       "format": "prettier --write .",
       "typecheck": "nuxt prepare && vue-tsc -b --noEmit",
       "test": "vitest run",
       "test:watch": "vitest",
       "test:e2e": "playwright test"
     }
   }
   ```
6. Create minimal `app/app.vue`:
   ```vue
   <template>
     <NuxtLayout>
       <NuxtPage />
     </NuxtLayout>
   </template>
   ```
7. Delete old files that are completely replaced:
   - `vue.config.js` (not used in Nuxt 4)
   - `serverless.yml` (replaced by Docker)
   - `sls/` directory (replaced by Docker/Nitro)
   - `gulpfile.js` (deploy tooling, replaced by Docker)
   - `modules/configs/amp.js` (AMP removed)
8. Move `static/` contents to `public/` (Nuxt 4 naming)
9. Run `pnpm install`

## Testing

- [ ] `pnpm install` succeeds without errors
- [ ] `pnpm dev` starts without crashes (shows empty page)
- [ ] No `^` or `~` in any dependency version

## Outputs

- `package.json` with all pinned dependencies
- Nuxt 4 directory structure
- Minimal `app/app.vue`
- Old incompatible files removed

## Done When

- [ ] `pnpm dev` boots successfully
- [ ] Directory structure matches Nuxt 4 conventions
- [ ] All dependency versions are pinned
- [ ] No old Nuxt 2 / AMP files remain in root

## Commits

Final commit: `p01-01-init-nuxt4-project`
Body must list all files created/changed and why.

## Rollback

- `git checkout master` — all changes on feature branch

## Handoff

Next: `phase-01/p01-02-nuxt-config.md`
State: Fresh Nuxt 4 project structure exists. `pnpm install` completed. `app/app.vue` is minimal placeholder.
