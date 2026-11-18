Un ejecutable con doble extensión, `IMF-Info.pdf.exe`, descargado desde un servidor interno deja inservibles los archivos de Ethan, un analista de la IMF. Analizamos la imagen forense, desofuscamos el PowerShell embebido y recuperamos los archivos cifrados por un ransomware dirigido.

## El caso

La IMF sufre un ciberataque que compromete datos sensibles. Ethan descarga información de un servidor comprometido que después se vuelve ilegible. Para recuperarla crea una imagen forense y pide ayuda para decodificar los archivos afectados.

Nuestro objetivo es analizar la imagen para extraer artefactos de comunicación, identificar el comportamiento malicioso y descifrar los archivos cifrados por un ransomware dirigido. El laboratorio entrega un archivo `.ad1`, la imagen forense del host de Ethan, para analizarlo con FTK Imager.

- **Plataforma:** CyberDefenders
- **Categoría:** Endpoint Forensics
- **Herramientas:** FTK Imager, Text Editor, SQLite Viewer, Strings, CyberChef
- **Tácticas:** Execution

## La investigación

### El ejecutable que se disfraza de PDF

**Q1.** What is the MD5 hash of the potentially malicious EXE file the user downloaded?

Cargamos el `.ad1` en FTK Imager y navegamos a la carpeta `Downloads` del usuario. Allí encontramos un archivo con doble extensión (`.pdf.exe`). Es una red flag muy relevante: la técnica clásica para ocultar el tipo real de archivo y hacer creer al usuario que abre un PDF legítimo.

Seleccionamos el archivo en FTK Imager y miramos sus propiedades en el panel inferior izquierdo, donde la herramienta calcula y muestra el MD5.

