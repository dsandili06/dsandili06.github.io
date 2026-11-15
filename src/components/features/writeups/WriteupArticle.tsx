import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { INVESTIGATIONS } from "@/data/investigations";
import { getLenis } from "@/lib/lenis";
import type { Investigation } from "@/types";
import { parseToc, TOC_VISIBLE_THRESHOLD } from "@/components/features/writeups/writeupToc";
import { WriteupMarkdown } from "@/components/features/writeups/WriteupMarkdown";
import { WriteupTocPanel } from "@/components/features/writeups/WriteupTocPanel";
import { useWriteup } from "@/components/features/writeups/useWriteup";

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
  "group flex min-h-[44px] flex-col gap-1 border border-border-dim p-4 transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-10 md:py-12">
        <Link
          to="/writeups"
          className="mb-6 inline-flex min-h-[44px] items-center gap-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden /> Volver a writeups
        </Link>

        <header className="mb-8 max-w-4xl">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="border border-[var(--accent-green)]/50 px-2 py-0.5 font-mono text-label uppercase tracking-[0.12em] text-[var(--accent-green)]">
              {investigation.platform}
            </span>
            {investigation.categories.map((cat) => (
              <span
                key={cat}
                className="border border-border-dim px-2 py-0.5 font-mono text-label uppercase tracking-[0.15em] text-[var(--muted-foreground)]"
              >
                {cat}
              </span>
            ))}
          </div>
          <h1
            ref={titleRef}
            tabIndex={-1}
            className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground outline-none md:text-5xl"
          >
            {investigation.title}
          </h1>
          <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            {investigation.summary}
          </p>
        </header>

        {loading && (
          <div role="status" aria-live="polite" className="sr-only">
            Fetching writeup...
          </div>
        )}

        <div className={showToc ? "flex items-start gap-8" : ""}>
          <div
            className={`min-h-[200px] rounded border border-border-dim bg-[var(--surface-2)] ${
              showToc ? "min-w-0 flex-1" : "w-full max-w-[70ch]"
            }`}
          >
            {loading && (
              <div
                aria-hidden="true"
                className="flex flex-col items-center justify-center gap-3 py-20 text-[var(--muted-foreground)]"
              >
                <Loader2 size={24} className="animate-spin" />
                <span className="font-mono text-label uppercase tracking-[0.12em]">
                  Fetching writeup...
                </span>
              </div>
            )}
            {error && !loading && (
              <div
                role="alert"
                className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center"
              >
                <AlertTriangle size={24} className="text-[var(--accent-amber)]" />
                <span className="font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                  No se pudo cargar el writeup
                </span>
                <a
                  href={investigation.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[var(--accent)]/50 px-4 py-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
                >
                  <ExternalLink size={14} strokeWidth={1.5} /> Ver en GitHub
                </a>
                <button
                  onClick={retry}
                  className="font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)] underline underline-offset-2 transition-colors hover:text-foreground"
                >
                  Reintentar
                </button>
              </div>
            )}
            {md && (
              <div className="p-4 sm:p-6 md:p-10">
                <WriteupMarkdown
                  markdown={md}
                  investigationHref={investigation.href}
                  onOpenImage={setLightboxSrc}
                />
              </div>
            )}
          </div>

          {showToc && <WriteupTocPanel entries={toc} onSelect={scrollToHeading} />}
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <a
            href={investigation.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 py-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--accent)] hover:underline"
          >
            <ExternalLink size={12} strokeWidth={1.5} />
            Ver en GitHub →
          </a>
          <nav aria-label="Otros writeups" className="grid gap-4 sm:grid-cols-2">
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
                <span className="font-display text-lg font-bold text-foreground">{prev.title}</span>
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
                <span className="font-display text-lg font-bold text-foreground">{next.title}</span>
              </Link>
            )}
          </nav>
        </div>
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
