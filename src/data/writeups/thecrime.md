Una víctima desapareció y las autoridades adquirieron una imagen forense de su teléfono Android. Con ALEAPP reconstruimos su deuda de trading, la amenaza de un acreedor, su última ubicación y un viaje a Las Vegas donde había quedado de verse con un amigo.

## El caso

Una víctima ha desaparecido bajo circunstancias sospechosas. Las autoridades adquirieron una imagen forense de su dispositivo Android y piden al equipo de DFIR un análisis exhaustivo para reconstruir su actividad reciente e identificar sus deudas, ubicación y planes de viaje que permitan determinar el móvil del crimen.

El objetivo es analizar la imagen con ALEAPP para extraer artefactos de aplicaciones instaladas, historial de llamadas, mensajes, caché de fotos y conversaciones de Discord que permitan armar la línea temporal de la víctima. Era la primera vez que usábamos ALEAPP y no revisamos documentación previa. La interfaz de carga de evidencia resultó muy intuitiva y el output en formato web, muy cómodo.

- **Plataforma:** CyberDefenders
- **Categoría:** Mobile Forensics
- **Herramientas:** ALEAPP

## La investigación

### La aplicación de trading

**Q1.** Based on the accounts of the witnesses and individuals close to the victim, it has become clear that the victim was interested in trading. This has led him to invest all of his money and acquire debt. Can you identify the SHA256 of the trading application the victim primarily used on his phone?

En la sección Installed Apps (GMS) de ALEAPP vemos el listado completo de aplicaciones instaladas en el dispositivo (5 entradas). Una tiene Bundle ID `com.ticno.olymptrade`, correspondiente a la plataforma de trading OlympTrade. La columna SHA-256 Hash muestra directamente el hash del APK instalado.

