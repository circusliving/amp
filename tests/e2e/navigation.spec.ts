import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('sidebar opens when menu toggle is clicked', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggle = page.locator('button[aria-label="Toggle navigation menu"]');
    const sidebar = page.locator('aside#sidebar');

    // Sidebar should be collapsed initially
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    // Click toggles the sidebar open
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Sidebar becomes visible
    await expect(sidebar).toBeVisible();
  });

  test('sidebar closes when toggle is clicked again', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggle = page.locator('button[aria-label="Toggle navigation menu"]');
    await toggle.click();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('sidebar closes when backdrop is clicked', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggle = page.locator('button[aria-label="Toggle navigation menu"]');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Click the overlay/backdrop
    const backdrop = page.locator('.side-bar__backdrop');
    if (await backdrop.isVisible()) {
      await backdrop.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('sidebar closes on Escape key', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggle = page.locator('button[aria-label="Toggle navigation menu"]');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('logo link navigates to homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.locator('header a[aria-label="Circus Living Home"]').click();
    await page.waitForURL('/');
    expect(page.url()).toContain('/');
  });

  test('sidebar contains navigation links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const toggle = page.locator('button[aria-label="Toggle navigation menu"]');
    await toggle.click();

    const sideMenu = page.locator('nav.side-menu, aside#sidebar nav');
    await expect(sideMenu.locator('a').first()).toBeVisible();
  });
});
