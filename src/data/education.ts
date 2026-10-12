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
  {
    title: {
      es: 'Ingeniería Informática (solo el primer año)',
      en: 'Computer Software Engineering (first year only)',
    },
    org: 'Universidad de Extremadura',
    period: '2021 – 2022',
  },
];

export const certifications: CertificationItem[] = [
  {
    title: { es: 'Certificación B1 en Inglés', en: 'English B1 Certificate' },
    issuer: { es: 'Cambridge University Press & Assessment', en: 'Cambridge University Press & Assessment' },
  },
  {
    title: { es: 'Certificación B2 en Inglés', en: 'English B2 Certificate' },
    issuer: { es: 'goFLUENT', en: 'goFLUENT' },
  },
  {
    title: { es: 'Escuela Desarrollo Java', en: 'Java Development School' },
    issuer: { es: 'Sinensia IT Solutions', en: 'Sinensia IT Solutions' },
  },
  {
    title: { es: 'LPIC 1', en: 'LPIC 1' },
    issuer: { es: 'Linux Professional Institute (LPI)', en: 'Linux Professional Institute (LPI)' },
  },
  {
    title: {
      es: 'MuleSoft Certified Developer – Integration and API Associate (Mule 3)',
      en: 'MuleSoft Certified Developer – Integration and API Associate (Mule 3)',
    },
    issuer: { es: 'Salesforce', en: 'Salesforce' },
  },
];
