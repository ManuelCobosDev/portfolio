export const SITE = 'https://manuelcobos.dev';

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE}${p}`;
}

export interface Alternates {
  es: string;
  en: string;
  xDefault: string;
}

/**
 * Returns the absolute alternates for a page: the Spanish URL, the English URL
 * and the x-default URL (which is the Spanish URL by convention of this site).
 */
export function getAlternates(paths: { es: string; en: string }): Alternates {
  return {
    es: absoluteUrl(paths.es),
    en: absoluteUrl(paths.en),
    xDefault: absoluteUrl(paths.es),
  };
}

/** Content-layer ids include their subfolder (e.g. "es/entry"); URL slugs use the basename. */
export function slugFromId(id: string): string {
  return id.split('/').pop() ?? id;
}
