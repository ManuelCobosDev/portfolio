/**
 * facts.mjs — M2 personal-data check. Table-driven from docs/facts.json.
 * Verifies every fact string appears in the visible text of the listed pages
 * (normalised for whitespace and non-breaking spaces) and that no negative
 * string appears anywhere in dist/.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');

const SCOPES = {
  home: { es: ['/'], en: ['/en/'] },
  cv: { es: ['/cv/'], en: ['/en/cv/'] },
  'home+cv': { es: ['/', '/cv/'], en: ['/en/', '/en/cv/'] },
  work: { es: ['/trabajo/microservicio-orquestador/'], en: ['/en/work/orchestrator-microservice/'] },
  all: {
    es: ['/', '/cv/', '/trabajo/microservicio-orquestador/'],
    en: ['/en/', '/en/cv/', '/en/work/orchestrator-microservice/'],
  },
};

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const norm = (s) => s.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
// The exact name is case-sensitive; every other fact is compared
// case-insensitively (the CV, per the brief, uses lower-case forms such as
// "fully remote" and "mar 2024").
const contains = (text, needle, caseSensitive) =>
  caseSensitive ? text.includes(norm(needle)) : text.toLowerCase().includes(norm(needle).toLowerCase());

export function checkFacts() {
  const failures = [];
  const facts = JSON.parse(readFileSync(join(root, 'docs', 'facts.json'), 'utf8'));

  const textByUrl = new Map();
  for (const file of walk(dist)) {
    if (!file.endsWith('.html')) continue;
    const $ = cheerio.load(readFileSync(file, 'utf8'));
    $('script, style').remove();
    let rel = relative(dist, file).split(sep).join('/');
    rel = rel === '404.html' ? '/404.html' : rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/, '')}`;
    textByUrl.set(rel, norm($('body').text()));
  }

  for (const row of facts.positive) {
    const scope = SCOPES[row.scope];
    if (!scope) {
      failures.push(`facts.json: unknown scope "${row.scope}" for "${row.id}"`);
      continue;
    }
    const cs = row.id === 'name';
    for (const url of scope.es) {
      const text = textByUrl.get(url);
      if (text === undefined) failures.push(`M2 ${row.id}: page ${url} not built`);
      else if (!contains(text, row.es, cs)) failures.push(`M2 ${row.id}: ES "${row.es}" missing on ${url}`);
    }
    for (const url of scope.en) {
      const text = textByUrl.get(url);
      if (text === undefined) failures.push(`M2 ${row.id}: page ${url} not built`);
      else if (!contains(text, row.en, cs)) failures.push(`M2 ${row.id}: EN "${row.en}" missing on ${url}`);
    }
  }

  const caseSensitive = new Set(['TODO', 'FIXME']);
  const scanFiles = walk(dist).filter((f) => /\.(html|txt|xml|json|webmanifest)$/.test(f));
  for (const needle of facts.negative) {
    const cs = caseSensitive.has(needle);
    const target = cs ? needle : needle.toLowerCase();
    for (const file of scanFiles) {
      const hay = readFileSync(file, 'utf8');
      const haystack = cs ? hay : hay.toLowerCase();
      if (haystack.includes(target)) {
        failures.push(`M2 negative "${needle}" found in ${relative(dist, file)}`);
      }
    }
  }

  return failures;
}

if (process.argv[1] && process.argv[1].endsWith('facts.mjs')) {
  const failures = checkFacts();
  if (failures.length) {
    console.error(`facts check failed with ${failures.length} issue(s):`);
    for (const f of failures) console.error('  - ' + f);
    process.exit(1);
  }
  console.log('facts check passed.');
}
