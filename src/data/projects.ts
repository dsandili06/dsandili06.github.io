import type { Project } from "@/types";
import blueteamScriptsImg from "@/assets/project-blueteam-scripts.jpg";
import socLabsImg from "@/assets/project-soc-labs.jpg";

export const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Artifakt Labs",
    description:
      "Laboratorio centralizado de DFIR, análisis de malware e investigaciones defensivas. Documentación reproducible de incidentes en CyberDefenders, TryHackMe y LetsDefend con mapeo formal a MITRE ATT&CK.",
    href: "https://github.com/dsandili06/Artifakt-Labs",
    label: "LABS_SOC.REPO",
    image: socLabsImg,
    inPageHref: "#investigaciones",
    inPageLabel: "Explorar Writeups (#03)",
    metrics: [
      { label: "INVESTIGACIONES", value: "15+ Writeups" },
      { label: "PLATAFORMAS", value: "CyberDefenders · THM" },
      { label: "ESPECIALIDAD", value: "Blue Team · DFIR" },
    ],
    modulesLabel: "INVESTIGATION_MODULES",
    scripts: [
      {
        name: "Disk Forensics",
        desc: "Análisis de artefactos NTFS, volúmenes MFT, Prefetch, Shimcache y Event Logs",
      },
      {
        name: "Memory Forensics",
        desc: "Extracción y triaje de memoria RAM con Volatility: inyecciones DLL y procesos anómalos",
      },
      {
        name: "Network Forensics",
        desc: "Inspección de capturas pcap, balizas C2 y exfiltración de credenciales/datos",
      },
      {
        name: "TTPs Mapping",
        desc: "Mapeo sistemático de vectores de acceso, persistencia y técnicas MITRE ATT&CK",
      },
    ],
  },
  {
    id: "02",
    title: "BlueTeam-Scripts",
    description:
      "Toolkit de automatización táctica para analistas de SOC e incident responders. Colección modular de herramientas en Python y PowerShell para triage de endpoints, disección de logs y detección de persistencia adversaria.",
    href: "https://github.com/dsandili06/blueteam-scripts",
    label: "AUTOMATION_BT.REPO",
    image: blueteamScriptsImg,
    metrics: [
      { label: "HERRAMIENTAS", value: "12+ Scripts" },
      { label: "LENGUAJES", value: "Python · PowerShell" },
      { label: "ALCANCE", value: "Triage & Persistence" },
    ],
    scripts: [
      {
        name: "event_log_parser.py",
        desc: "Parser forense de Security.evtx: logons (4624/4625), privilegios (4672) y procesos (4688)",
        lang: "py",
      },
      {
        name: "autoruns_analyzer.ps1",
        desc: "Enumeración de persistencia: Run keys, Startup folder, servicios y tareas programadas",
        lang: "ps1",
      },
      {
        name: "dll_checker.ps1",
        desc: "Auditoría de DLLs en procesos y directorios para detectar DLL Hijacking / Side-loading",
        lang: "ps1",
      },
      {
        name: "suspicious_powershell_detector.py",
        desc: "Detección heurística de comandos Base64, flags de evasión (-enc, -nop) y scripts anómalos",
        lang: "py",
      },
    ],
  },
];
