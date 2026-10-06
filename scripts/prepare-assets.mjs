/**
 * Copies the Latin-only woff2 fonts, the portrait JPG and the PNG icons into
 * public/ before the build.
 */
import { fileURLToPath } from 'node:url';
import { mkdir, copyFile, access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const nodeModules = path.join(root, 'node_modules');
const srcAssets = path.join(root, 'src', 'assets');
const publicDir = path.join(root, 'public');

// In CI / production the real portrait is mandatory; local development falls
// back to a neutral placeholder so the build runs.
const isProduction = process.env.CI === 'true' || process.env.NODE_ENV === 'production';

const PORTRAIT_SOURCE = path.join(srcAssets, 'manuel-cobos-solis.png');
const PORTRAIT_OUT = path.join(publicDir, 'images', 'manuel-cobos-solis.jpg');
const FAVICON_SVG = path.join(publicDir, 'favicon.svg');

const FONTS = [
  {
    src: path.join(nodeModules, '@fontsource-variable', 'ibm-plex-sans', 'files', 'ibm-plex-sans-latin-wght-normal.woff2'),
    dest: path.join(publicDir, 'fonts', 'ibm-plex-sans-latin-wght-normal.woff2'),
  },
  {
    src: path.join(nodeModules, '@fontsource', 'ibm-plex-mono', 'files', 'ibm-plex-mono-latin-400-normal.woff2'),
    dest: path.join(publicDir, 'fonts', 'ibm-plex-mono-latin-400-normal.woff2'),
  },
  {
    src: path.join(nodeModules, '@fontsource', 'ibm-plex-mono', 'files', 'ibm-plex-mono-latin-500-normal.woff2'),
    dest: path.join(publicDir, 'fonts', 'ibm-plex-mono-latin-500-normal.woff2'),
  },
];

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyFonts() {
  await mkdir(path.join(publicDir, 'fonts'), { recursive: true });
  for (const font of FONTS) {
    if (!(await fileExists(font.src))) {
      throw new Error(`Missing font file: ${font.src}`);
    }
    await copyFile(font.src, font.dest);
  }
  console.log('[prepare-assets] fonts copied.');
}

const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#EAEFF7"/>
  <text x="400" y="428" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="200" fill="#1D4ED8">MC</text>
</svg>`;

async function preparePortrait() {
  await mkdir(path.join(publicDir, 'images'), { recursive: true });

  if (!(await fileExists(PORTRAIT_SOURCE))) {
    if (isProduction) {
      throw new Error(
        [
          '',
          'MISSING PORTRAIT: src/assets/manuel-cobos-solis.png',
          'The production build requires the real portrait (938x936 PNG).',
          'Add the square PNG at that path and rebuild.',
          '',
        ].join('\n'),
      );
    }
    await mkdir(srcAssets, { recursive: true });
    await sharp(Buffer.from(PLACEHOLDER_SVG)).png().toFile(PORTRAIT_SOURCE);
    console.warn('[prepare-assets] WARNING: src/assets/manuel-cobos-solis.png is missing.');
    console.warn('[prepare-assets] neutral "MC" placeholder written for local development only.');
    console.warn('[prepare-assets] The production build (CI=true) fails until the real portrait is added.');
  }

  await sharp(PORTRAIT_SOURCE)
    .resize(800, 800, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(PORTRAIT_OUT);
  console.log('[prepare-assets] portrait JPG written.');
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

async function prepareIcons() {
  const svg = await readFile(FAVICON_SVG);
  const png32 = await sharp(svg).resize(32, 32).png().toBuffer();
  await writeFile(path.join(publicDir, 'favicon.ico'), makeIco([{ png: png32, size: 32 }]));

  const png180 = await sharp(svg).resize(180, 180).png().toBuffer();
  await sharp({
    create: { width: 180, height: 180, channels: 4, background: { r: 245, g: 247, b: 251, alpha: 1 } },
  })
    .composite([{ input: png180 }])
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(svg).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(svg).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512.png'));
  console.log('[prepare-assets] icons written.');
}

await copyFonts();
await preparePortrait();
await prepareIcons();
console.log('[prepare-assets] done.');
