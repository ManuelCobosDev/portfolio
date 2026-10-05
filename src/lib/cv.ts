import { existsSync } from 'node:fs';

/** True when the user has placed the CV PDF in public/cv/. */
export const cvPdfAvailable = existsSync(
  new URL('../../public/cv/Manuel-Cobos-Solis-CV.pdf', import.meta.url),
);
