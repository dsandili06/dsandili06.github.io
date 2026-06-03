import { createFileRoute } from "@tanstack/react-router";

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
};

type Investigation = {
  id: string;
  topic: string;
  title: string;
  description: string;
  date: string;
  status: "PUBLICADO" | "EN PROGRESO" | "DRAFT";
  tags: string[];
  href?: string;
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
  },
  {
    id: "02",
    title: "Blue Team Automation Scripts",
    stack: "POWERSHELL / PYTHON / BASH",
    description:
      "Scripts operacionales para DFIR y SOC: triage de endpoints, enumeración local, parseo de logs, integración con threat intel y plantillas de investigación rápida.",
    href: "https://github.com/dsandili06/blueteam-scripts",
    label: "AUTOMATION_BT.REPO",
  },
];

const INVESTIGATIONS: Investigation[] = [
  {
    id: "DFIR-LAB_001",
    topic: "DFIR / Threat Hunting",
    title: "Análisis de incidentes en SOC Practitioner Labs",
    description:
      "Recorrido por los laboratorios completados: triage de alertas, correlación de eventos en SIEM y reconstrucción de la línea de tiempo del atacante.",
    date: "EN PROGRESO",
    status: "EN PROGRESO",
    tags: ["SIEM", "TRIAGE", "MITRE ATT&CK"],
    href: "https://github.com/dsandili06/SOC-Practitioner-Labs",
  },
  {
    id: "MALWARE_002",
    topic: "Malware Analysis",
    title: "Próximo writeup: análisis estático y dinámico",
    description:
      "Informe en preparación sobre análisis de una muestra de malware: extracción de IOCs, comportamiento en sandbox y mapeo a técnicas ATT&CK.",
    date: "PRONTO",
    status: "DRAFT",
    tags: ["MALWARE", "IOC", "SANDBOX"],
  },
  {
    id: "BLUE-TEAM_003",
    topic: "Blue Team Automation",
    title: "Placeholder writeup automatización defensiva",
    description:
      "Espacio reservado para documentar un script o pipeline de detección. Se completará cuando el writeup esté listo para publicación.",
    date: "PRONTO",
    status: "DRAFT",
    tags: ["POWERSHELL", "DETECTION", "AUTOMATION"],
  },
];

const STACK = [
  "PYTHON",
  "POWERSHELL",
  "BASH",
  "SPLUNK / ELK",
  "WAZUH",
  "WIRESHARK",
  "MITRE ATT&CK",
  "LINUX HARDENING",
];

const FORMATION = [
  {
    title: "TryHackMe SOC Analyst Level 1",
    org: "TryHackMe · 2024",
    status: "COMPLETO",
    accent: true,
    href: "https://assets.tryhackme.com/certification-certificate/69bb156d56eed3cbe3a712a6.pdf",
  },
  {
    title: "CompTIA Security+",
    org: "En progreso",
    status: "[EN CURSO]",
  },
];

const EMAIL = "sdsandili06@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/santiagodsandili/";
const GITHUB = "https://github.com/dsandili06";

function Portfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Decorative vertical rails */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-dim border border-border-dim">
            {INVESTIGATIONS.map((i) => (
              <InvestigationCard key={i.id} item={i} />
            ))}
          </div>
        </Section>


        <section
          id="stack"
          className="py-24 border-b border-border-dim grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          <div>
            <SectionHeader number="03" title="Stack Técnico" />
            <div className="grid grid-cols-2 gap-3 font-display text-sm">
              {STACK.map((s) => (
                <div
                  key={s}
                  className="border-l-2 border-accent pl-4 py-2 bg-surface/40 uppercase tracking-wider"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div id="formacion">
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
          </div>
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
        <div className="w-full aspect-video bg-border-dim/20 grid place-items-center border border-border-dim group-hover:border-accent/50 transition-colors relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(var(--border-dim) 1px, transparent 1px), linear-gradient(90deg, var(--border-dim) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <span className="relative text-[10px] font-display uppercase tracking-widest text-foreground/40">
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
  const Wrapper: React.ElementType = item.href ? "a" : "div";
  const wrapperProps = item.href
    ? { href: item.href, target: "_blank", rel: "noreferrer" }
    : {};
  return (
    <Wrapper
      {...wrapperProps}
      className="bg-background p-8 group hover:bg-accent/5 transition-colors block"
    >
      <span className="font-display text-xs text-accent mb-4 block tracking-widest">
        {item.id}
      </span>
      <h3 className="font-display text-xl uppercase font-bold mb-4 group-hover:text-accent transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {item.description}
      </p>
      <div className="flex gap-3">
        <span className="px-2 py-1 bg-surface text-[10px] font-display tracking-widest">
          {item.date}
        </span>
        <span
          className={`px-2 py-1 bg-surface text-[10px] font-display tracking-widest ${
            item.tagAccent ? "text-accent font-bold" : ""
          }`}
        >
          {item.tag}
        </span>
      </div>
    </Wrapper>
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
