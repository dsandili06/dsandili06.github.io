import { useState } from "react";
import { Section } from "@/components/primitives/Section";
import { CERTIFICATIONS } from "@/data/certifications";
import { CertModal } from "@/components/CertModal";

export function Certs() {
  const [activeCert, setActiveCert] = useState<{ cert: string; title: string } | null>(null);
  const [modalCert, setModalCert] = useState<{ cert: string; title: string } | null>(null);

  const openCertificate = (cert: string, title: string) => {
    setModalCert({ cert, title });
    setActiveCert({ cert, title });
  };

  return (
    <Section id="formacion" number="05" title="Certificaciones" kicker="CREDENTIALS">
      <div className="flex flex-col gap-px bg-border-dim border border-border-dim">
        {CERTIFICATIONS.map((c) => {
          const obtained = c.status === "OBTENIDA";
          const accentColor = obtained ? "var(--accent-green)" : "var(--accent)";
          const isClickable = Boolean(c.href);
          const Wrapper: React.ElementType = isClickable ? "button" : "div";
          const wrapperProps = isClickable
            ? {
                type: "button" as const,
                onClick: () => c.href && openCertificate(c.href, c.title),
              }
            : {};

          return (
            <Wrapper
              key={c.code}
              {...wrapperProps}
              className={`group bg-[var(--surface)] p-7 md:p-9 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center transition-colors relative text-left w-full ${isClickable ? "hover:bg-[var(--surface-2)] cursor-pointer" : ""} ${c.featured ? "tactical-corner" : ""}`}
              style={{ borderLeft: `3px solid ${accentColor}` }}
            >
              <div>
                <div className="mb-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                    {c.year} · {c.org}
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl md:text-[2.25rem] leading-tight tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors">
                  {c.title}
                </h3>
                {c.note && (
                  <p className="mt-2 text-xs md:text-sm font-mono text-[var(--accent)]">
                    {c.note}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
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
                  ) : obtained && c.href ? (
                    <span className="inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] opacity-70 group-hover:opacity-100 transition-opacity">
                      VER CERTIFICADO →
                    </span>
                  ) : (
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                      ESTUDIO EN CURSO
                    </div>
                  )}
                </div>

                {c.logo && (
                  <div className="relative size-16 sm:size-20 md:size-24 shrink-0 flex items-center justify-center">
                    <img
                      src={c.logo}
                      alt={`Badge ${c.title}`}
                      className="size-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_16px_rgba(59,130,246,0.6)] group-hover:brightness-110 group-hover:scale-105 transition-all duration-300 ease-out pointer-events-none"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* Brillo reluciente sutil en la esquina superior derecha */}
                    <div
                      className="absolute top-0 right-0 sm:top-0.5 sm:right-0.5 pointer-events-none opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out"
                      aria-hidden="true"
                    >
                      {/* Halo suave de luz */}
                      <div className="absolute -inset-1 rounded-full bg-cyan-400/30 blur-sm" />
                      {/* Destello estelar reluciente */}
                      <svg
                        viewBox="0 0 24 24"
                        className="relative size-4 sm:size-5 text-white filter drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] transition-transform duration-700 ease-out group-hover:rotate-45"
                        fill="currentColor"
                      >
                        <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                      </svg>
                      {/* Micro destello secundario */}
                      <svg
                        viewBox="0 0 24 24"
                        className="absolute -bottom-1 -left-1 size-2 text-cyan-200 filter drop-shadow-[0_0_3px_rgba(103,232,249,0.8)] transition-transform duration-700 ease-out group-hover:-rotate-45"
                        fill="currentColor"
                      >
                        <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>

      {modalCert && (
        <CertModal
          cert={modalCert.cert}
          title={modalCert.title}
          isOpen={Boolean(activeCert)}
          onClose={() => setActiveCert(null)}
          onExitComplete={() => setModalCert(null)}
        />
      )}
    </Section>
  );
}
