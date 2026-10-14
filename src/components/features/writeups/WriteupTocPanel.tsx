import type { TocEntry } from "@/components/features/writeups/writeupToc";

type WriteupTocPanelProps = {
  entries: TocEntry[];
  /** Scrolls the writeup container to the heading with this id. */
  onSelect: (id: string) => void;
};

/** Sticky heading index rendered beside long writeups (desktop only). */
export function WriteupTocPanel({ entries, onSelect }: WriteupTocPanelProps) {
  return (
    <aside className="hidden lg:block w-56 shrink-0 sticky top-4 max-h-[76dvh] overflow-y-auto">
      <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] mb-3">
        INDEX
      </div>
      <ul className="space-y-1.5 border-l border-border-dim">
        {entries.map((entry) => (
          <li key={entry.id} style={{ paddingLeft: entry.depth === 3 ? "0.9rem" : "0.6rem" }}>
            <a
              href={`#${entry.id}`}
              onClick={(event) => {
                event.preventDefault();
                onSelect(entry.id);
              }}
              className="block font-mono text-[10px] leading-snug text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