![Propiedades en FTK Imager del archivo IMF-Info.pdf.exe con su hash MD5](https://github.com/user-attachments/assets/edb535db-8b60-47bf-92f2-49bb9976dfc9 "FTK Imager: MD5 del ejecutable descargado")

> **Respuesta:** `336a7cf476ebc7548c93507339196abb`

### El origen de la descarga en Zone.Identifier

**Q2.** What is the URL from which the file was downloaded?

La URL de descarga está en el archivo `Zone.Identifier` asociado al ejecutable. Este metadato de seguridad lo crea Windows automáticamente para rastrear el origen y la zona de cualquier archivo bajado de Internet. Funciona como una "Mark of the Web" (MotW) y permite al sistema aplicar advertencias, como bloquear la ejecución automática de scripts o activar SmartScreen.

Los archivos de Internet reciben `ZoneId=3`, justo el valor presente aquí, lo que confirma una fuente externa. El contenido de `Zone.Identifier` expone la URL completa de origen.

![Contenido de Zone.Identifier con ZoneId=3 y la URL de origen del ejecutable](https://github.com/user-attachments/assets/1b8f7ad5-dbc5-48d5-8bcf-f3ad92455397 "Zone.Identifier: URL de descarga")

> **Respuesta:** `http://192.168.16.128:8000/IMF-Info.pdf.exe`

### Chrome o Edge: quién descargó el archivo

**Q3.** What application did the user use to download this file?

Para identificar el navegador comparamos los historiales de los instalados en el sistema, Chrome y Edge. Los navegadores modernos guardan el historial en bases de datos SQLite, que se pueden abrir con DB Browser for SQLite o SQLite Viewer. Las rutas son:

- Chrome: `C:\Users\<user>\AppData\Local\Google\Chrome\User Data\Default\History`
- Edge: `C:\Users\<user>\AppData\Local\Microsoft\Edge\User Data\Default\History`

En el historial de Chrome la única descarga registrada es el instalador de TeamViewer, así que lo descartamos. En el de Microsoft Edge vemos varias descargas, entre ellas el archivo malicioso `IMF-Info.pdf.exe`.

![Historial de descargas de Chrome con el instalador de TeamViewer como única entrada](https://github.com/user-attachments/assets/12298d37-097c-4ad7-9a2e-052847ce1474 "Chrome: solo la descarga de TeamViewer")

![Historial de descargas de Edge con IMF-Info.pdf.exe entre las descargas registradas](https://github.com/user-attachments/assets/f68aa84e-4958-460e-bfb0-df7eead40efc "Edge: descarga de IMF-Info.pdf.exe")

> **Respuesta:** `Microsoft Edge`

### Tres IPs escondidas en el correo local

**Q4.** By examining Windows Mail artifacts, we found an email address mentioning three IP addresses of servers that are at risk or compromised. What are the IP addresses?

El proceso tiene varias etapas.

Primero examinamos `NTUSER.DAT` del usuario `ethan`. Es el archivo del registro específico de cada usuario: Windows lo carga al iniciar sesión, lo mapea a `HKEY_CURRENT_USER` y persiste en él los cambios al cerrar sesión. Forensemente es muy valioso por el historial detallado de actividad del usuario.

Lo exportamos de la imagen y lo procesamos con RegRipper, dirigiendo la salida a un archivo `Reporte.txt`. En el reporte buscamos la clave UserAssist, con la que Windows registra qué aplicaciones gráficas ejecutó el usuario, cuántas veces y cuándo fue la última ejecución. Encontramos esta entrada:

```text
2025-02-09 22:26:14Z
microsoft.windowscommunicationsapps_8wekyb3d8bbwe!microsoft.windowslive.mail → 16 ejecuciones
```

Esto confirma el uso frecuente de Windows Mail. El siguiente paso es localizar `HxStore.hxd`, el archivo propietario de Windows Mail que guarda en caché local los datos de los correos, en `C:\Users\ethan\AppData\Local\Packages\microsoft.windowscommunicationsapps_8wekyb3d8bbwe\LocalState\HxStore.hxd`.

Lo exportamos y lo cargamos en CyberChef con `Open file as input`. Aplicamos la receta `Extract IP Addresses` con la opción `Unique` para eliminar duplicados. El resultado expone las tres IPs mencionadas en los correos cacheados.

![Receta Extract IP Addresses de CyberChef aplicada sobre HxStore.hxd](https://github.com/user-attachments/assets/4a56f69a-bdce-4d51-9ef7-722bd323503f "CyberChef: extracción de IPs desde HxStore.hxd")

![Resultado único de CyberChef con las tres direcciones IP extraídas del correo](https://github.com/user-attachments/assets/a8fb7a43-b78b-485c-ba74-1851a43263c0 "Las tres IPs extraídas del correo cacheado")

> **Respuesta:** `145.67.29.88, 212.33.10.112, 192.168.16.128`

### El PowerShell ofuscado dentro del ejecutable

**Q5.** By examining the malicious executable, we found that it uses an obfuscated PowerShell script to decrypt specific files. What predefined password does the script use for encryption?

Para analizar el ejecutable sin correrlo, lo extraemos de la imagen y lo cargamos en CyberChef con `Open file as input`. Aplicamos la receta `Strings` para sacar todas las cadenas legibles del binario y buscamos la palabra `PowerShell` en el output. Encontramos un payload claramente ofuscado.

Lo pasamos por CyberChef para identificar el método de ofuscación. Tras probar varias combinaciones, la receta correcta es Reverse + From Base64. El script decodificado revela un ransomware dirigido a dos archivos concretos del sistema de Ethan. Eso indica reconocimiento previo del endpoint: el atacante eligió a mano los archivos de mayor valor. En la primera línea del script se ve la contraseña hardcodeada que cifra los archivos objetivo.

![Receta Strings de CyberChef sobre el ejecutable con el payload de PowerShell ofuscado](https://github.com/user-attachments/assets/7085e74c-4b58-4a80-bb4b-646c107d33ac "Strings del binario: payload de PowerShell ofuscado")

![Script de PowerShell decodificado con Reverse y From Base64 mostrando la contraseña en la primera línea](https://github.com/user-attachments/assets/04e4b21d-8a5b-4496-b38c-919dfe1a9b4e "Script decodificado con la contraseña hardcodeada")

> La contraseña de cifrado va en claro en la primera línea del script. El atacante delata su propia clave.

> **Respuesta:** `Imf!nfo#2025Sec$`

### Descifrar los archivos y llegar a la flag

**Q6.** After identifying how the script works, decrypt the files and submit the secret string.

Con el funcionamiento del ransomware identificado (algoritmo de cifrado, contraseña hardcodeada y archivos objetivo), pedimos a nuestra IA de confianza un script decrypter basado en la lógica inversa del payload analizado.

Al ejecutar el descifrado sobre los archivos cifrados confirmamos que contienen información claramente confidencial de la IMF, lo que prueba que el ataque iba dirigido a activos de alto valor. En el contenido del archivo `IMF-Mission.pdf` descifrado, al final del documento, encontramos la flag que da por resuelto el laboratorio.

![Ejecución del script de descifrado sobre los archivos cifrados](https://github.com/user-attachments/assets/76658b9d-df08-4374-8d2a-ea8d9da0a3fb "Descifrado de los archivos objetivo")

![Contenido de IMF-Mission.pdf descifrado con la flag al final del documento](https://github.com/user-attachments/assets/4447564c-b0f6-407a-80e8-4bbf34258150 "IMF-Mission.pdf descifrado: flag al final")

> **Respuesta:** `CyberDefenders{N3v3r_eX3cuTe_F!l3$_dOwnL0ded_fr0m_M@lic10u5_$erV3r}`

## Reconstrucción del ataque

1. **Artefacto malicioso.** `C:\Users\ethan\Downloads\IMF-Info.pdf.exe` con MD5 `336a7cf476ebc7548c93507339196abb`. La doble extensión `.pdf.exe` es un filename spoofing. `Zone.Identifier` (`ZoneId=3`, Internet) apunta a la URL `http://192.168.16.128:8000/IMF-Info.pdf.exe`.
2. **Navegador.** El historial SQLite de Chrome solo muestra la descarga de TeamViewer. El de Edge confirma la descarga de `IMF-Info.pdf.exe`: Microsoft Edge fue el navegador de la descarga maliciosa.
3. **Correo.** `NTUSER.DAT` (UserAssist) muestra Windows Mail ejecutado 16 veces, la última a las `2025-02-09 22:26:14Z`. `HxStore.hxd` procesado en CyberChef revela las IPs `145.67.29.88`, `212.33.10.112` y `192.168.16.128`.
4. **Payload.** CyberChef Strings localiza un PowerShell ofuscado dentro del ejecutable. Se desofusca con Reverse + From Base64 y resulta ser un ransomware dirigido a dos archivos específicos, con la contraseña hardcodeada `Imf!nfo#2025Sec$`. El reconocimiento previo del endpoint queda implícito en la selección de objetivos.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Initial Access | Phishing: Spearphishing Link | T1566.002 | Descarga inducida del ejecutable malicioso vía URL directa |
| Defense Evasion | Masquerading: Double File Extension | T1036.007 | Archivo `IMF-Info.pdf.exe` con doble extensión para ofuscación |
| Defense Evasion | Obfuscated Files or Information | T1027 | Payload PowerShell ofuscado con Reverse+Base64 |
| Execution | Command and Scripting Interpreter: PowerShell | T1059.001 | Script PowerShell embebido en ejecutable para cifrado de archivos |
| Impact | Data Encrypted for Impact | T1486 | Ransomware dirigido cifra archivos específicos del endpoint |
| Collection | Email Collection: Local Email Collection | T1114.001 | IPs de servidores comprometidos encontradas en caché de Windows Mail |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| Hash MD5 | `336a7cf476ebc7548c93507339196abb` | `IMF-Info.pdf.exe`, ejecutable malicioso |
| Archivo | `IMF-Info.pdf.exe` | Doble extensión; descargado con Microsoft Edge |
| Ruta | `C:\Users\ethan\Downloads\IMF-Info.pdf.exe` | Ubicación del ejecutable en la imagen |
| URL | `http://192.168.16.128:8000/IMF-Info.pdf.exe` | Origen de la descarga según `Zone.Identifier` |
| IP | `192.168.16.128` | Servidor de descarga; también aparece en el correo cacheado |
| IP | `145.67.29.88` | Servidor mencionado en el correo cacheado en `HxStore.hxd` |
| IP | `212.33.10.112` | Servidor mencionado en el correo cacheado en `HxStore.hxd` |
| Credencial | `Imf!nfo#2025Sec$` | Contraseña hardcodeada del ransomware |
| Archivo | `IMF-Mission.pdf` | Documento confidencial cifrado; contiene la flag una vez descifrado |

## Herramientas

- **FTK Imager:** análisis de la imagen `.ad1`, extracción de artefactos y hashes.
- **RegRipper:** extracción y análisis de `NTUSER.DAT` (UserAssist).
- **DB Browser for SQLite:** análisis de los historiales de Chrome y Edge.
- **CyberChef:** extracción de IPs de `HxStore.hxd` y deofuscación del payload.
- **Strings:** extracción de cadenas del binario malicioso.

## Lecciones aprendidas

1. **Doble extensión como red flag.** Implementar reglas de detección para archivos con extensiones compuestas (`.pdf.exe`, `.doc.exe`) en soluciones EDR y filtros de email gateway.
2. **Zone.Identifier como evidencia forense.** Se ignora con frecuencia, pero es evidencia directa del origen de los archivos descargados de Internet, incluida la URL exacta de descarga.
3. **Análisis de HxStore.hxd.** Los artefactos de Windows Mail cacheados localmente (`HxStore.hxd`) pueden contener información crítica sobre comunicaciones internas y C2 incluso cuando los correos originales se eliminan del servidor.
