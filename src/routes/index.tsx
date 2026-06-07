import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LenisProvider } from "@/components/fx/LenisProvider";
import { CustomCursor } from "@/components/fx/CustomCursor";
import { BootSequence } from "@/components/fx/BootSequence";
import { TerminalWindow } from "@/components/fx/TerminalWindow";
import { BackgroundPaths } from "@/components/fx/BackgroundPaths";
import { RadialOrbital, type OrbitalNode } from "@/components/fx/RadialOrbital";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "Santiago Daniel Sandili — SECURITY ANALYST L1 / Blue Team" },
      {
        name: "description",
        content:
          "Portfolio de Santiago Daniel Sandili — Analista de Seguridad L1 / Blue Team. DFIR, threat hunting, malware analysis y automatización defensiva.",
      },
      {
        property: "og:title",
        content: "Santiago Daniel Sandili — SECURITY ANALYST L1 / Blue Team",
      },
      {
        property: "og:description",
        content: "DFIR · Threat Hunting · Malware Analysis · Blue Team Automation.",
      },
    ],
  }),
  component: Portfolio,
}));

type Project = {
  id: string;
  title: string;
  description: string;
  href: string;
  label: string;
};

type Investigation = {
  id: string;
  title: string;
  platform: string;
  summary: string;
  categories: string[];
  href: string;
};

type Course = { n: string; title: string; org: string };

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Artifakt Labs",
    description:
      "Compilado de laboratorios prácticos de SOC: investigación de incidentes, análisis de alertas, detección de TTPs y ejercicios de threat hunting sobre entornos simulados.",
    href: "https://github.com/dsandili06/Artifakt-Labs",
    label: "LABS_SOC.REPO",
  },
  {
    id: "02",
    title: "Blue Team Automation Scripts",
    description:
      "Repositorio de scripts orientados a tareas operativas de SOC y DFIR. La idea es ir documentando utilidades que me sirvan para triage, parsing, recolección de evidencia y automatización de tareas repetitivas.",
    href: "https://github.com/dsandili06/blueteam-scripts",
    label: "AUTOMATION_BT.REPO",
  },
];

const CD_BASE =
  "https://github.com/dsandili06/Artifakt-Labs/blob/main/Writeups/CyberDefenders/";

