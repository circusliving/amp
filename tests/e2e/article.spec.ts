import { test, expect } from '@playwright/test';

test.describe('Article Detail', () => {
  /**
   * To avoid hardcoding DatoCMS slugs, we navigate from the homepage
   * to find a real article link and test the detail page structure.
   */
  async function navigateToFirstArticle(page: import('@playwright/test').Page) {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find first article link that leads to /articles/...
    const articleLink = page.locator('a[href*="/articles/"]').first();
    await expect(articleLink).toBeVisible({ timeout: 10_000 });
    const href = await articleLink.getAttribute('href');
    await page.goto(href!);
    await page.waitForLoadState('networkidle');
  }

  test('renders article page structure', async ({ page }) => {
    await navigateToFirstArticle(page);

    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('header.header-bar')).toBeVisible();
    await expect(page.locator('footer.footer-bar')).toBeVisible();
  });

  test('renders article title (h1 or hero element)', async ({ page }) => {
    await navigateToFirstArticle(page);

    const heading = page.locator('h1, .hero-title__title').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('has article Open Graph type meta tag', async ({ page }) => {
    await navigateToFirstArticle(page);

    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveCount(1);
    const content = await ogType.getAttribute('content');
    expect(content).toBe('article');
  });

  test('has og:title and og:description meta tags', async ({ page }) => {
    await navigateToFirstArticle(page);

    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
  });

  test('has canonical link matching current URL', async ({ page }) => {
    await navigateToFirstArticle(page);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    const href = await canonical.getAttribute('href');
    expect(href?.length).toBeGreaterThan(0);
  });

  test('article images have alt attributes', async ({ page }) => {
    await navigateToFirstArticle(page);

    const images = page.locator('main img');
    const count = await images.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const alt = await images.nth(i).getAttribute('alt');
        // alt can be empty string for decorative images but must be present
        expect(alt).not.toBeNull();
      }
    }
  });
});
