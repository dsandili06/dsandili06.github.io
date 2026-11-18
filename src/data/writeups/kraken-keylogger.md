Un empleado recibe "ayuda" de un tercero para cumplir un plazo y termina siendo extorsionado por 160 USD. Analizamos su endpoint y reconstruimos la cadena completa: Telegram Web, un ZIP con un LNK malicioso, persistencia a través de Greenshot y exfiltración de unos 2.8 GB por AnyDesk.

## El caso

Un empleado de una gran compañía recibe ayuda de un tercero para completar una tarea con deadline de dos días. Al día siguiente, el tercero le avisa de que terminó el trabajo y le manda un archivo de prueba, pero de inmediato le exige 160 USD para entregar el resultado final. El comportamiento extorsivo activa la intervención del equipo de DFIR.

Nuestro objetivo es analizar el endpoint del empleado para identificar el canal de comunicación con el atacante, el vector de infección, los mecanismos de persistencia y el canal de exfiltración de datos.

- **Plataforma:** CyberDefenders
- **Categoría:** Endpoint Forensics
- **Herramientas:** DB Browser for SQLite, LECmd, Timeline Explorer, SRUM tools
- **Tácticas:** Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Command and Control, Exfiltration

## La investigación

### El canal de contacto: notificaciones de Windows

**Q1.** What is the the web messaging app the employee used to talk to the attacker?

Nos apoyamos en el comportamiento de las notificaciones de Windows y navegamos a `C:\Users\OMEN\AppData\Local\Microsoft\Windows\Notifications\` para localizar el archivo `wpndatabase.db`.

Es una base de datos SQLite donde Windows guarda las notificaciones toast y push generadas por el sistema y por aplicaciones de terceros. Esto incluye las aplicaciones web que corren en el navegador y piden permiso para enviar notificaciones de escritorio. Forensemente es clave: puede revelar qué aplicaciones y sitios estaban activos durante el incidente, aunque no haya clientes nativos instalados.

Exportamos `wpndatabase.db` y lo abrimos con DB Browser for SQLite. En la tabla `Notification` encontramos un registro cuyo payload referencia explícitamente `web.telegram.org`. El empleado usaba Telegram Web como cliente de mensajería en el navegador.

![Tabla Notification de wpndatabase.db en DB Browser for SQLite con un registro de web.telegram.org](https://github.com/user-attachments/assets/b86b6d76-9ce8-4ba3-b624-e6c09a599aca "Notificación asociada a web.telegram.org")

> **Respuesta:** `Telegram`

### La contraseña del ZIP

**Q2.** What is the password for the protected ZIP file sent by the attacker to the employee?

Seguimos con `wpndatabase.db` y miramos el campo payload del registro de `web.telegram.org`. Las notificaciones toast se almacenan internamente como XML, con el remitente y el texto completo del mensaje que originó la notificación.

Al expandir el payload encontramos el mensaje del atacante, que indica el nombre del archivo y la contraseña del ZIP:

```text
our project templet test.zip, pass:@1122d
```

El ZIP protegido enviado por el atacante usa la contraseña `@1122d`.

![Payload de la notificación con el mensaje del atacante que incluye el nombre del ZIP y su contraseña](https://github.com/user-attachments/assets/374460b3-cc00-4370-92b8-f57314f73f7f "Mensaje del atacante con la contraseña del ZIP")

> **Respuesta:** `@1122d`

### El LNK que descarga la segunda etapa

**Q3.** What domain did the attacker use to download the second stage of the malware?

Dividimos el análisis en dos fases: parsing del `.lnk` y análisis de comportamiento en filescan.io.

En la primera fase exportamos `templet.lnk` de la imagen forense y lo procesamos con LECmd:

```bash
LECmd.exe -f "templet.lnk"
```

LECmd expone todos los campos estructurales del archivo: target path, timestamps, volume serial number y, lo más relevante aquí, Command Line Arguments. Confirmamos que el archivo no apuntaba a ningún documento legítimo, sino a powershell.exe con un argumento ofuscado. Fue una red flag inmediata: este `.lnk` era el vector de ejecución inicial del atacante.

![Salida de LECmd sobre templet.lnk con powershell.exe y un argumento ofuscado](https://github.com/user-attachments/assets/d90bd828-61c8-496a-898b-51b3258a38ca "LECmd: argumentos del LNK hacia PowerShell")

En la segunda fase subimos `templet.lnk` a filescan.io, que emula la ejecución y extrae automáticamente IOCs (URLs, dominios, DNS, etc.). En la sección Network Behavior / Domains vemos que el LNK descarga un HTA de segunda etapa desde:

`https://masherofmasters.cyou/shins/se1.hta`

