import type { Investigation } from "@/types";

const CD_BASE = "https://github.com/dsandili06/Artifakt-Labs/blob/main/Writeups/CyberDefenders/";

export const INVESTIGATIONS: Investigation[] = [
  {
    id: "LAB_001",
    title: "FakeGPT",
    slug: "fakegpt",
    platform: "CyberDefenders",
    summary:
      'Una extensión "ChatGPT" falsa roba credenciales, registra teclas y exfiltra con un Image Beacon cifrado, mientras evade sandboxes con checks anti-análisis.',
    categories: ["Malware Analysis"],
    href: CD_BASE + "FakeGPT.md",
    visual: {
      src: "/investigations/fakegpt-concept.svg",
      alt: "Ilustración conceptual: una extensión falsa captura credenciales y las envía mediante un beacon cifrado",
      caption: "Ilustración conceptual · extensión falsa y exfiltración mediante Image Beacon",
    },
  },
  {
    id: "LAB_002",
    title: "3CX Supply Chain",
    slug: "3cx-supply-chain",
    platform: "CyberDefenders",
    summary:
      "Un MSI troyanizado de 3CX deja DLLs con DLL Side-Loading, RC4 y evasión de VMware; la atribución apunta a Lazarus mediante VirusTotal y threat intel.",
    categories: ["Threat Intel"],
    href: CD_BASE + "3CX-Supply%20Chain.md",
  },
  {
    id: "LAB_003",
    title: "Insider",
    slug: "insider",
    platform: "CyberDefenders",
    summary:
      "En la imagen de disco de una workstation Kali de Karen reconstruimos Mimikatz, un archivo secreto, binwalk, Flightsim y una escalación con su desde postgres.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "Insider.md",
  },
  {
    id: "LAB_004",
    title: "Kraken Keylogger",
    slug: "kraken-keylogger",
    platform: "CyberDefenders",
    summary:
      "Un ZIP enviado por Telegram Web, un LNK que persiste vía Greenshot y unos 2.8 GB exfiltrados por AnyDesk hacia 77.232.122.31 en un endpoint comprometido.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "KrakenKeylogger.md",
  },
  {
    id: "LAB_005",
    title: "Silent Breach",
    slug: "silent-breach",
    platform: "CyberDefenders",
    summary:
      "Un ejecutable disfrazado de PDF (IMF-Info.pdf.exe) cifra archivos de la IMF con un PowerShell ofuscado; recuperamos la clave y desciframos los datos.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "Silent%20Breach.md",
  },
  {
    id: "LAB_006",
    title: "Lockdown",
    slug: "lockdown",
    platform: "CyberDefenders",
    summary:
      "Un web shell subido por SMB a un IIS abre una reverse shell por el puerto 4443 desde w3wp.exe y deja un AgentTesla empaquetado con UPX.",
    categories: ["Network Forensics", "Endpoint Forensics"],
    href: CD_BASE + "Lockdown.md",
  },
  {
    id: "LAB_007",
    title: "Oski",
    slug: "oski",
    platform: "CyberDefenders",
    summary:
      "A partir de un hash analizamos un stealer tipo Oski: roba credenciales de navegadores, las exfiltra por POST a su C2 y se autoelimina a los 5 segundos.",
    categories: ["Threat Intel"],
    href: CD_BASE + "Oski.md",
  },
  {
    id: "LAB_008",
    title: "PsExec Hunt",
    slug: "psexec-hunt",
    platform: "CyberDefenders",
    summary:
      "Rastreamos en un PCAP el movimiento lateral con PsExec desde 10.0.0.130 hacia Sales-PC y Marketing-PC usando credenciales NTLM de ssales.",
    categories: ["Network Forensics"],
    href: CD_BASE + "PsExec-Hunt.md",
  },
  {
    id: "LAB_009",
    title: "RamnIt",
    slug: "ramnit",
    platform: "CyberDefenders",
    summary:
      "Con Volatility 3 aislamos ChromeSetup.exe en un dump de memoria, extrajimos IP y dominio C2, calculamos su SHA1 y lo enriquecimos en VirusTotal como Ramnit.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "RamnIt.md",
  },
  {
    id: "LAB_010",
    title: "Red Stealer",
    slug: "red-stealer",
    platform: "CyberDefenders",
    summary:
      "Desde un solo hash en VirusTotal, MalwareBazaar y ThreatFox identificamos wextract.exe como Redline Stealer y extrajimos su C2, TTPs e IOCs.",
    categories: ["Threat Intel"],
    href: CD_BASE + "Red%20Stealer.md",
  },
  {
    id: "LAB_011",
    title: "Web Investigation",
    slug: "web-investigation",
    platform: "CyberDefenders",
    summary:
      "Desde un barrido de GET requests hasta una SQLi en search.php, el panel /admin/ y el webshell NVri2vhp.php en el servidor web de BookWorld.",
    categories: ["Network Forensics"],
    href: CD_BASE + "Web%20Investigation.md",
  },
  {
    id: "LAB_012",
    title: "Brave",
    slug: "brave",
    platform: "CyberDefenders",
    summary:
      "Análisis de un dump de memoria Windows con Volatility 3 y HxD: procesos, conexiones establecidas, archivos abiertos y tiempo de uso de Brave.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "Brave.md",
  },
  {
    id: "LAB_013",
    title: "SysInternals",
    slug: "sysinternals",
    platform: "CyberDefenders",
    summary:
      "Un falso SysInternals.exe de la familia Rozena instala un servicio falso de VMware y manipula el archivo hosts; lo reconstruimos con Amcache, ShimCache y PSReadLine.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "SysInternals.md",
  },
  {
    id: "LAB_014",
    title: "TheCrime",
    slug: "thecrime",
    platform: "CyberDefenders",
    summary:
      "Con ALEAPP reconstruimos la deuda de trading, la amenaza del acreedor, la última ubicación y el viaje a Las Vegas de una víctima desaparecida.",
    categories: ["Android Forensics"],
    href: CD_BASE + "TheCrime.md",
  },
  {
    id: "LAB_015",
    title: "WebStrike",
    slug: "webstrike",
    platform: "CyberDefenders",
    summary:
      "En un PCAP seguimos un file upload con doble extensión, un reverse shell Netcat al puerto 8080 y la exfiltración de /etc/passwd en shoporoma.com.",
    categories: ["Network Forensics"],
    href: CD_BASE + "WebStrike.md",
  },
];

export const FEATURED_INVESTIGATIONS = ["LAB_001", "LAB_012", "LAB_003"]
  .map((id) => INVESTIGATIONS.find((i) => i.id === id))
  .filter((i): i is Investigation => Boolean(i));