const INVESTIGATIONS: Investigation[] = [
  { id: "LAB_001", title: "FakeGPT", platform: "CyberDefenders", summary: "Análisis de malware en extensión de navegador que simula ser ChatGPT para interceptar credenciales y sesiones web. Identificación de Image Beacons y exfiltración cifrada.", categories: ["Malware Analysis"], href: CD_BASE + "FakeGPT.md" },
  { id: "LAB_002", title: "3CX Supply Chain", platform: "CyberDefenders", summary: "Investigación basada en CTI de un instalador oficial comprometido de 3CX. Análisis de payloads maliciosos, técnicas de evasión (T1497) y DLL Side-Loading (T1574).", categories: ["Threat Intel"], href: CD_BASE + "3CX-Supply%20Chain.md" },
  { id: "LAB_003", title: "Insider", platform: "CyberDefenders", summary: "Forense en imagen de Kali Linux para investigar actividad de una amenaza interna. Análisis de .bash_history, extracción de herramientas ofensivas y trazabilidad de eventos.", categories: ["Endpoint Forensics"], href: CD_BASE + "Insider.md" },
  { id: "LAB_004", title: "Kraken Keylogger", platform: "CyberDefenders", summary: "Análisis de un vector inicial LNK distribuido por mensajería web. Reconstrucción de persistencia abusando de software legítimo (Greenshot) y exfiltración de red.", categories: ["Endpoint Forensics"], href: CD_BASE + "KrakenKeylogger.md" },
  { id: "LAB_005", title: "Silent Breach", platform: "CyberDefenders", summary: "Investigación de una imagen de disco tras ataque de ransomware. Extracción de artefactos de navegador/correo, deofuscación de script PowerShell y descifrado de evidencia.", categories: ["Endpoint Forensics"], href: CD_BASE + "Silent%20Breach.md" },
  { id: "LAB_006", title: "Lockdown", platform: "CyberDefenders", summary: "Análisis forense de red y memoria sobre una intrusión en servidor IIS. Detección de webshells SMB2, persistencia en Startup y análisis de malware AgentTesla ofuscado con UPX.", categories: ["Network Forensics", "Endpoint Forensics"], href: CD_BASE + "Lockdown.md" },
  { id: "LAB_007", title: "Oski", platform: "CyberDefenders", summary: "Análisis de comportamiento de un infostealer (Oski Stealer). Identificación de C2, uso de sqlite3.dll para robo de credenciales, exfiltración de datos y técnicas de auto-borrado.", categories: ["Threat Intel"], href: CD_BASE + "Oski.md" },
  { id: "LAB_008", title: "PsExec Hunt", platform: "CyberDefenders", summary: "Investigación sobre el abuso de herramientas legítimas (PsExec) para movimiento lateral. Análisis de tráfico SMB2, shares administrativos (ADMIN$) y extracción de credenciales NTLM.", categories: ["Network Forensics"], href: CD_BASE + "PsExec-Hunt.md" },
  { id: "LAB_009", title: "RamnIt", platform: "CyberDefenders", summary: "Análisis forense de memoria sobre una infección del gusano bancario Ramnit. Identificación de procesos anómalos (ChromeSetup.exe), geolocalización de C2 y extracción de hashes.", categories: ["Endpoint Forensics"], href: CD_BASE + "RamnIt.md" },
  { id: "LAB_010", title: "Red Stealer", platform: "CyberDefenders", summary: "Análisis del malware RedLine Stealer distribuido como wextract.exe. Mapeo de técnicas de recolección de datos (T1005), escalación de privilegios e infraestructura C2.", categories: ["Threat Intel"], href: CD_BASE + "Red%20Stealer.md" },
  { id: "LAB_011", title: "Web Investigation", platform: "CyberDefenders", summary: "Investigación de un compromiso a servidor web. Detección de SQL Injection, enumeración con GoBuster, bypass de panel de administración y despliegue de webshell.", categories: ["Network Forensics"], href: CD_BASE + "Web%20Investigation.md" },
  { id: "LAB_012", title: "Brave", platform: "CyberDefenders", summary: "Análisis forense de memoria de host Windows sospechoso de exfiltración. Identificación de conexiones, sesiones web cifradas (T1071.001) y uso de LOLApps. Reconstrucción de actividad vía UserAssist.", categories: ["Endpoint Forensics"], href: CD_BASE + "Brave.md" },
  { id: "LAB_013", title: "SysInternals", platform: "CyberDefenders", summary: "Investigación forense de un endpoint Windows comprometido usando la suite Sysinternals. Análisis de artefactos de registro, prefetch y reconstrucción de la cadena de ejecución.", categories: ["Endpoint Forensics"], href: CD_BASE + "SysInternals.md" },
  { id: "LAB_014", title: "TheCrime", platform: "CyberDefenders", summary: "Análisis forense de dispositivo Android para investigar un crimen. Recuperación de evidencia borrada, análisis de metadatos de archivos y reconstrucción de actividad del usuario mediante artefactos.", categories: ["Android Forensics"], href: CD_BASE + "TheCrime.md" },
  { id: "LAB_015", title: "WebStrike", platform: "CyberDefenders", summary: "Análisis de captura de tráfico HTTP tras ataque a aplicación web. Detección de file upload malicioso, despliegue de webshell PHP y extracción de IOCs desde logs de servidor.", categories: ["Network Forensics"], href: CD_BASE + "WebStrike.md" },
];

