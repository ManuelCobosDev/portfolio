# manuelcobos.dev

Portfolio personal de Manuel Cobos Solís, desarrollador Full Stack con enfoque
backend. Es un sitio estático bilingüe (español e inglés) con páginas de inicio y
currículum, un caso de estudio y las imágenes Open Graph generadas en el build.

Sitio en producción: <https://manuelcobos.dev>

## Stack

- Astro 5 con salida estática e i18n integrado.
- Tailwind CSS 4 a través de `@tailwindcss/vite`.
- `astro-icon` con los sets `lucide`, `simple-icons` y `devicon-plain`.
- IBM Plex Sans (variable) e IBM Plex Mono autoalojadas en `public/fonts`.
- Playwright y `@axe-core/playwright` para pruebas end-to-end y de accesibilidad.
- `sharp`, `satori` y `@resvg/resvg-js` para los iconos y las imágenes Open Graph.
- TypeScript estricto.

## Requisitos y comandos

La versión de Node está en `.nvmrc`.

| Comando            | Para qué sirve                                                |
| ------------------ | ------------------------------------------------------------- |
| `npm ci`           | Instala las dependencias exactas del `package-lock.json`.     |
| `npm run dev`      | Arranca el servidor de desarrollo con recarga en caliente.    |
| `npm run build`    | Prepara los assets y genera el sitio estático en `dist/`.     |
| `npm run preview`  | Sirve `dist/` en local para comprobar el resultado del build. |
| `npm run check`    | Comprueba tipos y plantillas con `astro check`.               |
| `npm run qa`       | Ejecuta las comprobaciones de calidad sobre `dist/`.          |
| `npm run test:e2e` | Ejecuta la suite de Playwright.                               |
| `npm run cv:pdf`   | Regenera los dos PDF del currículum a partir de la página.    |
| `npm run format`   | Formatea el código con Prettier.                              |

En equipos sin Chromium instalado, las pruebas pueden ejecutarse sobre un
navegador del sistema con `PW_CHANNEL=msedge` o `PW_CHANNEL=chrome`.

## Estructura

```
.
├─ public/            # estáticos: robots, manifest, iconos, fuentes y PDF del CV
├─ scripts/           # preparación de assets, QA y generación de los PDF
├─ src/
│  ├─ assets/         # retrato original (manuel-cobos-solis.png)
│  ├─ components/     # componentes de la interfaz
│  ├─ content/work/   # casos y proyectos en Markdown (es/ y en/)
│  ├─ data/           # perfil, experiencia, formación, stack y navegación
│  ├─ i18n/           # textos de la interfaz y utilidades de idioma
│  ├─ layouts/        # plantilla base
│  ├─ lib/            # utilidades de SEO, JSON-LD, navegación y fechas
│  ├─ pages/          # rutas del sitio
│  └─ styles/         # tokens, componentes y estilos globales
└─ tests/e2e/         # pruebas Playwright
```

## Dónde se edita el contenido

- Perfil, correo, enlaces y textos de la ficha: `src/data/profile.ts`.
- Experiencia profesional: `src/data/experience.ts`.
- Formación y certificaciones: `src/data/education.ts`.
- Stack técnico: `src/data/stack.ts`.
- Textos de la interfaz en ambos idiomas: `src/i18n/ui.ts`.
- Retrato: `src/assets/manuel-cobos-solis.png`. El build genera a partir de él
  `public/images/manuel-cobos-solis.jpg` y los formatos derivados.

## Cómo añadir un proyecto o un caso de estudio

Crea un archivo en `src/content/work/es/` y su pareja en `src/content/work/en/`,
con el mismo `translationKey` y el nombre de archivo que quieras para la URL
(minúsculas, números y guiones). Ejemplo completo de frontmatter:

```markdown
---
# idioma del contenido: "es" | "en"
lang: es

# clave compartida por la pareja es/en
translationKey: my-project

# "case-study" (artículo técnico) | "project" (repositorio o demo)
kind: project

# título visible en la página
title: 'Mi proyecto'

# título para <title> y Open Graph, máximo 62 caracteres
seoTitle: 'Mi proyecto: descripción breve'

# meta description, entre 80 y 155 caracteres
description: 'Descripción de 80 a 155 caracteres que resume el proyecto para buscadores y previsualizaciones.'

# resumen de la lista de la portada, máximo 200 caracteres
summary: 'Resumen breve de una o dos frases para la tarjeta de la portada.'

# tecnologías, mínimo una
stack: ['Java', 'Spring Boot', 'Angular']

# fecha de publicación (AAAA-MM-DD)
publishedAt: 2026-10-05

# opcional: fecha de la última actualización
updatedAt: 2026-10-05

# solo para kind: project
links:
  repo: https://github.com/ManuelCobosDev/my-project
  demo: https://my-project.example.com

# opcional: "orchestrator" para dibujar el diagrama
# diagram: orchestrator

# orden en la lista (menor primero)
order: 1

# true oculta la entrada de la portada, las rutas, el sitemap y el JSON-LD
draft: false
---

# Contexto

Explica qué problema resuelve el proyecto.

## Qué hace

- Punto clave 1.
- Punto clave 2.

## Decisiones

- Decisión técnica y por qué.

## Resultado

Qué se consiguió.
```

El archivo en inglés repite la estructura con `lang: en`. Las dos entradas deben
compartir `translationKey`; si falta una de las dos, el build falla.

## Regenerar los PDF del currículum

`/cv/` y `/en/cv/` ofrecen la descarga de un PDF generado desde la versión de
impresión de esas páginas. Los PDF se guardan en `public/cv/` porque el build de
Cloudflare no ejecuta ningún navegador.

```bash
npm run cv:pdf
```

El comando construye el sitio, abre las dos páginas con Playwright, imprime a
PDF y comprueba que cada archivo empieza por `%PDF`, ocupa como máximo dos
páginas A4 y pesa menos de 300 KB. Hay que volver a ejecutarlo y confirmar los
dos archivos cada vez que cambie el contenido del currículum, su maquetación o
los estilos de impresión.

## Comprobaciones de calidad e integración continua

`npm run qa` revisa el HTML generado en `dist/`: títulos y descripciones,
canonical, hreflang recíproco, Open Graph, JSON-LD, imágenes con dimensiones,
enlaces internos, presupuestos de peso, sitemap, `robots.txt`, `manifest`,
`_headers`, la página 404 y un listado de datos personales críticos.

La suite de Playwright cubre el diseño, la accesibilidad, el comportamiento en
móvil, las cabeceras de seguridad, el idioma y los botones del currículum.

El flujo de trabajo `.github/workflows/ci.yml` ejecuta en cada push a `main` y
`development` y en cada pull request un único trabajo `verify` que instala
dependencias, comprueba tipos, construye el sitio, ejecuta `qa` y lanza las
pruebas end-to-end sobre Chromium.

## Despliegue en Cloudflare Pages

El sitio se publica con la integración de Git de Cloudflare Pages. En el panel:

- Rama de producción: `main`.
- Comando de build: `npm run build`.
- Directorio de salida: `dist`.
- Variable de entorno `NODE_VERSION` con el valor de `.nvmrc`.
- Dominio personalizado `manuelcobos.dev`, con `www` redirigido al dominio raíz.

Ajustes recomendados en el panel: Early Hints activado, Crawler Hints activado,
Rocket Loader desactivado, Email Address Obfuscation desactivado, Web Analytics
desactivado, rastreadores de modelos de lenguaje permitidos y el `robots.txt`
gestionado por Cloudflare desactivado (el sitio sirve el suyo).

Tras cada despliegue conviene comprobar las cabeceras:

```bash
curl -I https://manuelcobos.dev/
curl -I https://manuelcobos.dev/_astro/<archivo-hash>.css
curl -I https://manuelcobos.dev/cv/Manuel-Cobos-Solis-CV-ES.pdf
curl -I https://<proyecto>.pages.dev/
curl -I https://manuelcobos.dev/una-url-inexistente
```

Se espera: cabeceras de seguridad en `/`, `Cache-Control: public, max-age=31536000,
immutable` en un archivo de `/_astro/`, `Content-Type: application/pdf` en el PDF,
`X-Robots-Tag: noindex` en la dirección `pages.dev` y un 404 en la URL inexistente.
