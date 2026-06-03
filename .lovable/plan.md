# Plan: actualizar copys del portfolio

Cambios sólo de texto/estructura mínima. No se toca diseño, layout, ni cards de investigaciones.

## 1. Hero (`src/routes/index.tsx`, función `Hero`)

- Mantener `<h1>` "Santiago / Sandili" como está.
- Reemplazar la zona del párrafo (líneas ~807-817) por el subtítulo profesional + 3 párrafos descriptivos:
  - Subtítulo (pill o línea destacada): `SOC Analyst Jr. · Blue Team · DFIR · Malware Analysis`
  - Párrafo 1: "Soy Santiago Daniel Sandili, analista SOC Jr. orientado a Blue Team, DFIR y análisis de malware..."
  - Párrafo 2: "Con el tiempo empecé a inclinarme cada vez más por la parte defensiva..."
  - Párrafo 3: "Este portfolio reúne parte de ese recorrido..."
- Mantener la card lateral del SAL1, pero actualizar la línea `TryHackMe · SOC Analyst Lvl 1` → `TryHackMe · Security Analyst L1` para alinearla con el resto del sitio.

## 2. Nueva sección "About Me"

- Agregar `<Section id="about" number="01" title="About Me">` justo después del `<Hero />` y renumerar las siguientes (Proyectos pasa a `02`, Investigaciones `03`, Stack `04`, Certificaciones `05`, Cursos `06`).
- Contenido: los 2 párrafos pedidos ("Vengo del interior de Tucumán..." y "Me gusta trabajar sobre memoria...").
- Agregar entrada `{ href: "#about", id: "about", label: "About" }` al array `links` del `Nav` (queda primero).

## 3. Badges de certificaciones (array `CERTIFICATIONS`)

- Mantener las 2 cards existentes pero ajustar etiquetas/estado:
  - SAL1 → label visible "THM SAL1 Certified" (agregar campo `badge` o ajustar el render del badge superior cuando `obtained`).
  - CompTIA Security+ → estado mostrado como "CompTIA Security+ · en preparación" (texto del chip o subtítulo, según render actual con `◌ EN PREPARACIÓN`).
- Ajuste mínimo del componente de card para mostrar el texto pedido sin alterar el layout.

## 4. Blue Team Automation Scripts (`PROJECTS[1].description`)

Reemplazar por:
> "Repositorio de scripts orientados a tareas operativas de SOC y DFIR. La idea es ir documentando utilidades que me sirvan para triage, parsing, recolección de evidencia y automatización de tareas repetitivas."

## 5. Cursos (sección "Cursos Completados")

- Cada item ya muestra `✓ COMPLETO`. Renombrarlo a `✓ COMPLETADO` para coincidir con el copy pedido y verificar consistencia visual (mismo chip en todos).
- No tocar el item "EN PROCESO" (curso 10).

## 6. Estilo / limpieza

- Revisar acentos y ortografía en los bloques modificados (hero, about, descripción blue team, badges).
- No tocar descripciones de los writeups de CyberDefenders ni el stack.

## 7. Verificación

- Recargar `/`, confirmar:
  - Hero muestra subtítulo + 3 párrafos nuevos.
  - Sección About aparece antes de Proyectos, numerada `01`, y el nav tiene el link "About".
  - Numeración 02–06 correcta en el resto.
  - Card SAL1 dice "THM SAL1 Certified"; CompTIA dice "en preparación".
  - Card de Blue Team Scripts con la nueva descripción.
  - Todos los cursos completados muestran `✓ COMPLETADO`.
