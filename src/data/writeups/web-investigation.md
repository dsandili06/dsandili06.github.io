BookWorld, un e-commerce de libros, reporta un pico de consultas a la base de datos y de uso de recursos. Analizamos el PCAP y seguimos al atacante desde un barrido de GET requests hasta una SQL injection en `search.php`, un panel `/admin/` y un webshell subido, `NVri2vhp.php`.

## El caso

BookWorld, un e-commerce de libros, reporta un spike en queries a la base de datos y en el uso de recursos. Una alerta automatizada indica actividad maliciosa en el tráfico de red.

El laboratorio entrega un PCAP para analizar el compromiso del servidor web. Nuestro objetivo es analizarlo con Wireshark para identificar la SQLi, las credenciales del atacante, el malware subido y los directorios expuestos.

- **Plataforma:** CyberDefenders
- **Categoría:** Network Forensics
- **Herramientas:** Wireshark, NetworkMiner
- **Tácticas:** Initial Access, Persistence, Command and Control

## La investigación

### La IP del atacante

**Q1.** By knowing the attacker's IP, we can analyze all logs and actions related to that IP. Can you provide the attacker's IP?

Siguiendo el nombre del laboratorio, "Web Investigation", filtramos las conversaciones HTTP. Observamos un volumen masivo de GET requests desde `111.224.250.131`.

