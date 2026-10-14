---
description: Revisa los cambios actuales por errores y regresiones, sin editar
agent: qa-reviewer
subagent: true
---

Revisa los cambios actuales del repositorio en modo lectura. Examina el diff y el contexto de los archivos afectados. Carga `vitest-unit-architect` si hay comportamiento o pruebas involucradas. Informa primero los hallazgos, ordenados por severidad, con archivo, línea, escenario e impacto. Después indica brevemente qué revisaste y qué verificaciones no pudiste ejecutar. No edites archivos ni declares pruebas exitosas sin evidencia.
