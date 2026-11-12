import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Table,
  Play,
  Pause,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CornerBrackets } from "@/components/ui/CornerBrackets";
import { ACTION_SECONDARY_CLASS } from "@/components/ui/actionLinkStyles";
import { Section } from "@/components/primitives/Section";
import { INVESTIGATIONS, FEATURED_INVESTIGATIONS } from "@/data/investigations";
import { openWriteup } from "@/components/features/modals/modalRequests";
import Autoplay from "embla-carousel-autoplay";

type AutoplayPluginType = {
  isPlaying?: () => boolean;
  play?: () => void;
  stop?: () => void;
};

const CASE_LOG_ID = "investigaciones-case-log";

export function Investigaciones() {
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<"carousel" | "table">(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
      ? "table" // mobile lands on the compact table format
      : "carousel",
  );

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
  const [isPlaying, setIsPlaying] = useState(!prefersReduced);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay as AutoplayPluginType | undefined;
    if (!autoplay) {
      setIsPlaying((p) => !p);
      return;
    }
    const playing = autoplay.isPlaying ? autoplay.isPlaying() : isPlaying;
    if (playing) {
      autoplay.stop?.();
      setIsPlaying(false);
    } else {
      autoplay.play?.();
      setIsPlaying(true);
    }
  }, [emblaApi, isPlaying]);

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
    <Section id="investigaciones" number="04" title="Investigaciones" kicker="CASE_LOG">
      <div className="mb-14 md:mb-16">
        <div className="flex items-center gap-4 mb-5">
          <span className="font-mono text-label uppercase tracking-[0.14em] text-[var(--accent)]">
            FEATURED_CASES
          </span>
          <span className="h-px flex-1 bg-border-dim" />
          <span className="font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            HANDPICKED // 03
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
          {FEATURED_INVESTIGATIONS[0] && (
            <article className="group relative min-w-0 overflow-hidden rounded-xs border border-border-dim bg-[var(--surface)] text-left shadow-card transition-[border-color,box-shadow] duration-300 hover:border-[var(--accent)]/50 hover:shadow-card-hover">
              <span className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/70 to-transparent" />
              <CornerBrackets corners={["tl", "br"]} className="border-[var(--accent)]/70" />
              <div className="grid min-h-full grid-cols-1 md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
                <div className="relative z-10 flex flex-col justify-between p-5 sm:p-7">
                  <div>
                    <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-label uppercase tracking-[0.12em]">
                      <span className="text-[var(--accent)]">01 / CASO PRINCIPAL</span>
                      <span className="text-[var(--muted-foreground)]">·</span>
                      <span className="text-[var(--muted-foreground)]">
                        {FEATURED_INVESTIGATIONS[0].id}
                      </span>
                    </div>
                    <p className="mb-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--accent-green)]">
                      {FEATURED_INVESTIGATIONS[0].platform} /{" "}
                      {FEATURED_INVESTIGATIONS[0].categories[0]}
                    </p>
                    <h3 className="mb-4 font-display text-3xl font-bold leading-[1.05] tracking-[-0.035em] text-foreground transition-colors group-hover:text-[var(--accent-secondary)] sm:text-4xl">
                      {FEATURED_INVESTIGATIONS[0].title}
                    </h3>
                    <p className="max-w-[38ch] text-sm leading-relaxed text-foreground/80">
                      {FEATURED_INVESTIGATIONS[0].summary}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-8 inline-flex min-h-11 w-full items-center justify-between gap-3 border-t border-border-dim pt-3 font-mono text-label uppercase tracking-[0.12em] text-[var(--accent)]"
                  >
                    <span>VER CASO</span>
                    <span className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                      →
                    </span>
                  </span>
                </div>

                {FEATURED_INVESTIGATIONS[0].visual && (
                  <figure className="relative flex min-w-0 flex-col justify-end overflow-hidden border-t border-border-dim bg-[var(--background)] md:border-l md:border-t-0">
                    <img
                      src={FEATURED_INVESTIGATIONS[0].visual.src}
                      alt={FEATURED_INVESTIGATIONS[0].visual.alt}
                      width={1280}
                      height={720}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="aspect-[16/9] w-full object-cover object-top opacity-85 transition-[opacity,transform] duration-500 group-hover:scale-[1.02] group-hover:opacity-100 md:aspect-auto md:h-full md:min-h-[300px] motion-reduce:transform-none motion-reduce:transition-none"
                    />
                    <figcaption className="flex min-h-11 items-center justify-between gap-3 border-t border-border-dim bg-[var(--surface)]/95 px-4 py-2 font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                      <span>{FEATURED_INVESTIGATIONS[0].visual.caption}</span>
                      <span aria-hidden="true" className="shrink-0 text-[var(--accent-green)]">
                        CONCEPTUAL
                      </span>
                    </figcaption>
                  </figure>
                )}
              </div>
              <button
                type="button"
                onClick={() => openWriteup(FEATURED_INVESTIGATIONS[0].id)}
                aria-label={`Abrir investigación: ${FEATURED_INVESTIGATIONS[0].title}`}
                className="absolute inset-0 z-20 size-full cursor-pointer rounded-xs bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]"
              >
                <span className="sr-only">SPOTLIGHT_01</span>
              </button>
            </article>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {FEATURED_INVESTIGATIONS.slice(1).map((i, idx) => (
              <article
                key={i.id}
                className="group relative flex min-h-[184px] min-w-0 flex-col justify-between overflow-hidden border-l-2 border-[var(--accent)]/40 bg-[var(--surface)] p-5 text-left transition-[background-color,border-color] duration-200 hover:border-[var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_5%,var(--surface))]"
              >
                <span
                  className="pointer-events-none absolute -right-2 -top-5 font-mono text-7xl font-bold tracking-tighter text-white/[0.035]"
                  aria-hidden="true"
                >
                  {i.id.replace("LAB_", "")}
                </span>
                <span className="relative z-10 mb-3 flex items-center justify-between gap-3 font-mono text-label uppercase tracking-[0.12em]">
                  <span className="text-[var(--accent)]">{i.id}</span>
                  <span className="font-body text-sm normal-case tracking-normal text-[var(--muted-foreground)]">
                    {i.platform}
                  </span>
                </span>
                <span className="relative z-10">
                  <span className="mb-2 block font-display text-xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-[var(--accent-secondary)]">
                    {i.title}
                  </span>
                  <span className="mb-3 block font-mono text-label uppercase tracking-[0.14em] text-[var(--accent-green)]">
                    {i.categories.join(" / ")}
                  </span>
                  <span className="line-clamp-2 block text-xs leading-relaxed text-foreground/75">
                    {i.summary}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="relative z-10 mt-4 flex min-h-11 items-end justify-between border-t border-border-dim pt-2 font-mono text-label uppercase tracking-[0.12em] text-[var(--accent)]"
                >
                  <span>VER CASO</span>
                  <span className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                    →
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => openWriteup(i.id)}
                  aria-label={`Abrir caso: ${i.title}`}
                  className="absolute inset-0 z-20 size-full cursor-pointer bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]"
                >
                  <span className="sr-only">SPOTLIGHT_0{idx + 2}</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls={CASE_LOG_ID}
        className={ACTION_SECONDARY_CLASS}
      >
        {expanded ? "Ocultar casos" : `Ver los ${INVESTIGATIONS.length} casos`}
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <div id={CASE_LOG_ID}>
        {expanded && (
          <div className="mt-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
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
                  className={`flex items-center gap-2 min-h-[44px] px-3.5 py-2.5 font-mono text-label uppercase tracking-[0.12em] transition-colors ${
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
                  className={`flex items-center gap-2 min-h-[44px] px-3.5 py-2.5 font-mono text-label uppercase tracking-[0.12em] transition-colors ${
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
                  <span className="font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)] hidden sm:inline-block">
                    CASO{" "}
                    <span className="text-foreground font-bold">
                      {String(selectedIndex + 1).padStart(2, "0")}
                    </span>{" "}
                    / {String(INVESTIGATIONS.length + 1).padStart(2, "0")}
                  </span>
                  {/* Autoplay progress bar — restarts on every slide change */}
                  <div
                    className="relative h-[2px] flex-1 bg-border-dim overflow-hidden"
                    aria-hidden
                  >
                    {!prefersReduced && isPlaying && (
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
                      onClick={toggleAutoplay}
                      aria-label={
                        isPlaying ? "Pausar carrusel automático" : "Reanudar carrusel automático"
                      }
                      aria-pressed={!isPlaying}
                      className="flex items-center justify-center size-11 min-h-[44px] min-w-[44px] border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={scrollPrev}
                      aria-label="Anterior"
                      className="flex items-center justify-center size-11 min-h-[44px] min-w-[44px] border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={scrollNext}
                      aria-label="Siguiente"
                      className="flex items-center justify-center size-11 min-h-[44px] min-w-[44px] border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer"
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
                      className="relative hover:z-10 flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
                    >
                      <button
                        type="button"
                        onClick={() => openWriteup(i.id)}
                        className="group relative flex flex-col justify-between h-full p-6 rounded-xs bg-[var(--surface)] border border-border-dim hover:border-[var(--accent)]/50 hover:bg-[var(--surface-2)] shadow-card hover:shadow-card-hover hover:z-10 transform-gpu backface-hidden will-change-transform active:scale-[0.985] active:duration-100 transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out text-left w-full cursor-pointer overflow-hidden"
                      >
                        {/* Top ambient highlight line */}
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)]/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

                        <div>
                          <div className="flex items-center justify-between mb-4 gap-2">
                            <span className="font-mono text-label tracking-[0.14em] text-[var(--accent)] font-bold">
                              {i.id}
                            </span>
                            <Badge variant="success" dot>
                              PUBLICADO
                            </Badge>
                          </div>
                          <h3 className="font-display font-bold text-xl leading-snug tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors duration-200 mb-3">
                            {i.title}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mb-3.5 min-h-[22px]">
                            {i.categories.map((c) => (
                              <span
                                key={c}
                                className="inline-flex items-center justify-center font-mono text-label uppercase tracking-[0.14em] px-2.5 py-1 rounded-xs border border-border-dim/80 bg-[var(--surface-2)]/50 group-hover:border-[var(--accent)]/30 group-hover:text-foreground group-hover:bg-[var(--surface-2)]/80 text-foreground/80 transition-colors whitespace-nowrap text-center leading-none"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs md:text-sm text-foreground/80 leading-relaxed mb-4">
                            {i.summary}
                          </p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border-dim flex items-center justify-between font-mono text-label uppercase tracking-[0.14em]">
                          <span className="font-body text-sm normal-case tracking-normal text-[var(--muted-foreground)]">
                            {i.platform}
                          </span>
                          <span className="text-[var(--accent)] group-hover:translate-x-1 transition-transform duration-200 ease-out transform-gpu">
                            VER WRITEUP →
                          </span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Classic Table View */}
                <div className="hidden md:block overflow-x-auto border border-border-dim">
                  <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,2fr)] gap-4 px-5 py-3 border-b border-border-dim font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)] items-center">
                    <div>LAB</div>
                    <div>CATEGORÍA</div>
                    <div>SOBRE EL LAB</div>
                  </div>
                  {INVESTIGATIONS.map((i) => (
                    <button
                      type="button"
                      key={i.id}
                      onClick={() => openWriteup(i.id)}
                      className="group relative grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,2fr)] gap-4 items-start px-5 py-4 border-b border-border-dim last:border-b-0 w-full text-left transition-colors duration-200 ease-out hover:bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] hover:z-10 transform-gpu backface-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-[var(--accent)] before:opacity-0 hover:before:opacity-100 focus-visible:before:opacity-100 before:transition-opacity"
                      title={i.summary}
                    >
                      <div className="font-display font-semibold text-foreground text-[15px] tracking-tight leading-snug pt-0.5 group-hover:text-[var(--accent)] transition-colors duration-200">
                        {i.title}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {i.categories.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center justify-center font-mono text-label uppercase tracking-[0.14em] px-2 py-0.5 rounded-xs border border-border-dim/80 text-foreground/80 whitespace-nowrap text-center leading-none"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 text-sm leading-relaxed text-foreground/75">
                        <span aria-hidden="true" className="font-mono text-[var(--accent)]">
                          •
                        </span>
                        <span>{i.summary}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="md:hidden flex flex-col">
                  {INVESTIGATIONS.map((i) => (
                    <button
                      type="button"
                      key={i.id}
                      onClick={() => openWriteup(i.id)}
                      className="group relative border-t border-border-dim w-full px-3 py-3.5 rounded-xs first:border-t-0 text-left cursor-pointer hover:bg-[color-mix(in_oklab,var(--accent)_6%,transparent)] hover:z-10 transform-gpu backface-hidden transition-colors duration-200 ease-out before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[2px] before:bg-[var(--accent)] before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                    >
                      <span className="min-w-0 truncate font-display font-semibold text-[14px] tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors duration-200">
                        {i.title}
                      </span>
                      <span className="mt-1 block font-mono text-label uppercase tracking-[0.12em] text-[var(--accent-green)]">
                        {i.categories.join(" · ")}
                      </span>
                      <span className="mt-2 flex gap-2 pl-0.5 text-xs leading-relaxed text-foreground/70">
                        <span aria-hidden="true" className="font-mono text-[var(--accent)]">
                          •
                        </span>
                        <span>{i.summary}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
