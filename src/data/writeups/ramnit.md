Un IDS alertó sobre comportamiento sospechoso en una workstation y el laboratorio entrega un dump de memoria. Con Volatility 3 aislamos un falso instalador de Chrome, extrajimos su C2 y su hash, y lo enriquecimos en VirusTotal hasta identificarlo como Ramnit.

## El caso

Un IDS alertó sobre comportamiento sospechoso en una workstation y hay un memory dump disponible para análisis forense. El objetivo fue identificar el proceso malicioso, extraer IOCs de red, el hash del ejecutable y el timestamp de compilación, correlacionando con threat intelligence externa. Aplicamos técnicas de Volatility para detectar actividad maliciosa en el dump.

- **Plataforma:** CyberDefenders
- **Categoría:** Endpoint Forensics
- **Herramientas:** Volatility 3, VirusTotal, sha1sum, GeoDataTool, WhatIsMyIPAddress
- **Tácticas:** Execution | Defense Evasion | Command and Control

## La investigación

### El proceso que no debería seguir vivo

**Q1.** What is the name of the process responsible for the suspicious activity?

Primero corroboramos los procesos en ejecución:

```bash
python3 vol.py -f (PATH al dump) Windows.pslist
```

Al revisar la lista no vimos procesos maliciosos evidentes, así que analizamos los comandos ejecutados en el sistema:

```bash
python3 vol.py -f (PATH al dump) Windows.cmdline
```

