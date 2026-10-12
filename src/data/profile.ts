import type { L } from '../i18n/utils';

export const profile = {
  name: 'Manuel Cobos Solís',
  givenName: 'Manuel',
  familyName: 'Cobos Solís',
  alternateName: ['Manuel Cobos', 'Manuel Cobos Solis'],
  email: 'manuel.cobos.dev@gmail.com',
  linkedin: 'https://www.linkedin.com/in/manuelcobos/',
  github: 'https://github.com/ManuelCobosDev',
  orcid: 'https://orcid.org/0009-0000-5426-8924',
  certificationsUrl: 'https://www.linkedin.com/in/manuelcobos/details/certifications/',
  lastUpdated: '2026-10-12',
  experienceStart: '2024-03-01',
  employer: 'Viewnext',
  employerUrl: 'https://www.viewnext.com/',
  client: 'Banco Santander',
  role: {
    es: 'Desarrollador Full Stack con orientación backend',
    en: 'Backend-oriented Full Stack Developer',
  } as L<string>,
  roleShort: {
    es: 'Desarrollador Full Stack',
    en: 'Full Stack Developer',
  } as L<string>,
  fichaRole: {
    es: 'Desarrollador Full Stack (backend Java, frontend Angular)',
    en: 'Full Stack Developer (Java backend, Angular frontend)',
  } as L<string>,
  location: {
    es: 'Cáceres, Extremadura, España',
    en: 'Cáceres, Extremadura, Spain',
  } as L<string>,
  addressLocality: 'Cáceres',
  addressRegion: 'Extremadura',
  addressCountry: 'ES',
  workMode: {
    es: 'Remoto desde España',
    en: 'Remote from Spain',
  } as L<string>,
  employerLine: {
    es: 'Viewnext · cliente Banco Santander',
    en: 'Viewnext · client Banco Santander',
  } as L<string>,
  languages: {
    es: 'Español (nativo) · Inglés (B1 · B2)',
    en: 'Spanish (native) · English (B1 · B2)',
  } as L<string>,
  mainStack: {
    es: 'Java 17/21 · Spring Boot · Kafka · RabbitMQ · Angular 15–20 · PostgreSQL',
    en: 'Java 17/21 · Spring Boot · Kafka · RabbitMQ · Angular 15–20 · PostgreSQL',
  } as L<string>,
  ogTagline: {
    es: 'Java · Spring Boot · Kafka · Angular',
    en: 'Java · Spring Boot · Kafka · Angular',
  } as L<string>,
} as const;
