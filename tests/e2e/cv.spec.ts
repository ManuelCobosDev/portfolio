import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const name = 'Manuel-Cobos-Solis-CV.pdf';
const pdfPath = '/cv/Manuel-Cobos-Solis-CV-ae560ece.pdf';

test.describe('CV PDF', () => {
  for (const route of ['/cv/', '/en/cv/']) {
    test(`download button returns the CV PDF on ${route}`, async ({ page }) => {
      await page.goto(route);
      const link = page.locator('a[download="Manuel-Cobos-Solis-CV.pdf"]').first();
      await expect(link).toBeVisible();
      const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
      expect(download.suggestedFilename()).toBe(name);
      const file = await download.path();
      expect(readFileSync(file!).subarray(0, 4).toString('latin1')).toBe('%PDF');
    });

    test(`print button embeds or opens the CV PDF on ${route}`, async ({ page }) => {
      await page.goto(route);
      const framePromise = page
        .waitForSelector(`iframe[src*="${pdfPath}"]`, { state: 'attached', timeout: 5000 })
        .catch(() => null);
      const popupPromise = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
      await page.locator('[data-print-pdf]').click();
      const [frame, popup] = await Promise.all([framePromise, popupPromise]);
      expect(frame !== null || popup !== null).toBe(true);
      if (popup) await popup.close();
    });
  }

  test('footer links to the CV PDF in each language', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer a[download="Manuel-Cobos-Solis-CV.pdf"]')).toHaveCount(1);
    await page.goto('/en/');
    await expect(page.locator('footer a[download="Manuel-Cobos-Solis-CV.pdf"]')).toHaveCount(1);
  });
});
