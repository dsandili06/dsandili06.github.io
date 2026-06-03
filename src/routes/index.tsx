import { createFileRoute } from "@tanstack/react-router";
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
  stack: string;
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
    stack: "WAZUH / ELK / SPLUNK",
    description:
      "Compilado de laboratorios prácticos de SOC: investigación de incidentes, análisis de alertas, detección de TTPs y ejercicios de threat hunting sobre entornos simulados.",
    href: "https://github.com/dsandili06/SOC-Practitioner-Labs",
    label: "LABS_SOC.REPO",
    image: socLabsImg,
  },
  {
    id: "02",
    title: "Blue Team Automation Scripts",
    stack: "POWERSHELL / PYTHON / BASH",
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
    title: "3CX Supply Chain",
    platform: "CyberDefenders",
    summary:
      "Análisis del ataque de cadena de suministro al cliente 3CX: trazado del binario troyanizado, C2 e IOCs asociados a la campaña.",
    categories: ["Threat Intel", "Malware Analysis"],
    href: CD_BASE + "3CX-Supply%20Chain.md",
  },
  {
    id: "LAB_002",
    title: "Brave",
    platform: "CyberDefenders",
    summary:
      "Forense sobre artefactos del navegador Brave para reconstruir la actividad del usuario: historial, descargas y sesiones.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "Brave.md",
  },
  {
    id: "LAB_003",
    title: "FakeGPT",
    platform: "CyberDefenders",
    summary:
      "Investigación de una extensión maliciosa que se hace pasar por ChatGPT, análisis estático del paquete y exfiltración de cookies.",
    categories: ["Malware Analysis", "Threat Intel"],
    href: CD_BASE + "FakeGPT.md",
  },
  {
    id: "LAB_004",
    title: "Insider",
    platform: "CyberDefenders",
    summary:
      "Caso de amenaza interna: análisis de artefactos del endpoint para reconstruir las acciones del empleado y la fuga de información.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "Insider.md",
  },
  {
    id: "LAB_005",
    title: "Kraken Keylogger",
    platform: "CyberDefenders",
    summary:
      "Análisis dinámico y estático de un keylogger .NET: persistencia, captura de teclas y canal de exfiltración por SMTP.",
    categories: ["Malware Analysis"],
    href: CD_BASE + "KrakenKeylogger.md",
  },
  {
    id: "LAB_006",
    title: "Lockdown",
    platform: "CyberDefenders",
    summary:
      "Triage de un host comprometido por ransomware: identificación de la familia, vector de entrada y artefactos de cifrado.",
    categories: ["Endpoint Forensics", "Malware Analysis"],
    href: CD_BASE + "Lockdown.md",
  },
  {
    id: "LAB_007",
    title: "Oski",
    platform: "CyberDefenders",
    summary:
      "Análisis de memoria con Volatility sobre una infección de Oski Stealer: procesos, conexiones y credenciales robadas.",
    categories: ["Malware Analysis"],
    href: CD_BASE + "Oski.md",
  },
  {
    id: "LAB_008",
    title: "PsExec Hunt",
    platform: "CyberDefenders",
    summary:
      "Threat hunting de movimiento lateral con PsExec: detección de servicios, eventos 4624/7045 y mapeo a MITRE ATT&CK.",
    categories: ["Endpoint Forensics", "Threat Hunting"],
    href: CD_BASE + "PsExec-Hunt.md",
  },
  {
    id: "LAB_009",
    title: "RamnIt",
    platform: "CyberDefenders",
    summary:
      "Estudio del worm Ramnit: mecanismos de propagación, infección de ejecutables y comunicación con su C2.",
    categories: ["Malware Analysis"],
    href: CD_BASE + "RamnIt.md",
  },
  {
    id: "LAB_010",
    title: "Red Stealer",
    platform: "CyberDefenders",
    summary:
      "Análisis del infostealer Red Line: extracción de configuración, navegadores objetivo y datos exfiltrados.",
    categories: ["Malware Analysis"],
    href: CD_BASE + "Red%20Stealer.md",
  },
  {
    id: "LAB_011",
    title: "Silent Breach",
    platform: "CyberDefenders",
    summary:
      "Análisis de PCAPs para reconstruir una intrusión silenciosa: protocolos sospechosos, beaconing y exfiltración.",
    categories: ["Network Forensics"],
    href: CD_BASE + "Silent%20Breach.md",
  },
  {
    id: "LAB_012",
    title: "SysInternals",
    platform: "CyberDefenders",
    summary:
      "Uso de la suite SysInternals para triage de un endpoint Windows: procesos, autoruns y handles sospechosos.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "SysInternals.md",
  },
  {
    id: "LAB_013",
    title: "TheCrime",
    platform: "CyberDefenders",
    summary:
      "Investigación forense de un caso criminal a partir de la imagen del disco: timeline, archivos eliminados y evidencia clave.",
    categories: ["Endpoint Forensics"],
    href: CD_BASE + "TheCrime.md",
  },
  {
    id: "LAB_014",
    title: "Web Investigation",
    platform: "CyberDefenders",
    summary:
      "Análisis de logs de servidor web para identificar enumeración, payloads de explotación y origen del atacante.",
    categories: ["Network Forensics"],
    href: CD_BASE + "Web%20Investigation.md",
  },
  {
    id: "LAB_015",
    title: "WebStrike",
    platform: "CyberDefenders",
    summary:
      "Investigación de un ataque web sobre PCAP: identificación del vector, payload entregado y reconstrucción de la sesión.",
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
    title: "Cyber Incident Response and Digital Forensics",
    org: "LinkedIn Learning",
  },
  {
    n: "08",
    title: "CompTIA Security+ (SY0-701) Cert Prep",
    org: "LinkedIn Learning",
  },
  { n: "09", title: "SOC L1 BOOTCAMP", org: "ComunidadDojo" },
];

