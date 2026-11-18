El SOC de TechNova Systems detecta tráfico de salida sospechoso desde un servidor IIS. Cruzamos el PCAP, el volcado de memoria y el binario recuperado, y reconstruimos la intrusión: un web shell subido por SMB, una reverse shell por el puerto 4443 desde `w3wp.exe` y un AgentTesla empaquetado con UPX.

## El caso

El SOC de TechNova Systems detectó tráfico de salida sospechoso proveniente de un servidor IIS, sugestivo del despliegue de un web shell y de conexiones furtivas hacia un host desconocido.

Nuestro objetivo es reconstruir la intrusión analizando el tráfico PCAP, el dump de memoria y el binario recuperado, para contener la brecha y fortalecer las defensas. El análisis se divide en tres frentes: red, memoria y muestra de malware.

- **Plataforma:** CyberDefenders
- **Categoría:** Network & Memory Forensics
- **Herramientas:** Wireshark, Volatility 3, VirusTotal
- **Tácticas:** Execution, Persistence, Privilege Escalation, Defense Evasion, Discovery, Lateral Movement, Command and Control

## La investigación

### Quién lanzó el reconocimiento

**Q1.** After flooding the IIS host with rapid-fire probes, the attacker reveals their origin. Which IP address generated this reconnaissance traffic?

Para entender la etapa inicial abrimos Wireshark y vamos a Statistics → Conversations → IPv4, donde vemos el volumen de paquetes que la IP del atacante envió al servidor.

Otro método efectivo es el filtro `tcp.flags.syn == 1 && tcp.flags.ack == 0`, que aísla los SYN iniciales del handshake. Así el reconocimiento resulta bastante obvio.

