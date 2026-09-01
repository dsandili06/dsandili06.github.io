import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { X, ExternalLink, Loader2, AlertTriangle, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { ComponentProps, ReactNode } from "react";
import { INVESTIGATIONS } from "@/data/investigations";
import type { Investigation } from "@/types";

/** Recursively extracts plain text from React children (highlighted code included). */
function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

/** Copy-to-clipboard button shown on hover over writeup code blocks. */
function CopyCodeButton({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(extractText(children));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label="Copiar comando"
      className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-1 rounded border border-border-dim bg-[#0D1117]/90 text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] opacity-0 group-hover/code:opacity-100 focus:opacity-100 transition-opacity"
    >
      {copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={1.5} />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

type TocEntry = { depth: number; text: string; id: string };

/**
 * Extracts h2/h3 entries from the raw markdown. Uses the same github-slugger
 * over ALL headings (in document order) as rehype-slug does, so ids match.
 */
function parseToc(md: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];
  for (const line of md.split("\n")) {
    const m = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!m) continue;
    const depth = m[1].length;
    const raw = m[2].replace(/[*_`~]/g, "").trim();
    const id = slugger.slug(raw);
    if (depth === 2 || depth === 3) toc.push({ depth, text: raw, id });
  }
  return toc;
}
function investigationById(id: string): Investigation | undefined {
  return INVESTIGATIONS.find((i) => i.id === id);
}

function toRawUrl(githubUrl: string): string {
  return githubUrl
    .replace("https://github.com/", "https://raw.githubusercontent.com/")
    .replace("/blob/", "/");
}

function getImageBaseUrl(githubUrl: string): string {
  const raw = githubUrl
    .replace("https://github.com/", "https://raw.githubusercontent.com/")
    .replace("/blob/", "/");
  const lastSlash = raw.lastIndexOf("/");
  return raw.slice(0, lastSlash + 1);
}

function resolveImageUri(uri: string, githubUrl: string): string {
  if (/^https?:\/\//.test(uri)) return uri;
  const base = getImageBaseUrl(githubUrl);
  const cleaned = uri.replace(/^\.?\//, "");
  return base + cleaned;
}

type MarkdownComponents = ComponentProps<typeof ReactMarkdown>["components"];

type WriteupModalProps = {
  investigationId: string;
  onClose: () => void;
};
export function WriteupModal({ investigationId, onClose }: WriteupModalProps) {
  const panelRef = useFocusTrap<HTMLDivElement>();
  const investigation = investigationById(investigationId);
  const [md, setMd] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const cacheKey = `writeup-${investigationId}`;
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const fetchWriteup = useCallback(async () => {
    if (!investigation) {
      setLoading(false);
      setError(true);
      return;
    }
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setMd(cached);
      setLoading(false);
      return;
    }
    try {
      const rawUrl = toRawUrl(investigation.href);
      const res = await fetch(rawUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      sessionStorage.setItem(cacheKey, text);
      setMd(text);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [investigation, cacheKey]);

  useEffect(() => {
    fetchWriteup();
  }, [fetchWriteup]);

  // Pause Lenis smooth scroll while modal is open; resume on close
  useEffect(() => {
    const lenis = (window as unknown as Record<string, unknown>).__lenis as
      | { stop: () => void; start: () => void }
      | undefined;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, []);

  // ESC to close (but only the modal — lightbox handles its own ESC first)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !lightboxSrc) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, lightboxSrc]);
  const title = investigation?.title || investigationId;
  const platform = investigation?.platform;
  const categories = investigation?.categories;
  const summary = investigation?.summary;
  const toc = useMemo(() => (md ? parseToc(md) : []), [md]);
  const showToc = toc.length >= 4;

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

  const components: MarkdownComponents = {
    img: ({ src, alt, ...props }) => {
      const resolved = src ? resolveImageUri(src, investigation?.href || "") : src;
      return (
        <img
          src={resolved}
          alt={alt || ""}
          loading="lazy"
          decoding="async"
          onClick={() => resolved && setLightboxSrc(resolved)}
          className="writeup-img max-w-full h-auto rounded border border-border-dim my-4"
          {...props}
        />
      );
    },
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-[var(--accent)] hover:underline"
        {...props}
      >
        {children}
      </a>
    ),
    h1: ({ children, ...props }) => (
      <h1
        className="font-display font-bold text-3xl md:text-4xl leading-tight tracking-tight text-foreground mt-8 mb-4"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="font-display font-bold text-2xl md:text-3xl leading-tight tracking-tight text-foreground mt-8 mb-3 scroll-mt-6"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="font-display font-bold text-xl md:text-2xl leading-tight tracking-tight text-foreground mt-6 mb-2 scroll-mt-6"
        {...props}
      >
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="text-[15px] leading-relaxed text-foreground/85 mb-4" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul
        className="list-disc list-inside space-y-1 mb-4 text-[15px] text-foreground/85"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="list-decimal list-inside space-y-1 mb-4 text-[15px] text-foreground/85"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-[15px]" {...props}>
        {children}
      </li>
    ),
    code: ({ className, children, ...props }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code
            className="font-mono text-[13px] px-1 py-0.5 rounded bg-[var(--surface)] border border-border-dim"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <div className="relative group/code">
          <CopyCodeButton>{children}</CopyCodeButton>
          <pre className="overflow-x-auto rounded border border-border-dim bg-[#0D1117] p-4 mb-4">
            <code className="font-mono text-[13px] leading-relaxed text-[#c9d1d9]" {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-border-dim text-[14px]" {...props}>
          {children}
        </table>
      </div>
    ),
  };
  return createPortal(
    <>
      <AnimatePresence>
        <motion.div
          key="writeup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#0B1118" }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            key="writeup-panel"
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-5xl flex flex-col"
            style={{ maxHeight: "100dvh" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="writeup-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-3 shrink-0">
              <div className="min-w-0">
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
                  <p className="mt-1 text-sm text-[var(--muted-foreground)] line-clamp-2 max-w-2xl">
                    {summary}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="shrink-0 ml-4 flex items-center justify-center w-9 h-9 border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
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
              className="flex-1 overflow-y-auto px-6 pb-6"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className={showToc ? "flex items-start gap-6" : ""}>
                <div
                  className={`border border-border-dim rounded bg-[#0B1118] min-h-[200px] max-h-[80dvh] ${
                    showToc ? "flex-1 min-w-0" : ""
                  }`}
                >
                  {loading && (
                    <div className="flex flex-col items-center justify-center gap-3 py-20 text-[var(--muted-foreground)]">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
                        Fetching writeup...
                      </span>
                    </div>
                  )}
                  {error && !loading && investigation && (
                    <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
                      <AlertTriangle size={24} className="text-[var(--accent-amber)]" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                        No se pudo cargar el writeup
                      </span>
                      <a
                        href={investigation.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] px-4 py-2 border border-[var(--accent)]/50 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                      >
                        <ExternalLink size={14} strokeWidth={1.5} /> Ver en GitHub
                      </a>
                      <button
                        onClick={() => {
                          sessionStorage.removeItem(cacheKey);
                          setError(false);
                          setLoading(true);
                          fetchWriteup();
                        }}
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)] hover:text-foreground transition-colors underline underline-offset-2"
                      >
                        Reintentar
                      </button>
                    </div>
                  )}
                  {!investigation && !loading && (
                    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                      <AlertTriangle size={24} className="text-[var(--accent-amber)]" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                        Writeup no encontrado
                      </span>
                    </div>
                  )}
                  {md && (
                    <div className="p-6 md:p-10 max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeSlug]}
                        components={components}
                      >
                        {md}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* TOC — sticky index for long writeups (desktop only) */}
                {showToc && (
                  <aside className="hidden lg:block w-56 shrink-0 sticky top-4 max-h-[76dvh] overflow-y-auto">
                    <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] mb-3">
                      INDEX
                    </div>
                    <ul className="space-y-1.5 border-l border-border-dim">
                      {toc.map((t) => (
                        <li key={t.id} style={{ paddingLeft: t.depth === 3 ? "0.9rem" : "0.6rem" }}>
                          <a
                            href={`#${t.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              document
                                .getElementById(t.id)
                                ?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            className="block font-mono text-[10px] leading-snug text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors"
                          >
                            {t.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </div>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between px-6 pb-4 shrink-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                ESC para cerrar
              </span>
              {investigation && (
                <a
                  href={investigation.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] hover:underline"
                >
                  <ExternalLink size={12} strokeWidth={1.5} />
                  Ver en GitHub →
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
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
