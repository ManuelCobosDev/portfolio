export type Lang = 'es' | 'en';
export type L<T> = { es: T; en: T };
export const pick = <T>(v: L<T>, lang: Lang): T => v[lang];
