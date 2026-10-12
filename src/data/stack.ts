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
        'Microservicios',
        'REST APIs',
        'Arquitectura hexagonal',
        'DDD',
        'TDD',
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
        'Microservices',
        'REST APIs',
        'Hexagonal Architecture',
        'DDD',
        'TDD',
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
        'Signals',
        'Angular Material',
        'NgRx',
        'Vitest',
      ],
      en: [
        'Angular 15–20 (full migrations up to 20)',
        'TypeScript',
        'RxJS',
        'Signals',
        'Angular Material',
        'NgRx',
        'Vitest',
      ],
    },
  },
  {
    label: { es: 'Mensajería y eventos', en: 'Messaging and events' },
    items: {
      es: ['Apache Kafka', 'RabbitMQ', 'WebSockets'],
      en: ['Apache Kafka', 'RabbitMQ', 'WebSockets'],
    },
  },
  {
    label: { es: 'Bases de datos', en: 'Databases' },
    items: {
      es: ['PostgreSQL', 'Oracle', 'SQL Server', 'MySQL', 'MongoDB'],
      en: ['PostgreSQL', 'Oracle', 'SQL Server', 'MySQL', 'MongoDB'],
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
        'Vault',
        'SFTP',
        'Cilantrum e2e',
        'JMeter',
        'Fortify',
        'Harbor',
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
        'Vault',
        'SFTP',
        'Cilantrum e2e',
        'JMeter',
        'Fortify',
        'Harbor',
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
];
