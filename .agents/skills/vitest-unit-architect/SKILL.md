---
name: vitest-unit-architect
description: >-
  Arquitectura de pruebas automatizadas con Vitest, React Testing Library y prevención de regresiones.
  Usar al crear, refactorizar o actualizar componentes, hooks, modales o lógica de negocio, asegurando
  que la suite completa de pruebas pase limpiamente y que la cobertura se mantenga sólida.
---

# Vitest Unit Architect: Estrategia de Testing & Calidad en React / TypeScript

Esta skill establece las pautas y patrones de prueba para mantener la suite de Vitest rápida, confiable y libre de pruebas frágiles en el proyecto.

---

## 1. Patrones Canónicos de Prueba

### A. Pruebas de Comportamiento del Usuario (User-Centric)

- Probar **lo que el usuario ve e interactúa**, no los detalles de implementación internos.
- Utilizar consultas semánticas en este orden de prioridad:
  1. `screen.getByRole('button', { name: /.../i })`
  2. `screen.getByText(/.../i)`
  3. `screen.getByAltText(/.../i)` (para insignias o imágenes clave)
  4. `screen.getByTestId(...)` (solo como último recurso)

### B. Mocks de Entorno Browser Necesarios

Al probar componentes con animaciones o APIs de navegador modernas, asegurarse de mockear:

```typescript
// Mock de IntersectionObserver
window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de ResizeObserver
window.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de matchMedia
window.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));
```

---

## 2. Pruebas de Modales & Flujos de Salida (`AnimatePresence`)

- Al probar modales (`WriteupModal`, `CertModal`), verificar:
  1. Que se monte y renderice el contenido esperado al activarse.
  2. Que al hacer clic en el botón de cerrar o presionar `Escape`, se dispare el callback `onClose`.
  3. Que al completarse la transición de salida (`onExitComplete`), el estado se limpie adecuadamente.

---

## 3. Verificación Rápida y Limpieza

Comandos estándar para ejecutar antes de confirmar cualquier refactorización:

```bash
# Ejecutar toda la suite de pruebas unitarias
npx vitest run

# Verificar tipos sin emitir JavaScript
npx tsc --noEmit

# Compilar para producción
npm run build
```

- Una prueba exitosa debe ejecutarse en milisegundos y ser determinista (0 pruebas intermitentes o "flaky").
