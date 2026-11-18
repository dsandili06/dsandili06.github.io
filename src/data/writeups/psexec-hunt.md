Un IDS alertó sobre movimiento lateral con PsExec. En el PCAP seguimos al atacante desde `10.0.0.130` hasta Sales-PC y Marketing-PC, con credenciales NTLM del usuario `ssales` y el servicio `PSEXESVC.exe` instalado en `ADMIN$`.

## El caso

El IDS alertó actividad sospechosa de lateral movement mediante PsExec. El objetivo es rastrear las actividades del atacante, identificar el punto de entrada, las máquinas comprometidas y los indicadores clave de sus tácticas. Recibimos un archivo `.PCAP` y lo analizamos con Wireshark para identificar el movimiento lateral, los sistemas comprometidos, las credenciales y los shares administrativos utilizados.

Antes de empezar conviene entender PsExec y SMB, los pilares de este escenario. **PsExec** es una utilidad de línea de comandos de Microsoft Sysinternals que permite a los administradores ejecutar procesos de forma remota en máquinas de una red sin instalar software adicional, utilizando credenciales de administrador.

Se integra nativamente con el protocolo **Server Message Block (SMB)**, específicamente en los puertos TCP **445** (y tradicionalmente **139**), para establecer canales de comunicación. Este protocolo permite copiar el ejecutable `PSEXESVC.exe` (un servicio de Windows) al recurso compartido administrativo oculto **ADMIN$** del sistema remoto, donde se instala y ejecuta para procesar los comandos. Además usa **Named Pipes** y llamadas **MSRPC** (como SVCCTL) para iniciar el servicio, redirigir la entrada/salida de consola y eliminar el ejecutable al finalizar la tarea.

- **Plataforma:** CyberDefenders
- **Categoría:** Network Forensics
- **Herramientas:** Wireshark
- **Tácticas:** Execution, Defense Evasion, Discovery, Lateral Movement

## La investigación

### El origen del movimiento lateral

**Q1.** To effectively trace the attacker's activities within our network, can you identify the IP address of the machine from which the attacker initially gained access?

Como primer paso siempre recomendamos revisar Statistics, Conversations, que da información relevante sobre el escenario general. Aquí vemos un gran volumen de intercambio de datos entre dos IPs.

