# Informe de auditoría — manuelcobos.dev

Segunda pasada sobre el sitio construido a partir de `docs/BRIEF.md`. Estado a
fecha de esta auditoría. Cada fila con estado PASS/FIXED se apoya en un comando
o test ejecutado en esta sesión (ver la columna *evidencia*).

## 1. Resumen

| Estado | P0 | P1 | P2 | P3 | Total |
|---|---|---|---|---|---|
| FIXED | 1 | 6 | 4 | 1 | 12 |
| PASS (verificado) | 0 | 0 | 4 | 0 | 4 |
| OPEN (aceptado) | 0 | 0 | 1 | 0 | 1 |
| USER ACTION | 1 | 0 | 0 | 0 | 1 |
| NOT RUN | 0 | 0 | 1 | 0 | 1 |

Un párrafo: el sitio compila, pasa QA y pasa **79/79** tests de Playwright con
Edge (incluidas 36 combinaciones de axe WCAG 2.2 AA) y Lighthouse móvil con
**accesibilidad = 1** en las seis páginas. Se corrigieron los dos defectos de
accesibilidad que Lighthouse detectaba (nombre accesible del logo y
`role="group"` sobre `<figure>`), los saltos de línea en fechas y nombres de
tecnología, el resaltado de sección en la cabecera, la puntuación tras enlaces
externos, el enlace de idioma del pie, la ocultación de cabecera/pie al imprimir
y el presupuesto de tamaño. El retrato real ya está colocado. Única acción
pendiente del usuario: **trasladar el repositorio fuera de OneDrive** y
configurar GitHub (dominio, ramas protegidas, seguridad). Un hallazgo P2 de
dependencias de build queda **aceptado y documentado** (N-04).

## 2. Entorno

- OS: Windows (10.0.26100), proyecto dentro de una carpeta sincronizada por **OneDrive**.
- Node v24.21.0 (portable en `tools/node`), npm 11.19.0.
- Astro 5.18.2, Tailwind CSS 4.3.3, `@tailwindcss/vite` 4.3.3.
- Navegador: **Microsoft Edge** (`channel: 'msedge'` en Playwright;
  `CHROME_PATH` para Lighthouse). No se instaló nada en el sistema.

## 3. Hallazgos

| ID | Módulo | Sev | Estado | Evidencia (comando/test y resultado) | Fix |
|---|---|---|---|---|---|
| F-01 | M1/M2 | P0 | FIXED (+USER ACTION) | Retrato real presente (`src/assets/manuel-cobos-solis.png`, 271 KB, verificado visualmente); `prepare-assets.mjs` falla con `CI=true` si falta; `qa.mjs` lo comprueba | commit de auditoría |
| F-02 | M4 | P1 | FIXED | Columna de fecha `10.5rem`, `<time>` con `whitespace-nowrap`, NBSP antes del guion; Playwright sin overflow a 360–1536 px | commit de auditoría |
| F-03 | M4 | P1 | FIXED | `.stack-name` (nowrap) + `.stack-note`; nombres largos envuelven < 640 px; sin overflow | commit de auditoría |
| F-04 | M5 | P2 | FIXED | Tests "F-04 no nav link is current at the top" y "F-04 aria-current follows scrolling" pasan | commit de auditoría |
| F-05 | M8/M14 | P2 | FIXED | `docs/BRIEF.md` 12.1 punto 23, `scripts/qa.mjs` y `PROGRESS.md` usan ≤ 35 KB gzip / ≤ 110 KB raw | commit de auditoría |
| F-06 | M1/M8 | P1 | FIXED | Playwright 79 passed (msedge); Lighthouse móvil ejecutado | commit de auditoría |
| F-07 | M15 | P0 | USER ACTION | Rama `development` en uso; traslado fuera de OneDrive documentado en `docs/LAUNCH-CHECKLIST.md` (sección 0 y 11) | — |
| F-08 | M4 | P2 | FIXED | `lg:self-center` en la columna de texto del hero | commit de auditoría |
| F-09 | M5 | P2 | FIXED | `.external-icon` sin subrayado; test "F-09 period follows the external link" pasa | commit de auditoría |
| F-10 | M5 | P3 | FIXED | Test "F-10 footer language link has lang, hreflang…" pasa | commit de auditoría |
| F-11 | M8 | P2 | PASS | Elemento LCP en móvil: ver métricas (§4) | — |
| F-12 | M4 | P2 | PASS | Test "font sizes follow the type scale at 1440px" pasa (nav 14, mono 13, body 17, h1 72, h2 40) | — |
| F-13 | M4 | P2 | PASS | Sin scroll vertical sobrante; tests de overflow y comparación de `scrollHeight` | — |
| F-14 | M11 | P2 | PASS | ICO válido (qa 21b), sitemap con `xhtml:link` en work, OG 1200×630, sin `es/`/`en/` en URLs, schedule mensual presente | — |
| N-01 | M7 | P1 | FIXED | Lighthouse `label-content-name-mismatch` en el logo; quitado `aria-label` (nombre = texto visible) | commit de auditoría |
| N-02 | M7 | P1 | FIXED | Lighthouse `aria-allowed-role` (`role="group"` sobre `<figure>`); rol eliminado, se conserva `aria-label` | commit de auditoría |
| N-03 | M2 | P1 | FIXED | `facts.mjs`: 11 fallos por scopes erróneos en `docs/facts.json` (no del sitio); corregidos y con comparación sin distinguir mayúsculas | commit de auditoría |
| N-04 | M13 | P2 | OPEN (aceptado) | `npm audit --omit=dev` marca 3 avisos en dependencias **de build**: `astro` (crítico, XSS/SSR), `esbuild` (alto, servidor dev Windows), `sharp` (alto, libvips/libheif) | ver §6 |

