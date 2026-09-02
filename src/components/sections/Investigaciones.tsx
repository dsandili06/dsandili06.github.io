import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, LayoutGrid, Table } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/primitives/Section";
import { INVESTIGATIONS, FEATURED_INVESTIGATIONS } from "@/data/investigations";
import { lazy, Suspense } from "react";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import Autoplay from "embla-carousel-autoplay";

// Lazy: react-markdown (~250KB) solo se descarga al abrir un writeup
const WriteupModal = lazy(() =>
  import("@/components/WriteupModal").then((m) => ({ default: m.WriteupModal })),
);

export function Investigaciones() {
  const [viewMode, setViewMode] = useState<"carousel" | "table">(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
      ? "table" // mobile lands on the compact table format
      : "carousel",
  );
  const [writeupId, setWriteupId] = useState<string | null>(null);

  // Reduced motion: no autoplay plugin
  const prefersReduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true, slidesToScroll: 1 },
    prefersReduced
      ? []
      : [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0); // restarts progress bar per slide
  const [paused, setPaused] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setProgressKey((k) => k + 1);
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
            <SpotlightCard
              key={i.id}
              className="group flex flex-col justify-between min-h-[270px] border border-[var(--accent)]/30 hover:border-[var(--accent)] transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => setWriteupId(i.id)}
                className="flex flex-col justify-between h-full p-6 bg-[var(--surface)] hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--surface))] transition-colors text-left w-full"
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
              </button>
            </SpotlightCard>
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
              / {String(INVESTIGATIONS.length + 1).padStart(2, "0")}
            </span>
            {/* Autoplay progress bar — restarts on every slide change */}
            <div className="relative h-[2px] flex-1 bg-border-dim overflow-hidden" aria-hidden>
              {!prefersReduced && (
                <div
                  key={progressKey}
                  className="absolute inset-0 bg-[var(--accent)] origin-left"
                  style={{ animation: "autoplay-progress 2.5s linear infinite" }}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  emblaApi?.plugins().autoplay?.stop();
                  setPaused(true);
                }}
                aria-label="Pausar carrusel automático"
                className={`flex items-center justify-center size-10 border transition-colors ${
                  paused
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)]"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <rect x="2" y="1" width="4" height="12" rx="1" />
                  <rect x="8" y="1" width="4" height="12" rx="1" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  emblaApi?.plugins().autoplay?.play();
                  setPaused(false);
                }}
                aria-label="Reanudar carrusel automático"
                className={`flex items-center justify-center size-10 border transition-colors ${
                  !paused
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)]"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <polygon points="2,1 13,7 2,13" />
                </svg>
              </button>
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Anterior"
                className="flex items-center justify-center size-10 border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Siguiente"
                className="flex items-center justify-center size-10 border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
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
                <button
                  type="button"
                  onClick={() => setWriteupId(i.id)}
                  className="group flex flex-col justify-between h-full p-6 bg-[var(--surface)] border border-border-dim hover:border-[var(--accent)]/60 hover:bg-[color-mix(in_oklab,var(--accent)_4%,var(--surface))] transition-all duration-200 text-left w-full cursor-pointer"
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
                </button>
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
          <div className="hidden md:block overflow-x-auto border border-border-dim">
            <div className="grid grid-cols-[56px_1.2fr_1fr_120px_100px_52px] gap-3 px-5 py-3 border-b border-border-dim font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] items-center">
              <div>N°</div>
              <div>CASO</div>
              <div>CATEGORÍA</div>
              <div>PLATAFORMA</div>
              <div>ESTADO</div>
              <div></div>
            </div>
            {INVESTIGATIONS.map((i) => (
              <button
                type="button"
                key={i.id}
                onClick={() => setWriteupId(i.id)}
                className="group grid grid-cols-[56px_1.2fr_1fr_120px_100px_52px] gap-3 items-start px-5 py-4 border-b border-border-dim last:border-b-0 w-full text-left transition-colors hover:bg-[color-mix(in_oklab,var(--accent)_4%,transparent)] cursor-pointer"
                title={i.summary}
              >
                <div className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted-foreground)] tabular-nums pt-0.5">
                  {i.id.replace("LAB_", "")}
                </div>
                <div className="font-display font-semibold text-foreground text-[15px] tracking-tight leading-snug pt-0.5 group-hover:text-[var(--accent)] transition-colors">
                  {i.title}
                </div>
                <div className="flex flex-wrap gap-1">
                  {i.categories.map((c) => (
                    <span
                      key={c}
                      className="font-mono text-[9px] uppercase tracking-[0.2em] px-1.5 py-0.5 border border-border-dim text-foreground/70 leading-tight"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] pt-0.5">
                  {i.platform}
                </div>
                <div className="pt-0.5">
                  <Badge variant="success" dot className="text-[10px]">
                    PUBLICADO
                  </Badge>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] opacity-0 max-md:opacity-100 group-hover:opacity-100 transition-opacity pt-0.5 text-right">
                  VER →
                </div>
              </button>
            ))}
            <div className="grid grid-cols-[56px_1.2fr_1fr_120px_100px_52px] gap-3 items-center px-5 py-4 border-t border-dashed border-[var(--accent)]/30 opacity-50">
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
              <button
                type="button"
                key={i.id}
                onClick={() => setWriteupId(i.id)}
                className="group border-t border-border-dim py-3 first:border-t-0 text-left w-full cursor-pointer hover:bg-[color-mix(in_oklab,var(--accent)_4%,transparent)] transition-colors px-4 -mx-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 shrink-0 font-mono text-[10px] tracking-[0.2em] text-[var(--muted-foreground)] tabular-nums">
                    {i.id.replace("LAB_", "")}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-display font-semibold text-[14px] tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors">
                    {i.title}
                  </span>
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)]">
                    VER →
                  </span>
                </div>
                <div className="mt-1 pl-10 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  {i.platform} · {i.categories.join(" · ")}
                </div>
              </button>
            ))}
            <div className="border-t border-dashed border-[var(--accent)]/30 py-3 opacity-60 px-4 -mx-4">
              <div className="flex items-center gap-3">
                <span className="w-7 shrink-0 font-mono text-[10px] tracking-[0.2em] text-[var(--accent)] tabular-nums">
                  016
                </span>
                <span className="min-w-0 flex-1 truncate font-display font-semibold text-[14px] tracking-tight text-foreground/70">
                  Próximo writeup CyberDefenders
                </span>
                <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[var(--accent)]/50 text-[var(--accent)]">
                  EN PROCESO
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {writeupId && (
        <Suspense fallback={null}>
          <WriteupModal investigationId={writeupId} onClose={() => setWriteupId(null)} />
        </Suspense>
      )}
    </Section>
  );
}
