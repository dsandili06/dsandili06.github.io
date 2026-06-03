import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import socLabsImg from "@/assets/project-soc-labs.jpg";
import blueteamScriptsImg from "@/assets/project-blueteam-scripts.jpg";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Santiago Daniel Sandili — SOC Analyst / Blue Team" },
      {
        name: "description",
        content:
          "Portfolio de Santiago Daniel Sandili — Analista SOC / Blue Team. DFIR, threat hunting, malware analysis y automatización defensiva.",
      },
      {
        property: "og:title",
        content: "Santiago Daniel Sandili — SOC Analyst / Blue Team",
      },
      {
        property: "og:description",
        content:
          "DFIR · Threat Hunting · Malware Analysis · Blue Team Automation.",
      },
    ],
  }),
  component: Portfolio,
});

type Project = {
  id: string;
  title: string;
  description: string;
  href: string;
  label: string;
  image: string;
};

type Investigation = {
  id: string;
  title: string;
  platform: string;
  summary: string;
  categories: string[];
  href: string;
};

type Course = {
  n: string;
  title: string;
  org: string;
};

const PROJECTS: Project[] = [
  {
    id: "01",
    title: "SOC Practitioner Labs",
    description:
      "Compilado de laboratorios prácticos de SOC: investigación de incidentes, análisis de alertas, detección de TTPs y ejercicios de threat hunting sobre entornos simulados.",
    href: "https://github.com/dsandili06/SOC-Practitioner-Labs",
    label: "LABS_SOC.REPO",
    image: socLabsImg,
  },
  {
    id: "02",
    title: "Blue Team Automation Scripts",
    description:
      "Scripts operacionales para DFIR y SOC: triage de endpoints, enumeración local, parseo de logs, integración con threat intel y plantillas de investigación rápida.",
    href: "https://github.com/dsandili06/blueteam-scripts",
    label: "AUTOMATION_BT.REPO",
    image: blueteamScriptsImg,
  },
];

const CD_BASE =
  "https://github.com/dsandili06/SOC-Practitioner-Labs/blob/main/Writeups/CyberDefenders/";