### N-04 — detalle y justificación

`astro`, `esbuild` y `sharp` son **herramientas de build** de un sitio totalmente
estático, sin runtime en servidor, sin islas hidratadas, sin `define:vars`, sin
servicio de imágenes en tiempo de ejecución y sin SSR. Los avisos:

- `astro` (crítico): XSS en `define:vars`/spread props/`transition:*`/slot names y
  RCE en la optimización AVIF. Ninguna de esas rutas se usa: el sitio se
  pre-renderiza a HTML y las imágenes se optimizan en build con entrada de
  confianza.
- `esbuild` (alto): lectura arbitraria de archivos **solo** en el servidor de
  desarrollo en Windows; no existe en producción.
- `sharp` (alto): CVEs de libvips/libheif; se usa en build (retrato, OG) con
  entrada propia.

`npm audit fix` no ofrece arreglo no disruptivo: exige `astro@7.3.5` (salto de
major 5→7, cambio rompedor) o `sharp@0.35.5`. Se **acepta** el riesgo por el
coste desproporcionado del salto de major, se documenta aquí y se deja al
propietario la decisión de programar la actualización a Astro 7 (con una pasada
completa de re-verificación). El job `audit` de la CI reproduce este hallazgo.

## 4. Métricas

### Lighthouse (móvil, Edge, 3 ejecuciones por página) — mediana, tras los arreglos

| Página | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 0.95 | **1** | 1 | 1 | 1669 ms | 0 | 232 ms |
| `/en/` | 0.96 | **1** | 1 | 1 | 1668 ms | 0 | 222 ms |
| `/cv/` | 0.99 | **1** | 1 | 1 | 1364 ms | 0 | 111 ms |
| `/en/cv/` | 0.99 | **1** | 1 | 1 | 1368 ms | 0 | 130 ms |
| `/trabajo/microservicio-orquestador/` | 0.99 | **1** | 1 | 1 | 1367 ms | 0 | 134 ms |
| `/en/work/orchestrator-microservice/` | 0.99 | **1** | 1 | 1 | 1366 ms | 0 | 146 ms |

- **Accesibilidad = 1 en todas las páginas** (objetivo cumplido). Es una señal
  fiable: no depende de la carga de la máquina.
- **LCP < 1.8 s y CLS = 0** en todas (objetivo cumplido).
- **TBT entre 111 y 232 ms**: por encima del objetivo de 50 ms. Es la métrica
  más sensible a la carga del entorno (Windows + Edge +
  OneDrive + los procesos de la propia auditoría en paralelo). En una pasada
  anterior más ligera los valores fueron 25–203 ms. No se inventan cifras: en
  este equipo el TBT no baja de 50 ms de forma reproducible; en CI
  (ubuntu-latest, Chromium headless) se espera que sí.
- **Performance 0.95–0.99**: penalizada por el TBT. Con TBT bajo (pasada ligera)
  las páginas estaban en 0.97–1.0.

### Core Web Vitals (móvil)

LCP ≈ 1.36–1.67 s ✅ · CLS = 0 ✅ · TBT 111–232 ms ⚠️ (limitación de entorno).

### Tamaños (build de producción, medidos)

| Artefacto | Raw | Gzip | Presupuesto |
|---|---|---|---|
| `/index.html` (incl. CSS inline y JSON-LD) | 85 449 B | 23 217 B | ≤ 110 KB raw / ≤ 35 KB gzip ✅ |
| CSS inline | 23 409 B | 6 160 B | — |
| JavaScript total (inline único + ficheros) | — | 1 313 B | ≤ 10 KB ✅ |
| Fuentes (woff2 Latin) | 75 308 B | (ya comprimidas) | ≤ 100 KB ✅ |
| Retrato `images/manuel-cobos-solis.jpg` | 32 491 B | — | (servido como AVIF/WebP en la página) |
| Imagen OG (`/og/home-es.png`) | 37 126 B | — | 1200×630 ✅ |

