import { profile } from '../data/profile';
import { ui } from '../i18n/ui';
import type { Lang } from '../i18n/utils';
import { pick } from '../i18n/utils';
import { PORTRAIT_PATH, SITE } from './site';

const PERSON_ID = `${SITE}/#person`;
const WEBSITE_ID = `${SITE}/#website`;
const PROFILEPAGE_ID = `${SITE}/#profilepage`;

const knowsAbout: Record<Lang, string[]> = {
  es: [
    'Java',
    'Spring Boot',
    'Microservicios',
    'APIs REST',
    'Apache Kafka',
    'RabbitMQ',
    'Angular',
    'TypeScript',
    'PostgreSQL',
    'Docker',
    'Kubernetes',
    'OpenShift',
    'GitHub Actions',
    'Arquitectura hexagonal',
    'GNU/Linux',
    'Bash',
  ],
  en: [
    'Java',
    'Spring Boot',
    'Microservices',
    'REST APIs',
    'Apache Kafka',
    'RabbitMQ',
    'Angular',
    'TypeScript',
    'PostgreSQL',
    'Docker',
    'Kubernetes',
    'OpenShift',
    'GitHub Actions',
    'Hexagonal Architecture',
    'GNU/Linux',
    'Bash',
  ],
};

const personDescription: Record<Lang, string> = {
  es: 'Desarrollador Full Stack con orientación backend (Java, Spring Boot, Kafka) y Angular, en el sector bancario. Cáceres, España. Remoto.',
  en: 'Backend-oriented Full Stack Developer (Java, Spring Boot, Kafka) and Angular, in the banking sector. Based in Cáceres, Spain. Remote.',
};

const profilePageName: Record<Lang, string> = {
  es: 'Manuel Cobos Solís | Desarrollador Full Stack Java y Angular',
  en: 'Manuel Cobos Solís | Full Stack Developer (Java, Angular)',
};

/** `profile.lastUpdated` es una fecha sin hora; los validadores de schema.org
 *  esperan un date-time ISO 8601 completo, así que se normaliza a medianoche UTC
 *  (mismo día natural que la fecha de origen, independiente del TZ del build). */
function isoDateTime(dateOnly: string): string {
  return new Date(`${dateOnly}T00:00:00Z`).toISOString();
}

function personNode(lang: Lang) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    givenName: profile.givenName,
    familyName: profile.familyName,
    alternateName: profile.alternateName,
    url: `${SITE}/`,
    image: `${SITE}${PORTRAIT_PATH}`,
    jobTitle: pick(profile.roleShort, lang),
    description: personDescription[lang],
    email: `mailto:${profile.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.addressLocality,
      addressRegion: profile.addressRegion,
      addressCountry: profile.addressCountry,
    },
    worksFor: { '@type': 'Organization', name: profile.employer, url: profile.employerUrl },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'IES Ágora' },
      { '@type': 'EducationalOrganization', name: 'Universidad de Extremadura' },
    ],
    knowsLanguage: ['es', 'en'],
    knowsAbout: knowsAbout[lang],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'English B1 Certificate',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'Cambridge University Press & Assessment' },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'English B2 Certificate',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'goFLUENT' },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Java Development School',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'Sinensia IT Solutions' },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'LPIC 1',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'Linux Professional Institute' },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'MuleSoft Certified Developer – Integration and API Associate (Mule 3)',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'Salesforce' },
      },
    ],
    sameAs: [profile.github, profile.linkedin, profile.orcid],
  };
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE}/`,
    name: profile.name,
    inLanguage: ['es-ES', 'en'],
    publisher: { '@id': PERSON_ID },
  };
}

function breadcrumb(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function homeGraph(lang: Lang, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      {
        '@type': 'ProfilePage',
        '@id': PROFILEPAGE_ID,
        url: pageUrl,
        name: profilePageName[lang],
        inLanguage: lang === 'es' ? 'es-ES' : 'en',
        isPartOf: { '@id': WEBSITE_ID },
        dateModified: isoDateTime(profile.lastUpdated),
        mainEntity: { '@id': PERSON_ID },
      },
      personNode(lang),
    ],
  };
}

export function cvGraph(lang: Lang, pageUrl: string, title: string) {
  const homeUrl = lang === 'es' ? `${SITE}/` : `${SITE}/en/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        inLanguage: lang === 'es' ? 'es-ES' : 'en',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
      },
      breadcrumb([
        { name: pick(ui['breadcrumb.home'], lang), url: homeUrl },
        { name: pick(ui['nav.cv'], lang), url: pageUrl },
      ]),
      personNode(lang),
    ],
  };
}

/** Serialise a JSON-LD object safely for inline `<script>` embedding. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