![Salida de Windows.cmdline con la línea de comando de ChromeSetup.exe](https://github.com/user-attachments/assets/87f3e5ae-5851-40d0-a420-143e9a8b520d "Windows.cmdline revela ChromeSetup.exe")

Una línea de comando sospechosa destaca: `ChromeSetup.exe`. Es anómalo, porque un instalador legítimo de Chrome se cierra solo tras completar la instalación y no permanece activo en el sistema. Con este criterio respondemos tanto la primera como la segunda pregunta del laboratorio.

> **Respuesta:** `ChromeSetup.exe`

### La ruta del ejecutable

**Q2.** What is the exact path of the executable for the malicious process?

La ruta del proceso malicioso se confirma desde los flags de cmdline en Volatility.

> **Respuesta:** `C:\Users\alex\Downloads\ChromeSetup.exe`

### A qué IP intentó conectarse

**Q3.** Identifying network connections is crucial for understanding the malware's communication strategy. What IP address did the malware attempt to connect to?

Usamos el plugin `Windows.netscan` para enumerar las conexiones de red de los procesos del dump. Para reducir ruido y filtrar el proceso malicioso, aplicamos un grep sobre el PID extraído antes (4628):

```bash
python3 vol.py -f (PATH al dump) Windows.netscan | grep -i "4628"
```

![Salida de Windows.netscan filtrada por el PID 4628](https://github.com/user-attachments/assets/d5ef71aa-316d-4d24-ac18-8bab4c51c19e "Conexión de red del PID 4628")

> **Respuesta:** `58.64.204.181`

### De dónde viene la conexión

**Q4.** To determine the specific geographical origin of the attack, Which city is associated with the IP address the malware communicated with?

Para geolocalizar la IP maliciosa recurrimos a plataformas como geodatatool, VirusTotal y WhatIsMyIPAddress, entre otras herramientas de inteligencia de IP.

![Geolocalización de la IP maliciosa](https://github.com/user-attachments/assets/f5170c7a-95cc-42f6-b15b-4aca0b75bba6 "Geolocalización de la IP del C2")

> **Respuesta:** `Hong Kong`

### Recuperar el ejecutable y calcular su SHA1

**Q5.** Hashes serve as unique identifiers for files, assisting in the detection of similar threats across different machines. What is the SHA1 hash of the malware executable?

Con el proceso malicioso identificado (PID 4628), volcamos el ejecutable para calcular su hash. Usamos el plugin `Windows.dumpfiles` con el parámetro `--pid` para señalar el proceso objetivo:

```bash
python3 vol.py -f (PATH al dump) Windows.dumpfiles --pid 4628
```

![Resultado de Windows.dumpfiles con el volcado del ejecutable](https://github.com/user-attachments/assets/d7196ff7-4640-40e5-8637-52d2c97c1347 "Volcado del ejecutable con dumpfiles")

Con el ejecutable volcado, calculamos el SHA1:

```bash
sha1sum file.0xca82b85325a0.0xca82b7e06c80.ImageSectionObject.ChromeSetup.exe.img
```

> **Respuesta:** `280c9d36039f9432433893dee6126d72b9112ad2`

### Cuándo se compiló

**Q6.** Examining the malware's development timeline can provide insights into its deployment. What is the compilation timestamp for the malware?

Hicimos el análisis de threat intelligence en VirusTotal con el SHA1 extraído. En el apartado "Details" de la muestra identificamos la fecha de compilación.

![Fecha de compilación en la pestaña Details de VirusTotal](https://github.com/user-attachments/assets/47526e6d-9209-42d5-9660-34e5bca999e1 "Timestamp de compilación en VirusTotal")

> **Respuesta:** `2019-12-01 08:36`

### El dominio asociado

**Q7.** Identifying the domains associated with this malware is crucial for blocking future malicious communications and detecting any ongoing interactions with those domains within our network. Can you provide the domain connected to the malware?

En VirusTotal fuimos al apartado "Relations" de la muestra. En la sección "Contacted Domains" identificamos el dominio C2 asociado.

![Sección Contacted Domains en Relations de VirusTotal](https://github.com/user-attachments/assets/b70b9fe7-a0c8-4b37-bf34-070b57b39d95 "Dominio contactado por la muestra")

> **Respuesta:** `dnsnb8.net`

## Reconstrucción del ataque

1. **Enumeración de procesos y análisis de comportamiento.** `Windows.pslist` da la línea base. `Windows.cmdline` muestra `ChromeSetup.exe` (PID 4628) persistente. La razón: los instaladores legítimos se cierran solos tras la instalación.
2. **Extracción de IOCs de red.** `Windows.netscan` filtrado por el PID 4628 revela la IP C2 `58.64.204.181` (Hong Kong), con geolocalización confirmada vía GeoDataTool.
3. **Recuperación de la muestra.** `Windows.dumpfiles --pid 4628` extrae `ChromeSetup.exe.img`. SHA1: `280c9d36039f9432433893dee6126d72b9112ad2`.
4. **Enriquecimiento con threat intelligence.** VirusTotal da la compilación `2019-12-01 08:36`, el dominio C2 `dnsnb8.net` (Relations → Contacted Domains) y la familia Ramnit, por comportamiento e IOCs.

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| Archivo | `C:\Users\alex\Downloads\ChromeSetup.exe` | Ejecutable malicioso (PID 4628) |
| IP | `58.64.204.181` | Destino de la conexión del malware (Hong Kong) |
| Dominio | `dnsnb8.net` | Dominio C2 en Contacted Domains de VirusTotal |
| SHA1 | `280c9d36039f9432433893dee6126d72b9112ad2` | Hash del ejecutable volcado |
| Timestamp | `2019-12-01 08:36` | Fecha de compilación según VirusTotal |

## Herramientas

- **Volatility 3:** `pslist`, `cmdline`, `netscan` y `dumpfiles`.
- **sha1sum:** cálculo del hash del ejecutable.
- **VirusTotal:** análisis de la muestra, timestamps y dominios.
- **WhatIsMyIPAddress:** geolocalización de la IP.

## Lecciones aprendidas

1. **Process hunting.** `Windows.cmdline` rinde más que `pslist` para detectar persistencia anómala.
2. **Correlación por PID.** Filtrar siempre `netscan` por el PID sospechoso (`grep -i "PID"`).
3. **Flujo de memory forensics.** Dump, hash y enriquecimiento en VirusTotal producen IOCs accionables.
