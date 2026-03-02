import { test, expect } from '@playwright/test';

test.describe('Dynamic Section Pages', () => {
  /**
   * Navigate from the sidebar menu to a section/page link.
   */
  async function navigateToFirstSectionPage(page: import('@playwright/test').Page) {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open side menu
    const toggle = page.locator('button[aria-label="Toggle navigation menu"]');
    await toggle.click();

    const sidebar = page.locator('aside#sidebar');
    await expect(sidebar).toBeVisible();

    // Open the first accordion section to reveal child links
    const firstSummary = sidebar.locator('nav details summary').first();
    await expect(firstSummary).toBeVisible({ timeout: 5_000 });
    await firstSummary.click();

    // Find first child link inside the expanded accordion
    const link = sidebar.locator('nav details[open] a[href]').first();
    await expect(link).toBeVisible({ timeout: 5_000 });
    const href = await link.getAttribute('href');
    if (!href || href.startsWith('/articles/')) {
      test.skip();
      return '';
    }
    await page.goto(href);
    await page.waitForLoadState('networkidle');
    return href;
  }

  test('renders section page structure', async ({ page }) => {
    await navigateToFirstSectionPage(page);

    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('header.header-bar')).toBeVisible();
    await expect(page.locator('footer.footer-bar')).toBeVisible();
  });

  test('has meta title and description', async ({ page }) => {
    await navigateToFirstSectionPage(page);

    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
  });

  test('has canonical link', async ({ page }) => {
    await navigateToFirstSectionPage(page);

    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  });

  test('renders page content', async ({ page }) => {
    const href = await navigateToFirstSectionPage(page);
    if (!href) return;

    // Should have some content in main
    const main = page.locator('main');
    await expect(main).toBeVisible();
    const text = await main.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });
});