![Conversaciones IPv4 en Wireshark con el volumen de paquetes de la IP del atacante hacia el servidor](https://github.com/user-attachments/assets/adf7b37e-784a-4d90-9431-2ba8ff7f983f "Statistics → Conversations → IPv4")

![Filtro de SYN iniciales en Wireshark que muestra el barrido de reconocimiento](https://github.com/user-attachments/assets/3e57f440-c046-4f4e-b052-5c387afdc7dc "SYN iniciales del escaneo de puertos")

> **Respuesta:** `10.0.2.4`

### Enumeración de servicios

**Q2.** Zeroing in on a single open service to gain a foothold, the attacker carries out targeted enumeration. Which MITRE ATT&CK technique ID covers this activity?

Por la naturaleza del tráfico y el comportamiento del atacante, se trata de una enumeración de puertos y servicios abiertos. En la matriz de MITRE ATT&CK, esta actividad corresponde a Network Service Discovery.

![Tráfico de enumeración de puertos y servicios abiertos observado en Wireshark](https://github.com/user-attachments/assets/10cb7b41-0533-4524-8ff8-bfbdf35da98b "Enumeración de puertos y servicios abiertos")

> **Respuesta:** `T1046`

### Las dos primeras shares que sondea el intruso

**Q3.** While reviewing the SMB traffic, you observe two consecutive Tree Connect requests that expose the first shares the intruder probes on the IIS host. Which two full UNC paths are accessed?

SMB (Server Message Block) es un protocolo cliente-servidor para compartir archivos e impresoras, que los atacantes suelen aprovechar para acceso no autorizado y movimiento lateral.

Aplicamos el filtro `smb || smb2` en Wireshark. El atacante realiza peticiones sobre los recursos "IPC$" y "Documents".

![Filtro smb || smb2 en Wireshark con los Tree Connect hacia IPC$ y Documents](https://github.com/user-attachments/assets/5340fc2b-e50d-44fb-b433-bfcf71332dfa "Tree Connect hacia IPC$ y Documents")

> **Respuesta:** `\\10.0.2.15\Documents, \\10.0.2.15\IPC$`

### El web shell que aterriza por SMB

**Q4.** Inside the share, the attacker plants a web-accessible payload that will grant remote code execution. What is the filename of the malicious file they uploaded, and what byte length is specified in the corresponding SMB2 Write Request?

Seguimos con `smb || smb2` y localizamos una secuencia de Create-Request y Write-Request correspondiente a un archivo llamado `shell.aspx`.

Los archivos `.aspx` son páginas web dinámicas. Si el servidor está mal configurado o desactualizado, permiten a un atacante ejecutar comandos del sistema operativo o abrir reverse shells. En el Write-Request concreto verificamos el tamaño del contenido inyectado.

![Create-Request y Write-Request de SMB2 para shell.aspx con la longitud del contenido escrito](https://github.com/user-attachments/assets/d2e41307-e168-4c31-bc8d-06de1afa79ed "SMB2 Write Request de shell.aspx")

> **Respuesta:** `shell.aspx, 1015024`

### El puerto de la reverse shell

**Q5.** The newly planted shell calls back to the attacker over an uncommon but firewall-friendly port. Which listening port did the attacker use for the reverse shell?

Asumimos que el atacante abrió una reverse shell desde el archivo inyectado y analizamos Statistics → Conversations → TCP, ordenando por cantidad de paquetes.

Los puertos principales son el 445 (SMB estándar) y el 4443. Como el primero es el estándar, concluimos que el 4443 es el listener del atacante.

![Conversaciones TCP ordenadas por paquetes, con los puertos 445 y 4443](https://github.com/user-attachments/assets/b0514156-c66c-4592-90e2-8e2c6376e676 "Statistics → Conversations → TCP")

> **Respuesta:** `4443`

### La dirección base del kernel

**Q6.** Your memory snapshot captures the system’s kernel in situ, providing vital context for the breach. What is the kernel base address in the dump?

Pasamos al volcado de memoria. Ejecutamos el plugin de información del sistema para obtener detalles del entorno, incluida la versión de Windows y el kernel:

```bash
vol -f memory.dmp windows.info
```

El output entrega los detalles del sistema operativo y la dirección base del kernel.

![Salida de windows.info de Volatility 3 con la dirección base del kernel](https://github.com/user-attachments/assets/237520df-9071-48e7-8f6d-709216ba2bd9 "windows.info: Kernel Base")

> **Respuesta:** `0xf80079213000`

### Un servicio de confianza lanza un ejecutable extraño

**Q7.** A trusted service launches an unfamiliar executable residing outside the usual IIS stack, signalling a persistence implant. What is the final full on-disk path of that executable, and which MITRE ATT&CK persistence technique ID corresponds to this behaviour?

Lanzamos el plugin de jerarquía de procesos:

```bash
vol -f memory.dmp windows.pstree
```

El proceso padre `w3wp.exe`, encargado de IIS, ejecuta un archivo fuera de lo habitual en la ruta de inicio automático (Startup).

![Salida de windows.pstree con w3wp.exe ejecutando un archivo desde la carpeta Startup](https://github.com/user-attachments/assets/5fd43e23-96dc-4103-bd4a-74e091378e65 "windows.pstree: w3wp.exe y el ejecutable en Startup")

Correlacionamos esa ruta con la matriz de MITRE ATT&CK bajo la táctica Persistence e identificamos la técnica utilizada.

![Matriz de MITRE ATT&CK con la técnica de persistencia por autoarranque](https://github.com/user-attachments/assets/d92beb41-8514-4ed3-bc7d-3b41edee818a "MITRE ATT&CK: técnica de persistencia")

> **Respuesta:** `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\updatenow.exe, T1547`

### El proceso que lleva el tráfico de la shell

**Q8.** The reverse shell’s outbound traffic is handled by a built-in Windows process that also spawns the implanted executable. What is the name of this process, and what PID does it run under?

Usamos el plugin de conexiones activas:

```bash
vol -f memory.dmp windows.netscan
```

Identificamos la conexión del proceso legítimo `w3wp.exe` hacia la IP del atacante (`10.0.2.4`) por el puerto 4443, el listener que ya habíamos identificado. El output entrega directamente el PID del proceso responsable.

![Salida de windows.netscan con la conexión de w3wp.exe hacia 10.0.2.4 por el puerto 4443](https://github.com/user-attachments/assets/671ec9c4-3ec5-469f-b1db-d8f4d981c766 "windows.netscan: conexión de w3wp.exe")

> **Respuesta:** `w3wp.exe, 4332`

### El packer que oculta el binario

**Q9.** Static inspection reveals the binary has been packed to hinder analysis. Which packer was used to obfuscate it?

Pasamos a la muestra de malware. Calculamos el hash MD5 del archivo (`D797600296DDBED4497725579D814B7E`) y lo consultamos en VirusTotal.

Los packers envuelven el código original en una estructura que incluye un lanzador y el payload cifrado. El reporte confirma el packer utilizado.

![Detalles del binario en VirusTotal con el packer identificado](https://github.com/user-attachments/assets/00a1dee9-6e80-471c-af96-199cb6841270 "VirusTotal: packer del binario")

> **Respuesta:** `UPX`

### El dominio de comando y control

**Q10.** Threat-intel analysis shows the malware beaconing to its command-and-control host. Which fully qualified domain name (FQDN) does it contact?

En VirusTotal vamos a la pestaña Relations para ver los dominios contactados por el archivo malicioso. Ahí identificamos el FQDN con el que se comunica.

![Pestaña Relations de VirusTotal con el dominio contactado por la muestra](https://github.com/user-attachments/assets/bf799409-6343-42ba-aac7-d1ead5975b0d "VirusTotal Relations: dominio contactado")

> **Respuesta:** `cp8nl.hyperhost.ua`

### La familia del malware

**Q11.** Open-source intel associates that hash with a well-known commodity RAT. To which malware family does the sample belong?

Revisamos las family labels en la página principal del análisis de VirusTotal para el hash indicado y obtenemos la familia de la muestra.

![Family labels de VirusTotal para el hash de la muestra](https://github.com/user-attachments/assets/94416327-8b4e-4192-a412-1b74799bf8ec "VirusTotal: family labels")

> **Respuesta:** `AgentTesla`

## Reconstrucción del ataque

1. **Reconocimiento.** Desde `10.0.2.4` llega una avalancha de SYN contra el host IIS, un escaneo de puertos (Network Service Discovery, `T1046`).
2. **Acceso a shares.** El atacante abre Tree Connects SMB sobre `\\10.0.2.15\IPC$` y `\\10.0.2.15\Documents`.
3. **Web shell.** Mediante Create-Request y Write-Request de SMB2 sube `shell.aspx`.
4. **Reverse shell.** El shell conecta de vuelta por el puerto TCP `4443`. En memoria, `w3wp.exe` (PID `4332`) mantiene la conexión hacia `10.0.2.4`.
5. **Persistencia.** `w3wp.exe` lanza `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\updatenow.exe`, un autoarranque (`T1547`).
6. **Malware.** El binario está empaquetado con UPX, hace beaconing a `cp8nl.hyperhost.ua` y pertenece a la familia AgentTesla.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Discovery | Network Service Discovery | T1046 | Escaneo de puertos del atacante contra host IIS |
| Execution | Server Software Component: Web Shell | T1505.003 | Upload y ejecución de `shell.aspx` |
| Command and Control | Application Layer Protocol | T1071.001 | Reverse shell sobre puerto TCP 4443 |
| Persistence | Boot or Logon Autostart Execution | T1547.001 | Inyección de `updatenow.exe` en la carpeta Startup |
| Defense Evasion | Software Packing | T1027.002 | Uso de UPX para ofuscar el ejecutable |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| IP | `10.0.2.4` | Origen del reconocimiento y listener de la reverse shell |
| IP | `10.0.2.15` | Servidor IIS con las shares `Documents` e `IPC$` |
| Puerto | `4443` | Puerto de la reverse shell |
| Archivo | `shell.aspx` | Web shell subido por SMB2 (Write Request de 1015024 bytes) |
| Ruta | `C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup\updatenow.exe` | Ejecutable de persistencia lanzado por `w3wp.exe` |
| Hash MD5 | `D797600296DDBED4497725579D814B7E` | Binario empaquetado con UPX (AgentTesla) |
| Dominio | `cp8nl.hyperhost.ua` | FQDN de C2 contactado por la muestra |
| Proceso | `w3wp.exe` (PID 4332) | Proceso de IIS que maneja el tráfico de la reverse shell |

## Herramientas

- **Wireshark:** Statistics, filtrado SMB/TCP y TCP Streams.
- **Volatility 3:** plugins `windows.info`, `windows.pstree` y `windows.netscan`.
- **VirusTotal:** inspección de hash, identificación del packer, dominios contactados y atribución de familia.

## Lecciones aprendidas

1. **Análisis de SMB2.** Identificar `Create-Request` y `Write-Request` es vital para detectar el momento preciso de la inyección de web shells.
2. **Volatilidad y procesos legítimos.** Abusar de `w3wp.exe`, un proceso legítimo de IIS, para manejar tráfico C2 es una técnica de evasión muy efectiva. Exige analizar con detalle las conexiones mediante `netscan`.
3. **Análisis estático.** Identificar packers como UPX es el primer paso crítico en el análisis de malware. Sin desempacar, el análisis estático queda severamente limitado.