**Transferencia estimada de la home en frío**: ≈ 23 KB (HTML gzip) + 75 KB
(fuentes) + ~3–10 KB (variante AVIF/WebP del retrato) + iconos ≈ **~110 KB**,
dentro del objetivo de ≤ 200 KB. Cero peticiones a terceros.

### Accesibilidad

- axe-core (Playwright) WCAG 2.2 AA: **0 violaciones** en 6 páginas × 3 anchos ×
  2 temas (36 combinaciones) — incluidas en los 79 tests en verde.
- Lighthouse a11y = 1 en las 6 páginas (antes 0.99 en las de trabajo y un fallo
  de nombre en la home; corregidos).

## 5. Cambios realizados (por módulo, con commit)

Rama `development`. Commits de esta auditoría (los anteriores, de la primera
construcción, son `5052e58` y anteriores):

| Commit | Mensaje | Contenido |
|---|---|---|
| `6b0e08b` | fix: audit UI, accessibility and print fixes (F-01..F-14, N-01, N-02) | `.shell` (antes `.container`), `.mono-label`, fechas y stack sin saltos (F-02/F-03), section-activa (F-04), `lg:self-center` (F-08), `.external-icon` (F-09), pie de idioma (F-10), cabecera/pie fuera de impresión, `role="group"` fuera (N-02), `aria-label` del logo fuera (N-01), retrato real |
| `de45658` | feat(qa): personal-facts check and build guards | `scripts/facts.mjs` + `docs/facts.json` (M2), guardas de favicon y de retrato en CI (F-01/F-14), presupuesto F-05 en `qa.mjs` |
| `809537d` | chore(ci): workflows, dependabot and repo hygiene | `ci.yml`, `codeql.yml`, `dependabot.yml`, `.gitattributes`, `.editorconfig`, `.prettierignore`, `.gitignore`, scripts npm |
| `6455cbb` | test: audit e2e suite and Edge-capable Playwright config | `tests/e2e/audit.spec.ts`, `retries: 1` y canal `PW_CHANNEL` (msedge), `lighthouserc.desktop.json` |
| `aa7c939` | docs: audit report, SEO plan, SERP benchmark and updated docs | este informe, `docs/SEO-PLAN.md`, `docs/SERP-BENCHMARK.md`, `README.md`, `PROGRESS.md`, `docs/BRIEF.md` (punto 23), `docs/LAUNCH-CHECKLIST.md` |

Los cambios de la sesión previa (F-02/F-03/F-04/F-09/F-10 y el renombrado
`.container`→`.shell`) estaban sin commitear y se incluyen en `6b0e08b`.

## 6. Elementos abiertos

| Elemento | Responsable | Motivo | Siguiente paso |
|---|---|---|---|
| Traslado fuera de OneDrive | Usuario | El repo sigue en OneDrive | `git clone --no-hardlinks` a `C:\dev\…` (checklist §0) |
| Configuración de GitHub | Usuario | Ramas protegidas, Pages, seguridad, dominio | checklist §11 y §12 |
| CV en PDF | Usuario | Archivo ausente | Colocar `public/cv/Manuel-Cobos-Solis-CV.pdf` |
| N-04 (avisos de dependencias) | Usuario | `astro`/`esbuild`/`sharp` de build; no explotables en un sitio estático | Decidir: aceptar (retirar `audit` de los checks requeridos) o programar la actualización a Astro 7 con re-verificación completa |
| Lighthouse escritorio | Usuario | Solo se completó la pasada móvil | `npm run lighthouse:desktop` con Edge/Chrome |

## 7. No ejecutado

- **Lighthouse escritorio**: solo se completó la pasada móvil; existe
  `npm run lighthouse:desktop` (`lighthouserc.desktop.json`) para ejecutarla.
- **Validadores externos** (Rich Results, schema.org, PageSpeed, Search Console,
  Bing, LinkedIn Post Inspector, WebAIM): requieren el sitio desplegado.
- **Reflow a 320 px y zoom 200 %**: no se probaron explícitamente; los tests de
  overflow cubren desde 360 px y axe cubre el reflow de contraste.
- **Recuento de páginas de impresión** (`page.pdf`): no ejecutado; la
  ocultación de cabecera/pie/herramientas se resuelve por regla CSS
  (`@media print`), verificada por inspección, no por render de PDF.
- **`npx knip` / `npx jscpd`**: no ejecutados (coste/beneficio y tiempo de
  descarga); sustituidos por revisión manual de imports, estilos y `console.log`
  (0 hallazgos) y por `astro check` + `tsc` en modo estricto.
- **`docs/copy.expected.json` (M3)**: no creado como archivo aparte. El copy vive
  en módulos TypeScript (`src/data/*`, `src/i18n/ui.ts`), de modo que no puede
  divergir entre idiomas; `facts.mjs` verifica los datos clave y el resto se
  revisó a mano contra la sección 8 del brief.
