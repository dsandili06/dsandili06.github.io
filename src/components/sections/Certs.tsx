import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/primitives/Section";
import { CERTIFICATIONS } from "@/data/certifications";

export function Certs() {
  return (
    <Section id="formacion" number="05" title="Certificaciones" kicker="CREDENTIALS">
      <div className="flex flex-col gap-px bg-border-dim border border-border-dim">
        {CERTIFICATIONS.map((c) => {
          const obtained = c.status === "OBTENIDA";
          const accentColor = obtained ? "var(--accent-green)" : "var(--accent)";
          const Wrapper: React.ElementType = c.href ? "a" : "div";
          const wrapperProps = c.href ? { href: c.href, target: "_blank", rel: "noreferrer" } : {};
          return (
            <Wrapper
              key={c.code}
              {...wrapperProps}
              className={`group bg-[var(--surface)] p-7 md:p-9 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center transition-colors relative ${c.href ? "hover:bg-[var(--surface-2)]" : ""} ${c.featured ? "tactical-corner" : ""}`}
              style={{ borderLeft: `3px solid ${accentColor}` }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {obtained ? (
                    <Badge variant="success" dot>
                      {c.featured ? `★ ${c.badge}` : c.badge}
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
