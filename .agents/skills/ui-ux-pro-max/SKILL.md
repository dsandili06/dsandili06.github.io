---
name: ui-ux-pro-max
description: >-
  Sistemas de diseño, reglas matemáticas de UI/UX, proporciones cromáticas y ergonomía de interacción.
  Usar al diseñar componentes, formularios, navegación, paletas de color, espaciado de layout
  o al revisar consistencia visual y ergonomía responsive, garantizando interfaces con precisión de píxel.
---

# UI/UX Pro Max: Sistemas de Diseño & Ergonomía de Interacción

Esta skill establece las reglas matemáticas, cromáticas y ergonómicas que garantizan consistencia, legibilidad y fluidez de uso en cada componente del sistema.

---

## 1. La Regla Cromática 60 / 30 / 10

Toda vista o componente debe equilibrarse visualmente siguiendo la regla de distribución:
- **60% Dominante (Fondo y Canvas Base):**
  - Colores profundos de baja fatiga ocular (`#04070b`, `var(--background)`).
  - Actúa como la atmósfera inmersiva donde flotan los elementos.
- **30% Estructural (Superficies, Paneles, Tarjetas, Bordes):**
  - Superficies elevadas (`var(--card)`, `#0a0f16`), paneles semitransparentes y líneas divisoras tácticas (`var(--border)`, `rgba(255, 255, 255, 0.08)`).
- **10% Acento Táctico (Puntos de Foco e Interacción):**
  - Reservado estrictamente para elementos que requieren atención inmediata: CTAs principales, badges de estado activo, puntuaciones numéricas (`var(--accent)`, cyan `#22d3ee` / electric blue `#3b82f6`).
  - ⚠️ *Nunca usar el acento en áreas grandes de fondo que saturen la vista.*

---

## 2. Ritmo Espacial Matemático (Sistema de Rejilla de 8pt)

Todos los márgenes, paddings, gaps y dimensiones deben ser múltiplos de 4px / 8px:
- **4px (`0.25rem` / `gap-1`):** Micro-espacios entre iconos y etiquetas.
- **8px (`0.5rem` / `gap-2`):** Espaciado interno de badges o elementos compactos.
- **16px (`1rem` / `p-4` / `gap-4`):** Padding estándar en tarjetas móviles.
- **24px (`1.5rem` / `p-6` / `gap-6`):** Separación de grupos de información en escritorio.
- **32px a 48px (`gap-8` a `gap-12`):** Gaps entre columnas principales.
- **64px a 96px (`py-16` a `py-24`):** Separación vertical entre secciones principales del sitio.

---

## 3. Estados de Interacción Completos (Interaction States)

Ningún elemento interactivo (`<button>`, `<a>`, `<input>`, tarjeta cliqueable) puede existir sin sus 5 estados claramente definidos:
1. **Default:** Aspecto limpio con pistas sutiles de interactividad (`cursor-pointer`).
2. **Hover:** Respuesta visual inmediata y refinada:
   - Ligero escalado (`scale-[1.02]` o `scale-105`).
   - Aumento sutil de brillo (`brightness-110`).
   - Sombra proyectada con tinte de acento (`drop-shadow` o `box-shadow` suave).
3. **Active / Pressed:** Reducción elástica (`scale-[0.98]`) que proporciona feedback táctil de clic.
4. **Focus-Visible (Accesibilidad):** Anillo de foco nítido y visible (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#04070b]`).
5. **Disabled:** Opacidad reducida (`opacity-40`), cursor no permitido (`cursor-not-allowed`) y eventos de puntero desactivados.

---

## 4. Ergonomía Móvil & Touch Targets

- **Área Mínima de Toque:** Todo botón, enlace o icono interactivo en móvil debe tener un área táctil mínima de **44x44px** (utilizar `min-h-[44px]` o pseudo-elementos invisibles para ampliar el área de clic).
- **Zona del Pulgar (Thumb Zone):** Las acciones principales en móvil (como abrir menú, cerrar modales o filtros) deben ubicarse en zonas accesibles con una sola mano (tercio inferior de la pantalla).
- **Control Estricto de Viewport:**
  - Cero desbordes horizontales: utilizar `max-w-full overflow-x-clip` en contenedores raíz.
  - Asegurar paddings laterales defensivos en pantallas pequeñas: `px-4 sm:px-6 md:px-10`.

---

## 5. Accesibilidad & Contraste (WCAG 2.1 AA)

- Texto normal (< 18px): Ratio de contraste mínimo de **4.5:1** contra el fondo.
- Texto grande (≥ 18px bold o ≥ 24px): Ratio de contraste mínimo de **3:1**.
- Texto secundario / muted: Utilizar tonos con suficiente luminosidad (ej. `#94a3b8` que da 6.3:1 contra `#04070b`, evitando grises oscuros ilegibles como `#4b5563`).
