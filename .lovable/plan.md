# Rediseño Contacto + integración 21st.dev

## PASO 1 — Sección Contacto (07) rediseñada

Reescribir `Contacto()` en `src/routes/index.tsx` y **eliminar** el componente `Footer()` (también quitar `<Footer />` de la composición principal).

**Header**
- Título: `ESTABLISH CONNECTION` en Boska (`font-display`), `color: #E8A230`, tamaño grande (clamp ~3rem→5rem).
- Subtítulo mono muted debajo: `[SECURE_CHANNEL] · Tiempo de respuesta: < 24h`.
- Mantener `<Section number="07">`; pasamos el nuevo title.

**Grid: 2 columnas desktop, 1 mobile**

**Col izquierda — Status card**
- `bg: #0E1416`, `border: 1px solid rgba(255,255,255,0.06)`, `padding: 32px`, `border-radius: 4px`.
- Header: `ANALYST STATUS` (mono, uppercase, muted).
- Indicador disponibilidad: círculo `#4DFFB4` con anillo pulsante usando Framer Motion (`animate={{ scale: [1, 1.4], opacity: [1, 0] }}`, `duration: 1.5`, `repeat: Infinity`) + texto `DISPONIBLE PARA OPORTUNIDADES`.
- 3 filas metadata separadas por `border-top: 1px solid rgba(255,255,255,0.04)`:
  - `UBICACIÓN → Tucumán, Argentina`
  - `MODALIDAD → Remoto / Híbrido`
  - `RESPUESTA → < 24 horas`

**Col derecha — 3 cards canales**
- Cada card: `bg #0E1416`, `border 1px solid rgba(255,255,255,0.06)`, `radius 4px`, padding ~24px.
- Hover (`group`): `border-left: 2px solid #E8A230` aparece con transición 200ms + `background: rgba(232,162,48,0.03)`.
- Estructura: label mono muted (`CHANNEL_0X · Nombre`) + valor Inter semibold blanco + botón `Ver perfil / Enviar mensaje / Ver repositorios →` que aparece en hover en ámbar.
- 01 LinkedIn → `https://linkedin.com/in/santiagodsandili`
- 02 Email → `mailto:sdsandili06@gmail.com`
- 03 GitHub → `https://github.com/dsandili06`

**Footer dentro de Contacto**
- Divisoria `rgba(255,255,255,0.04)`.
- Texto centrado mono muted: `© 2026 Santiago Daniel Sandili · Construido con criterio técnico`.

Eliminar `Footer()` y su uso. El `<Section>` actual envuelve todo; el footer va fuera del grid pero dentro de la sección.

## PASO 2 — BackgroundPaths en Hero

- Instalar: `npx shadcn@latest add "https://21st.dev/r/background-paths"` (se descarga a `src/components/ui/background-paths.tsx`).
- Auditar el archivo descargado y **patchearlo** para:
  - Reemplazar color de paths por `rgba(232,162,48,0.06)`.
  - Quitar gradiente default (regla global).
  - Quitar título/CTA internos del componente si los trae; usar solo los paths SVG como fondo.
- En `Hero()`: agregar como hijo absoluto detrás del contenido:
  ```tsx
  <div className="absolute inset-0 -z-10 pointer-events-none">
    <BackgroundPaths />
  </div>
  ```
- El `<section>` del hero ya es `relative overflow-hidden`. Conservar `grid-bg` o decidir si compite visualmente (mantener por ahora, evaluar tras instalar).

## PASO 3 — Radial Orbital Timeline en Stack

- Instalar: `npx shadcn@latest add "https://21st.dev/r/radial-orbital-timeline"`.
- Adaptación: **4 nodos = 4 categorías** (SIEM & Network, etc.). Click en un nodo expande las herramientas de esa categoría.
- Mapear el shape esperado por el componente desde la constante `STACK` existente: `{ id, title: cat.category, content: cat.items.join(' · '), status, energy, icon }`. Si el componente exige campos `date`/`status` rígidos, los rellenamos con valores semánticos (`status: 'in-progress'` para la categoría activa, etc.) — sin mostrarlos si rompen el lenguaje visual.
- **Patch obligatorio** al archivo descargado:
  - Reemplazar todos los gradientes (`bg-gradient-*`, `from-* to-*`) por colores sólidos.
  - Paleta: nodos `#E8A230`, nodo activo/disponible `#4DFFB4`, fondo `#080C0E`, líneas conectoras `rgba(255,255,255,0.08)`.
  - Quitar glows/blurs si dependen de gradiente.
- Reemplazar el contenido actual de `Stack()` por el componente. Mantener el `<Section number="04" title="Stack Técnico" kicker="TOOLING">` wrapper.

## Reglas globales respetadas
- Paleta intacta (`#080C0E`, `#E8A230`, `#4DFFB4`).
- Sin gradientes en botones ni fondos de sección — los componentes 21st.dev se patchean antes de usarse.
- Sin blobs/formas decorativas (solo los paths SVG sutiles del hero).
- Contenidos y links originales preservados (LinkedIn, Email, GitHub).

## Notas técnicas
- Los componentes de 21st.dev se descargan como código local en `src/components/ui/` — son editables y los modificamos para cumplir reglas.
- Si `shadcn add` falla por registry no soportado, fallback: descargar manualmente el código del registry JSON y crear el archivo.
- Verificar imports adicionales (probablemente `lucide-react` ya está; si pide `motion/react` mapear a `framer-motion` que ya usás).
- Mobile: orbital se renderiza más pequeño; status card y channel cards apilan en 1 columna.
