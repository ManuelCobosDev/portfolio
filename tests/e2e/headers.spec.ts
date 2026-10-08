import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../..', import.meta.url));

const csp = (() => {
  const raw = readFileSync(path.join(root, 'public', '_headers'), 'utf-8');
  const match = raw.match(/Content-Security-Policy:\s*(.+)/);
  if (!match) throw new Error('Content-Security-Policy is missing from public/_headers');
  return match[1].trim();
})();

const pages = [
  '/',
  '/en/',
  '/cv/',
  '/en/cv/',
  '/trabajo/microservicio-orquestador/',
  '/en/work/orchestrator-microservice/',
];

async function applyCsp(page: Page): Promise<string[]> {
  const violations: string[] = [];
  page.on('console', (message) => {
    if (/content security policy/i.test(message.text())) violations.push(message.text());
  });
  page.on('pageerror', (error) => violations.push(error.message));
  await page.route('**/*', async (route) => {
    if (route.request().resourceType() !== 'document') {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    await route.fulfill({
      status: response.status(),
      headers: { ...response.headers(), 'content-security-policy': csp },
      body: await response.body(),
    });
  });
  return violations;
}

test.describe('content security policy', () => {
  for (const url of pages) {
    test(`no console violation on ${url}`, async ({ page }) => {
      const violations = await applyCsp(page);
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      expect(violations).toEqual([]);
    });
  }

  test('theme toggle and copy email still work', async ({ page }) => {
    const violations = await applyCsp(page);
    await page.goto('/');
    await page.locator('button[data-theme-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.locator('button[data-copy-email]').first().click();
    await expect(page.locator('[data-copy-status]').first()).toContainText(/Correo copiado|Selecciona y copia/);
    expect(violations).toEqual([]);
  });

  test('mobile menu still opens', async ({ page }) => {
    const violations = await applyCsp(page);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/');
    await page.locator('details[data-menu] summary').click();
    await expect(page.locator('details[data-menu]')).toHaveAttribute('open', '');
    expect(violations).toEqual([]);
  });

  test('CV download still works', async ({ page }) => {
    const violations = await applyCsp(page);
    await page.goto('/cv/');
    const link = page.locator('a[download]').first();
    const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
    expect(download.suggestedFilename()).toBe('Manuel-Cobos-Solis-CV.pdf');
    expect(violations).toEqual([]);
  });
});
