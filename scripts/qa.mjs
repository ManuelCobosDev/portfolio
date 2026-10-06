/**
 * Quality gates for the built site. Runs against dist/ and exits non-zero on
 * any failure.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import * as cheerio from 'cheerio';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const SITE = 'https://manuelcobos.dev';

const failures = [];
const fail = (msg) => failures.push(msg);

const gzip = (buf) => gzipSync(buf).length;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const allFiles = walk(dist);
const htmlFiles = allFiles.filter((f) => f.endsWith('.html'));

function urlOfFile(file) {
  let rel = relative(dist, file).split(sep).join('/');
  if (rel === '404.html') return `${SITE}/404.html`;
  if (rel === 'index.html') return `${SITE}/`;
  if (rel.endsWith('/index.html')) {
    const dir = rel.slice(0, -'index.html'.length);
    return `${SITE}/${dir}`;
  }
  return `${SITE}/${rel}`;
}

const FORBIDDEN_CI = [
  'lorem',
  'ipsum',
  'example.com',
  '[object object]',
  'manuelcobos200324',
  'manuelcobos24',
  'proiectus',
  'coming soon',
  'próximamente',
  'under construction',
  'en construcción',
];

const FORBIDDEN_CS = ['TODO', 'FIXME', 'NaN', 'undefined'];

// Load all pages
const pages = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  const $ = cheerio.load(html);
  pages.push({ file, url: urlOfFile(file), $, html, is404: file.endsWith(join(dist, '404.html')) });
}
const byUrl = new Map(pages.map((p) => [p.url, p]));

const jsonLdFromPage = (p) => {
  const nodes = [];
  p.$('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse(p.$(el).html());
      nodes.push(data);
    } catch (err) {
      fail(`${p.url}: JSON-LD does not parse: ${err.message}`);
    }
  });
  return nodes;
};

// Per-page checks
const titles = [];
const descriptions = [];
for (const p of pages) {
  const $ = p.$;
  const isHome = p.url === `${SITE}/` || p.url === `${SITE}/en/`;

  if (p.is404) {
    const robots = $('meta[name="robots"]').attr('content') ?? '';
    if (!robots.includes('noindex')) fail(`${p.url}: 404 page must be noindex.`);
    continue;
  }

  // 1. Headings
  const headings = [];
  $('h1,h2,h3,h4,h5,h6').each((_, el) => headings.push(Number(el.tagName[1])));
  const h1Count = headings.filter((h) => h === 1).length;
  if (h1Count !== 1) fail(`${p.url}: expected exactly one h1, found ${h1Count}.`);
  for (let i = 0; i < headings.length - 1; i++) {
    if (headings[i + 1] > headings[i] + 1) {
      fail(`${p.url}: heading level skips from h${headings[i]} to h${headings[i + 1]}.`);
    }
  }

  // 2. Title and description
  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content') ?? '';
  if (title.length < 25 || title.length > 65) fail(`${p.url}: title length ${title.length} out of 25–65.`);
  if (description.length < 100 || description.length > 160) {
    fail(`${p.url}: meta description length ${description.length} out of 100–160.`);
  }
  titles.push(title);
  descriptions.push(description);

  // 3. Canonical
  const canonical = $('link[rel="canonical"]').attr('href') ?? '';
  if (!canonical.startsWith(`${SITE}/`)) fail(`${p.url}: canonical "${canonical}" not on site domain.`);
  if (canonical !== p.url) fail(`${p.url}: canonical "${canonical}" does not equal own URL.`);

  // 4. html lang
  const lang = $('html').attr('lang') ?? '';
  const expectedLang = p.url.startsWith(`${SITE}/en/`) ? 'en' : 'es-ES';
  if (lang !== expectedLang) fail(`${p.url}: html lang "${lang}" expected "${expectedLang}".`);

  // 5. hreflang reciprocity
  const hreflangs = [];
  $('link[rel="alternate"][hreflang]').each((_, el) => {
    hreflangs.push({ lang: $(el).attr('hreflang'), href: $(el).attr('href') });
  });
  for (const need of ['es-ES', 'en', 'x-default']) {
    if (!hreflangs.some((h) => h.lang === need)) fail(`${p.url}: missing hreflang "${need}".`);
  }
  for (const h of hreflangs) {
    if (!h.href?.startsWith(SITE)) fail(`${p.url}: hreflang "${h.lang}" not absolute.`);
    const target = byUrl.get(h.href);
    if (!target) {
      fail(`${p.url}: hreflang target ${h.href} does not exist.`);
    } else {
      const back = [];
      target.$('link[rel="alternate"][hreflang]').each((_, el) => back.push(target.$(el).attr('href')));
      if (!back.includes(p.url)) fail(`${p.url}: hreflang ${h.href} does not link back.`);
    }
  }

  // 6. OG and Twitter
  for (const sel of [
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:url"]',
    'meta[property="og:image"]',
    'meta[property="og:image:width"]',
    'meta[property="og:image:height"]',
    'meta[property="og:image:alt"]',
    'meta[name="twitter:card"]',
  ]) {
    if (!$(sel).attr('content')) fail(`${p.url}: missing ${sel}.`);
  }
  const ogImage = $('meta[property="og:image"]').attr('content') ?? '';
  const ogImageFile = join(dist, ogImage.replace(SITE, '').split('/').filter(Boolean).join(sep));
  if (existsSync(ogImageFile)) {
    try {
      const meta = await sharp(ogImageFile).metadata();
      if (meta.width !== 1200 || meta.height !== 630) {
        fail(`${p.url}: og:image ${ogImage} is ${meta.width}x${meta.height}, expected 1200x630.`);
      }
    } catch {
      fail(`${p.url}: og:image ${ogImage} cannot be read.`);
    }
  } else {
    fail(`${p.url}: og:image ${ogImage} file missing in dist.`);
  }

  // 7. JSON-LD
  const jsonLd = jsonLdFromPage(p);
  if (jsonLd.length === 0) fail(`${p.url}: no JSON-LD present.`);
  const ids = new Set();
  for (const doc of jsonLd) {
    const graph = doc['@graph'] ?? [doc];
    for (const node of graph) {
      if (!node['@type']) fail(`${p.url}: JSON-LD node missing @type.`);
      if (node['@id']) {
        if (ids.has(node['@id'])) fail(`${p.url}: duplicate JSON-LD @id ${node['@id']}.`);
        ids.add(node['@id']);
      }
      const str = JSON.stringify(node);
      const urls = str.match(/"https?:\/\/[^"]+"/g) ?? [];
      for (const u of urls) {
        if (!u.startsWith('"http')) fail(`${p.url}: JSON-LD URL not absolute: ${u}`);
      }
      if (node['@type'] === 'Person') {
        if (node.name !== 'Manuel Cobos Solís') fail(`${p.url}: Person name incorrect.`);
        const sameAs = JSON.stringify(node.sameAs ?? []);
        if (!sameAs.includes('github.com/ManuelCobosDev') || !sameAs.includes('linkedin.com/in/manuelcobos')) {
          fail(`${p.url}: Person sameAs missing profiles.`);
        }
        if (node.address?.addressLocality !== 'Cáceres') fail(`${p.url}: Person addressLocality incorrect.`);
      }
    }
  }

  // 8. Images
  $('img').each((_, el) => {
    if (!$(el).attr('alt') && $(el).attr('alt') !== '') fail(`${p.url}: img missing alt.`);
    if (!$(el).attr('width') || !$(el).attr('height')) fail(`${p.url}: img missing width/height.`);
  });
  $('svg[aria-hidden="true"]').each(() => {});

  // 9. Landmarks
  if ($('main').length !== 1) fail(`${p.url}: expected exactly one <main>.`);
  if ($('header').length !== 1) fail(`${p.url}: expected exactly one banner <header>.`);
  if ($('footer').length !== 1) fail(`${p.url}: expected exactly one <footer>.`);
  if ($('nav[aria-label]').length < 1) fail(`${p.url}: missing nav with aria-label.`);

  // 10. Internal links
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (!href.startsWith('/') && !href.startsWith('#')) {
      fail(`${p.url}: unexpected relative link "${href}".`);
      return;
    }
    if (href.startsWith('/')) {
      const [pathPart, fragment] = href.split('#');
      const targetUrl = `${SITE}${pathPart === '' ? '/' : pathPart}`;
      const target = byUrl.get(targetUrl);
      if (!target) {
        const rel = pathPart.replace(/^\//, '');
        const file = rel === '' || rel.endsWith('/') ? join(dist, rel, 'index.html') : join(dist, rel);
        if (!existsSync(file)) fail(`${p.url}: internal link ${href} resolves to nothing.`);
        return;
      }
      if (fragment && !target.$(`#${fragment}`).length) {
        fail(`${p.url}: fragment "#${fragment}" missing in ${targetUrl}.`);
      }
    } else if (href.startsWith('#') && href.length > 1) {
      if (!$(`#${href.slice(1)}`).length) fail(`${p.url}: fragment "${href}" missing on own page.`);
    }
  });

  // 11. target=_blank rel noopener
  $('a[target="_blank"]').each((_, el) => {
    const rel = $(el).attr('rel') ?? '';
    if (!rel.includes('noopener')) fail(`${p.url}: target=_blank link missing noopener.`);
  });

  // 12. No third-party asset hosts
  for (const sel of ['script[src]', 'link[rel="stylesheet"][href]', 'img[src]', 'source[srcset]']) {
    $(sel).each((_, el) => {
      const val = $(el).attr('src') ?? $(el).attr('href') ?? $(el).attr('srcset') ?? '';
      if (val.startsWith('http') && !val.startsWith(SITE)) fail(`${p.url}: third-party asset "${val}".`);
    });
  }

  // 13. Forbidden strings in visible text
  const text = $('body').text();
  const lowText = text.toLowerCase();
  for (const word of FORBIDDEN_CI) {
    if (lowText.includes(word)) fail(`${p.url}: forbidden string "${word}" in visible text.`);
  }
  for (const word of FORBIDDEN_CS) {
    if (text.includes(word)) fail(`${p.url}: forbidden string "${word}" in visible text.`);
  }

  // 14. Home content
  if (isHome) {
    for (const word of ['Manuel Cobos Solís', 'Cáceres', 'Viewnext', 'Banco Santander', 'Spring Boot', 'Angular']) {
      if (!$('body').text().includes(word)) fail(`${p.url}: home missing "${word}".`);
    }
  }

  // 15. Hidden-section rule (no project entries at launch)
  if ($('#proyectos').length || $('#projects').length) {
    fail(`${p.url}: unexpected "proyectos"/"projects" section rendered.`);
  }
}

// 2b. Unique titles/descriptions
if (new Set(titles).size !== titles.length) fail('Duplicate <title> values across site.');
if (new Set(descriptions).size !== descriptions.length) fail('Duplicate meta description values across site.');

// Site-level checks

// 17. Sitemap
const sitemapIndex = join(dist, 'sitemap-index.xml');
if (!existsSync(sitemapIndex)) {
  fail('sitemap-index.xml missing.');
} else {
  const indexXml = readFileSync(sitemapIndex, 'utf-8');
  const $s = cheerio.load(indexXml, { xmlMode: true });
  const sitemapLocs = [];
  $s('sitemap loc').each((_, el) => sitemapLocs.push($s(el).text()));
  if (sitemapLocs.length === 0) fail('sitemap-index.xml references no sitemaps.');
  const urlEntries = [];
  for (const loc of sitemapLocs) {
    const file = join(dist, loc.replace(SITE, '').split('/').filter(Boolean).join(sep));
    if (!existsSync(file)) {
      fail(`sitemap references missing file ${loc}.`);
      continue;
    }
    const xml = readFileSync(file, 'utf-8');
    for (const block of xml.split('<url>').slice(1)) {
      const url = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
      const alternates = [...block.matchAll(/<xhtml:link[^>]*href="([^"]+)"/g)].map((m) => m[1]);
      urlEntries.push({ url, alternates });
    }
  }
  const indexable = pages.filter((p) => !p.is404 && !p.url.endsWith('404.html')).map((p) => p.url);
  const sitemapUrls = urlEntries.map((e) => e.url);
  const missing = indexable.filter((u) => !sitemapUrls.includes(u));
  const extra = sitemapUrls.filter((u) => !indexable.includes(u));
  if (missing.length) fail(`Sitemap missing URLs: ${missing.join(', ')}`);
  if (extra.length) fail(`Sitemap has extra URLs: ${extra.join(', ')}`);
  for (const e of urlEntries) {
    if (!e.alternates.includes(e.url)) fail(`Sitemap entry ${e.url} missing xhtml:link alternates.`);
  }
}

// 18. robots.txt
const robotsFile = join(dist, 'robots.txt');
if (!existsSync(robotsFile)) fail('robots.txt missing.');
else {
  const robots = readFileSync(robotsFile, 'utf-8');
  if (!robots.includes('User-agent: *')) fail('robots.txt missing User-agent: *.');
  if (!robots.includes('sitemap-index.xml')) fail('robots.txt missing sitemap reference.');
  if (/^\s*Disallow\s*:/im.test(robots)) fail('robots.txt must not contain a Disallow rule.');
}

// 19. llms.txt
const llmsFile = join(dist, 'llms.txt');
if (!existsSync(llmsFile)) fail('llms.txt missing.');
else {
  const llms = readFileSync(llmsFile, 'utf-8');
  const urls = llms.match(/https:\/\/manuelcobos\.dev[^\s)]+/g) ?? [];
  for (const url of urls) {
    const clean = url.replace(/[).,]$/, '');
    const rel = clean.slice(SITE.length).replace(/^\//, '');
    const target = rel === '' || rel.endsWith('/') ? join(dist, rel, 'index.html') : join(dist, rel);
    if (!byUrl.has(clean) && !existsSync(target)) fail(`llms.txt URL ${clean} does not resolve.`);
  }
}

// 20. manifest
const manifestFile = join(dist, 'manifest.webmanifest');
if (!existsSync(manifestFile)) fail('manifest.webmanifest missing.');
else {
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf-8'));
  for (const icon of manifest.icons ?? []) {
    if (!existsSync(join(dist, icon.src.replace(/^\//, '')))) fail(`manifest icon ${icon.src} missing.`);
  }
}

// 21. Static files
for (const f of [
  'favicon.svg',
  'favicon.ico',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'images/manuel-cobos-solis.jpg',
]) {
  if (!existsSync(join(dist, f))) fail(`missing static file: ${f}.`);
}

// 21d. No HTML comments in the built output.
for (const p of pages) {
  if (p.html.includes('<!--')) fail(`${p.url}: built HTML contains an HTML comment.`);
}

// 22. Cloudflare _headers
const headersFile = join(dist, '_headers');
if (!existsSync(headersFile)) {
  fail('_headers missing.');
} else {
  const lines = readFileSync(headersFile, 'utf-8').split(/\r?\n/);
  const rules = lines.filter((line) => line.trim() && !/^\s/.test(line));
  if (rules.length >= 100) fail(`_headers declares ${rules.length} rules (limit 100).`);
  if (lines.some((line) => line.length > 2000)) fail('_headers contains a line over 2000 characters.');

  const raw = lines.join('\n');
  for (const rule of [
    'X-Content-Type-Options: nosniff',
    "Content-Security-Policy: default-src 'self'",
    'X-Robots-Tag: noindex',
    '/_astro/*',
    '/fonts/*',
    '/cv/Manuel-Cobos-Solis-CV-ES.pdf',
    '/cv/Manuel-Cobos-Solis-CV-EN.pdf',
  ]) {
    if (!raw.includes(rule)) fail(`_headers is missing "${rule}".`);
  }
}

// 22b. Cloudflare serves 404.html for unknown URLs; it must stay out of the index.
const notFoundFile = join(dist, '404.html');
if (!existsSync(notFoundFile)) {
  fail('404.html missing.');
} else {
  const $404 = cheerio.load(readFileSync(notFoundFile, 'utf-8'));
  const robots = $404('meta[name="robots"]').attr('content') ?? '';
  if (!robots.includes('noindex')) fail('404.html must be noindex.');
}

// 22c. No redirects file is needed with the Cloudflare Git integration.
if (existsSync(join(dist, '_redirects'))) fail('_redirects must not be present.');

// 21b. favicon.ico is a valid ICO (ICONDIR header, one 32x32 image).
const icoFile = join(dist, 'favicon.ico');
if (existsSync(icoFile)) {
  const ico = readFileSync(icoFile);
  const validHeader =
    ico.length >= 22 && ico.readUInt16LE(0) === 0 && ico.readUInt16LE(2) === 1 && ico.readUInt16LE(4) >= 1;
  const w = ico.length >= 7 ? ico.readUInt8(6) : 0;
  const h = ico.length >= 8 ? ico.readUInt8(7) : 0;
  if (!validHeader) fail('favicon.ico: invalid ICONDIR header.');
  else if (w !== 32 || h !== 32) fail(`favicon.ico: first image is ${w}x${h}, expected 32x32.`);
}

// 21c. In CI the real portrait is mandatory.
if (process.env.CI === 'true') {
  const portraitSrc = join(root, 'src', 'assets', 'manuel-cobos-solis.png');
  if (!existsSync(portraitSrc)) fail('src/assets/manuel-cobos-solis.png missing (required in CI).');
}

// 23. Budgets — document (HTML incl. inlined CSS and JSON-LD).
let jsGz = 0;
const jsSeen = new Set();
for (const p of pages) {
  const raw = Buffer.byteLength(p.html);
  const gz = gzip(Buffer.from(p.html));
  if (gz > 35 * 1024) fail(`${p.url}: document ${gz} bytes gzip > 35 KB.`);
  if (raw > 110 * 1024) fail(`${p.url}: document ${raw} bytes raw > 110 KB.`);
  const blocks = p.html.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g);
  for (const m of blocks) {
    const body = m[1];
    if (!body.trim() || jsSeen.has(body)) continue;
    jsSeen.add(body);
    jsGz += gzip(Buffer.from(body));
  }
}
for (const f of allFiles) {
  if (f.endsWith('.js')) jsGz += gzip(readFileSync(f));
  const rel = relative(dist, f);
  if (rel.startsWith('_astro') && statSync(f).size > 120 * 1024 && !rel.includes('font')) {
    fail(`${rel}: file in _astro exceeds 120 KB.`);
  }
}
if (jsGz > 10 * 1024) fail(`Total JS ${jsGz} bytes gzip > 10 KB.`);

let fontBytes = 0;
for (const f of allFiles) {
  if (/\.woff2?$/.test(f)) fontBytes += statSync(f).size;
}
if (fontBytes > 100 * 1024) fail(`Font files total ${fontBytes} bytes > 100 KB.`);

// 24. ES/EN home parity
const esHome = byUrl.get(`${SITE}/`);
const enHome = byUrl.get(`${SITE}/en/`);
if (esHome && enHome) {
  const count = (p, sel) => p.$(sel).length;
  const pairs = [
    ['section[id]', 'section[id]'],
    ['section[id] article', 'section[id] article'],
    ['section[id] dl > div', 'section[id] dl > div'],
  ];
  for (const [a, b] of pairs) {
    if (count(esHome, a) !== count(enHome, b)) {
      fail(`Home parity: ES "${a}" (${count(esHome, a)}) != EN "${b}" (${count(enHome, b)}).`);
    }
  }
}

// 25. Critical personal facts
const FACT_SCOPES = {
  home: { es: ['/'], en: ['/en/'] },
  cv: { es: ['/cv/'], en: ['/en/cv/'] },
  'home+cv': { es: ['/', '/cv/'], en: ['/en/', '/en/cv/'] },
  work: { es: ['/trabajo/microservicio-orquestador/'], en: ['/en/work/orchestrator-microservice/'] },
  all: {
    es: ['/', '/cv/', '/trabajo/microservicio-orquestador/'],
    en: ['/en/', '/en/cv/', '/en/work/orchestrator-microservice/'],
  },
};

const FACTS = [
  { id: 'name', es: 'Manuel Cobos Solís', en: 'Manuel Cobos Solís', scope: 'all', caseSensitive: true },
  {
    id: 'role',
    es: 'Desarrollador Full Stack con enfoque backend',
    en: 'Backend-oriented Full Stack Developer',
    scope: 'home',
  },
  { id: 'city', es: 'Cáceres, Extremadura, España', en: 'Cáceres, Extremadura, Spain', scope: 'home+cv' },
  { id: 'remote', es: '100 % remoto', en: 'fully remote', scope: 'home+cv' },
  { id: 'employer', es: 'Viewnext', en: 'Viewnext', scope: 'home+cv' },
  { id: 'client', es: 'Banco Santander', en: 'Banco Santander', scope: 'home+cv' },
  { id: 'role1', es: 'Full Stack Developer', en: 'Full Stack Developer', scope: 'home+cv' },
  { id: 'backend', es: 'Spring Boot', en: 'Spring Boot', scope: 'home+cv' },
  { id: 'frontend', es: 'TypeScript', en: 'TypeScript', scope: 'home+cv' },
  { id: 'messaging', es: 'Apache Kafka', en: 'Apache Kafka', scope: 'home+cv' },
  { id: 'devops', es: 'Kubernetes', en: 'Kubernetes', scope: 'home+cv' },
  { id: 'email', es: 'manuel.cobos.dev@gmail.com', en: 'manuel.cobos.dev@gmail.com', scope: 'home+cv' },
  {
    id: 'edu1',
    es: 'Técnico Superior en Desarrollo de Aplicaciones Web (DAW)',
    en: 'Higher Technical Degree in Web Application Development (DAW)',
    scope: 'home+cv',
  },
  {
    id: 'cert1',
    es: 'MuleSoft Certified Developer – Level 1',
    en: 'MuleSoft Certified Developer – Level 1',
    scope: 'home+cv',
  },
  { id: 'status', es: 'Abierto a oportunidades', en: 'Open to opportunities', scope: 'home' },
];

const NEGATIVE_FACTS = [
  'manuelcobos200324',
  'ManuelCobos24',
  'ProfessionalService',
  'priceRange',
  'senior',
  'junior',
  'Redis',
  'Grafana',
  'Prometheus',
  'Circuit Breaker',
  'Proiectus',
  'Wavelet',
  'PayBridge',
  'FeatureSphere',
  'HandAuth',
];

const normalise = (s) =>
  s
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const textByPath = new Map();
for (const p of pages) {
  const $ = cheerio.load(p.html);
  $('script, style').remove();
  textByPath.set(p.url.slice(SITE.length) || '/', normalise($('body').text()));
}

for (const fact of FACTS) {
  const scope = FACT_SCOPES[fact.scope];
  if (!scope) {
    fail(`fact ${fact.id}: unknown scope "${fact.scope}".`);
    continue;
  }
  for (const [lang, paths] of Object.entries(scope)) {
    const needle = normalise(fact[lang]);
    for (const path of paths) {
      const text = textByPath.get(path);
      if (text === undefined) {
        fail(`fact ${fact.id}: page ${path} not built.`);
        continue;
      }
      const haystack = fact.caseSensitive ? text : text.toLowerCase();
      const target = fact.caseSensitive ? needle : needle.toLowerCase();
      if (!haystack.includes(target))
        fail(`fact ${fact.id}: ${lang.toUpperCase()} "${fact[lang]}" missing on ${path}.`);
    }
  }
}

const negativeCaseSensitive = new Set(['TODO', 'FIXME']);
const scannedFiles = allFiles.filter((f) => /\.(html|txt|xml|json|webmanifest)$/.test(f));
for (const needle of NEGATIVE_FACTS) {
  const cs = negativeCaseSensitive.has(needle);
  const target = cs ? needle : needle.toLowerCase();
  for (const file of scannedFiles) {
    const hay = readFileSync(file, 'utf-8');
    if ((cs ? hay : hay.toLowerCase()).includes(target)) {
      fail(`negative fact "${needle}" found in ${relative(dist, file)}.`);
    }
  }
}

if (failures.length) {
  console.error(`QA failed with ${failures.length} issue(s):`);
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
} else {
  console.log(`QA passed: ${pages.length} HTML page(s) checked, no failures.`);
}
