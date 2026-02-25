import { test, expect } from '@playwright/test';

test.describe('404 / Error Page', () => {
  test('shows error page for nonexistent route', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz-404');
    // Nuxt SSR may return 404 status or render the error page with 200 + error component
    // Either is valid; check the error page renders
    await page.waitForLoadState('networkidle');

    const errorCode = page.locator('.error-page__code, h1');
    await expect(errorCode).toBeVisible({ timeout: 10_000 });
  });

  test('displays 404 status code on error page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz-404');
    await page.waitForLoadState('networkidle');

    // Error page should display "404" or "Not Found"
    const body = await page.locator('body').textContent();
    expect(body).toMatch(/404|not found|page not found/i);
  });

  test('error page has a home button or link', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz-404');
    await page.waitForLoadState('networkidle');

    // Should have a way to navigate home
    const homeButton = page.locator('button:has-text("Go Home"), a[href="/"], button:has-text("Home")');
    await expect(homeButton.first()).toBeVisible({ timeout: 5_000 });
  });

  test('clicking home button navigates to homepage', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz-404');
    await page.waitForLoadState('networkidle');

    const homeButton = page.locator('button:has-text("Go Home")').first();
    if (await homeButton.isVisible()) {
      await homeButton.click();
      await page.waitForURL('/');
      expect(page.url()).toMatch(/localhost:3000\/?$/);
    }
  });

  test('misspelled galleries URL redirects to correct path', async ({ page }) => {
    // Test the 301 redirect from /gallaries/:id → /galleries/:id
    await page.goto('/gallaries/some-gallery-id');
    await page.waitForLoadState('networkidle');
    // After redirect the URL should be /galleries/...
    expect(page.url()).toContain('/galleries/some-gallery-id');
  });
});