![Statistics Conversations en Wireshark con alto volumen entre dos IPs](https://github.com/user-attachments/assets/84cb6e3b-8629-406a-8898-b64e8a6ed125 "Conversaciones de red con volumen anómalo entre dos hosts")

Aplicamos el filtro:

```text
ip.src == (ip sospechosa) && smb2
```

Vemos claramente el inicio de la conversación: **Create Request**, **File PSEXECSVC.EXE**, la creación del archivo `.key` y demás información que confirma el origen del ataque.

![Paquetes SMB2 con Create Request de PSEXECSVC.EXE y creación del archivo .key](https://github.com/user-attachments/assets/c733cb89-926b-4e22-adfe-61598ec96572 "Inicio de la conversación SMB2 filtrada por la IP origen")

> **Respuesta:** `10.0.0.130`

### El primer salto

**Q2.** To fully understand the extent of the breach, can you determine the machine's hostname to which the attacker first pivoted?

Siguiendo la conversación identificada, visualizamos directamente el nombre del host objetivo. También aplicamos Follow, TCP Stream sobre los paquetes SMB relevantes y vemos en texto claro el nombre del host al que el atacante hizo el pivoting.

![TCP Stream SMB con el nombre del host objetivo en texto claro](https://github.com/user-attachments/assets/2b70021f-082b-4906-a677-bc9b3cb0ed43 "Nombre del primer host objetivo en el TCP Stream")

> **Respuesta:** `Sales-PC`

### Credenciales en la negociación NTLM

**Q3.** What is the username utilized by the attacker for authentication?

En el mismo TCP Stream vemos el usuario que el atacante ingresó para autenticarse contra el host objetivo, expuesto en texto claro dentro de los paquetes de negociación NTLM.

![TCP Stream con el usuario de la autenticación NTLM en texto claro](https://github.com/user-attachments/assets/aa286e4d-6720-4a8c-980e-80b9266fd280 "Usuario expuesto en la negociación NTLM")

> **Respuesta:** `ssales`

### El servicio instalado en el objetivo

**Q4.** What's the name of the service executable the attacker set up on the target?

Como vimos en el funcionamiento de PsExec, la herramienta instala en el host objetivo el servicio `PSEXESVC.exe` para ejecutar comandos de forma remota. La conversación SMB lo confirma con un **Create Request, File: PSEXESVC.exe** dirigido al sistema comprometido.

![Create Request de PSEXESVC.exe hacia el sistema comprometido](https://github.com/user-attachments/assets/a015f3e3-a366-4677-a110-361bee8f24eb "Create Request del ejecutable PSEXESVC.exe en SMB")

> **Respuesta:** `PSEXESVC`

### El share que recibe el binario

**Q5.** Which network share was used by PsExec to install the service on the target machine?

En la misma conversación inicial entre atacante y objetivo, dentro del **Create Request**, vemos que `PSEXESVC.exe` se crea en el share **ADMIN$**. Esto concuerda con el comportamiento documentado de PsExec para instalar su servicio de forma remota.

![Create Request con PSEXESVC.exe creado en el share ADMIN$](https://github.com/user-attachments/assets/388afcec-5bfa-40bc-b327-b737bfc6028e "PSEXESVC.exe creado en ADMIN$")

> **Respuesta:** `ADMIN$`

### El canal de comunicación

**Q6.** Which network share did PsExec use for communication?

Antes de conectar con ADMIN$, el flujo de paquetes muestra que el atacante establece primero una conexión al share **IPC$**. PsExec lo usa para abrir el canal de comunicación vía Named Pipes y llamadas MSRPC.

![Conexión al share IPC$ previa a la conexión con ADMIN$](https://github.com/user-attachments/assets/9240fc73-151f-4c66-b4d9-0005f7cacb9b "Conexión inicial al share IPC$")

> **Respuesta:** `IPC$`

### El segundo objetivo

**Q7.** What is the hostname of the second machine the attacker targeted to pivot within our network?

Para identificar el segundo objetivo filtramos los NTLM Challenges en Wireshark y analizamos las requests con Follow, TCP Stream. El atacante replicó exactamente el mismo método de acceso. Como alternativa, filtrando por paquetes SMB identificamos otro intento de comunicación con un host distinto, al que también aplicamos Follow, TCP Stream para extraer el hostname solicitado.

![TCP Stream de la segunda autenticación con el hostname del segundo objetivo](https://github.com/user-attachments/assets/222a4dd6-19c0-4944-bfd3-86f01eefa080 "Hostname del segundo objetivo en el TCP Stream")

> **Respuesta:** `Marketing-PC`

## Reconstrucción del ataque

1. **Reconocimiento del tráfico.** Statistics, Conversations muestra un volumen de datos anómalo entre `10.0.0.130` y hosts internos. Aplicamos el filtro `ip.src == 10.0.0.130 && smb2`.
2. **Movimiento lateral.** Flujo de PsExec observado: `10.0.0.130` hacia Sales-PC (ADMIN$) con `PSEXESVC.exe` instalado, y `10.0.0.130` hacia Marketing-PC con el mismo método replicado. Autenticación NTLM con credenciales `ssales`.
3. **Shares y canales.** IPC$ es el canal inicial (Named Pipes, MSRPC, SVCCTL). ADMIN$ recibe la instalación de `PSEXESVC.exe`. El protocolo es SMB2 sobre TCP 445.
4. **Línea temporal.** Pivot 1: `10.0.0.130` hacia Sales-PC (user: `ssales`). Pivot 2: `10.0.0.130` hacia Marketing-PC (mismo método). IOC: `PSEXESVC.exe` en ADMIN$ de ambos hosts.

## MITRE ATT&CK

| Táctica | Técnica | ID | Evidencia |
|---------|---------|----|-----------|
| Execution | Remote Services: SMB/Windows Admin Shares | T1021.002 | PsExec ejecuta comandos remotos via SMB/ADMIN$ |
| Lateral Movement | Remote Services: SMB/Windows Admin Shares | T1021.002 | Pivoting de Sales-PC a Marketing-PC |
| Defense Evasion | Use Alternate Authentication Material | T1550 | Reutilización de credenciales NTLM (ssales) |
| Discovery | Network Share Discovery | T1135 | Enumeración de shares IPC$ y ADMIN$ |
| Execution | System Services: Service Execution | T1569.002 | PSEXESVC.exe instalado como servicio remoto |
| Credential Access | Brute Force: Password Spraying | T1110.003 | Autenticación NTLM con credenciales comprometidas |

## Indicadores de compromiso

| Tipo | Indicador | Contexto |
|------|-----------|----------|
| IP | `10.0.0.130` | Origen del movimiento lateral |
| Host | `Sales-PC` | Primer host objetivo |
| Host | `Marketing-PC` | Segundo host objetivo |
| Cuenta | `ssales` | Usuario usado en la autenticación NTLM |
| Archivo | `PSEXESVC.exe` | Servicio de PsExec instalado en ADMIN$ de ambos hosts |
| Share | `ADMIN$` | Instalación del servicio |
| Share | `IPC$` | Canal de comunicación (Named Pipes, MSRPC) |

## Herramientas

- **Wireshark:** análisis del PCAP y filtrado SMB2.
- **Statistics, Conversations:** vista general del tráfico.
- **Follow, TCP Stream:** extracción de credenciales en texto claro.

## Lecciones aprendidas

1. **Statistics, Conversations primero.** Es el primer paso para identificar hosts con volumen de tráfico anómalo en cualquier PCAP.
2. **Detección de PsExec.** Monitorear la creación de `PSEXESVC.exe` en `ADMIN$` y el tráfico SMB2 sobre TCP 445 entre hosts internos.
3. **Desafíos NTLM.** Seguir los TCP Streams de autenticación NTLM para extraer credenciales y hostnames comprometidos.
