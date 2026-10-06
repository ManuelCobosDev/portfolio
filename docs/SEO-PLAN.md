# Plan SEO 30 / 60 / 90 días

Objetivo realista: posicionar en búsquedas de **marca** ("Manuel Cobos Solís" y
variantes) y "nombre + rol + lugar", y ser citado correctamente por asistentes
LLM. El sitio ya cubre la parte on-page (entity clarity, JSON-LD, sitemap,
`hreflang`, `llms.txt`). Lo que falta son señales externas que dependen del
propietario.

## Día 0 (lanzamiento)

- Desplegar en GitHub Pages con el dominio `manuelcobos.dev` (ver
  `docs/LAUNCH-CHECKLIST.md`).
- Alta en **Google Search Console** (propiedad de dominio por TXT) y envío de
  `https://manuelcobos.dev/sitemap-index.xml`.
- Alta en **Bing Webmaster Tools** (importar desde GSC) y envío del sitemap.
- **Request indexing** de `/`, `/en/`, `/cv/` y el caso de estudio.
- Comprobar con Rich Results Test y con el validador de schema.org que el
  JSON-LD es válido.

## Días 1–30: consistencia de identidad y primer contenido

- Unificar el nombre exacto **"Manuel Cobos Solís"** y los mismos dos enlaces
  (LinkedIn, GitHub) en: campo "Website" y bio de GitHub, "Contact info →
  Website" y About de LinkedIn, README del perfil de GitHub, y perfiles de
  certificaciones (MuleSoft, LPI, Anthropic) si permiten web.
- Hacer **público** el repositorio del sitio con un README que enlace a
  `https://manuelcobos.dev/`.
- Publicar el **primer artículo técnico** (uno al mes) sobre trabajo real, por
  ejemplo el patrón orquestador del caso de estudio.
- Tras cada cambio de contenido, subir `lastUpdated` y volver a pedir indexación.
- Revisar en GSC: cobertura (páginas indexadas) y consultas.

## Días 31–60: profundidad

- Segundo y tercer artículo técnico (mensajería con Kafka/RabbitMQ, o
  migraciones de Angular 15→20).
- Enlazar desde cada artículo al proyecto o caso de estudio correspondiente.
- Revisar en GSC las consultas emergentes y ajustar títulos/descripciones solo
  si no se salen del brief.
- Comprobar Core Web Vitals en GSC (datos de campo) y comparar con las métricas
  de laboratorio de `docs/AUDIT-REPORT.md`.

## Días 61–90: consolidación

- Revisión mensual (día 1, el workflow reconstruye con fecha fresca):
  consultas, páginas y Core Web Vitals.
- Cuarto artículo técnico.
- Valorar charlas o perfiles de comunidad (cada uno aporta una señal externa
  independiente).
- **No** usar esquemas de enlaces, directorios de pago ni enlaces comprados.

## Qué NO hace el sitio por sí solo

El ranking para la marca depende de que los perfiles (LinkedIn, GitHub) y otros
contenidos apunten al dominio con el nombre exacto. El sitio maximiza la
claridad de entidad; las señales off-page las crea el propietario.
