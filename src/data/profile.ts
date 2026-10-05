import type { L } from '../i18n/utils';

export const profile = {
  name: 'Manuel Cobos Solís',
  givenName: 'Manuel',
  familyName: 'Cobos Solís',
  alternateName: ['Manuel Cobos', 'Manuel Cobos Solis'],
  email: 'manuel.cobos.dev@gmail.com',
  linkedin: 'https://www.linkedin.com/in/manuelcobos/',
  github: 'https://github.com/ManuelCobosDev',
  certificationsUrl: 'https://www.linkedin.com/in/manuelcobos/details/certifications/',
  lastUpdated: '2026-10-05',
  experienceStart: '2024-03-01',
  employer: 'Viewnext',
  employerUrl: 'https://www.viewnext.com/',
  client: 'Banco Santander',
  role: {
    es: 'Desarrollador Full Stack con enfoque backend',
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
    es: '100 % remoto',
    en: 'Fully remote',
  } as L<string>,
  employerLine: {
    es: 'Viewnext · cliente Banco Santander',
    en: 'Viewnext · client Banco Santander',
  } as L<string>,
  languages: {
    es: 'Español (nativo) · Inglés (B2)',
    en: 'Spanish (native) · English (B2)',
  } as L<string>,
  mainStack: {
    es: 'Java 21 · Spring Boot · Kafka · RabbitMQ · Angular 20 · PostgreSQL',
    en: 'Java 21 · Spring Boot · Kafka · RabbitMQ · Angular 20 · PostgreSQL',
  } as L<string>,
  statusOpen: {
    es: 'Abierto a oportunidades',
    en: 'Open to opportunities',
  } as L<string>,
  ogTagline: {
    es: 'Java · Spring Boot · Kafka · Angular',
    en: 'Java · Spring Boot · Kafka · Angular',
  } as L<string>,
} as const;
