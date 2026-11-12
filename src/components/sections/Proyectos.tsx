import { SpotlightCard } from "@/components/fx/SpotlightCard";
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
            className="group relative flex flex-col justify-between border border-border-dim hover:border-[var(--accent)]/50 rounded-xs bg-[var(--surface)] shadow-card hover:shadow-card-hover hover:z-10 transform-gpu backface-hidden will-change-transform active:scale-[0.99] active:duration-100 transition-[border-color,box-shadow,transform] duration-300 ease-out overflow-hidden"
          >
            {/* Top ambient laser accent */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />

            {/* Dossier Visual Header Banner */}
            {p.image && (
              <div className="relative h-44 sm:h-52 w-full overflow-hidden border-b border-border-dim/60 bg-black/50 transform-gpu backface-hidden">
                <img
                  src={p.image}
                  alt={`Visualización táctica de ${p.title}`}
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center opacity-80 group-hover:scale-105 group-hover:opacity-95 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none transform-gpu backface-hidden will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/30 to-transparent" />
                <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                  <span className="font-mono text-label tracking-[0.14em] text-[var(--accent)] font-bold bg-[var(--surface)] px-2.5 py-1 border border-border-dim shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                    PRJ_{p.id}
                  </span>
                  <span className="font-mono text-label uppercase tracking-[0.12em] px-2 py-0.5 border border-[var(--accent-green)]/50 text-[var(--accent-green)] bg-[var(--surface)] shadow-[0_2px_8px_rgba(0,0,0,0.5)] flex items-center gap-1.5">
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
                    <span className="font-mono text-label tracking-[0.14em] text-[var(--accent)] font-bold">
                      PRJ_{p.id}
                    </span>
                    <span className="font-mono text-label uppercase tracking-[0.12em] px-2 py-0.5 border border-[var(--accent-green)]/50 text-[var(--accent-green)] bg-[var(--surface-2)]/60 flex items-center gap-1.5">
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
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))] gap-x-3 gap-y-3 my-4 p-3 bg-[var(--surface-2)] border border-border-dim/70 rounded-xs group-hover:border-[var(--accent)]/30 transition-colors duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                    {p.metrics.map((m) => (
                      <div key={m.label} className="min-w-0">
                        <div className="font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)] break-words">
                          {m.label}
                        </div>
                        <div className="font-body text-sm font-semibold text-foreground leading-snug break-words mt-0.5">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Verified Tactical Modules / Scripts */}
                {p.scripts && (
                  <div className="space-y-1.5 mt-4 mb-2">
                    <div className="font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)] flex items-center gap-2 mb-2">
                      <span>{p.modulesLabel || "ARSENAL_MODULES"}</span>
                      <span className="h-px flex-1 bg-border-dim/60" />
                    </div>
                    {p.scripts.map((s) => (
                      <div
                        key={s.name}
                        className="group/item relative flex items-start gap-2.5 p-2 rounded-xs bg-[var(--surface-2)] border border-border-dim/40 hover:border-[var(--accent)]/50 hover:bg-[color-mix(in_oklab,var(--accent)_3.5%,var(--surface-2))] transition-colors duration-200 ease-out hover:z-10 transform-gpu backface-hidden"
                      >
                        {s.lang ? (
                          <span className="font-mono text-label uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-2xs border border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/10 shrink-0 mt-0.5">
                            {s.lang.toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-[var(--accent)] font-mono text-xs select-none shrink-0 mt-0.5 px-0.5 group-hover/item:translate-x-0.5 transition-transform duration-200 ease-out transform-gpu">
                            ›
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="font-mono text-label font-semibold text-foreground/90 truncate group-hover/item:text-[var(--accent)] transition-colors duration-200">
                            {s.name}
                          </div>
                          <div className="text-meta text-foreground/70 leading-snug line-clamp-1">
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
                    className="inline-flex items-center gap-1.5 font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors duration-200 min-h-[44px] py-2"
                  >
                    <span>{p.inPageLabel || "VER CASOS"}</span>
                    <span>↓</span>
                  </a>
                ) : (
                  <span className="font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    AUTOMATION // TOOLKIT
                  </span>
                )}

                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Ver repositorio ${p.title} en GitHub`}
                  className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--accent)] hover:text-white transition-colors duration-200 group/link min-h-[44px] py-2 cursor-pointer"
                >
                  <span>VER REPOSITORIO</span>
                  <span className="group-hover/link:translate-x-1 transition-transform duration-200 ease-out transform-gpu">
                    →
                  </span>
                </a>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </Section>
  );
}
