# manuelcobos.dev

Portfolio personal de Manuel Cobos Solís, desarrollador Full Stack con orientación
backend. Es un sitio estático bilingüe (español e inglés) con páginas de inicio y
currículum, y las imágenes Open Graph generadas en el build.

- **Sitio en producción:** <https://manuelcobos.dev>
- **Repositorio:** <https://github.com/ManuelCobosDev/portfolio>
- **Ramas:** desarrollo en `development`, producción en `main`

## Stack

- Astro 7 con salida estática e i18n integrado. Todo el sitio se prerenderiza.
- Tailwind CSS 4 a través de `@tailwindcss/vite`, sin config JS de Tailwind.
- `astro-icon` con los sets `lucide`, `simple-icons` y `devicon-plain`.
- Manrope (variable 400-800) y JetBrains Mono (400/500) autoalojadas en `public/fonts`. Nada depende de CDNs externos.
- `satori` y `@resvg/resvg-js` para las imágenes Open Graph; `sharp` para los iconos de marca.
- Playwright y `@axe-core/playwright` para las pruebas end-to-end y de accesibilidad; `cheerio` para el QA estático del HTML.
- TypeScript estricto (`astro/tsconfigs/strict`) y Prettier.

## Requisitos y comandos

Node 22 (`.nvmrc` y `engines.node`) y npm con `package-lock.json`.

| Comando            | Para qué sirve                                                |
| ------------------ | ------------------------------------------------------------- |
| `npm ci`           | Instala las dependencias exactas del `package-lock.json`.     |
| `npm run dev`      | Arranca el servidor de desarrollo con recarga en caliente.    |
| `npm run build`    | Prepara los assets y genera el sitio estático en `dist/`.     |
| `npm run preview`  | Sirve `dist/` en local para comprobar el resultado del build. |
| `npm run check`    | Comprueba tipos y plantillas con `astro check`.               |
| `npm run qa`       | Ejecuta las comprobaciones de calidad sobre `dist/`.          |
| `npm run test:e2e` | Ejecuta la suite de Playwright.                               |
| `npm run format`   | Formatea el código con Prettier.                              |

`npm run build` encadena `node scripts/prepare-assets.mjs` antes de `astro
build`: copia las fuentes a `public/fonts` y regenera los iconos del monograma.
No llames a `astro build` por separado, o el sitio se queda sin fuentes ni
iconos.

En equipos sin Chromium propio, las pruebas pueden ejecutarse sobre un navegador
del sistema con `PW_CHANNEL=msedge` o `PW_CHANNEL=chrome`.

## Estructura

```
.
├─ .github/workflows/ci.yml    # CI: check + build + qa + e2e
├─ public/                     # estáticos que se sirven tal cual
│  ├─ _headers                 # cabeceras HTTP, caché y noindex de Cloudflare
│  ├─ cv/                      # PDF del currículum (nombre con hash del contenido)
│  ├─ fonts/                   # woff2 generadas por prepare-assets (no versionadas)
│  └─ images/                  # retrato en formato 3:4
├─ scripts/                    # prepare-assets, brand-assets y qa
├─ src/
│  ├─ components/              # componentes de la interfaz (pages/ para vistas compuestas)
│  ├─ data/                    # profile, experience, education, stack, nav
│  ├─ i18n/                    # ui.ts (textos) y utils.ts (tipo L<T> y helper pick)
│  ├─ layouts/                 # plantilla base
│  ├─ lib/                     # jsonld, nav, site, years
│  ├─ pages/                   # rutas del sitio
│  ├─ scripts/                 # JS de cliente: theme, menu, active-section
│  └─ styles/                  # tokens de diseño, fuentes y tema claro/oscuro
├─ tests/e2e/                  # suite Playwright
├─ astro.config.mjs            # site, i18n, iconos, sitemap y Tailwind
├─ playwright.config.ts
├─ tsconfig.json
└─ wrangler.jsonc              # configuración del Worker solo-assets de Cloudflare
```

## Dónde se edita el contenido

| Qué                                               | Dónde                                                        |
| ------------------------------------------------- | ------------------------------------------------------------ |
| Perfil, correo, enlaces, ubicación, rol e idiomas | `src/data/profile.ts`                                        |
| Experiencia profesional                           | `src/data/experience.ts`                                     |
| Formación y certificaciones                       | `src/data/education.ts`                                      |
| Stack técnico (core y agrupado)                   | `src/data/stack.ts`                                          |
| Secciones de navegación                           | `src/data/nav.ts`                                            |
| Textos de la interfaz en ambos idiomas            | `src/i18n/ui.ts`                                             |
| Rutas del currículum y nombre del PDF             | `src/lib/site.ts`                                            |
| Retrato                                           | `public/images/manuel-cobos-solis-profile-picture.png` (3:4) |
| Cabeceras HTTP y caché                            | `public/_headers`                                            |

