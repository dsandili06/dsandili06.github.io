import { Component, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import { AlertTriangle, Check, Copy } from "lucide-react";
import { resolveWriteupImageUri, safeMarkdownUrl } from "@/components/writeupMarkdownPolicy";

/** Catches ReactMarkdown render errors so the modal doesn't crash silently. */
class MarkdownErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      console.error("[WriteupModal] Markdown render error:", this.state.error);
      return (
        <div role="alert" className="p-6 text-center">
          <AlertTriangle size={24} className="mx-auto mb-3 text-[var(--accent-amber)]" />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Error al renderizar el contenido
          </p>
          <p className="mt-2 font-mono text-[10px] text-[var(--muted-foreground)]/60">
            {this.state.error.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] px-2 py-1 rounded border border-border-dim bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] opacity-100 md:opacity-0 md:group-hover/code:opacity-100 focus:opacity-100 transition-opacity"
    >
      {copied ? <Check size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={1.5} />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

type MarkdownComponents = ComponentProps<typeof ReactMarkdown>["components"];

const writeupSanitizeSchema = {
  ...defaultSchema,
  protocols: {
    ...defaultSchema.protocols,
    // safeMarkdownUrl performs the stricter raster/base64 and size validation at render time.
    src: [...(defaultSchema.protocols?.src ?? []), "data"],
  },
};

type WriteupMarkdownProps = {
  markdown: string;
  /** Repository URL of the writeup, used to resolve relative image paths. */
  investigationHref: string;
  /** Opens the zoom lightbox for a writeup screenshot. */
  onOpenImage: (src: string) => void;
};

/** Renders writeup markdown with the project's safe URL and image policies. */
export function WriteupMarkdown({
  markdown,
  investigationHref,
  onOpenImage,
}: WriteupMarkdownProps) {
  const components: MarkdownComponents = {
    img: ({ src, alt, ...props }) => {
      const resolved = src ? resolveWriteupImageUri(src, investigationHref) : src;
      if (!resolved) return null;
      return (
        <img
          src={resolved}
          alt={alt || ""}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenImage(resolved);
            }
          }}
          onClick={() => onOpenImage(resolved)}
          className="writeup-img max-w-full h-auto rounded border border-border-dim my-4 cursor-zoom-in"
          {...props}
        />
      );
    },
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
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
          <pre className="overflow-x-auto rounded border border-border-dim bg-[var(--surface)] p-4 mb-4">
            <code className="font-mono text-[13px] leading-relaxed text-foreground" {...props}>
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
    // react-markdown wraps code blocks in its own <pre>; our code component
    // already returns a <pre> inside a <div>, so we strip the outer <pre>
    pre: ({ children }) => <>{children}</>,
  };

  return (
    <MarkdownErrorBoundary>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, writeupSanitizeSchema],
          [rehypeSlug, { prefix: "writeup-content-" }],
        ]}
        urlTransform={safeMarkdownUrl}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </MarkdownErrorBoundary>
  );
}
