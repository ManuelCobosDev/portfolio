import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { profile } from '../../data/profile';
import { slugFromId } from '../../lib/site';

interface OgSpec {
  title: string;
  subtitle: string;
}

async function getSpec(name: string): Promise<OgSpec> {
  if (name === 'home-es') return { title: profile.name, subtitle: profile.role.es };
  if (name === 'home-en') return { title: profile.name, subtitle: profile.role.en };
  if (name === 'cv-es') return { title: 'Currículum', subtitle: profile.name };
  if (name === 'cv-en') return { title: 'Résumé', subtitle: profile.name };
  if (name.startsWith('work-')) {
    const slug = name.slice('work-'.length);
    const works = await getCollection('work');
    const entry = works.find((w) => slugFromId(w.id) === slug);
    if (entry) return { title: entry.data.seoTitle, subtitle: profile.name };
  }
  return { title: profile.name, subtitle: profile.role.es };
}

export async function getStaticPaths() {
  const works = await getCollection('work');
  const names = ['home-es', 'home-en', 'cv-es', 'cv-en', ...works.map((w) => `work-${slugFromId(w.id)}`)];
  return names.map((name) => ({ params: { slug: name } }));
}

export const GET: APIRoute = async ({ params }) => {
  const name = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const spec = await getSpec(name ?? 'home-es');

  const fontDir = path.resolve('node_modules/@fontsource/ibm-plex-sans/files');
  const [font400, font600] = await Promise.all([
    readFile(path.join(fontDir, 'ibm-plex-sans-latin-400-normal.woff')),
    readFile(path.join(fontDir, 'ibm-plex-sans-latin-600-normal.woff')),
  ]);

  const element = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        width: 1200,
        height: 630,
        background: '#0A1426',
        position: 'relative',
        padding: '80px 80px 80px 86px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: '#7FB0FF', display: 'flex' },
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' },
            children: [
              { type: 'div', props: { children: 'manuelcobos.dev', style: { fontSize: 28, color: '#A9B8D0' } } },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', maxWidth: 1034 },
                  children: [
                    {
                      type: 'div',
                      props: {
                        children: spec.title,
                        style: { fontSize: 84, fontWeight: 600, color: '#E8EEF8', lineHeight: 1.1 },
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        children: spec.subtitle,
                        style: { fontSize: 40, color: '#A9B8D0', marginTop: 20 },
                      },
                    },
                  ],
                },
              },
              { type: 'div', props: { children: 'Java · Spring Boot · Kafka · Angular', style: { fontSize: 32, color: '#7FB0FF' } } },
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
      { name: 'IBM Plex Sans', data: font400, weight: 400, style: 'normal' },
      { name: 'IBM Plex Sans', data: font600, weight: 600, style: 'normal' },
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
