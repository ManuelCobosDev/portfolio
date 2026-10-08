/**
 * Copies the Latin-only woff2 fonts, the portrait JPG and the PNG icons into
 * public/ before the build.
 */
import { fileURLToPath } from 'node:url';
import { mkdir, copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { generateIcons } from './brand-assets.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const nodeModules = path.join(root, 'node_modules');
const srcAssets = path.join(root, 'src', 'assets');
const publicDir = path.join(root, 'public');

// In CI / production the real portrait is mandatory; local development falls
// back to a neutral placeholder so the build runs.
const isProduction = process.env.CI === 'true' || process.env.NODE_ENV === 'production';

const PORTRAIT_SOURCE = path.join(srcAssets, 'manuel-cobos-solis.png');
const PORTRAIT_OUT = path.join(publicDir, 'images', 'manuel-cobos-solis.jpg');

const FONTS = [
  {
    src: path.join(nodeModules, '@fontsource-variable', 'manrope', 'files', 'manrope-latin-wght-normal.woff2'),
    dest: path.join(publicDir, 'fonts', 'manrope-latin-wght-normal.woff2'),
  },
  {
    src: path.join(nodeModules, '@fontsource', 'jetbrains-mono', 'files', 'jetbrains-mono-latin-400-normal.woff2'),
    dest: path.join(publicDir, 'fonts', 'jetbrains-mono-latin-400-normal.woff2'),
  },
  {
    src: path.join(nodeModules, '@fontsource', 'jetbrains-mono', 'files', 'jetbrains-mono-latin-500-normal.woff2'),
    dest: path.join(publicDir, 'fonts', 'jetbrains-mono-latin-500-normal.woff2'),
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
  <rect width="800" height="800" fill="#EDF1F5"/>
  <text x="400" y="428" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="200" fill="#0A1931">MC</text>
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

await copyFonts();
await preparePortrait();
await generateIcons(publicDir);
console.log('[prepare-assets] done.');
