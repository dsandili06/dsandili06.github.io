# Plan: arreglar scroll, reveal y glitch en desktop (1920px)

## Diagnóstico

Mirando el código y el preview en 1920px detecté **3 problemas concretos** que coinciden con lo que describís:

### 1. Glitch del nombre "SANTIAGO / SANDILI"
- El `<h1>` combina dos animaciones que pelean entre sí: `glitch-on` (translate + text-shadow cada 8s) y `animate-reveal` (slide-up con `transform: translateY`).
- En desktop, con `text-[12rem]`, los `translate(-2px, 1px)` se notan como un "salto" feo del título cada ~8 segundos.
- Además `tracking-tighter` + `leading-[0.85]` + el text-shadow del glitch dejan halos cromáticos que en pantallas grandes parecen un bug.

### 2. Aparición de secciones (reveal) entrecortada
- Cada `section[data-reveal]` se anima con `translate3d(0, 24px, 0)` + `opacity 0 → 1`. En desktop muchas secciones miden más que el viewport y el `rootMargin: "0px 0px -10% 0px"` con `threshold: 0.01` hace que el reveal se dispare muy tarde — la sección ya está visible cuando empieza a aparecer.
- `contain: layout paint` en `.reveal-on-view` rompe el flujo de scroll cuando hay grids grandes (stack/certs), generando reflows visibles.
- Al final del reveal queda `will-change: transform, opacity` permanente, lo que ensucia el composite layer y empeora el scroll posterior.

### 3. Scroll
- Hay doble fuente de smooth-scroll: CSS `html { scroll-behavior: smooth }` + `window.scrollTo({ behavior: "smooth" })` en handlers. Funcionan, pero el offset del nav es `-56` cuando el nav real mide `h-16` (64px) → al hacer click en un link queda el título tapado.
- En desktop, sin offset bien calibrado, se siente "saltón".

## Cambios

### `src/styles.css`
1. Reescribir `@keyframes glitch` para que **no haga translate** — solo aberración cromática suave con `text-shadow`, y bajar la frecuencia (de 8s a 12s) para que sea un detalle, no un glitch molesto.
2. `.reveal-on-view`:
   - Reducir desplazamiento a `translate3d(0, 16px, 0)` y duración a `0.55s` para una entrada más natural.
   - Quitar `contain: layout paint` (causa reflows en grids grandes).
   - Limpiar `will-change` al terminar la animación (`animation-fill-mode` + reset vía `.in-view` con `will-change: auto`).
3. Añadir `scroll-padding-top: 64px` en `html` para que el ancla scrollee respetando la altura del nav sticky.

### `src/routes/index.tsx`
1. `useRevealOnView`:
   - Cambiar a `rootMargin: "0px 0px -15% 0px"` y `threshold: [0, 0.15]` para que el trigger sea predecible en pantallas altas.
   - Tras añadir `in-view`, en `animationend` quitar `will-change`.
2. `handleNavClick`: usar offset real `64` (altura del nav `h-16`) en vez de `56`.
3. Hero `<h1>`: separar el `animate-reveal` del `glitch-on` envolviendo el texto en un `<span class="glitch-on">` interno, así la animación de reveal (transform del padre) no se acumula con los micro-transforms del glitch.

## Verificación
- Recargar `/` en 1920×1080.
- Confirmar que el nombre no "salta" cada 8s (solo halo cromático muy sutil).
- Scrollear lento y rápido: secciones aparecen suaves, sin saltos ni reflows.
- Click en cada link del nav: la sección queda bien posicionada bajo el nav sticky, no tapada.
- Probar `prefers-reduced-motion`: todo aparece estático sin animaciones.

## Nota sobre el espacio a los costados
El layout usa `max-w-7xl` (≈1280px) centrado — eso es **intencional** para legibilidad. En 1920px sobran ~320px por lado y eso es esperable. Si querés, lo puedo abordar como cambio aparte (ampliar a `max-w-[1600px]` o agregar contenido decorativo lateral), pero no lo incluyo acá porque dijiste que el problema principal es scroll/reveal/glitch.
