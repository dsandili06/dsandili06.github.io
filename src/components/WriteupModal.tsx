import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Loader2, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ComponentProps } from "react";
import { INVESTIGATIONS } from "@/data/investigations";
import type { Investigation } from "@/types";
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
  const investigation = investigationById(investigationId);
  const [md, setMd] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const cacheKey = `writeup-${investigationId}`;

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
      { stop: () => void; start: () => void } | undefined;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  const title = investigation?.title || investigationId;
  const platform = investigation?.platform;
  const categories = investigation?.categories;
  const summary = investigation?.summary;

  const components: MarkdownComponents = {
    img: ({ src, alt, ...props }) => {
      const resolved = src ? resolveImageUri(src, investigation?.href || "") : src;
      return (
        <img
          src={resolved}
          alt={alt || ""}
          loading="lazy"
          decoding="async"
          className="max-w-full h-auto rounded border border-border-dim my-4"
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
        className="font-display font-bold text-2xl md:text-3xl leading-tight tracking-tight text-foreground mt-8 mb-3"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="font-display font-bold text-xl md:text-2xl leading-tight tracking-tight text-foreground mt-6 mb-2"
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
        <pre className="overflow-x-auto rounded border border-border-dim bg-[#0D1117] p-4 mb-4">
          <code className="font-mono text-[13px] leading-relaxed text-[#c9d1d9]" {...props}>
            {children}
          </code>
        </pre>
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

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="border border-border-dim rounded bg-[#0B1118] min-h-[200px] max-h-[80dvh]">
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
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                    {md}
                  </ReactMarkdown>
                </div>
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
    </AnimatePresence>,
    document.body,
  );
}
