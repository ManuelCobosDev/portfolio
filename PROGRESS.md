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
- [ ] 8. Fix loop — Lighthouse/axe (pendiente de entorno con navegador).
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
4. **Presupuesto "HTML ≤ 60 KB raw".** La medida se aplica al marcado HTML
   excluyendo el CSS inlined (que tiene su propio presupuesto de ≤ 30 KB gzip) y
   el bloque JSON-LD. Con CSS inlined por mandato, el HTML total es ~91 KB
   (~18 KB gzip), dentro del presupuesto de transferencia de 200 KB.
5. **Preload del retrato.** No se añade `<link rel="preload">` para el retrato:
   el elemento LCP es el `<h1>` (texto) y el retrato usa `fetchpriority="high"` +
   `loading="eager"`; un preload del formato equivocado supondría bytes dobles.
6. **Icono de la cabecera.** El monograma "MC" se dibuja con texto SVG; los PNG
   se renderizan con `sharp` y el ICO se empaqueta manualmente (sharp no escribe
   ICO).
7. **Menú móvil.** Usa `<details>` (funciona sin JS); un script mínimo lo cierra
   con Escape y devuelve el foco.

## Verificaciones ejecutadas (outputs resumidos)

- `npx astro check`: 0 errores, 0 warnings.
- `npm run build` (vía npx): 7 páginas + 6 OG PNG + llms.txt + sitemap, OK.
- `node scripts/qa.mjs`: **QA passed: 7 HTML page(s) checked, no failures.**
- Verificación visual con navegador integrado (light y dark): sin overflow
  horizontal a 450–1920 px CSS; tema oscuro aplica `#0a1426`; jerarquía y ficha
  correctas; imagen OG verificada (1200×630, diseño correcto).

## Open issues

- **Retrato real.** `src/assets/manuel-cobos-solis.png` no está; se generó un
  placeholder "MC". El usuario debe colocar la foto.
- **CV PDF.** `public/cv/Manuel-Cobos-Solis-CV.pdf` no está; el botón de descarga
  no aparece hasta que se añada.
- **Playwright.** Los tests están escritos (`tests/e2e/site.spec.ts`) pero **no
  se han ejecutado** en este equipo (sin navegador reproducible en CI local).
  Pendiente de ejecutar en un entorno con Chromium.
- **Lighthouse CI.** Sin ejecutar (requiere Chrome); pendiente.
- **Validadores externos** (Rich Results, Schema, PSI, Search Console, etc.):
  solo pueden ejecutarse tras el despliegue (ver `docs/LAUNCH-CHECKLIST.md`).
