## Diagnóstico

Verifiqué el preview y confirmé el problema:

1. **Las secciones no animan**: en `src/styles.css` la animación está definida como `@utility reveal-on-view { ... }`. En Tailwind v4, `@utility` es "on-demand": solo se emite si el escáner detecta la clase como literal en el código fuente. Como `reveal-on-view` y `in-view` se agregan dinámicamente con `classList.add(...)` desde JS (`src/routes/index.tsx` línea 548 y 553), Tailwind no las detecta de forma confiable y **no las compila en el bundle final**. Resultado: el elemento nunca recibe `opacity: 0` ni el `@keyframes reveal-up`, así que aparece de golpe sin animación.

2. **El scroll no se siente suave**: `html { scroll-behavior: smooth }` sí está en el CSS, pero el botón "volver arriba" usa `window.scrollTo({ behavior: "smooth" })` y los anchors del nav dependen del navegador. Conviene asegurar que la regla CSS llegue al bundle y que la navegación por hash también dispare scroll suave programáticamente.

## Cambios propuestos en `src/styles.css`

- **Reemplazar `@utility reveal-on-view`** por reglas CSS planas en `@layer base` (o fuera de cualquier capa on-demand), de modo que SIEMPRE se incluyan en el bundle, independientemente del escáner:

```css
.reveal-on-view {
  opacity: 0;
  transform: translate3d(0, 24px, 0);
  will-change: transform, opacity;
  contain: layout paint;
  backface-visibility: hidden;
}
.reveal-on-view.in-view {
  animation: reveal-up 0.7s var(--ease-out-expo) both;
}
```

- Mantener el bloque `@media (prefers-reduced-motion: reduce)` que ya neutraliza el efecto.

- Como cinturón y tirantes, agregar `@source inline("reveal-on-view in-view");` cerca del top del CSS para que Tailwind tampoco intente eliminar nada relacionado.

## Cambios propuestos en `src/routes/index.tsx`

- **Scroll suave para enlaces del nav**: interceptar clicks en `<a href="#...">` del `Nav` y hacer `document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })`. Esto garantiza scroll suave aún si el navegador ignora `scroll-behavior: smooth` por algún motivo (extensiones, settings de accesibilidad activas).
- Mantener `useRevealOnView` como está (ya quedó bien con `requestAnimationFrame` y soporte de reduce-motion).

## Verificación post-cambio

1. Recargar el preview en `/`.
2. Confirmar que al cargar, las secciones bajo el fold empiezan invisibles y aparecen con fade+slide al scrollear.
3. Click en "PROYECTOS", "CONTACTO", etc. del nav → scroll suave.
4. Click en botón "volver arriba" → scroll suave hasta el tope.
5. Activar `prefers-reduced-motion` en el OS → secciones visibles instantáneamente, scroll instantáneo.

## Archivos a modificar

- `src/styles.css` — convertir `@utility reveal-on-view` en CSS plano y agregar safelist.
- `src/routes/index.tsx` — handler de scroll suave en el Nav.