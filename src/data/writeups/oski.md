Un contador recibe un email "Urgent New Order" con un PPT adjunto y el SIEM alerta de una descarga maliciosa. A partir de un solo hash identificamos un stealer tipo Oski que roba credenciales de navegadores, las exfiltra por HTTP POST a su C2 y se autoelimina cinco segundos después.

## El caso

Un contador recibió un email "Urgent New Order" con un adjunto PPT que contenía información falsa de un pedido. El SIEM alertó sobre la descarga de un archivo malicioso vinculado al PPT.

Nuestro objetivo es analizar el comportamiento del malware, identificar IOCs y mapear las TTPs en MITRE ATT&CK. El laboratorio entrega únicamente un hash del archivo malicioso, con el que hacemos los análisis y pruebas en plataformas de CTI: VirusTotal, Hybrid Analysis y Any.Run, entre otras.

![Enunciado del laboratorio Oski con el hash MD5 del archivo malicioso](https://github.com/user-attachments/assets/2e17c72f-f86e-4707-87d1-cecd6f113413 "Hash MD5 entregado por el laboratorio")

El hash MD5 de partida es `12c1842c3ccafe7408c23ebf292ee3d9`.

- **Plataforma:** CyberDefenders
- **Categoría:** CTI & Malware Analysis (Threat Intel)
- **Herramientas:** VirusTotal, Any.Run, Hybrid Analysis, CyberChef, MITRE ATT&CK Navigator

## La investigación

### Cuándo se creó la muestra

**Q1.** Determining the creation time of the malware can provide insights into its origin. What was the time of malware creation?

En VirusTotal, tras introducir el hash, vamos al apartado Details y, en History, encontramos la fecha de creación.

![Sección History de VirusTotal con la fecha de creación de la muestra](https://github.com/user-attachments/assets/0072dd05-08a7-4cbf-ad8a-6ff5af4637bf "VirusTotal Details: History con la fecha de creación")

> **Respuesta:** `2022-09-28 17:40 UTC`

### El servidor de comando y control

**Q2.** Identifying the command and control (C2) server that the malware communicates with can help trace back to the attacker. Which C2 server does the malware in the PPT file communicate with?

En VirusTotal, la pestaña Relations muestra un C2 vinculado a la muestra. También lo vemos en el reporte de Any.Run, en Malware Configuration, donde aparece el C2 correspondiente.

![Pestaña Relations de VirusTotal con el servidor C2 vinculado a la muestra](https://github.com/user-attachments/assets/d10675a0-6ea6-4d7a-bfbf-4772e96061f3 "VirusTotal Relations: servidor C2")

> **Respuesta:** `http://171.22.28.221/5c06c05b7b34e8e6.php`

### La primera librería que pide el malware

**Q3.** Identifying the initial actions of the malware post-infection can provide insights into its primary objectives. What is the first library that the malware requests post-infection?

En la sección Behaviour de VirusTotal vemos la primera librería que solicita.

![Sección Behaviour de VirusTotal con la primera librería solicitada por el malware](https://github.com/user-attachments/assets/eee18e24-e49c-417e-9597-327a61aef554 "VirusTotal Behaviour: primera librería solicitada")

> **Respuesta:** `sqlite3.dll`

### La clave RC4 en la configuración del malware

**Q4.** By examining the provided Any.run report, what RC4 key is used by the malware to decrypt its base64-encoded string?

En la sección Malware Configuration del reporte de Any.Run encontramos tanto el C2 como una clave RC4 que sirve para decodificar el contenido en base64.

![Malware Configuration de Any.Run con el servidor C2 y la clave RC4](https://github.com/user-attachments/assets/65378f20-2880-46b6-afe5-dced8c931ae0 "Any.Run Malware Configuration: C2 y clave RC4")

> **Respuesta:** `5329514621441247975720749009`

### La técnica con la que roba contraseñas

**Q5.** By examining the MITRE ATT&CK techniques displayed in the Any.run sandbox report, identify the main MITRE technique (not sub-techniques) the malware uses to steal the user’s password.

Any.Run mapea las TTPs de MITRE ATT&CK. En la parte de robo de credenciales aparecen dos candidatos:

1. T1552 `Unsecured Credentials`
2. T1555 `Credentials from Password Stores`

Podemos probar ambas opciones, o ir a uno de los POST Requests del malware. Ya vimos que el malware codifica en Base64, así que copiamos el POST Request y lo llevamos a CyberChef. Al decodificar el Base64 vemos el envío de los artefactos, lo que indica una técnica de "Credentials from Password Stores".

![Mapeo de TTPs de MITRE ATT&CK en Any.Run con las técnicas de robo de credenciales](https://github.com/user-attachments/assets/f5f4a410-97b3-413e-addc-96c3f6827b78 "Any.Run: TTPs de robo de credenciales")

![Contenido del POST Request decodificado en Base64 con CyberChef mostrando los artefactos enviados](https://github.com/user-attachments/assets/c5d98813-68b2-4317-b313-9092c7183025 "CyberChef: POST Request decodificado")

> **Respuesta:** `T1555`

### Limpieza de DLLs en ProgramData

**Q6.** By examining the child processes displayed in the Any.run sandbox report, which directory does the malware target for the deletion of all DLL files?

El malware crea un proceso `cmd.exe` con varios parámetros. Espera 5 segundos antes de eliminarse a sí mismo y también elimina todo el contenido de la carpeta `C:\ProgramData` apuntando a las librerías `*.dll`.

![Proceso hijo cmd.exe en Any.Run con los parámetros de espera y borrado de DLLs](https://github.com/user-attachments/assets/7b8547fe-ee31-4a8b-8ddb-bbcb1979f930 "Any.Run: cmd.exe borra las DLLs de ProgramData")

> **Respuesta:** `C:\ProgramData`

### Cinco segundos hasta la autoeliminación

**Q7.** Understanding the malware's behavior post-data exfiltration can give insights into its evasion techniques. By analyzing the child processes, after successfully exfiltrating the user's data, how many seconds does it take for the malware to self-delete?

Con la observación del apartado anterior, el tiempo que tarda el malware en autoeliminarse tras exfiltrar los datos del usuario es de 5 segundos.

> **Respuesta:** `5 segundos`

## Reconstrucción del ataque

Verificación inicial del hash: SHA256 `a040a0af8697e30506218103074c7d6ea77a84ba3ac1ee5efae20f15530a19bb`. En VirusTotal, la muestra acumula más de 60 detecciones (Google Chrome Helper, etc.). ANY.RUN ofrece un reporte interactivo, y Hybrid Analysis confirma capacidades de stealer.

La cadena observada en el sandbox de ANY.RUN es: `VPN.exe.bin` → `.dll` malicioso → actividad de red → exfiltración de datos → autoeliminación.

Los pasos específicos del stealer son:

1. Enumera perfiles de navegadores (Chrome/Edge).
2. Extrae credenciales mediante `sqlite3.dll` desde Chrome Login Data.
3. Empaqueta datos del sistema (hostname, user, IP).
4. Codifica el payload en base64 y lo envía por HTTP POST al C2.
5. Recibe un comando de "éxito" e inicia la limpieza.
6. Borra las DLLs en `C:\ProgramData` y se autoelimina.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Credential Access | Keychain (Chrome/Edge passwords) | T1555.001 | Credenciales de navegadores; la técnica principal confirmada en la pregunta fue `T1555` |
| Credential Access | Unsecured Credentials (candidata descartada) | T1552 | Opción alternativa mostrada por Any.Run |
| Credential Access | Credentials from Password Stores | T1555 | El POST Request decodificado envía los artefactos de credenciales |
| Command and Control | Web Protocols (HTTP C2) | T1071.001 | Comunicación HTTP con el C2 |
| Collection | Archive via Utility (DLL cleanup) | T1560.001 | Según el resumen del laboratorio |
| Defense Evasion | Service Stop (evasion) | T1489 | Según el resumen del laboratorio |
| Defense Evasion | File Deletion (self-delete) | T1070.004 | Autoeliminación 5 segundos después de exfiltrar |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| Hash MD5 | `12c1842c3ccafe7408c23ebf292ee3d9` | Hash entregado por el laboratorio |
| Hash SHA256 | `a040a0af8697e30506218103074c7d6ea77a84ba3ac1ee5efae20f15530a19bb` | Verificación inicial de hash |
| URL | `http://171.22.28.221/5c06c05b7b34e8e6.php` | Servidor C2 |
| IP | `171.22.28.221` | Host del C2 |
| Clave RC4 | `5329514621441247975720749009` | Clave para decodificar el base64 |
| Librería | `sqlite3.dll` | Primera librería solicitada tras la infección |
| Ruta | `C:\ProgramData` | Directorio donde se eliminan los `*.dll` |
| Archivo | `VPN.exe.bin` | Proceso principal observado en ANY.RUN |

## Herramientas

- **ANY.RUN:** sandbox principal; Malware Configuration, procesos hijos y mapeo de TTPs.
- **VirusTotal:** reputación del hash, History, Relations y Behaviour.
- **Hybrid Analysis:** confirmación del comportamiento de stealer.
- **CyberChef:** decodificación del POST Request (Base64 y RC4).
- **MITRE ATT&CK Navigator:** mapeo de técnicas.

## Lecciones aprendidas

1. **Hunting de T1555.** Monitorear archivos `*.dll` fuera de los navegadores legítimos.
2. **Patrones de C2.** IPs de China (171.x.x.x) más endpoints PHP son un patrón de alta sospecha.
3. **Evasión.** Los temporizadores de autoeliminación exigen forense de memoria inmediata.
