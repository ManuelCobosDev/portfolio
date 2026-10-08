import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { profile } from '../../data/profile';
import { slugFromId } from '../../lib/site';

async function getTitle(name: string): Promise<string> {
  if (name === 'home-es') return profile.name;
  if (name === 'home-en') return profile.name;
  if (name === 'cv-es') return 'Currículum';
  if (name === 'cv-en') return 'Résumé';
  if (name.startsWith('work-')) {
    const slug = name.slice('work-'.length);
    const works = await getCollection('work');
    const entry = works.find((w) => slugFromId(w.id) === slug);
    if (entry) return entry.data.seoTitle;
  }
  return profile.name;
}

let monogramDataUri: string | null = null;

async function getMonogramDataUri(): Promise<string> {
  if (!monogramDataUri) {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="282" height="160" viewBox="0 0 141 80">' +
      '<g fill="#1DE9B1">' +
      '<path d="M0 80V0H24L32 8L40 0H64V80H48V16L32 32L16 16V80Z"/>' +
      '<path d="M140.284 11.716A40 40 0 1 0 140.284 68.284L128.971 56.971A24 24 0 1 1 128.971 23.029Z"/>' +
      '</g></svg>';
    monogramDataUri = `data:image/png;base64,${(await sharp(Buffer.from(svg)).png().toBuffer()).toString('base64')}`;
  }
  return monogramDataUri;
}

/** Node Buffers are Uint8Array views; opentype.js needs a real ArrayBuffer. */
function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

export async function getStaticPaths() {
  const works = await getCollection('work');
  const names = ['home-es', 'home-en', 'cv-es', 'cv-en', ...works.map((w) => `work-${slugFromId(w.id)}`)];
  return names.map((name) => ({ params: { slug: name } }));
}

export const GET: APIRoute = async ({ params }) => {
  const name = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const title = await getTitle(name ?? 'home-es');

  const fontDir = path.resolve('node_modules/@fontsource/manrope/files');
  const [font400, font500, font700, font800] = await Promise.all([
    readFile(path.join(fontDir, 'manrope-latin-400-normal.woff')),
    readFile(path.join(fontDir, 'manrope-latin-500-normal.woff')),
    readFile(path.join(fontDir, 'manrope-latin-700-normal.woff')),
    readFile(path.join(fontDir, 'manrope-latin-800-normal.woff')),
  ]);
  const monogram = await getMonogramDataUri();

  const element = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 1200,
        height: 630,
        background: '#0A1931',
        padding: '80px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: 18 },
            children: [
              { type: 'img', props: { src: monogram, width: 70, height: 40 } },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        children: 'MANUEL COBOS SOLÍS',
                        style: { fontSize: 22, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.02em' },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        children: 'FULL STACK ENGINEER',
                        style: { fontSize: 15, fontWeight: 500, color: '#1DE9B1', letterSpacing: '0.22em' },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', maxWidth: 1040 },
            children: [
              {
                type: 'div',
                props: { children: title, style: { fontSize: 64, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 } },
              },
            ],
          },
        },
      ],
    },
  };

  const svg = await satori(element as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Manrope', data: toArrayBuffer(font400), weight: 400, style: 'normal' },
      { name: 'Manrope', data: toArrayBuffer(font500), weight: 500, style: 'normal' },
      { name: 'Manrope', data: toArrayBuffer(font700), weight: 700, style: 'normal' },
      { name: 'Manrope', data: toArrayBuffer(font800), weight: 800, style: 'normal' },
    ],
  });

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  const body = png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength) as ArrayBuffer;

  return new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