const STACK: { category: string; items: string[] }[] = [
  { category: "Forense & Triage", items: ["Zimmerman Tools", "Autopsy", "Volatility 3", "FTK Imager", "Velociraptor", "Timeline Explorer", "DB Browser (SQLite)"] },
  { category: "Malware Analysis", items: ["dnSpy", "ExtAnalysis", "CRX Viewer", "Hybrid Analysis", "Any.Run"] },
  { category: "SIEM & Network", items: ["Splunk SPL", "ELK Stack", "Kibana", "Wireshark", "TShark", "Suricata", "Snort"] },
  { category: "Scripting & OSINT", items: ["Python", "Bash", "PowerShell", "Shodan", "VirusTotal", "AbuseIPDB", "MalwareBazaar", "ThreatFox", "CyberChef"] },
];

const CERTIFICATIONS: {
  code: string;
  title: string;
  org: string;
  year: string;
  score?: string;
  status: "OBTENIDA" | "EN PREPARACIÓN";
  badge: string;
  href?: string;
}[] = [
  { code: "SAL1", title: "SECURITY ANALYST L1", org: "TRYHACKME", year: "2026", score: "948 / 1000", status: "OBTENIDA", badge: "CERTIFIED", href: "https://assets.tryhackme.com/certification-certificate/69bb156d56eed3cbe3a712a6.pdf" },
  { code: "SY0-701", title: "CompTIA Security+", org: "CompTIA", year: "2026", status: "EN PREPARACIÓN", badge: "EN PREPARACIÓN" },
];

const COURSES: Course[] = [
  { n: "01", title: "Networking Basics", org: "Cisco" },
  { n: "02", title: "Introduction to Cybersecurity", org: "Cisco" },
  { n: "03", title: "Network Security Fundamentals", org: "Palo Alto Networks" },
  { n: "04", title: "Pre Security", org: "TryHackMe" },
  { n: "05", title: "Cyber Security 101", org: "TryHackMe" },
  { n: "06", title: "SOC L1 Path", org: "TryHackMe" },
  { n: "07", title: "SOC L1 BOOTCAMP", org: "DOJO COMMUNITY" },
  { n: "08", title: "CompTIA Security+ (SY0-701) Cert Prep", org: "LinkedIn Learning" },
  { n: "09", title: "CYBER INCIDENT RESPONSE AND DIGITAL FORENSICS", org: "LINKEDIN LEARNING" },
];

const EMAIL = "sdsandili06@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/santiagodsandili/";
const GITHUB = "https://github.com/dsandili06";

/* ---------- Root ---------- */

function Portfolio() {
  useRevealOnView();
  return (
    <TooltipProvider delayDuration={150}>
      <LenisProvider />
      <CustomCursor />
      <div className="min-h-screen bg-background text-foreground font-body relative selection:bg-accent selection:text-[var(--accent-foreground)]">
        <Nav />
        <main>
          <Hero />
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <About />
            <Proyectos />
            <Investigaciones />
            <Stack />
            <Certs />
            <Cursos />
            <Contacto />
          </div>
          
        </main>
      </div>
    </TooltipProvider>
  );
}

/* ---------- Reveal Hook ---------- */

