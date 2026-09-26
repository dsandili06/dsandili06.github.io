import { motion } from "motion/react";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/primitives/Section";
import { PROJECTS } from "@/data/projects";

export function Proyectos() {
  return (
    <Section id="proyectos" number="03" title="Proyectos" kicker="REPOSITORIES" reveal="fade-scale">
      {/* Primary Projects Grid — Tactical Command Dossiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-6">
        {PROJECTS.map((p) => (
          <SpotlightCard
            key={p.id}
            className="group relative flex flex-col justify-between border border-[var(--accent)]/30 hover:border-[var(--accent)]/55 rounded-xs bg-[color-mix(in_oklab,var(--surface)_96%,transparent)] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_12px_36px_-6px_rgba(0,0,0,0.6)] hover:shadow-[inset_0_1px_0_0_rgba(59,130,246,0.18),0_16px_40px_-6px_rgba(0,0,0,0.65)] hover:z-10 transform-gpu backface-hidden will-change-transform active:scale-[0.99] active:duration-100 transition-all duration-300 ease-out overflow-hidden"
          >
            {/* Top ambient laser accent */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />

            {/* Tactical HUD Corner Brackets */}
            <span className="absolute top-0 left-0 size-2.5 border-t-2 border-l-2 border-[var(--accent)]/40 opacity-40 sm:opacity-0 group-hover:opacity-100 group-hover:border-[var(--accent)] transition-all duration-300 pointer-events-none z-20" />
            <span className="absolute top-0 right-0 size-2.5 border-t-2 border-r-2 border-[var(--accent)]/40 opacity-40 sm:opacity-0 group-hover:opacity-100 group-hover:border-[var(--accent)] transition-all duration-300 pointer-events-none z-20" />
            <span className="absolute bottom-0 left-0 size-2.5 border-b-2 border-l-2 border-[var(--accent)]/40 opacity-40 sm:opacity-0 group-hover:opacity-100 group-hover:border-[var(--accent)] transition-all duration-300 pointer-events-none z-20" />
            <span className="absolute bottom-0 right-0 size-2.5 border-b-2 border-r-2 border-[var(--accent)]/40 opacity-40 sm:opacity-0 group-hover:opacity-100 group-hover:border-[var(--accent)] transition-all duration-300 pointer-events-none z-20" />

            {/* Dossier Visual Header Banner */}
            {p.image && (
              <div className="relative h-44 sm:h-52 w-full overflow-hidden border-b border-border-dim/60 bg-black/50 transform-gpu backface-hidden">
                <img
                  src={p.image}
                  alt={`Visualización táctica de ${p.title}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center opacity-80 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none transform-gpu backface-hidden will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/30 to-transparent" />
                <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)] font-bold bg-[#07080A]/90 px-2.5 py-1 border border-border-dim backdrop-blur-xs shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    PRJ_{p.id}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[var(--accent-green)]/50 text-[var(--accent-green)] bg-[#07080A]/90 backdrop-blur-xs shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
                    PUBLIC REPO
                  </span>
                </div>
              </div>
            )}

            {/* Dossier Body Content */}
            <div className="relative z-2 flex flex-col justify-between flex-1 p-4 sm:p-6 md:p-8">
              <div>
                {!p.image && (
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)] font-bold">
                      PRJ_{p.id}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[var(--accent-green)]/50 text-[var(--accent-green)] bg-[var(--surface-2)]/60 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
                      PUBLIC REPO
                    </span>
                  </div>
                )}

                <h3 className="font-display font-bold text-2xl leading-tight tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors mb-3">
                  {p.title}
                </h3>

                <p className="text-sm text-foreground/85 leading-relaxed mb-4">{p.description}</p>

                {/* Bento Metrics Strip */}
                {p.metrics && (
                  <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-[color-mix(in_oklab,var(--surface-2)_75%,transparent)] backdrop-blur-xs border border-border-dim/70 rounded-xs group-hover:border-[var(--accent)]/30 transition-colors duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                    {p.metrics.map((m) => (
                      <div key={m.label} className="min-w-0">
                        <div className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] truncate">
                          {m.label}
                        </div>
                        <div className="font-mono text-[11px] sm:text-xs font-semibold text-foreground truncate mt-0.5">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Verified Tactical Modules / Scripts */}
                {p.scripts && (
                  <div className="space-y-1.5 mt-4 mb-2">
                    <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--muted-foreground)] flex items-center gap-2 mb-2">
                      <span>{p.modulesLabel || "ARSENAL_MODULES"}</span>
                      <span className="h-px flex-1 bg-border-dim/60" />
                    </div>
                    {p.scripts.map((s) => (
                      <div
                        key={s.name}
                        className="group/item relative flex items-start gap-2.5 p-2 rounded-xs bg-[var(--surface-2)]/40 border border-border-dim/40 hover:border-[var(--accent)]/50 hover:bg-[color-mix(in_oklab,var(--accent)_3.5%,var(--surface-2))] transition-all duration-200 ease-out hover:z-10 transform-gpu backface-hidden"
                      >
                        {s.lang ? (
                          <span className="font-mono text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-2xs border border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/10 shrink-0 mt-0.5">
                            {s.lang.toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-[var(--accent)] font-mono text-xs select-none shrink-0 mt-0.5 px-0.5 group-hover/item:translate-x-0.5 transition-transform duration-200 ease-out transform-gpu">
                            ›
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-mono text-[11.5px] font-semibold text-foreground/90 truncate group-hover/item:text-[var(--accent)] transition-colors duration-200">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-foreground/70 leading-snug line-clamp-1">
                            {s.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dossier Footer Actions */}
              <div className="mt-6 pt-4 border-t border-border-dim flex flex-wrap items-center justify-between gap-3">
                {p.inPageHref ? (
                  <a
                    href={p.inPageHref}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors duration-200 min-h-[44px] py-2"
                  >
                    <span>{p.inPageLabel || "VER CASOS"}</span>
                    <span>↓</span>
                  </a>
                ) : (
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                    AUTOMATION // TOOLKIT
                  </span>
                )}

                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Ver repositorio ${p.title} en GitHub`}
                  className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] hover:text-white transition-colors duration-200 group/link min-h-[44px] py-2 cursor-pointer"
                >
                  <span>VER REPO</span>
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 ease-out transform-gpu">
                    →
                  </span>
                </a>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* WIP Card — Minimalist with Animated Loading Bar */}
      <div className="border border-dashed border-[var(--accent)]/40 hover:border-[var(--accent)]/70 rounded-xs bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.04),_transparent_65%)] bg-[var(--surface)] p-4 sm:p-6 md:p-8 transition-all duration-300 ease-out relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[inset_0_1px_0_0_rgba(59,130,246,0.15),0_12px_36px_rgba(0,0,0,0.5)] hover:z-10 transform-gpu backface-hidden">
        {/* Tactical Corner HUD Accents */}
        <span className="absolute top-0 left-0 size-3 border-t-2 border-l-2 border-[var(--accent)]/50 opacity-40 sm:opacity-60 pointer-events-none" />
        <span className="absolute top-0 right-0 size-3 border-t-2 border-r-2 border-[var(--accent)]/50 opacity-40 sm:opacity-60 pointer-events-none" />
        <span className="absolute bottom-0 left-0 size-3 border-b-2 border-l-2 border-[var(--accent)]/50 opacity-40 sm:opacity-60 pointer-events-none" />
        <span className="absolute bottom-0 right-0 size-3 border-b-2 border-r-2 border-[var(--accent)]/50 opacity-40 sm:opacity-60 pointer-events-none" />

        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)] font-bold">
                PRJ_03
              </span>
              <Badge variant="warning" dot>
                EN PROCESO
              </Badge>
            </div>

            <h3 className="font-display font-bold text-2xl leading-tight tracking-tight text-foreground/90 mb-2">
              Próximo proyecto en construcción
            </h3>

            <p className="text-sm text-foreground/75 leading-relaxed">
              Desarrollo en curso de herramientas defensivas y telemetría de laboratorio.
            </p>

            {/* Cybernetic Animated Loading Bar — Steady & Calm */}
            <div className="mt-6 mb-2">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] mb-2.5">
                <span className="flex items-center gap-2">
                  <span className="inline-block size-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  PIPELINE // ACTIVE
                </span>
                <span className="text-[var(--accent)] font-semibold font-mono">68%</span>
              </div>

              <div
                className="h-2.5 w-full bg-[var(--surface-2)] border border-border-dim/90 rounded-xs overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
                role="progressbar"
                aria-label="Progreso del próximo proyecto"
              >
                <div className="h-full bg-gradient-to-r from-[var(--accent)]/60 via-[var(--accent)] to-cyan-400 relative rounded-xs w-[68%]">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border-dim flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
            <span className="text-[var(--muted-foreground)]">ESTADO: EN DESARROLLO</span>
            <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-[var(--accent)]/60" />
              REPOSITORY // ACTIVE
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}
