import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { INVESTIGATIONS } from "@/data/investigations";

type LabsCarouselProps = {
  onOpen: (id: string) => void;
};

/**
 * Auto-playing horizontal carousel of ALL lab writeups.
 * Featured cases above stay static — this strip cycles every case.
 * Autoplay pauses on hover and for reduced-motion users.
 */
export function LabsCarousel({ onOpen }: LabsCarouselProps) {
  const reduced = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true, slidesToScroll: 1 },
    reduced.current
      ? []
      : [
          Autoplay({
            delay: 3500,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);
  const [progressKey, setProgressKey] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setProgressKey((k) => k + 1); // restart progress bar on slide change
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="mb-14 md:mb-16">
      <div className="flex items-center gap-4 mb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent)]">
          ALL_CASES
        </span>
        <span className="h-px flex-1 bg-border-dim" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          {String(INVESTIGATIONS.length).padStart(2, "0")} TOTAL // AUTO_ROTATE
        </span>
      </div>

      <div className="relative">
        <div className="labs-carousel__viewport" ref={emblaRef}>
          <div className="labs-carousel__container">
            {INVESTIGATIONS.map((i) => (
              <div key={i.id} className="labs-carousel__slide">
                <button
                  type="button"
                  onClick={() => onOpen(i.id)}
                  className="spotlight-card group flex h-full w-full flex-col justify-between border border-border-dim bg-[var(--surface)] p-5 text-left transition-colors hover:border-[var(--accent)]/60"
                >
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] tracking-[0.25em] text-[var(--muted-foreground)]">
                        {i.id}
                      </span>
                      <span className="font-mono text-[8px] uppercase tracking-[0.15em] px-1.5 py-0.5 border border-border-dim text-foreground/60">
                        {i.platform}
                      </span>
                    </div>
                    <h4 className="font-display font-semibold text-[15px] leading-snug tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors">
                      {i.title}
                    </h4>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="truncate font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
                      {i.categories.join(" · ")}
                    </span>
                    <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                      VER →
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canPrev}
          aria-label="Caso anterior"
          className="flex items-center justify-center w-8 h-8 border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
        <div className="labs-carousel__progress" aria-hidden>
          <div
            key={progressKey}
            className="labs-carousel__progress-fill"
            style={reduced.current ? { transform: "scaleX(0.5)" } : undefined}
          />
        </div>
        <button
          type="button"
          onClick={scrollNext}
          disabled={!canNext}
          aria-label="Caso siguiente"
          className="flex items-center justify-center w-8 h-8 border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors disabled:opacity-30"
        >
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
        <span className="font-mono text-[10px] tabular-nums text-[var(--muted-foreground)]">
          {String(selectedIndex + 1).padStart(2, "0")}/
          {String(INVESTIGATIONS.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
