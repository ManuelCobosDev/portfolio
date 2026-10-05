# Lista de lanzamiento / Launch checklist

Pasos manuales a realizar después del desarrollo. Hazlos en orden y marca cada
casilla.

## 1. Repositorio y Pages

- [ ] Crea el repositorio `ManuelCobosDev/manuelcobos.dev` y sube este proyecto
      (`git push`), rama `main`.
- [ ] En **Settings → Pages**, elige la fuente **GitHub Actions**.
- [ ] Comprueba que el primer `Deploy to GitHub Pages` termina en verde.

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
