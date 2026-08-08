import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/primitives/Section";

export function About() {
  return (
    <Section id="about" number="01" title="About Me" kicker="PROFILE">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">
        <div className="space-y-6 text-[15px] md:text-base leading-relaxed text-foreground/80 max-w-[58ch]">
          <p>
            Soy Santiago Daniel Sandili, analista SOC Jr. orientado a{" "}
            <span className="text-[var(--accent)]">Blue Team</span> y DFIR. Me fui formando de
            manera práctica con laboratorios, writeups y herramientas reales para desarrollar una
            base sólida en detección, triage y respuesta a incidentes.
          </p>
          <p>
            Vengo del interior del país (Argentina) y estoy construyendo mi camino en ciberseguridad
            desde un enfoque práctico. Mi interés principal está en entender cómo se detecta,
            investiga y contiene una amenaza a partir de evidencia real.
          </p>
          <p>
            Me gusta trabajar sobre memoria, artefactos de Windows, tráfico de red, logs y casos de
            malware para reconstruir lo que pasó y sacar conclusiones útiles. Por eso mi foco hoy
            está en <span className="text-[var(--accent)]">Blue Team</span>.
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