![Sección Installed Apps de ALEAPP con OlympTrade y su hash SHA-256](https://github.com/user-attachments/assets/6c9a3577-c232-4679-99e2-4d02e2c3d19e "Aplicaciones instaladas según ALEAPP")

> **Respuesta:** `4f168a772350f283a1c49e78c1548d7c2c6c05106d8b9feb825fdc3466e9df3c`

### El monto de la deuda

**Q2.** According to the testimony of the victim's best friend, he said, "While we were together, my friend got several calls he avoided. He said he owed the caller a lot of money but couldn't repay now". How much does the victim owe this person?

En la sección SMS messages de ALEAPP hay un único mensaje SMS recibido el 2023-09-20 20:09:49. Su contenido es una amenaza extorsiva explícita del acreedor hacia la víctima: *"It's time for you to pay back the money you owe me, but you're not picking up my calls. You better think twice about not paying, because it won't end well for you. Prepare the sum of 250,000 EGP, and I'll expect your call within an hour at most."* El monto de la deuda queda explícito en el cuerpo del mensaje.

![Sección SMS messages de ALEAPP con el mensaje extorsivo recibido](https://github.com/user-attachments/assets/af81daed-bee2-48c1-bf41-f885349e3076 "SMS de amenaza en ALEAPP")

![Detalle del cuerpo del SMS con el monto exigido](https://github.com/user-attachments/assets/c5037582-b9eb-406a-8c43-a07a6fba806e "Contenido completo del SMS con el monto de la deuda")

> **Respuesta:** `250000`

### Poner nombre al acreedor

**Q3.** What is the name of the person to whom the victim owes money?

Correlacionamos el número remitente del SMS amenazante (`+201172137258`) con la sección Contacts de ALEAPP. Ese número pertenece al contacto guardado en la agenda de la víctima como **Shady Wahab**. Cruzar el SMS con la agenda establece la identidad del acreedor.

![Sección Contacts de ALEAPP con el número +201172137258 asociado a Shady Wahab](https://github.com/user-attachments/assets/cb770373-b49d-4ef4-ae82-40b890c85869 "Contacto que coincide con el remitente del SMS")

> **Respuesta:** `Shady Wahab`

### Dónde estaba la víctima

**Q4.** Based on the statement from the victim's family, they said that on September 20, 2023, he departed from his residence without informing anyone of his destination. Where was the victim located at that moment?

En la sección Recent Activity de ALEAPP vemos que la última aplicación con actividad registrada fue `com.google.android.apps.maps` con `Last_Time_Moved: 2023-09-20 23:50:29`. El snapshot asociado muestra la pantalla de Google Maps con la ubicación activa de la víctima: The Nile Ritz-Carlton, Cairo.

![Recent Activity de ALEAPP con la última actividad de Google Maps](https://github.com/user-attachments/assets/f142f12d-7455-4553-bf8e-c80f1c9f7840 "Última actividad registrada: Google Maps")

![Snapshot de Google Maps con la ubicación de la víctima](https://github.com/user-attachments/assets/766d55ae-7f81-4f0f-b4f0-77730ce3b2ad "Snapshot de Maps mostrando The Nile Ritz-Carlton, Cairo")

> **Respuesta:** `The Nile Ritz-Carlton`

### El destino del viaje

**Q5.** The detective continued his investigation by questioning the hotel lobby. She informed him that the victim had reserved the room for 10 days and had a flight scheduled thereafter. The investigator believes that the victim may have stored his ticket information on his phone. Look for where the victim intended to travel.

En la sección Google Photos - Cache de ALEAPP encontramos una imagen en caché de un boarding pass de Egypt Airlines. El artefacto es valioso porque persiste en caché aunque el usuario haya eliminado la imagen original de su galería. El ticket muestra los detalles del viaje: vuelo 310, fecha 01/10/2023, horario 09:00 AM, Gate 08, Seat 20, origen Cairo y destino **Las Vegas**.

![Sección Google Photos - Cache de ALEAPP con la imagen del boarding pass](https://github.com/user-attachments/assets/a907211b-3101-47c9-86c4-c75782014af3 "Caché de Google Photos con el boarding pass")

![Boarding pass de Egypt Airlines con destino Las Vegas](https://github.com/user-attachments/assets/26d5bbd2-33b0-4ba5-90fb-dd7f821a9c8e "Boarding pass del vuelo 310 de Egypt Airlines")

> **Respuesta:** `Las Vegas`

### El punto de encuentro

**Q6.** After examining the victim's Discord conversations, we discovered he had arranged to meet a friend at a specific location. Can you determine where this meeting was supposed to occur?

En la sección Discord Chats de ALEAPP encontramos una conversación entre los usuarios `infern0_o` y `rob1ns0n`. En el segundo mensaje, `rob1ns0n` responde: *"What a wonderful news! We'll meet at **The Mob Museum**. I'll await your call when you arrive. Enjoy your flight bro"*. El punto de encuentro queda confirmado explícitamente en el contenido del mensaje.

![Conversación de Discord entre infern0_o y rob1ns0n en ALEAPP](https://github.com/user-attachments/assets/801fa45a-1503-4a09-ab56-4e96010da5f7 "Chat de Discord que fija el punto de encuentro")

> **Respuesta:** `The Mob Museum`

## Reconstrucción del ataque

El caso se resolvió cruzando seis fuentes del dispositivo:

1. **Aplicación de trading.** `com.ticno.olymptrade` (OlympTrade) con SHA-256 `4f168a772350f283a1c49e78c1548d7c2c6c05106d8b9feb825fdc3466e9df3c`. Es la plataforma responsable de las deudas de la víctima.
2. **Deuda y acreedor.** Un SMS de `+201172137258` exige 250,000 EGP. En Contacts, ese número es Shady Wahab. La correlación identifica al acreedor por nombre y número.
3. **Geolocalización.** Recent Activity muestra `com.google.android.apps.maps` con `Last_Time_Moved: 2023-09-20 23:50:29` y un snapshot en The Nile Ritz-Carlton, Cairo: la última ubicación conocida el día de la desaparición.
4. **Plan de viaje.** El boarding pass de Egypt Airlines en el caché de Google Photos: vuelo 310, fecha 01/10/2023, hora 09:00 AM, de Cairo a Las Vegas, con una reserva de hotel de 10 días antes de la partida.
5. **Punto de encuentro.** El chat de Discord entre `infern0_o` y `rob1ns0n` confirma The Mob Museum en Las Vegas.

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| Hash SHA256 | `4f168a772350f283a1c49e78c1548d7c2c6c05106d8b9feb825fdc3466e9df3c` | APK de OlympTrade, `com.ticno.olymptrade` |
| Teléfono | `+201172137258` | Remitente del SMS extorsivo, contacto Shady Wahab |
| Cuenta | `infern0_o` | Usuario de Discord de la víctima en el chat |
| Cuenta | `rob1ns0n` | Interlocutor en Discord que fija el punto de encuentro |

## Herramientas

- **ALEAPP:** Installed Apps, SMS Messages, Contacts, Recent Activity, Google Photos Cache y Discord Chats.

## Lecciones aprendidas

1. **Google Photos Cache como evidencia forense.** El directorio `disk_cache` de Google Photos conserva imágenes aunque el usuario las haya eliminado de su galería. Es una fuente frecuentemente ignorada que puede contener boarding passes, documentos fotografiados y capturas de pantalla.
2. **Correlación de artefactos múltiples.** La reconstrucción requirió correlacionar seis fuentes distintas (Installed Apps, SMS, Contacts, Recent Activity, Google Photos, Discord). Ningún artefacto era suficiente por sí solo.
3. **SMS como evidencia de amenaza directa.** Los mensajes almacenados en `mmssms.db` son evidencia directa de extorsión. Su contenido, timestamp y número de remitente son determinantes para establecer móvil y autoría.
