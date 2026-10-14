# Portafolio — Santiago Daniel Sandili

Portafolio personal de **Santiago Daniel Sandili**, Analista de Seguridad L1 orientado a
Blue Team: DFIR, threat hunting, malware analysis y automatización defensiva.

Es una **SPA estática** construida con React, TypeScript, Vite y TanStack Router, publicada
en GitHub Pages. No hay backend ni SSR.

- Sitio: <https://dsandili06.github.io>
- Stack destacado: React 19 · TypeScript · Vite 7 · TanStack Router · Tailwind CSS 4 · Motion · Lenis

---

## Requisitos

- **Node.js 20.19+ o 22.12+** (rango que exige Vite 7).
- **Bun** es el gestor usado por la CI. También funciona con npm si las dependencias ya están instaladas.

---

## Puesta en marcha

```bash
# Instalar dependencias
bun install            # o: npm install

# Servidor de desarrollo → http://localhost:8080
bun run dev            # o: npm run dev

# Verificaciones
bun run typecheck      # tsc --noEmit
bun run lint           # eslint .
bun run test           # vitest run
bun run build          # vite build → dist/

# Formatear (escribe sobre el repo)
bun run format
```

---

## Estructura

```text
src/
├── routes/                 Rutas y composición (file-based routing)
├── components/
│   ├── sections/           Secciones del portafolio (Hero, About, Certs, Proyectos…)
│   ├── features/           Funcionalidades con varias piezas
│   │   └── writeups/       useWriteup, WriteupMarkdown, WriteupTocPanel, políticas
│   ├── fx/                 Efectos visuales, animación, Lenis y WebGL
│   ├── primitives/         Componentes compartidos (Section, fallbacks)
│   ├── ui/                 Componentes base (tooltip, badge)
│   └── *Modal.tsx          Modales de writeups, certificados y CompTIA
├── hooks/                  Comportamiento reutilizable de React
├── data/                   Contenido editorial y metadatos del sitio
├── types/                  Modelos TypeScript compartidos
└── styles.css              Tema, tokens y utilidades

public/                     Certificados, badges, fuentes self-hosted, OG image, sitemap
scripts/                    Utilidades de generación y optimización de assets
.github/workflows/          CI (validación) y deploy (GitHub Pages)
.agents/skills/             Skills del proyecto para agentes
.opencode/                  Agentes y comandos de OpenCode
```

Convenciones de rutas: [`src/routes/README.md`](src/routes/README.md).
Guía de trabajo para agentes: [`AGENTS.md`](AGENTS.md).

---

## Metadatos del sitio

Título, descripción, tagline, URL, imagen Open Graph, locale y theme color viven en un solo
lugar: [`src/data/site.ts`](src/data/site.ts).

`index.html` mantiene una copia estática de esos valores para que el documento sea correcto
antes de hidratar. `src/data/__tests__/site.test.ts` verifica que ambos no se desincronicen,
así que si cambiás un metadato hacelo en el módulo y replicá el cambio en `index.html`.

---

## Cómo publicar un writeup nuevo

Los writeups se renderizan on-demand desde un repositorio externo, no se copian a este repo.

1. Agregá el `.md` al repo de labs:
   `dsandili06/Artifakt-Labs` → `Writeups/CyberDefenders/<Nombre>.md`
2. Registrá el caso en [`src/data/investigations.ts`](src/data/investigations.ts):
   ```ts
   {
     id: "LAB_0XX",
     title: "Nombre del caso",
     platform: "CyberDefenders",
     summary: "Una o dos frases con el hallazgo principal.",
     categories: ["Malware Analysis"],
     href: CD_BASE + "<Nombre>.md",
   }
   ```
3. Verificá con `bun run test` y `bun run build`.

El modal construye la URL cruda a partir de `href`, cachea el contenido en `sessionStorage`
y aplica la política de URLs e imágenes de `src/components/writeupMarkdownPolicy.ts`
(solo se permiten hosts de GitHub, buckets S3 configurados e imágenes `data:` raster
de hasta 1 MiB; el HTML crudo no se renderiza).

Para redactar el contenido usá la skill `soc-writeup-architect`.

---

## Certificados

Las imágenes y PDFs viven en `public/certs/`. Para convertir PNG/JPG a WebP:

```bash
node scripts/optimize-certs.mjs
```

Para regenerar la imagen Open Graph desde `public/og-image.svg`:

```bash
node scripts/generate-og.mjs
```

---

## Pruebas

36 archivos de prueba y 248 casos con Vitest + Testing Library, cubriendo componentes,
hooks, datos y políticas de seguridad. Casos particularmente sensibles: scroll móvil dentro
de modales, navegación atrás del navegador, overlays anidados y render de Markdown remoto.

```bash
bun run test              # suite completa
bun run test:watch        # modo observación
```

---

## CI y publicación

- **CI** (`.github/workflows/ci.yml`): corre en PRs y pushes a `main`. Instala con lock
  congelado y ejecuta typecheck, lint, tests y build. No publica nada.
- **Deploy** (`.github/workflows/deploy.yml`): se dispara solo cuando el CI de un push a
  `main` termina con éxito, y publica en GitHub Pages.

Cada cambio entra por PR con el CI en verde.

---

## Accesibilidad y movimiento

- `MotionConfig reducedMotion="user"` desactiva transformaciones de Motion.
- Los reveals escalonados y `animate-pulse`/`animate-spin` se neutralizan con
  `prefers-reduced-motion` en `src/styles.css`.
- Los overlays comparten pila de Escape, bloqueo de scroll con conteo de referencias,
  foco atrapado y restauración al cerrar.

La accesibilidad por teclado y lector de pantalla del drawer móvil y de los estados del
writeup quedó validada de forma manual.
