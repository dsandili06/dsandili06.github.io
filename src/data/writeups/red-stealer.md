Un ejecutable sospechoso, `wextract.exe`, apareció en la PC de un colega del SOC con comunicación C2 detectada. Partiendo solo de su hash y de plataformas de CTI, lo identificamos como Redline Stealer y extrajimos sus IOCs, técnicas MITRE e infraestructura.

## El caso

Se descubrió el ejecutable `wextract.exe` en la PC de un colega del SOC, con comunicación C2 detectada. El objetivo fue analizar el hash en plataformas CTI para extraer IOCs, identificar la infraestructura C2, las técnicas MITRE ATT&CK y los mecanismos de escalación de privilegios.

El laboratorio entrega únicamente el hash del archivo malicioso. A partir de él hicimos los análisis y pruebas en plataformas de CTI (VirusTotal, Hybrid Analisis, Any.Run, etc.).

![Enunciado del laboratorio con el hash del archivo malicioso](https://github.com/user-attachments/assets/f03076b9-f485-46c3-a671-afe6b527f7d0 "Enunciado del laboratorio Red Stealer")

El hash entregado es `248FCC901AFF4E4B4C48C91E4D78A939BF681C9A1BC24ADDC3551B32768F907B`.

- **Plataforma:** CyberDefenders
- **Categoría:** CTI y Malware Analysis
- **Herramientas:** VirusTotal, MalwareBazaar, ThreatFox, ANY.RUN, Whois
- **Tácticas:** Execution | Persistence | Privilege Escalation | Defense Evasion | Discovery | Collection | Impact

## La investigación

### La categoría según Microsoft

**Q1.** Categorizing malware enables a quicker and clearer understanding of its unique behaviors and attack vectors. What category has Microsoft identified for that malware in VirusTotal?

Introdujimos el hash en VirusTotal y buscamos cómo lo categoriza ese motor. Lo clasifica como "Trojan".

![Detecciones de VirusTotal con la categoría asignada por Microsoft](https://github.com/user-attachments/assets/88adefa6-f34b-4cdb-bd4d-469523a42c94 "Categoría Trojan en VirusTotal")

> **Respuesta:** `Trojan`

### El nombre del archivo

**Q2.** Clearly identifying the name of the malware file improves communication among the SOC team. What is the file name associated with this malware?

En la pestaña "Details" bajamos hasta los nombres de archivo vinculados al hash.

![Nombres de archivo asociados al hash en VirusTotal](https://github.com/user-attachments/assets/134de7f4-ae18-4f50-ad89-8b808a0e2296 "Nombres de archivo en la pestaña Details")

> **Respuesta:** `wextract`

### Cuándo se vio por primera vez

**Q3.** Knowing the exact timestamp of when the malware was first observed can help prioritize response actions. Newly detected malware may require urgent containment and eradication compared to older, well-documented threats. What is the UTC timestamp of the malware's first submission to VirusTotal?

En "Details" vemos la fecha en que VirusTotal analizó el archivo por primera vez.

![Fecha de primer envío del archivo a VirusTotal](https://github.com/user-attachments/assets/48799136-931a-4cea-943a-c133c2877e02 "Primer envío a VirusTotal")

> **Respuesta:** `2023-10-06 04:41`

### La técnica de recolección de datos

**Q4.** Understanding the techniques used by malware helps in strategic security planning. What is the MITRE ATT&CK technique ID for the malware's data collection from the system before exfiltration?

En "Behaviour" de VirusTotal, en "Data Collection", corroboramos la TTP del comportamiento principal de recolección de información.

![Sección Data Collection del comportamiento en VirusTotal](https://github.com/user-attachments/assets/b9a04ae2-90cb-42ca-b9e1-a8c677dbb2ef "TTP de recolección de datos")

> **Respuesta:** `T1005`

### Dominios de redes sociales resueltos por DNS

**Q5.** Following execution, which social media-related domain names did the malware resolve via DNS queries?

Siguiendo el comportamiento en VirusTotal, en "Activity Summary" y dentro de "DNS Resolutions" encontramos el dominio "Facebook.com". Es una señal clara de que el malware intenta ofuscar su comportamiento maligno simulando tráfico de red "benigno".

![DNS Resolutions del Activity Summary en VirusTotal](https://github.com/user-attachments/assets/c292cdb6-5f25-4c2a-8650-2f21eb93e889 "Resolución DNS de Facebook.com")

> **Respuesta:** `Facebook.com`

### La regla YARA de Varp0s

**Q6.** YARA rules are designed to identify specific malware patterns and behaviors. Using MalwareBazaar, what's the name of the YARA rule created by "Varp0s" that detects the identified malware?

En MalwareBazaar buscamos con el hash del archivo y fuimos al apartado de YARA. Ahí aparece el nombre de la regla creada por "Varp0s".

![Apartado YARA de MalwareBazaar para el hash analizado](https://github.com/user-attachments/assets/feb052c9-cb5f-4e3e-a2c4-c6bf3359c689 "Regla YARA de Varp0s en MalwareBazaar")

> **Respuesta:** `detect_Redline_Stealer`

### El alias en ThreatFox

**Q7.** Understanding which malware families are targeting the organization helps in strategic security planning for the future and prioritizing resources based on the threat. Can you provide the different malware alias associated with the malicious IP address according to ThreatFox?

El malware con el que tratamos es "Redline". En ThreatFox buscamos por "malware:Redline". Al abrir cualquiera de los resultados vemos que también se llama "RecordStealer".

![Resultados de ThreatFox para malware:Redline con el alias RecordStealer](https://github.com/user-attachments/assets/995a1d9d-0c1e-42a2-bea7-2a6698f5e06d "Alias RecordStealer en ThreatFox")

> **Respuesta:** `RecordStealer`

### La DLL asociada a la escalación de privilegios

**Q8.** By identifying the malware's imported DLLs, we can configure security tools to monitor for the loading or unusual usage of these specific DLLs. Can you provide the DLL utilized by the malware for privilege escalation?

En VirusTotal, en "Details" y luego en "Imports", la primera opción es "ADVAPI32.dll". La información relacionada con esta librería apunta con claridad a escalación de privilegios.

![Imports del malware en VirusTotal con ADVAPI32.dll](https://github.com/user-attachments/assets/fecb3742-2293-4ee2-a797-ee0b12d7bc13 "Imports del binario: ADVAPI32.dll")

> **Respuesta:** `ADVAPI32.dll`

## Reconstrucción del ataque

El análisis siguió este orden:

1. **Verificación del hash.** SHA256: `248FCC901AFF4E4B4C48C91E4D78A939BF681C9A1BC24ADDC3551B32768F907B`. En VirusTotal, 50+ AV hits y primera vista el 2023-10-06. En MalwareBazaar se confirma la familia Redline Stealer. En ANY.RUN, extracción de configuración C2 activa y confirmación de capacidades de stealer.
2. **Análisis dinámico (ANY.RUN).** El proceso principal observado sigue la cadena `VPN.exe.bin` → `.dll` malicioso → actividad de red → exfiltración de datos → auto-eliminación.
3. **Comportamiento específico del stealer.**
   1. `wextract.exe` se ejecuta con PID 2893 (parent: `explorer.exe`).
   2. Se carga `ADVAPI32.dll`: intento de escalación de privilegios.
   3. Resolución DNS de facebook.com (domain fronting).
   4. Beacon C2 hacia `77.91.124.55:19071` (conexión TCP).
   5. Recolección de datos: clipboard y archivos locales (T1005).
   6. Actividad de red: HTTP POST con información del sistema y credenciales.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Privilege Escalation | Exploitation for Privilege Escalation | T1068 | Intento de escalación de privilegios asociado a `ADVAPI32.dll` |
| Command and Control | Application Layer Protocol | T1071.001 | HTTP POST con información del sistema y credenciales |
| Collection | Data from Local System | T1005 | Recolección de clipboard y archivos locales (Behaviour, Data Collection) |
| Defense Evasion | Obfuscated Files or Information | T1027 | Comportamiento de ofuscación observado en el análisis |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| SHA256 | `248FCC901AFF4E4B4C48C91E4D78A939BF681C9A1BC24ADDC3551B32768F907B` | Hash del ejecutable entregado por el laboratorio |
| Archivo | `wextract.exe` | Ejecutable malicioso (PID 2893, parent `explorer.exe`) |
| Archivo | `VPN.exe.bin` | Proceso principal observado en ANY.RUN |
| IP:puerto | `77.91.124.55:19071` | Beacon C2 por TCP |
| Dominio | `Facebook.com` | Resolución DNS tras la ejecución, simulando tráfico benigno |
| Regla YARA | `detect_Redline_Stealer` | Regla de Varp0s en MalwareBazaar |
| Alias | `RecordStealer` | Alias de Redline en ThreatFox |
| DLL | `ADVAPI32.dll` | Librería importada asociada a escalación de privilegios |

## Herramientas

- **VirusTotal:** reputación del hash, comportamiento e imports.
- **MalwareBazaar:** reglas YARA y metadata de la muestra.
- **ANY.RUN:** análisis dinámico y configuración C2.
- **ThreatFox:** relaciones de IOCs y alias del malware.
- **Whois:** geolocalización y titularidad de la IP.

## Lecciones aprendidas

1. **Hunting de T1555.** Monitorear `*.dll` fuera de browsers legítimos.
2. **Patrones de C2.** IPs de China (171.x.x.x) más endpoints PHP son de alta sospecha.
3. **Evasión.** Los timers de auto-eliminación requieren memory forensics inmediata.
