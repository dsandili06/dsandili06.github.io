---
name: motion-liquid-craft
description: >-
  Física de animación, microdestellos, superficies translúcidas (liquid glass) y rendimiento a 60-120 FPS.
  Usar al implementar animaciones, microinteracciones, transiciones de modales, efectos de brillo o destellos,
  dinámicas de scroll con Lenis o efectos ópticos en tarjetas e insignias, garantizando fluidez sin tirones.
---

# Motion Liquid Craft: Física Visual & Animación de Alto Rendimiento

Esta skill dicta cómo implementar animaciones, transiciones y efectos visuales cinemáticos que se sientan orgánicos y mantengan una tasa constante de 60 a 120 FPS sin penalizar la CPU.

---

## 1. Regla de Oro: Aceleración Exclusiva por GPU

Para evitar recálculos de layout (reflow) o repintados continuos de la CPU (repaint), **solo se deben animar propiedades que la GPU pueda componer directamente**:

### ✅ Propiedades Permitidas para Animación:
- `transform` (`scale`, `translate3d`, `rotate`)
- `opacity`
- `filter` / `backdrop-filter` (con moderación y siempre acelerado por hardware)

### ❌ Propiedades Prohibidas para Animación:
- `width`, `height`, `top`, `left`, `margin`, `padding` (forzan reflow masivo en cada frame).
- `box-shadow` pesado en bucles de keyframes infinitos (provoca calentamiento y caída de frames en dispositivos móviles).

---

## 2. Superficies "Liquid Glass" (Vidrio Líquido y Táctico)

Para paneles, tarjetas flotantes y modales de alta gama:
- **Estructura Recomendada:**
  ```css
  background: rgba(4, 7, 11, 0.82);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 
    0 4px 24px -1px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
  ```
- **Borde Refractivo Superior:** El `inset 0 1px 0 0 rgba(255, 255, 255, 0.1)` simula la luz incidiendo en el bisel superior de un cristal o pantalla de instrumentación.

---

## 3. Microdestellos & Efectos Especulares (Corner Glints)

Al agregar destellos o brillos a insignias o badges (como en la sección de Certificaciones):
1. **Destello Estelar de 4 Puntas Curvo**:
   Utilizar SVG con curvas Bézier cúbicas precisas:
   ```svg
   <svg viewBox="0 0 24 24" fill="currentColor">
     <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
   </svg>
   ```
2. **Transición en Hover**:
   - Reposo: `opacity-0 scale-50 rotate-0`
   - Hover: `opacity-100 scale-100 rotate-45` con transición `duration-500 ease-out`.
   - Halo difuso detrás: `bg-cyan-400/30 blur-sm`.
   - Cero JS, cero repaints fuera de interacción.

---

## 4. Coreografía con Lenis & Scroll Reveals

1. **Desacoplamiento de Chunks Lazy**:
   - Los elementos con `[data-reveal]` en componentes renderizados dinámicamente deben ser observados con un `MutationObserver` o `IntersectionObserver` activo para que animen suavemente al entrar en pantalla.
2. **Pausa en Segundo Plano**:
   - Cualquier bucle de `requestAnimationFrame` (como shaders WebGL o canvas de partículas) **debe pausarse automáticamente** cuando el componente no esté visible en el viewport (`IntersectionObserver`).
3. **Respeto a Preferencias del Usuario (`prefers-reduced-motion`)**:
   - Siempre incluir `@media (prefers-reduced-motion: reduce)` para desactivar transiciones cinemáticas y reemplazarlas por cambios instantáneos de opacidad para usuarios con sensibilidad al movimiento.
