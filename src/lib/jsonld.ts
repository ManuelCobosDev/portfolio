import type { Lang } from '../i18n/utils';
import { pick } from '../i18n/utils';
import { ui } from '../i18n/ui';
import { profile } from '../data/profile';
import { SITE } from './site';

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
    'Arquitectura limpia',
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
    'Clean Architecture',
  ],
};

const personDescription: Record<Lang, string> = {
  es: 'Desarrollador Full Stack con enfoque backend (Java, Spring Boot, Kafka) y Angular, en el sector bancario. Cáceres, España. Remoto.',
  en: 'Backend-oriented Full Stack Developer (Java, Spring Boot, Kafka) and Angular, in the banking sector. Based in Cáceres, Spain. Remote.',
};

const profilePageName: Record<Lang, string> = {
  es: 'Manuel Cobos Solís | Desarrollador Full Stack Java y Angular',
  en: 'Manuel Cobos Solís | Full Stack Developer (Java, Angular)',
};

function personNode(lang: Lang) {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    givenName: profile.givenName,
    familyName: profile.familyName,
    alternateName: profile.alternateName,
    url: `${SITE}/`,
    image: `${SITE}/images/manuel-cobos-solis.jpg`,
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
    alumniOf: [{ '@type': 'EducationalOrganization', name: 'IES Ágora' }],
    knowsLanguage: ['es', 'en'],
    knowsAbout: knowsAbout[lang],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'MuleSoft Certified Developer – Level 1',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'MuleSoft' },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'LPIC-1 Linux Administrator',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'Linux Professional Institute' },
      },
    ],
    sameAs: [profile.github, profile.linkedin],
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
        dateModified: profile.lastUpdated,
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

export interface WorkJsonLdInput {
  lang: Lang;
  pageUrl: string;
  title: string;
  description: string;
  stack: string[];
  publishedAt: string;
  updatedAt?: string;
  kind: 'case-study' | 'project';
  ogImageUrl: string;
  repo?: string;
}

export function workGraph(input: WorkJsonLdInput) {
  const homeUrl = input.lang === 'es' ? `${SITE}/` : `${SITE}/en/`;
  const inLanguage = input.lang === 'es' ? 'es-ES' : 'en';
  const common = {
    description: input.description,
    inLanguage,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    keywords: input.stack.join(', '),
    author: { '@id': PERSON_ID },
    publisher: { '@id': PERSON_ID },
    mainEntityOfPage: input.pageUrl,
    image: input.ogImageUrl,
  };
  const article =
    input.kind === 'project'
      ? {
          '@type': 'SoftwareSourceCode',
          name: input.title,
          ...common,
          ...(input.repo ? { codeRepository: input.repo } : {}),
          programmingLanguage: input.stack,
        }
      : {
          '@type': 'TechArticle',
          headline: input.title,
          ...common,
        };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode(),
      article,
      breadcrumb([
        { name: pick(ui['breadcrumb.home'], input.lang), url: homeUrl },
        { name: input.title, url: input.pageUrl },
      ]),
      personNode(input.lang),
    ],
  };
}

/** Serialise a JSON-LD object safely for inline `<script>` embedding. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
