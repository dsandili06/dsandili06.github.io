import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, LayoutGrid, Table } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/primitives/Section";
import { INVESTIGATIONS, FEATURED_INVESTIGATIONS } from "@/data/investigations";

export function Investigaciones() {
  const [viewMode, setViewMode] = useState<"carousel" | "table">("carousel");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <Section id="investigaciones" number="03" title="Investigaciones" kicker="CASE_LOG">
      <div className="mb-14 md:mb-16">
        <div className="flex items-center gap-4 mb-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)]">
            FEATURED_CASES
          </span>
          <span className="h-px flex-1 bg-border-dim" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            HANDPICKED // 03
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {FEATURED_INVESTIGATIONS.map((i, idx) => (
            <a
              key={i.id}
              href={i.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between min-h-[270px] p-6 bg-[var(--surface)] border border-[var(--accent)]/30 hover:border-[var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--surface))] transition-all duration-200 tactical-corner"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-5">
                  <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)] font-bold">
                    SPOTLIGHT_0{idx + 1}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[var(--accent-green)]/50 text-[var(--accent-green)]">
                    {i.id}
                  </span>
                </div>
                <h3 className="font-display font-bold text-2xl leading-tight tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors mb-3">
                  {i.title}
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {i.categories.map((c) => (
                    <span
                      key={c}
                      className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-border-dim text-foreground/70"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-foreground/70 leading-relaxed">{i.summary}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-dim flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                <span className="text-[var(--muted-foreground)]">{i.platform}</span>
                <span className="text-[var(--accent)] group-hover:translate-x-1 transition-transform">
                  VER WRITEUP →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
          FULL_CASE_LOG
        </span>
        <span className="h-px flex-1 bg-border-dim" />
      </div>

      {/* Top Bar / Controls */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-2 border border-border-dim p-1 bg-[var(--surface)]">
          <button
            type="button"
            onClick={() => setViewMode("carousel")}
            aria-pressed={viewMode === "carousel"}
            className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
              viewMode === "carousel"
                ? "bg-[var(--accent)] text-[var(--accent-foreground)] font-bold"
                : "text-[var(--muted-foreground)] hover:text-foreground"
            }`}
          >
            <LayoutGrid size={13} />
            <span>Carrusel</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            aria-pressed={viewMode === "table"}
            className={`flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
              viewMode === "table"
                ? "bg-[var(--accent)] text-[var(--accent-foreground)] font-bold"
                : "text-[var(--muted-foreground)] hover:text-foreground"
            }`}
          >
            <Table size={13} />
            <span>Tabla</span>
          </button>
        </div>

        {viewMode === "carousel" && (
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] hidden sm:inline-block">
              CASO{" "}
              <span className="text-foreground font-bold">
                {String(selectedIndex + 1).padStart(2, "0")}
              </span>{" "}
              / {String(INVESTIGATIONS.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                aria-label="Anterior"
                className="flex items-center justify-center size-9 border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] disabled:opacity-30 disabled:hover:border-border-dim disabled:hover:text-[var(--muted-foreground)] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                aria-label="Siguiente"
                className="flex items-center justify-center size-9 border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] disabled:opacity-30 disabled:hover:border-border-dim disabled:hover:text-[var(--muted-foreground)] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Content */}
      {viewMode === "carousel" ? (
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {INVESTIGATIONS.map((i) => (
              <div
                key={i.id}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
              >
                <a
                  href={i.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col justify-between h-full p-6 bg-[var(--surface)] border border-border-dim hover:border-[var(--accent)]/60 hover:bg-[color-mix(in_oklab,var(--accent)_4%,var(--surface))] transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 gap-2">
                      <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)] font-bold">
                        {i.id}
                      </span>
                      <Badge variant="success" dot>
                        PUBLICADO
                      </Badge>
                    </div>
                    <h3 className="font-display font-bold text-xl leading-snug tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors mb-3">
                      {i.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {i.categories.map((c) => (
                        <span
                          key={c}
                          className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-border-dim text-foreground/70"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs md:text-sm text-foreground/65 leading-relaxed line-clamp-4">
                      {i.summary}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-dim flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                    <span className="text-[var(--muted-foreground)]">{i.platform}</span>
                    <span className="text-[var(--accent)] group-hover:translate-x-1 transition-transform">
                      VER WRITEUP →
                    </span>
                  </div>
                </a>
              </div>
            ))}

            {/* WIP Card */}
            <div className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4">
              <div className="flex flex-col justify-between h-full p-6 bg-[var(--surface)]/50 border border-dashed border-[var(--accent)]/30 opacity-75">
                <div>
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)] font-bold">
                      LAB_016
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[var(--accent)]/50 text-[var(--accent)]">
                      EN PROCESO
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl leading-snug tracking-tight text-foreground/70 mb-3">
                    Próximo writeup CyberDefenders
                  </h3>
                  <p className="text-xs md:text-sm text-foreground/50 leading-relaxed">
                    Investigación forense en desarrollo. El análisis y la documentación de
                    artefactos estarán disponibles próximamente.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border-dim flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                  <span className="text-[var(--muted-foreground)]">CyberDefenders</span>
                  <span className="text-[var(--accent)]/60">WIP.LOG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Classic Table View */}
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
                <h3 className="font-display font-semibold text-lg tracking-tight mb-1">
                  {i.title}
                </h3>
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
                <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)]">
                  LAB_016
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[var(--accent)]/50 text-[var(--accent)]">
                  EN PROCESO
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg tracking-tight">
                Próximo writeup CyberDefenders
              </h3>
            </div>
          </div>
        </>
      )}
    </Section>
  );
}