const INVESTIGATIONS: Investigation[] = [
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

const STACK: { category: string; items: string[] }[] = [
  {
    category: "Forense & Triage",
    items: [
      "Zimmerman Tools",
      "Autopsy",
      "Volatility 3",
      "FTK Imager",
      "Velociraptor",
      "Timeline Explorer",
      "DB Browser (SQLite)",
    ],
  },
  {
    category: "Malware Analysis",
    items: ["dnSpy", "ExtAnalysis", "CRX Viewer", "Hybrid Analysis", "Any.Run"],
  },
  {
    category: "SIEM & Network",
    items: [
      "Splunk SPL",
      "ELK Stack",
      "Kibana",
      "Wireshark",
      "TShark",
      "Suricata",
      "Snort",
    ],
  },
  {
    category: "Scripting, OSINT & Threat Intel",
    items: [
      "Python",
      "Bash",
      "PowerShell",
      "Shodan",
      "VirusTotal",
      "AbuseIPDB",
      "MalwareBazaar",
      "ThreatFox",
      "CyberChef",
    ],
  },
];

const CERTIFICATIONS: {
  code: string;
  title: string;
  org: string;
  year: string;
  score?: string;
  status: "OBTENIDA" | "EN PREPARACIÓN";
  href?: string;
}[] = [
  {
    code: "SAL1",
    title: "SOC Analyst Level 1",
    org: "TryHackMe",
    year: "2024",
    score: "948 / 1000",
    status: "OBTENIDA",
    href: "https://assets.tryhackme.com/certification-certificate/69bb156d56eed3cbe3a712a6.pdf",
  },
  {
    code: "SY0-701",
    title: "CompTIA Security+",
    org: "CompTIA",
    year: "2025",
    status: "EN PREPARACIÓN",
  },
];

const COURSES: Course[] = [
  { n: "01", title: "Networking Basics", org: "Cisco" },
  { n: "02", title: "Introduction to Cybersecurity", org: "Cisco" },
  { n: "03", title: "Network Security Fundamentals", org: "Palo Alto Networks" },
  { n: "04", title: "Pre Security", org: "TryHackMe" },
  { n: "05", title: "Cyber Security 101", org: "TryHackMe" },
  { n: "06", title: "SOC L1 Path", org: "TryHackMe" },
  {
    n: "07",
    title: "SOC L1 BOOTCAMP",
    org: "DOJO COMMUNITY",
  },
  {
    n: "08",
    title: "CompTIA Security+ (SY0-701) Cert Prep",
    org: "LinkedIn Learning",
  },
  { n: "09", title: "CYBER INCIDENT RESPONSE AND DIGITAL FORENSICS", org: "LINKEDIN LEARNING" },
];

const ROLES = ["DFIR ANALYST", "MALWARE ANALYST", "BLUE TEAM"];

const EMAIL = "sdsandili06@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/santiagodsandili/";
const GITHUB = "https://github.com/dsandili06";

function Portfolio() {
  useRevealOnView();
  return (
    <div className="min-h-screen bg-background text-foreground font-body relative">
      <BackgroundFX />
      <div
        aria-hidden
        className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl border-x border-border-dim/40 pointer-events-none z-40"
      />

      <Nav />

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        <Hero />


        <Section id="proyectos" number="01" title="Proyectos">
          <div className="flex flex-col">
            {PROJECTS.map((p) => (
              <ProjectRow key={p.id} project={p} />
            ))}
            <InProgressRow
              label="NEXT_PROJECT.WIP"
              title="Próximo proyecto en construcción"
              description="Más detalles cuando esté listo para publicar."
            />
          </div>
        </Section>

        <Section id="investigaciones" number="02" title="Investigaciones">
          <p className="font-display text-xs text-muted-foreground uppercase tracking-widest mb-8">
            WRITEUPS · INVESTIGACIONES
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-dim border border-border-dim">
            {INVESTIGATIONS.map((i) => (
              <InvestigationCard key={i.id} item={i} />
            ))}
            <InProgressCard
              code="LAB_016"
              title="Investigación en proceso"
              hint="Próximo writeup CyberDefenders en análisis."
            />
          </div>
        </Section>


        <section
          id="stack"
          data-reveal
          className="py-24 border-b border-border-dim"
        >
          <SectionHeader number="03" title="Stack Técnico" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border-dim border border-border-dim">
            {STACK.map((cat) => (
              <div key={cat.category} className="bg-background p-6 flex flex-col">
                <h3 className="font-display text-[11px] uppercase tracking-widest text-accent mb-5 border-b border-border-dim pb-3">
                  {cat.category}
                </h3>
                <ul className="flex flex-col gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="border-l-2 border-accent/60 pl-3 py-1.5 bg-surface/40 font-display text-xs uppercase tracking-wider hover:border-accent hover:bg-surface transition-colors"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section
          id="formacion"
          data-reveal
          className="py-24 border-b border-border-dim"
        >
          <SectionHeader number="04" title="Certificaciones" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-dim border border-border-dim">
            {CERTIFICATIONS.map((c) => {
              const obtained = c.status === "OBTENIDA";
              const Wrapper: React.ElementType = c.href ? "a" : "div";
              const wrapperProps = c.href
                ? { href: c.href, target: "_blank", rel: "noreferrer" }
                : {};
              return (
                <Wrapper
                  key={c.code}
                  {...wrapperProps}
                  className={`bg-background p-8 flex flex-col group transition-colors ${
                    obtained ? "hover:bg-accent/5" : "opacity-90"
                  } ${c.href ? "cursor-pointer" : ""}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className={`font-display text-[10px] tracking-widest px-2 py-1 border ${
                        obtained
                          ? "border-accent text-accent bg-accent/10"
                          : "border-muted-foreground/40 text-muted-foreground"
                      }`}
                    >
                      {obtained ? "✓ OBTENIDA" : "◌ EN PREPARACIÓN"}
                    </span>
                    <span className="font-display text-[10px] tracking-widest text-muted-foreground">
                      {c.year}
                    </span>
                  </div>

                  <span className="font-display text-[11px] uppercase tracking-widest text-accent mb-2">
                    {c.org} · {c.code}
                  </span>
                  <h3
                    className={`font-display text-2xl md:text-3xl uppercase font-bold leading-tight mb-6 ${
                      obtained ? "group-hover:text-accent transition-colors" : ""
                    }`}
                  >
                    {c.title}
                  </h3>

                  {c.score && (
                    <div className="mt-auto border-t border-border-dim pt-5">
                      <span className="font-display text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                        Puntaje obtenido
                      </span>
                      <span className="font-display text-4xl md:text-5xl font-bold text-accent leading-none">
                        {c.score}
                      </span>
                    </div>
                  )}

                  {c.href && (
                    <span className="mt-6 inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-accent group-hover:gap-3 transition-all">
                      Ver certificado <span className="text-base">→</span>
                    </span>
                  )}
                  {!c.score && !c.href && (
                    <span className="mt-auto pt-5 border-t border-border-dim font-display text-xs uppercase tracking-widest text-muted-foreground">
                      ESTUDIO EN CURSO 
                    </span>
                  )}
                </Wrapper>
              );
            })}
          </div>
        </section>


        <section id="cursos" data-reveal className="py-24 border-b border-border-dim">
          <SectionHeader number="05" title="Cursos Completados" />
          <p className="font-display text-xs text-muted-foreground uppercase tracking-widest mb-8">
            ORGANIZADO CRONOLÓGICAMENTE
          </p>
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-dim border border-border-dim">
            {COURSES.map((c) => (
              <li
                key={c.n}
                className="bg-background p-6 flex items-start gap-5 group hover:bg-accent/5 transition-colors"
              >
                <span className="font-display text-3xl font-bold text-accent/30 group-hover:text-accent/70 transition-colors leading-none">
                  {c.n}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold uppercase text-base leading-tight">
                    {c.title}
                  </h4>
                  <span className="font-display text-[10px] uppercase tracking-widest text-muted-foreground mt-1 block">
                    {c.org}
                  </span>
                </div>
                <span className="font-display text-[10px] tracking-widest text-accent border border-accent/40 px-2 py-1 whitespace-nowrap">
                  ✓ COMPLETO
                </span>
              </li>
            ))}
            <li className="bg-background p-6 flex items-start gap-5 border border-dashed border-[var(--accent)]/40 -m-px progress-shimmer">
              <span className="font-display text-3xl font-bold text-[var(--accent)]/40 leading-none">
                10
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold uppercase text-base leading-tight text-muted-foreground inline-block">
                  <span>Curso en proceso</span>
                </h4>
                <span className="font-display text-[10px] uppercase tracking-widest text-muted-foreground/70 mt-1 block">
                   PRÓXIMAMENTE
                </span>
              </div>
              <span className="font-display text-[10px] tracking-widest text-[var(--accent)] border border-dashed border-[var(--accent)]/50 px-2 py-1 whitespace-nowrap">
                ◌ EN PROCESO
              </span>
            </li>
          </ol>
        </section>

        <ContactSection />
        <Footer />
      </main>

    </div>
  );
}

function BackgroundFX() {
  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-dim) 1px, transparent 1px), linear-gradient(90deg, var(--border-dim) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, #000 40%, transparent 100%)",
        }}
      />
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 12%, transparent) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

function useRevealOnView() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    els.forEach((el) => el.classList.add("reveal-on-view"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-16 border-t border-border-dim font-display text-[10px] uppercase tracking-widest text-muted-foreground/70">
      <pre className="text-accent/40 text-[10px] leading-tight mb-4 overflow-x-auto">{`\n`}</pre>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span>{"\n"}</span>
        <span className="text-accent/70">$ exit 0_</span>
      </div>
    </footer>
  );
}


function Nav() {
  const links = [
    { href: "#proyectos", id: "proyectos", label: "Proyectos" },
    { href: "#investigaciones", id: "investigaciones", label: "Labs" },
    { href: "#stack", id: "stack", label: "Stack" },
    { href: "#formacion", id: "formacion", label: "Certs" },
    { href: "#cursos", id: "cursos", label: "Cursos" },
    { href: "#contacto", id: "contacto", label: "Contacto" },
  ];
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border-dim">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-display text-xs tracking-widest">
        <a href="#top" className="text-accent font-bold">
          SANTIAGO // BLUE TEAM
        </a>
        <div className="hidden md:flex gap-8 uppercase">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative pb-1 transition-colors ${isActive ? "text-accent" : "hover:text-accent"}`}
              >
                {l.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-px bg-accent transition-all ${isActive ? "w-full" : "w-0"}`}
                />
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}


function TypewriterRole() {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");
  useEffect(() => {
    const word = ROLES[idx];
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (text.length < word.length) {
        timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setPhase("deleting"), 1400);
      }
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(word.slice(0, text.length - 1)), 40);
      } else {
        setIdx((i) => (i + 1) % ROLES.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [text, phase, idx]);
  return (
    <span className="px-2 py-0.5 border border-accent uppercase tracking-widest min-w-[18ch] inline-flex items-center">
      <span>{text}</span>
    </span>
  );
}


function Hero() {
  return (
    <section
      id="top"
      className="relative py-28 md:py-44 flex flex-col items-start border-b border-border-dim overflow-hidden"
    >
      <div className="scanline" />
      <div className="flex items-center gap-4 text-accent font-display text-sm md:text-base mb-6 animate-reveal flex-wrap">
        <TypewriterRole />
        <span className="flex items-center gap-2">
          <span className="size-2 bg-accent animate-pulse" />
          ACTIVE_SESSION
        </span>
        <span className="flex items-center gap-2 text-[var(--accent-green)]">
          <span className="size-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
          AVAILABLE
        </span>
      </div>

      <h1
        className="glitch-on font-display font-bold uppercase tracking-tighter leading-[0.85] text-6xl md:text-[9rem] lg:text-[12rem] mb-12 animate-reveal"
        style={{ animationDelay: "100ms" }}
      >
        Santiago
        <br />
        Sandili
      </h1>


      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full animate-reveal"
        style={{ animationDelay: "200ms" }}
      >
        <div className="space-y-5 max-w-[42ch]">
          <p className="text-xl md:text-2xl font-light text-pretty">
            Oriundo del interior del país, apasionado por la ciberseguridad y
            por aprender algo nuevo cada día. Enfocado en{" "}
            <span className="text-accent">Blue Team</span>: DFIR, SOC Operations y Malware Analysis.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Construyendo un camino desde laboratorios y scripts hacia
            operaciones de defensa reales.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4">
          <a
            href="https://assets.tryhackme.com/certification-certificate/69bb156d56eed3cbe3a712a6.pdf"
            target="_blank"
            rel="noreferrer"
            className="group relative block border-2 border-accent bg-accent/10 px-6 py-5 hover:bg-accent hover:text-background transition-colors w-full max-w-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 bg-accent group-hover:bg-background animate-pulse" />
              <span className="font-display text-[10px] uppercase tracking-[0.3em] text-accent group-hover:text-background">
                Certified
              </span>
            </div>
            <div className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight leading-none">
              SAL1
            </div>
            <div className="mt-2 font-display text-xs uppercase tracking-widest text-muted-foreground group-hover:text-background/80">
              TryHackMe · SOC Analyst Lvl 1
            </div>
            <div className="mt-3 font-display text-xs uppercase tracking-widest text-accent group-hover:text-background">
              Score 948 / 1000 →
            </div>
          </a>
          <div className="flex flex-col gap-1 font-display text-xs text-muted-foreground">
            <span>STATUS: DISPONIBLE</span>
            <span>BASE: TUC, AR.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} data-reveal className="py-24 border-b border-border-dim">
      <SectionHeader number={number} title={title} />
      {children}
    </section>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-5 md:gap-6 mb-16">
      <span className="font-mono text-xs md:text-sm text-accent/70 tracking-[0.2em]">
        {number}
      </span>
      <span aria-hidden className="h-px flex-none w-10 md:w-16 bg-gradient-to-r from-accent/60 to-transparent" />
      <h2 className="font-display text-3xl md:text-5xl uppercase font-semibold tracking-tight text-foreground leading-none">
        {title}
      </h2>
    </div>
  );
}





function ProjectRow({ project }: { project: Project }) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className="group py-10 border-t border-border-dim flex flex-col md:flex-row gap-8 hover:bg-surface/40 glow-progressive px-4 -mx-4"
    >
      <div className="w-full md:w-1/3">
        <div className="w-full aspect-video bg-surface border border-border-dim group-hover:border-accent/60 transition-colors relative overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            width={1280}
            height={720}
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity grayscale-[20%] group-hover:grayscale-0"
          />
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-multiply"
            style={{
              backgroundImage:
                "linear-gradient(var(--border-dim) 1px, transparent 1px), linear-gradient(90deg, var(--border-dim) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              opacity: 0.25,
            }}
          />
          <span className="absolute top-2 left-2 font-display text-[10px] uppercase tracking-widest text-accent bg-background/80 px-2 py-1 border border-accent/40">
            {project.label}
          </span>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-display text-2xl uppercase font-bold group-hover:text-accent transition-colors mb-4">
          {project.title}
        </h3>
        <p className="text-foreground/75 mb-6 max-w-2xl text-pretty">
          {project.description}
        </p>
        <span className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
          Ver repositorio <span className="text-accent text-xl">→</span>
        </span>
      </div>
    </a>
  );
}

function InvestigationCard({ item }: { item: Investigation }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="bg-background p-7 flex flex-col group hover:bg-accent/5 glow-progressive"
    >
      <div className="flex items-center justify-between mb-5">
        <span className="font-display text-[11px] text-accent tracking-widest">
          {item.id}
        </span>
        <span className="font-display text-[10px] tracking-widest px-2 py-1 border border-accent/40 text-accent/80">
          PUBLICADO
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {item.categories.map((c) => (
          <span
            key={c}
            className="px-2 py-1 bg-accent/10 text-[10px] font-display font-bold tracking-widest uppercase border border-accent/40 text-accent"
          >
            {c}
          </span>
        ))}
      </div>

      <span className="font-display text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        {item.platform}
      </span>
      <h3 className="font-display text-lg uppercase font-bold mb-3 group-hover:text-accent transition-colors leading-tight">
        {item.title}
      </h3>

      <p className="text-sm text-foreground/70 leading-relaxed mb-6 text-pretty">
        {item.summary}
      </p>

      <div className="flex items-center justify-between border-t border-border-dim pt-4 mt-auto">
        <span className="font-display text-[10px] tracking-widest text-muted-foreground">
          GITHUB.MD
        </span>
        <span className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-accent group-hover:gap-3 transition-all">
          Ver writeup <span className="text-base">→</span>
        </span>
      </div>
    </a>
  );
}

function InProgressRow({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="py-10 border-t border-dashed border-[var(--accent)]/40 flex flex-col md:flex-row gap-8 px-4 -mx-4 progress-shimmer">
      <div className="w-full md:w-1/3">
        <div className="w-full aspect-video bg-surface/40 border border-dashed border-[var(--accent)]/40 relative overflow-hidden flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(var(--border-dim) 1px, transparent 1px), linear-gradient(90deg, var(--border-dim) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              opacity: 0.25,
            }}
          />
          <span className="relative font-display text-[10px] uppercase tracking-[0.3em] text-[var(--accent)]">
            ◌ EN PROCESO
          </span>
          <span className="absolute top-2 left-2 font-display text-[10px] uppercase tracking-widest text-[var(--accent)] bg-background/80 px-2 py-1 border border-dashed border-[var(--accent)]/50">
            {label}
          </span>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-display text-2xl uppercase font-bold text-muted-foreground mb-4 inline-block">
          <span>{title}</span>
        </h3>
        <p className="text-foreground/60 mb-6 max-w-2xl text-pretty">
          {description}
        </p>
        <span className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-[var(--accent)]">
          Próximamente <span className="text-base">→</span>
        </span>
      </div>
    </div>
  );
}

function InProgressCard({
  code,
  title,
  hint,
}: {
  code: string;
  title: string;
  hint: string;
}) {
  return (
    <div className="bg-background p-7 flex flex-col border border-dashed border-[var(--accent)]/40 -m-px progress-shimmer">
      <div className="flex items-center justify-between mb-5">
        <span className="font-display text-[11px] text-[var(--accent)] tracking-widest">
          {code}
        </span>
        <span className="font-display text-[10px] tracking-widest px-2 py-1 border border-dashed border-[var(--accent)]/50 text-[var(--accent)]">
          ◌ EN PROCESO
        </span>
      </div>
      <h3 className="font-display text-lg uppercase font-bold mb-3 text-muted-foreground leading-tight inline-block">
        <span>{title}</span>
      </h3>
      <p className="text-sm text-foreground/50 leading-relaxed mb-6 text-pretty">
        {hint}
      </p>
      <div className="flex items-center justify-between border-t border-dashed border-[var(--accent)]/30 pt-4 mt-auto">
        <span className="font-display text-[10px] tracking-widest text-muted-foreground/70">
          PENDING.MD
        </span>
        <span className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-[var(--accent)]">
          Próximamente <span className="text-base">→</span>
        </span>
      </div>
    </div>
  );
}

function ContactSection() {
  const channels = [
    {
      code: "CHANNEL_01",
      label: "LinkedIn",
      value: "/in/santiagodsandili",
      href: LINKEDIN,
      cta: "Ver perfil",
      external: true,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 11.01-4.12 2.06 2.06 0 010 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
        </svg>
      ),
    },
    {
      code: "CHANNEL_02",
      label: "Email",
      value: EMAIL,
      href: `mailto:${EMAIL}`,
      cta: "Enviar mensaje",
      external: false,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
          <rect x="3" y="5" width="18" height="14" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      ),
    },
  ];
  return (
    <section id="contacto" data-reveal className="py-24 border-t border-border-dim">
      <SectionHeader number="06" title="Contacto" />
      <p className="font-display text-xs text-muted-foreground uppercase tracking-widest mb-8">
        ¡CONECTEMOS!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-dim border border-border-dim">
        {channels.map((c) => (
          <MagneticContactCard key={c.code} channel={c} />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <a
          href={GITHUB}
          target="_blank"
          rel="noreferrer"
          className="font-display text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent transition-colors"
        >
          GitHub · github.com/dsandili06 →
        </a>
      </div>
    </section>
  );
}

type Channel = {
  code: string;
  label: string;
  value: string;
  href: string;
  cta: string;
  external: boolean;
  icon: React.ReactNode;
};

function MagneticContactCard({ channel: c }: { channel: Channel }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <a
      ref={ref}
      href={c.href}
      {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="border-beam group bg-background p-8 flex flex-col hover:bg-accent/5 transition-all duration-200 ease-out will-change-transform"
    >
      <div className="flex items-center justify-between mb-8">
        <span className="font-display text-[10px] uppercase tracking-widest text-accent">
          {c.code}
        </span>
        <span className="text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[6deg]">
          {c.icon}
        </span>
      </div>
      <span className="font-display text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        {c.label}
      </span>
      <h3 className="font-display text-xl md:text-2xl font-bold mb-8 group-hover:text-accent transition-colors break-all">
        {c.value}
      </h3>
      <div className="flex items-center justify-between border-t border-border-dim pt-5 mt-auto">
        <span className="font-display text-[10px] tracking-widest text-muted-foreground">
          {c.external ? "EXTERNAL.LINK" : "MAILTO"}
        </span>
        <span className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-accent group-hover:gap-3 transition-all">
          {c.cta} <span className="text-base">→</span>
        </span>
      </div>
    </a>
  );
}

