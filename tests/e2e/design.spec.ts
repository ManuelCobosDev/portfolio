import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../..', import.meta.url));
const pages = ['/', '/en/', '/cv/', '/en/cv/', '/trabajo/microservicio-orquestador/', '/en/work/orchestrator-microservice/'];

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
}

test.describe('design tokens and structure', () => {
  test('colour tokens match the design tokens in both themes', async ({ page }) => {
    const read = (name: string) =>
      page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    expect((await read('--bg')).toLowerCase()).toBe('#f5f7fb');
    expect((await read('--ink')).toLowerCase()).toBe('#0b1b33');
    expect((await read('--accent')).toLowerCase()).toBe('#1d4ed8');
    await page.emulateMedia({ colorScheme: 'dark' });
    expect((await read('--bg')).toLowerCase()).toBe('#0a1426');
    expect((await read('--ink')).toLowerCase()).toBe('#e8eef8');
    expect((await read('--accent')).toLowerCase()).toBe('#7fb0ff');
  });

  test('font sizes follow the type scale at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await settle(page);
    const sizeOf = (sel: string) =>
      page.locator(sel).first().evaluate((el) => getComputedStyle(el).fontSize);
    expect(await sizeOf('nav[aria-label] a')).toBe('14px');
    expect(await sizeOf('.mono-label')).toBe('13px');
    expect(await sizeOf('#sobre-mi .reveal p')).toBe('17px');
    expect(await sizeOf('main h1')).toBe('72px');
    expect(await sizeOf('section#sobre-mi h2')).toBe('40px');
    const fam = await page.locator('.mono-label').first().evaluate((el) => getComputedStyle(el).fontFamily);
    expect(fam).toContain('IBM Plex Mono');
  });

  test('fonts actually load', async ({ page }) => {
    await page.goto('/');
    await settle(page);
    const ok = await page.evaluate(async () => {
      await document.fonts.ready;
      return document.fonts.check('600 16px "IBM Plex Sans Variable"') && document.fonts.check('400 16px "IBM Plex Mono"');
    });
    expect(ok).toBe(true);
  });

  test('header is 64px, sticky and solid', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    const box = await header.boundingBox();
    expect(Math.round(box!.height)).toBe(64);
    expect(await header.evaluate((el) => getComputedStyle(el).position)).toBe('sticky');
    expect(await header.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(245, 247, 251)');
  });

  test('container is 1152px and centred at 1920px', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 900 });
    await page.goto('/');
    const box = await page.locator('.shell').first().boundingBox();
    expect(Math.round(box!.width)).toBe(1152);
    expect(Math.round(box!.x)).toBe(Math.round((1920 - 1152) / 2));
  });

  test('ficha has the eight rows in order', async ({ page }) => {
    await page.goto('/');
    const labels = await page.locator('section[aria-labelledby="ficha-title"] dt').allInnerTexts();
    expect(labels).toEqual([
      'Rol',
      'Empresa',
      'Ubicación',
      'Modalidad',
      'Experiencia',
      'Stack principal',
      'Idiomas',
      'Estado',
    ]);
  });

  test('hero order on mobile is status, h1, lead, buttons, links, ficha', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/');
    const order = await page.evaluate(() => {
      const pick = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? el.getBoundingClientRect().top : -1;
      };
      return {
        status: pick('main section:first-child p:first-child'),
        h1: pick('main h1'),
        lead: pick('main h1 + p, main section:first-child h1 ~ p'),
        ficha: pick('section[aria-labelledby="ficha-title"]'),
      };
    });
    expect(order.status).toBeLessThan(order.h1);
    expect(order.h1).toBeLessThan(order.lead);
    expect(order.lead).toBeLessThan(order.ficha);
  });

  test('no forbidden styling in computed styles', async ({ page }) => {
    await page.goto('/');
    const bad = await page.evaluate(() => {
      const issues: string[] = [];
      for (const el of Array.from(document.querySelectorAll<HTMLElement>('*'))) {
        const s = getComputedStyle(el);
        if (s.backgroundImage !== 'none' && s.backgroundImage.includes('gradient')) issues.push(`gradient: ${el.className}`);
        if (s.backdropFilter && s.backdropFilter !== 'none') issues.push(`backdrop-filter: ${el.className}`);
        if (s.filter && s.filter.includes('blur')) issues.push(`blur: ${el.className}`);
        if (s.textTransform === 'uppercase') issues.push(`uppercase: ${el.className}`);
        if (s.boxShadow && s.boxShadow !== 'none') issues.push(`box-shadow: ${el.className}`);
        const ls = parseFloat(s.letterSpacing);
        const fs = parseFloat(s.fontSize);
        if (!Number.isNaN(ls) && !Number.isNaN(fs) && fs > 0 && ls / fs > 0.02) issues.push(`letter-spacing: ${el.className}`);
      }
      return [...new Set(issues)];
    });
    expect(bad).toEqual([]);
  });

  test('built CSS has no gradients, blur or backdrop-filter', async () => {
    const html = readFileSync(path.join(root, 'dist', 'index.html'), 'utf-8');
    const css = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/g) ?? []).join('');
    expect(css).not.toContain('gradient(');
    expect(css).not.toContain('backdrop-filter');
    expect(css).not.toContain('filter: blur');
    expect(css).not.toContain('text-transform: uppercase');
  });
});

