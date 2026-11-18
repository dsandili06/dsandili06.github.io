import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ExternalLink, AlertTriangle } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { INVESTIGATIONS } from "@/data/investigations";
import { SITE } from "@/data/site";
import { getLenis } from "@/lib/lenis";
import type { Investigation } from "@/types";
import { parseToc, TOC_VISIBLE_THRESHOLD } from "@/components/features/writeups/writeupToc";
import { WriteupMarkdown } from "@/components/features/writeups/WriteupMarkdown";
import { WriteupTocPanel } from "@/components/features/writeups/WriteupTocPanel";
import { useWriteup } from "@/components/features/writeups/useWriteup";
import { readingMinutes } from "@/components/features/writeups/writeupContent";

type WriteupArticleProps = {
  investigation: Investigation;
};

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const NAV_LINK_CLASS =
  "group flex min-h-[44px] flex-col gap-2 border-t border-border-dim py-6 transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

const SKELETON_WIDTHS = ["w-full", "w-11/12", "w-full", "w-4/5", "w-10/12", "w-2/3"];

const CAPTION_CLASS =
  "mt-3 border-l-2 border-[var(--accent)] pl-3 font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)]";

/** Editorial page for a single writeup. */
export function WriteupArticle({ investigation }: WriteupArticleProps) {
  const { markdown: md, loading, error, retry } = useWriteup(investigation, investigation.id);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const toc = useMemo(() => (md ? parseToc(md) : []), [md]);
  const showToc = toc.length >= TOC_VISIBLE_THRESHOLD;

  const index = INVESTIGATIONS.findIndex((i) => i.id === investigation.id);
  const prev = index > 0 ? INVESTIGATIONS[index - 1] : undefined;
  const next =
    index >= 0 && index < INVESTIGATIONS.length - 1 ? INVESTIGATIONS[index + 1] : undefined;

  // Move focus to the title on mount and when navigating between writeups.
  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [investigation.slug]);

  // Reading progress bar driven by window scroll (GPU transform, skipped for reduced motion).
  useEffect(() => {
    const bar = progressBarRef.current;
    if (!bar || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [md]);

  const scrollToHeading = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const reduced = prefersReducedMotion();
    const lenis = getLenis();
    if (lenis && !reduced) {
      lenis.scrollTo(target, { offset: -16 });
      return;
    }
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 16);
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }, []);

  return (
    <article aria-busy={loading}>
      <div className="fixed inset-x-0 top-0 z-40 h-[2px]" aria-hidden>
        <div
          ref={progressBarRef}
          className="h-full origin-left bg-[var(--accent)]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10 md:py-12">
        <Link
          to="/writeups"
          className="mb-8 inline-flex min-h-[44px] items-center gap-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden /> Volver a writeups
        </Link>

        <header className="max-w-5xl">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-label uppercase tracking-[0.14em]">
            <span className="text-[var(--accent-green)]">{investigation.platform}</span>
            <span aria-hidden className="text-[var(--muted-foreground)]">
              ·
            </span>
            <span className="text-[var(--muted-foreground)]">
              {investigation.categories.join(" / ")}
            </span>
            <span aria-hidden className="text-[var(--muted-foreground)]">
              ·
            </span>
            <span className="text-[var(--muted-foreground)]">{investigation.id}</span>
          </p>
          <h1
            ref={titleRef}
            tabIndex={-1}
            className="mt-5 max-w-[18ch] font-display text-4xl font-bold leading-[0.95] tracking-[-0.04em] text-foreground outline-none sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {investigation.title}
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-foreground/75 md:text-xl">
            {investigation.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-1 border-y border-border-dim py-3 font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            <span>Por {SITE.author}</span>
            {md && <span>{readingMinutes(md)} min de lectura</span>}
            <span>Fuente: {investigation.platform}</span>
          </div>
        </header>

        {investigation.visual && (
          <figure className="mt-10">
            <img
              src={investigation.visual.src}
              alt={investigation.visual.alt}
              loading="eager"
              decoding="async"
              className="h-auto w-full border border-border-dim"
            />
            <figcaption className={CAPTION_CLASS}>{investigation.visual.caption}</figcaption>
          </figure>
        )}

        {loading && (
          <div role="status" aria-live="polite" className="sr-only">
            Fetching writeup...
          </div>
        )}

        <div
          className={`mt-12 ${showToc ? "lg:grid lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16" : ""}`}
        >
          <div className="min-h-[200px] min-w-0 max-w-[68ch]">
            {loading && (
              <div aria-hidden="true" className="space-y-4 py-4">
                {SKELETON_WIDTHS.map((width, i) => (
                  <div
                    key={i}
                    className={`h-4 ${width} rounded bg-foreground/10 animate-pulse motion-reduce:animate-none`}
                  />
                ))}
              </div>
            )}
            {error && !loading && (
              <div
                role="alert"
                className="flex flex-col items-center justify-center gap-4 border border-border-dim px-6 py-20 text-center"
              >
                <AlertTriangle size={24} className="text-[var(--accent-amber)]" />
                <span className="font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                  No se pudo cargar el writeup
                </span>
                <a
                  href={investigation.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--accent)]/50 px-4 py-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <ExternalLink size={14} strokeWidth={1.5} /> Ver en GitHub
                </a>
                <button
                  onClick={retry}
                  className="min-h-[44px] font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)] underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  Reintentar
                </button>
              </div>
            )}
            {md && (
              <WriteupMarkdown
                markdown={md}
                investigationHref={investigation.href}
                onOpenImage={setLightboxSrc}
              />
            )}
          </div>

          {showToc && <WriteupTocPanel entries={toc} onSelect={scrollToHeading} />}
        </div>

        <footer className="mt-20">
          <div className="flex items-center gap-4" aria-hidden>
            <span className="h-px flex-1 bg-border-dim" />
            <span className="font-mono text-label uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              Fin del informe
            </span>
            <span className="h-px flex-1 bg-border-dim" />
          </div>
          <div className="mt-8 flex justify-center">
            <a
              href={investigation.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 py-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <ExternalLink size={12} strokeWidth={1.5} />
              Ver el original en GitHub
            </a>
          </div>
          <nav aria-label="Otros writeups" className="mt-12">
            <p className="mb-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              Sigue leyendo
            </p>
            <div className="grid gap-x-12 sm:grid-cols-2">
              {prev ? (
                <Link
                  to="/writeups/$slug"
                  params={{ slug: prev.slug }}
                  rel="prev"
                  className={NAV_LINK_CLASS}
                >
                  <span className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    <ArrowLeft size={12} aria-hidden /> Anterior
                  </span>
                  <span className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {prev.title}
                  </span>
                  <span className="line-clamp-2 text-sm text-[var(--muted-foreground)]">
                    {prev.summary}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  to="/writeups/$slug"
                  params={{ slug: next.slug }}
                  rel="next"
                  className={`${NAV_LINK_CLASS} sm:items-end sm:text-right`}
                >
                  <span className="inline-flex items-center gap-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    Siguiente <ArrowRight size={12} aria-hidden />
                  </span>
                  <span className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {next.title}
                  </span>
                  <span className="line-clamp-2 text-sm text-[var(--muted-foreground)]">
                    {next.summary}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </footer>
      </div>

      {/* Zoom lightbox for writeup screenshots — single slide: no prev/next arrows */}
      <Lightbox
        open={lightboxSrc !== null}
        close={() => setLightboxSrc(null)}
        slides={lightboxSrc ? [{ src: lightboxSrc }] : []}
        carousel={{ finite: true }}
        render={{ buttonPrev: () => null, buttonNext: () => null }}
        styles={{ container: { zIndex: 10000 } }}
      />
    </article>
  );
}
