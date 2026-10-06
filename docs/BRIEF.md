# MASTER BRIEF: manuelcobos.dev (Astro + Tailwind CSS)

> This document is the complete specification for building a personal portfolio website. Read it in full before writing any code. It is written for an autonomous coding agent. Everything you need is here: facts, copy, design tokens, SEO rules, quality gates, deployment. Where something is not specified, choose the simplest option consistent with this brief and record the decision in `PROGRESS.md`.

---

## 0. HOW TO WORK

### 0.1 Role

You are a senior front-end engineer with strong typographic and UX taste, and an SEO engineer's discipline. You work autonomously. The deliverable is a production-ready, fully static, bilingual (Spanish primary, English secondary) personal portfolio for a software developer, optimised so that search engines and LLM-based assistants can identify, understand and cite him.

### 0.2 Non-negotiable rules

1. **No invented facts.** The only facts you may state about the person are in section 2 and in the copy of section 8. No invented projects, metrics, clients, testimonials, quotes, awards, download counts, years, percentages, skill levels or "stats". If you need a fact that is not here, omit the element. Never write lorem ipsum, "coming soon", "under construction" or placeholder cards anywhere in the output.
2. **Zero questions.** Do not ask the user anything. Decide, then log the decision in `PROGRESS.md` under "Decisions".
3. **Persist the brief.** First action: save this entire document verbatim as `docs/BRIEF.md` in the repository. Before starting each phase, re-read the sections that phase references. Your context may be truncated in a long session; the file is the source of truth.
4. **Maintain `PROGRESS.md`** at the repo root: a checklist of the phases in section 14, a "Decisions" list, an "Open issues" list, and the last output of each verification command (summarised). Update it at the end of every phase.
5. **Evidence over claims.** Never write "done", "passes" or "verified" unless you ran the command in this session and read its output. If a check cannot be run (for example no browser is available), say so explicitly in `PROGRESS.md` instead of pretending.
6. **Do not trust your memory for library APIs.** Astro and Tailwind CSS v4 changed a lot. When unsure, read the installed package (`node_modules/<pkg>/README.md`, `.d.ts` files, `package.json` exports) or the official docs if you have web access (docs.astro.build, tailwindcss.com/docs). Run `npx astro check` and `npm run build` after every phase.
7. **Scope guard.** Build exactly what this brief describes. Do not add a blog, CMS, analytics, cookie banner, contact form backend, comments, newsletter, dark-pattern popups, chatbots, search box, or any feature not listed. Do not add UI frameworks (React, Vue, Svelte, Solid) or Astro islands (`client:*`). Do not add dependencies that are not listed in section 5.2 unless a listed one cannot do the job; if you add one, justify it in `PROGRESS.md`.
8. **Languages.** Code, comments, commit messages, file names and documentation are in English. Website copy is exactly as given in section 8 (Spanish and English).
9. **Commits.** Use git. Initialise the repo if needed. One commit per completed phase with a conventional message (`feat:`, `chore:`, `fix:`, `docs:`).
10. **Visual verification.** If you can view images, take screenshots with Playwright at the widths in section 6.9 in light and dark and inspect them. If you cannot view images, do not claim visual verification: rely on the programmatic checks in section 12 (including the horizontal-overflow test) and follow the layout rules in section 6 literally.

### 0.3 What the user will do

The user will place the portrait photo at `src/assets/manuel-cobos-solis.png` (938×936 PNG, a formal portrait on a light grey wall, dark blue suit, blue tie). If the file is missing when you start, create the code so that the build still succeeds (render a neutral square with the initials "MC" and log a warning), and list the missing file under "Open issues". The user will also supply `public/cv/Manuel-Cobos-Solis-CV.pdf` later; the CV page must show the download button only if that file exists at build time.

---

## 1. MISSION AND SUCCESS CRITERIA

Build **https://manuelcobos.dev**: a fast, accessible, bilingual personal portfolio that makes **Manuel Cobos Solís** easy to find and easy to understand, for human recruiters, search engines (Google, Bing, DuckDuckGo) and LLM assistants.

### 1.1 Measurable definition of "10/10"

| Area | Target |
|---|---|
| Lighthouse (mobile emulation, throttled, production build served locally) | Performance ≥ 98, Accessibility = 100, Best Practices = 100, SEO = 100 on `/`, `/en/`, `/cv/` and the case study page |
| Core Web Vitals (lab) | LCP < 1.8 s, CLS < 0.02, TBT < 50 ms |
| Transferred size, home, cold cache | ≤ 200 KB total including fonts and images, ≤ 14 requests |
| JavaScript shipped | ≤ 10 KB gzip total across the site, no framework runtime |
| Third-party requests | **Zero.** No Google Fonts, no CDN, no analytics, no embeds |
| Accessibility | WCAG 2.2 AA, keyboard-complete, screen-reader sensible, `prefers-reduced-motion` and `prefers-color-scheme` respected |
| Structured data | Valid schema.org JSON-LD that matches visible content exactly |
| Crawlability | Server-rendered static HTML contains all content (works with JavaScript disabled), valid `sitemap`, `robots.txt`, `hreflang`, canonical URLs |
| Build | `npm run build`, `npm run check` and `npm run qa` all pass with zero errors and zero warnings you can fix |
| Design | Looks like it was designed by a person with taste, not generated from a template. See section 6.2 (anti-patterns) |

### 1.2 Realistic SEO goal (so you optimise the right thing)

The goal is to rank first for **brand/entity queries** ("Manuel Cobos Solís", "Manuel Cobos desarrollador", "Manuel Cobos Solís Java") and for **name + role + place** combinations, and to be correctly summarised by LLM assistants. It is not realistic to outrank job boards for generic queries such as "desarrollador Java". Therefore: maximise **entity clarity and consistency** (one exact name string, same role strings, same links everywhere, structured data) rather than keyword stuffing.

---

## 2. FACTS (SINGLE SOURCE OF TRUTH)

Do not add to, embellish or contradict this list.

| Field | Value |
|---|---|
| Full name | Manuel Cobos Solís (given name: Manuel; family name: Cobos Solís). Alternate names: "Manuel Cobos", "Manuel Cobos Solis" |
| Canonical site | https://manuelcobos.dev (apex, https, trailing slash on every URL) |
| Role (ES) | Desarrollador Full Stack con enfoque backend |
| Role (EN) | Backend-oriented Full Stack Developer |
| Location | Cáceres, Extremadura, España (city level only; never publish street address or phone) |
| Work mode | 100 % remote. Looks for roles at consultancies or companies with teams in Spain |
| Current employer | Viewnext (https://www.viewnext.com/), working for the client Banco Santander (banking sector). Team of about 5 people |
| Experience start | March 2024 |
| Email | manuel.cobos.dev@gmail.com (the old address `manuelcobos200324@gmail.com` is retired: it must not appear anywhere) |
| LinkedIn | https://www.linkedin.com/in/manuelcobos/ |
| GitHub | https://github.com/ManuelCobosDev (the old user `ManuelCobos24` is legacy: it must not appear anywhere) |
| Certifications page | https://www.linkedin.com/in/manuelcobos/details/certifications/ |
| Languages | Spanish (native), English (B2) |
| Projects | **None published yet.** No project may be mentioned. See section 4.3 for the dormant "projects" feature |

### 2.1 Experience (Viewnext, banking sector, client Banco Santander)

| Period | Title | Notes |
|---|---|---|
| July 2025 to present | Full Stack Developer | Angular 20 and Spring Boot, end-to-end features to production |
| November 2024 to June 2025 | Java Backend Developer | Microservices, REST APIs, messaging with Kafka and RabbitMQ |
| March 2024 to June 2024 | Integration Developer | MuleSoft Anypoint Platform and IBM Integration Bus |

### 2.2 Technical stack

- **Backend:** Java 17, Java 21, Spring Boot, Spring MVC, Spring Security, Spring Data JPA, Spring Batch, WebClient, Clean / Hexagonal Architecture, DDD, API-first (OpenAPI).
- **Frontend:** Angular 15 to 20 (full migrations from older versions up to 20), TypeScript, RxJS, Angular Material, Vitest, Karma.
- **Messaging and real time:** Apache Kafka, RabbitMQ, WebSockets, event-driven architecture.
- **Databases:** PostgreSQL; Oracle and SQL Server (queries, creating tables and data).
- **DevOps and quality:** Docker, Kubernetes, OpenShift, ArgoCD, GitHub Actions, Maven, SonarQube, Trivy, JUnit 5, Mockito.
- **Integration (earlier experience):** MuleSoft Anypoint Platform, IBM Integration Bus.
- **Additional knowledge (education and personal study, not professional):** MongoDB, Firebase.

### 2.3 Education and certifications

- Técnico Superior en Desarrollo de Aplicaciones Web (DAW), IES Ágora, 2024 to 2025.
- Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM), IES Ágora, 2022 to 2024.
- MuleSoft Certified Developer, Level 1 (MuleSoft).
- LPIC-1 Linux Administrator (Linux Professional Institute).
- Claude Code in Action (Anthropic).
- English B2.
- Verification of certifications: through LinkedIn (link above).

### 2.4 Things you must NOT claim

No seniority label ("junior", "mid", "senior") anywhere. No "years of experience" other than the computed value defined in section 8.3. No claims of leading teams, architecting systems alone, or uptime/performance numbers. No client names other than Viewnext and Banco Santander. No mention of Redis, observability tools, resilience patterns, or anything absent from section 2.

---

## 3. AUDIENCE, POSITIONING AND KEYWORD MAP

### 3.1 Audience

1. Recruiters and engineering managers at IT consultancies and product companies in Spain, who skim for 20 to 40 seconds on a phone or laptop.
2. Applicant-tracking and sourcing tools, search engines and LLM assistants that parse HTML and JSON-LD.

### 3.2 Positioning (one sentence, used consistently)

"Desarrollador Full Stack con enfoque backend: Java y Spring Boot en el servidor, Angular en el cliente, en entornos bancarios." (EN: "Backend-oriented Full Stack Developer: Java and Spring Boot on the server, Angular on the client, in banking environments.")

### 3.3 Keyword map (place naturally, never stuff)

| Search intent | Where it must appear in visible text and metadata |
|---|---|
| Manuel Cobos Solís | `<title>`, `<h1>`, meta description, JSON-LD `name`, footer, alt text of the portrait, OG image, `llms.txt` |
| Desarrollador Full Stack / Full Stack Developer | `<title>`, role line under h1, ficha "Rol", JSON-LD `jobTitle`, first paragraph of About |
| Java, Spring Boot, Kafka, RabbitMQ, Angular, TypeScript | meta description, hero intro, ficha "Stack principal", Stack section, experience bullets, JSON-LD `knowsAbout` |
| Cáceres, Extremadura, España, remoto | hero intro, ficha "Ubicación" and "Modalidad", JSON-LD `address`, contact section |
| Viewnext, Banco Santander, sector bancario | ficha "Empresa", About paragraph 2, experience header, JSON-LD `worksFor` |
| Microservicios, APIs REST, mensajería asíncrona | About paragraph 1, experience bullets, case study |

### 3.4 Entity consistency rules

- The exact string **"Manuel Cobos Solís"** (with the accent) is used for the name everywhere. Never "Manuel Cobos S." or "M. Cobos".
- Role strings are exactly the ones in sections 2 and 8. Do not invent variants such as "Software Engineer", "Ninja", "Rockstar", "Guru".
- The same two profile links (LinkedIn, GitHub) and the same email are used everywhere, in the same order: LinkedIn, GitHub, email.

---

## 4. INFORMATION ARCHITECTURE AND URLS

### 4.1 Pages

| Purpose | Spanish (default, no prefix) | English |
|---|---|---|
| Home (single long page) | `/` | `/en/` |
| Printable CV | `/cv/` | `/en/cv/` |
| Work entry (case study or project) | `/trabajo/<slug>/` | `/en/work/<slug>/` |
| Not found | `/404.html` (one bilingual file) | same file |

