/**
 * Copies the Latin-only woff2 fonts into public/ before the build and
 * regenerates the monogram-derived icons.
 */
import { fileURLToPath } from 'node:url';
import { mkdir, copyFile, access } from 'node:fs/promises';
import path from 'node:path';
import { generateIcons } from './brand-assets.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const nodeModules = path.join(root, 'node_modules');
const publicDir = path.join(root, 'public');

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

await copyFonts();
await generateIcons(publicDir);
console.log('[prepare-assets] done.');
