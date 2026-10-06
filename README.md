# manuelcobos.dev

Sitio web personal de **Manuel Cobos Solís**: portafolio bilingüe (español como
idioma principal, inglés como secundario), 100 % estático, construido con
**Astro 5** y **Tailwind CSS v4**. Optimizado para buscadores y asistentes LLM:
HTML servido completo, JSON-LD (`schema.org`), `sitemap`, `hreflang`, Open Graph
y métricas Lighthouse objetivo de 10/10.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run check` | Type-check con `astro check` |
| `npm run build` | Genera assets, comprueba tipos y compila a `dist/` |
| `npm run preview` | Sirve la versión compilada (para medir en producción) |
| `npm run qa` | Puertas de calidad (QA) sobre `dist/` |
| `npm run test:e2e` | Tests Playwright (requiere navegador) |
| `npm run verify` | `build` + `qa` + `test:e2e` |
| `npm run format` | Formatea con Prettier |

> Requiere Node ≥ 22 (`nvm use`). En entornos sin instalación, usar los binarios
> portables de `../tools/` (ver `../tools/README.md`).

## Estructura

```
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml                   # build, QA, e2e, Lighthouse y audit
│  │  ├─ codeql.yml               # análisis de seguridad
│  │  └─ deploy.yml               # despliegue a GitHub Pages + smoke test
│  └─ dependabot.yml
├─ docs/
│  ├─ BRIEF.md                    # especificación completa (fuente de verdad)
│  ├─ AUDIT-REPORT.md             # informe de la auditoría post-build
│  ├─ SEO-PLAN.md                 # plan 30/60/90 días
│  ├─ SERP-BENCHMARK.md           # plantilla de benchmark de búsquedas
│  ├─ LAUNCH-CHECKLIST.md         # pasos posteriores al despliegue
│  └─ templates/work-entry.md     # plantilla para añadir proyectos
├─ public/                        # robots, llms, _headers, iconos, fuentes
├─ scripts/
│  ├─ prepare-assets.mjs          # fonts + retrato + iconos (falla en CI sin retrato)
│  ├─ facts.mjs + ../docs/facts.json  # verificación de datos personales (M2)
│  ├─ qa.mjs                      # puertas de calidad sobre dist/
│  └─ smoke.mjs                   # smoke test post-despliegue
├─ src/
│  ├─ assets/manuel-cobos-solis.png   # retrato real (938×936)
│  ├─ components/                 # componentes de UI
│  ├─ content/work/{es,en}/       # casos de estudio y proyectos (Markdown)
│  ├─ data/                       # hechos y copy tipado (ES/EN)
│  ├─ i18n/                       # utilidades y diccionario de UI
│  ├─ layouts/BaseLayout.astro    # <html>, head, header, footer
│  ├─ lib/                        # site, jsonld, years, cv
│  ├─ pages/                      # rutas ES, EN, 404, OG, llms.txt
│  └─ styles/global.css           # tokens, tipografía, motion, print
└─ tests/e2e/{site,audit}.spec.ts # Playwright + axe
```

## Dónde se edita cada cosa

| Qué | Archivo |
|---|---|
| Nombre, rol, email, enlaces, empresa, ubicación | `src/data/profile.ts` |
| Puestos y bullets de experiencia | `src/data/experience.ts` |
| Stack (núcleo e grupos) | `src/data/stack.ts` |
| Formación y certificaciones | `src/data/education.ts` |
| Textos de UI (botones, nav, footer, 404) | `src/i18n/ui.ts` |
| Párrafos de "Sobre mí" | `src/components/About.astro` |
| Textos de contacto | `src/components/Contact.astro` |
| CV (perfil, encabezado) | `src/components/pages/CvPage.astro` |
| Casos de estudio / proyectos | `src/content/work/{es,en}/*.md` |
| Colores y tipografía | `src/styles/global.css` |
| Configuración de Astro / sitemap / iconos | `astro.config.mjs` |

## Añadir un proyecto o caso de estudio

1. Copia `docs/templates/work-entry.md` a `src/content/work/es/` **y**
   `src/content/work/en/`, rellena el frontmatter (mismo `translationKey`) y
   el cuerpo.
2. Ejecuta `npm run build` (falla si una entrada no tiene pareja en el otro
   idioma).
3. Haz commit. La entrada aparece en la home, en el sitemap, en `llms.txt` y en
   el JSON-LD automáticamente.

## Actualizar la fecha de "última actualización"

Cada vez que cambie el contenido, sube `lastUpdated` en `src/data/profile.ts`.
Ese valor alimenta `dateModified` del JSON-LD, el `lastmod` del sitemap y la
fecha del pie de página.

## Añadir el CV en PDF

Coloca el archivo en `public/cv/Manuel-Cobos-Solis-CV.pdf`. El botón
"Descargar PDF" de las páginas `/cv/` y `/en/cv/` aparece automáticamente si el
archivo existe en el momento del build.

## Variables de verificación de buscadores

Define las variables de entorno antes de construir (solo si tienes los códigos):

```powershell
$env:PUBLIC_GSC_VERIFICATION = "tu-codigo-de-google"
$env:PUBLIC_BING_VERIFICATION = "tu-codigo-de-bing"
```

Se renderizan como `<meta name="google-site-verification">` y
`<meta name="msvalidate.01">` solo cuando existen.

## Rebuild mensual

El workflow de GitHub Actions incluye un `schedule` mensual (`0 6 1 * *`) que
reconstruye y redespliega el sitio para mantener frescos los valores calculados
(como los años de experiencia y la fecha del pie).

## Retrato

La foto real vive en `src/assets/manuel-cobos-solis.png` (938×936). **En
producción (`CI=true`, que es lo que usa el workflow) el build falla si el
retrato no está**, para no publicar nunca el placeholder. Solo en local, si
falta, se genera un cuadrado neutro con "MC" y se emite un aviso.

## Flujo de trabajo (ramas y CI)

- `main`: producción. Protegida; despliega a GitHub Pages.
- `development`: integración. El trabajo llega por ramas cortas
  `feat/*`, `fix/*`, `chore/*` y se fusiona aquí.
- Release: pull request `development` → `main` cuando la CI está en verde; tag
  `vX.Y.Z`.

Workflows: `ci.yml` (build + QA + e2e + Lighthouse + audit) se ejecuta en PRs y
en `push` a `development`; `deploy.yml` despliega desde `main` (con smoke test
posterior); `codeql.yml` analiza seguridad; `dependabot.yml` agrupa
actualizaciones semanales.

## Cómo ejecutar la auditoría

```powershell
npm run build                 # genera dist/ (usa el retrato real)
npm run qa                    # QA: SEO, JSON-LD, hechos, presupuestos, favicon…
npm run preview               # sirve dist/ en http://localhost:4321
# en otra consola, con Edge disponible:
$env:PW_CHANNEL = 'msedge'; npm run test:e2e
$env:CHROME_PATH = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'; npm run lighthouse
node scripts/smoke.mjs https://manuelcobos.dev   # tras desplegar
```
