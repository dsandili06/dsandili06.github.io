---
name: soc-writeup-architect
description: >-
  Estructura formal y redacción técnica para writeups de Ciberseguridad, DFIR, Threat Hunting y SOC.
  Usar cuando el usuario pida redactar, maquetar, estructurar o documentar casos de investigación,
  análisis de malware, informes de incidentes o laboratorios de TryHackMe/Blue Team para el portafolio.
---

# SOC Writeup Architect: Metodología Editorial para Investigaciones de Ciberseguridad

Esta skill define el estándar editorial y técnico para la documentación de casos prácticos e investigaciones en el portafolio de Santiago Daniel Sandili (SOC Analyst Jr. / Blue Team).

---

## 1. Estructura Canónica de un Caso de Investigación

Cada writeup o caso de investigación debe estructurarse siguiendo las mejores prácticas de la industria (SANS, MITRE, NIST):

### 1. Metadatos de Cabecera (Header Telemetry)
- **ID del Caso:** Formato `CASE-XXX` o `INC-XXXX`.
- **Nivel de Severidad:** `CRITICAL` (Rojo), `HIGH` (Naranja), `MEDIUM` (Amarillo), `LOW` (Azul/Verde).
- **Tipo de Amenaza:** `Ransomware`, `Credential Access`, `Lateral Movement`, `Data Exfiltration`, `Phishing`.
- **Herramientas Utilizadas:** `Splunk`, `Wireshark`, `Suricata`, `Volatility`, `Sysmon`, `YARA`, `CyberChef`.

### 2. Resumen Ejecutivo (Executive Summary)
- Redacción concisa de 2 a 3 párrafos orientada tanto a liderazgo técnico como a directores de seguridad (CISO).
- Responde a: ¿Qué ocurrió? ¿Cuál fue el vector de entrada? ¿Cuál fue el impacto potencial evitado?

### 3. Mapeo Táctico MITRE ATT&CK
Una tabla o desglose explícito con:
| Táctica | ID Técnica | Nombre de Técnica | Observación en el Caso |
| :--- | :--- | :--- | :--- |
| **Initial Access** | `T1566.001` | Spearphishing Attachment | Archivo macro malicioso en correo |
| **Execution** | `T1059.001` | PowerShell | Ejecución ofuscada en segundo plano |
| **Defense Evasion** | `T1027` | Obfuscated Files or Information | Carga útil codificada en Base64 |
| **Command & Control** | `T1071.001` | Web Protocols | Tráfico HTTP saliente hacia C2 |

### 4. Cronología del Incidente (Timeline de Telemetría)
- Registro cronológico con marcas de tiempo precisas (`YYYY-MM-DD HH:MM:SS UTC`).
- Conexión causal de cada evento detectado en los logs.

### 5. Análisis Técnico Detallado (Deep Dive & Evidencias)
- Capturas o fragmentos de logs anonimizados (Sysmon Event ID 1, 3, 7; Windows Security Event ID 4624, 4625).
- Análisis de artefactos en memoria o disco (MFT, Prefetch, Shimcache).
- Bloques de código con sintaxis resaltada y comentarios explicativos.

### 6. Indicadores de Compromiso (IoCs)
Formato estándar listo para ingesta en herramientas SIEM/EDR:
- **Hashes (SHA256 / MD5):** Del malware o scripts analizados.
- **Direcciones IP / Dominios C2:** Con defang de seguridad (ej. `malicious[.]com`, `192[.]168[.]1[.]100`).
- **Claves de Registro / Rutas de Persistencia.**

### 7. Reglas de Detección (Sigma / YARA)
- Proporcionar al menos una regla de detección concreta para prevenir futuras intrusiones similares.

### 8. Remediación & Recomendaciones Defensivas
- Medidas de mitigación inmediatas (aislamiento de host, revocación de credenciales).
- Recomendaciones de endurecimiento (hardening) a medio y largo plazo.

---

## 2. Pautas de Redacción y Tono Profesional
- **Objetivo y Basado en Evidencia:** Evitar conjeturas; cada afirmación debe estar respaldada por un log, artefacto o captura.
- **Lenguaje Claro y Riguroso:** Utilizar terminología estándar de la industria (TTPs, triage, containment, pivot, kill chain).
- **Enfoque Blue Team:** Destacar la capacidad de detección temprana, correlación de eventos y reducción del tiempo medio de respuesta (MTTD / MTTR).
