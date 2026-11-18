Una multinacional que depende de 3CX detectó alertas de antivirus esporádicas tras una actualización, degradación de rendimiento y tráfico anómalo hacia servidores desconocidos. Con el instalador MSI sospechoso y solo inteligencia de amenazas, confirmamos un ataque de supply chain con DLLs troyanizadas, atribuido a Lazarus.

## El caso

Una multinacional que usa 3CX para sus comunicaciones notó alertas esporádicas de antivirus después de actualizar, caída de rendimiento y tráfico de red hacia servidores desconocidos. El objetivo fue examinar el posible ataque de supply chain sobre 3CX, identificar al threat actor responsable y evaluar el alcance del incidente.

El laboratorio entrega un archivo, `3CXDesktopApp-18.12.416.msi`, sobre el que se apoya toda la investigación.

![Archivo MSI de 3CX entregado por el laboratorio](https://github.com/user-attachments/assets/45119053-ca12-4ab6-8676-b5e68ab91bb3 "El instalador 3CXDesktopApp-18.12.416.msi")

También incluye material de contexto sobre cómo ocurren estas infecciones a nivel corporativo cuando se compromete la supply chain.

![Esquema del funcionamiento de un ataque de supply chain](https://github.com/user-attachments/assets/9ed91e04-67be-4acf-bda8-bcd0427ed982 "Cómo se produce un ataque de supply chain")

3CX es un sistema telefónico empresarial basado en software (IP PBX) de estándares abiertos. Ofrece una plataforma de comunicaciones unificadas con llamadas de voz, videollamadas, chat en vivo y videoconferencias a través de Internet. Al ser un componente crítico de las operaciones, su compromiso a nivel de supply chain es un vector de altísimo impacto.

- **Plataforma:** CyberDefenders
- **Categoría:** Threat Intel
- **Herramientas:** VirusTotal
- **Tácticas:** Persistence | Privilege Escalation | Defense Evasion | Discovery

## La investigación

### Cuántas versiones están comprometidas

**Q1.** Understanding the scope of the attack and identifying which versions exhibit malicious behavior is crucial for making informed decisions if these compromised versions are present in the organization. How many versions of 3CX running on Windows have been flagged as malware?

Ya conocemos el tipo de organización y el sistema, así que activamos la inteligencia de amenazas y buscamos en foros de seguridad y reportes las vulnerabilidades asociadas a las versiones presentes. Las versiones afectadas son 18.12.407 y 18.12.416, ambas con comportamiento malicioso documentado.

![Reporte con las versiones de 3CX marcadas como maliciosas](https://github.com/user-attachments/assets/b19c209b-02b7-4236-b6c8-18ba8794615a "Versiones 18.12.407 y 18.12.416 de 3CX")

> **Respuesta:** `2`

### La edad del instalador malicioso

**Q2.** Determining the age of the malware can help assess the extent of the compromise and track the evolution of malware families and variants. What's the UTC creation time of the .msi malware?

Para alimentar los motores de threat intel, extrajimos el SHA256 del archivo con PowerShell:

```powershell
Get-FileHash (Path al archivo) -Algorithm SHA256
```

El hash obtenido es `59E1EDF4D82FAE4978E97512B0331B7EB21DD4B838B850BA46794D9C7A2C0983`. Lo cargamos en VirusTotal y, en **Details → History**, vimos el Creation Time del archivo.

![Historial del archivo en VirusTotal con la hora de creación](https://github.com/user-attachments/assets/8c891f15-c939-4aec-83a8-f691e3571368 "Creation Time del MSI en VirusTotal")

> **Respuesta:** `2023-03-13 06:33`

### Las DLLs que deja caer el instalador

**Q3.** Executable files (.exe) are frequently used as primary or secondary malware payloads, while dynamic link libraries (.dll) often load malicious code or enhance malware functionality. Analyzing files deposited by the Microsoft Software Installer (.msi) is crucial for identifying malicious files and investigating their full potential. Which malicious DLLs were dropped by the .msi file?

En VirusTotal comprobamos que el MSI malicioso deposita varios archivos al ejecutarse. En **Dropped Files** identificamos dos DLLs como payloads principales, porque tienen el mayor porcentaje de detección entre los motores antivirus. Al revisar las categorías de detección de ambas, confirmamos que son los payloads principales inyectados por el instalador.

![Dropped Files del MSI en VirusTotal con las DLLs más detectadas](https://github.com/user-attachments/assets/0c72cdb2-7ea4-42a9-bccb-53b51cae5d87 "Archivos depositados por el MSI")

> **Respuesta:** `ffmpeg.dll, d3dcompiler_47.dll`

### Cómo se carga la DLL maliciosa

**Q4.** Recognizing the persistence techniques used in this incident is essential for current mitigation strategies and future defense improvements. What is the MITRE Technique ID employed by the .msi files to load the malicious DLL?

Seguimos con threat intelligence y buscamos un mapeo de TTPs MITRE ATT&CK del ataque. Encontramos un reporte completo con el MITRE TID Mapping del incidente. Confirma que la técnica es DLL Side-Loading: un ejecutable legítimo se manipula para cargar una DLL maliciosa en su lugar.

![Mapeo MITRE TID del incidente con la técnica de DLL Side-Loading](https://github.com/user-attachments/assets/1d64fd7f-f3c9-4fd5-b785-de14dc28e264 "MITRE TID Mapping del incidente")

> **Respuesta:** `T1574`

### La categoría de las dos DLLs

**Q5.** Recognizing the malware type (threat category) is essential to your investigation, as it can offer valuable insight into the possible malicious actions you'll be examining. What is the threat category of the two malicious DLLs?

Los reportes individuales de las dos DLLs en VirusTotal las categorizan de forma consistente como Trojan.

![Reporte de VirusTotal de la primera DLL con categoría Trojan](https://github.com/user-attachments/assets/02af2b87-c276-44d4-98b4-0d019492a7ae "Categoría Trojan de la primera DLL")

![Reporte de VirusTotal de la segunda DLL con categoría Trojan](https://github.com/user-attachments/assets/60ac348a-2088-4390-bc62-7e3ef0fa39fc "Categoría Trojan de la segunda DLL")

> **Respuesta:** `Trojan`

### Evasión de entornos virtualizados

**Q6.** As a threat intelligence analyst conducting dynamic analysis, it's vital to understand how malware can evade detection in virtualized environments or analysis systems. This knowledge will help you effectively mitigate or address these evasive tactics. What is the MITRE ID for the virtualization/sandbox evasion techniques used by the two malicious DLLs?

Retomamos el reporte de MITRE TID Mapping de la cuarta pregunta y fuimos a la sección sobre evasión de entornos virtualizados y de análisis. Ahí está la TID de Virtualization/Sandbox Evasion.

![Sección de evasión de virtualización y sandbox en el reporte MITRE](https://github.com/user-attachments/assets/3cee1ea6-7a4b-47a6-918f-c0b4c5b79b30 "TID de Virtualization/Sandbox Evasion")

> **Respuesta:** `T1497`

### El hipervisor que el malware evita

**Q7.** When conducting malware analysis and reverse engineering, understanding anti-analysis techniques is vital to avoid wasting time. Which hypervisor is targeted by the anti-analysis techniques in the ffmpeg.dll file?

En VirusTotal, en **Behavior** del análisis de `ffmpeg.dll`, vemos las capabilities detalladas de la DLL maliciosa. Ahí aparece con claridad el hipervisor objetivo de las técnicas anti-análisis.

![Capabilities de ffmpeg.dll en la sección Behavior de VirusTotal](https://github.com/user-attachments/assets/54e6eb7b-cf5a-4773-aed2-2f1c50068e23 "Capabilities anti-análisis de ffmpeg.dll")

> **Respuesta:** `VMware`

### El cifrado del payload

**Q8.** Identifying the cryptographic method used in malware is crucial for understanding the techniques employed to bypass defense mechanisms and execute its functions fully. What encryption algorithm is used by the ffmpeg.dll file?

En la sección **Cryptography** del comportamiento de `ffmpeg.dll` vemos que el malware usa RC4 para encriptar el payload malicioso. Eso dificulta el análisis estático y evade firmas basadas en strings en texto plano.

![Sección Cryptography del análisis de comportamiento de ffmpeg.dll](https://github.com/user-attachments/assets/ba800fb9-c19b-4fbe-a9e5-ede42f08ced7 "Uso de RC4 en ffmpeg.dll")

> **Respuesta:** `RC4`

### Atribución al grupo responsable

**Q9.** As an analyst, you've recognized some TTPs involved in the incident, but identifying the APT group responsible will help you search for their usual TTPs and uncover other potential malicious activities. Which group is responsible for this attack?

Para la atribución consultamos el artículo de Qualys referenciado en los reportes del incidente, y también la sección **Community** de VirusTotal sobre los archivos maliciosos. Ambas fuentes atribuyen el ataque al grupo APT Lazarus, actor de amenazas patrocinado por el Estado norcoreano, con historial documentado de ataques de supply chain de alto perfil.

![Sección Community de VirusTotal con la atribución a Lazarus](https://github.com/user-attachments/assets/13339241-d0ee-4517-9b52-0c0d5483b2f4 "Atribución del ataque a Lazarus")

> **Respuesta:** `Lazarus`

## Reconstrucción del ataque

1. **Alcance.** Las versiones comprometidas son 18.12.407 y 18.12.416. El SHA256 del MSI es `59E1EDF4D82FAE4978E97512B0331B7EB21DD4B838B850BA46794D9C7A2C0983`. Se trata de un ataque de supply chain sobre el instalador oficial de 3CX.
2. **Artefactos maliciosos.** El instalador `3CXDesktopApp.msi` tiene fecha de creación 2023-03-13 06:33. Deposita dos DLLs: `ffmpeg.dll` (Trojan, cifrado RC4, detección de VMware) y `d3dcompiler_47.dll` (Trojan, payload de DLL Side-Loading).
3. **Comportamiento y evasión.** Un ejecutable legítimo de 3CX carga las DLLs maliciosas mediante DLL Side-Loading (T1574). Las comprobaciones anti-VM apuntan a VMware (T1497). El payload se ofusca con RC4.
4. **Atribución.** El grupo responsable es Lazarus, según VirusTotal y el reporte de Qualys.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Initial Access | Supply Chain Compromise | T1195.002 | Compromiso del instalador oficial de 3CX |
| Persistence | Hijack Execution Flow: DLL Side-Loading | T1574.002 | `ffmpeg.dll` y `d3dcompiler_47.dll` cargadas por ejecutable legítimo |
| Defense Evasion | Virtualization/Sandbox Evasion | T1497 | Anti-análisis targeting VMware en `ffmpeg.dll` |
| Defense Evasion | Obfuscated Files or Information | T1027 | Payload encriptado con RC4 |
| Discovery | Software Discovery | T1518 | Fingerprinting del entorno de ejecución previo a payload |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| SHA256 | `59E1EDF4D82FAE4978E97512B0331B7EB21DD4B838B850BA46794D9C7A2C0983` | Instalador MSI de 3CX |
| Archivo | `3CXDesktopApp-18.12.416.msi` | Instalador entregado por el laboratorio |
| Archivo | `ffmpeg.dll` | DLL maliciosa depositada por el MSI (Trojan, RC4, VMware) |
| Archivo | `d3dcompiler_47.dll` | DLL maliciosa depositada por el MSI (Trojan) |
| Versión | 18.12.407 y 18.12.416 | Versiones de 3CX con comportamiento malicioso |

## Herramientas

- **VirusTotal:** análisis de hash, dropped files, behavior y community.
- **Qualys Threat Report:** MITRE TID Mapping y atribución al grupo APT.

## Lecciones aprendidas

1. **Supply chain.** Validar la integridad de los instaladores legítimos con verificación de hash antes de cualquier despliegue organizacional.
2. **Valor de la atribución.** Identificar al grupo responsable (Lazarus) permite anticipar TTPs adicionales y buscar de forma proactiva IOCs relacionados en la red.
