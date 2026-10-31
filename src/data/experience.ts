import type { L } from '../i18n/utils';

export interface ExperienceLink {
  href: string;
  label: L<string>;
  note?: L<string>;
}

export interface ExperienceEntry {
  start: string;
  end: string | null;
  title: L<string>;
  orgLine: L<string>;
  bullets: L<string[]>;
  link?: ExperienceLink;
  tech: string[];
}

export const experience: ExperienceEntry[] = [
  {
    start: '2025-07',
    end: null,
    title: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },
    orgLine: {
      es: 'Viewnext · cliente Banco Santander (sector bancario)',
      en: 'Viewnext · client Banco Santander (banking sector)',
    },
    bullets: {
      es: [
        'Desarrollo full stack para Banco Santander: aplicaciones bancarias internas de alta disponibilidad con Java y Angular.',
        'Backend: microservicios con Java 17/21 y Spring Boot (REST, Spring Batch, Kafka, RabbitMQ), APIs con OpenAPI y gobierno de APIs.',
        'Microservicio orquestador que recibe un único JSON, lo distribuye a los servicios de destino y se conecta dinámicamente a múltiples bases de datos con credenciales en Vault.',
        'Datos: PostgreSQL (diseño de esquema, CRUD y scripts SQL automatizados con GitHub Actions), Oracle, MySQL y SQL Server; cargas masivas con Spring Batch y SFTP.',
        'Frontend: Angular 15 a 20 y TypeScript, con migración completa de una aplicación.',
        'Calidad: JUnit, Mockito, Vitest (migración desde Karma), Cilantrum e2e, JMeter, SonarQube, Fortify y Trivy.',
        'Despliegue: Docker, Harbor, OpenShift, ArgoCD y GitHub Actions.',
      ],
      en: [
        'Full stack development for Banco Santander: high-availability internal banking applications with Java and Angular.',
        'Backend: microservices with Java 17/21 and Spring Boot (REST, Spring Batch, Kafka, RabbitMQ), OpenAPI-based APIs and API governance.',
        'Orchestrator microservice that receives a single JSON, fans it out to the target services and connects dynamically to multiple databases with credentials in Vault.',
        'Data: PostgreSQL (schema design, CRUD and SQL scripts automated with GitHub Actions), Oracle, MySQL and SQL Server; bulk loads with Spring Batch and SFTP.',
        'Frontend: Angular 15 to 20 and TypeScript, including a full application migration.',
        'Quality: JUnit, Mockito, Vitest (migrated from Karma), Cilantrum e2e, JMeter, SonarQube, Fortify and Trivy.',
        'Deployment: Docker, Harbor, OpenShift, ArgoCD and GitHub Actions.',
      ],
    },
    tech: [
      'Java 17/21',
      'Spring Boot',
      'Angular 15–20',
      'TypeScript',
      'Kafka',
      'RabbitMQ',
      'PostgreSQL',
      'OpenAPI',
      'Docker',
      'OpenShift',
      'ArgoCD',
      'GitHub Actions',
      'JUnit',
      'Vitest',
    ],
  },
  {
    start: '2026-10',
    end: '2026-11',
    title: {
      es: 'Formador Linux LPIC-1 (Docente en Administración de Sistemas)',
      en: 'Linux LPIC-1 Trainer (Systems Administration Instructor)',
    },
    orgLine: {
      es: 'EIGP · Centro de Tecnologías Avanzadas (CTA · INAEM) · Zaragoza (presencial, autónomo)',
      en: 'EIGP · Advanced Technologies Center (CTA · INAEM) · Zaragoza (on-site, freelance)',
    },
    bullets: {
      es: [
        'Docencia de la certificación «Administración de sistemas Linux – Nivel LPIC-1» (60 horas lectivas), organizada por la Escuela Internacional de Gestión de Proyectos (EIGP) para el Centro de Tecnologías Avanzadas (CTA) en el marco de los programas del INAEM.',
        'Capacitación teórica y práctica orientada a la superación de las certificaciones LPIC-1 (exámenes oficiales 101 y 102 del Linux Professional Institute).',
        'Diseño e implementación de laboratorios prácticos en entornos GNU/Linux, comandos esenciales GNU/Unix, administración de sistemas y creación de simulacros de examen.',
      ],
      en: [
        'Instructor for the "Linux Systems Administration – LPIC-1 Level" certification course (60 teaching hours), organised by the International School of Project Management (EIGP) for the Advanced Technologies Center (CTA) under the INAEM training programmes.',
        'Theoretical and hands-on training focused on passing the official Linux Professional Institute (LPI) LPIC-1 certification exams (101 and 102).',
        'Design and implementation of practical GNU/Linux labs, essential GNU/Unix commands, system administration and exam simulations.',
      ],
    },
    link: {
      href: 'https://lpic1.manuelcobos.dev/',
      label: { es: 'lpic1.manuelcobos.dev', en: 'lpic1.manuelcobos.dev' },
      note: {
        es: 'Web LPIC-1 con temario interactivo en diapositivas, laboratorios prácticos y simulacros de examen.',
        en: 'LPIC-1 web platform with interactive slide deck, hands-on labs and practice exams.',
      },
    },
    tech: ['GNU/Linux', 'LPIC-1 (101 · 102)', 'Bash', 'Systemd', 'LVM', 'OpenSSH', 'Networking'],
  },
  {
    start: '2024-11',
    end: '2025-06',
    title: { es: 'Desarrollador Full Stack (Backend oriented)', en: 'Full Stack Developer (Backend oriented)' },
    orgLine: {
      es: 'Viewnext · sector bancario (prácticas)',
      en: 'Viewnext · banking sector (internship)',
    },
    bullets: {
      es: [
        'Prácticas full stack con enfoque backend: Java 17, Spring Boot 3 y Angular 20; formación intensiva de 160 h en Java y Spring Boot a través de Sinensia.',
        'Backend: APIs REST (Spring MVC), persistencia con Spring Data, seguridad con Spring Security y procesos por lotes con Spring Batch.',
        'Mensajería: Apache Kafka (pipeline de eventos en tiempo real) y RabbitMQ.',
        'Tiempo real: notificaciones de estado con WebSockets.',
        'Datos: PostgreSQL y MongoDB.',
        'Frontend: Angular y TypeScript.',
        'Calidad: TDD, Clean Architecture y entregas semanales ágiles.',
      ],
      en: [
        'Full stack internship with a backend focus: Java 17, Spring Boot 3 and Angular 20; 160 h intensive Java and Spring Boot training through Sinensia.',
        'Backend: REST APIs (Spring MVC), persistence with Spring Data, security with Spring Security and batch processing with Spring Batch.',
        'Messaging: Apache Kafka (real-time event pipeline) and RabbitMQ.',
        'Real time: status notifications with WebSockets.',
        'Data: PostgreSQL and MongoDB.',
        'Frontend: Angular and TypeScript.',
        'Quality: TDD, Clean Architecture and agile weekly deliveries.',
      ],
    },
    tech: [
      'Java 17',
      'Spring Boot 3',
      'Angular 20',
      'TypeScript',
      'Spring MVC',
      'Spring Data',
      'Spring Security',
      'Spring Batch',
      'Kafka',
      'RabbitMQ',
      'WebSockets',
      'PostgreSQL',
      'MongoDB',
    ],
  },
  {
    start: '2024-03',
    end: '2024-06',
    title: { es: 'Desarrollador de Integración', en: 'Integration Developer' },
    orgLine: {
      es: 'Viewnext · sector bancario (prácticas)',
      en: 'Viewnext · banking sector (internship)',
    },
    bullets: {
      es: [
        'Prácticas en integración de sistemas empresariales con MuleSoft e IBM Integration Bus.',
        'MuleSoft Anypoint Platform: diseño de flujos que conectan sistemas legacy con APIs modernas.',
        'IBM Integration Bus (IIB): transformación de datos y enrutamiento en distintos procesos y flujos (ESB).',
      ],
      en: [
        'Internship in enterprise system integration with MuleSoft and IBM Integration Bus.',
        'MuleSoft Anypoint Platform: designing flows that connect legacy systems with modern APIs.',
        'IBM Integration Bus (IIB): data transformation and routing across different processes and flows (ESB).',
      ],
    },
    tech: ['MuleSoft Anypoint Platform', 'IBM Integration Bus', 'REST APIs', 'ESB'],
  },
];
