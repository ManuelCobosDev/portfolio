import { test, expect } from '@playwright/test';

const cv = {
  es: {
    route: '/cv/',
    facts: [
      'Manuel Cobos Solís',
      'manuel.cobos.dev@gmail.com',
      'Viewnext',
      'Full Stack Developer',
      'Java Backend Developer',
      'Integration Developer',
      'MuleSoft Certified Developer – Level 1',
      'LPIC-1 Linux Administrator',
      'Inglés B2',
    ],
  },
  en: {
    route: '/en/cv/',
    facts: [
      'Manuel Cobos Solís',
      'manuel.cobos.dev@gmail.com',
      'Viewnext',
      'Full Stack Developer',
      'Java Backend Developer',
      'Integration Developer',
      'MuleSoft Certified Developer – Level 1',
      'LPIC-1 Linux Administrator',
      'English B2',
    ],
  },
} as const;

test.describe('CV print layout', () => {
  for (const [lang, data] of Object.entries(cv)) {
    test(`every text element is fully visible when printing (${lang})`, async ({ page }) => {
      await page.emulateMedia({ media: 'print' });
      await page.goto(data.route);
      await page.evaluate(() => document.fonts.ready);
      const issues = await page.evaluate(() => {
        const found: string[] = [];
        for (const element of Array.from(document.querySelectorAll<HTMLElement>('.cv-doc *'))) {
          const text = element.textContent?.trim() ?? '';
          if (!text) continue;
          const style = getComputedStyle(element);
          const label = text.slice(0, 40);
          if (Number(style.opacity) < 1) found.push(`opacity ${style.opacity}: ${label}`);
          if (style.animationName !== 'none') found.push(`animation ${style.animationName}: ${label}`);
          if (style.color === 'transparent' || style.color === 'rgba(0, 0, 0, 0)') {
            found.push(`transparent colour: ${label}`);
          }
        }
        return [...new Set(found)];
      });
      expect(issues).toEqual([]);
    });

    test(`all key facts reach the printed page (${lang})`, async ({ page }) => {
      await page.emulateMedia({ media: 'print' });
      await page.goto(data.route);
      const text = await page.evaluate(() => document.body.innerText);
      for (const fact of data.facts) {
        expect(text, `${fact} missing from ${data.route}`).toContain(fact);
      }
    });
  }
});
