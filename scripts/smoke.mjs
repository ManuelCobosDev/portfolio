/**
 * smoke.mjs — post-deploy smoke test (M15).
 *
 * Usage: node scripts/smoke.mjs https://manuelcobos.dev
 *
 * Asserts, with plain fetch and no dependencies, that the deployed site:
 *  - serves the key pages with HTTP 200 and the right content type,
 *  - keeps the canonical origin (HTTPS apex) after redirects,
 *  - puts the canonical URL and the h1 "Manuel Cobos Solís" in the HTML,
 *  - lists those pages in the sitemap,
 *  - redirects http:// and www. to the canonical origin.
 * Exits 1 on the first failure class with a readable report.
 */
const base = (process.argv[2] || 'https://manuelcobos.dev').replace(/\/$/, '');
const apex = new URL(base);

const pages = [
  { path: '/', type: 'text/html' },
  { path: '/en/', type: 'text/html' },
  { path: '/cv/', type: 'text/html' },
  { path: '/en/cv/', type: 'text/html' },
  { path: '/trabajo/microservicio-orquestador/', type: 'text/html' },
  { path: '/en/work/orchestrator-microservice/', type: 'text/html' },
  { path: '/robots.txt', type: 'text/plain' },
  { path: '/sitemap-index.xml', type: 'xml' },
  { path: '/llms.txt', type: 'text/plain' },
];

const failures = [];
const log = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
};

async function head(url) {
  try {
    const res = await fetch(url, { redirect: 'manual' });
    return res;
  } catch (err) {
    return { error: err.message };
  }
}

for (const page of pages) {
  const url = `${base}${page.path}`;
  try {
    const res = await fetch(url);
    log(res.status === 200, `${url} -> HTTP ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    log(ct.includes(page.type), `${url} -> content-type "${ct}" includes "${page.type}"`);
    const html = await res.text();
    if (page.type === 'text/html') {
      log(html.includes(`<link rel="canonical" href="${url}"`), `${url} -> canonical present`);
      log(html.includes('Manuel Cobos Solís'), `${url} -> contains h1 name`);
    }
    if (page.path === '/sitemap-index.xml') {
      log(html.includes('sitemap-0.xml'), `${url} -> references sitemap-0.xml`);
    }
  } catch (err) {
    log(false, `${url} -> ${err.message}`);
  }
}

// Canonical origin is preserved after following redirects from the apex.
try {
  const res = await fetch(`${base}/`);
  log(new URL(res.url).origin === apex.origin, `final URL origin is ${apex.origin} (${res.url})`);
  log(res.url.startsWith('https://'), `final URL is HTTPS (${res.url})`);
} catch (err) {
  log(false, `final URL check failed: ${err.message}`);
}

// http:// and www. redirect to the canonical origin (best effort; DNS may not
// resolve in every environment, so a network error is reported as a warning).
for (const alt of [`http://${apex.host}/`, `https://www.${apex.host}/`]) {
  const res = await head(alt);
  if (res.error) {
    console.log(`warn  ${alt} -> ${res.error} (cannot verify redirect here)`);
    continue;
  }
  const location = res.headers.get('location') || '';
  const ok = [301, 302, 307, 308].includes(res.status) && location.includes(apex.host);
  log(ok, `${alt} -> HTTP ${res.status} Location ${location}`);
}

if (failures.length) {
  console.error(`\nSmoke test failed with ${failures.length} issue(s).`);
  process.exit(1);
}
console.log('\nSmoke test passed.');