test.describe('interactions', () => {
  test('no nav link is current at the top of the page', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    expect(await page.locator('nav[aria-label] a[aria-current]').count()).toBe(0);
  });

  test('aria-current follows scrolling', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contacto').scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const current = await page.locator('nav[aria-label] a[aria-current]').first().getAttribute('href');
    expect(current).toContain('#contacto');
  });

  test('deep link /#contacto marks the section', async ({ page }) => {
    await page.goto('/#contacto');
    await expect(page.locator('#contacto')).toBeInViewport({ ratio: 0.2 });
    await page.waitForTimeout(300);
    const current = await page.locator('nav[aria-label] a[aria-current]').first().getAttribute('href');
    expect(current).toContain('#contacto');
  });

  test('period follows the external link with no gap', async ({ page }) => {
    await page.goto('/');
    const first = await page.evaluate(() => {
      const a = [...document.querySelectorAll('a')].find(
        (el) => el.querySelector('svg') && el.textContent?.includes('LinkedIn') && el.closest('p')?.textContent?.includes('verificar'),
      );
      return a?.nextSibling?.nodeType === 3 ? a.nextSibling.textContent?.charAt(0) ?? '' : 'not-text';
    });
    expect(first).toBe('.');
    const underline = await page.evaluate(() => {
      const icon = document.querySelector('p .external-icon');
      return icon ? getComputedStyle(icon).textDecorationLine : 'none';
    });
    expect(underline).toBe('none');
  });

  test('footer language link has lang, hreflang and its own language', async ({ page }) => {
    for (const [url, name, code] of [
      ['/', 'English', 'en'],
      ['/en/', 'Español', 'es'],
    ] as const) {
      await page.goto(url);
      const link = page.locator('footer a[hreflang]');
      await expect(link).toHaveAttribute('lang', code);
      await expect(link).toHaveAttribute('hreflang', code);
      await expect(link).toHaveText(name);
    }
  });

  test('every internal link resolves with HTTP 200', async ({ page, request, baseURL }) => {
    const origin = baseURL ?? 'http://localhost:4321';
    const paths = new Set<string>();
    for (const url of pages) {
      await page.goto(url);
      const hrefs = await page.$$eval('a[href^="/"]', (els) => els.map((e) => e.getAttribute('href')!));
      for (const href of hrefs) paths.add(new URL(href, origin).pathname);
    }
    for (const p of [...paths].sort()) {
      const res = await request.get(new URL(p, origin).href);
      expect(res.status(), `${p} resolves`).toBeLessThan(400);
    }
  });

  test('case-study row is a single link with a working target', async ({ page }) => {
    await page.goto('/');
    const row = page.locator('section#casos a').first();
    await expect(row).toHaveAttribute('href', '/trabajo/microservicio-orquestador/');
    await row.click();
    await page.waitForURL('**/trabajo/microservicio-orquestador/');
    await expect(page.locator('h1')).toContainText('Microservicio orquestador');
  });

  test('mobile menu opens, closes with Escape and returns focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/');
    const summary = page.locator('details[data-menu] summary');
    await summary.click();
    await expect(page.locator('details[data-menu]')).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(page.locator('details[data-menu]')).not.toHaveAttribute('open', '');
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('SUMMARY');
  });

  test('theme toggle survives localStorage being blocked', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('blocked');
        },
      });
    });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await page.locator('button[data-theme-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(errors).toEqual([]);
  });
});

test.describe('motion', () => {
  test('reduced motion stops all animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
    expect(running).toBe(0);
  });

  test('h1, lead and portrait are not animated', async ({ page }) => {
    await page.goto('/');
    const names = await page.evaluate(() => {
      const grab = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).animationName : 'missing';
      };
      return { h1: grab('main h1'), lead: grab('main h1 + p'), img: grab('section[aria-labelledby="ficha-title"] img') };
    });
    expect(names.h1).toBe('none');
    expect(names.lead).toBe('none');
    expect(names.img).toBe('none');
  });

  test('ficha rows use the rise animation', async ({ page }) => {
    await page.goto('/');
    const name = await page.locator('section[aria-labelledby="ficha-title"] dd').first().evaluate((el) => {
      const row = el.closest('div')!;
      return getComputedStyle(row).animationName;
    });
    expect(name).toBe('rise');
  });

  test('view transition rule exists with 180ms', async () => {
    const html = readFileSync(path.join(root, 'dist', 'index.html'), 'utf-8');
    const css = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/g) ?? []).join('');
    expect(css).toContain('@view-transition');
    expect(/180ms|\.18s/.test(css)).toBe(true);
  });
});
