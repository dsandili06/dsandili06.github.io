# Rutas

El proyecto usa **TanStack Router con rutas basadas en archivos**, integrado mediante
`@tanstack/router-plugin/vite` en `vite.config.ts`. No es una aplicación TanStack Start.

## Convenciones actuales

- `index.tsx` define la ruta `/`.
- `__root.tsx` define la ruta raíz y renderiza el contenido mediante `<Outlet />`.
- Añade otras rutas siguiendo la sintaxis de TanStack Router y la configuración del plugin.
- `src/routeTree.gen.ts` es generado automáticamente; no editarlo a mano.

Consulta `vite.config.ts`, `src/router.tsx` y los archivos de ruta existentes antes de
introducir rutas dinámicas, layouts u otras convenciones que todavía no utiliza el proyecto.
