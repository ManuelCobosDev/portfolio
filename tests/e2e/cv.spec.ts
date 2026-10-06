import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const names = {
  es: 'Manuel-Cobos-Solis-CV-ES.pdf',
  en: 'Manuel-Cobos-Solis-CV-EN.pdf',
} as const;

test.describe('CV PDF', () => {
  for (const [lang, route] of [
    ['es', '/cv/'],
    ['en', '/en/cv/'],
  ] as const) {
    test(`download button returns the ${lang} PDF`, async ({ page }) => {
      await page.goto(route);
      const link = page.locator(`a[download][href$="${names[lang]}"]`).first();
      await expect(link).toBeVisible();
      const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
      expect(download.suggestedFilename()).toBe(names[lang]);
      const file = await download.path();
      expect(readFileSync(file!).subarray(0, 4).toString('latin1')).toBe('%PDF');
    });

    test(`print button embeds or opens the ${lang} PDF`, async ({ page }) => {
      await page.goto(route);
      const framePromise = page
        .waitForSelector(`iframe[src$="${names[lang]}"]`, { state: 'attached', timeout: 5000 })
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
    await expect(page.locator(`footer a[download][href$="${names.es}"]`)).toHaveCount(1);
    await page.goto('/en/');
    await expect(page.locator(`footer a[download][href$="${names.en}"]`)).toHaveCount(1);
  });
});
