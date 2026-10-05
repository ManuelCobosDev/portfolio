import type { L } from '../i18n/utils';

export interface ExperienceEntry {
  start: string;
  end: string | null;
  title: string;
  orgLine: L<string>;
  bullets: L<string[]>;
  tech: string[];
}

export const experience: ExperienceEntry[] = [
  {
    start: '2025-07',
    end: null,
    title: 'Full Stack Developer',
    orgLine: {
      es: 'Viewnext · cliente Banco Santander (sector bancario)',
      en: 'Viewnext · client Banco Santander (banking sector)',
    },
    bullets: {
      es: [
        'Desarrollo de funcionalidades de extremo a extremo con Angular 20 y Spring Boot, hasta producción.',
        'Pruebas con Vitest y JUnit 5, mejora de la cobertura de tests, refactorización de código heredado y corrección de hallazgos de SonarQube.',
        'Despliegue sobre OpenShift con pipelines de GitHub Actions.',
      ],
      en: [
        'End-to-end feature development with Angular 20 and Spring Boot, through to production.',
        'Testing with Vitest and JUnit 5, higher test coverage, refactoring of legacy code and fixing of SonarQube findings.',
        'Deployment on OpenShift with GitHub Actions pipelines.',
      ],
    },
    tech: ['Angular 20', 'TypeScript', 'Spring Boot', 'Vitest', 'JUnit 5', 'SonarQube', 'OpenShift', 'GitHub Actions'],
  },
  {
    start: '2024-11',
    end: '2025-06',
    title: 'Java Backend Developer',
    orgLine: {
      es: 'Viewnext · sector bancario',
      en: 'Viewnext · banking sector',
    },
    bullets: {
      es: [
        'Desarrollo de microservicios y APIs REST con Spring Boot bajo arquitectura limpia.',
        'Mensajería con Apache Kafka y RabbitMQ, incluido un pipeline asíncrono para procesar eventos financieros en tiempo real.',
        'Notificaciones del estado de operaciones bancarias en tiempo real con WebSockets.',
        'Seguridad con Spring Security y persistencia con Spring Data.',
      ],
      en: [
        'Development of microservices and REST APIs with Spring Boot under clean architecture.',
        'Messaging with Apache Kafka and RabbitMQ, including an asynchronous pipeline to process financial events in real time.',
        'Real-time notifications of banking operation status with WebSockets.',
        'Security with Spring Security and persistence with Spring Data.',
      ],
    },
    tech: ['Java', 'Spring Boot', 'Kafka', 'RabbitMQ', 'WebSockets', 'Spring Security', 'Spring Data JPA'],
  },
  {
    start: '2024-03',
    end: '2024-06',
    title: 'Integration Developer',
    orgLine: {
      es: 'Viewnext · sector bancario',
      en: 'Viewnext · banking sector',
    },
    bullets: {
      es: [
        'Flujos en MuleSoft Anypoint Platform que conectan sistemas heredados con APIs modernas.',
        'Transformación y enrutado de datos con IBM Integration Bus.',
        'Obtención de la certificación MuleSoft Certified Developer.',
      ],
      en: [
        'Flows on MuleSoft Anypoint Platform connecting legacy systems with modern APIs.',
        'Data transformation and routing with IBM Integration Bus.',
        'Earned the MuleSoft Certified Developer certification.',
      ],
    },
    tech: ['MuleSoft Anypoint Platform', 'IBM Integration Bus', 'REST APIs', 'XML'],
  },
];
