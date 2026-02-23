# Task: Playwright E2E Tests

**ID:** p06-03
**Status:** pending
**Depends on:** p06-02
**Context size:** small
**Branch:** `p06-03-playwright-e2e`
**Target LOC:** ~200 (max 400)

## Goal

Set up Playwright and write end-to-end tests covering critical user journeys: homepage, navigation, article detail, dynamic section pages.

## Pre-flight

1. Verify clean repo: `git status`
2. Create task branch: `git checkout -b p06-03-playwright-e2e`
3. Memory recall: Search Neo4j for `playwright nuxt`, `e2e testing nuxt4`

## Inputs

- Phase context: `phase-06/context.md`
- All page files in `app/pages/`
- All component files in `app/components/`

## Steps

1. Install Playwright:
   ```bash
   pnpm add -D @playwright/test@1.58.2
   npx playwright install chromium
   ```

2. Create `playwright.config.ts`:
   ```typescript
   import { defineConfig } from '@playwright/test';

   export default defineConfig({
     testDir: './tests/e2e',
     timeout: 30_000,
     retries: 1,
     use: {
       baseURL: 'http://localhost:3000',
       screenshot: 'only-on-failure',
       trace: 'on-first-retry',
     },
     webServer: {
       command: 'pnpm dev',
       port: 3000,
       reuseExistingServer: !process.env.CI,
       timeout: 120_000,
     },
     projects: [
       { name: 'chromium', use: { browserName: 'chromium' } },
     ],
   });
   ```

3. Add e2e script to `package.json`:
   ```json
   {
     "scripts": {
       "test:e2e": "playwright test"
     }
   }
   ```

4. Homepage test (`tests/e2e/homepage.spec.ts`):
   - Navigate to `/`
   - Assert page title is set (not default Nuxt)
   - Assert header, footer are rendered
   - Assert navigation menu contains links
   - Assert hero/card section renders
   - Assert Open Graph meta tags present
   - Assert no console errors

5. Navigation test (`tests/e2e/navigation.spec.ts`):
   - Click a navigation link from homepage
   - Verify route change and content load
   - Click mobile menu toggle (if viewport < 768)
   - Verify sidebar opens/closes
   - Verify back navigation works
   - Test breadcrumb or section navigation

6. Article detail test (`tests/e2e/article.spec.ts`):
   - Navigate to an article URL
   - Assert article title renders
   - Assert article body content renders
   - Assert author, date, tags display
   - Assert images have alt text
   - Assert structured data (JSON-LD) in head
   - Assert social sharing meta tags

7. Dynamic section page test (`tests/e2e/section-page.spec.ts`):
   - Navigate to a section/page URL
   - Assert content loads
   - Assert SEO meta tags
   - Assert navigation context

8. 404 test (`tests/e2e/not-found.spec.ts`):
   - Navigate to `/nonexistent-page`
   - Assert error page displays
   - Assert 404 status or error message
   - Assert navigation still works from error page

9. Accessibility smoke test (`tests/e2e/accessibility.spec.ts`):
   - Install `@axe-core/playwright` if not yet: `pnpm add -D @axe-core/playwright@4.11.1`
   - Run axe accessibility scan on homepage
   - Run axe scan on article page
   - Assert no critical or serious violations
   - Log warnings for minor violations

10. Run all e2e tests: `pnpm test:e2e`

## Testing

- [ ] All e2e tests pass against dev server
- [ ] Accessibility smoke test passes with no critical violations
- [ ] Tests are resilient (not flaky)

## Outputs

- `playwright.config.ts`
- `tests/e2e/homepage.spec.ts`
- `tests/e2e/navigation.spec.ts`
- `tests/e2e/article.spec.ts`
- `tests/e2e/section-page.spec.ts`
- `tests/e2e/not-found.spec.ts`
- `tests/e2e/accessibility.spec.ts`

## Done When

- [ ] Playwright configured and running
- [ ] Critical user journeys tested
- [ ] Accessibility baseline established
- [ ] All e2e tests pass

## Commits

Final commit: `p06-03-playwright-e2e`
Mid-task: `p06-03-playwright-config`, `p06-03-e2e-tests`

## Rollback

- Delete tests/e2e/ and playwright.config.ts
- Remove Playwright dependencies

## Handoff

Next: `phase-06/p06-04-scss-a11y-perf.md`
State: All tests (unit + integration + e2e) passing. App verified end-to-end. Next: polish.
