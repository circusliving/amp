import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Smoke Tests', () => {
  test('homepage has no critical or serious axe violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('iframe') // third-party iframes (e.g. analytics) are excluded
      .analyze();

    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (criticalOrSerious.length > 0) {
      console.error('Axe violations:', JSON.stringify(criticalOrSerious, null, 2));
    }

    expect(criticalOrSerious).toHaveLength(0);
  });

  test('article page has no critical or serious axe violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to first article
    const articleLink = page.locator('a[href*="/articles/"]').first();
    const visible = await articleLink.isVisible();
    if (!visible) {
      test.skip();
      return;
    }

    const href = await articleLink.getAttribute('href');
    await page.goto(href!);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('iframe')
      .analyze();

    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (criticalOrSerious.length > 0) {
      console.error('Axe violations on article page:', JSON.stringify(criticalOrSerious, null, 2));
    }

    expect(criticalOrSerious).toHaveLength(0);
  });

  test('header menu toggle is keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab to the menu toggle button and activate with Enter
    await page.keyboard.press('Tab');
    const toggle = page.locator('button[aria-label="Toggle navigation menu"]');

    // Focus it directly and press Enter
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Dismiss with Escape
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('all homepage images have alt attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // alt attribute must exist (can be empty string for decorative images)
      expect(alt, `img[${i}] is missing alt attribute`).not.toBeNull();
    }
  });
});
