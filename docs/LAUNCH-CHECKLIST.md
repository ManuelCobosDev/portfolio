# Lista de lanzamiento / Launch checklist

Pasos manuales a realizar después del desarrollo. Hazlos en orden y marca cada
casilla.

## 0. Sacar el proyecto de OneDrive (hazlo primero)

Un repositorio git (y `node_modules`) dentro de una carpeta sincronizada por
OneDrive provoca bloqueos y builds lentos.

- [ ] Clona el proyecto a una ruta **no sincronizada**, por ejemplo:

  ```powershell
  git clone --no-hardlinks "c:\Users\0021830\OneDrive - ViewNext\Escritorio\ManuelCobosDev\portfolio" C:\dev\manuelcobos.dev
  cd C:\dev\manuelcobos.dev
  npm ci
  npm run build
  npm run qa
  ```

- [ ] Trabaja **solo** en la carpeta nueva a partir de ahora.
- [ ] **No borres** la carpeta antigua todavía: archívala o bórrala tú mismo
      cuando compruebes que el clon nuevo está completo.

## 1. Repositorio y Pages

- [ ] Crea el repositorio `ManuelCobosDev/manuelcobos.dev` y sube el proyecto
      (`git push origin development` y `git push origin main`).
- [ ] En **Settings → Pages**, elige la fuente **GitHub Actions**.
- [ ] Comprueba que el primer `Deploy to GitHub Pages` termina en verde.
- [ ] Establece `main` como rama por defecto.

## 2. Dominio personalizado

- [ ] Quita `manuelcobos.dev` del repositorio antiguo (`manuelcobos24.github.io`).
- [ ] En el nuevo repositorio: **Settings → Pages → Custom domain** →
      `manuelcobos.dev`.
- [ ] Marca **Enforce HTTPS**.
- [ ] Conserva los registros DNS existentes de GitHub Pages (CNAME/A a
      `username.github.io`).
- [ ] Si es posible, añade el dominio verificado a nivel de cuenta.

## 3. Redirección de www

- [ ] Configura en el DNS/host la redirección de `www.manuelcobos.dev` al ápex
      `manuelcobos.dev`.

## 4. Google Search Console

- [ ] Añade la propiedad de dominio (verificación TXT en DNS).
- [ ] Envía `https://manuelcobos.dev/sitemap-index.xml`.
- [ ] Usa **URL Inspection → Request indexing** para `/`, `/en/`, `/cv/` y
      `/trabajo/microservicio-orquestador/`.

## 5. Bing Webmaster Tools

- [ ] Importa desde Search Console.
- [ ] Envía el sitemap.

## 6. Validadores externos

- [ ] Google Rich Results Test (la home y el caso de estudio).
- [ ] Schema Markup Validator (`validator.schema.org`).
- [ ] PageSpeed Insights.
- [ ] Google Search Console → URL Inspection.
- [ ] Bing Webmaster Tools.
- [ ] LinkedIn Post Inspector (para la imagen OG al compartir).
- [ ] WebAIM contrast checker (muestra de los dos temas).

## 7. Backlinks y señales de identidad

- [ ] Actualiza todos los enlaces para que apunten a `https://manuelcobos.dev/`
      con el nombre exacto **Manuel Cobos Solís**:
  - [ ] GitHub: campo "Website" y bio.
  - [ ] LinkedIn: "Contact info → Website" y About.
  - [ ] README del perfil de GitHub.
  - [ ] Perfiles de certificaciones (MuleSoft, LPI, Anthropic) si permiten web.

## 8. Sitio antiguo

- [ ] Asegúrate de que `manuelcobos24.github.io` y cualquier URL antigua no
      sirven contenido desactualizado (archiva o borra el repo antiguo, o deja
      una única página de redirección).

## 9. Seguimiento

- [ ] A las 1–2 semanas: revisa Search Console → **Pages** (¿indexadas?) y
      **Performance** (¿consultas?).
- [ ] Mensualmente: sube `lastUpdated` en `src/data/profile.ts` cuando algo
      cambie.

## 10. Crecimiento opcional (fuera de este proyecto)

- [ ] Artículos técnicos.
- [ ] Repositorio público con una demo.
- [ ] Charlas o perfiles de comunidad.

## 11. Modelo de ramas y ramas protegidas

- [ ] Ramas: `main` (producción, protegida) y `development` (integración). El
      trabajo llega a `development` por ramas cortas `feat/*`, `fix/*`, `chore/*`.
- [ ] Release: PR `development` → `main` cuando la CI está en verde; primer tag
      `v1.0.0`.
- [ ] **Settings → Branches → Add branch protection rule** para `main`:
  - [ ] Require a pull request before merging.
  - [ ] Require status checks to pass: `build-and-qa`, `e2e`, `lighthouse`, `audit`.
  - [ ] Require branches to be up to date before merging.
  - [ ] Do not allow force pushes; do not allow deletions.

## 12. Ajustes de GitHub (seguridad y entornos)

- [ ] **Settings → Environments → `github-pages`** → Deployment branches:
      restringir a `main`.
- [ ] **Settings → Code security and analysis**: activar **Dependabot alerts**,
      **Dependabot security updates**, **Secret scanning** y **Push protection**.
- [ ] **Cuenta → Settings → Pages** → verifica el dominio `manuelcobos.dev`
      (evita la toma de control del dominio).

## 13. Dependencias que dependen de acciones del usuario

- [ ] **Retrato real**: `src/assets/manuel-cobos-solis.png` (938×936). Ya está
      colocado; si se sustituye, vuelve a construir. En CI el build **falla** sin él.
- [ ] **CV en PDF**: coloca `public/cv/Manuel-Cobos-Solis-CV.pdf`; el botón de
      descarga aparecerá automáticamente.
