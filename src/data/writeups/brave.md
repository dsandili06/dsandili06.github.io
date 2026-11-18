Analizamos el dump de memoria de una workstation Windows sospechada de actividad no autorizada y patrones de navegación inusuales. Con Volatility 3, CertUtil y HxD reconstruimos procesos, conexiones establecidas y el uso real de aplicaciones por parte del usuario.

## El caso

Recibimos un dump de memoria de una workstation Windows que se sospecha fue utilizada para actividades potencialmente maliciosas, incluyendo accesos no autorizados y patrones de navegación inusuales. El equipo de seguridad detectó actividad de red hacia IPs externas asociadas a servicios de comunicación cifrada.

El objetivo es analizar la memoria para identificar procesos relevantes, conexiones activas al momento de la adquisición y reconstruir patrones de uso de aplicaciones por parte del usuario. El laboratorio corresponde a la categoría Endpoint Forensics y está orientado al análisis de memoria con Volatility 3, CertUtil y HxD.

- **Plataforma:** CyberDefenders
- **Categoría:** Endpoint Forensics
- **Herramientas:** Volatility 3, CertUtil, HxD
- **Tácticas:** Execution, Discovery, Command and Control

## La investigación

### Fijar la línea temporal de la evidencia

**Q1.** What time was the RAM image acquired according to the suspect system?

Empezamos con un plugin de reconocimiento general, `windows.info`, que extrae metadatos fundamentales de la evidencia: procesadores, versión del sistema operativo, hora y fecha del sistema, entre otros artefactos básicos que fijan la línea temporal inicial del análisis.

```text
vol -f (path al dump) windows.info
```