There are no index pages for work entries. The home page lists them.

### 4.2 Home sections, in this order, with localised anchor ids

| # | Section | ES id | EN id | Condition |
|---|---|---|---|---|
| – | Hero | (top) | (top) | always |
| 01 | Sobre mí / About me | `sobre-mi` | `about` | always |
| 02 | Experiencia / Experience | `experiencia` | `experience` | always |
| 03 | Stack técnico / Tech stack | `stack` | `stack` | always |
| 04 | Casos de estudio / Case studies | `casos` | `case-studies` | only if at least one published entry with `kind: case-study` exists in that language |
| 05 | Proyectos / Projects | `proyectos` | `projects` | only if at least one published entry with `kind: project` exists in that language |
| 06 | Formación y certificaciones / Education and certifications | `formacion` | `education` | always |
| 07 | Contacto / Contact | `contacto` | `contact` | always |

Section numbers shown in the UI are computed from the visible sections (01, 02, 03, …), so there are no gaps when a conditional section is hidden. The header navigation lists exactly the visible sections plus the CV link. A hidden section must produce no HTML, no nav entry, no sitemap entry and no JSON-LD.

### 4.3 The dormant "projects" feature

Manuel has no projects to show yet, but will add them. Build the machinery now so that adding a project is only a content change:

- Content collection `work` (schema in section 8.12) holds both `case-study` and `project` entries.
- At launch the collection contains exactly **one** entry per language, of kind `case-study` (section 8.12). There are **no** entries of kind `project`, so the "Proyectos / Projects" section does not render.
- Provide `docs/templates/work-entry.md` (outside `src/content`) as a template for a future project, with every frontmatter field documented in comments.
- Document in `README.md` the three steps to add a project: copy the template into `src/content/work/es/` and `src/content/work/en/`, fill it in, run `npm run build`.
- A project entry page adds repository and demo links when present, and its JSON-LD type is `SoftwareSourceCode` (with `codeRepository`) instead of `TechArticle`.


---

## 5. TECHNICAL ARCHITECTURE

### 5.1 Stack decisions (final)

- **Astro 5.x** (install `astro@^5`; use the latest 5.x release), `output: 'static'`. Pure `.astro` components, TypeScript strict. No UI framework, no islands, no client-side routing.
- **Tailwind CSS v4** through the Vite plugin: `tailwindcss@^4` and `@tailwindcss/vite@^4`, registered in `vite.plugins` of `astro.config.mjs`. Configuration is CSS-first (`@theme` in `src/styles/global.css`). **Do not** install `@astrojs/tailwind` (deprecated for v4). **Do not** create `tailwind.config.js`. The CSS entry starts with `@import "tailwindcss";`.
- **Node 22 LTS** (`.nvmrc` with `22`, `engines.node: ">=22"`), **npm** with a committed `package-lock.json`.
- **Fonts self-hosted** through Fontsource packages. **Icons inlined at build** with `astro-icon`.
- **Hosting target: GitHub Pages** via GitHub Actions with the custom domain `manuelcobos.dev` (see section 13). Everything must also work unchanged on any static host.

### 5.2 Dependencies (exhaustive list)

Runtime (`dependencies`): `astro`, `@astrojs/sitemap`, `tailwindcss`, `@tailwindcss/vite`, `astro-icon`, `@iconify-json/lucide`, `@iconify-json/simple-icons`, `@fontsource-variable/ibm-plex-sans` (if it does not exist, use `@fontsource/ibm-plex-sans` with weights 400, 500, 600), `@fontsource/ibm-plex-mono` (weights 400 and 500), `sharp`.

Development (`devDependencies`): `typescript`, `@astrojs/check`, `prettier`, `prettier-plugin-astro`, `prettier-plugin-tailwindcss`, `satori`, `@resvg/resvg-js`, `@fontsource/ibm-plex-sans` (only to read `.woff` files for OG images), `cheerio`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`.

Optional: `@capsizecss/metrics` (fallback-font metrics, section 6.4).

### 5.3 `package.json` scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "prepare:assets": "node scripts/prepare-assets.mjs",
    "check": "astro check",
    "build": "npm run prepare:assets && astro check && astro build",
    "preview": "astro preview",
    "qa": "node scripts/qa.mjs",
    "test:e2e": "playwright test",
    "lighthouse": "lhci autorun",
    "verify": "npm run build && npm run qa && npm run test:e2e",
    "format": "prettier --write ."
  }
}
```

### 5.4 Repository structure

```
/
├─ .github/workflows/deploy.yml
├─ docs/
│  ├─ BRIEF.md                    (this document, verbatim)
│  ├─ LAUNCH-CHECKLIST.md         (section 13.4)
│  └─ templates/work-entry.md
├─ public/
│  ├─ CNAME                       (content: manuelcobos.dev)
│  ├─ robots.txt
│  ├─ llms.txt
│  ├─ _headers                    (section 13.3)
│  ├─ favicon.svg  favicon.ico  apple-touch-icon.png  icon-192.png  icon-512.png
│  ├─ manifest.webmanifest
│  ├─ images/manuel-cobos-solis.jpg   (generated, 800×800, section 9.9)
│  └─ cv/                         (user adds Manuel-Cobos-Solis-CV.pdf later)
├─ scripts/
│  ├─ prepare-assets.mjs          (portrait → jpg for JSON-LD/OG; PNG icons from favicon.svg)
│  └─ qa.mjs                      (section 12)
├─ src/
│  ├─ assets/manuel-cobos-solis.png
│  ├─ components/                 (section 5.7)
│  ├─ content/work/{es,en}/*.md   (section 8.12)
│  ├─ content.config.ts
│  ├─ data/                       (section 5.6)
│  ├─ i18n/{ui.ts,utils.ts}
│  ├─ layouts/BaseLayout.astro
│  ├─ lib/{jsonld.ts,site.ts,years.ts}
│  ├─ pages/
│  │  ├─ index.astro  cv.astro  404.astro
│  │  ├─ trabajo/[slug].astro
│  │  ├─ en/{index.astro,cv.astro,work/[slug].astro}
│  │  └─ og/[...slug].png.ts
│  └─ styles/global.css
├─ tests/e2e/*.spec.ts
├─ astro.config.mjs  tsconfig.json  playwright.config.ts  lighthouserc.json
├─ .nvmrc  .prettierrc  .gitignore  README.md  PROGRESS.md
```