## Currículum para descarga

El CV real se sirve desde `public/cv/` y se enlaza en `/cv/`, `/en/cv/` y el
footer, con las constantes `CV_PDF_PATH` y `CV_PDF_NAME` de `src/lib/site.ts`. Su
URL lleva el hash SHA-256 del contenido (`Manuel-Cobos-Solis-CV-<hash>.pdf`) para
poder cachearlo de forma inmutable: cada versión se descarga una sola vez y, al
cambiar el PDF, cambia la URL.

Para actualizarlo: reemplaza el archivo de `public/cv/` por el nuevo PDF, calcula
su SHA-256 (`Get-FileHash` en PowerShell) y actualiza `CV_PDF_PATH` en
`src/lib/site.ts` y la regla correspondiente de `public/_headers`.

## SEO, indexación y Open Graph

- **Idiomas y URL.** Español sin prefijo (`/`, `/cv/`) e inglés bajo `/en/`.
  `trailingSlash: 'always'`, así que toda ruta termina en
  `/`. Cada página declara su `canonical` y los `alternates` es / en /
  x-default.
- **Sitemap.** `@astrojs/sitemap` genera `sitemap-index.xml` con las rutas
  estáticas del sitio. El `lastmod` lo fija el propio plugin en cada build.
- **`robots.txt` propio.** Permite el rastreo general y, de forma explícita, el
  de los rastreadores de IA (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
  Claude-SearchBot, Claude-User, PerplexityBot, Google-Extended,
  Applebot-Extended y CCBot), y apunta al sitemap. El `robots.txt` de Cloudflare
  debe seguir desactivado para que no lo sustituya por el suyo.
- **`/llms.txt`.** Resumen del sitio en texto plano, pensado para modelos.
- **Open Graph.** `/og/*.png` (1200×630, fondo navy) se generan en el build con
  `satori` y `@resvg/resvg-js`: `home-es`, `home-en`, `cv-es` y `cv-en`.
- **JSON-LD.** `Person`, `ProfilePage` y `WebSite` en la home; `Person` y
  `WebPage` en el CV, con `@id` estables.
- **Verificación de buscadores.** `Seo.astro` emite `google-site-verification` y
  `msvalidate.01` solo si existen las variables de entorno
  `PUBLIC_GSC_VERIFICATION` y `PUBLIC_BING_VERIFICATION` en el build. En
  Cloudflare se definen como variables del Worker.
- **Lo que queda fuera del índice, a propósito.** Las URL `*.workers.dev`
  (producción, versiones y previews) salen con `X-Robots-Tag: noindex` por la
  regla de `public/_headers`, y `404.html` lleva `noindex` y no entra en el
  sitemap. El único dominio indexable es `manuelcobos.dev`.

## Caché y cabeceras HTTP

Todo se declara en `public/_headers`, que Cloudflare aplica al desplegar; no hay
que configurar caché en el panel.

| Ruta                | `Cache-Control`               | Por qué                                                                    |
| ------------------- | ----------------------------- | -------------------------------------------------------------------------- |
| `/_astro/*`         | `max-age=31536000, immutable` | Assets con hash en el nombre. Hoy el build no emite ninguno (ver la nota). |
| `/cv/<archivo>.pdf` | `max-age=31536000, immutable` | El nombre lleva el hash del contenido (ver arriba).                        |
| `/images/*`         | `max-age=604800` (7 días)     | El retrato conserva el nombre, así que no puede cachearse para siempre.    |
| `/fonts/*`          | `max-age=604800` (7 días)     | Nombres estables de las fuentes woff2.                                     |
| `/og/*`             | `max-age=86400` (1 día)       | Se regeneran en cada build.                                                |
| `/*`                | sin `Cache-Control`           | Solo añade las cabeceras de seguridad.                                     |

**No hay carpeta `_astro/` en el build.** El CSS va en línea en el HTML y el
script de cliente también, así que `dist/` es HTML más los estáticos que ya
viven en `public/`. La regla de `/_astro/*` se queda como red de seguridad por
si Astro empieza a emitir assets con hash.

