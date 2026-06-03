## Refresco visual y ajustes de secciones

### 1. Paleta — Ocean Deep (más sutil)

Reemplazo el rojo brutalist por azules profundos + teal. Bajo el contraste agresivo y subo legibilidad.

Tokens nuevos en `src/styles.css`:
- `--background: #0c2340` (navy profundo)
- `--surface: #11304d` (superficie elevada)
- `--border-dim: #1a4a6e` (bordes/grids)
- `--accent: #5cbdb9` (teal — reemplaza el rojo)
- `--accent-secondary: #2d8a9e` (azul medio para hovers/badges)
- `--foreground: #e8eef4` (texto principal)
- `--muted-foreground: #8aa4bd`

Eliminación del rojo: barra inferior de logs pasa a `accent` teal sobre navy, badges/links del mismo color, selección de texto teal.

### 2. Tipografía — Sora (display) + Manrope (body)

- En `__root.tsx`: reemplazo el link de Google Fonts (Space Mono + Rubik) por `Sora` 400/600/700 + `Manrope` 300/400/500/700.
- En `styles.css`: `--font-display: "Sora"`, `--font-body: "Manrope"`.
- Bajo el `tracking-tighter` y `uppercase` masivo del hero a un peso más calmo (Sora se ve mejor sin uppercase forzado en el H1). Mantengo uppercase en labels técnicos pequeños.

### 3. Sección de contacto — rediseño

En `ContactFooter`:
- Quito el header "Establecer Conexión" → uso el mismo patrón `SectionHeader` con número `06` y título `Contacto`.
- Quito el email gigante.
- Dos tarjetas en grid 2 columnas, mismo estilo que el resto del sitio (borde fino, hover teal):
  - **LinkedIn** — `/in/santiagodsandili` + CTA "Ver perfil →"
  - **Email** — `sdsandili06@gmail.com` + CTA "Enviar mensaje →"
- Cada tarjeta con icono SVG inline (mantengo dependencias intactas), label técnico arriba (`CHANNEL_01`, `CHANNEL_02`), título, handle/dirección, CTA.

### 4. Placeholders "en proceso"

Agrego una tarjeta extra al final de cada listado, con estilo distinto (borde punteado, sin link, texto muted, badge `◌ EN PROCESO`):

- **Proyectos** → tarjeta "Próximo proyecto en construcción" (lab personal de detección).
- **Investigaciones / Labs** → "Investigación en proceso" (próximo writeup CyberDefenders).
- **Cursos** → "Curso en proceso" (CompTIA Security+ SY0-701 / formación continua).
- **Certificaciones** → la card de Security+ ya marca `EN PREPARACIÓN`, así que no agrego otra ahí.

Estos placeholders refuerzan la idea de formación constante sin ensuciar los datos reales.

### Archivos a tocar

- `src/styles.css` — tokens de color + fuentes.
- `src/routes/__root.tsx` — link de Google Fonts.
- `src/routes/index.tsx` — `ContactFooter` rediseñado, tarjeta "en proceso" en Proyectos / Labs / Cursos, número de sección `06` para Contacto, ajustes menores de uppercase/tracking si la Sora pide aire.

### Lo que NO cambio

- Estructura general (single-page, nav sticky, secciones numeradas, LogBar).
- Datos reales (labs, certs, cursos, links).
- Hero rotando entre DFIR/MALWARE/BLUE TEAM y el bloque SAL1 Certified.
- Imágenes de proyectos generadas.
