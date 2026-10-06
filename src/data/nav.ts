import type { L } from '../i18n/utils';

type NavCondition = 'cases' | 'projects';

export interface NavSection {
  /** Key of the section: matches ui keys `nav.<key>` and `section.<key>`. */
  key: string;
  id: L<string>;
  condition?: NavCondition;
}

export const navSections: NavSection[] = [
  { key: 'about', id: { es: 'sobre-mi', en: 'about' } },
  { key: 'experience', id: { es: 'experiencia', en: 'experience' } },
  { key: 'stack', id: { es: 'stack', en: 'stack' } },
  { key: 'cases', id: { es: 'casos', en: 'case-studies' }, condition: 'cases' },
  { key: 'projects', id: { es: 'proyectos', en: 'projects' }, condition: 'projects' },
  { key: 'education', id: { es: 'formacion', en: 'education' } },
  { key: 'contact', id: { es: 'contacto', en: 'contact' } },
];
