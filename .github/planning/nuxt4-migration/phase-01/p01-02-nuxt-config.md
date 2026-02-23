# Task: nuxt.config.ts & Runtime Config

**ID:** p01-02
**Status:** pending
**Depends on:** p01-01
**Context size:** medium
**Branch:** `p01-02-nuxt-config`
**Target LOC:** ~120 (max 400)

## Goal

Create `nuxt.config.ts` with all required modules, runtime config, and build settings for Nuxt 4.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p01-02-nuxt-config`
3. Memory recall: Search Neo4j for `nuxt config`, `runtime config`, `nuxt modules`

## Inputs

- Phase context: `phase-01/context.md`
- Old `nuxt.config.js` — reference for env vars, modules, CSS config
- Old `modules/configs/nuxt-i18n.js` — reference for i18n config
- Old `assets/main.scss` — reference for global SCSS imports

## Steps

1. Create `nuxt.config.ts` with `defineNuxtConfig()`:

   ```typescript
   export default defineNuxtConfig({
     compatibilityDate: '2026-02-23',

     // Nuxt 4 app/ directory is default srcDir
     modules: [
       '@pinia/nuxt',
       '@nuxt/image',
       '@nuxtjs/i18n',
       '@nuxt/eslint',
     ],

     runtimeConfig: {
       datoApiToken: '', // NUXT_DATO_API_TOKEN
       public: {
         baseUrl: '', // NUXT_PUBLIC_BASE_URL
         canonicalBaseUrl: '', // NUXT_PUBLIC_CANONICAL_BASE_URL
         gaTagId: '', // NUXT_PUBLIC_GA_TAG_ID
       },
     },

     css: ['~/assets/scss/main.scss'],

     // SSR mode (Docker, not prerender)
     ssr: true,
     nitro: {
       preset: 'node-server',
     },

     image: {
       // DatoCMS image CDN config
       domains: ['www.datocms-assets.com'],
     },

     i18n: {
       locales: [
         { code: 'en', file: 'en.ts' },
         { code: 'fr', file: 'fr.ts' },
       ],
       defaultLocale: 'en',
       lazy: true,
       langDir: '../locales/',
     },

     typescript: {
       strict: true,
     },

     vite: {
       css: {
         preprocessorOptions: {
           scss: {
             // Bootstrap 5 variable overrides, if any
           },
         },
       },
     },
   })
   ```

2. Create `app/assets/scss/main.scss`:
   - Import Bootstrap 5 SCSS (replacing Bootstrap 4):
     ```scss
     // Bootstrap 5 variable overrides
     @import 'variables';
     // Bootstrap 5 core
     @import 'bootstrap/scss/bootstrap';
     // App-specific styles
     ```
   - Migrate any non-AMP global styles from old `assets/main.css`
   - Remove all AMP-specific styles and commented-out code

3. Create `app/assets/scss/_variables.scss`:
   - Bootstrap 5 theme variable overrides (colors, fonts, etc.)
   - Extract from old `assets/main.css` custom properties

4. Create `.env.example` documenting all required environment variables:
   ```
   NUXT_DATO_API_TOKEN=
   NUXT_PUBLIC_BASE_URL=https://www.circusliving.com
   NUXT_PUBLIC_CANONICAL_BASE_URL=https://www.circusliving.com
   NUXT_PUBLIC_GA_TAG_ID=
   ```

## Testing

- [ ] `pnpm dev` starts with no config errors
- [ ] `useRuntimeConfig()` returns expected shape in a test page
- [ ] SCSS compiles without errors
- [ ] i18n module loads without errors

## Outputs

- `nuxt.config.ts`
- `app/assets/scss/main.scss`
- `app/assets/scss/_variables.scss`
- `.env.example`

## Done When

- [ ] All runtime config keys match old env vars
- [ ] No `process.env` usage in client code
- [ ] Bootstrap 5 SCSS compiles
- [ ] Dev server starts clean

## Commits

Final commit: `p01-02-nuxt-config`

## Rollback

- Revert to p01-01 branch state

## Handoff

Next: `phase-01/p01-03-ts-eslint-prettier.md`
State: nuxt.config.ts complete with all modules, runtimeConfig, and SCSS. Dev server boots.
