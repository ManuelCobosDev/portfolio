export const SITE = 'https://manuelcobos.dev';

export interface Alternates {
  es: string;
  en: string;
  xDefault: string;
}

/** Content-layer ids include their subfolder (e.g. "es/entry"); URL slugs use the basename. */
export function slugFromId(id: string): string {
  return id.split('/').pop() ?? id;
}
