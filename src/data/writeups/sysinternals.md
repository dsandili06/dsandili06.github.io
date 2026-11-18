Un usuario descargó un ejecutable que se hacía pasar por una herramienta de SysInternals. Con Autopsy, las herramientas de Eric Zimmerman y VirusTotal reconstruimos la cadena de infección: un dropper de la familia Rozena que instala un servicio falso de VMware y manipula el archivo hosts.

## El caso

Un usuario descargó un archivo ejecutable haciéndose pasar por una herramienta legítima de SysInternals. Las autoridades sospechan que es malware y solicitan al equipo de DFIR un análisis forense completo de la imagen de disco para determinar qué fue descargado, cuándo fue ejecutado, qué infraestructura contactó y qué acciones realizó en el sistema.

El objetivo es analizar una imagen forense de disco Windows con Autopsy, AppCompatCacheParser, AmcacheParser y VirusTotal para reconstruir la cadena de infección completa, desde la descarga del malware hasta su persistencia. El laboratorio es de dificultad Medium y nos obligó a investigar artefactos de Windows que no conocíamos bien: el Amcache, el AppCompatCache y el historial de comandos de PowerShell.

- **Plataforma:** CyberDefenders
- **Categoría:** Endpoint Forensics
- **Herramientas:** Autopsy, AppCompatCacheParser (Eric Zimmerman), AmcacheParser (Eric Zimmerman), Timeline Explorer (Eric Zimmerman), VirusTotal
- **Tácticas:** Initial Access, Execution, Persistence, Defense Evasion, Command and Control

## La investigación

### Tres artefactos que hay que entender primero

Antes de responder las preguntas fue necesario investigar y comprender tres artefactos forenses de Windows.

**AppCompatCache (ShimCache).** Registro de Windows ubicado en `HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache`. Registra los ejecutables que han sido creados o modificados en el sistema, incluyendo su ruta y timestamp de última modificación. Su presencia no garantiza ejecución: solo indica que el archivo existió en ese path. Se parsea con `AppCompatCacheParser.exe` de Eric Zimmerman.

**Amcache.hve.** Hive de registro ubicado en `C:\\Windows\\AppCompat\\Programs\\Amcache.hve`. A diferencia del ShimCache, el Amcache sí registra ejecución real de programas, y además almacena el hash SHA1 del ejecutable, su ruta completa y el timestamp de primera ejecución. Se parsea con `AmcacheParser.exe` de Eric Zimmerman.

**PSReadLine y ConsoleHost_history.txt.** Archivo ubicado en `C:\\Users\\<USER>\\AppData\\Roaming\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt`. Almacena el historial de comandos de PowerShell ejecutados por el usuario, similar al `.bash_history` en Linux. Tiene alto valor forense porque puede revelar comandos maliciosos ejecutados manualmente o por scripts.

### Un ejecutable que imita a Microsoft

**Q1.** What was the malicious executable file name that the user downloaded?

En Autopsy navegamos a `Users/Public/Downloads` y encontramos el archivo **SysInternals.exe** marcado con una X roja, que indica que fue eliminado del sistema de archivos (estado Unallocated). Su nombre imita deliberadamente la suite legítima de herramientas de Microsoft SysInternals, una técnica clásica de masquerading para evadir sospechas del usuario.

