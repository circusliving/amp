# Phase 06: Testing, Docker & Final Polish

## Purpose

Validate the entire migration with comprehensive testing, verify Docker SSR deployment works, and perform final cleanup for production readiness.

## Shared Context

- All application code is migrated by this point (phases 01–05 complete)
- App should be fully navigable in dev mode (`pnpm dev`)
- All composables, utilities, server routes, stores, and components written in TypeScript
- No Nuxt 2 or AMP code remains
- Testing stack: Vitest 4.0.18 (unit) with `@vitest/coverage-v8` 4.0.18, Playwright 1.58.2 (e2e)
- Docker: Multi-stage build targeting Nitro `node-server` preset

## Key Files

| File | Purpose |
|------|---------|
| `vitest.config.ts` | Vitest configuration |
| `playwright.config.ts` | Playwright configuration |
| `Dockerfile` | Multi-stage Docker build (from p01-04) |
| `docker-compose.yml` | Local Docker dev/testing (from p01-04) |
| `app/composables/*.ts` | Primary unit test targets |
| `server/api/**/*.ts` | Server route test targets |
| `server/utils/*.ts` | Utility function test targets |

## Constraints

- All unit tests use Vitest with `@nuxt/test-utils`
- All e2e tests use Playwright
- Tests must pass before task is marked complete
- Docker build must produce a working container
- No `^` or `~` in any dependency versions
- Accessibility must meet WCAG 2.1 AA
- Use `<NuxtTime>` for date display, Luxon for manipulation
