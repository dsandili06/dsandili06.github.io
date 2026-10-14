import { useEffect, useCallback, useRef, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useOverlayLifecycle } from "@/hooks/useOverlayLifecycle";
import { useModalHistory } from "@/hooks/useModalHistory";
import { X, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { investigationById } from "@/components/features/writeups/writeupSource";
import { parseToc, TOC_VISIBLE_THRESHOLD } from "@/components/features/writeups/writeupToc";
import { WriteupMarkdown } from "@/components/features/writeups/WriteupMarkdown";
import { WriteupTocPanel } from "@/components/features/writeups/WriteupTocPanel";
import { useWriteup } from "@/components/features/writeups/useWriteup";

type WriteupModalProps = {
  investigationId: string;
  isOpen?: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
};

export function WriteupModal({
  investigationId,
  isOpen = true,
  onClose,
  onExitComplete,
}: WriteupModalProps) {
  const panelRef = useFocusTrap<HTMLDivElement>();
  const { handleClose } = useModalHistory({
    isOpen,
    onClose,
    stateData: { modal: "writeup", id: investigationId },
  });
  const { overlayRef } = useOverlayLifecycle({
    isOpen,
    onEscape: () => {
      if (lightboxSrc) return false;
      handleClose();
      return true;
    },
  });
  const panelLifecycleRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef(node);
      overlayRef(node);
    },
    [panelRef, overlayRef],
  );
  const investigation = investigationById(investigationId);
  const { markdown: md, loading, error, retry } = useWriteup(investigation, investigationId);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const title = investigation?.title || investigationId;
  const platform = investigation?.platform;
  const categories = investigation?.categories;
  const summary = investigation?.summary;
  const toc = useMemo(() => (md ? parseToc(md) : []), [md]);
  const showToc = toc.length >= TOC_VISIBLE_THRESHOLD;

  // Reading progress — scaleX bar at the top of the panel (GPU transform)
  const handleBodyScroll = useCallback(() => {
    const el = bodyScrollRef.current;
    const bar = progressBarRef.current;
    if (!el || !bar) return;
    const max = el.scrollHeight - el.clientHeight;
    bar.style.transform = `scaleX(${max > 0 ? el.scrollTop / max : 0})`;
  }, []);

  useEffect(() => {
    handleBodyScroll();
  }, [md, handleBodyScroll]);

  const scrollToHeading = useCallback((id: string) => {
    const target = document.getElementById(id);
    const container = bodyScrollRef.current;
    if (!target || !container) return;
    const targetRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const targetOffset = targetRect.top - containerRect.top + container.scrollTop;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    container.scrollTo({
      top: Math.max(0, targetOffset - 16),
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, []);

  return createPortal(
    <>
      <AnimatePresence onExitComplete={onExitComplete}>
        {isOpen && (
          <motion.div
            key="writeup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
            style={{ background: "rgba(4, 7, 11, 0.9)", backdropFilter: "blur(12px)" }}
            onClick={handleClose}
          >
            {loading && (
              <div role="status" aria-live="polite" className="sr-only">
                Fetching writeup...
              </div>
            )}
            <motion.div
              ref={panelLifecycleRef}
              key="writeup-panel"
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-7xl flex flex-col"
              style={{ maxHeight: "100dvh" }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="writeup-title"
              aria-busy={loading}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-4 md:px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-3 shrink-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                      {investigationId}
                    </span>
                    {platform && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 border border-[var(--accent-green)]/50 text-[var(--accent-green)]">
                        {platform}
                      </span>
                    )}
                    {categories?.map((cat) => (
                      <span
                        key={cat}
                        className="font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 border border-border-dim text-[var(--muted-foreground)]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h2
                    id="writeup-title"
                    className="font-display font-bold text-2xl md:text-3xl leading-tight tracking-tight text-foreground"
                  >
                    {title}
                  </h2>
                  {summary && (
                    <p className="mt-1.5 text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed max-w-4xl">
                      {summary}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Cerrar"
                  className="shrink-0 ml-4 flex items-center justify-center size-11 min-h-[44px] min-w-[44px] border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Reading progress — top edge of the panel */}
              <div className="absolute top-0 left-0 right-0 h-[2px] z-10" aria-hidden>
                <div
                  ref={progressBarRef}
                  className="h-full bg-[var(--accent)] origin-left"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>

              {/* Body — data-lenis-prevent lets native touch scroll work inside
                the modal while Lenis is stopped (body scroll stays locked) */}
              <div
                ref={bodyScrollRef}
                data-lenis-prevent
                onScroll={handleBodyScroll}
                className="flex-1 overflow-y-auto px-4 md:px-6 pb-6"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <div className={showToc ? "flex items-start gap-6" : ""}>
                  <div
                    className={`border border-border-dim rounded bg-[#0B1118] min-h-[200px] ${
                      showToc ? "flex-1 min-w-0" : ""
                    }`}
                  >
                    {loading && (
                      <div
                        aria-hidden="true"
                        className="flex flex-col items-center justify-center gap-3 py-20 text-[var(--muted-foreground)]"
                      >
                        <Loader2 size={24} className="animate-spin" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
                          Fetching writeup...
                        </span>
                      </div>
                    )}
                    {error && !loading && investigation && (
                      <div
                        role="alert"
                        className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center"
                      >
                        <AlertTriangle size={24} className="text-[var(--accent-amber)]" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                          No se pudo cargar el writeup
                        </span>
                        <a
                          href={investigation.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] px-4 py-2 border border-[var(--accent)]/50 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                        >
                          <ExternalLink size={14} strokeWidth={1.5} /> Ver en GitHub
                        </a>
                        <button
                          onClick={retry}
                          className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] hover:text-foreground transition-colors underline underline-offset-2"
                        >
                          Reintentar
                        </button>
                      </div>
                    )}
                    {!investigation && !loading && (
                      <div
                        role="alert"
                        className="flex flex-col items-center justify-center gap-4 py-20 text-center"
                      >
                        <AlertTriangle size={24} className="text-[var(--accent-amber)]" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                          Writeup no encontrado
                        </span>
                      </div>
                    )}
                    {md && (
                      <div className="p-4 sm:p-6 md:p-10 max-w-none">
                        <WriteupMarkdown
                          markdown={md}
                          investigationHref={investigation?.href || ""}
                          onOpenImage={setLightboxSrc}
                        />
                      </div>
                    )}
                  </div>

                  {/* TOC — sticky index for long writeups (desktop only) */}
                  {showToc && <WriteupTocPanel entries={toc} onSelect={scrollToHeading} />}
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between px-4 md:px-6 pb-[max(1rem,env(safe-area-inset-bottom))] shrink-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  <span className="md:hidden">Tocá fuera para cerrar</span>
                  <span className="hidden md:inline">ESC para cerrar</span>
                </span>
                {investigation && (
                  <a
                    href={investigation.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-[44px] py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] hover:underline"
                  >
                    <ExternalLink size={12} strokeWidth={1.5} />
                    Ver en GitHub →
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Zoom lightbox for writeup screenshots — single slide: no prev/next arrows */}
      <Lightbox
        open={lightboxSrc !== null}
        close={() => setLightboxSrc(null)}
        slides={lightboxSrc ? [{ src: lightboxSrc }] : []}
        carousel={{ finite: true }}
        render={{ buttonPrev: () => null, buttonNext: () => null }}
        styles={{ container: { zIndex: 10000 } }}
      />
    </>,
    document.body,
  );
}
