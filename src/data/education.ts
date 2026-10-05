import type { L } from '../i18n/utils';

export interface EducationItem {
  title: L<string>;
  org: string;
  period: string;
}

export interface CertificationItem {
  title: L<string>;
  issuer: L<string>;
}

export const degrees: EducationItem[] = [
  {
    title: {
      es: 'Técnico Superior en Desarrollo de Aplicaciones Web (DAW)',
      en: 'Higher Technical Degree in Web Application Development (DAW)',
    },
    org: 'IES Ágora',
    period: '2024 – 2025',
  },
  {
    title: {
      es: 'Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)',
      en: 'Higher Technical Degree in Cross-Platform Application Development (DAM)',
    },
    org: 'IES Ágora',
    period: '2022 – 2024',
  },
];

export const certifications: CertificationItem[] = [
  {
    title: {
      es: 'MuleSoft Certified Developer – Level 1',
      en: 'MuleSoft Certified Developer – Level 1',
    },
    issuer: { es: 'MuleSoft', en: 'MuleSoft' },
  },
  {
    title: {
      es: 'LPIC-1 Linux Administrator',
      en: 'LPIC-1 Linux Administrator',
    },
    issuer: { es: 'Linux Professional Institute', en: 'Linux Professional Institute' },
  },
  {
    title: {
      es: 'Claude Code in Action',
      en: 'Claude Code in Action',
    },
    issuer: { es: 'Anthropic', en: 'Anthropic' },
  },
  {
    title: {
      es: 'Inglés B2',
      en: 'English B2',
    },
    issuer: { es: 'Nivel de idioma', en: 'Language level' },
  },
];
