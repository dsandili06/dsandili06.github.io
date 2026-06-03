## Rediseño portfolio — Manifesto Brutalist

Tomo como referencia estructural el prototipo elegido y lo construyo sobre el stack actual (TanStack Start + Tailwind v4).

### Dirección visual (fija)

- Paleta: `#0a0a0a` background, `#171717` surface, `#2d1416` border-dim, `#ef4444` accent rojo, `#e5e5e5` foreground.
- Tipografía: Space Mono (display/headings, uppercase, tracking ajustado) + Rubik (body).
- Tratamiento brutalista: bordes duros (sin radius), grids visibles, números de sección gigantes, tipografía masiva en hero, hover en rojo, sin glassmorphism ni gradientes suaves.

### Estructura de la home (una sola página, `src/routes/index.tsx`)

1. Nav sticky con marca `SANDILI // BLUE TEAM` + anchors a secciones.
2. Hero: chip `SOC ANALYST`, indicador `ACTIVE_SESSION`, nombre en Space Mono 10–13rem, descripción + bloque mono de coordenadas/estado.
3. `01 Proyectos`: lista vertical con filas `imagen | texto`. Arranco con los dos proyectos reales del sitio actual (Blue Team Scripts → repo GitHub, y "Proyecto en progreso").
4. `02 Investigaciones`: grid 2 columnas tipo informes DFIR (placeholders editables).
5. `03 Stack` + `04 Formación` en grid 2 columnas. Formación con THM SAL1 (completo, link al certificado real) y CompTIA Sec+ (en proceso).
6. Footer/Contacto: email gigante + links a LinkedIn/GitHub.
7. Barra inferior tipo log con texto en marquesina sutil.

### Implementación técnica

- `src/styles.css`: agrego tokens del prototipo (`--color-accent`, `--color-surface`, `--color-border-dim`, fuentes Space Mono/Rubik vía Google Fonts en `__root.tsx` head links), mantengo la estructura `@theme inline` existente y sobrescribo los semánticos para que el tema oscuro brutalist sea el único modo.
- `src/routes/__root.tsx`: agrego preconnect + stylesheet de Google Fonts, actualizo meta title/description/og a "Santiago Daniel Sandili — SOC Analyst / Blue Team".
- `src/routes/index.tsx`: reemplazo el placeholder por la página completa. Componentes locales para `Nav`, `Hero`, `ProjectRow`, `InvestigationCard`, `LogBar` (todo en el mismo archivo o partido a `src/components/portfolio/` si crece).
- Animaciones: keyframes `slide-up` y `pulse` definidos en `styles.css` con `@theme` + clases utilitarias. Sin librerías nuevas.
- Imágenes: por ahora dejo divs con borde y label monoespaciado en vez de generar fotos (más fiel al brutalismo técnico). Si querés que genere artwork temático después, lo agrego.
- Datos reales que conservo del sitio actual:
  - Bio en español (Buenos Aires / interior, pasión por ciberseguridad, Blue Team).
  - Repo `github.com/dsandili06/blueteam-scripts`.
  - Cert THM SAL1 con link al PDF oficial.
  - CompTIA Sec+ en progreso.
  - Email/links de contacto: dejo placeholders (`#`) si no me los pasás.

### Lo que NO hago en esta iteración

- No agrego CMS ni backend (Lovable Cloud).
- No genero imágenes IA todavía.
- No creo rutas separadas por sección — todo single-page con anchors, como el prototipo.

### Pregunto si querés ajustar antes de construir

- ¿Querés que use tu email real y tus URLs de LinkedIn/GitHub/Twitter? Si sí, pasámelos.
  [https://www.linkedin.com/in/santiagodsandili/](https://www.linkedin.com/in/santiagodsandili/)
  [https://github.com/dsandili06](https://github.com/dsandili06)
  sdsandili06@gmail.com
- ¿Las "Investigaciones" las dejo como placeholders editables o tenés writeups específicos para listar?
  Solo debe haber 1 placeholder, tienen que estar todos los laboratorios realizados en mi github   
  [https://github.com/dsandili06/SOC-Practitioner-Labs](https://github.com/dsandili06/SOC-Practitioner-Labs)

También tengo un proyecto de blue team automation, con scripts básicos de powershell.

[https://github.com/dsandili06/blueteam-scripts](https://github.com/dsandili06/blueteam-scripts)