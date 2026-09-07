---
name: creative-awwwards-craft
description: >-
  Dirección de arte web de vanguardia, estética visual sin igual y estándares Awwwards/FWA.
  Usar cuando el usuario pida diseñar, rediseñar o pulir la estética visual de secciones, componentes,
  el Hero, tarjetas, tipografía o atmósfera general, garantizando un acabado cinematográfico y artesanal
  que erradique patrones genéricos de plantilla ("AI-slop").
---

# Creative Awwwards Craft: Dirección de Arte & Diseño Web de Vanguardia

Esta skill proporciona las directivas, principios de diseño y estándares de ingeniería creativa necesarios para construir interfaces memorables de nivel internacional (Awwwards Site of the Day / FWA / Developer Award), evitando activamente soluciones visuales genéricas.

---

## 1. El Manifiesto "Anti-AI Slop"

Queda estrictamente prohibido generar interfaces que parezcan plantillas genéricas de IA:
- ❌ **No a las cajas aburridas con borde gris de 1px plano** (`border border-neutral-800` en cada elemento).
- ❌ **No a los bento grids repetitivos y predecibles** sin variación de escala, peso o tensión visual.
- ❌ **No a los textos centrados flotando en el vacío** sin un ancla estructural o contexto editorial.
- ❌ **No a los botones "píldora con gradiente violeta/azul genérico"** que parecen de demo comercial barata.
- ❌ **No a la falta de profundidad**: las pantallas planas sin planos focales restan interés al usuario.

---

## 2. Pilares de la Estética Cyber-Luxury & Terminal Élite

Para este portafolio (Ciberseguridad, DFIR, SOC Analyst y Red Team), el lenguaje visual debe transmitir **alta precisión técnica, misterio táctico y sofisticación de élite**:

### A. Atmósfera e Iluminación Multi-Capa
- **Fondo Base**: Tonos casi negros con subtono azul/verdoso táctico (ej. `#04070b`, `#06090e`), nunca negro puro `#000000` mate.
- **Capas de Luz Ambiental**: Luces radiales sutiles en esquinas o detrás de elementos clave (`radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.08), transparent 70%)`).
- **Malla Táctica / Ruido**: Texturas de grano analógico muy tenue (noise overlay) o micro-rejillas HUD que dan sensación de instrumental de laboratorio.

### B. Tipografía como Elemento de Arte (Typography-as-Hero)
- **Escala Fluida**: Utilizar siempre `clamp()` para que los titulares dominen el viewport sin desbordarse (`clamp(2.5rem, 8vw, 9rem)`).
- **Contraste de Familias**:
  - Títulos principales en Display o Grotesk audaz con tracking negativo sutil (`tracking-[-0.03em]`).
  - Metadatos, etiquetas y patadas técnicas en fuentes Mono (`JetBrains Mono`, `Geist Mono`, `Space Mono`) con tracking expandido (`tracking-[0.25em]`).
- **Kickers / Eyebrows Tácticos**: Cada bloque importante debe contar con un kicker numerado o de estatus (ej. `// 02 · ARCHIVE_SYSTEM`).

### C. Profundidad & Materialidad (Glassmorphism de Alta Gama)
- En lugar de bordes planos, usar **bordes con gradiente de luz** (`border-t border-cyan-400/20 border-b border-transparent`).
- **Desenfoques Refractivos**: `backdrop-filter: blur(12px) saturate(160%)` con fondos `rgba(4, 7, 11, 0.85)`.
- **Efecto Especular en Esquinas**: Destellos estelares sutiles (4-point sparkle) en las aristas de tarjetas o insignias para simular pulido metálico/cristal.

---

## 3. Composición y Tensión Espacial

1. **Asimetría Intencional**: Romper la monotonía combinando columnas de anchos desiguales (ej. 60/40 o 70/30) donde la columna dominante lleva el peso visual y la secundaria alberga metadatos de telemetría.
2. **Espacio Negativo Activo**: Dejar "respirar" los elementos clave; el espacio vacío en el diseño premium no es espacio perdido, es el lienzo que da valor al contenido.
3. **Escaneabilidad Táctica**: Un reclutador técnico o CISO debe poder extraer el valor en 3 segundos (títulos claros, métricas clave en números gigantes, badges directas).

---

## 4. Lista de Control de Calidad Visual (Pre-entrega)

Antes de dar por finalizada cualquier modificación visual, validar:
- [ ] ¿El diseño se siente único y artesanal, o parece un template genérico?
- [ ] ¿Los contrastes cumplen el estándar de legibilidad (mínimo 4.5:1 en texto regular, 7:1 en texto clave)?
- [ ] ¿Existe una jerarquía clara: Titular → Metadato técnico → Cuerpo → Acción?
- [ ] ¿En mobile el diseño mantiene la fuerza visual sin desbordes horizontales ni botones diminutos?
- [ ] ¿Las transiciones visuales se ejecutan a 60/120 FPS sin tirones?
