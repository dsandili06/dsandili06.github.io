import type { TocEntry } from "@/components/features/writeups/writeupToc";

type WriteupTocPanelProps = {
  entries: TocEntry[];
  /** Scrolls the writeup container to the heading with this id. */
  onSelect: (id: string) => void;
  /** Id of the heading currently being read. */
  activeId?: string;
};

/** Sticky heading index rendered beside long writeups (desktop only). */
export function WriteupTocPanel({ entries, onSelect, activeId }: WriteupTocPanelProps) {
  return (
    <nav
      aria-label="En este informe"
      className="hidden lg:block sticky top-24 self-start max-h-[76dvh] overflow-y-auto"
    >
      <div
        aria-hidden="true"
        className="font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)] mb-3"
      >
        En este informe
      </div>
      <ul className="border-l border-border-dim">
        {entries.map((entry) => {
          const active = entry.id === activeId;
          return (
            <li key={entry.id} style={{ paddingLeft: entry.depth === 3 ? "0.9rem" : "0.6rem" }}>
              <a
                href={`#${entry.id}`}
                aria-current={active ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  onSelect(entry.id);
                }}
                className={`block py-1 font-mono text-label leading-snug transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                  active
                    ? "text-[var(--accent)] border-l-2 border-[var(--accent)] -ml-px pl-2"
                    : "text-[var(--muted-foreground)]"
                }`}
              >
                {entry.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
