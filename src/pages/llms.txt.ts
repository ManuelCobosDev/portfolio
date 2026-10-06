import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { slugFromId } from '../lib/site';

export const GET: APIRoute = async () => {
  const works = await getCollection('work');
  const esWork = works.find((w) => w.data.lang === 'es' && !w.data.draft);
  const enWork = works.find((w) => w.data.lang === 'en' && !w.data.draft);

  const pages = [
    '- [Inicio](https://manuelcobos.dev/): presentación, experiencia, stack, formación y contacto',
    '- [CV](https://manuelcobos.dev/cv/): currículum imprimible',
    '- [CV (PDF)](https://manuelcobos.dev/cv/Manuel-Cobos-Solis-CV-ES.pdf)',
  ];
  if (esWork)
    pages.push(`- [Caso de estudio: ${esWork.data.title}](https://manuelcobos.dev/trabajo/${slugFromId(esWork.id)}/)`);
  pages.push('- [English home](https://manuelcobos.dev/en/)');
  pages.push('- [English résumé](https://manuelcobos.dev/en/cv/)');
  pages.push('- [Résumé (PDF)](https://manuelcobos.dev/cv/Manuel-Cobos-Solis-CV-EN.pdf)');
  if (enWork)
    pages.push(`- [Case study: ${enWork.data.title}](https://manuelcobos.dev/en/work/${slugFromId(enWork.id)}/)`);

  const text = `# Manuel Cobos Solís

> Desarrollador Full Stack con enfoque backend (Java, Spring Boot, Kafka) y Angular, en el sector bancario. Cáceres, Extremadura, España. Trabaja en remoto. / Backend-oriented Full Stack Developer (Java, Spring Boot, Kafka) and Angular, in the banking sector. Based in Cáceres, Spain. Works remotely.

## Datos / Facts

- Nombre / Name: Manuel Cobos Solís
- Rol / Role: Desarrollador Full Stack / Full Stack Developer
- Empresa actual / Current company: Viewnext (cliente / client: Banco Santander)
- Ubicación / Location: Cáceres, Extremadura, España / Spain
- Modalidad / Work mode: 100 % remoto / fully remote
- Idiomas / Languages: español (nativo), inglés (B2) / Spanish (native), English (B2)
- Correo / Email: manuel.cobos.dev@gmail.com

## Páginas / Pages

${pages.join('\n')}

## Perfiles / Profiles

- [LinkedIn](https://www.linkedin.com/in/manuelcobos/)
- [GitHub](https://github.com/ManuelCobosDev)
`;

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
