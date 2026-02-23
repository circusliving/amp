# Drafting Context: nuxt4-migration

## Goal
Plan the complete migration of circusliving/amp from Nuxt 2 + Vue 2 + AMP to Nuxt 4 + Vue 3 + TypeScript with Docker SSR.

## Key Decisions
- **No AMP** — Google no longer prioritizes AMP pages
- **SSR via Docker** — not prerender/SSG. Dockerfile modeled on scbd/bioland-head
- **pnpm** — per project standards
- **Full TypeScript** — including all .vue files
- **Kebab-case filenames** — camelCase for everything else
- **No branch pushes/commits** — planning only
- **Refactor aggressively** — no code duplication
- **useFetch** — replace all Apollo Client usage with Nitro server API routes + useFetch
- **Pinia** — replace Vuex stores
- **Bootstrap 5** — upgrade from Bootstrap 4

## Files Already Scanned
- All 20+ component files (components/amp/*)
- All 5 page files
- All 3 store files (Vuex)
- All module files (webPageMixin, helpers, ImageService, configs/*)
- All Apollo query files
- nuxt.config.js, package.json, serverless.yml
- layouts/default.vue
- Reference Dockerfile from scbd/bioland-head

## Research Completed
- temp/research/codebase-analysis.md — Full dependency/file/pattern analysis
- AMP element inventory and standard HTML replacements
