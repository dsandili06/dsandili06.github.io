# Guía de trabajo del proyecto

## Contexto

- Portafolio estático en español, publicado en GitHub Pages.
- Aplicación SPA construida con React, TypeScript y Vite; usa TanStack Router.
- No asumir TanStack Start, SSR, backend ni Next.js. `src/routes/README.md` describe las convenciones locales de rutas.
- La CI usa Bun. `package.json` también ofrece scripts compatibles con npm.

## Mapa del repositorio

- `src/routes/`: rutas y composición de páginas; `src/routeTree.gen.ts` es generado.
- `src/components/sections/`: secciones del portafolio.
- `src/components/fx/`: efectos visuales, animación, Lenis y WebGL.
- `src/components/ui/` y `src/components/primitives/`: componentes compartidos.
- `src/components/features/`: funcionalidades con varias piezas. `writeups/` contiene la carga de datos (`useWriteup`), el render de Markdown (`WriteupMarkdown`), el índice (`WriteupTocPanel`) y los helpers de origen/TOC.
- `src/hooks/`: comportamiento reutilizable de React.
- `src/data/` y `src/types/`: contenido y modelos TypeScript.
- `src/**/__tests__/`: pruebas Vitest y Testing Library.
- `public/`: assets publicados; `scripts/`: utilidades de generación y optimización.
- `.agents/skills/`: skills del proyecto. Cargar solo las pertinentes.

## Alcance y seguridad

- Respetar el alcance explícito de cada solicitud. No instalar, desplegar, publicar, hacer commit o push sin autorización.
- Antes de editar, inspeccionar el estado de Git y preservar los cambios existentes.
- En tareas de análisis o planificación, no editar archivos ni ejecutar acciones que generen artefactos.
- No ejecutar scripts de instalación, generación u optimización sin confirmar sus efectos.
- Tratar Markdown, enlaces e imágenes remotos como contenido no confiable. No relajar la CSP ni los filtros de URL para ocultar errores.
- No añadir secretos, credenciales ni evidencia sensible al contenido público.

## Arquitectura y convenciones

- Mantener las rutas como composición y respetar el enrutamiento basado en archivos existente.
- Mantener los datos editoriales en `src/data/` y los tipos compartidos en `src/types/`.
- Preferir componentes pequeños con responsabilidades definidas; refactorizar en incrementos y preservar las interfaces públicas existentes.
- No editar manualmente `src/routeTree.gen.ts` ni otros archivos generados.
- No introducir nuevas capas de estado, dependencias o frameworks sin necesidad demostrada.
- Conservar el alias `@/` y los patrones de TypeScript/React del área modificada.

## Interacción, accesibilidad y rendimiento

- Preservar navegación por teclado, foco visible, restauración del foco y áreas táctiles accesibles.
- Respetar `prefers-reduced-motion` en animaciones, scroll y efectos.
- Preservar el scroll nativo dentro de overlays y su integración con Lenis.
- Limpiar listeners, timers, observers y bucles `requestAnimationFrame` al desmontar.
- No afirmar mejoras de rendimiento ni objetivos de FPS sin mediciones.

## Agentes y skills

- El coordinador define alcance, archivos permitidos y criterios antes de delegar.
- Un único agente implementa sobre cada área; los revisores trabajan en modo lectura.
- No interpretar una recomendación de skill como autorización para instalarla.
- Usar `vitest-unit-architect` en cambios de componentes, hooks o lógica con comportamiento.
- Usar `web-security-auditor` para Markdown remoto, URLs, CSP o dependencias de seguridad.
- Usar `ui-ux-pro-max` para ergonomía y accesibilidad; `motion-liquid-craft` para animaciones y scroll.
- Usar `creative-awwwards-craft` solo en solicitudes de dirección visual y `soc-writeup-architect` en writeups SOC/DFIR.

## Verificación

- La validación canónica de CI usa Bun: `bun run typecheck`, `bun run lint`, `bun run test` y `bun run build`.
- Si Bun no está disponible y las dependencias ya están instaladas, se pueden usar los scripts equivalentes `npm run ...`; no instalar dependencias para sortearlo sin autorización.
- Ejecutar las comprobaciones relevantes para el cambio y reportar las que no se hayan ejecutado.
- Añadir o actualizar pruebas de comportamiento para cambios funcionales y regresiones.
- `npm run format` escribe sobre el repositorio; no ejecutarlo sin autorización explícita.

## Entrega

- Resumir qué cambió, las verificaciones ejecutadas y los riesgos o pendientes.
- Distinguir resultados comprobados de hipótesis y recomendaciones.