const EMAIL = "sdsandili06@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/santiagodsandili/";
const GITHUB = "https://github.com/dsandili06";

function Portfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
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
          </div>
        </Section>

        <Section id="investigaciones" number="02" title="Investigaciones">
          <p className="font-display text-xs text-muted-foreground uppercase tracking-widest mb-8">
            Writeups · CyberDefenders Labs · {INVESTIGATIONS.length} reportes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-dim border border-border-dim">
            {INVESTIGATIONS.map((i) => (
              <InvestigationCard key={i.id} item={i} />
            ))}
          </div>
        </Section>

        <section
          id="stack"
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
          className="py-24 border-b border-border-dim"
        >
          <SectionHeader number="04" title="Formación" />
          <ul className="flex flex-col">
            {FORMATION.map((f) => (
              <li
                key={f.title}
                className="flex justify-between items-start border-b border-border-dim py-5 gap-6"
              >
                <div>
                  {f.href ? (
                    <a
                      href={f.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold uppercase hover:text-accent transition-colors"
                    >
                      {f.title}
                    </a>
                  ) : (
                    <h4 className="font-bold uppercase">{f.title}</h4>
                  )}
                  <span className="block text-xs text-muted-foreground font-display mt-1">
                    {f.org}
                  </span>
                </div>
                <span
                  className={`text-xs font-display font-bold whitespace-nowrap ${
                    f.accent ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {f.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="cursos" className="py-24 border-b border-border-dim">
          <SectionHeader number="05" title="Cursos Completados" />
          <p className="font-display text-xs text-muted-foreground uppercase tracking-widest mb-8">
            Ruta cronológica · {COURSES.length} cursos
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
          </ol>
        </section>

        <ContactFooter />
      </main>

      <LogBar />
    </div>
  );
}

function Nav() {
  const links = [
    { href: "#proyectos", label: "Proyectos" },
    { href: "#investigaciones", label: "Investigaciones" },
    { href: "#stack", label: "Stack" },
    { href: "#cursos", label: "Cursos" },
    { href: "#contacto", label: "Contacto" },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border-dim">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-display text-xs tracking-widest">
        <a href="#top" className="text-accent font-bold">
          SANDILI // BLUE TEAM
        </a>
        <div className="hidden md:flex gap-8 uppercase">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-accent transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="py-28 md:py-44 flex flex-col items-start border-b border-border-dim overflow-hidden"
    >
      <div className="flex items-center gap-4 text-accent font-display text-sm md:text-base mb-6 animate-reveal">
        <span className="px-2 py-0.5 border border-accent uppercase tracking-widest">
          SOC Analyst
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2 bg-accent animate-pulse" />
          ACTIVE_SESSION
        </span>
      </div>

      <h1
        className="font-display font-bold uppercase tracking-tighter leading-[0.85] text-6xl md:text-[9rem] lg:text-[12rem] mb-12 animate-reveal"
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
            <span className="text-accent">Blue Team</span>: DFIR, threat hunting
            y análisis de malware.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Construyendo un camino desde laboratorios y scripts hacia
            operaciones de defensa reales. Este portfolio es la bitácora de ese
            recorrido.
          </p>
        </div>
        <div className="flex flex-col gap-2 font-display text-sm text-muted-foreground">
          <span>LAT: -34.6037</span>
          <span>LONG: -58.3816</span>
          <span>SECTOR: BUENOS_AIRES_AR</span>
          <span>STATUS: DEFENSIVE_OPERATIONS</span>
          <a
            href="https://assets.tryhackme.com/certification-certificate/69bb156d56eed3cbe3a712a6.pdf"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-2 border border-accent text-accent px-3 py-1.5 uppercase tracking-widest text-xs hover:bg-accent hover:text-background transition-colors"
          >
            THM SAL1 · Certificado →
          </a>
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
    <section id={id} className="py-24 border-b border-border-dim">
      <SectionHeader number={number} title={title} />
      {children}
    </section>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-12">
      <span className="font-display font-bold text-5xl md:text-7xl text-accent/20">
        {number}
      </span>
      <h2 className="font-display text-2xl md:text-4xl uppercase font-bold tracking-tight">
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
      className="group py-10 border-t border-border-dim flex flex-col md:flex-row gap-8 hover:bg-surface/40 transition-colors px-4 -mx-4"
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
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="font-display text-2xl uppercase font-bold group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <span className="font-display text-xs text-muted-foreground mt-2 whitespace-nowrap">
            {project.stack}
          </span>
        </div>
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
      className="bg-background p-7 flex flex-col group hover:bg-accent/5 transition-colors"
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

function ContactFooter() {
  return (
    <footer id="contacto" className="pt-24 pb-40 border-t border-border-dim">
      <div className="flex flex-col items-center text-center">
        <span className="font-display text-xs text-accent mb-8 uppercase tracking-[0.3em]">
          Establecer Conexión
        </span>
        <a
          href={`mailto:${EMAIL}`}
          className="font-display text-3xl md:text-6xl lg:text-7xl font-bold uppercase hover:text-accent transition-colors break-all underline decoration-accent/30 decoration-4 underline-offset-8"
        >
          {EMAIL}
        </a>
        <div className="mt-16 flex flex-wrap justify-center gap-10 font-display text-sm uppercase tracking-widest">
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="hover:text-accent transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}

function LogBar() {
  const items = [
    "SYSTEM READY",
    "DEFENSIVE_MODE: ON",
    "THREAT_LEVEL: LOW",
    "ENCRYPTED_COMMS_ENABLED",
    "SANTIAGO_SANDILI_PORTFOLIO_V2.0.0",
    `© ${new Date().getFullYear()} SANTIAGO SANDILI`,
  ];
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="fixed bottom-0 left-0 w-full bg-accent text-background z-50 overflow-hidden border-t border-accent">
      <div
        className="whitespace-nowrap font-display text-[10px] font-bold flex gap-8 py-1 px-4"
        style={{ animation: "marquee 40s linear infinite", width: "max-content" }}
      >
        {loop.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}