`se1.hta` es un HTML Application descargado y ejecutado por `mshta.exe`, un binario legítimo de Windows muy abusado en ataques Living off the Land (LotL) para evadir controles de seguridad basados en reputación de procesos.

![Sección Network Behavior de filescan.io con el dominio de descarga de se1.hta](https://github.com/user-attachments/assets/58432dd5-3392-4c56-86c2-a0f29f878073 "filescan.io: dominio de la segunda etapa")

> **Respuesta:** `masherofmasters.cyou`

### Greenshot como mecanismo de persistencia

**Q4.** What is the name of the command that the attacker injected using one of the installed LOLAPPS on the machine to achieve persistence?

Para el comando inyectado con una de las LOLAPPs instaladas seguimos tres pasos: identificar la LOLAPP, confirmarla en el proyecto LOLAPPS y analizar su configuración.

Las LOLAPPs (Living off the Land Applications) son aplicaciones legítimas de usuario, no binarios del sistema, cuya funcionalidad puede abusarse para ejecución o persistencia sin instalar malware adicional. El proyecto `lolapps-project.github.io` las cataloga de forma análoga a LOLBAS, que cubre los binarios de Windows.

Revisamos las aplicaciones instaladas con Autopsy, en Data Artifacts → Installed Programs, e identificamos Greenshot 1.2.10.6. El catálogo de LOLAPPs confirma que Greenshot está documentada como vector de persistencia mediante su External Command Plugin.

Después navegamos a `C:\Users\OMEN\AppData\Roaming\Greenshot\Greenshot.ini`. El contenido relevante es:

```ini
[ExternalCommand]
Commands=MS Paint,jlhgfjhdfIghjhuhuh

Commandline.MS Paint=C:\Windows\System32\mspaint.exe
Commandline.jlhgfjhdfIghjhuhuh=C:\Windows\system32\cmd.exe

Argument.MS Paint={0}
Argument.jlhgfjhdfIghjhuhuh=C:\Users\OMEN\AppData\Local\Temp\templet.lnk
```

El comando `MS Paint` es un señuelo legítimo. El comando `jlhgfjhdfIghjhuhuh` ejecuta `cmd.exe` apuntando a `templet.lnk` y relanza toda la cadena maliciosa cada vez que el usuario toma una captura de pantalla.

![Contenido de Greenshot.ini con la sección ExternalCommand y el comando malicioso](https://github.com/user-attachments/assets/2626371b-fffe-46c0-a29c-a2b65c9d08fc "Greenshot.ini: sección ExternalCommand")

![Evidencia complementaria de la configuración de Greenshot con el comando que apunta a templet.lnk](https://github.com/user-attachments/assets/87c6afc5-03a3-4a5f-afb4-cb9c7f1be313 "Comando malicioso en la configuración de Greenshot")

> **Respuesta:** `jlhgfjhdfIghjhuhuh`

### La ruta del archivo persistente

**Q5.** What is the complete path of the malicious file that the attacker used to achieve persistence?

En la misma sección `[ExternalCommand]` de `Greenshot.ini` vemos el parámetro que define el argumento del comando malicioso:

```ini
Argument.jlhgfjhdfIghjhuhuh=C:\Users\OMEN\AppData\Local\Temp\templet.lnk
```

Esto nos da la ruta completa del archivo que mantiene la persistencia. El atacante eligió `%LocalAppData%\Temp` porque es una ubicación con escritura permitida para usuarios sin privilegios, llena de archivos temporales legítimos y normalmente poco monitoreada. Eso reduce de forma drástica la probabilidad de detección.

> **Respuesta:** `C:\Users\OMEN\AppData\Local\Temp\templet.lnk`

### La exfiltración que deja huella en SRUM

**Q6.** What is the name of the application the attacker utilized for data exfiltration?

Para identificar la aplicación de exfiltración nos centramos en `C:\Windows\System32\sru\SRUDB.dat`. Es el artefacto del System Resource Usage Monitor (SRUM), un componente nativo de Windows que registra de forma continua el uso de recursos (CPU, red, energía, etc.) por aplicación, con resolución temporal fina e independiente de los logs de eventos.

Parseamos `SRUDB.dat` con SrumECmd y exportamos a `csv` para cargarlo en Timeline Explorer:

```bash
SrumECmd.exe -f "SRUDB.dat" --csv .
```

El comando genera, entre otros, el archivo `20260418044534_SrumECmd_NetworkUsages_Output.csv`. Al abrirlo y filtrar por `AnyDesk.exe` observamos una sesión con unos 2.8 GB de datos enviados, claramente desproporcionado para un uso legítimo de soporte remoto. Correlacionado con el resto de la evidencia, apunta a una exfiltración masiva a través de AnyDesk.

![NetworkUsages de SRUM en Timeline Explorer filtrado por AnyDesk.exe](https://github.com/user-attachments/assets/2726d701-d2c6-48e4-8d7d-ae9d29ed42dc "SRUM: tráfico de red de AnyDesk.exe")

![Detalle de la sesión de AnyDesk.exe con aproximadamente 2.8 GB de bytes enviados](https://github.com/user-attachments/assets/8e3a1d54-2f96-40ab-892b-9b31c71b228a "Volumen de datos enviados por AnyDesk")

> **Respuesta:** `AnyDesk`

### La IP del atacante en ad.trace

**Q7.** What is the IP address of the attacker?

Para identificar la IP del atacante usamos los logs propios de AnyDesk, en concreto `C:\Users\OMEN\AppData\Roaming\AnyDesk\ad.trace`.

`ad.trace` es el log principal de AnyDesk, en texto plano. Registra todos los eventos de la aplicación: conexiones entrantes y salientes, IDs remotos, transferencias de archivos y, lo más importante, las direcciones IP externas de los peers remotos. No depende de la configuración del usuario y persiste incluso después de cerrar la aplicación.

Importamos `ad.trace` en Timeline Explorer y filtramos por la palabra clave `External address` (o `anynet.relay_conn`), que corresponde a las entradas donde AnyDesk anota la IP pública del cliente remoto. El filtro devuelve las entradas de sesión del atacante y revela la IP pública usada durante la sesión de exfiltración (~2.8 GB) detectada antes en SRUM.

![ad.trace en Timeline Explorer filtrado por External address con la IP pública del atacante](https://github.com/user-attachments/assets/16bdef9d-85ff-4e8e-a16b-cbd65291dd15 "ad.trace: dirección externa del atacante")

> **Respuesta:** `77.232.122.31`

## Reconstrucción del ataque

1. **Comunicación inicial.** `wpndatabase.db` registra una notificación de `web.telegram.org`: el canal fue Telegram Web. El atacante envía el ZIP protegido `our project templet test.zip` con la contraseña `@1122d`.
2. **Ejecución y segunda etapa.** El ZIP contiene `templet.lnk`, que según LECmd apunta a `powershell.exe` con argumentos ofuscados. filescan.io muestra la descarga de `se1.hta` desde `masherofmasters.cyou`, ejecutado por `mshta.exe` (LOLBin).
3. **Persistencia vía LOLAPP.** En `Greenshot.ini`, la sección `ExternalCommand` define el comando `jlhgfjhdfIghjhuhuh`, que lanza `C:\Users\OMEN\AppData\Local\Temp\templet.lnk` cada vez que se toma una captura de pantalla.
4. **Exfiltración.** SRUM (`SRUDB.dat` procesado con SrumECmd, tabla NetworkUsages) muestra `AnyDesk.exe` con unos 2.8 GB enviados. `ad.trace` revela la External address `77.232.122.31`. AnyDesk funcionó como canal de exfiltración y C2.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Initial Access | Phishing / User Execution (Compressed File) | T1204.002 | Usuario abre ZIP y ejecuta LNK malicioso (`templet.lnk`) |
| Execution | Command and Scripting Interpreter: PowerShell | T1059.001 | LNK lanza PowerShell con payload ofuscado |
| Execution | Command and Scripting Interpreter: mshta.exe | T1218.005 | `se1.hta` ejecutado vía `mshta.exe` (LOLBin) |
| Persistence | Event-Triggered Execution (User Activity) | T1546 | Greenshot ejecuta `templet.lnk` al tomar capturas |
| Defense Evasion | Obfuscated Files or Information | T1027 | PowerShell ofuscado (Reverse + Base64) |
| Command and Control | Remote Access Tools | T1219 | AnyDesk utilizado como RAT/exfil canal |
| Exfiltration | Exfiltration Over C2 Channel | T1041 | ~2.8 GB enviados vía AnyDesk hacia 77.232.122.31 |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| IP | `77.232.122.31` | External address del atacante en `ad.trace` de AnyDesk |
| Dominio | `masherofmasters.cyou` | Descarga de la segunda etapa |
| URL | `https://masherofmasters.cyou/shins/se1.hta` | HTA de segunda etapa ejecutado por `mshta.exe` |
| Archivo | `our project templet test.zip` | ZIP protegido enviado por Telegram Web (contraseña `@1122d`) |
| Archivo | `templet.lnk` | Vector de ejecución inicial; relanzado por Greenshot |
| Ruta | `C:\Users\OMEN\AppData\Local\Temp\templet.lnk` | Archivo usado para la persistencia |
| Ruta | `C:\Users\OMEN\AppData\Roaming\Greenshot\Greenshot.ini` | Configuración con el comando `jlhgfjhdfIghjhuhuh` |
| Proceso | `AnyDesk.exe` | Canal de exfiltración, unos 2.8 GB enviados |

## Herramientas

- **DB Browser for SQLite:** lectura de `wpndatabase.db` y de las notificaciones de Telegram Web.
- **LECmd:** parsing avanzado de `templet.lnk`.
- **filescan.io:** emulación del LNK y extracción automática de IOCs.
- **Autopsy:** revisión de programas instalados (Installed Programs).
- **SrumECmd:** parsing de `SRUDB.dat` y exportación de NetworkUsages por proceso.
- **Timeline Explorer:** análisis del CSV de SRUM y de `ad.trace` (AnyDesk, IP externa).

## Lecciones aprendidas

1. **Notificaciones de Windows como inteligencia.** `wpndatabase.db` es una fuente poco explotada que puede evidenciar el uso de aplicaciones web maliciosas, como Telegram Web, incluso sin clientes locales instalados.
2. **LOLAPPs en persistencia.** Software "inofensivo" como Greenshot puede abusarse como mecanismo de persistencia muy sigiloso. Conviene incluir las LOLAPPs en las matrices de detección.
3. **SRUM más AnyDesk, evidencia sólida.** Correlacionar `SRUDB.dat` (volumen de datos) con `ad.trace` (IP remota) da una narrativa probatoria de exfiltración mediante herramientas de acceso remoto.
