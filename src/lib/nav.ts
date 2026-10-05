import type { Lang } from '../i18n/utils';
import { pick } from '../i18n/utils';
import { ui, type UiKey } from '../i18n/ui';
import { navSections } from '../data/nav';

export interface NavEntry {
  key: string;
  id: string;
  label: string;
}

/** Returns the visible navigation sections for a language. */
export function visibleNav(lang: Lang, hasCases: boolean, hasProjects: boolean): NavEntry[] {
  return navSections
    .filter((section) => {
      if (section.condition === 'cases') return hasCases;
      if (section.condition === 'projects') return hasProjects;
      return true;
    })
    .map((section) => ({
      key: section.key,
      id: pick(section.id, lang),
      label: pick(ui[`nav.${section.key}` as UiKey], lang),
    }));
}
