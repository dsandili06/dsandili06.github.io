import { Component, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import { AlertTriangle, Check, Copy } from "lucide-react";
import { stripLeadingEmoji } from "@/components/features/writeups/writeupToc";
import {
  resolveWriteupImageUri,
  safeMarkdownUrl,
} from "@/components/features/writeups/writeupMarkdownPolicy";

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
          <p className="font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            Error al renderizar el contenido
          </p>
          <p className="mt-2 font-mono text-label text-[var(--muted-foreground)]/60">
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

/** Strips a leading emoji from the first text child of a heading (display only; ids are untouched). */
function stripHeadingEmoji(children: ReactNode): ReactNode {
  if (typeof children === "string") return stripLeadingEmoji(children);
  if (Array.isArray(children)) {
    const [first, ...rest] = children as ReactNode[];
    if (typeof first === "string") return [stripLeadingEmoji(first), ...rest];
  }
  return children;
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
      onClick={() => void onCopy()}
      aria-label="Copiar comando"
      className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 font-mono text-label uppercase tracking-[0.15em] px-2 py-1 rounded border border-border-dim bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] opacity-100 md:opacity-0 md:group-hover/code:opacity-100 focus:opacity-100 transition-opacity"
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
  // The modal header already shows the writeup title: hide a leading H1 visually (kept in the DOM).
  const firstBlockOffset = markdown.length - markdown.trimStart().length;
  const startsWithH1 = /^#\s+\S/.test(markdown.slice(firstBlockOffset));

  const components: MarkdownComponents = {
    img: ({ node, src, alt, title, ...props }) => {
      void node;
      const resolved = src ? resolveWriteupImageUri(src, investigationHref) : src;
      if (!resolved) return null;
      return (
        <figure className="my-10">
          <button
            type="button"
            aria-label={alt ? `Ampliar imagen: ${alt}` : "Ampliar imagen"}
            onClick={() => onOpenImage(resolved)}
            className="block w-full cursor-zoom-in rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <img
              src={resolved}
              alt={alt || ""}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="writeup-img max-w-full h-auto rounded border border-border-dim"
              {...props}
            />
          </button>
          {title && (
            <figcaption className="mt-3 border-l-2 border-[var(--accent)] pl-3 font-mono text-label uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
              {title}
            </figcaption>
          )}
        </figure>
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
    h1: ({ node, children, ...props }) => {
      const isDuplicateTitle = startsWithH1 && node?.position?.start.offset === firstBlockOffset;
      return (
        <h1
          className={
            isDuplicateTitle
              ? "sr-only"
              : "font-display font-bold text-3xl md:text-4xl leading-tight tracking-tight text-foreground mt-8 mb-4"
          }
          {...props}
        >
          {stripHeadingEmoji(children)}
        </h1>
      );
    },
    h2: ({ node, children, ...props }) => {
      void node;
      return (
        <h2
          className="font-display font-bold text-3xl md:text-4xl leading-tight tracking-[-0.03em] text-foreground mt-20 mb-6 pt-6 border-t border-border-dim scroll-mt-6"
          {...props}
        >
          {stripHeadingEmoji(children)}
        </h2>
      );
    },
    h3: ({ node, children, ...props }) => {
      void node;
      return (
        <h3
          className="font-display font-bold text-xl md:text-2xl leading-tight tracking-tight text-foreground mt-12 mb-4 scroll-mt-6"
          {...props}
        >
          {stripHeadingEmoji(children)}
        </h3>
      );
    },
    h4: ({ node, children, ...props }) => {
      void node;
      return (
        <h4
          className="font-display text-lg md:text-xl font-semibold tracking-tight text-foreground mt-10 mb-3 scroll-mt-24"
          {...props}
        >
          {stripHeadingEmoji(children)}
        </h4>
      );
    },
    p: ({ node, children, ...props }) => {
      // A paragraph holding only an image renders as a block so the <figure> is not nested in <p>.
      const meaningful = (node?.children ?? []).filter(
        (child) => !(child.type === "text" && child.value.trim() === ""),
      );
      if (
        meaningful.length === 1 &&
        meaningful[0].type === "element" &&
        meaningful[0].tagName === "img"
      ) {
        return <div {...props}>{children}</div>;
      }
      // Original lab question ("**Qn.** ..."): English, so mark the language and set it apart.
      const first = meaningful[0];
      if (
        first?.type === "element" &&
        first.tagName === "strong" &&
        /^Q\d+\.$/.test(
          first.children.map((child) => (child.type === "text" ? child.value : "")).join(""),
        )
      ) {
        return (
          <p
            className="mb-6 border-l-2 border-[var(--accent)] pl-4 font-mono text-sm leading-relaxed text-foreground/90"
            lang="en"
            {...props}
          >
            {children}
          </p>
        );
      }
      return (
        <p className="text-[17px] md:text-[18px] leading-[1.75] text-foreground/85 mb-6" {...props}>
          {children}
        </p>
      );
    },
    blockquote: ({ node, children, ...props }) => {
      const firstElement = node?.children.find((child) => child.type === "element");
      const firstInner =
        firstElement?.type === "element" && firstElement.tagName === "p"
          ? firstElement.children.find((child) => child.type === "element")
          : undefined;
      const innerText =
        firstInner?.type === "element"
          ? firstInner.children.map((child) => (child.type === "text" ? child.value : "")).join("")
          : "";
      const isAnswer =
        firstInner?.type === "element" &&
        firstInner.tagName === "strong" &&
        /^(Respuesta\b|R:)/.test(innerText.trimStart());
      if (isAnswer) {
        return (
          <aside
            role="note"
            aria-label="Respuesta del laboratorio"
            className="my-6 border-l-2 border-[var(--accent-green)] bg-[color-mix(in_oklab,var(--accent-green)_6%,transparent)] px-5 py-4 font-mono text-sm [&_p]:mb-0 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-foreground"
            {...props}
          >
            {children}
          </aside>
        );
      }
      return (
        <blockquote
          className="my-12 max-w-[30ch] border-l-2 border-[var(--accent)] pl-6 font-display text-2xl leading-snug tracking-tight text-foreground md:text-3xl [&_p]:mb-0 [&_p]:text-inherit [&_p]:leading-snug"
          {...props}
        >
          {children}
        </blockquote>
      );
    },
    ul: ({ node, children, ...props }) => {
      void node;
      return (
        <ul
          className="list-disc list-outside pl-6 space-y-2 mb-6 text-[17px] leading-[1.7] text-foreground/85 marker:text-[var(--accent)]"
          {...props}
        >
          {children}
        </ul>
      );
    },
    ol: ({ node, children, ...props }) => {
      void node;
      return (
        <ol
          className="list-decimal list-outside pl-6 space-y-2 mb-6 text-[17px] leading-[1.7] text-foreground/85 marker:text-[var(--accent)]"
          {...props}
        >
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }) => {
      void node;
      return (
        <li className="text-[17px] leading-[1.7]" {...props}>
          {children}
        </li>
      );
    },
    code: ({ className, children, ...props }) => {
      const text = extractText(children);
      const isInline = !className && !text.includes("\n");
      if (isInline) {
        return (
          <code
            className="font-mono text-[13px] px-1 py-0.5 rounded bg-[var(--surface)] border border-border-dim [overflow-wrap:anywhere] [box-decoration-break:clone]"
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
    table: ({ node, children, ...props }) => {
      void node;
      return (
        <div
          className="overflow-x-auto mb-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          tabIndex={0}
          role="region"
          aria-label="Tabla (desplazable horizontalmente)"
        >
          <table className="w-full border-collapse text-sm" {...props}>
            {children}
          </table>
        </div>
      );
    },
    th: ({ node, children, ...props }) => {
      void node;
      return (
        <th
          className="border-b border-foreground/30 py-3 pr-6 text-left align-top font-mono text-label font-normal uppercase tracking-[0.12em] text-[var(--muted-foreground)]"
          {...props}
        >
          {children}
        </th>
      );
    },
    td: ({ node, children, ...props }) => {
      void node;
      return (
        <td className="border-b border-border-dim py-3 pr-6 align-top text-sm" {...props}>
          {children}
        </td>
      );
    },
    // react-markdown wraps code blocks in its own <pre>; our code component
    // already returns a <pre> inside a <div>, so we strip the outer <pre>
    pre: ({ children }) => <>{children}</>,
  };

  return (
    <MarkdownErrorBoundary>
      <div className="writeup-prose break-words">
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
      </div>
    </MarkdownErrorBoundary>
  );
}
