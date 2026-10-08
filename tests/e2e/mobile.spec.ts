import { test, expect } from '@playwright/test';

const pages = [
  '/',
  '/en/',
  '/cv/',
  '/en/cv/',
  '/trabajo/microservicio-orquestador/',
  '/en/work/orchestrator-microservice/',
];
const widths = [360, 390, 768];

test.describe('mobile pass', () => {
  for (const width of widths) {
    test(`no overflow, tappable targets and legible text at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of pages) {
        await page.goto(path);
        const result = await page.evaluate(() => {
          const doc = document.documentElement;
          const targetSelector = 'button, summary, nav a, footer a, main a[download]';
          const small = Array.from(document.querySelectorAll<HTMLElement>(targetSelector))
            .filter((el) => {
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0 && el.offsetParent !== null;
            })
            .filter((el) => {
              const rect = el.getBoundingClientRect();
              return rect.height < 43.5 || rect.width < 43.5;
            })
            .map(
              (el) =>
                `${el.tagName} "${el.textContent?.trim().slice(0, 18)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`,
            );
          const tiny = Array.from(document.querySelectorAll<HTMLElement>('body *'))
            .filter((el) => !el.closest('[data-lockup]'))
            .filter((el) => {
              const hasText = Array.from(el.childNodes).some(
                (node) => node.nodeType === 3 && Boolean(node.textContent?.trim()),
              );
              if (!hasText) return false;
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0 && el.offsetParent !== null;
            })
            .map((el) => ({
              el,
              size: parseFloat(getComputedStyle(el).fontSize),
              family: getComputedStyle(el).fontFamily,
            }))
            .filter(({ el, size, family }) => {
              const classes = el.getAttribute('class') ?? '';
              const isLabel = el.tagName === 'DT' || family.includes('Mono') || classes.includes('text-[13px]');
              return size < (isLabel ? 12.5 : 13.5);
            })
            .map(
              ({ el, size }) =>
                `${el.tagName}.${(el.getAttribute('class') ?? '').split(' ').slice(0, 2).join('.')} ${size}px`,
            );
          return { overflow: doc.scrollWidth > doc.clientWidth, small, tiny };
        });
        expect(result.overflow, `${path} overflows at ${width}px`).toBe(false);
        expect(result.small, `small targets on ${path} at ${width}px`).toEqual([]);
        expect(result.tiny, `tiny text on ${path} at ${width}px`).toEqual([]);
      }
      await page.screenshot({ path: testInfo.outputPath(`mobile-${width}.png`), fullPage: true });
    });
  }

  test('menu opens, closes with Escape and with a link click', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/');
    const menu = page.locator('details[data-menu]');
    const summary = menu.locator('summary');
    await summary.click();
    await expect(menu).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveAttribute('open', '');
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('SUMMARY');
    await summary.click();
    await menu.locator('a').first().click();
    await expect(menu).not.toHaveAttribute('open', '');
  });

  test('hero order on mobile is title, summary, buttons, ficha', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/');
    const order = await page.evaluate(() => {
      const pick = (selector: string) => {
        const el = document.querySelector(selector);
        return el ? el.getBoundingClientRect().top : -1;
      };
      return {
        title: pick('main h1'),
        summary: pick('main > section:first-child > div > div:first-child > p:nth-of-type(2)'),
        buttons: pick('main > section:first-child > div > div:first-child > div'),
        ficha: pick('section[aria-labelledby="ficha-title"]'),
      };
    });
    expect(order.title).toBeLessThan(order.summary);
    expect(order.summary).toBeLessThan(order.buttons);
    expect(order.buttons).toBeLessThan(order.ficha);
  });

  test('stack grid is two columns and dates precede their content', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/');
    const result = await page.evaluate(() => {
      const strip = document.querySelector('[data-stack-strip]') as HTMLElement;
      const experience = document.querySelector('#experiencia article') as HTMLElement;
      const educationRow = document.querySelector('#formacion .grid') as HTMLElement;
      return {
        columns: getComputedStyle(strip).gridTemplateColumns.trim().split(/\s+/).length,
        experience:
          experience.children[0].getBoundingClientRect().top <= experience.children[1].getBoundingClientRect().top,
        education:
          educationRow.children[0].getBoundingClientRect().top <= educationRow.children[1].getBoundingClientRect().top,
      };
    });
    expect(result.columns).toBe(2);
    expect(result.experience).toBe(true);
    expect(result.education).toBe(true);
  });

  test('CV toolbar stacks two full-width controls on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/cv/');
    const result = await page.evaluate(() => {
      const toolbar = document.querySelector('.cv-doc > .no-print') as HTMLElement;
      const controls = Array.from(toolbar.children) as HTMLElement[];
      return {
        direction: getComputedStyle(toolbar).flexDirection,
        container: Math.round(toolbar.getBoundingClientRect().width),
        widths: controls.map((control) => Math.round(control.getBoundingClientRect().width)),
      };
    });
    expect(result.direction).toBe('column');
    expect(result.widths.length).toBe(2);
    for (const width of result.widths) expect(Math.abs(width - result.container)).toBeLessThanOrEqual(2);
  });
});
