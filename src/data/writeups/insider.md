Karen, empleada de TAAUSAI, es sospechosa de actividades ilegales dentro de la organización, y el laboratorio entrega la imagen forense del disco de su workstation Linux. Reconstruimos sus acciones: una Kali Linux con Mimikatz, un archivo secreto, esteganografía y un script que provoca a un colega.

## El caso

Karen es sospechosa de realizar actividades ilegales dentro de la organización. Contamos con una imagen forense de disco de su workstation Linux. El objetivo fue reconstruir las acciones del usuario, identificar herramientas maliciosas descargadas, archivos creados y actividad de escalación de privilegios.

Para el análisis usamos FTK Imager, una herramienta muy usada en informática forense. Crea, analiza y examina imágenes forenses de discos, con copias bit a bit de discos duros, unidades USB, tarjetas de memoria y otros medios sin alterar los datos originales. Así se garantiza la integridad de la evidencia (cadena de custodia). En este laboratorio cargamos el archivo `.ad1` proporcionado.

- **Plataforma:** CyberDefenders
- **Categoría:** Endpoint Forensics
- **Herramientas:** FTK Imager, PowerShell
- **Tácticas:** Execution | Credential Access

## La investigación

### Qué distribución corre en la máquina

**Q1.** Which Linux distribution is being used on this machine?

Revisamos varias rutas con metadata del sistema operativo. La primera es la carpeta `/boot/`, donde los archivos del kernel suelen incluir información sobre la versión y la distribución cargada. De forma complementaria, `grub.cfg` también expone datos de la distro. Una tercera fuente confiable es el archivo `syslog` en `/var/log/installer/`, generado automáticamente durante la instalación del sistema. Cualquiera de ellas confirma la distribución que usa Karen.

