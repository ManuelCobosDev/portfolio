import type { APIRoute } from 'astro';
import { CV_PDF_PATH } from '../lib/site';

export const GET: APIRoute = async () => {
  const pages = [
    '- [Inicio](https://manuelcobos.dev/): presentación, experiencia, stack, formación y contacto',
    '- [CV](https://manuelcobos.dev/cv/): currículum imprimible',
    `- [CV (PDF)](https://manuelcobos.dev${CV_PDF_PATH})`,
    '- [English home](https://manuelcobos.dev/en/)',
    '- [English résumé](https://manuelcobos.dev/en/cv/)',
    `- [Résumé (PDF)](https://manuelcobos.dev${CV_PDF_PATH})`,
  ];

  const text = `# Manuel Cobos Solís

> Desarrollador Full Stack con orientación backend (Java, Spring Boot, Kafka) y Angular, en el sector bancario. Cáceres, Extremadura, España. Trabaja en remoto. / Backend-oriented Full Stack Developer (Java, Spring Boot, Kafka) and Angular, in the banking sector. Based in Cáceres, Spain. Works remotely.

## Datos / Facts

- Nombre / Name: Manuel Cobos Solís
- Rol / Role: Desarrollador Full Stack / Full Stack Developer
- Empresa actual / Current company: Viewnext (cliente / client: Banco Santander)
- Ubicación / Location: Cáceres, Extremadura, España / Spain
- Modalidad / Work mode: Remoto desde España / Remote from Spain
- Idiomas / Languages: español (nativo), inglés (B1 · B2) / Spanish (native), English (B1 · B2)
- Correo / Email: manuel.cobos.dev@gmail.com

## Páginas / Pages

${pages.join('\n')}

## Perfiles / Profiles

- [LinkedIn](https://www.linkedin.com/in/manuelcobos/)
- [GitHub](https://github.com/ManuelCobosDev)
- [ORCID](https://orcid.org/0009-0000-5426-8924)
`;

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
