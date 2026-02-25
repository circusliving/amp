import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('renders page title', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('renders header', async ({ page }) => {
    await expect(page.locator('header.header-bar')).toBeVisible();
    await expect(page.locator('header.header-bar a[aria-label="Circus Living Home"]')).toBeVisible();
  });

  test('renders footer with copyright', async ({ page }) => {
    const footer = page.locator('footer.footer-bar');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Circus Living');
    await expect(footer).toContainText(String(new Date().getFullYear()));
  });

  test('renders main content area', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
  });

  test('has Open Graph meta tags', async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:type"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(1);
  });

  test('has description meta tag', async ({ page }) => {
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveCount(1);
    const content = await description.getAttribute('content');
    expect(content?.length).toBeGreaterThan(0);
  });

  test('has canonical link', async ({ page }) => {
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  });

  test('has no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('menu toggle button is accessible', async ({ page }) => {
    const toggle = page.locator('button[aria-label="Toggle navigation menu"]');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-controls', 'sidebar');
  });
});
