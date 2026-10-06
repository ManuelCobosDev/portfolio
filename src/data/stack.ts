import type { L } from '../i18n/utils';

export interface CoreTech {
  icon: string;
  label: string;
}

export const coreTech: CoreTech[] = [
  { icon: 'devicon-plain:java', label: 'Java' },
  { icon: 'simple-icons:springboot', label: 'Spring Boot' },
  { icon: 'simple-icons:apachekafka', label: 'Kafka' },
  { icon: 'simple-icons:rabbitmq', label: 'RabbitMQ' },
  { icon: 'simple-icons:angular', label: 'Angular' },
  { icon: 'simple-icons:typescript', label: 'TypeScript' },
  { icon: 'simple-icons:postgresql', label: 'PostgreSQL' },
  { icon: 'simple-icons:docker', label: 'Docker' },
  { icon: 'simple-icons:kubernetes', label: 'Kubernetes' },
  { icon: 'simple-icons:githubactions', label: 'GitHub Actions' },
];

export interface StackGroup {
  label: L<string>;
  items: L<string[]>;
}

export const stackGroups: StackGroup[] = [
  {
    label: { es: 'Backend', en: 'Backend' },
    items: {
      es: [
        'Java 17',
        'Java 21',
        'Spring Boot',
        'Spring MVC',
        'Spring Security',
        'Spring Data JPA',
        'Spring Batch',
        'WebClient',
        'Arquitectura limpia / hexagonal',
        'DDD',
        'API-first (OpenAPI)',
      ],
      en: [
        'Java 17',
        'Java 21',
        'Spring Boot',
        'Spring MVC',
        'Spring Security',
        'Spring Data JPA',
        'Spring Batch',
        'WebClient',
        'Clean / Hexagonal Architecture',
        'DDD',
        'API-first (OpenAPI)',
      ],
    },
  },
  {
    label: { es: 'Frontend', en: 'Frontend' },
    items: {
      es: [
        'Angular 15–20 (migraciones completas hasta la 20)',
        'TypeScript',
        'RxJS',
        'Angular Material',
        'Vitest',
        'Karma',
      ],
      en: ['Angular 15–20 (full migrations up to 20)', 'TypeScript', 'RxJS', 'Angular Material', 'Vitest', 'Karma'],
    },
  },
  {
    label: { es: 'Mensajería y tiempo real', en: 'Messaging and real time' },
    items: {
      es: ['Apache Kafka', 'RabbitMQ', 'WebSockets', 'Arquitectura orientada a eventos'],
      en: ['Apache Kafka', 'RabbitMQ', 'WebSockets', 'Event-driven architecture'],
    },
  },
  {
    label: { es: 'Bases de datos', en: 'Databases' },
    items: {
      es: ['PostgreSQL', 'Oracle (consultas y creación de tablas)', 'SQL Server (consultas y creación de tablas)'],
      en: ['PostgreSQL', 'Oracle (queries and table creation)', 'SQL Server (queries and table creation)'],
    },
  },
  {
    label: { es: 'DevOps y calidad', en: 'DevOps and quality' },
    items: {
      es: [
        'Docker',
        'Kubernetes',
        'OpenShift',
        'ArgoCD',
        'GitHub Actions',
        'Maven',
        'SonarQube',
        'Trivy',
        'JUnit 5',
        'Mockito',
      ],
      en: [
        'Docker',
        'Kubernetes',
        'OpenShift',
        'ArgoCD',
        'GitHub Actions',
        'Maven',
        'SonarQube',
        'Trivy',
        'JUnit 5',
        'Mockito',
      ],
    },
  },
  {
    label: { es: 'Integración (experiencia previa)', en: 'Integration (earlier experience)' },
    items: {
      es: ['MuleSoft Anypoint Platform', 'IBM Integration Bus'],
      en: ['MuleSoft Anypoint Platform', 'IBM Integration Bus'],
    },
  },
  {
    label: { es: 'Conocimientos adicionales', en: 'Additional knowledge' },
    items: {
      es: ['MongoDB', 'Firebase (formación y estudio personal)'],
      en: ['MongoDB', 'Firebase (education and personal study)'],
    },
  },
];
