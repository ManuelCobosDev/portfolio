import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const widths = [360, 390, 768, 1024, 1280, 1536];
const pages = ['/', '/en/', '/cv/', '/trabajo/microservicio-orquestador/'];

test.describe('responsive layout', () => {
  for (const width of widths) {
    for (const colorScheme of ['light', 'dark'] as const) {
      test(`no horizontal overflow at ${width}px ${colorScheme}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ colorScheme });
        for (const path of pages) {
          await page.goto(path);
          const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
          expect(overflow, `${path} overflows at ${width}px`).toBe(false);
        }
      });
    }
  }

  test('interactive targets are at least 44x44 px at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/');
    await page.locator('details[data-menu] summary').click();
    const tooSmall = await page.evaluate(() => {
      const selector = 'button, summary, nav a, header a[aria-label]';
      return Array.from(document.querySelectorAll<HTMLElement>(selector))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        })
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.height < 43.5 || r.width < 43.5;
        })
        .map(
          (el) =>
            `${el.tagName} ${JSON.stringify(el.textContent?.trim().slice(0, 24))} ${Math.round(
              el.getBoundingClientRect().width,
            )}x${Math.round(el.getBoundingClientRect().height)}`,
        );
    });
    expect(tooSmall).toEqual([]);
  });
});

test.describe('accessibility', () => {
  const scanPages = [
    '/',
    '/en/',
    '/cv/',
    '/en/cv/',
    '/trabajo/microservicio-orquestador/',
    '/en/work/orchestrator-microservice/',
  ];
  for (const path of scanPages) {
    for (const width of [360, 768, 1440]) {
      for (const colorScheme of ['light', 'dark'] as const) {
        test(`axe clean on ${path} @${width} ${colorScheme}`, async ({ page }) => {
          test.setTimeout(90_000);
          await page.setViewportSize({ width, height: 900 });
          await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
          await page.goto(path);
          await page.evaluate(() => document.fonts.ready);
          const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .analyze();
          const violations = results.violations.filter((v) => v.impact !== null);
          const summary = violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
          expect(summary).toEqual([]);
        });
      }
    }
  }
});

test.describe('theme', () => {
  test('dark scheme renders dark; toggle switches and persists', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'dark');

    await page.locator('button[data-theme-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.waitForTimeout(300);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(10, 25, 49)');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('language switch', () => {
  test('home switches between ES and EN', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[hreflang="en"]').first().click();
    await page.waitForURL('**/en/');
    await expect(page.locator('h1')).toContainText('Backend-oriented Full Stack Developer');

    await page.locator('a[hreflang="es"]').first().click();
    await page.waitForURL('**/');
    await expect(page.locator('h1')).toContainText('Desarrollador Full Stack');
  });

  test('case study links to its translation', async ({ page }) => {
    await page.goto('/trabajo/microservicio-orquestador/');
    const enLink = page.locator('a[hreflang="en"]').last();
    await enLink.click();
    await page.waitForURL('**/en/work/orchestrator-microservice/');
    await expect(page.locator('h1')).toContainText('Orchestrator microservice');
  });
});

test.describe('keyboard and reduced motion', () => {
  test('tab order starts at the skip link', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focused).toContain('Saltar al contenido');
  });

  test('no animation runs with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const animated = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('.rise-in, .reveal'));
      return els.filter((el) => {
        const name = getComputedStyle(el).animationName;
        return name && name !== 'none';
      }).length;
    });
    expect(animated).toBe(0);
  });
});

test.describe('copy email', () => {
  test('copies the address and announces success', async ({ browser }) => {
    const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
    const page: Page = await context.newPage();
    await page.goto('/');
    await page.locator('[data-copy-email]').click();
    await expect(page.locator('[data-copy-status]')).toHaveText('Correo copiado');
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe('manuel.cobos.dev@gmail.com');
    await context.close();
  });
});

test.describe('javascript disabled', () => {
  test('home shows all content with JS off', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page: Page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('#sobre-mi')).toBeVisible();
    await expect(page.locator('#experiencia')).toBeVisible();
    await expect(page.locator('#stack')).toBeVisible();
    await expect(page.locator('#contacto')).toBeVisible();
    const details = page.locator('details[data-menu]');
    await expect(details).toHaveCount(1);
    await context.close();
  });
});
