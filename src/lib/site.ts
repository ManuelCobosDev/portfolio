export const SITE = 'https://manuelcobos.dev';

/** Currículum real para descarga. El nombre lleva el hash del contenido para
 *  servirlo con caché inmutable: al cambiar el PDF cambia la URL y se descarga
 *  una sola vez. `CV_PDF_NAME` es el nombre que sugiere el navegador al guardar. */
export const CV_PDF_PATH = '/cv/Manuel-Cobos-Solis-CV-ae560ece.pdf';
export const CV_PDF_NAME = 'Manuel-Cobos-Solis-CV.pdf';

export interface Alternates {
  es: string;
  en: string;
  xDefault: string;
}

/** Content-layer ids include their subfolder (e.g. "es/entry"); URL slugs use the basename. */
export function slugFromId(id: string): string {
  return id.split('/').pop() ?? id;
}
