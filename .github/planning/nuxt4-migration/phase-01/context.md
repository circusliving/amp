# Phase 01: Project Skeleton & Configuration

## Purpose

Create the Nuxt 4 project structure from scratch with all configuration files. This phase produces a buildable (but empty) Nuxt 4 app with TypeScript, ESLint, Prettier, Docker support, and proper runtime config.

## Shared Context

- The existing Nuxt 2 codebase lives at the repo root. We are creating a **new** Nuxt 4 project structure alongside it (in `app/` for the srcDir, plus root-level config files).
- The old files will be deleted in the final phase after everything is migrated.
- **pnpm** is the package manager (per project standards). All dependency versions MUST be pinned (no `^` or `~`).
- The old `nuxt.config.js` uses CommonJS (`module.exports`). The new one uses `defineNuxtConfig()` in TypeScript.
- Environment variables currently accessed via `process.env` must move to `runtimeConfig` in `nuxt.config.ts`.
- The Dockerfile is modeled on [scbd/bioland-head](https://github.com/scbd/bioland-head/blob/nuxt4/Dockerfile) which uses multi-stage Docker, pnpm, Node 24, and dumb-init.

## Key Environment Variables (from old nuxt.config.js)

| Old Variable | New runtimeConfig Key | Scope |
|-|-|-|
| `DATO_API_TOKEN` | `runtimeConfig.datoApiToken` | server-only |
| `GA_TAG_ID` | `runtimeConfig.public.gaTagId` | public |
| `CACONICAL_BASE_URL` (typo) | `runtimeConfig.public.canonicalBaseUrl` | public |
| `BASE_URL` | `runtimeConfig.public.baseUrl` | public |

## Key Files

| File | Purpose |
|------|---------|
| `nuxt.config.js` (old) | Reference for env vars, module config, build settings |
| `package.json` (old) | Reference for dependencies to identify Nuxt 4 equivalents |
| `serverless.yml` (old) | Reference for understanding the deploy target (being replaced by Docker) |
| `modules/configs/apollo.js` (old) | Reference for Apollo/DatoCMS connection config |
| `modules/configs/nuxt-i18n.js` (old) | Reference for i18n configuration |

## Constraints

- All dependency versions pinned (no `^` or `~`)
- pnpm only (not yarn or npm)
- Node.js 24 in Docker
- Nuxt 4.3.1, Vue 3.5.28, vue-router 5.0.3
- ESLint 10 flat config with `@nuxt/eslint` (no legacy `.eslintrc` support)
- Prettier for formatting
- TypeScript strict mode
