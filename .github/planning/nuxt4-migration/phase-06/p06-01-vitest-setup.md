# Task: Vitest Setup & Composable / Utility Unit Tests

**ID:** p06-01
**Status:** pending
**Depends on:** p05-03
**Context size:** medium
**Branch:** `p06-01-vitest-setup`
**Target LOC:** ~350 (max 400)

## Goal

Configure Vitest with @nuxt/test-utils and write unit tests for all composables and utility functions.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p06-01-vitest-setup`
3. Memory recall: Search Neo4j for `vitest nuxt`, `nuxt test-utils`, `unit testing composable`

## Inputs

- Phase context: `phase-06/context.md`
- `app/composables/use-seo-head.ts` (from p03-01)
- `app/composables/use-web-page.ts` (from p03-02)
- `app/composables/use-image-attrs.ts` (from p03-03)
- `server/utils/image-service.ts` (from p03-03)
- `server/utils/helpers.ts` (from p03-04)
- `app/utils/date-format.ts` (from p03-04)
- `server/utils/dato-client.ts` (from p02-02)
- `server/utils/menu-builder.ts` (from p02-04)
- `server/utils/html-processor.ts` (from p02-03)

## Steps

1. Install & configure Vitest 4:
   ```bash
   pnpm add -D vitest@4.0.18 @vitest/coverage-v8@4.0.18 @nuxt/test-utils@4.0.0 @vue/test-utils@2.4.6 happy-dom@20.7.0
   ```
   **Note:** `@vitest/coverage-v8` version MUST match `vitest` version exactly.
   Create `vitest.config.ts` (Vitest 4 config — note `@nuxt/test-utils` v4.0.0 uses `defineVitestConfig`):
   ```typescript
   import { defineVitestConfig } from '@nuxt/test-utils/config';

   export default defineVitestConfig({
     test: {
       environment: 'nuxt',
       globals: true,
       coverage: {
         provider: 'v8',
         reporter: ['text', 'html'],
         include: ['app/**/*.ts', 'server/**/*.ts'],
         exclude: ['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts'],
       },
     },
   });
   ```

2. Add test scripts to `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest run",
       "test:watch": "vitest",
       "test:coverage": "vitest run --coverage"
     }
   }
   ```

3. Unit tests for `server/utils/helpers.ts`:
   - Create `server/utils/__tests__/helpers.test.ts`
   - Test `getPageSlug()` — various URL patterns
   - Test `needsSpace()` / `truncateText()` — edge cases: empty string, exact length, overflow, HTML entities
   - Test `cdnUrl()` — URL construction with width/height/format params

4. Unit tests for `app/utils/date-format.ts`:
   - Create `app/utils/__tests__/date-format.test.ts`
   - Test `formatDate()` with various ISO strings
   - Test locale handling (en, fr)
   - Test <NuxtTime> expects ISO input (verify our functions return it)

5. Unit tests for `server/utils/image-service.ts`:
   - Create `server/utils/__tests__/image-service.test.ts`
   - Test dimension calculation logic
   - Test CDN URL generation with format options
   - Test fallback behavior for missing dimensions

6. Unit tests for `server/utils/menu-builder.ts`:
   - Create `server/utils/__tests__/menu-builder.test.ts`
   - Test tree construction from flat page list
   - Test section grouping
   - Test empty input handling
   - Test nested hierarchy correctness

7. Unit tests for `server/utils/html-processor.ts`:
   - Create `server/utils/__tests__/html-processor.test.ts`
   - Test lazy-load image injection into body HTML
   - Test handling of already-lazy-loaded images
   - Test empty/null input

8. Unit tests for composables (using @nuxt/test-utils):
   - Create `app/composables/__tests__/use-seo-head.test.ts`
   - Create `app/composables/__tests__/use-web-page.test.ts`
   - Create `app/composables/__tests__/use-image-attrs.test.ts`
   - Test each composable function with mock data
   - Use `mountSuspended` from `@nuxt/test-utils/runtime` for components that need Nuxt context

9. Unit tests for `server/utils/dato-client.ts`:
   - Create `server/utils/__tests__/dato-client.test.ts`
   - Mock `graphql-request` client
   - Test query execution with typed responses
   - Test error handling (API failure, malformed response)

10. Verify all tests pass: `pnpm test`

## Testing

- [ ] All unit tests pass
- [ ] Coverage report generated
- [ ] Composable tests work with Nuxt test environment
- [ ] Server utility tests work in Node environment

## Outputs

- `vitest.config.ts`
- `server/utils/__tests__/helpers.test.ts`
- `server/utils/__tests__/image-service.test.ts`
- `server/utils/__tests__/menu-builder.test.ts`
- `server/utils/__tests__/html-processor.test.ts`
- `server/utils/__tests__/dato-client.test.ts`
- `app/utils/__tests__/date-format.test.ts`
- `app/composables/__tests__/use-seo-head.test.ts`
- `app/composables/__tests__/use-web-page.test.ts`
- `app/composables/__tests__/use-image-attrs.test.ts`

## Done When

- [ ] Vitest configured and running
- [ ] All composables have unit tests
- [ ] All server utilities have unit tests
- [ ] All tests pass
- [ ] Coverage meets minimum threshold (aim for 80%+)

## Commits

Final commit: `p06-01-vitest-setup`
Mid-task: `p06-01-vitest-config`, `p06-01-util-tests`, `p06-01-composable-tests`

## Rollback

- Delete test files and vitest config
- Remove test dependencies from package.json

## Handoff

Next: `phase-06/p06-02-api-route-tests.md`
State: Vitest configured, all util/composable tests passing. Next: server API route integration tests.
