import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

const SITE = 'https://manuelcobos.dev';

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
        lucide: [
          'sun',
          'moon',
          'menu',
          'x',
          'arrow-up-right',
          'arrow-right',
          'mail',
          'copy',
          'check',
          'download',
          'printer',
        ],
        'simple-icons': [
          'springboot',
          'apachekafka',
          'rabbitmq',
          'angular',
          'typescript',
          'postgresql',
          'docker',
          'kubernetes',
          'githubactions',
        ],
        'devicon-plain': ['java'],
      },
    }),
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-ES', en: 'en' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
