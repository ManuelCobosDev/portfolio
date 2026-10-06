import { test, expect } from '@playwright/test';

test.describe('case rows, footer and contact', () => {
  for (const [lang, route, label] of [
    ['es', '/', 'Leer el caso'],
    ['en', '/en/', 'Read the case'],
  ] as const) {
    test(`case row shows the visible ${lang} label as a single link`, async ({ page }) => {
      await page.goto(route);
      const row = page.locator('section#casos a, section#case-studies a').first();
      await expect(row).toContainText(label);
      await expect(row).toContainText('→');
      expect(await row.locator('a').count()).toBe(0);
    });

    test(`footer lists every destination in ${lang}`, async ({ page }) => {
      await page.goto(route);
      const footer = page.locator('footer nav[aria-label]');
      const links = await footer
        .locator('a')
        .evaluateAll((els) =>
          els.map((el) => ({ href: el.getAttribute('href') ?? '', hreflang: el.getAttribute('hreflang') ?? '' })),
        );
      const hrefs = links.map((link) => link.href);
      const home = lang === 'es' ? '/' : '/en/';
      const cv = lang === 'es' ? '/cv/' : '/en/cv/';
      const pdf = lang === 'es' ? '/cv/Manuel-Cobos-Solis-CV-ES.pdf' : '/cv/Manuel-Cobos-Solis-CV-EN.pdf';
      expect(hrefs).toContain(home);
      expect(hrefs).toContain(cv);
      expect(hrefs).toContain(pdf);
      expect(hrefs.some((href) => href.includes('github.com'))).toBe(true);
      expect(hrefs.some((href) => href.includes('linkedin.com'))).toBe(true);
      expect(links.some((link) => link.hreflang === (lang === 'es' ? 'en' : 'es'))).toBe(true);
    });

    test(`copy email gives ${lang} feedback`, async ({ page }) => {
      await page.goto(route);
      const button = page.locator('button[data-copy-email]').first();
      await expect(button).toHaveAttribute('title', lang === 'es' ? 'Copiar correo' : 'Copy email');
      await button.click();
      const status = page.locator('[data-copy-status]').first();
      await expect(status).toHaveAttribute('aria-live', 'polite');
      await expect(status).not.toBeEmpty();
      const text = (await status.innerText()).trim();
      const expected = lang === 'es' ? ['Correo copiado', 'Selecciona y copia'] : ['Email copied', 'Select and copy'];
      expect(expected).toContain(text);
    });
  }

  test('footer links sit on one row and wrap on narrow screens', async ({ page }) => {
    const nav = page.locator('footer nav[aria-label]');
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto('/');
    expect(await nav.evaluate((el) => getComputedStyle(el).flexWrap)).toBe('wrap');
    const wideTops = await nav
      .locator('a')
      .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(wideTops).size).toBe(1);
    await page.setViewportSize({ width: 360, height: 900 });
    const narrowTops = await nav
      .locator('a')
      .evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)));
    expect(new Set(narrowTops).size).toBeGreaterThan(1);
  });
});