El PDF sale además con `Content-Type: application/pdf`, sin `CSP` (el visor del
navegador no la necesita) y con `Link: <https://manuelcobos.dev/cv/>;
rel="canonical"`. El `manifest.webmanifest` se sirve como
`application/manifest+json`.

La primera regla aplica a todo el sitio las cabeceras de seguridad:
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `HSTS` y una
`CSP` que solo admite recursos propios.

Tras cada despliegue conviene comprobar las cabeceras:

```bash
curl -I https://manuelcobos.dev/
curl -I https://manuelcobos.dev/fonts/manrope-latin-wght-normal.woff2
curl -I https://manuelcobos.dev/cv/Manuel-Cobos-Solis-CV-ae560ece.pdf
curl -I https://manuelcobos.dev/una-url-inexistente
```

Se espera: cabeceras de seguridad en `/`, `Cache-Control: public,
max-age=604800` en la fuente, `Content-Type: application/pdf` en el PDF y un 404
servido con el `404.html` del sitio en la URL inexistente.

## Comprobaciones de calidad e integración continua

`npm run qa` valida el HTML generado en `dist/` y falla si algo no cuadra:

- **Metadatos:** títulos y descripciones únicos, `canonical`, `html lang`,
  `hreflang` recíproco, Open Graph y Twitter Cards, JSON-LD que parsea.
- **Estructura y contenido:** encabezados, landmarks, imágenes con dimensiones,
  enlaces internos, `rel="noopener"` en enlaces externos, sin hosts de terceros,
  paridad es/en de la portada y presencia de los datos personales críticos.
- **Archivos servidos:** sitemap, `robots.txt`, `llms.txt`, `manifest`,
  `_headers`, favicon 32×32 válido, retrato presente y `404.html` fuera del
  índice. Sin `_redirects` y sin comentarios HTML en el resultado.
- **Presupuestos:** 35 KB gzip y 110 KB en bruto por documento, 10 KB de JS
  total en gzip, 120 KB por archivo de `/_astro/` y 100 KB de fuentes.

La suite de Playwright (`tests/e2e/`) cubre `site`, `content`, `layout`,
`design`, `mobile`, `headers`, `cv` y `cv-print`: diseño, accesibilidad con
`axe-core`, comportamiento en móvil, cabeceras de seguridad, idioma y los botones
del currículum.

`.github/workflows/ci.yml` se ejecuta en cada push a `main` y `development` y en
cada pull request. Un único job `verify` (Ubuntu, 15 min) encadena `npm ci`,
`astro check`, build, `qa` y las e2e con Chromium. Si algo falla, sube el reporte
de Playwright como artefacto durante 7 días.

## Despliegue en Cloudflare Workers

El sitio se publica con la integración de Git de **Cloudflare Workers Builds**,
que ejecuta el build y sube `dist/` como assets estáticos. La configuración del
Worker vive en `wrangler.jsonc`:

- `assets.directory`: `./dist`.
- `assets.not_found_handling`: `404-page`, para servir el `404.html` del build.
- `build.command`: `npm run build`, para que `wrangler deploy` construya el sitio
  antes de subir los assets.
- Sin `main`: es un Worker solo de assets, no ejecuta código propio.

En el panel de Cloudflare:

- Rama de producción: `main`.
- Comando de build: **dejarlo vacío** (ya lo ejecuta `build.command`; si se
  rellena también aquí, el sitio se construye dos veces).
- Comando de deploy: `npx wrangler deploy`.
- Variable de entorno `NODE_VERSION` con el valor de `.nvmrc`.
- Dominio personalizado `manuelcobos.dev`, con `www` redirigido al dominio raíz.
- Early Hints y Crawler Hints activados; Rocket Loader, Email Address
  Obfuscation y Web Analytics desactivados; `robots.txt` gestionado por
  Cloudflare desactivado (el sitio sirve el suyo).

> **No añadas el adaptador `@astrojs/cloudflare`.** El sitio es totalmente
> estático y la ruta `/og/*.png` genera las imágenes con `satori` y
> `@resvg/resvg-js`, un addon nativo que Astro prerenderiza en Node durante el
> build. Con el adaptador, esa ruta se empaqueta en el bundle del Worker y Vite
> falla con `UNLOADABLE_DEPENDENCY ... resvgjs.linux-x64-musl.node`. Tener
> `wrangler.jsonc` en el repositorio evita además que `wrangler deploy` lance su
> autoconfiguración y añada ese adaptador por su cuenta.
