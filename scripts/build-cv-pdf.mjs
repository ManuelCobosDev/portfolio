import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = path.join(root, 'public', 'cv');
const MAX_BYTES = 300 * 1024;
const MAX_PAGES = 2;

const targets = [
  { route: '/cv/', file: 'Manuel-Cobos-Solis-CV-ES.pdf' },
  { route: '/en/cv/', file: 'Manuel-Cobos-Solis-CV-EN.pdf' },
];

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The preview server needs a moment before it accepts connections.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`preview server did not answer at ${url}`);
}

function countPages(pdf) {
  const matches = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g);
  return matches ? matches.length : 0;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const port = await freePort();
  const origin = `http://127.0.0.1:${port}`;
  const preview = spawn(
    process.execPath,
    [path.join(root, 'node_modules', 'astro', 'astro.js'), 'preview', '--host', '127.0.0.1', '--port', String(port)],
    { cwd: root, stdio: 'ignore' },
  );

  let browser;
  try {
    await waitForServer(`${origin}/cv/`);
    browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
    const page = await browser.newPage();
    for (const target of targets) {
      await page.goto(origin + target.route, { waitUntil: 'networkidle' });
      await page.emulateMedia({ media: 'print' });
      await page.evaluate(() => document.fonts.ready);
      const buffer = Buffer.from(
        await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true }),
      );
      if (buffer.subarray(0, 4).toString('latin1') !== '%PDF') {
        throw new Error(`${target.file}: output does not start with %PDF`);
      }
      const pages = countPages(buffer);
      if (pages < 1 || pages > MAX_PAGES) {
        throw new Error(`${target.file}: ${pages} page(s), maximum is ${MAX_PAGES}`);
      }
      if (buffer.byteLength > MAX_BYTES) {
        throw new Error(`${target.file}: ${Math.round(buffer.byteLength / 1024)} KB, maximum is 300 KB`);
      }
      await writeFile(path.join(outDir, target.file), buffer);
      console.log(`[cv:pdf] ${target.file}: ${pages} page(s), ${Math.round(buffer.byteLength / 1024)} KB`);
    }
  } finally {
    if (browser) await browser.close();
    preview.kill();
  }
}

main().catch((error) => {
  console.error(`[cv:pdf] ${error.message}`);
  process.exit(1);
});