![Conversaciones HTTP en Wireshark con un volumen masivo de GET requests desde una única IP](https://github.com/user-attachments/assets/dbe31eed-9a78-4ae2-a788-40298f3654fc "Conversaciones HTTP: volumen masivo de GET requests")

> **Respuesta:** `111.224.250.131`

### De dónde viene el tráfico

**Q2.** If the geographical origin of an IP address is known to be from a region that has no business traffic, this can be an indicator of a targeted attack. Can you determine the origin city of the attacker?

Con WhatIsMyIPAddress consultamos la IP maliciosa e identificamos su origen geográfico.

![Resultado de geolocalización de la IP maliciosa en WhatIsMyIPAddress](https://github.com/user-attachments/assets/bfc43e89-8e5d-4ffb-beb3-318f481611bf "WhatIsMyIPAddress: origen de la IP atacante")

> **Respuesta:** `Shijiazhuang`

### El script vulnerable

**Q3.** Identifying the exploited script allows security teams to understand exactly which vulnerability was used. Can you provide the vulnerable PHP script name?

En las primeras interacciones de la IP maliciosa con el servidor web vemos que, después del request a "search.php", empiezan las peticiones comprometedoras.

![Primeras peticiones de la IP maliciosa en Wireshark seguidas por request a search.php](https://github.com/user-attachments/assets/68a2b322-60e4-4f67-bec0-6d57bc5cb249 "Primeras interacciones con search.php")

> **Respuesta:** `search.php`

### El primer intento de SQL injection

**Q4.** Establishing the timeline of an attack, what is the complete request URI of the first SQLi attempt by the attacker?

En las peticiones posteriores a la del script vulnerable hay un intento de SQLi para probar parámetros vulnerables en el servidor. Si limpiamos el payload ("%20" se traduce a " ") encontramos la respuesta.

![Request con el primer intento de SQLi contra search.php en Wireshark](https://github.com/user-attachments/assets/555162bb-ccba-4c9d-8532-7fc76ee765f6 "Primer intento de SQLi contra search.php")

> **Respuesta:** `/search.php?search=book and 1=1; -- -`

### Enumerando las bases de datos del servidor

**Q5.** Can you provide the complete request URI that was used to read the web server's available databases?

Para encontrar la URI hay que buscar patrones del reconocimiento de DB, como "schema" o "information_schema", por ejemplo `SELECT schema_name FROM information_schema.schemata`. Al aplicar esos filtros a los paquetes, vemos que el paquete 1525 lista todas las DB disponibles del servidor.

![Filtro por information_schema en Wireshark que localiza el paquete 1525](https://github.com/user-attachments/assets/bb92c51d-db0f-4a3a-9788-daa5167844f7 "Búsqueda de information_schema en los paquetes")

![Detalle del paquete 1525 con la lista de bases de datos del servidor](https://github.com/user-attachments/assets/ba67bfd3-7cd0-4551-ab19-5ba23d397923 "Paquete 1525: bases de datos listadas")

> **Respuesta:** `/search.php?search=book' UNION ALL SELECT NULL,CONCAT(0x7178766271,JSON_ARRAYAGG(CONCAT_WS(0x7a76676a636b,schema_name)),0x7176706a71) FROM INFORMATION_SCHEMA.SCHEMATA-- -`

### La tabla con los datos de usuarios

**Q6.** What's the table name containing the website users data?

Con la sintaxis de SQL en mente, buscamos directamente los frames que contengan "table_name". Al hacer un Follow HTTP Stream del segundo paquete encontrado, vemos con claridad que se lista la tabla `Customers`.

![Frames con table_name filtrados en Wireshark](https://github.com/user-attachments/assets/85cf449c-f932-4976-b8be-a07818f27dff "Frames que contienen table_name")

![Follow HTTP Stream con la tabla Customers listada](https://github.com/user-attachments/assets/d34c3b30-1a71-4157-892e-d9a034bdc390 "HTTP Stream: tabla Customers")

> **Respuesta:** `customers`

### GoBuster descubre el directorio oculto

**Q7.** The website directories hidden from the public could serve as unauthorized access. Can you provide the name of the directory discovered by the attacker?

Al ir a Statistics → HTTP → Requests vemos una cantidad exorbitante de requests del atacante. Es claramente un intento de enumeración de directorios web, y por el User-Agent se trata de la conocida herramienta "GoBuster".

Con la respuesta de la pregunta anterior aplicamos el filtro `http.request.method==POST` y vemos al atacante interactuando con el directorio "/admin/".

![Statistics HTTP Requests en Wireshark con la enumeración masiva de directorios](https://github.com/user-attachments/assets/1391a5c4-b2aa-4557-a483-6b020e48c2a7 "Statistics → HTTP → Requests: enumeración de directorios")

![Filtro POST en Wireshark con el atacante interactuando con el directorio /admin/](https://github.com/user-attachments/assets/6e16c15f-b41b-4122-b8c9-138ec6c04076 "POST requests hacia /admin/")

> **Respuesta:** `/admin/`

### Credenciales del panel de administración

**Q8.** Knowing which credentials were used allows us to determine the extent of account compromise. What are the credentials used by the attacker for logging in?

Tras buscar la línea de tiempo para correlacionar con el resultado anterior, vemos que el atacante encontró las credenciales para iniciar sesión desde el panel de Admin.

![Petición de login al panel de administración con las credenciales del atacante](https://github.com/user-attachments/assets/452e7ffa-e8f7-47c3-abad-0e1b0e1284b6 "Login del atacante en el panel de administración")

> **Respuesta:** `admin:admin123!`

### El webshell que cierra la intrusión

**Q9.** We need to determine if the attacker gained further access. What's the name of the malicious script uploaded by the attacker?

Tras iniciar sesión, el atacante envía un POST request en el paquete N°88757. Con un Follow HTTP Stream vemos que subió un archivo en `index.php`.

![Follow HTTP Stream del paquete 88757 con el archivo subido por el atacante en index.php](https://github.com/user-attachments/assets/f5a8f30a-219b-4bf5-8ab7-fec075a8613f "POST de subida del script malicioso")

> **Respuesta:** `NVri2vhp.php`

## Reconstrucción del ataque

1. **Identificación del atacante.** En Statistics → Conversations (Packets), la IP sospechosa es `111.224.250.131` (Shijiazhuang, China), con unos 1000+ requests en minutos.
2. **SQL injection.** El paquete inicial lleva a `/search.php?search=book and 1=1; -- -`. El paquete 1525 es la enumeración de DB (information_schema) y la tabla objetivo es `customers`, con los datos de usuarios.
3. **Enumeración y acceso administrativo.** Se detecta GoBuster por el User-Agent. El directorio `/admin/` responde 200 OK y el atacante entra con las credenciales `admin:admin123!`.
4. **Persistencia vía webshell.** Sube `NVri2vhp.php` en el paquete 88757. La ubicación probable es `/admin/index.php`.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Persistence | Server Software Component: Web Shell | T1505.003 | Subida de `NVri2vhp.php` en el paquete 88757 |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| IP | `111.224.250.131` | IP del atacante (Shijiazhuang, China) |
| Archivo | `NVri2vhp.php` | Webshell subido por el atacante |
| Ruta | `/search.php` | Script vulnerable a SQLi |
| Ruta | `/admin/` | Directorio descubierto con GoBuster |
| Cuenta | `admin:admin123!` | Credenciales usadas para entrar al panel de administración |
| User-Agent | GoBuster | Herramienta de enumeración de directorios |

## Herramientas

- **Wireshark:** análisis del PCAP y de los HTTP streams.
- **NetworkMiner:** análisis complementario del PCAP.
- **WhatIsMyIPAddress:** geolocalización de la IP.

## Lecciones aprendidas

1. **Detección de SQLi.** Monitorear `UNION SELECT` e `information_schema` en los web logs.
2. **Enumeración de directorios.** Bloquear los User-Agents de GoBuster y aplicar rate limiting.
3. **Búsqueda de webshells.** Usar regex para nombres PHP aleatorios (`^[A-Z]{8}\.php$`).