function useRevealOnView() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      els.forEach((el) => el.classList.add("reveal-on-view", "in-view"));
      return;
    }
    els.forEach((el) => el.classList.add("reveal-on-view"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            requestAnimationFrame(() => el.classList.add("in-view"));
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: [0, 0.1] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ---------- Nav ---------- */

function Nav() {
  const links = [
    { href: "#about", id: "about", label: "About" },
    { href: "#proyectos", id: "proyectos", label: "Proyectos" },
    { href: "#investigaciones", id: "investigaciones", label: "Labs" },
    { href: "#stack", id: "stack", label: "Stack" },
    { href: "#formacion", id: "formacion", label: "Certs" },
    { href: "#cursos", id: "cursos", label: "Cursos" },
    { href: "#contacto", id: "contacto", label: "Contacto" },
  ];
  const [active, setActive] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = links
      .map((l) => ({ id: l.id, el: document.getElementById(l.id) }))
      .filter((s): s is { id: string; el: HTMLElement } => Boolean(s.el));

    const onScroll = () => {
      const probe = 120; // px from top
      let current = sections[0]?.id ?? "";
      for (const s of sections) {
        const top = s.el.getBoundingClientRect().top;
        if (top - probe <= 0) current = s.id;
        else break;
      }
      // Special-case: at the very bottom, force last section
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = sections[sections.length - 1]?.id ?? current;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-[color-mix(in_oklab,var(--background)_88%,transparent)] backdrop-blur-[12px] border-b border-border-dim">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-14 sm:h-16 flex items-center justify-between">
        <a
          href="#top"
          aria-label="Inicio"
          className="group font-mono text-[11px] sm:text-xs leading-none flex items-center whitespace-nowrap"
        >
          <span className="text-[var(--muted-foreground)]">[</span><span className="text-[var(--accent)]">artif4kt</span><span className="text-[var(--muted-foreground)]">@</span><span className="text-foreground">analyst</span><span className="text-[var(--muted-foreground)]"> ~]</span><span className="text-[var(--accent)] ml-1">$</span>
        </a>

        <div className="hidden md:flex items-center gap-9 font-mono text-[11px] uppercase tracking-[0.18em]">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative pb-1 transition-colors duration-200 ${
                  isActive ? "text-[var(--accent)]" : "text-foreground/75 hover:text-[var(--accent)]"
                }`}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute left-0 right-0 -bottom-0.5 h-px bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-[var(--accent)] border border-border-dim hover:border-[var(--accent)] transition-colors"
        >
          {menuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden border-t border-border-dim bg-background/95 backdrop-blur-md transition-[max-height,opacity] duration-300 ${
          menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-2 font-mono text-xs uppercase tracking-[0.2em]">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 py-3 border-b border-border-dim/60 text-foreground/80 hover:text-[var(--accent)] transition-colors"
              >
                <span className="text-[var(--accent)]/60">{">"}</span>
                <span>{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  const [bootDone, setBootDone] = useState(false);
  return (
    <section
      id="top"
      className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden border-b border-border-dim grid-bg"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <BackgroundPaths />
      </div>
      {/* Top: badges */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-10 pt-24 md:pt-28">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 border border-[var(--accent-green)]/50 text-[var(--accent-green)] inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
            ACTIVE_SESSION
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 border border-[var(--accent-green)]/50 text-[var(--accent-green)] inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
            AVAILABLE
          </span>
        </div>
      </div>

      {/* Center: boot + name */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-10 flex-1 grid grid-cols-1 md:grid-cols-[1fr_minmax(0,440px)] gap-10 md:gap-12 items-center py-12">
        <div className="flex flex-col">
          <div className="mb-8 min-h-[5.5rem]">
            <BootSequence onDone={() => setBootDone(true)} />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: bootDone ? 1 : 0, y: bootDone ? 0 : 24 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold leading-[0.88] tracking-[-0.025em] text-foreground"
            style={{ fontSize: "clamp(3.5rem, 8vw, 9rem)" }}
          >
            <span className="text-[var(--accent)]">Santiago</span>
            <br />
            Sandili
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: bootDone ? 1 : 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-[var(--muted-foreground)]"
          >
            SOC Analyst Jr. <span className="text-foreground/60">·</span> Blue Team <span className="text-foreground/60">·</span> DFIR
          </motion.p>
        </div>

        <div className="hidden md:block">
          <TerminalWindow start={bootDone} />
        </div>
      </div>

      {/* Bottom: status corner */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-10 pb-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] gap-6 flex-wrap">
        <div className="flex items-center gap-6">
          <span>SCROLL ↓</span>
        </div>
        <div className="text-right">
          <div>
            STATUS: <span className="text-[var(--accent-green)]">DISPONIBLE</span>
          </div>
          <div className="mt-1">BASE: TUC, AR.</div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section primitives ---------- */

function Section({
  id,
  number,
  title,
  kicker,
  children,
}: {
  id: string;
  number: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} data-reveal className="relative py-24 md:py-32 border-b border-border-dim">
      <SectionHeader number={number} title={title} kicker={kicker} />
      {children}
    </section>
  );
}

function SectionHeader({
  number,
  title,
  kicker,
}: {
  number: string;
  title: string;
  kicker?: string;
}) {
  return (
    <div className="relative mb-14 md:mb-20">
      {/* Watermark */}
      <span
        aria-hidden
        className="absolute -top-6 md:-top-10 -left-2 md:-left-6 font-display font-bold leading-none text-[var(--surface)] select-none pointer-events-none"
        style={{ fontSize: "clamp(5rem, 14vw, 12rem)" }}
      >
        {number}
      </span>
      <div className="relative flex items-end justify-between gap-6 pb-5 border-b border-border-dim">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-3">
            SECTION_{number}{kicker ? ` // ${kicker}` : ""}
          </div>
          <h2
            className="font-display font-bold leading-none tracking-[-0.02em] text-[var(--accent)]"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            {title}
          </h2>
        </div>
        <span aria-hidden className="hidden md:block size-1.5 bg-[var(--accent)] mb-3" />
      </div>
    </div>
  );
}

/* ---------- About ---------- */

function About() {
  return (
    <Section id="about" number="01" title="About Me" kicker="PROFILE">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
        <div className="space-y-6 text-[15px] md:text-base leading-relaxed text-foreground/80 max-w-[58ch]">
          <p>
            Soy Santiago Daniel Sandili, analista SOC Jr. orientado a{" "}
            <span className="text-[var(--accent)]">Blue Team</span> y DFIR. Me fui formando de manera práctica con laboratorios, writeups y herramientas reales para desarrollar una base sólida en detección, triage y respuesta a incidentes.
          </p>
          <p>
            Vengo del interior del país (Argentina) y estoy construyendo mi camino en ciberseguridad desde un enfoque práctico. Mi interés principal está en entender cómo se detecta, investiga y contiene una amenaza a partir de evidencia real.
          </p>
          <p>
            Me gusta trabajar sobre memoria, artefactos de Windows, tráfico de red, logs y casos de malware para reconstruir lo que pasó y sacar conclusiones útiles. Por eso mi foco hoy está en{" "}
            <span className="text-[var(--accent)]">Blue Team</span>.
          </p>
        </div>

        <a
          href="https://assets.tryhackme.com/certification-certificate/69bb156d56eed3cbe3a712a6.pdf"
          target="_blank"
          rel="noreferrer"
          className="group block bg-[var(--surface)] border border-border-dim p-7 relative transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_70%,var(--background))]"
          style={{ borderLeft: "3px solid var(--accent-green)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <Badge variant="success" dot>
              CERTIFIED
            </Badge>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
              2026
            </span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] mb-3">
            TRYHACKME · SAL1
          </div>
          <h3 className="font-display font-bold leading-tight text-[1.75rem] md:text-[2rem] text-foreground mb-6 group-hover:text-[var(--accent)] transition-colors">
            Security Analyst L1
          </h3>
          <div className="border-t border-border-dim pt-5 flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] mb-1">
                SCORE
              </div>
              <div className="font-display font-bold text-3xl text-[var(--accent)] leading-none">
                948 <span className="text-[var(--muted-foreground)] text-xl">/ 1000</span>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
              VER →
            </span>
          </div>
        </a>
      </div>
    </Section>
  );
}

/* ---------- Proyectos ---------- */

function Proyectos() {
  return (
    <Section id="proyectos" number="02" title="Proyectos" kicker="REPOSITORIES">
      <div className="flex flex-col">
        {PROJECTS.map((p, idx) => (
          <motion.a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group grid grid-cols-1 md:grid-cols-[80px_1fr_auto] gap-6 md:gap-10 items-start py-8 border-t border-border-dim hover:bg-[var(--surface)]/50 transition-colors px-4 -mx-4"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] pt-1">
              PRJ_{p.id}
            </div>
            <div className="max-w-2xl">
              <h3 className="font-display font-semibold text-2xl md:text-[1.75rem] leading-tight tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors mb-3">
                {p.title}
              </h3>
              <p className="text-foreground/65 leading-relaxed text-[15px] mb-4">
                {p.description}
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                {p.label}
              </span>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--accent)] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all pt-1">
              VER REPO →
            </div>
          </motion.a>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_auto] gap-6 md:gap-10 items-start py-8 border-t border-dashed border-[var(--accent)]/30 px-4 -mx-4 progress-shimmer">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--accent)] pt-1">
            PRJ_03
          </div>
          <div className="max-w-2xl opacity-60">
            <h3 className="font-display font-semibold text-2xl md:text-[1.75rem] leading-tight tracking-tight text-foreground/70 mb-3">
              Próximo proyecto en construcción
            </h3>
            <p className="text-foreground/55 leading-relaxed text-[15px] mb-4">
              Más detalles cuando esté listo para publicar.
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
              NEXT_PROJECT.WIP
            </span>
          </div>
          <div className="pt-1">
            <Badge variant="warning" dot>
              EN PROCESO
            </Badge>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Investigaciones (table) ---------- */

function Investigaciones() {
  return (
    <Section id="investigaciones" number="03" title="Investigaciones" kicker="CASE_LOG">
      {/* Desktop table */}
      <div className="hidden md:block border border-border-dim">
        <div className="grid grid-cols-[64px_1.4fr_1fr_140px_120px_60px] gap-4 px-5 py-3 border-b border-border-dim font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          <div>N°</div>
          <div>CASO</div>
          <div>CATEGORÍA</div>
          <div>PLATAFORMA</div>
          <div>ESTADO</div>
          <div></div>
        </div>
        {INVESTIGATIONS.map((i, idx) => (
          <motion.a
            key={i.id}
            href={i.href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.4, delay: (idx % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group grid grid-cols-[64px_1.4fr_1fr_140px_120px_60px] gap-4 items-center px-5 py-4 border-b border-border-dim last:border-b-0 transition-colors hover:bg-[color-mix(in_oklab,var(--accent)_4%,transparent)] hover:border-l-2 hover:border-l-[var(--accent)] hover:pl-[18px]"
            title={i.summary}
          >
            <div className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted-foreground)] tabular-nums">
              {i.id.replace("LAB_", "")}
            </div>
            <div className="font-display font-semibold text-foreground text-[15px] tracking-tight group-hover:text-[var(--accent)] transition-colors">
              {i.title}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {i.categories.map((c) => (
                <span
                  key={c}
                  className="font-mono text-[9px] uppercase tracking-[0.2em] px-1.5 py-0.5 border border-border-dim text-foreground/70"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              {i.platform}
            </div>
            <div>
              <Badge variant="success" dot>
                PUBLICADO
              </Badge>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity text-right">
              VER →
            </div>
          </motion.a>
        ))}
        {/* LAB_016 in process */}
        <div className="grid grid-cols-[64px_1.4fr_1fr_140px_120px_60px] gap-4 items-center px-5 py-4 border-t border-dashed border-[var(--accent)]/30 opacity-50">
          <div className="font-mono text-[11px] tracking-[0.2em] text-[var(--accent)] tabular-nums">
            016
          </div>
          <div className="font-display font-semibold text-foreground/70 text-[15px] tracking-tight">
            Próximo writeup
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            —
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            CyberDefenders
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[var(--accent)]/50 text-[var(--accent)]">
              EN PROCESO
            </span>
          </div>
          <div></div>
        </div>
      </div>

      {/* Mobile stack */}
      <div className="md:hidden flex flex-col">
        {INVESTIGATIONS.map((i) => (
          <a
            key={i.id}
            href={i.href}
            target="_blank"
            rel="noreferrer"
            className="border-t border-border-dim py-5 first:border-t-0"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted-foreground)]">
                {i.id}
              </span>
              <Badge variant="success" dot>
                PUBLICADO
              </Badge>
            </div>
            <h3 className="font-display font-semibold text-lg tracking-tight mb-1">{i.title}</h3>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-3">
              {i.platform} · {i.categories.join(" · ")}
            </div>
            <p className="text-sm text-foreground/65 leading-relaxed">{i.summary}</p>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
              Ver writeup →
            </div>
          </a>
        ))}
        <div className="border-t border-dashed border-[var(--accent)]/30 py-5 opacity-60">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)]">LAB_016</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[var(--accent)]/50 text-[var(--accent)]">
              EN PROCESO
            </span>
          </div>
          <h3 className="font-display font-semibold text-lg tracking-tight">Próximo writeup CyberDefenders</h3>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Stack ---------- */

function Stack() {
  const nodes: OrbitalNode[] = STACK.map((cat, i) => ({
    id: `cat-${i}`,
    code: String(i + 1).padStart(2, "0"),
    title: cat.category,
    items: cat.items,
  }));
  return (
    <Section id="stack" number="04" title="Stack Técnico" kicker="TOOLING">
      <RadialOrbital nodes={nodes} />
    </Section>
  );
}

/* ---------- Certifications ---------- */

function Certs() {
  return (
    <Section id="formacion" number="05" title="Certificaciones" kicker="CREDENTIALS">
      <div className="flex flex-col gap-px bg-border-dim border border-border-dim">
        {CERTIFICATIONS.map((c) => {
          const obtained = c.status === "OBTENIDA";
          const accentColor = obtained ? "var(--accent-green)" : "var(--accent)";
          const Wrapper: React.ElementType = c.href ? "a" : "div";
          const wrapperProps = c.href
            ? { href: c.href, target: "_blank", rel: "noreferrer" }
            : {};
          return (
            <Wrapper
              key={c.code}
              {...wrapperProps}
              className={`group bg-background p-7 md:p-9 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center transition-colors ${
                c.href ? "hover:bg-[color-mix(in_oklab,var(--accent)_3%,transparent)]" : ""
              }`}
              style={{ borderLeft: `3px solid ${obtained ? accentColor : "color-mix(in oklab, var(--accent) 40%, transparent)"}` }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {obtained ? (
                    <Badge variant="success" dot>
                      {c.badge}
                    </Badge>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] px-2 py-0.5 border border-[var(--accent)]/50 text-[var(--accent)]">
                      {c.badge}
                    </span>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                    {c.org} · {c.code} · {c.year}
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl md:text-[2.25rem] leading-tight tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors">
                  {c.title}
                </h3>
              </div>
              <div className="md:text-right">
                {c.score ? (
                  <>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] mb-1">
                      SCORE
                    </div>
                    <div className="font-display font-bold text-4xl md:text-5xl text-[var(--accent)] leading-none">
                      {c.score}
                    </div>
                    {c.href && (
                      <span className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] opacity-70 group-hover:opacity-100 transition-opacity">
                        VER CERTIFICADO →
                      </span>
                    )}
                  </>
                ) : (
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                    ESTUDIO EN CURSO
                  </div>
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------- Cursos ---------- */

function Cursos() {
  return (
    <Section id="cursos" number="06" title="Cursos Completados" kicker="LEARNING_LOG">
      <ol className="border-t border-border-dim">
        {COURSES.map((c) => (
          <li
            key={c.n}
            className="grid grid-cols-[48px_1fr_auto] gap-6 items-center py-5 border-b border-border-dim group hover:bg-[color-mix(in_oklab,var(--accent)_3%,transparent)] transition-colors px-2 -mx-2"
          >
            <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted-foreground)] tabular-nums">
              {c.n}
            </span>
            <div className="min-w-0">
              <h4 className="font-display font-semibold text-base md:text-lg leading-tight tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors">
                {c.title}
              </h4>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] mt-1 block">
                {c.org}
              </span>
            </div>
            <Badge variant="success" dot>
              COMPLETADO
            </Badge>
          </li>
        ))}
        <li className="grid grid-cols-[48px_1fr_auto] gap-6 items-center py-5 border-b border-dashed border-[var(--accent)]/30 opacity-60 progress-shimmer px-2 -mx-2">
          <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--accent)] tabular-nums">10</span>
          <div className="min-w-0">
            <h4 className="font-display font-semibold text-base md:text-lg leading-tight tracking-tight text-foreground/70">
              Curso en proceso
            </h4>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] mt-1 block">
              PRÓXIMAMENTE
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] px-2 py-0.5 border border-[var(--accent)]/50 text-[var(--accent)]">
            EN PROCESO
          </span>
        </li>
      </ol>
    </Section>
  );
}

/* ---------- Contacto ---------- */

function Contacto() {
  const channels = [
    {
      code: "01",
      label: "LinkedIn",
      value: "/in/santiagodsandili",
      href: "https://linkedin.com/in/santiagodsandili",
      cta: "Ver perfil →",
      external: true,
    },
    {
      code: "02",
      label: "Email",
      value: "sdsandili06@gmail.com",
      href: "mailto:sdsandili06@gmail.com",
      cta: "Enviar mensaje →",
      external: false,
    },
    {
      code: "03",
      label: "GitHub",
      value: "github.com/dsandili06",
      href: "https://github.com/dsandili06",
      cta: "Ver repositorios →",
      external: true,
    },
  ];

  const meta = [
    { k: "UBICACIÓN", v: "Tucumán, Argentina" },
    { k: "MODALIDAD", v: "Remoto / Híbrido" },
    { k: "RESPUESTA", v: "< 24 horas" },
  ];

  return (
    <section id="contacto" data-reveal className="relative py-24 md:py-32 border-b border-border-dim">
      {/* Header */}
      <div className="mb-14 md:mb-20">
        <h2
          className="font-display font-bold leading-[0.95] tracking-tight"
          style={{ color: "#E8A230", fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
        >
          ESTABLISH CONNECTION
        </h2>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          [SECURE_CHANNEL] · Tiempo de respuesta: &lt; 24h
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        {/* Col izquierda — Status card */}
        <div
          className="w-full"
          style={{
            background: "#0E1416",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 4,
            padding: 32,
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-6">
            ANALYST STATUS
          </div>

          <div className="flex items-center gap-3 mb-8">
            <span className="relative flex items-center justify-center" style={{ width: 16, height: 16 }}>
              <motion.span
                className="absolute rounded-full"
                style={{ width: 16, height: 16, background: "#4DFFB4" }}
                animate={{ scale: [1, 1.4], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
              <span
                className="relative rounded-full"
                style={{ width: 10, height: 10, background: "#4DFFB4" }}
              />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
              DISPONIBLE PARA OPORTUNIDADES
            </span>
          </div>

          <div className="flex flex-col">
            {meta.map((m) => (
              <div
                key={m.k}
                className="flex items-center justify-between py-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                  {m.k}
                </span>
                <span className="text-foreground text-sm">{m.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Col derecha — Channels */}
        <div className="flex flex-col gap-3">
          {channels.map((c) => (
            <a
              key={c.code}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="channel-card group block px-6 py-5 transition-all duration-200"
              style={{
                background: "#0E1416",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: "2px solid transparent",
                borderRadius: 4,
              }}
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-2">
                CHANNEL_{c.code} · {c.label}
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="font-semibold text-base md:text-lg text-foreground break-all">
                  {c.value}
                </span>
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#E8A230" }}
                >
                  {c.cta}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-16 pt-6 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          © 2026 Santiago Daniel Sandili · Construido con criterio técnico
        </span>
      </div>
    </section>
  );
}