### 5.5 `astro.config.mjs` (use this as the base)

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://manuelcobos.dev',
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
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
```

Verify that every icon name above exists in its pack. If one does not (for example a brand icon was removed from Simple Icons), render that technology with its text label only. Never ship a broken or empty icon.

### 5.6 Data layer and i18n

All content lives in typed TypeScript modules so Spanish and English cannot drift apart.

```ts
// src/i18n/utils.ts
export type Lang = 'es' | 'en';
export type L<T> = { es: T; en: T };
export const pick = <T,>(v: L<T>, lang: Lang): T => v[lang];
```

Files in `src/data/`: `profile.ts` (facts of section 2, `lastUpdated: '2026-10-05'`, `experienceStart: '2024-03-01'`), `experience.ts`, `stack.ts`, `education.ts`, `nav.ts`. Every user-visible string is an `L<string>`. `src/i18n/ui.ts` holds the UI dictionary of section 8.1 as `L<...>`.

`src/lib/site.ts` exports `SITE = 'https://manuelcobos.dev'`, `absoluteUrl(path)`, and `getAlternates(page)` which returns the ES URL, the EN URL and the x-default URL (= the ES URL) for any page, using the `translationKey` for work entries. `src/lib/years.ts` exports `fullYearsSince(date, now = new Date())`.

Routing: Spanish pages at `src/pages/*`, English at `src/pages/en/*`. A shared page component per page type (`HomePage.astro`, `CvPage.astro`, `WorkPage.astro` in `src/components/pages/`) receives `lang` and renders everything, so the two language files are 5-line wrappers.

### 5.7 Components (one responsibility each)

`BaseLayout`, `Seo` (all head tags), `JsonLd`, `Header`, `NavMenu`, `LangSwitch`, `ThemeToggle`, `Footer`, `SkipLink`, `Hero`, `Ficha`, `SectionShell` (number, id, h2, sticky heading column), `About`, `Experience`, `StackCore`, `StackGroups`, `TechIcon`, `WorkList`, `WorkDiagram`, `Education`, `Contact`, `CopyEmail`, `Breadcrumbs`, `ExternalLink` (adds `target="_blank"`, `rel`, arrow icon and the visually hidden "opens in a new tab" text).

### 5.8 Rendering rules

- Everything the user or a crawler needs is in the static HTML. Client JavaScript is limited to four tiny scripts: theme init (inline in `<head>`), theme toggle, active-section highlight, copy-email button. Together ≤ 3 KB gzip. The site must be fully usable with JavaScript disabled (the mobile menu uses `<details>`; the theme follows the system).
- JSON-LD is emitted with `<script type="application/ld+json" set:html={json} />` where `json` is `JSON.stringify(data).replace(/</g, '\\u003c')`.
- Images go through `astro:assets` (`<Image>` / `<Picture>`), AVIF with WebP fallback, explicit `width`, `height`, `sizes`.
- No inline `style=""` attributes except for CSS custom properties (for example `style="--i:2"` for stagger indexes).
- No `!important` outside the print stylesheet. No `@apply` chains longer than a few utilities; prefer utilities in markup and a small `@layer components` block for repeated patterns.

---

## 6. DESIGN SYSTEM

### 6.1 Concept: "technical datasheet"

The site reads like a well-made engineering document: precise, calm, typographic. Think printed datasheet or good documentation, not a startup landing page. Character comes from structure, not decoration:

- a **12-column grid** with the section heading in a left column and content in the right 8 columns on desktop;
- **hairline rules** (1 px) as the only structural ornament;
- **numbered sections** (`01`, `02`) in monospace;
- a **"ficha" (spec sheet)** next to the hero: a bordered table of facts with the portrait on top;
- **one accent colour** (cobalt blue) used sparingly for links, focus, numerals, the primary button and small details;
- generous whitespace and a strict type scale.

The palette is blue-based and professional: cool off-white paper, deep navy ink, cobalt accent. In dark mode: deep navy ink-paper (never pure black), light blue accent.

### 6.2 Anti-patterns: it must NOT look AI-generated

Forbidden, no exceptions:

- gradients of any kind (backgrounds, text, borders, buttons), glow, neon, glassmorphism, `backdrop-blur` cards, blurred blobs, morphing shapes, mesh backgrounds, noise textures, dot/grid patterns;
- pure `#000` / `#fff` page backgrounds (dark mode uses navy, light mode uses `--bg`);
- centred hero with a giant gradient headline; "bento" grids; three identical rounded-2xl feature cards with a shadow and an emoji; floating badges;
- all-caps micro-labels with wide letter-spacing everywhere (`uppercase tracking-widest` is banned; uppercase is not used at all);
- pulsing dots, typing/typewriter effects, particle or canvas backgrounds, parallax, cursor followers, tilt effects, 3D, Lottie, confetti, marquee/ticker, auto-playing anything;
- skill bars, percentages, star ratings, radar charts, word clouds, "years per technology" counters, animated number counters;
- emojis in UI or copy, decorative stock illustrations, stock photos;
- shadows larger than a 1 px hairline equivalent (the only allowed shadow is the focus ring and the mobile menu panel's single 1 px border);
- radii above 8 px (except the 50 % status dot);
- generic marketing copy ("passionate", "cutting-edge", "innovative", "seamless", "leverage", "unlock", "crafting digital experiences"). All copy is provided; do not add copy.

### 6.3 Colour tokens

Define semantic tokens as CSS custom properties. Light is the default; dark applies with `[data-theme="dark"]`, and also by `prefers-color-scheme: dark` when the user has not chosen explicitly (`:root:not([data-theme="light"])`).

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F5F7FB` | `#0A1426` | page background |
| `--surface` | `#FFFFFF` | `#101C33` | ficha, menu panel, stack cells |
| `--surface-2` | `#EAEFF7` | `#16253F` | subtle fills, code, hover rows |
| `--ink` | `#0B1B33` | `#E8EEF8` | primary text |
| `--muted` | `#475569` | `#A9B8D0` | secondary text |
| `--subtle` | `#5B6B82` | `#8D9DB8` | tertiary text, separators between inline items |
| `--line` | `#D3DBE8` | `#25364F` | hairlines and borders |
| `--accent` | `#1D4ED8` | `#7FB0FF` | links, primary button, numerals, focus |
| `--accent-hover` | `#1E40AF` | `#A8C9FF` | hover state of accent |
| `--accent-ink` | `#1E3A8A` | `#A8C9FF` | accent text on `--accent-soft` |
| `--accent-soft` | `#E1EAFD` | `#12274A` | text selection, subtle highlight |
| `--on-accent` | `#FFFFFF` | `#071226` | text on `--accent` backgrounds |

Measured contrast (WCAG): light `--ink` on `--bg` 16.1:1; `--muted` on `--bg` 7.1:1; `--subtle` on `--bg` 5.1:1; `--accent` on `--bg` 6.3:1; `--on-accent` on `--accent` 6.7:1. Dark `--ink` on `--bg` 15.8:1; `--muted` on `--bg` 9.2:1; `--subtle` on `--bg` 6.7:1; `--accent` on `--bg` 8.4:1; `--on-accent` on `--accent` 8.5:1. Do not change these values; if you must add a colour, compute its contrast and keep ≥ 4.5:1 for text.

`--line` is decorative (hairlines). Interactive controls that rely on a border to be identifiable use `--accent` or `--subtle` for the border.

Skeleton for `src/styles/global.css`:

```css
@import "tailwindcss";
@import "@fontsource-variable/ibm-plex-sans/wght.css";
@import "@fontsource/ibm-plex-mono/400.css";
@import "@fontsource/ibm-plex-mono/500.css";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

:root {
  color-scheme: light;
  --bg:#F5F7FB; --surface:#FFFFFF; --surface-2:#EAEFF7;
  --ink:#0B1B33; --muted:#475569; --subtle:#5B6B82; --line:#D3DBE8;
  --accent:#1D4ED8; --accent-hover:#1E40AF; --accent-ink:#1E3A8A;
  --accent-soft:#E1EAFD; --on-accent:#FFFFFF;
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --bg:#0A1426; --surface:#101C33; --surface-2:#16253F;
  --ink:#E8EEF8; --muted:#A9B8D0; --subtle:#8D9DB8; --line:#25364F;
  --accent:#7FB0FF; --accent-hover:#A8C9FF; --accent-ink:#A8C9FF;
  --accent-soft:#12274A; --on-accent:#071226;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --bg:#0A1426; --surface:#101C33; --surface-2:#16253F;
    --ink:#E8EEF8; --muted:#A9B8D0; --subtle:#8D9DB8; --line:#25364F;
    --accent:#7FB0FF; --accent-hover:#A8C9FF; --accent-ink:#A8C9FF;
    --accent-soft:#12274A; --on-accent:#071226;
  }
}

@theme inline {
  --font-sans: "IBM Plex Sans Variable", "IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --color-bg: var(--bg);           --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-ink: var(--ink);         --color-muted: var(--muted);
  --color-subtle: var(--subtle);   --color-line: var(--line);
  --color-accent: var(--accent);   --color-accent-hover: var(--accent-hover);
  --color-accent-ink: var(--accent-ink); --color-accent-soft: var(--accent-soft);
  --color-on-accent: var(--on-accent);
  --radius-sm: 4px; --radius-md: 8px;
}
```

(The `@import` paths of the font packages are indicative; inspect the installed package for the exact file names, and keep only the Latin subset if the package offers one. Spanish needs only Latin.) Utilities such as `bg-bg`, `text-ink`, `text-muted`, `border-line`, `text-accent`, `bg-accent`, `text-on-accent` then exist.

### 6.4 Typography

- **IBM Plex Sans** (variable, weights 400, 500, 600) for everything except metadata. **IBM Plex Mono** (400, 500) for numerals of sections, dates, ficha labels and technology metadata. Two families only.
- Preload only the Latin `woff2` of Plex Sans (variable) and of Plex Mono 400 with `<link rel="preload" as="font" type="font/woff2" crossorigin>`. `font-display: swap`. Total font weight on the wire ≤ 100 KB.
- Recommended: a metric-matched fallback `@font-face` (Arial with `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`, computed with `@capsizecss/metrics`) to avoid layout shift. If it takes more than two attempts, skip it and measure CLS instead.
- Global: `font-optical-sizing: auto`, `text-wrap: balance` on h1 to h3, `text-wrap: pretty` on paragraphs, `font-variant-numeric: tabular-nums` on dates and ficha values, `-webkit-font-smoothing: antialiased`.

| Role | Size (fluid) | Line height | Weight | Tracking | Colour |
|---|---|---|---|---|---|
| h1 name | `clamp(2.5rem, 1.6rem + 4vw, 4.5rem)` (40 to 72 px) | 1.02 | 600 | −0.03em | ink |
| h1 role line (inside h1) | `clamp(1.25rem, 1rem + 1vw, 1.75rem)` (20 to 28 px) | 1.25 | 400 | −0.01em | muted |
| h2 | `clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem)` (28 to 40 px) | 1.1 | 600 | −0.02em | ink |
| h3 | `1.25rem` (20 px) | 1.3 | 600 | −0.01em | ink |
| Lead (hero intro) | `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)` (18 to 22 px) | 1.55 | 400 | 0 | ink |
| Body | `1rem` on < 768 px, `1.0625rem` (17 px) from 768 px | 1.65 | 400 | 0 | ink (secondary text uses muted) |
| Small | `0.875rem` (14 px) | 1.5 | 400 | 0 | muted |
| Mono label | `0.8125rem` (13 px) | 1.4 | 400/500 | 0.01em | muted (numerals in accent) |
| Contact email (display) | `clamp(1.5rem, 1rem + 2.5vw, 2.5rem)` | 1.15 | 500 | −0.02em | accent |

Paragraph measure: `max-width: 68ch`. Lead: `max-width: 56ch`. Never justify text. Never use `letter-spacing` above 0.02em. No uppercase text.

### 6.5 Spacing, grid, borders

- Base unit 4 px (Tailwind default scale).
- **Container:** `max-width: 72rem` (1152 px), centred, horizontal padding `1rem` below 640 px, `1.5rem` from 640 px, `2rem` from 1024 px.
- **Section vertical padding:** `clamp(4rem, 3rem + 5vw, 8rem)` top and bottom. Each section (except hero) starts with a 1 px `--line` top border spanning the container.
- **Grid:** 12 columns from 1024 px with `column-gap: 2rem`. Section heading column = 4 columns (sticky at `top: 6rem` on ≥ 1024 px), content column = 8 columns. Below 1024 px everything is a single column with 2rem between heading and content.
- **Radius:** 4 px (small items), 8 px (ficha, stack cells, buttons, menu panel, images). Nothing else.
- **Borders:** 1 px solid `--line`. No shadows.
- **Selection:** `::selection { background: var(--accent-soft); color: var(--ink); }`.
- **Scroll:** `html { scroll-padding-top: 5rem; }` and `scroll-behavior: smooth` only inside `@media (prefers-reduced-motion: no-preference)`.

### 6.6 Component specifications

**Header** (`<header>` containing `<nav aria-label>`): sticky, `top: 0`, height 64 px, solid `--bg`, bottom hairline. Left: monogram (28×28 px, radius 6 px, `--accent` background, `--on-accent` "MC" in Plex Sans 600 13 px) followed by the text "Manuel Cobos Solís" (15 px, weight 600, ink); the whole thing is one link to the localised home. Below 400 px the text is visually hidden (`sr-only`) but stays in the DOM. Desktop (≥ 1024 px): nav links 14 px weight 500, `--muted`, hover `--ink`; the current section gets `aria-current="true"`, ink colour and a 2 px `--accent` underline with 6 px offset. Right: language switch, theme toggle. Below 1024 px: links collapse into a `<details>` disclosure labelled "Menú" / "Menu" (44 px high summary); the open panel is full-width under the header, `--surface` background, 1 px borders, links 18 px with 56 px row height separated by hairlines. With JavaScript disabled everything still works.

**Language switch:** a plain `<a>` to the same page in the other language, `hreflang`, `lang` attributes set, visible text "EN" (on Spanish pages) or "ES" (on English pages) in Plex Mono 13 px, 44×44 px hit area, 1 px `--subtle` border, 8 px radius, with an `aria-label` from the UI dictionary.

**Theme toggle:** `<button>` 44×44 px, same border treatment, shows a sun icon in dark mode and a moon icon in light mode, `aria-label` from the dictionary, cycles light/dark and stores the choice in `localStorage` (inside try/catch).

**Buttons:** minimum height 44 px, padding `0.75rem 1.25rem`, radius 8 px, 15 px weight 500.
- Primary: `--accent` background, `--on-accent` text, hover `--accent-hover`.
- Secondary: transparent, 1 px `--accent` border, `--accent` text, hover `--accent-soft` background.
- Focus (all interactive elements): `outline: 2px solid var(--accent); outline-offset: 3px; border-radius: inherit` via `:focus-visible`. Never remove outlines.

**Text links:** `--accent`, underline 1 px with `text-underline-offset: 0.2em`; hover: underline 2 px and `--accent-hover`. External links append an `arrow-up-right` icon (14 px) and a visually hidden "(se abre en una pestaña nueva)" / "(opens in a new tab)".

**Ficha (spec sheet) card:** `--surface` background, 1 px `--line` border, 8 px radius, overflow hidden. Top: portrait (aspect ratio 5/4, `object-fit: cover`, `object-position: 50% 18%`, no border radius of its own). Below: a `<dl>` where each row is a 2-column grid (label left, value right) on ≥ 768 px, stacked below; rows have 14 px vertical padding, 20 px horizontal padding and a hairline between them. Labels are Plex Mono 13 px `--muted`; values 16 px `--ink`, tabular numerals. The row "Estado / Status" shows a 8 px `--accent` dot (static, no animation) before the text.

**Experience entry:** an `<article>` per role; two columns from 768 px (date column 9 rem, then content), stacked below. Date: Plex Mono 13 px `--muted` inside `<time>`s. Title (h3), organisation line (15 px `--muted`, "Viewnext" links to viewnext.com), then bullets. Bullet markers: `list-style: none`; each `li` has `padding-left: 1.25rem` and a `::before` rule 10 px wide and 1 px high in `--accent`, vertically at `0.8em`. Technology line under the bullets in Plex Mono 13 px `--muted`, items separated by ` · ` in `--subtle`. Entries are separated by hairlines with 2rem padding. No cards, no shadows.

**Stack core strip:** a grid of 10 cells (2 columns below 640 px, 5 columns from 640 px) drawn with the hairline trick: container `gap-px` with `--line` background, `overflow-hidden`, 8 px radius, 1 px border; each cell `--surface`, padding 1rem, a 28 px monochrome icon (`currentColor`, `--ink`) above a 14 px label. Hover (pointer devices only): icon colour transitions to `--accent`.

**Stack groups:** a `<dl>`; each group is a row with a hairline above; from 768 px a 2-column grid `11rem 1fr`, stacked below. `<dt>` Plex Mono 13 px `--muted`; `<dd>` is a `<ul>` of inline items in 16 px `--ink`, separated by a pseudo-element middot (`li:not(:last-child)::after { content: "·"; margin: 0 0.6rem; color: var(--subtle); }`). Optional per-item note in `--muted` parentheses.

**Work (case study / project) row on home:** a full-width `<a>` block with top hairline, padding 1.5rem 0; contents: h3 (22 px), summary paragraph (muted), technology line (mono), and a right-aligned `arrow-right` icon (desktop) that moves 2 px to the right on hover. Hover colours the h3 `--accent`. The whole row is the link (a single link, not nested links).

**Education rows:** two groups (Formación reglada; Certificaciones e idiomas). Each row: title 16 px weight 500, organisation 15 px `--muted`, period or issuer in Plex Mono 13 px `--muted` aligned right on ≥ 768 px.

**Contact section:** the email as a display-size accent link (section 6.4), `overflow-wrap: anywhere`; below it the buttons "Escribir un correo" (primary), "LinkedIn" (secondary), "GitHub" (secondary), and the "Copiar correo" icon button; then an `<address>` with text "Cáceres, Extremadura, España · Remoto".

**Footer:** top hairline, 2rem padding, small text: copyright, "Sin cookies ni analítica", "Actualizado en {fecha}", links (LinkedIn, GitHub, CV), "Hecho con Astro y Tailwind CSS". Footer links to the profiles carry `rel="me noopener noreferrer"`.

### 6.7 Layout of each section (desktop ≥ 1024 / tablet 640 to 1023 / mobile < 640)

**Hero.** Padding top `clamp(3rem, 2rem + 5vw, 6rem)`, bottom the same. Desktop: 12-column grid, text in columns 1 to 7, ficha in columns 8 to 12, vertically aligned to the top of the h1. Tablet and mobile: single column, order = status line, h1 (name + role), lead paragraph, buttons, text links (LinkedIn, GitHub), then the ficha. Status line: 8 px `--accent` dot + text "Abierto a oportunidades · Remoto desde España" (15 px, muted). Buttons: primary "Escríbeme" (mailto), secondary "Ver CV" (link to `/cv/`). Under them, text links LinkedIn and GitHub separated by a middot. The h1 may wrap onto two lines at any width; `text-wrap: balance`.

**Sections 01 to 07.** Desktop: heading column (number in mono accent, h2, optional one-line description) sticky; content column to the right. Tablet and mobile: number and h2 above, content below.

**About.** Four paragraphs from section 8.4 in the 8-column content area, measure 68ch, 1.25rem between paragraphs. No cards.

**Experience.** Three entries as above; first entry (current) has its date text suffixed by "actualidad" / "present" (no badge).

**Contact.** Single column even on desktop; generous top padding.

### 6.8 Imagery and icons

- Only one photograph: the portrait (alt text in section 8.2). No other imagery. No illustrations. Exception: the `WorkDiagram` SVG in the case study (section 8.12).
- Brand icons only for the 10 core technologies, monochrome, `aria-hidden="true"`, accompanied by the visible text label.
- UI icons from Lucide, stroke style, 20 px (24 px for the menu button), `aria-hidden`.

### 6.9 Responsive verification widths

360, 390, 768, 1024, 1280 and 1536 px, each in light and dark. At each width: no horizontal scroll (`document.documentElement.scrollWidth <= window.innerWidth`), no text smaller than 13 px, every interactive target ≥ 44×44 px, no overlapping elements.

---

## 7. MOTION SPECIFICATION

Motion is subtle, fast and functional. Everything lives inside `@media (prefers-reduced-motion: no-preference)`; with reduced motion nothing moves and everything is visible. Animate only `opacity` and `transform`. Never delay content that matters for LCP: **the h1, the lead paragraph and the portrait never have an entrance animation.**

| Motion | Where | Spec |
|---|---|---|
| Rise-in | Ficha rows, hero buttons | `opacity 0→1`, `translateY(8px)→0`, 500 ms, `cubic-bezier(0.2, 0.7, 0.2, 1)`, stagger `calc(var(--i) * 60ms)`, starting at 100 ms |
| Scroll reveal | Content blocks of sections 01 to 07 below the fold | CSS scroll-driven animation: `animation: rise linear both; animation-timeline: view(); animation-range: entry 0% entry 30%;` inside `@supports (animation-timeline: view())`. Without support the content is simply visible. No JavaScript, no hidden initial state |
| Link hover | text links | underline thickness 1→2 px and colour change, 120 ms |
| Work row hover | case study row | title colour to accent, arrow `translateX(2px)`, 150 ms |
| Stack cell hover | core strip | icon colour to accent, 150 ms |
| Active section | header nav | `IntersectionObserver` sets `aria-current` and underline; no animation beyond a 150 ms colour transition |
| Theme change | whole page | `transition: background-color 150ms, color 150ms, border-color 150ms` on `body` and bordered elements only after first paint (add a class after load so there is no flash) |
| Page transition | between pages | `@view-transition { navigation: auto; }` with a 180 ms cross-fade (`::view-transition-old(root)`, `::view-transition-new(root)`). No `ClientRouter`, no JavaScript |

Define the keyframes once:

```css
@keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
```

Forbidden: any looping animation, `will-change` on more than two elements, animating layout properties, GSAP/Framer/anime.js or any animation library.


---

## 8. CONTENT (VERBATIM COPY, SPANISH AND ENGLISH)

Use this copy exactly. Do not paraphrase, shorten, extend or add copy. Punctuation, accents and non-breaking spaces matter. "100 %" uses a non-breaking space (`&nbsp;`) between the number and the percent sign. Dates in running text use the format of each language ("marzo de 2024" / "March 2024").

### 8.1 UI dictionary (`src/i18n/ui.ts`)

| key | ES | EN |
|---|---|---|
| `skip` | Saltar al contenido | Skip to content |
| `nav.about` | Sobre mí | About |
| `nav.experience` | Experiencia | Experience |
| `nav.stack` | Stack | Stack |
| `nav.cases` | Casos de estudio | Case studies |
| `nav.projects` | Proyectos | Projects |
| `nav.education` | Formación | Education |
| `nav.contact` | Contacto | Contact |
| `nav.cv` | CV | Résumé |
| `nav.label` | Navegación principal | Main navigation |
| `menu.open` | Menú | Menu |
| `theme.toDark` | Cambiar a tema oscuro | Switch to dark theme |
| `theme.toLight` | Cambiar a tema claro | Switch to light theme |
| `lang.switchLabel` | Read this page in English | Leer esta página en español |
| `lang.switchText` | EN | ES |
| `status` | Abierto a oportunidades · Remoto desde España | Open to opportunities · Remote from Spain |
| `cta.contact` | Escríbeme | Get in touch |
| `cta.cv` | Ver CV | View résumé |
| `section.about` | Sobre mí | About me |
| `section.experience` | Experiencia | Experience |
| `section.stack` | Stack técnico | Tech stack |
| `section.cases` | Casos de estudio | Case studies |
| `section.projects` | Proyectos | Projects |
| `section.education` | Formación y certificaciones | Education and certifications |
| `section.contact` | Contacto | Contact |
| `ficha.title` | Ficha | At a glance |
| `work.read` | Leer el caso | Read the case study |
| `work.readProject` | Ver el proyecto | View the project |
| `work.repo` | Código | Source code |
| `work.demo` | Demo | Live demo |
| `work.stack` | Tecnologías | Technologies |
| `work.published` | Publicado | Published |
| `breadcrumb.label` | Migas de pan | Breadcrumb |
| `breadcrumb.home` | Inicio | Home |
| `external` | (se abre en una pestaña nueva) | (opens in a new tab) |
| `email.write` | Escribir un correo | Send an email |
| `email.copy` | Copiar correo | Copy email |
| `email.copied` | Correo copiado | Email copied |
| `cv.download` | Descargar PDF | Download PDF |
| `cv.print` | Imprimir | Print |
| `footer.rights` | Todos los derechos reservados. | All rights reserved. |
| `footer.privacy` | Sin cookies ni analítica. | No cookies, no analytics. |
| `footer.updated` | Actualizado en | Last updated |
| `footer.built` | Hecho con Astro y Tailwind CSS. | Built with Astro and Tailwind CSS. |
| `notfound.title` | Página no encontrada | Page not found |
| `notfound.text` | La página que buscas no existe o se ha movido. | The page you are looking for does not exist or has moved. |
| `notfound.back` | Volver al inicio | Back to home |

### 8.2 Hero

| | ES | EN |
|---|---|---|
| h1 name | Manuel Cobos Solís | Manuel Cobos Solís |
| h1 role (same `<h1>`, after `<span class="sr-only">, </span>`) | Desarrollador Full Stack con enfoque backend | Backend-oriented Full Stack Developer |
| Lead paragraph | Java y Spring Boot en el servidor, Angular en el cliente. Desarrollo microservicios y aplicaciones web para el sector bancario, con mensajería sobre Kafka y RabbitMQ. Vivo en Cáceres y trabajo en remoto. | Java and Spring Boot on the server, Angular on the client. I build microservices and web applications for the banking sector, with messaging on Kafka and RabbitMQ. Based in Cáceres, working remotely. |
| Portrait alt | Retrato de Manuel Cobos Solís, desarrollador Full Stack | Portrait of Manuel Cobos Solís, Full Stack Developer |
| Text links under the buttons | LinkedIn · GitHub | LinkedIn · GitHub |

### 8.3 Ficha (spec sheet)

Rows in this order. `{N}` = `fullYearsSince('2024-03-01')` computed at build time, minimum 1.

| Label ES | Value ES | Label EN | Value EN |
|---|---|---|---|
| Rol | Desarrollador Full Stack (backend Java, frontend Angular) | Role | Full Stack Developer (Java backend, Angular frontend) |
| Empresa | Viewnext · cliente Banco Santander | Company | Viewnext · client Banco Santander |
| Ubicación | Cáceres, Extremadura, España | Location | Cáceres, Extremadura, Spain |
| Modalidad | 100 % remoto | Work mode | Fully remote |
| Experiencia | Desde marzo de 2024 · más de {N} años | Experience | Since March 2024 · over {N} years |
| Stack principal | Java 21 · Spring Boot · Kafka · RabbitMQ · Angular 20 · PostgreSQL | Main stack | Java 21 · Spring Boot · Kafka · RabbitMQ · Angular 20 · PostgreSQL |
| Idiomas | Español (nativo) · Inglés (B2) | Languages | Spanish (native) · English (B2) |
| Estado | Abierto a oportunidades | Status | Open to opportunities |

### 8.4 About

ES (4 paragraphs):

1. Soy desarrollador Full Stack con base en el backend: Java 17 y 21, Spring Boot, microservicios y APIs REST, con mensajería asíncrona sobre Apache Kafka y RabbitMQ. En el frontend trabajo con Angular y TypeScript.
2. Trabajo en Viewnext, desarrollando para el Banco Santander en un equipo de unas 5 personas. Mi día a día combina el desarrollo de funcionalidades de extremo a extremo con la calidad del código: pruebas automáticas, análisis con SonarQube y despliegue hasta producción sobre OpenShift.
3. He trabajado con Angular desde la versión 15 hasta la 20, incluidas migraciones completas desde versiones antiguas hasta la actual.
4. Busco una posición como desarrollador Full Stack o Java Backend en una consultora o empresa con equipos en España, en remoto.

EN (4 paragraphs):

1. I am a Full Stack developer with a backend foundation: Java 17 and 21, Spring Boot, microservices and REST APIs, with asynchronous messaging on Apache Kafka and RabbitMQ. On the frontend I work with Angular and TypeScript.
2. I work at Viewnext, developing for Banco Santander in a team of about five people. My day to day combines end-to-end feature development with code quality: automated tests, SonarQube analysis and deployment to production on OpenShift.
3. I have worked with Angular from version 15 to 20, including full migrations from older versions to the current one.
4. I am looking for a Full Stack or Java Backend Developer position at a consultancy or company with teams in Spain, working remotely.

### 8.5 Experience

Section has no description line. Entries in this order. Dates are `<time datetime>` ranges (`2025-07`, `2024-11`, `2024-03`).

**Entry 1**
- ES date: `jul 2025 – actualidad`. EN date: `Jul 2025 – present`.
- Title: `Full Stack Developer`.
- Organisation line ES: `Viewnext · cliente Banco Santander (sector bancario)`. EN: `Viewnext · client Banco Santander (banking sector)`.
- Bullets ES:
  - Desarrollo de funcionalidades de extremo a extremo con Angular 20 y Spring Boot, hasta producción.
  - Pruebas con Vitest y JUnit 5, mejora de la cobertura de tests, refactorización de código heredado y corrección de hallazgos de SonarQube.
  - Despliegue sobre OpenShift con pipelines de GitHub Actions.
- Bullets EN:
  - End-to-end feature development with Angular 20 and Spring Boot, through to production.
  - Testing with Vitest and JUnit 5, higher test coverage, refactoring of legacy code and fixing of SonarQube findings.
  - Deployment on OpenShift with GitHub Actions pipelines.
- Technologies (both languages): `Angular 20 · TypeScript · Spring Boot · Vitest · JUnit 5 · SonarQube · OpenShift · GitHub Actions`

**Entry 2**
- ES date: `nov 2024 – jun 2025`. EN date: `Nov 2024 – Jun 2025`.
- Title: `Java Backend Developer`.
- Organisation line ES: `Viewnext · sector bancario`. EN: `Viewnext · banking sector`.
- Bullets ES:
  - Desarrollo de microservicios y APIs REST con Spring Boot bajo arquitectura limpia.
  - Mensajería con Apache Kafka y RabbitMQ, incluido un pipeline asíncrono para procesar eventos financieros en tiempo real.
  - Notificaciones del estado de operaciones bancarias en tiempo real con WebSockets.
  - Seguridad con Spring Security y persistencia con Spring Data.
- Bullets EN:
  - Development of microservices and REST APIs with Spring Boot under clean architecture.
  - Messaging with Apache Kafka and RabbitMQ, including an asynchronous pipeline to process financial events in real time.
  - Real-time notifications of banking operation status with WebSockets.
  - Security with Spring Security and persistence with Spring Data.
- Technologies: `Java · Spring Boot · Kafka · RabbitMQ · WebSockets · Spring Security · Spring Data JPA`

**Entry 3**
- ES date: `mar 2024 – jun 2024`. EN date: `Mar 2024 – Jun 2024`.
- Title: `Integration Developer`.
- Organisation line ES: `Viewnext · sector bancario`. EN: `Viewnext · banking sector`.
- Bullets ES:
  - Flujos en MuleSoft Anypoint Platform que conectan sistemas heredados con APIs modernas.
  - Transformación y enrutado de datos con IBM Integration Bus.
  - Obtención de la certificación MuleSoft Certified Developer.
- Bullets EN:
  - Flows on MuleSoft Anypoint Platform connecting legacy systems with modern APIs.
  - Data transformation and routing with IBM Integration Bus.
  - Earned the MuleSoft Certified Developer certification.
- Technologies: `MuleSoft Anypoint Platform · IBM Integration Bus · REST APIs · XML`

### 8.6 Stack

Core strip (icon slug → label): `openjdk` → Java; `springboot` → Spring Boot; `apachekafka` → Kafka; `rabbitmq` → RabbitMQ; `angular` → Angular; `typescript` → TypeScript; `postgresql` → PostgreSQL; `docker` → Docker; `kubernetes` → Kubernetes; `githubactions` → GitHub Actions.

Groups (items separated by ` · ` in the UI; render as list items):

| Group ES / EN | Items ES | Items EN |
|---|---|---|
| Backend / Backend | Java 17; Java 21; Spring Boot; Spring MVC; Spring Security; Spring Data JPA; Spring Batch; WebClient; Arquitectura limpia / hexagonal; DDD; API-first (OpenAPI) | Java 17; Java 21; Spring Boot; Spring MVC; Spring Security; Spring Data JPA; Spring Batch; WebClient; Clean / Hexagonal Architecture; DDD; API-first (OpenAPI) |
| Frontend / Frontend | Angular 15–20 (migraciones completas hasta la 20); TypeScript; RxJS; Angular Material; Vitest; Karma | Angular 15–20 (full migrations up to 20); TypeScript; RxJS; Angular Material; Vitest; Karma |
| Mensajería y tiempo real / Messaging and real time | Apache Kafka; RabbitMQ; WebSockets; Arquitectura orientada a eventos | Apache Kafka; RabbitMQ; WebSockets; Event-driven architecture |
| Bases de datos / Databases | PostgreSQL; Oracle (consultas y creación de tablas); SQL Server (consultas y creación de tablas) | PostgreSQL; Oracle (queries and table creation); SQL Server (queries and table creation) |
| DevOps y calidad / DevOps and quality | Docker; Kubernetes; OpenShift; ArgoCD; GitHub Actions; Maven; SonarQube; Trivy; JUnit 5; Mockito | Docker; Kubernetes; OpenShift; ArgoCD; GitHub Actions; Maven; SonarQube; Trivy; JUnit 5; Mockito |
| Integración (experiencia previa) / Integration (earlier experience) | MuleSoft Anypoint Platform; IBM Integration Bus | MuleSoft Anypoint Platform; IBM Integration Bus |
| Conocimientos adicionales / Additional knowledge | MongoDB; Firebase (formación y estudio personal) | MongoDB; Firebase (education and personal study) |

### 8.7 Case studies list on home

Rendered from the content collection (section 8.12): h3 = `title`, paragraph = `summary`, technology line = `stack` joined with ` · `, link label = `work.read`.

### 8.8 Education and certifications

Group "Formación" / "Education":

| Title ES | Title EN | Organisation | Period |
|---|---|---|---|
| Técnico Superior en Desarrollo de Aplicaciones Web (DAW) | Higher Technical Degree in Web Application Development (DAW) | IES Ágora | 2024 – 2025 |
| Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM) | Higher Technical Degree in Cross-Platform Application Development (DAM) | IES Ágora | 2022 – 2024 |

Group "Certificaciones e idiomas" / "Certifications and languages":

| Title | Issuer ES | Issuer EN |
|---|---|---|
| MuleSoft Certified Developer – Level 1 | MuleSoft | MuleSoft |
| LPIC-1 Linux Administrator | Linux Professional Institute | Linux Professional Institute |
| Claude Code in Action | Anthropic | Anthropic |
| Inglés B2 / English B2 | Nivel de idioma | Language level |

Note under the group, ES: `Las certificaciones se pueden verificar en LinkedIn.` (link on "LinkedIn" to the certifications page). EN: `Certifications can be verified on LinkedIn.`

### 8.9 Contact

| | ES | EN |
|---|---|---|
| Paragraph | Si tienes una oportunidad o quieres hablar de un proyecto, escríbeme por correo o por LinkedIn. | If you have an opportunity or want to talk about a project, email me or reach out on LinkedIn. |
| Address line | Cáceres, Extremadura, España · Remoto | Cáceres, Extremadura, Spain · Remote |

Buttons: primary `email.write` (mailto), secondary "LinkedIn", secondary "GitHub", icon button `email.copy`. The email address itself is shown as visible text.

### 8.10 CV page (`/cv/`, `/en/cv/`)

A single-column, print-first document that reuses the data modules. Structure and headings:

1. Header block: h1 "Manuel Cobos Solís"; line with the role (section 8.2); contact line: `Cáceres, Extremadura, España · 100 % remoto · manuel.cobos.dev@gmail.com · linkedin.com/in/manuelcobos · github.com/ManuelCobosDev · manuelcobos.dev` (visible text; each part is a link). EN uses "Spain" and "fully remote".
2. h2 "Perfil" / "Profile". ES: `Desarrollador Full Stack con enfoque backend y más de {N} años de experiencia en el sector bancario. Java 17 y 21, Spring Boot, microservicios y mensajería con Kafka y RabbitMQ en el servidor; Angular y TypeScript en el cliente.` EN: `Backend-oriented Full Stack Developer with over {N} years of experience in the banking sector. Java 17 and 21, Spring Boot, microservices and messaging with Kafka and RabbitMQ on the server; Angular and TypeScript on the client.`
3. h2 "Experiencia" / "Experience": same three entries (dates, title, organisation line, bullets), no technology line.
4. h2 "Stack técnico" / "Tech stack": the seven groups as a compact definition list.
5. h2 "Formación" / "Education": the two degrees.
6. h2 "Certificaciones e idiomas" / "Certifications and languages": the four items.
7. Toolbar (hidden when printing): button `cv.print` (calls `window.print()`) and, only if `public/cv/Manuel-Cobos-Solis-CV.pdf` exists at build time, a link button `cv.download` to `/cv/Manuel-Cobos-Solis-CV.pdf`.

Print stylesheet (`@media print`): A4, `@page { size: A4; margin: 15mm; }`, white background, black text, 10 pt, hide header, footer, toolbar, theme and language controls; `break-inside: avoid` on entries; links keep their text, no URL appended; must fit in two pages.

### 8.11 Not-found page (`404.astro`, one file, bilingual, `noindex`)

Shows both languages: h1 `Página no encontrada` with text and a link "Volver al inicio" to `/`, then h2 `Page not found` with text and a link "Back to home" to `/en/`. Uses the normal header and footer. `<meta name="robots" content="noindex">`.

### 8.12 Work collection: schema and the launch case study

`src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    lang: z.enum(['es', 'en']),
    translationKey: z.string(),
    kind: z.enum(['case-study', 'project']),
    title: z.string(),
    seoTitle: z.string().max(62),
    description: z.string().min(80).max(155),
    summary: z.string().max(200),
    stack: z.array(z.string()).min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    links: z.object({ repo: z.string().url().optional(), demo: z.string().url().optional() }).optional(),
    diagram: z.enum(['orchestrator']).optional(),
    draft: z.boolean().default(false),
    order: z.number().default(100),
  }),
});
export const collections = { work };
```

(If `z` from `astro:content` is deprecated in the installed Astro version, import it from `astro/zod`.) Filter out `draft: true` everywhere (home, routes, sitemap, JSON-LD). Entries are paired across languages by `translationKey`; the build must fail if an entry has no counterpart in the other language.

**Case study page layout** (`/trabajo/<slug>/`, `/en/work/<slug>/`): breadcrumbs (Inicio › title) → h1 = `title` → meta line (published date in Plex Mono, `stack` joined with ` · `) → lead paragraph = `summary` → `WorkDiagram` if `diagram` is set → Markdown body in a prose container (max 68ch; h2 24 px/600 with 2.5rem top margin; lists with the same accent-rule markers as the experience bullets; inline `code` in Plex Mono 0.9em on `--surface-2`, 4 px radius) → a final row with a link back to the home section and a link to the other language version. For `kind: project` also show the `links.repo` and `links.demo` as buttons.

**`WorkDiagram` (orchestrator)** is built in HTML and CSS, not as a scaled SVG, so it stays legible on mobile. Desktop (≥ 768 px): three columns. Column 1 box "Cliente / Client". Column 2 box "Orquestador / Orchestrator" with the small line "Un único POST con JSON / A single POST with JSON" (accent border). Column 3: four stacked boxes. Connectors: 1 px `--line` lines with small arrowheads drawn with CSS. Mobile: one column flowing top to bottom with a "↓" connector between steps; the four destinations stack. It is a `<figure>` with `role="group"` and `aria-label`, and a `<figcaption>` that describes the flow in one sentence (so it is understandable without seeing it). Box labels:

| | ES | EN |
|---|---|---|
| Box 1 | Cliente | Client |
| Box 2 | Orquestador · Un único POST con JSON | Orchestrator · A single POST with JSON |
| Box 3a | Microservicio Kafka | Kafka microservice |
| Box 3b | Microservicio RabbitMQ | RabbitMQ microservice |
| Box 3c | Microservicio WebClient (servicios externos) | WebClient microservice (external services) |
| Box 3d | Microservicio de persistencia · N bases de datos · credenciales en Vault | Persistence microservice · N databases · credentials in Vault |
| Caption | El cliente envía un único JSON al orquestador, que reparte cada sección a los microservicios de Kafka, RabbitMQ, WebClient y persistencia. | The client sends a single JSON to the orchestrator, which distributes each section to the Kafka, RabbitMQ, WebClient and persistence microservices. |

**File `src/content/work/es/microservicio-orquestador.md`:**

```md
---
lang: es
translationKey: orchestrator
kind: case-study
title: "Microservicio orquestador: un único POST, varios destinos"
seoTitle: "Microservicio orquestador: Spring Boot, Kafka, RabbitMQ"
description: "Caso de estudio: un microservicio orquestador que recibe un JSON y enruta cada sección a Kafka, RabbitMQ, WebClient o bases de datos dinámicas."
summary: "Un único POST con un JSON que el orquestador reparte entre microservicios de Kafka, RabbitMQ, WebClient y bases de datos con conexión dinámica."
stack: ["Java", "Spring Boot", "Apache Kafka", "RabbitMQ", "WebClient", "Vault"]
publishedAt: 2026-10-05
diagram: orchestrator
order: 1
draft: false
---

Uno de los trabajos de los que estoy más satisfecho en Viewnext es un microservicio orquestador para un entorno bancario. Recibe un único JSON por POST y reparte cada sección del contenido al microservicio que debe procesarla.

## Cómo funciona

- El orquestador expone un único endpoint. Quien lo invoca no necesita saber qué hay detrás.
- Cada sección del JSON se enruta a un microservicio especializado: uno publica en **Apache Kafka**, otro en **RabbitMQ**, otro llama a servicios externos con **WebClient** y otro persiste datos en bases de datos.
- Las llamadas entre microservicios usan timeouts explícitos.

## La parte difícil: conexiones dinámicas a bases de datos

El microservicio de persistencia no trabaja con una base de datos fija, sino con N bases de datos genéricas que se conocen en tiempo de ejecución.

- Crea los beans de conexión en tiempo de ejecución, uno por cada base de datos.
- Mantiene las conexiones abiertas y las reutiliza, en lugar de abrir y cerrar una conexión en cada petición.
- Obtiene las credenciales de un gestor de secretos (Vault), de modo que no viven en la configuración del servicio.

## Decisiones de diseño

- **Un destino por microservicio.** Separa las dependencias de Kafka, RabbitMQ, HTTP y base de datos, y permite evolucionar cada una por separado.
- **Conexiones persistentes frente a conexión por petición.** Se evita el coste de abrir y cerrar conexiones en cada llamada, a cambio de gestionar el ciclo de vida de los beans y de las conexiones abiertas.

*Describo el diseño en términos generales y omito nombres de sistemas y datos del cliente.*
```

**File `src/content/work/en/orchestrator-microservice.md`:**

```md
---
lang: en
translationKey: orchestrator
kind: case-study
title: "Orchestrator microservice: one POST, several destinations"
seoTitle: "Orchestrator microservice: Spring Boot, Kafka, RabbitMQ"
description: "Case study: an orchestrator microservice that takes one JSON payload and routes each section to Kafka, RabbitMQ, WebClient or dynamic databases."
summary: "A single POST with a JSON payload that the orchestrator distributes across Kafka, RabbitMQ, WebClient and dynamic-connection database microservices."
stack: ["Java", "Spring Boot", "Apache Kafka", "RabbitMQ", "WebClient", "Vault"]
publishedAt: 2026-10-05
diagram: orchestrator
order: 1
draft: false
---

One of the pieces of work I am most satisfied with at Viewnext is an orchestrator microservice for a banking environment. It receives a single JSON payload through a POST request and distributes each section of the content to the microservice that must process it.

## How it works

- The orchestrator exposes a single endpoint. Whoever calls it does not need to know what is behind it.
- Each section of the JSON is routed to a specialised microservice: one publishes to **Apache Kafka**, another to **RabbitMQ**, another calls external services with **WebClient**, and another persists data in databases.
- Calls between microservices use explicit timeouts.

## The hard part: dynamic database connections

The persistence microservice does not work with a fixed database. It works with N generic databases that are only known at runtime.

- It creates the connection beans at runtime, one per database.
- It keeps connections open and reuses them, instead of opening and closing a connection on every request.
- It obtains credentials from a secrets manager (Vault), so they do not live in the service configuration.

## Design decisions

- **One destination per microservice.** It isolates the Kafka, RabbitMQ, HTTP and database dependencies and lets each one evolve separately.
- **Persistent connections versus connection per request.** It avoids the cost of opening and closing connections on every call, at the price of managing the lifecycle of the beans and of the open connections.

*I describe the design in general terms and omit system names and client data.*
```

**Template for future entries:** `docs/templates/work-entry.md` repeats the frontmatter with a comment on each field and a short body skeleton: "Contexto / Qué hace / Decisiones / Resultado" (ES) and "Context / What it does / Decisions / Outcome" (EN). It must live outside `src/content` so that it is not parsed.


---

## 9. SEO SPECIFICATION

### 9.1 Titles and descriptions (exact strings)

Titles ≤ 60 characters where possible, descriptions 120 to 155 characters, unique per page. No automatic suffix is appended: use these strings as written.

| Page | `<title>` | `<meta name="description">` |
|---|---|---|
| `/` | Manuel Cobos Solís \| Desarrollador Full Stack Java y Angular | Manuel Cobos Solís, desarrollador Full Stack con enfoque backend: Java, Spring Boot, Kafka y Angular. Sector bancario. Cáceres, España. Remoto. |
| `/en/` | Manuel Cobos Solís \| Full Stack Developer (Java, Angular) | Manuel Cobos Solís, backend-oriented Full Stack Developer: Java, Spring Boot, Kafka and Angular. Banking sector. Based in Cáceres, Spain. Remote. |
| `/cv/` | CV de Manuel Cobos Solís \| Desarrollador Full Stack | Currículum de Manuel Cobos Solís: experiencia en Viewnext (Banco Santander), stack Java, Spring Boot, Kafka y Angular, formación y certificaciones. |
| `/en/cv/` | Manuel Cobos Solís CV \| Full Stack Developer | Résumé of Manuel Cobos Solís: experience at Viewnext (Banco Santander), Java, Spring Boot, Kafka and Angular stack, education and certifications. |
| work entry | frontmatter `seoTitle` | frontmatter `description` |
| `/404.html` | Página no encontrada \| Manuel Cobos Solís | (none; `noindex`) |

### 9.2 `<head>` contents, in this order (component `Seo.astro`)

1. `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`.
2. Inline theme-init script (section 5.8): `<script is:inline>(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}})();</script>`
3. `<title>`, `<meta name="description">`.
4. `<link rel="canonical" href="{absolute URL with trailing slash}">`.
5. `<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">` (`noindex,follow` on 404).
6. `<link rel="alternate" hreflang="es-ES" href>`, `hreflang="en"`, `hreflang="x-default"` (= Spanish URL). Each page lists all three, including itself.
7. Open Graph: `og:type` (`profile` on home pages, `article` on work entries, `website` on CV), `og:title`, `og:description`, `og:url`, `og:site_name` ("Manuel Cobos Solís"), `og:locale` (`es_ES` / `en_GB`), `og:locale:alternate`, `og:image` (absolute), `og:image:width` 1200, `og:image:height` 630, `og:image:alt`. For `profile`: `profile:first_name` "Manuel", `profile:last_name` "Cobos Solís". For `article`: `article:published_time`, `article:modified_time` (if present), `article:author` (home URL), `article:tag` for each stack item.
8. Twitter: `twitter:card` = `summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`. No `twitter:site`.
9. `<meta name="author" content="Manuel Cobos Solís">`, `<meta name="color-scheme" content="light dark">`, two `<meta name="theme-color">` with `media="(prefers-color-scheme: light)"` (#F5F7FB) and `(prefers-color-scheme: dark)` (#0A1426), `<meta name="referrer" content="strict-origin-when-cross-origin">`.
10. Icons: `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`, `<link rel="icon" href="/favicon.ico" sizes="32x32">`, `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`, `<link rel="manifest" href="/manifest.webmanifest">`.
11. Identity links: `<link rel="me" href="https://github.com/ManuelCobosDev">` and `<link rel="me" href="https://www.linkedin.com/in/manuelcobos/">`.
12. `<link rel="sitemap" type="application/xml" href="/sitemap-index.xml">`.
13. Font preloads (section 6.4) and the portrait preload on pages where it is above the fold on desktop.
14. Search-engine verification, rendered only when the environment variable exists: `PUBLIC_GSC_VERIFICATION` → `<meta name="google-site-verification">`, `PUBLIC_BING_VERIFICATION` → `<meta name="msvalidate.01">`.
15. JSON-LD (`JsonLd.astro`), section 9.4.

Never add: `meta keywords`, `geo.*` meta tags, `rel="prev/next"`, hidden text, keyword-stuffed `alt`/`title` attributes, doorway or duplicate pages, or any cloaking.

### 9.3 Canonical and language rules

- Canonical = the page's own absolute URL on `https://manuelcobos.dev`, with trailing slash. No query strings, no `index.html`.
- `<html lang="es-ES">` on Spanish pages and `<html lang="en">` on English pages. The language switch link repeats `hreflang` and `lang`.
- Every page has exactly one translation, discovered via `getAlternates()`. A missing translation fails the build.

### 9.4 Structured data (JSON-LD)

Emit one `<script type="application/ld+json">` containing an `@graph`. Everything in it must be visible on the page or on the linked pages (Google's policy). Build it from `src/data/*` in `src/lib/jsonld.ts` so that text cannot drift.

**Home (`/` and `/en/`)** graph: `WebSite`, `ProfilePage`, `Person`.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://manuelcobos.dev/#website",
      "url": "https://manuelcobos.dev/",
      "name": "Manuel Cobos Solís",
      "inLanguage": ["es-ES", "en"],
      "publisher": { "@id": "https://manuelcobos.dev/#person" }
    },
    {
      "@type": "ProfilePage",
      "@id": "https://manuelcobos.dev/#profilepage",
      "url": "https://manuelcobos.dev/",
      "name": "Manuel Cobos Solís | Desarrollador Full Stack Java y Angular",
      "inLanguage": "es-ES",
      "isPartOf": { "@id": "https://manuelcobos.dev/#website" },
      "dateModified": "2026-10-05",
      "mainEntity": { "@id": "https://manuelcobos.dev/#person" }
    },
    {
      "@type": "Person",
      "@id": "https://manuelcobos.dev/#person",
      "name": "Manuel Cobos Solís",
      "givenName": "Manuel",
      "familyName": "Cobos Solís",
      "alternateName": ["Manuel Cobos", "Manuel Cobos Solis"],
      "url": "https://manuelcobos.dev/",
      "image": "https://manuelcobos.dev/images/manuel-cobos-solis.jpg",
      "jobTitle": "Desarrollador Full Stack",
      "description": "Desarrollador Full Stack con enfoque backend (Java, Spring Boot, Kafka) y Angular, en el sector bancario. Cáceres, España. Remoto.",
      "email": "mailto:manuel.cobos.dev@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cáceres",
        "addressRegion": "Extremadura",
        "addressCountry": "ES"
      },
      "worksFor": { "@type": "Organization", "name": "Viewnext", "url": "https://www.viewnext.com/" },
      "alumniOf": [{ "@type": "EducationalOrganization", "name": "IES Ágora" }],
      "knowsLanguage": ["es", "en"],
      "knowsAbout": ["Java", "Spring Boot", "Microservicios", "APIs REST", "Apache Kafka", "RabbitMQ", "Angular", "TypeScript", "PostgreSQL", "Docker", "Kubernetes", "OpenShift", "GitHub Actions", "Arquitectura limpia"],
      "hasCredential": [
        { "@type": "EducationalOccupationalCredential", "name": "MuleSoft Certified Developer – Level 1", "credentialCategory": "certification", "recognizedBy": { "@type": "Organization", "name": "MuleSoft" } },
        { "@type": "EducationalOccupationalCredential", "name": "LPIC-1 Linux Administrator", "credentialCategory": "certification", "recognizedBy": { "@type": "Organization", "name": "Linux Professional Institute" } },
        { "@type": "EducationalOccupationalCredential", "name": "Claude Code in Action", "credentialCategory": "certificate", "recognizedBy": { "@type": "Organization", "name": "Anthropic" } }
      ],
      "sameAs": ["https://github.com/ManuelCobosDev", "https://www.linkedin.com/in/manuelcobos/"]
    }
  ]
}
```

Rules: the `Person` node is identical in structure on both languages and has the same `@id`; only `jobTitle`, `description`, `knowsAbout` labels and the `ProfilePage` fields (`url`, `name`, `inLanguage`) change with the language. `dateModified` comes from `profile.lastUpdated`. Do **not** use `ProfessionalService`, `LocalBusiness`, `Organization` for himself, `priceRange`, `aggregateRating`, `Review`, `JobPosting` or `FAQPage`.

**CV pages:** `WebPage` (with `about` = Person `@id`, `inLanguage`, `isPartOf` WebSite) plus `BreadcrumbList` (Inicio › CV) plus the same Person node.

**Work entries:** `TechArticle` (`headline` = title, `description`, `inLanguage`, `datePublished`, `dateModified`, `keywords` = stack joined by comma, `author` and `publisher` = `{"@id": ".../#person"}`, `mainEntityOfPage` = page URL, `image` = OG image URL) plus `BreadcrumbList` (Inicio › title) plus the Person node. For `kind: project` use `SoftwareSourceCode` with `codeRepository` and `programmingLanguage` instead of `TechArticle`.

### 9.5 Static SEO files

`public/robots.txt`:

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: https://manuelcobos.dev/sitemap-index.xml
```

Sitemap: produced by `@astrojs/sitemap` (index plus chunk). It must list every indexable page of both languages with `xhtml:link` alternates, exclude `/404`, and use `lastmod` = `profile.lastUpdated` (or the entry's `updatedAt`/`publishedAt`). If the integration's `serialize` hook is needed to set `lastmod`, use it.

`public/llms.txt` (plain Markdown, an emerging convention; cheap and harmless, do not claim it improves ranking):

```
# Manuel Cobos Solís

> Desarrollador Full Stack con enfoque backend (Java, Spring Boot, Kafka) y Angular, en el sector bancario. Cáceres, Extremadura, España. Trabaja en remoto. / Backend-oriented Full Stack Developer (Java, Spring Boot, Kafka) and Angular, in the banking sector. Based in Cáceres, Spain. Works remotely.

## Datos / Facts

- Nombre / Name: Manuel Cobos Solís
- Rol / Role: Desarrollador Full Stack / Full Stack Developer
- Empresa actual / Current company: Viewnext (cliente / client: Banco Santander)
- Ubicación / Location: Cáceres, Extremadura, España / Spain
- Modalidad / Work mode: 100 % remoto / fully remote
- Idiomas / Languages: español (nativo), inglés (B2) / Spanish (native), English (B2)
- Correo / Email: manuel.cobos.dev@gmail.com

## Páginas / Pages

- [Inicio](https://manuelcobos.dev/): presentación, experiencia, stack, formación y contacto
- [CV](https://manuelcobos.dev/cv/): currículum imprimible
- [Caso de estudio: microservicio orquestador](https://manuelcobos.dev/trabajo/microservicio-orquestador/)
- [English home](https://manuelcobos.dev/en/)
- [English résumé](https://manuelcobos.dev/en/cv/)
- [Case study: orchestrator microservice](https://manuelcobos.dev/en/work/orchestrator-microservice/)

## Perfiles / Profiles

- [LinkedIn](https://www.linkedin.com/in/manuelcobos/)
- [GitHub](https://github.com/ManuelCobosDev)
```

Generate the "Pages" list from the content collection at build time (use an Astro endpoint `src/pages/llms.txt.ts`) so new entries appear automatically; then do not keep a static `public/llms.txt`.

### 9.6 Open Graph images

One 1200×630 PNG per page, generated at build time by an endpoint `src/pages/og/[...slug].png.ts` with `satori` (layout as plain objects, no JSX) and `@resvg/resvg-js`, reading the `.woff` files of IBM Plex Sans (400 and 600) from `node_modules/@fontsource/ibm-plex-sans/files/`. Design: background `#0A1426`; a 6 px `#7FB0FF` vertical bar at the left edge; padding 80 px; top: "manuelcobos.dev" in 28 px `#A9B8D0`; middle: name or page title in 84 px weight 600 `#E8EEF8`, below it the role line in 40 px `#A9B8D0`; bottom: "Java · Spring Boot · Kafka · Angular" in 32 px `#7FB0FF`. Home: name and role. CV: "Currículum / Résumé" plus the name. Work entries: `seoTitle` with the name below. Routes: `/og/home-es.png`, `/og/home-en.png`, `/og/cv-es.png`, `/og/cv-en.png`, `/og/work-<slug>.png`.

Fallback if satori or resvg cannot be made to work after two attempts: generate the same layout once with `sharp` from an SVG string in `scripts/prepare-assets.mjs`, one file per page, and log the decision. Never ship without OG images.

### 9.7 Icons and manifest

- `public/favicon.svg`: a 32×32 rounded square (`rx="6"`) filled `#1D4ED8` with the letters "MC" in white, `font-family="IBM Plex Sans, Arial, sans-serif"`, weight 700, size 15, centred. Add `@media (prefers-color-scheme: dark)` inside the SVG that fills `#7FB0FF` with text `#071226`.
- `scripts/prepare-assets.mjs` renders PNGs from the SVG with `sharp`: `favicon.ico` (32 px), `apple-touch-icon.png` (180 px, solid background, no transparency), `icon-192.png`, `icon-512.png`.
- `public/manifest.webmanifest`: `name` "Manuel Cobos Solís", `short_name` "Manuel Cobos", `description` (ES home description), `start_url` "/", `display` "browser", `lang` "es-ES", `background_color` "#F5F7FB", `theme_color` "#1D4ED8", icons 192 and 512 (`purpose: "any"`).

### 9.8 Semantic HTML and headings

- One `<h1>` per page. Heading levels never skip. Home outline: h1 (name + role) › h2 per section › h3 for experience titles and work rows. Section ids are the localised anchors of section 4.2, each `<section aria-labelledby="{id}-title">`.
- Landmarks: one `<header>` (banner) containing `<nav aria-label>`, one `<main id="main">`, one `<footer>`. The ficha is part of the hero: render it as a `<section aria-labelledby>` with a visually hidden h2 whose text is `ficha.title`.
- Use `<article>` for experience entries and work pages, `<time datetime>` for all dates, `<address>` in the contact section, `<dl>` for the ficha and stack groups, `<ul>`/`<ol>` for lists, `<figure>`/`<figcaption>` for the diagram.
- The first 150 words of the home page text (hero + ficha + start of About) contain: the name, the role, Java, Spring Boot, Angular, Kafka, RabbitMQ, banking sector, Viewnext, Cáceres, remote.

### 9.9 Images

- Source `src/assets/manuel-cobos-solis.png`. In the ficha use `<Picture>` (AVIF, WebP, JPEG fallback) at widths 320, 480, 640, `sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"`, `loading="eager"`, `fetchpriority="high"`, `decoding="async"`, explicit `width`/`height` matching the 5/4 crop, descriptive alt (section 8.2).
- `scripts/prepare-assets.mjs` also writes `public/images/manuel-cobos-solis.jpg` (800×800, quality 82, `mozjpeg`) for JSON-LD and external consumers.
- Every `<img>` has `alt` (decorative ones `alt=""` plus `aria-hidden` where applicable), `width` and `height`.

### 9.10 Links

- Internal links are root-relative with trailing slash. External links to profiles use `rel="me noopener noreferrer"` (footer and hero text links) or `rel="noopener noreferrer"` (others) and `target="_blank"`.
- No `nofollow` on his own profiles. No links to third-party trackers.
- The footer on every page links to: home, CV, LinkedIn, GitHub, and the other language.

---

## 10. PERFORMANCE RULES

1. All CSS is inlined in each page (`inlineStylesheets: 'always'`). Total CSS ≤ 30 KB gzip per page. No render-blocking external requests.
2. Fonts: self-hosted, Latin subset, `woff2`, `font-display: swap`, two or three preloads at most. No icon fonts.
3. The only raster image on the home page is the portrait. Everything else is text or inline SVG.
4. No layout shift: reserve space for the portrait via aspect ratio, define font fallbacks, never insert content above existing content after load.
5. JavaScript budget ≤ 10 KB gzip total, loaded as small module scripts. No hydration. No analytics. No third-party scripts.
6. Do not use `loading="lazy"` on the portrait; do not use it on anything above the fold.
7. `public/_headers` (section 13.3) documents cache and security headers for hosts that support them. GitHub Pages ignores this file; that is expected.
8. Run a production build (`astro build` + `astro preview`) for every measurement. Never measure the dev server.

---

## 11. ACCESSIBILITY RULES (WCAG 2.2 AA)

- Skip link as the first focusable element, visible on focus, target `#main`.
- Full keyboard operation in a logical order. Visible focus ring everywhere (section 6.6). No keyboard traps; the `<details>` menu closes with Escape through a tiny script that returns focus to the summary.
- All interactive targets ≥ 44×44 px (inline text links in paragraphs are exempt).
- Contrast ≥ 4.5:1 for text, ≥ 3:1 for UI components and focus indicators, in both themes.
- Colour is never the only carrier of meaning (the current section also gets an underline and `aria-current`).
- Landmarks, headings and lists as in 9.8. Icons are `aria-hidden`; icon-only buttons have an accessible name.
- `prefers-reduced-motion: reduce` disables all animation and smooth scrolling. `prefers-color-scheme` is honoured by default.
- Text can be resized to 200 % and reflow at 320 px width without horizontal scroll and without loss of content.
- Language of parts: the language switch link and any English phrase inside Spanish text carry `lang`.
- External links announce "opens in a new tab" via visually hidden text.
- The copy-email button announces success through an `aria-live="polite"` region.
- The `WorkDiagram` has a text alternative (figcaption) and its boxes are readable text, not images.


---

## 12. QUALITY GATES

### 12.1 `scripts/qa.mjs` (Node, `cheerio`, runs against `dist/`)

It must exit with a non-zero code and print a readable list of failures if any of the following is violated. Implement every check.

**Per HTML page (except `404.html` where noted):**

1. Exactly one `<h1>`; heading levels never skip.
2. `<title>` present, 25 to 65 characters; `<meta name="description">` present, 100 to 160 characters; both unique across the site.
3. `<link rel="canonical">` is absolute, starts with `https://manuelcobos.dev/`, ends with `/` (or is the 404), and equals the page's own URL.
4. `<html lang>` is `es-ES` or `en` and matches the URL prefix.
5. Three `hreflang` links (`es-ES`, `en`, `x-default`) exist, are absolute, and are reciprocal: the target page links back to this page.
6. `og:title`, `og:description`, `og:url`, `og:image`, `og:image:width/height/alt`, `twitter:card` exist; the `og:image` file exists in `dist` and is exactly 1200×630 (check with `sharp`).
7. Every `<script type="application/ld+json">` parses as JSON; each `@graph` node has `@type`; all URLs inside are absolute; `@id` values are unique; the Person node contains `name` "Manuel Cobos Solís", `sameAs` with the GitHub and LinkedIn URLs, and `address.addressLocality` "Cáceres".
8. Every `<img>` has `alt`, `width` and `height`. Decorative SVG icons have `aria-hidden="true"`.
9. Exactly one `<main>`, one banner `<header>`, one `<footer>`, and at least one `<nav>` with an `aria-label`.
10. Every internal `href` (root-relative) resolves to a file or directory index in `dist`; every `#fragment` exists as an `id` in the target page.
11. Every `target="_blank"` link has `rel` containing `noopener`.
12. No `<script src>`, `<link rel=stylesheet href>`, `<img src>`, `<source srcset>` or font URL points to a host other than the site itself.
13. The visible text contains none of: `lorem`, `ipsum`, `TODO`, `FIXME`, `example.com`, `undefined`, `[object Object]`, `NaN`, `manuelcobos200324`, `ManuelCobos24`, `Proiectus`, `coming soon`, `próximamente`, `under construction`, `en construcción`.
14. Home pages contain the strings "Manuel Cobos Solís", "Cáceres", "Viewnext", "Banco Santander", "Spring Boot", "Angular" in visible text.
15. Hidden-section rule: if there are no `project` entries, the string `id="proyectos"` / `id="projects"` does not appear, and neither does a nav link to it.
16. The 404 page has `noindex`.

**Site level:**

17. `sitemap-index.xml` exists, references existing sitemap files, and the union of their URLs equals the set of indexable pages (no 404, no noindex). Each URL has `xhtml:link` alternates.
18. `robots.txt` exists, allows `*`, and references the sitemap index.
19. `llms.txt` exists and every URL in it resolves to a page in `dist`.
20. `manifest.webmanifest` parses and its icons exist.
21. `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `images/manuel-cobos-solis.jpg` exist.
22. `CNAME` exists in `dist` and contains `manuelcobos.dev`.
23. Budgets (settled by the audit decision F-05): the transferred size is what matters, so the per-page document (HTML **including** inlined CSS and JSON-LD) must be ≤ 35 KB gzip and ≤ 110 KB raw as a sanity cap; total JavaScript in `dist` ≤ 10 KB gzip; total font files ≤ 100 KB; no file in `dist/_astro` larger than 120 KB except fonts.
24. Spanish and English home pages have the same set of section ids (translated) and the same number of experience entries, stack groups and education rows.

### 12.2 Playwright end-to-end tests (`tests/e2e`)

Run against `astro preview`. If no browser can be launched in the environment, record that in `PROGRESS.md` and keep the tests in the repo.

- **No horizontal overflow** at 360, 390, 768, 1024, 1280, 1536 px, in light and dark, on `/`, `/en/`, `/cv/`, `/trabajo/microservicio-orquestador/`.
- **axe-core** (`@axe-core/playwright`) reports zero violations for WCAG 2.2 A/AA tags on the same pages and viewports.
- **JavaScript disabled:** the home page still shows all sections, the nav links work (menu `<details>` opens), and the content is present.
- **Theme:** with `colorScheme: 'dark'` the page renders dark; the toggle switches and the choice persists after reload; no flash of the wrong theme (the `data-theme` attribute is set before first paint).
- **Language switch:** from `/` the "EN" link leads to `/en/`, and back; the case study switch leads to its translation.
- **Keyboard:** Tab order starts at the skip link, reaches every interactive control, focus is always visible.
- **Reduced motion:** with `reducedMotion: 'reduce'` no animation runs (computed `animation-name` is `none` for the animated elements).
- **Copy email:** clicking the button writes the address to the clipboard and announces success.
- **Touch targets:** every button and nav link measures ≥ 44×44 px at 390 px width.

### 12.3 Lighthouse CI (`lighthouserc.json`)

Collect against `astro preview` for `/`, `/en/`, `/cv/` and the Spanish case study, mobile preset, 3 runs each. Assertions: performance ≥ 0.98 (warn at 0.95), accessibility = 1, best-practices = 1, seo = 1; `largest-contentful-paint` ≤ 1800 ms, `cumulative-layout-shift` ≤ 0.02, `total-blocking-time` ≤ 50 ms. If Chrome is unavailable, say so; do not invent scores.

### 12.4 External validators the user will run after deployment

(Put them in `docs/LAUNCH-CHECKLIST.md`; you cannot run them offline.) Google Rich Results Test, Schema Markup Validator (validator.schema.org), PageSpeed Insights, Google Search Console URL Inspection, Bing Webmaster Tools, LinkedIn Post Inspector, WebAIM contrast checker.

---

## 13. DEPLOYMENT AND DOCUMENTATION

### 13.1 GitHub Actions: `.github/workflows/deploy.yml`

Use the current major versions of the official actions (verify on their release pages if you have network access).

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:
  schedule:
    - cron: '0 6 1 * *'   # monthly rebuild keeps computed values (years, footer date) fresh

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm run qa
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 13.2 Domain

`public/CNAME` contains exactly `manuelcobos.dev` (no protocol, no trailing newline issues). The site assumes the apex domain is canonical; `www` must redirect to the apex at DNS/host level (documented in the checklist).

### 13.3 `public/_headers` (applies only on hosts that read it, such as Cloudflare Pages or Netlify)

```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: frame-ancestors 'self'

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=2592000

/og/*
  Cache-Control: public, max-age=86400
```

### 13.4 Documents you must write

- `README.md`: what the project is, commands, folder map, **how to edit content** (which file holds what, in one table), **how to add a project** (section 4.3), how to update `profile.lastUpdated` (bump it whenever content changes; it feeds `dateModified` and the sitemap), how to add the CV PDF, how to set the verification env variables, and how the monthly rebuild works.
- `docs/LAUNCH-CHECKLIST.md`, with checkbox steps for the user, in this order:
  1. Create the repository `ManuelCobosDev/manuelcobos.dev`, push, enable Pages with source "GitHub Actions".
  2. Move the custom domain: remove `manuelcobos.dev` from the old Pages repository (`manuelcobos24.github.io`), set it in the new repository, tick "Enforce HTTPS", keep the existing DNS records for GitHub Pages, and add a GitHub account-level verified domain if possible.
  3. Configure `www` → apex redirect.
  4. Google Search Console: add the domain property (DNS TXT verification), submit `https://manuelcobos.dev/sitemap-index.xml`, use URL Inspection → Request indexing for `/`, `/en/`, `/cv/` and the case study.
  5. Bing Webmaster Tools: import from Search Console; submit the sitemap.
  6. Run the validators of section 12.4.
  7. Update backlinks and identity signals so they all point to `https://manuelcobos.dev/` and use the exact name "Manuel Cobos Solís": GitHub profile "Website" field and bio, LinkedIn "Contact info → Website" and About, the GitHub profile README links, certification profiles (MuleSoft, LPI, Anthropic) when they allow a website field.
  8. Check the old site: make sure `manuelcobos24.github.io` and any old URLs no longer serve outdated content (archive or delete the old repository, or leave a single redirect page).
  9. After 1 to 2 weeks check Search Console → Pages (indexed?) and Performance (queries). Monthly: bump `lastUpdated` when something changes.
  10. Optional growth, outside this project: technical articles, a public repository with a demo, speaking or community profiles; each adds independent signals that help ranking for the name.

---

## 14. EXECUTION PLAN (PHASES)

Complete the phases in order. Each phase ends with: build passes, `astro check` clean, `PROGRESS.md` updated, one git commit. Do not start the next phase with a failing build.

| Phase | Work | Done when |
|---|---|---|
| 0. Bootstrap | Save the brief to `docs/BRIEF.md`; initialise git; create the Astro project (minimal template, TypeScript strict), install the dependencies of 5.2, create the folder structure of 5.4, config files, `.nvmrc`, `.prettierrc`, `.gitignore`, `PROGRESS.md` | `npm run build` succeeds on an empty page; versions of Node, Astro, Tailwind recorded in `PROGRESS.md` |
| 1. Foundation | `global.css` with tokens, fonts, base styles, motion keyframes; `BaseLayout`, `Seo` (basic), `Header`, `NavMenu`, `LangSwitch`, `ThemeToggle`, `Footer`, `SkipLink`; theme init script; i18n utilities and `ui.ts` | Both languages render an empty shell with working navigation, theme toggle, language switch and focus styles |
| 2. Data and home | `src/data/*`, `Hero`, `Ficha`, `About`, `Experience`, `StackCore`, `StackGroups`, `Education`, `Contact`, `CopyEmail`, `TechIcon`, section shell and numbering, conditional sections logic, all copy of section 8 | Home renders completely in ES and EN, layouts follow 6.7 at all six widths, no horizontal overflow |
| 3. Work | `content.config.ts`, both case study files, `WorkList`, `WorkDiagram`, `WorkPage`, routes, breadcrumbs, template file, build-fail on missing translation | Case study pages exist in both languages; the Projects section does not render; adding a draft `project` locally makes it render (then remove it) |
| 4. CV | `CvPage`, print stylesheet, conditional PDF button | `/cv/` and `/en/cv/` print to two A4 pages or fewer in Chromium print emulation (if available) |
| 5. SEO layer | Full `Seo`, `JsonLd` builders, sitemap, `robots.txt`, `llms.txt` endpoint, OG endpoint, icons, manifest, 404, `_headers`, `prepare-assets.mjs` | All SEO-related checks of 12.1 pass |
| 6. Motion and polish | Rise-in, scroll reveal, hover states, active-section script, view transitions; spacing/typographic pass against section 6 | Motion works only with `prefers-reduced-motion: no-preference`; h1, lead and portrait are not animated |
| 7. Test tooling | `qa.mjs`, Playwright tests, `lighthouserc.json`, `playwright.config.ts` | `npm run qa` passes; tests run (or the limitation is documented) |
| 8. Fix loop | Run Lighthouse and axe; fix until the targets of 1.1 are met; re-run all checks | Targets met with real numbers recorded in `PROGRESS.md` |
| 9. Docs and delivery | `README.md`, `docs/LAUNCH-CHECKLIST.md`, `deploy.yml`, final `npm run verify` | Everything in section 15 reported |

---

## 15. FINAL REPORT (your last message)

Reply with, in this order and in plain language: (1) one-paragraph summary of what was built; (2) the real measured numbers (Lighthouse per page, JS and CSS sizes, total transfer for home); (3) the list of pages and URLs; (4) decisions you took that the brief left open; (5) open issues and anything you could not verify (be explicit: for example "no browser available, Playwright and Lighthouse not run"); (6) the exact steps the user must do next, pointing to `docs/LAUNCH-CHECKLIST.md`. Do not claim anything that you did not run.

---

## 16. COMMON PITFALLS: READ BEFORE CODING

- Tailwind v4: use `@import "tailwindcss";` and `@theme`. There is no `tailwind.config.js`, no `@tailwind base/components/utilities`, and no `@astrojs/tailwind`. Utilities such as `bg-opacity-*` no longer exist; use `bg-accent/50`.
- Astro: content collections use `src/content.config.ts` and the Content Layer `glob` loader; use `getCollection` and `render(entry)` (from `astro:content`), never `Astro.glob`. With `trailingSlash: 'always'`, generate links with the trailing slash.
- `i18n.routing.prefixDefaultLocale: false` means Spanish lives at `/` and English at `/en/`; do not create `/es/`.
- `@astrojs/sitemap` needs `site` to be set and outputs `sitemap-index.xml` and `sitemap-0.xml`.
- Images: import the asset (`import portrait from '../assets/manuel-cobos-solis.png'`) and pass it to `<Picture>`/`<Image>`; do not reference `src/assets` by string.
- Scripts in `.astro` files are bundled and deduplicated by default; the theme-init script needs `is:inline`.
- `astro-icon` icon names look like `lucide:sun`; icons not included in the `include` list are not bundled in production.
- Do not use CSS `@import` of remote URLs, `<link>` to Google Fonts, or `<script src="https://…">`.
- Do not generate fake content to fill space. An absent section is correct; a fake one is a failure.
- Do not use the words "senior", "junior", "expert", "guru", "ninja", "passionate" anywhere in the copy.
- If the build or a check fails, read the actual error and fix the cause. Do not disable checks, lower thresholds, add `// @ts-ignore`, or set `ignoreBuildErrors` to make something pass.
- Keep commits small and the working tree clean. Never commit `node_modules`, `dist` or `.astro`.

END OF BRIEF.