![Autopsy mostrando SysInternals.exe eliminado en Users/Public/Downloads](https://github.com/user-attachments/assets/a15ee811-9280-4d12-b489-71921196507d "SysInternals.exe marcado como eliminado en Autopsy")

> **Respuesta:** `SysInternals.exe`

### La última modificación del ejecutable

**Q2.** When was the last time the malicious executable file was modified? 12-hour format?

Para obtener el timestamp preciso usamos las herramientas de Eric Zimmerman. Primero `AppCompatCacheParser.exe` para parsear el hive `SYSTEM` del registro.

![Ejecución de AppCompatCacheParser.exe sobre el hive SYSTEM](https://github.com/user-attachments/assets/61070feb-b6fb-4d19-823b-34713e5f89d3 "AppCompatCacheParser parseando el hive SYSTEM")

El output `.csv` se cargó en Timeline Explorer. Al filtrar por `sysinternals` en el AppCompatCache encontramos la entrada con `Last Modified Time UTC: 2022-11-15 21:18:51`.

![Timeline Explorer con la entrada de sysinternals en el AppCompatCache](https://github.com/user-attachments/assets/863dad4b-d362-455f-88be-afd14c0d575e "Entrada de sysinternals con su Last Modified Time UTC")

> **Respuesta:** `11/15/2022 6:18:51 PM`

### El SHA1 que delata al malware

**Q3.** What is the SHA1 hash value of the malware?

El Amcache, a diferencia del AppCompatCache, registra el hash SHA1 real del ejecutable al momento de su primera ejecución.

![Ejecución de AmcacheParser.exe sobre Amcache.hve](https://github.com/user-attachments/assets/2710dc9a-9474-4378-81d5-70d69cab5b2f "AmcacheParser procesando Amcache.hve")

Cargamos en Timeline Explorer el CSV generado por `AmcacheParser.exe` y filtramos por `sysinternals`. Encontramos la entrada correspondiente a `c:\\users\\public\\downloads\\sysinternals.exe` con su hash SHA1 completo.

![Timeline Explorer con la entrada de Amcache y el SHA1 de sysinternals.exe](https://github.com/user-attachments/assets/888d6ec3-e5d4-42d9-8a60-338c26a781d0 "Entrada de Amcache con el SHA1 del ejecutable")

> **Respuesta:** `fa1002b02fc5551e075ec44bb4ff9cc13d563dcf`

### La familia del malware

**Q4.** What is the malware's family?

Buscamos el hash MD5 del ejecutable, `72e6d1728a546c2f3ee32c063ed09fa6ba8c46ac33b0dd2e354087c1ad26ef48`, en VirusTotal. El análisis muestra que 51 de 70 vendors lo clasifican como malicioso. En la sección Detection, el vendor Alibaba lo detecta como `Downloader:Win32/Rozena.cadb0acb`.

![Resultado de VirusTotal con 51 de 70 detecciones y la etiqueta de Alibaba](https://github.com/user-attachments/assets/d941a351-1af6-430b-8691-73a7cdf0cbb0 "Detecciones en VirusTotal para el ejecutable")

> **Respuesta:** `Rozena`

### El primer dominio mapeado

**Q5.** What is the first mapped domain's Fully Qualified Domain Name (FQDN)?

El análisis se hizo en dos niveles complementarios. Primero, en la sección Relations de VirusTotal vemos que el malware contactó la URL `http://www.malware430.com/html/VMwareUpdate.exe`.

![Sección Relations de VirusTotal con la URL contactada por el malware](https://github.com/user-attachments/assets/9b252670-24ba-4c2d-aa6f-29608e4c734d "URL contactada por el malware según VirusTotal")

> **Respuesta:** `www.malware430.com`

### Hosts modificado a mano

**Q6.** The mapped domain is linked to an IP address. What is that IP address?

Desde el punto de vista forense del host, en Autopsy navegamos al archivo `ConsoleHost_history.txt` ubicado en `IEUser\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadLine\`. El historial contiene el comando `Add-Content -Path $env:windir\\System32\\drivers\\etc\\hosts -Value "192.168.15.10 www.malware430.com" -Force`. Revela que el malware modificó el archivo hosts para mapear el dominio malicioso a una IP interna, una técnica de DNS hijacking local para redirigir tráfico o evadir detección.

![Historial de PowerShell en Autopsy con el comando Add-Content sobre el archivo hosts](https://github.com/user-attachments/assets/82684056-3481-4042-ac34-e722ba27cb83 "ConsoleHost_history.txt con la modificación del archivo hosts")

El mismo comando `Add-Content` que mapea el dominio especifica explícitamente la dirección IP asociada: `192.168.15.10`. Esta IP privada fue mapeada tanto a `www.malware430.com` como a `www.sysinternals.com`. Eso sugiere que el atacante buscaba interceptar conexiones legítimas a SysInternals para redirigirlas a su infraestructura.

> **Respuesta:** `192.168.15.10`

### El segundo stage

**Q7.** What is the name of the executable dropped by the first-stage executable?

En la sección Behavior (Process Tree) de VirusTotal observamos la cadena de ejecución completa. `SysInternals.exe` lanza como proceso `"%ComSpec%" /C %windir%\\vmtoolsIO.exe -install && net start VMwareIOHelperService && sc config VMwareIOHelperService start= auto`. Esto confirma que `SysInternals.exe` descarga y coloca `vmtoolsIO.exe` en `C:\Windows\`, simulando una herramienta legítima de VMware.

![Process Tree de VirusTotal con la ejecución de vmtoolsIO.exe y la creación del servicio](https://github.com/user-attachments/assets/dc32d486-052f-4f41-9325-2f66b695beb6 "Árbol de procesos del malware en VirusTotal")

> **Respuesta:** `vmtoolsIO.exe`

### El servicio de persistencia

**Q8.** What is the name of the service installed by 2nd stage executable?

Continuando con el árbol de procesos de la captura anterior, el mismo comando ejecutado por el segundo stage instala un servicio de Windows mediante `sc config VMwareIOHelperService start= auto`. El nombre del servicio imita un componente legítimo de VMware Tools.

> **Respuesta:** `VMwareIOHelperService`

## Reconstrucción del ataque

1. **Descarga e identificación.** `SysInternals.exe` aparece en `Users/Public/Downloads`, eliminado (Unallocated). El nombre imita una suite legítima de Microsoft (T1036).
2. **Línea temporal del ejecutable.** AppCompatCacheParser sobre el hive SYSTEM da Last Modified `2022-11-15 21:18:51` UTC. AmcacheParser sobre `Amcache.hve` da el SHA1 `fa1002b02fc5551e075ec44bb4ff9cc13d563dcf`. El Amcache confirma ejecución real; el AppCompatCache confirma presencia en disco.
3. **Análisis de reputación.** En VirusTotal (MD5: `72e6d1728a546c2f3ee32c063ed09fa6ba8c46ac33b0dd2e354087c1ad26ef48`) 51 de 70 vendors lo marcan como malicioso. Familia: deyma / jaik. Categoría: Trojan + Downloader.
4. **Infraestructura C2 y DNS hijacking.** El historial `ConsoleHost_history.txt` muestra dos modificaciones de hosts: `192.168.15.10` para `www.malware430.com` y `192.168.15.10` para `www.sysinternals.com`.
5. **Cadena de infección completa.** `SysInternals.exe` (1st stage) deja `C:\\Windows\\vmtoolsIO.exe` (2nd stage), que instala el servicio `VMwareIOHelperService` con `start=auto`, es decir, persistencia.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Initial Access | User Execution: Malicious File | T1204.002 | Usuario descarga y ejecuta SysInternals.exe desde C:\\Users\\Public\\Downloads |
| Defense Evasion | Masquerading | T1036 | Ejecutable nombrado SysInternals.exe para imitar herramienta legítima de Microsoft |
| Defense Evasion | Modify Hosts File | T1565.001 | PowerShell modifica hosts para mapear www.malware430.com y www.sysinternals.com a 192.168.15.10 |
| Execution | Command and Scripting Interpreter: PowerShell | T1059.001 | Comandos maliciosos ejecutados via PowerShell, registrados en ConsoleHost_history.txt |
| Persistence | Create or Modify System Process: Windows Service | T1543.003 | vmtoolsIO.exe instala VMwareIOHelperService con start=auto para sobrevivir reinicios |
| Command and Control | Application Layer Protocol: Web Protocols | T1071.001 | Malware contacta http://www.malware430.com/html/VMwareUpdate.exe para descarga de 2nd stage |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| Archivo | `SysInternals.exe` | Primer stage, en `c:\\users\\public\\downloads\\sysinternals.exe` |
| Hash SHA1 | `fa1002b02fc5551e075ec44bb4ff9cc13d563dcf` | Registrado en Amcache para el primer stage |
| Hash MD5 | `72e6d1728a546c2f3ee32c063ed09fa6ba8c46ac33b0dd2e354087c1ad26ef48` | Valor buscado en VirusTotal (51 de 70 detecciones) |
| Dominio | `www.malware430.com` | Dominio mapeado en el archivo hosts |
| Dominio | `www.sysinternals.com` | Dominio legítimo redirigido por el archivo hosts |
| URL | `http://www.malware430.com/html/VMwareUpdate.exe` | Descarga de segundo stage contactada por el malware |
| IP | `192.168.15.10` | IP privada mapeada en hosts para ambos dominios |
| Archivo | `vmtoolsIO.exe` | Segundo stage en `C:\Windows\` |
| Servicio | `VMwareIOHelperService` | Servicio con `start=auto` que da persistencia |

## Herramientas

- **Autopsy:** navegación del sistema de archivos y extracción del historial de PSReadLine.
- **AppCompatCacheParser.exe:** parseo del ShimCache desde el hive SYSTEM.
- **AmcacheParser.exe:** parseo de `Amcache.hve` para SHA1 y evidencia de ejecución.
- **Timeline Explorer:** visualización y filtrado de los CSV generados.
- **VirusTotal:** reputación por hash, Process Tree, URLs contactadas y etiquetas de familia.

## Lecciones aprendidas

1. **Amcache y AppCompatCache se complementan.** El AppCompatCache (ShimCache) registra archivos que existieron en disco pero no garantiza ejecución. El Amcache sí confirma ejecución real y guarda el SHA1 del binario, una fuente directa de inteligencia de amenazas sin necesidad de tener el archivo físico.
2. **PSReadLine es un artefacto forense de primer nivel.** `ConsoleHost_history.txt` es el equivalente Windows de `.bash_history`. Con ScriptBlock Logging o Module Logging deshabilitados, puede ser la única evidencia de comandos maliciosos ejecutados manualmente o por scripts de primer stage.
3. **Masquerading con nombres de herramientas legítimas.** Nombrar malware `SysInternals.exe` o `vmtoolsIO.exe` busca evadir sospechas visuales y potencialmente reglas de detección que excluyen herramientas de administración conocidas. Apuntar `www.sysinternals.com` a una IP controlada por el atacante muestra que entiende cómo los administradores usan esas herramientas.
