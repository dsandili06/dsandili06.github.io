import type { Investigation } from "@/types";

const CD_BASE = "https://github.com/dsandili06/Artifakt-Labs/blob/main/Writeups/CyberDefenders/";

export const INVESTIGATIONS: Investigation[] = [
  {
    id: "LAB_001",
    title: "FakeGPT",
    platform: "CyberDefenders",
    summary:
      "Análisis de malware en extensión de navegador que simula ser ChatGPT para interceptar credenciales y sesiones web. Identificación de Image Beacons y exfiltración cifrada.",
    categories: ["Malware Analysis"],
    href: CD_BASE + "FakeGPT.md",
  },
  {
    id: "LAB_002",
    title: "3CX Supply Chain",
    platform: "CyberDefenders",
    summary:
      "Investigación basada en CTI de un instalador oficial comprometido de 3CX. Análisis de payloads maliciosos, técnicas de evasión (T1497) y DLL Side-Loading (T1574).",
    categories: ["Threat Intel"],
    href: CD_BASE + "3CX-Supply%20Chain.md",
  },
  {
    id: "LAB_003",
    title: "Insider",
    platform: "CyberDefenders",
    summary:
      "Forense en imagen de Kali Linux para investigar actividad de una amenaza interna. Análisis de .bash_history, extracción de herramientas ofensivas y trazabilidad de eventos.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "Insider.md",
  },
  {
    id: "LAB_004",
    title: "Kraken Keylogger",
    platform: "CyberDefenders",
    summary:
      "Análisis de un vector inicial LNK distribuido por mensajería web. Reconstrucción de persistencia abusando de software legítimo (Greenshot) y exfiltración de red.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "KrakenKeylogger.md",
  },
  {
    id: "LAB_005",
    title: "Silent Breach",
    platform: "CyberDefenders",
    summary:
      "Investigación de una imagen de disco tras ataque de ransomware. Extracción de artefactos de navegador/correo, deofuscación de script PowerShell y descifrado de evidencia.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "Silent%20Breach.md",
  },
  {
    id: "LAB_006",
    title: "Lockdown",
    platform: "CyberDefenders",
    summary:
      "Análisis forense de red y memoria sobre una intrusión en servidor IIS. Detección de webshells SMB2, persistencia en Startup y análisis de malware AgentTesla ofuscado con UPX.",
    categories: ["Network Forensics", "Endpoint Forensics"],
    href: CD_BASE + "Lockdown.md",
  },
  {
    id: "LAB_007",
    title: "Oski",
    platform: "CyberDefenders",
    summary:
      "Análisis de comportamiento de un infostealer (Oski Stealer). Identificación de C2, uso de sqlite3.dll para robo de credenciales, exfiltración de datos y técnicas de auto-borrado.",
    categories: ["Threat Intel"],
    href: CD_BASE + "Oski.md",
  },
  {
    id: "LAB_008",
    title: "PsExec Hunt",
    platform: "CyberDefenders",
    summary:
      "Investigación sobre el abuso de herramientas legítimas (PsExec) para movimiento lateral. Análisis de tráfico SMB2, shares administrativos (ADMIN$) y extracción de credenciales NTLM.",
    categories: ["Network Forensics"],
    href: CD_BASE + "PsExec-Hunt.md",
  },
  {
    id: "LAB_009",
    title: "RamnIt",
    platform: "CyberDefenders",
    summary:
      "Análisis forense de memoria sobre una infección del gusano bancario Ramnit. Identificación de procesos anómalos (ChromeSetup.exe), geolocalización de C2 y extracción de hashes.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "RamnIt.md",
  },
  {
    id: "LAB_010",
    title: "Red Stealer",
    platform: "CyberDefenders",
    summary:
      "Análisis del malware RedLine Stealer distribuido como wextract.exe. Mapeo de técnicas de recolección de datos (T1005), escalación de privilegios e infraestructura C2.",
    categories: ["Threat Intel"],
    href: CD_BASE + "Red%20Stealer.md",
  },
  {
    id: "LAB_011",
    title: "Web Investigation",
    platform: "CyberDefenders",
    summary:
      "Investigación de un compromiso a servidor web. Detección de SQL Injection, enumeración con GoBuster, bypass de panel de administración y despliegue de webshell.",
    categories: ["Network Forensics"],
    href: CD_BASE + "Web%20Investigation.md",
  },
  {
    id: "LAB_012",
    title: "Brave",
    platform: "CyberDefenders",
    summary:
      "Análisis forense de memoria de host Windows sospechoso de exfiltración. Identificación de conexiones, sesiones web cifradas (T1071.001) y uso de LOLApps. Reconstrucción de actividad vía UserAssist.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "Brave.md",
  },
  {
    id: "LAB_013",
    title: "SysInternals",
    platform: "CyberDefenders",
    summary:
      "Investigación forense de un endpoint Windows comprometido usando la suite Sysinternals. Análisis de artefactos de registro, prefetch y reconstrucción de la cadena de ejecución.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "SysInternals.md",
  },
  {
    id: "LAB_014",
    title: "TheCrime",
    platform: "CyberDefenders",
    summary:
      "Análisis forense de dispositivo Android para investigar un crimen. Recuperación de evidencia borrada, análisis de metadatos de archivos y reconstrucción de actividad del usuario mediante artefactos.",
    categories: ["Android Forensics"],
    href: CD_BASE + "TheCrime.md",
  },
  {
    id: "LAB_015",
    title: "WebStrike",
    platform: "CyberDefenders",
    summary:
      "Análisis de captura de tráfico HTTP tras ataque a aplicación web. Detección de file upload malicioso, despliegue de webshell PHP y extracción de IOCs desde logs de servidor.",
    categories: ["Network Forensics"],
    href: CD_BASE + "WebStrike.md",
  },
];

export const FEATURED_INVESTIGATIONS = ["LAB_001", "LAB_012", "LAB_003"]
  .map((id) => INVESTIGATIONS.find((i) => i.id === id))
  .filter((i): i is Investigation => Boolean(i));
