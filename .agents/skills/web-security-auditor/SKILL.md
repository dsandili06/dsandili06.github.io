---
name: web-security-auditor
description: >-
  Auditoría continua de seguridad en frontend, Content Security Policy (CSP), sanitización y OWASP.
  Usar al revisar la seguridad del código, configurar políticas de CSP en index.html, validar renderizado
  seguro de Markdown, auditar CDNs permitidos o evaluar riesgos de inyección y XSS en componentes.
---

# Web Security Auditor: Blindaje Frontend & OWASP Best Practices

Esta skill guía la evaluación continua de la postura de seguridad del portafolio, garantizando que el sitio de un analista de ciberseguridad cumpla los estándares más rigurosos de protección web.

---

## 1. Content Security Policy (CSP) Estricta

El archivo `index.html` debe mantener directivas CSP defensivas sin relajar la protección innecesariamente:

### Directivas Esenciales:
- `default-src 'self'`: Bloqueo por defecto de cualquier origen desconocido.
- `script-src 'self'`: Solo permitir scripts empaquetados localmente. Evitar `'unsafe-eval'`.
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`: Permitir estilos en línea necesarios para Tailwind y fuentes oficiales.
- `img-src 'self' data: https: blob:`: Permitir imágenes locales, esquemas de datos y CDNs seguros previamente validados.
- `frame-src 'self' https://assets.tryhackme.com`: Restringir estrictamente los orígenes que pueden ser embebidos en iframes (ej. badges o recursos de TryHackMe).
- `object-src 'self'`: Proteger contra ejecución arbitraria de plugins u objetos embebidos.
- `base-uri 'self'`: Prevenir ataques de inyección de etiqueta `<base>`.

---

## 2. Sanitización y Renderizado Seguro de Markdown

Al renderizar contenido dinámico o writeups mediante Markdown:
- **Prevención de XSS:** Nunca renderizar HTML crudo con `dangerouslySetInnerHTML` sin pasar previamente por un sanitizador estricto (ej. `DOMPurify`).
- **Validación de URLs de Imágenes (`resolveImageUri`):**
  - Solo resolver imágenes que pertenezcan a dominios verificados (`user-attachments.githubusercontent.com`, `camo.githubusercontent.com`, `raw.githubusercontent.com`, buckets S3 oficiales).
  - Rechazar esquemas maliciosos como `javascript:`, `data:text/html` o `vbscript:`.

---

## 3. Enlaces Externos Seguros

Cualquier enlace externo (`<a href="..." target="_blank">`) **debe incluir obligatoriamente**:
```html
rel="noopener noreferrer"
```
Esto previene ataques de **Tabnabbing** inverso donde la página externa podría manipular `window.opener.location`.

---

## 4. Checklist de Auditoría de Seguridad (Pre-despliegue)

- [ ] ¿Hay secretos, tokens de API o credenciales expuestas en el repositorio o en los archivos estáticos de `public/`?
- [ ] ¿La CSP de `index.html` está libre de directivas excesivamente permisivas (`*` o `'unsafe-inline'` en scripts)?
- [ ] ¿Los modales de previsualización (certificados, writeups) previenen la ejecución de scripts no confiables?
- [ ] ¿Las dependencias en `package.json` están libres de vulnerabilidades conocidas (`npm audit` / `bun pm audit`)?