![Árbol de archivos en FTK Imager con la información de la distribución](https://github.com/user-attachments/assets/6ce6484d-266e-4f70-a405-540a34dc166d "Identificación de la distribución Linux")

> **Respuesta:** `Kali Linux`

### El hash de un access.log vacío

**Q2.** What is the MD5 hash of the Apache access.log file?

Hay tres métodos válidos:

- **Método 1:** exportar el archivo a la máquina host (Windows) y calcular el hash con PowerShell: `Get-FileHash (path al archivo) -Algorithm MD5`.
- **Método 2:** usar la función nativa de FTK Imager para exportar hashes en formato `.csv` y examinarlos directamente.
- **Método 3:** seleccionar el archivo en FTK Imager y ver el hash en el panel inferior izquierdo de propiedades del archivo.

El valor corresponde al hash MD5 de un archivo vacío. Es consistente con la ausencia de registros en `access.log` y confirma que Apache nunca fue ejecutado (relevante para la pregunta sobre Apache).

![Hash MD5 del access.log mostrado en FTK Imager](https://github.com/user-attachments/assets/ca14b408-c609-4804-a8d1-9e1e0be75e93 "Hash MD5 de access.log")

![Propiedades del archivo access.log en FTK Imager](https://github.com/user-attachments/assets/1985fc5c-5035-4788-b1dc-136937aa8def "Propiedades de access.log en FTK Imager")

> **Respuesta:** `d41d8cd98f00b204e9800998ecf8427e`

### La herramienta de credential dumping

**Q3.** It is suspected that a credential dumping tool was downloaded. What is the name of the downloaded file?

En la carpeta `Downloads` del usuario `root` (`/root/Downloads/`) encontramos un `.zip` que corresponde a Mimikatz, una herramienta de código abierto muy conocida en el ámbito ofensivo. Está diseñada para extraer credenciales en texto plano, hashes NTLM, PINs y tickets Kerberos directamente desde la memoria de sistemas Windows comprometidos. Su presencia en el sistema de Karen es un indicador claro de intención de credential dumping sobre otros sistemas de la red.

![Contenido de /root/Downloads con el archivo ZIP de Mimikatz](https://github.com/user-attachments/assets/0665a7fa-0120-40bd-9c78-1dabc4c50392 "Mimikatz en la carpeta Downloads de root")

> **Respuesta:** `mimikatz_trunk.zip`

### El archivo súper secreto

**Q4.** A super-secret file was created. What is the absolute path to this file?

El archivo `/root/.bash_history` nos permite reconstruir cronológicamente los comandos del usuario en sus sesiones de terminal. Este archivo registra el historial completo una vez que la sesión se cierra. En su contenido vemos que Karen usa `touch` combinado con redirección de output (`>`) para crear un archivo en `/root/Desktop/SuperSecretFile.txt`, que es la ruta absoluta del archivo sospechoso.

![Contenido de .bash_history con la creación del archivo secreto](https://github.com/user-attachments/assets/029196a9-f756-412c-b22c-30a99d29991f "Creación del archivo en .bash_history")

> **Respuesta:** `/root/Desktop/SuperSecretFile.txt`

### Esteganografía con binwalk

**Q5.** What program used the file didyouthinkwedmakeiteasy.jpg during its execution?

Siguiendo con `.bash_history`, encontramos una entrada que procesa `didyouthinkwedmakeiteasy.jpg` con binwalk. Esta herramienta de análisis forense y reversing escanea, identifica y extrae archivos embebidos dentro de binarios y firmwares. Usarla sobre un `.jpg` indica esteganografía o análisis de datos ocultos, una técnica frecuente para esconder payloads dentro de imágenes aparentemente legítimas.

![Entrada de .bash_history con binwalk sobre la imagen JPG](https://github.com/user-attachments/assets/08588095-df75-4481-8b7f-2d7b2d414c41 "Uso de binwalk sobre una imagen")

> **Respuesta:** `binwalk`

### El checklist de Karen

**Q6.** What is the third goal from the checklist Karen created?

En `/root/Desktop/` localizamos un archivo llamado `Checklist`. Karen documentó tres objetivos planificados para su actividad maliciosa en la organización. El tercero y último revela la motivación final de sus acciones.

![Contenido del archivo Checklist de Karen](https://github.com/user-attachments/assets/2323a598-cdaa-446a-8833-a406f774f4ef "El Checklist en el escritorio de root")

> **Respuesta:** `profit`

### Cuántas veces corrió Apache

**Q7.** How many times was Apache run?

Fuimos a `/var/log/apache2/`. Los tres archivos `.log` presentes (`access.log`, `error.log`, `other_vhosts_access.log`) están completamente vacíos, sin ningún registro de actividad. Esto es consistente con el hash MD5 de la segunda pregunta (`d41d8cd98f00b204e9800998ecf8427e`), que corresponde al hash de un archivo vacío en cualquier sistema. Apache nunca fue iniciado en esta máquina.

![Archivos de log de Apache vacíos en /var/log/apache2](https://github.com/user-attachments/assets/03df5e8e-b6b9-4fc5-946d-783ee1ef99b8 "Logs de Apache sin registros")

> **Respuesta:** `0`

### Evidencia de un ataque lanzado desde la máquina

**Q8.** This machine was used to launch an attack on another. Which file contains the evidence for this?

En el directorio del usuario `root` localizamos una imagen `.jpeg`. Al exportarla al host y abrirla, vemos un escritorio con una línea de comandos ejecutando Flightsim, una utilidad que genera patrones de tráfico de red malicioso con fines de auditoría. Simula tráfico de túnel DNS, tráfico DGA (Domain Generation Algorithm), solicitudes a servidores C2 activos y otros patrones sospechosos. La imagen es evidencia directa de que la máquina de Karen se usó para lanzar ataques simulados contra la infraestructura de red de la organización.

![Captura de pantalla que muestra la ejecución de Flightsim](https://github.com/user-attachments/assets/79f5e163-2c52-4a60-8cbd-04fe53ee2548 "Flightsim ejecutándose en el escritorio")

![Imagen de evidencia adicional del escritorio de Karen](https://github.com/user-attachments/assets/e4144317-79f8-421b-9308-63bdf4067f06 "Evidencia del escritorio")

> **Respuesta:** `irZLAohL.jpeg`

### A quién provoca el script

**Q9.** It is believed that Karen was taunting a fellow computer expert through a bash script within the Documents directory. Who was the expert that Karen was taunting?

El script en `/root/Documents/` hace tres cosas:

1. Muestra el directorio de trabajo actual (`pwd`).
2. Muestra todas las rutas, puertas de enlace e interfaces configuradas en el sistema (`ip route`).
3. Muestra las conexiones establecidas y filtra las del puerto 80 (`netstat | grep --color 80`).

Al final, Karen incluye un mensaje dirigido a un compañero: `"Heck yeah! I can write bash too Young"`. Eso revela el nombre del experto al que quería provocar.

![Contenido del script bash en /root/Documents con el mensaje final](https://github.com/user-attachments/assets/83037076-3a1c-4980-8c13-181b51d91be0 "El script bash con el mensaje para Young")

> **Respuesta:** `Young`

### El usuario que usa su

**Q10.** A user executed the su command to gain root access multiple times at 11:26. Who was the user?

Fuimos al directorio de logs `/var/log/` y examinamos `auth.log`, que registra los eventos de autenticación, autorización y escalación de privilegios. En las entradas de las 11:26 vemos que el usuario `postgres` ejecuta `su` repetidamente para obtener privilegios root. Es relevante porque, si PostgreSQL corre como root (mala práctica de hardening), puede abusarse para ejecutar comandos arbitrarios del sistema con máximos privilegios.

![Entradas de auth.log a las 11:26 con ejecuciones de su](https://github.com/user-attachments/assets/84734ccb-16c0-414b-a218-791d79072737 "Ejecuciones de su en auth.log")

> **Respuesta:** `postgres`

### El directorio de trabajo según el historial

**Q11.** Based on the bash history, what is the current working directory?

Analizamos de forma completa y cronológica `/root/.bash_history` y observamos el patrón de navegación de Karen. El atacante hace un `cd` a `/root/Documents/myfirsthack/` y desde esa ubicación ejecuta todos los comandos posteriores del historial. Es el directorio de trabajo activo al momento del análisis.

![Historial de comandos con el cambio a /root/Documents/myfirsthack](https://github.com/user-attachments/assets/79cb80a3-1314-4a27-ad8f-02ab720b2778 "El cd hacia myfirsthack en el historial")

> **Respuesta:** `/root/Documents/myfirsthack/`

## Reconstrucción del ataque

1. **Reconocimiento del sistema.** `/boot/`, `grub.cfg` y `/var/log/installer/syslog` identifican la distribución como Kali Linux, un sistema orientado a operaciones ofensivas.
2. **Artefactos maliciosos.** `/root/Downloads/mimikatz_trunk.zip` es la herramienta de credential dumping. `/root/Desktop/SuperSecretFile.txt` es un archivo creado vía `touch`. `/root/Documents/myfirsthack/` es el directorio de trabajo del ataque. `irZLAohL.jpeg` es la evidencia visual del uso de Flightsim.
3. **Actividad vía bash history.** En `/root/.bash_history` vemos `cd /root/Documents/myfirsthack/`, `touch /root/Desktop/SuperSecretFile.txt`, `binwalk didyouthinkwedmakeiteasy.jpg` y la ejecución de un script con un mensaje a "Young".
4. **Logs de autenticación.** `/var/log/auth.log` a las 11:26 muestra al usuario `postgres` con múltiples ejecuciones de `su`. El riesgo es PostgreSQL corriendo como root (misconfiguration). Los logs de Apache están vacíos, con MD5 `d41d8cd98f00b204e9800998ecf8427e` (archivo vacío).

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Credential Access | OS Credential Dumping | T1003 | Descarga de `mimikatz_trunk.zip` en `/root/Downloads/` |
| Execution | Command and Scripting Interpreter: Unix Shell | T1059.004 | Script Bash malicioso en `/root/Documents/` |
| Privilege Escalation | Abuse Elevation Control Mechanism: Sudo and su | T1548.003 | Usuario `postgres` ejecuta `su` reiteradamente a las 11:26 |
| Discovery | System Network Configuration Discovery | T1016 | Script ejecuta `ip route` y `netstat` para mapear la red |
| Execution | User Execution | T1204 | Uso de `binwalk` sobre imagen `.jpg` para extraer datos embebidos |
| Impact | Network Denial of Service / Traffic Generation | T1498 | Uso de Flightsim para generar tráfico malicioso simulado |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| Archivo | `/root/Downloads/mimikatz_trunk.zip` | Herramienta de credential dumping descargada |
| Archivo | `/root/Desktop/SuperSecretFile.txt` | Archivo creado con `touch` según el historial |
| Archivo | `/root/Desktop/Checklist` | Objetivos planificados por Karen |
| Archivo | `irZLAohL.jpeg` | Imagen con evidencia del uso de Flightsim |
| Archivo | `didyouthinkwedmakeiteasy.jpg` | Imagen procesada con binwalk |
| Ruta | `/root/Documents/myfirsthack/` | Directorio de trabajo del ataque |
| Hash MD5 | `d41d8cd98f00b204e9800998ecf8427e` | Hash de un archivo vacío (`access.log` de Apache) |
| Cuenta | `postgres` | Ejecuta `su` repetidamente a las 11:26 en auth.log |

## Herramientas

- **FTK Imager:** análisis de la imagen `.ad1`, exportación de archivos y hashes.
- **PowerShell:** `Get-FileHash` para el cálculo de MD5/SHA.
- **Artefactos analizados:** `/root/.bash_history` (reconstrucción cronológica), `/var/log/auth.log` (autenticación y escalación), `/var/log/apache2/*.log` (estado de ejecución de Apache) y `/root/Desktop/Checklist` (objetivos planificados).

## Lecciones aprendidas

1. **Bash history como evidencia forense.** `.bash_history` es una de las fuentes más valiosas en forense Linux y permite reconstruir cronológicamente las acciones del usuario con mucho detalle.
2. **Privilegios de servicios.** Ejecutar servicios como PostgreSQL con privilegios root es una misconfiguration crítica que puede abusarse para escalación de privilegios lateral.
3. **Kali Linux en endpoints corporativos.** Que haya Kali Linux en la workstation de un empleado sin rol de seguridad justificado es una red flag inmediata y debería generar alertas en cualquier entorno SOC.
