import { navSections } from '../data/nav';
import { ui, type UiKey } from '../i18n/ui';
import type { Lang } from '../i18n/utils';
import { pick } from '../i18n/utils';

export interface NavEntry {
  key: string;
  id: string;
  label: string;
}

export function visibleNav(lang: Lang): NavEntry[] {
  return navSections.map((section) => ({
    key: section.key,
    id: pick(section.id, lang),
    label: pick(ui[`nav.${section.key}` as UiKey], lang),
  }));
}
