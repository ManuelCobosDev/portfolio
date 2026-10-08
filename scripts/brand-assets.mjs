// Regenerates the monogram-derived icons; the OG images regenerate during `npm run build` via src/pages/og/[...slug].png.ts.
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const publicDir = path.join(root, 'public');

const MONOGRAM_PATHS = [
  'M0 80V0H24L32 8L40 0H64V80H48V16L32 32L16 16V80Z',
  'M140.284 11.716A40 40 0 1 0 140.284 68.284L128.971 56.971A24 24 0 1 1 128.971 23.029Z',
];

const NAVY = '#0A1931';
const TEAL = '#1DE9B1';

/** Builds the monogram inside a square canvas; maskable icons use a full-bleed square. */
function monogramSvg({ size, bg, color, scale, tx, ty, rx = 0 }) {
  const rect = rx
    ? `<rect width="${size}" height="${size}" rx="${rx}" fill="${bg}"/>`
    : `<rect width="${size}" height="${size}" fill="${bg}"/>`;
  const paths = MONOGRAM_PATHS.map((d) => `<path d="${d}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${rect}<g transform="translate(${tx} ${ty}) scale(${scale})" fill="${color}">${paths}</g></svg>`;
}

/** Builds a PNG-compressed ICO file (Vista+ format) from an array of PNG buffers. */
function makeIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  const dir = [];
  let offset = 6 + entries.length * 16;
  for (const { png, size } of entries) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    dir.push(e);
    offset += png.length;
  }
  return Buffer.concat([header, ...dir, ...entries.map((x) => x.png)]);
}

export async function generateIcons(dir = publicDir) {
  await mkdir(dir, { recursive: true });
  const faviconSvg = await readFile(path.join(dir, 'favicon.svg'));
  const png32 = await sharp(faviconSvg).resize(32, 32).png().toBuffer();
  const png16 = await sharp(faviconSvg).resize(16, 16).png().toBuffer();
  await writeFile(
    path.join(dir, 'favicon.ico'),
    makeIco([
      { png: png32, size: 32 },
      { png: png16, size: 16 },
    ]),
  );

  const apple = monogramSvg({ size: 180, bg: NAVY, color: TEAL, scale: 0.7699, tx: 36, ty: 59.2 });
  await sharp(Buffer.from(apple)).flatten({ background: NAVY }).png().toFile(path.join(dir, 'apple-touch-icon.png'));

  await sharp(faviconSvg).resize(192, 192).png().toFile(path.join(dir, 'icon-192.png'));
  await sharp(faviconSvg).resize(512, 512).png().toFile(path.join(dir, 'icon-512.png'));

  for (const size of [192, 512]) {
    const scale = (size * 0.5) / 141;
    const tx = (size - 141 * scale) / 2;
    const ty = (size - 80 * scale) / 2;
    const maskable = monogramSvg({ size, bg: NAVY, color: TEAL, scale, tx, ty });
    await sharp(Buffer.from(maskable)).flatten({ background: NAVY }).png().toFile(path.join(dir, `icon-maskable-${size}.png`));
  }

  console.log('[brand-assets] icons written.');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  generateIcons().catch((error) => {
    console.error(`[brand-assets] ${error.message}`);
    process.exit(1);
  });
}
