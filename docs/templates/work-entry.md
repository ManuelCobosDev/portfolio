# Plantilla de entrada de trabajo / Work entry template

Copia este archivo a `src/content/work/es/` y `src/content/work/en/` (una vez por
idioma, con el mismo `translationKey`). Cámbiale el nombre al slug que quieras
para la URL (solo minúsculas, números y guiones, sin espacios).

Copy this file into `src/content/work/es/` and `src/content/work/en/` (one per
language, with the same `translationKey`). Rename it to the URL slug you want
(lowercase, digits and dashes only, no spaces).

```markdown
---
# idioma del contenido / language of the content: "es" | "en"
lang: es

# clave compartida por la pareja es/en / key shared by the es/en pair
translationKey: my-project

# "case-study" (artículo técnico) | "project" (repositorio/demo)
kind: project

# título visible en la página / visible page title
title: "Mi proyecto"

# título para <title> y OG, máximo 62 caracteres / <title> and OG title, max 62 chars
seoTitle: "Mi proyecto: descripción breve"

# meta description, entre 80 y 155 caracteres / between 80 and 155 characters
description: "Descripción de 80 a 155 caracteres que resume el proyecto para buscadores y previsualizaciones."

# resumen en la lista de la home, máximo 200 caracteres / home list summary, max 200 chars
summary: "Resumen breve de una o dos frases para la tarjeta de la página de inicio."

# tecnologías, mínimo 1 / technologies, at least 1
stack: ["Java", "Spring Boot", "Angular"]

# fecha de publicación / publication date (YYYY-MM-DD)
publishedAt: 2026-10-05

# opcional / optional: fecha de última actualización
updatedAt: 2026-10-05

# SOLO para kind: project / ONLY for kind: project
links:
  repo: https://github.com/ManuelCobosDev/my-project
  demo: https://my-project.example.com

# opcional / optional: "orchestrator" (diagrama) — déjalo fuera si no aplica
# diagram: orchestrator

# orden en la lista (menor primero) / list order (lower first)
order: 1

# true = no se publica / not published
draft: false
---

# Contexto / Context

Explica qué problema resuelve el proyecto.

## Qué hace / What it does

- Punto clave 1.
- Punto clave 2.

## Decisiones / Decisions

- Decisión técnica y por qué.

## Resultado / Outcome

Qué se consiguió.
```

## Reglas / Rules

- `lang` debe coincidir con la carpeta (`es/` o `en/`).
- La pareja es/en debe compartir el mismo `translationKey`; si falta una de las
  dos, el build falla.
- `draft: true` oculta la entrada de la home, rutas, sitemap y JSON-LD.
- Para `kind: project` los enlaces `repo` y `demo` aparecen como botones y el
  JSON-LD es `SoftwareSourceCode`; para `case-study` es `TechArticle`.
