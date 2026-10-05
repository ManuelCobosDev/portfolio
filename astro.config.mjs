import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://manuelcobos.dev';
const PROFILE_LAST_UPDATED = '2026-10-05';

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fm[key] = value;
  }
  return fm;
}

function workEntries() {
  const base = path.resolve('src/content/work');
  const entries = [];
  for (const lang of ['es', 'en']) {
    const dir = path.join(base, lang);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const fm = parseFrontmatter(fs.readFileSync(path.join(dir, file), 'utf8'));
      if (fm.draft === 'true') continue;
      entries.push({ slug: file.replace(/\.md$/, ''), lang, ...fm });
    }
  }
  return entries;
}

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  devToolbar: { enabled: false },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    icon({
      include: {
        lucide: ['sun', 'moon', 'menu', 'x', 'arrow-up-right', 'arrow-right', 'mail', 'copy', 'check', 'download', 'printer'],
        'simple-icons': ['openjdk', 'springboot', 'apachekafka', 'rabbitmq', 'angular', 'typescript', 'postgresql', 'docker', 'kubernetes', 'githubactions'],
      },
    }),
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-ES', en: 'en' } },
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        item.lastmod = new Date(PROFILE_LAST_UPDATED);
        const workMatch = item.url.match(/https:\/\/manuelcobos\.dev\/(trabajo|en\/work)\/([^/]+)\/$/);
        if (workMatch) {
          const lang = workMatch[1] === 'trabajo' ? 'es' : 'en';
          const slug = workMatch[2];
          const works = workEntries();
          const current = works.find((w) => w.lang === lang && w.slug === slug);
          if (current) {
            const other = works.find((w) => w.translationKey === current.translationKey && w.lang !== lang);
            if (other) {
              const esSlug = lang === 'es' ? slug : other.slug;
              const enSlug = lang === 'en' ? slug : other.slug;
              item.links = [
                { lang: 'es-ES', url: `https://manuelcobos.dev/trabajo/${esSlug}/` },
                { lang: 'en', url: `https://manuelcobos.dev/en/work/${enSlug}/` },
              ];
            }
            const date = current.updatedAt || current.publishedAt;
            if (date) item.lastmod = new Date(date);
          }
        }
        return item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