![Salida de windows.info con la hora del sistema al momento de la adquisición](https://github.com/user-attachments/assets/753deb98-1102-45d0-a104-5773abe1b780 "Metadatos del dump obtenidos con windows.info")

> **Respuesta:** `2021-04-30 17:52`

### Verificar la integridad del dump

**Q2.** What is the SHA256 hash value of the RAM image?

Como nuestro entorno de análisis está basado en Windows, calculamos el hash con PowerShell. Desde el punto de vista forense, verificar los hashes de la evidencia es una buena práctica obligatoria: permite garantizar la integridad del artefacto analizado y demostrar que no fue alterado durante el proceso.

```powershell
Get-FileHash -Algorithm SHA256 (path al dump)
```

Con esto obtenemos directamente el hash SHA256 del archivo de memoria.

> **Respuesta:** `9DB01B1E7B19A3B2113BFB65E860FFFD7A1630BDF2B18613D206EBF2AA0EA172`

### Localizar el proceso de Brave

**Q3.** What is the process ID of brave.exe?

Para evitar ruido al aplicar el plugin `pslist`, filtramos la salida con `Select-String`. Así nos quedamos solo con las líneas relevantes y acelerar la identificación del proceso objetivo.

```powershell
vol -f (path al dump) windows.pslist | sls "brave"
```

Hay que interpretar bien la salida: el primer identificador corresponde al PID y el segundo al PPID.

![Salida filtrada de pslist con las entradas de brave.exe](https://github.com/user-attachments/assets/f98849ad-d2c2-458f-aff7-0994c36cf1f1 "Procesos brave.exe listados con pslist")

> **Respuesta:** `4856`

### Contar las conexiones establecidas

**Q4.** How many established network connections were there at the time of acquisition?

Aplicamos la misma limpieza de salida. En lugar de revisar manualmente todas las conexiones obtenidas por `netscan`, filtramos únicamente las que están en estado `ESTABLISHED`, que son las que reconstruyen la actividad viva del host al momento de la adquisición.

```powershell
vol -f (path al dump) windows.netscan | sls "ESTABLISHED"
```

De esta manera contamos la cantidad exacta de conexiones activas en ese instante.

![Conexiones en estado ESTABLISHED listadas por netscan](https://github.com/user-attachments/assets/24b174f2-0095-41fc-b51f-c6f574ef5cfb "Conexiones ESTABLISHED al momento de la adquisición")

> **Respuesta:** `10`

### Resolver el dominio detrás de Chrome

**Q5.** Which domain name does Chrome have an established network connection with?

Con la información anterior identificamos la IP remota de la conexión establecida de `chrome.exe` y realizamos un Reverse DNS Lookup, que consulta qué nombre de dominio está asociado a una IP específica.

![Conexión establecida de chrome.exe con su IP remota](https://github.com/user-attachments/assets/222228dc-e227-4953-a2c6-b490a1b03151 "IP remota de la conexión establecida de chrome.exe")

Para esto usamos la página `dnschecker.org`, que resolvió el dominio correspondiente a la conexión observada.

![Resultado del Reverse DNS Lookup en dnschecker.org](https://github.com/user-attachments/assets/4b6143f1-51bf-4aec-9ed0-21699dd3acf4 "Reverse DNS de la IP remota en dnschecker.org")

> **Respuesta:** `protonmail.ch`

### Extraer el ejecutable del PID 6988

**Q6.** What is the MD5 hash value of the process executable for PID 6988?

Necesitamos extraer el proceso asociado al PID `6988` para trabajar sobre el ejecutable recuperado, ya sea con `Strings`, extracción de IOCs o cálculo de hashes. Primero volcamos el proceso:

```powershell
vol -f (path al dump) windows.pslist --pid 6988 --dump
```

Una vez extraído, calculamos el hash MD5 con PowerShell:

```powershell
Get-FileHash -Algorithm MD5 (path al dump del proceso)
```

![Hash MD5 del ejecutable del PID 6988 calculado con Get-FileHash](https://github.com/user-attachments/assets/c0d5b97b-4e6d-45ef-90b1-5d63173d43cd "MD5 del proceso volcado del PID 6988")

> **Respuesta:** `0B493D8E26F03CCD2060E0BE85F430AF`

### Una palabra en un offset concreto

**Q7.** Can you identify the word that begins at offset 0x45BE876 and is 6 bytes long?

Para esta validación puntual recurrimos a HxD, un editor hexadecimal. Navegamos directamente al offset `0x45BE876` y, una vez posicionados, leemos los 6 bytes indicados por la consigna.

![Vista hexadecimal en HxD en el offset 0x45BE876](https://github.com/user-attachments/assets/81883e68-d1f0-4e28-83dd-541e61875879 "Seis bytes leídos en HxD desde el offset 0x45BE876")

> **Respuesta:** `hacker`

### El padre de PowerShell

**Q8.** What is the creation date and time of the parent process of powershell.exe?

Usamos `windows.pstree`, la forma más clara de visualizar la relación padre-hijo entre procesos dentro del dump. Al ubicar `powershell.exe` en el árbol vemos qué proceso lo originó: el parent process es `explorer.exe`. De la misma salida obtenemos la fecha y hora de creación del proceso padre.

```text
vol -f (path al dump) windows.pstree
```

![Árbol de procesos con powershell.exe y su proceso padre explorer.exe](https://github.com/user-attachments/assets/b22a8267-012e-46e7-83d9-8d852f226f14 "Relación padre-hijo de powershell.exe en pstree")

> **Respuesta:** `2021-04-30 17:39`

### El último archivo abierto en Notepad

**Q9.** What is the full path and name of the last file opened in notepad?

Aplicamos `windows.cmdline`, que entrega los parámetros con los que fue ejecutado cada proceso. Para enfocarnos en `notepad.exe` filtramos con `Select-String`. Así identificamos que desde la carpeta temporal de Windows (`\Temp\`) se abrió un archivo potencialmente sensible o sospechoso a través de Notepad.

```powershell
vol -f (path al dump) windows.cmdline | sls "notepad"
```

![Línea de comandos de notepad.exe con la ruta del archivo abierto](https://github.com/user-attachments/assets/ea188541-f0ab-403f-9668-77c624ffced7 "Archivo abierto por notepad.exe según cmdline")

> **Respuesta:** `C:\Users\JOHNDO~1\AppData\Local\Temp\7zO4FB31F24\accountNum`

### Cuánto tiempo usó Brave el sospechoso

**Q10.** How long did the suspect use Brave browser? (In Hours)

Para responder recurrimos a UserAssist, una clave del registro que almacena información sobre la ejecución de procesos con interfaz gráfica. Este artefacto permite identificar la ruta de ejecución, el tiempo activo, la cantidad de veces que se ejecutó un programa y su último momento de uso. Lo extraemos desde memoria con el plugin específico de Volatility y filtramos para quedarnos solo con la evidencia asociada a Brave:

```powershell
vol -f (path al dump) windows.registry.userassist | sls "brave"
```

![Entradas de UserAssist asociadas a Brave con el tiempo de uso](https://github.com/user-attachments/assets/447472f8-644f-49e1-b290-a8a2011073ee "Tiempo de uso de Brave en UserAssist")

> **Respuesta:** `4`

## Reconstrucción del ataque

El análisis siguió cinco fases:

1. **Validación inicial de la evidencia.** Calculamos el hash SHA256 de la imagen de memoria para preservar su integridad y trabajar sobre una referencia verificable durante todo el análisis.
2. **Enumeración de procesos relevantes.** Con `windows.pslist`, `windows.pstree` y `windows.cmdline` identificamos el PID de `brave.exe`, la relación padre-hijo de `powershell.exe` y el último archivo abierto mediante Notepad.
3. **Enumeración de conexiones activas.** `windows.netscan` filtrado por `ESTABLISHED` localizó las conexiones al momento de la adquisición y permitió resolver, por reverse DNS, el dominio de la conexión activa de Chrome.
4. **Extracción y análisis de binario.** Extrajimos el ejecutable asociado al PID `6988` para hashing y posible análisis estático orientado a IOCs y atribución.
5. **Artefactos hexadecimales y registro.** HxD validó la cadena en el offset solicitado, mientras que UserAssist permitió reconstruir el tiempo de uso del navegador Brave.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Discovery | Process Discovery | T1057 | Enumeración de procesos relevantes como `brave.exe`, `powershell.exe` y `notepad.exe` |
| Discovery | System Network Connections Discovery | T1049 | Identificación de conexiones activas en estado `ESTABLISHED` mediante `windows.netscan` |
| Command and Control | Application Layer Protocol | T1071.001 | Conexión activa de Chrome hacia `protonmail.ch`, servicio asociado a comunicaciones cifradas |
| Execution | PowerShell | T1059.001 | Presencia y análisis del árbol de ejecución relacionado con `powershell.exe` |
| Collection | Data from Local System | T1005 | Identificación del archivo abierto en Notepad dentro del directorio temporal del usuario |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| Hash SHA256 | `9DB01B1E7B19A3B2113BFB65E860FFFD7A1630BDF2B18613D206EBF2AA0EA172` | Imagen de memoria analizada |
| Hash MD5 | `0B493D8E26F03CCD2060E0BE85F430AF` | Ejecutable del proceso con PID `6988` |
| Dominio | `protonmail.ch` | Conexión establecida de `chrome.exe` |
| Ruta | `C:\Users\JOHNDO~1\AppData\Local\Temp\7zO4FB31F24\accountNum` | Último archivo abierto en Notepad |

## Herramientas

- **Volatility 3:** `windows.info`, `windows.pslist`, `windows.netscan`, `windows.pstree`, `windows.cmdline` y `windows.registry.userassist`.
- **PowerShell:** `Get-FileHash` para SHA256 y MD5.
- **HxD:** análisis manual de offset hexadecimal.
- **DNSChecker:** Reverse DNS Lookup para resolución de FQDN.

## Lecciones aprendidas

1. **La validación de hashes de evidencia no es opcional.** Es un paso básico pero crítico para garantizar integridad forense y trazabilidad del análisis.
2. **Volatility 3 reconstruye comportamiento con mucha precisión.** Funciona si se combinan correctamente plugins como `pslist`, `pstree`, `netscan`, `cmdline` y `userassist`.
3. **Correlacionar procesos, conexiones y registro da contexto.** Cruzar procesos, conexiones activas y artefactos del registro permite reconstruir el uso real del sistema y posibles acciones sospechosas del usuario.
