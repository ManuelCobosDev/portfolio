import { test, expect } from '@playwright/test';

const ficha = 'section[aria-labelledby="ficha-title"]';

test.describe('hero, ficha and navigation', () => {
  test('ficha labels use 13px medium sans in the muted colour', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const dt = page.locator(`${ficha} dt`).first();
    const result = await dt.evaluate((el) => {
      const style = getComputedStyle(el);
      const row = el.closest('div') as HTMLElement;
      const probe = document.createElement('span');
      probe.style.color = getComputedStyle(document.documentElement).getPropertyValue('--muted');
      document.body.appendChild(probe);
      const muted = getComputedStyle(probe).color;
      probe.remove();
      return {
        family: style.fontFamily,
        weight: style.fontWeight,
        size: style.fontSize,
        matchesMuted: style.color === muted,
        columns: getComputedStyle(row).gridTemplateColumns.split(' '),
      };
    });
    expect(result.family).toContain('Manrope');
    expect(result.family).not.toContain('Mono');
    expect(result.weight).toBe('500');
    expect(result.size).toBe('13px');
    expect(result.matchesMuted).toBe(true);
    expect(result.columns[0]).toBe('120px');
  });

  test('portrait keeps a 4/3 frame with the face in view', async ({ page }) => {
    await page.goto('/');
    const img = page.locator(`${ficha} img`).first();
    await expect(img).toBeVisible();
    const box = await img.boundingBox();
    expect(Math.abs(box!.width / box!.height - 4 / 3)).toBeLessThan(0.02);
    const style = await img.evaluate((el) => {
      const s = getComputedStyle(el);
      return { fit: s.objectFit, position: s.objectPosition };
    });
    expect(style.fit).toBe('cover');
    expect(style.position.replace(/\s+/g, ' ')).toBe('50% 15%');
  });

  for (const width of [1280, 1440, 1920, 2560]) {
    test(`hero text stays level with the ficha at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1200 });
      await page.goto('/');
      const difference = await page.evaluate(() => {
        const text = document.querySelector('main > section:first-child > div > div:first-child') as HTMLElement;
        const card = document.querySelector('section[aria-labelledby="ficha-title"]') as HTMLElement;
        return Math.abs(text.getBoundingClientRect().top - card.getBoundingClientRect().top);
      });
      expect(difference).toBeLessThanOrEqual(120);
    });
  }

  test('header nav links are 14px with even gaps', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const size = await page
      .locator('header nav[aria-label] a')
      .first()
      .evaluate((el) => getComputedStyle(el).fontSize);
    expect(size).toBe('14px');
    const gaps = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll<HTMLElement>('header nav[aria-label] a'));
      const rects = links.map((link) => link.getBoundingClientRect());
      const out: number[] = [];
      for (let i = 1; i < rects.length; i += 1) out.push(Math.round(rects[i].left - rects[i - 1].right));
      return out;
    });
    expect(gaps.length).toBeGreaterThan(0);
    expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThanOrEqual(1);
  });

  test('ficha links are 15px', async ({ page }) => {
    await page.goto('/');
    const sizes = await page.$$eval(`${ficha} a`, (links) => links.map((link) => getComputedStyle(link).fontSize));
    for (const size of sizes) expect(size).toBe('15px');
  });
});

test.describe('vertical rhythm and typography', () => {
  test('sections share one padding rhythm at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const result = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.paddingTop = 'clamp(3.5rem, 2.5rem + 4vw, 6.5rem)';
      document.body.appendChild(probe);
      const expected = getComputedStyle(probe).paddingTop;
      probe.remove();
      const elements = Array.from(document.querySelectorAll<HTMLElement>('main .section-pad'));
      const bad = elements
        .map((el) => {
          const style = getComputedStyle(el);
          return `${el.tagName} ${el.className}: ${style.paddingTop}/${style.paddingBottom}`;
        })
        .filter((entry) => !entry.endsWith(`${expected}/${expected}`));
      return { expected, count: elements.length, bad };
    });
    expect(result.count).toBeGreaterThan(0);
    expect(result.bad).toEqual([]);
  });

  test('every dt label uses the sans family', async ({ page }) => {
    for (const route of ['/', '/cv/']) {
      await page.goto(route);
      const families = await page.$$eval('dt', (labels) => labels.map((label) => getComputedStyle(label).fontFamily));
      expect(families.length).toBeGreaterThan(0);
      for (const family of families) expect(family).toContain('Manrope');
    }
  });

  test('experience dates align to the first baseline in muted text', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const result = await page.evaluate(() => {
      const article = document.querySelector('#experiencia article') as HTMLElement;
      const date = article.children[0] as HTMLElement;
      const content = article.children[1] as HTMLElement;
      const probe = document.createElement('span');
      probe.style.color = getComputedStyle(document.documentElement).getPropertyValue('--muted');
      document.body.appendChild(probe);
      const muted = getComputedStyle(probe).color;
      probe.remove();
      const parts = Array.from(date.querySelectorAll('time, span'));
      return {
        color: getComputedStyle(date).color,
        muted,
        align: getComputedStyle(article).alignItems,
        whiteSpace: parts.map((el) => getComputedStyle(el).whiteSpace),
        dateTop: parts[0]?.getBoundingClientRect().top ?? -1,
        contentTop: content.getBoundingClientRect().top,
      };
    });
    expect(result.color).toBe(result.muted);
    expect(result.align).toBe('baseline');
    expect(result.whiteSpace.every((value) => value === 'nowrap')).toBe(true);
    expect(Math.abs(result.dateTop - result.contentTop)).toBeLessThanOrEqual(8);
  });
});

test.describe('stack strip', () => {
  test('icons render and cells tile with single-line borders', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const result = await page.evaluate(() => {
      const strip = document.querySelector('[data-stack-strip]') as HTMLElement;
      const cells = Array.from(strip.children) as HTMLElement[];
      const container = getComputedStyle(strip);
      const issues: string[] = [];
      for (const cell of cells) {
        const style = getComputedStyle(cell);
        if (parseFloat(style.borderRightWidth) < 1) issues.push('cell without right border');
        if (parseFloat(style.borderBottomWidth) < 1) issues.push('cell without bottom border');
        if (parseFloat(style.borderTopWidth) > 0) issues.push('cell with doubled top border');
        if (parseFloat(style.borderLeftWidth) > 0) issues.push('cell with doubled left border');
      }
      const icons = Array.from(strip.querySelectorAll('svg')).map((svg) => svg.getBoundingClientRect());
      return {
        cells: cells.length,
        icons: icons.length,
        empty: icons.filter((rect) => rect.width < 1 || rect.height < 1).length,
        issues: [...new Set(issues)],
        containerTop: container.borderTopWidth,
        containerLeft: container.borderLeftWidth,
      };
    });
    expect(result.cells).toBe(10);
    expect(result.icons).toBe(10);
    expect(result.empty).toBe(0);
    expect(result.issues).toEqual([]);
    expect(result.containerTop).toBe('1px');
    expect(result.containerLeft).toBe('1px');
  });

  for (const columns of [2, 3, 4]) {
    test(`cells stay adjacent with ${columns} columns`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/');
      const issues = await page.evaluate((cols) => {
        const strip = document.querySelector('[data-stack-strip]') as HTMLElement;
        strip.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        const cells = Array.from(strip.children) as HTMLElement[];
        const rects = cells.map((cell) => cell.getBoundingClientRect());
        const found: string[] = [];
        for (let i = 0; i < rects.length; i += 1) {
          const row = Math.floor(i / cols);
          const column = i % cols;
          if (column > 0 && Math.abs(rects[i].left - rects[i - 1].right) > 1) found.push('horizontal gap');
          if (row > 0 && Math.abs(rects[i].top - rects[i - cols].bottom) > 1) found.push('vertical gap');
          if (rects[i].width < 1 || rects[i].height < 1) found.push('empty cell');
        }
        strip.style.gridTemplateColumns = '';
        return [...new Set(found)];
      }, columns);
      expect(issues).toEqual([]);
    });
  }

  test('strip borders stay visible in both themes', async ({ page }) => {
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/');
      const colors = await page.$$eval('[data-stack-strip] > *', (cells) =>
        cells.map((cell) => getComputedStyle(cell).borderRightColor),
      );
      for (const color of colors) expect(color).not.toBe('rgba(0, 0, 0, 0)');
    }
  });
});

test.describe('stray strips and reveal robustness', () => {
  for (const scheme of ['light', 'dark'] as const) {
    test(`the footer ends flush with the document (${scheme})`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/');
      await page.screenshot({ path: testInfo.outputPath(`home-${scheme}.png`), fullPage: true });
      const result = await page.evaluate(() => {
        const footer = document.querySelector('footer') as HTMLElement;
        const html = getComputedStyle(document.documentElement);
        const body = getComputedStyle(document.body);
        return {
          scrollHeight: document.documentElement.scrollHeight,
          footerBottom: Math.round(footer.getBoundingClientRect().bottom + window.scrollY),
          htmlMargin: html.margin,
          bodyMargin: body.margin,
          bodyBackground: body.backgroundColor,
          widths: {
            scroll: document.documentElement.scrollWidth,
            client: document.documentElement.clientWidth,
          },
        };
      });
      expect(result.htmlMargin).toBe('0px');
      expect(result.bodyMargin).toBe('0px');
      expect(result.bodyBackground).not.toBe('rgba(0, 0, 0, 0)');
      expect(result.widths.scroll).toBeLessThanOrEqual(result.widths.client);
      expect(result.footerBottom).toBe(result.scrollHeight);
    });
  }

  test('every reveal is fully visible in a tall viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 6000 });
    await page.goto('/');
    const hidden = await page.$$eval('.reveal', (elements) =>
      elements.map((element) => Number(getComputedStyle(element).opacity)).filter((opacity) => opacity < 1),
    );
    expect(hidden).toEqual([]);
  });

  test('content stays visible without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    const hidden = await page.$$eval('.reveal', (elements) =>
      elements.map((element) => Number(getComputedStyle(element).opacity)).filter((opacity) => opacity < 1),
    );
    expect(hidden).toEqual([]);
    await context.close();
  });

  test('no reveal animation on the CV or in print', async ({ page }) => {
    await page.goto('/cv/');
    expect(await page.locator('.reveal').count()).toBe(0);
    await page.emulateMedia({ media: 'print' });
    await page.goto('/cv/');
    const animated = await page.$$eval('.cv-doc *', (elements) =>
      elements.map((element) => getComputedStyle(element).animationName).filter((name) => name !== 'none'),
    );
    expect(animated).toEqual([]);
  });
});
