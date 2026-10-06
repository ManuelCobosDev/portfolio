# PROGRESS

Estado del proyecto **manuelcobos.dev** frente a la especificación de
`docs/BRIEF.md`.

## Fases

- [x] 0. Bootstrap — proyecto Astro 5 + Tailwind v4, dependencias, estructura, config.
- [x] 1. Foundation — estilos base, `BaseLayout`, header/nav/lang/theme/footer.
- [x] 2. Data y home — datos tipados y home completa ES/EN.
- [x] 3. Work — colección `work`, caso de estudio bilingüe, diagrama, plantilla.
- [x] 4. CV — páginas `/cv/` y `/en/cv/` con estilos de impresión.
- [x] 5. SEO — `Seo`, JSON-LD, sitemap, robots, llms.txt, OG, iconos, manifest, 404, `_headers`.
- [x] 6. Motion — rise-in, scroll reveal, hovers, active-section, view transitions.
- [x] 7. Test tooling — `scripts/qa.mjs`, tests Playwright, `lighthouserc.json`, `playwright.config.ts`.
- [x] 8. Fix loop — Playwright 79/79 (Edge) + Lighthouse móvil ejecutados (ver `docs/AUDIT-REPORT.md`).
- [x] 9. Docs y entrega — `README.md`, `docs/LAUNCH-CHECKLIST.md`, `deploy.yml`.

## Entorno

- Node portable v24.21.0 + npm 11.19.0 (`../tools/node/`).
- `npm.ps1` está bloqueado por la política de ejecución; se usa `npm.cmd` / `npx.cmd`.
- Astro 5.18.2, Tailwind CSS 4.3.3, `@tailwindcss/vite` 4.3.3.
- Git 2.45.1.

## Decisiones

1. **Fonts Latin autoalojadas.** En lugar de importar los CSS de Fontsource
   (que traen todos los subsets), `prepare-assets.mjs` copia solo los `woff2`
   Latin a `public/fonts/` y `global.css` declara `@font-face` manuales. Esto
   permite preloads estables y cumple el presupuesto de ≤ 100 KB (75 KB reales).
2. **Slug de contenido.** El loader `glob` incluye la subcarpeta en `entry.id`
   (`es/…`, `en/…`); se usa `slugFromId()` (basename) para las URLs.
3. **Alternates del sitemap.** Las páginas `/trabajo/[slug]` y `/en/work/[slug]`
   no son detectadas por el i18n automático de `@astrojs/sitemap`; se añaden los
   `xhtml:link` y el `lastmod` con el hook `serialize`.
4. **Presupuesto (decisión F-05 de la auditoría).** El presupuesto que importa es
   el tamaño **transferido**: el documento por página (HTML **incluyendo** el CSS
   inlined y el JSON-LD) debe ser ≤ 35 KB gzip y ≤ 110 KB raw como tope de
   cordura. Sustituye al anterior "HTML ≤ 60 KB raw" y se aplica en
   `docs/BRIEF.md` (12.1, punto 23) y en `scripts/qa.mjs`.
5. **Preload del retrato.** No se añade `<link rel="preload">` para el retrato:
   el elemento LCP es el `<h1>` (texto) y el retrato usa `fetchpriority="high"` +
   `loading="eager"`; un preload del formato equivocado supondría bytes dobles.
6. **Icono de la cabecera.** El monograma "MC" se dibuja con texto SVG; los PNG
   se renderizan con `sharp` y el ICO se empaqueta manualmente (sharp no escribe
   ICO).
7. **Menú móvil.** Usa `<details>` (funciona sin JS); un script mínimo lo cierra
   con Escape y devuelve el foco.
8. **`.container` → `.shell`.** El contenedor propio se renombró a `.shell` para
   no colisionar con la utilidad `container` de Tailwind (cuyos max-widths por
   breakpoint ganarían a un `@layer components`).
9. **Reintento en Playwright.** `retries: 1` absorbe fallos esporádicos de
   navegación `net::ERR_ABORTED` por contención del servidor con 8 workers; no
   relaja ninguna aserción.
10. **Sin `role="group"` en el diagrama.** Lighthouse marcó `aria-allowed-role`
    (rol `group` no permitido sobre `<figure>`); se eliminó el rol y se conservó
    `aria-label` + `<figcaption>`.
11. **Nombre del logo.** Se quitó el `aria-label` del enlace del logo: el nombre
    accesible pasa a ser el texto visible ("MC Manuel Cobos Solís"), lo que
    satisface `label-content-name-mismatch` y mejora el control por voz.

## Verificaciones ejecutadas (outputs resumidos)

- `npm run check` (`astro check`): 0 errores, 0 warnings.
- `npm run build`: 7 páginas + 6 OG PNG + llms.txt + sitemap, OK (retrato real incluido).
- `node scripts/qa.mjs`: **QA passed: 7 HTML page(s) checked, no failures** (incluye `facts.mjs`).
- `npx playwright test` con `PW_CHANNEL=msedge`: **79 passed** (incluye 36 combinaciones
  axe WCAG 2.2 AA a 360/768/1440 px en claro y oscuro).
- Lighthouse móvil (Edge, 3 ejecuciones por página, ver `docs/AUDIT-REPORT.md`).
- Verificación visual con navegador integrado (light y dark) y screenshots.

## Open issues

- **CV PDF.** `public/cv/Manuel-Cobos-Solis-CV.pdf` no está; el botón de descarga
  no aparece hasta que se añada (comportamiento correcto, sin acción urgente).
- **Lighthouse desktop.** Pendiente de una pasada completa (solo se completó la de móvil).
- **Traslado fuera de OneDrive.** Repositorio y `node_modules` siguen dentro de
  OneDrive; hay que clonarlo a una ruta no sincronizada (ver `docs/LAUNCH-CHECKLIST.md`).
- **Validadores externos** (Rich Results, Schema, PSI, Search Console, etc.):
  solo pueden ejecutarse tras el despliegue (ver `docs/LAUNCH-CHECKLIST.md`).
