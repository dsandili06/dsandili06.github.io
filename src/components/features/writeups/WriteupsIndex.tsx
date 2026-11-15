import { Link } from "@tanstack/react-router";
import { INVESTIGATIONS } from "@/data/investigations";
import { WRITEUP_CATEGORIES } from "@/components/features/writeups/writeupCategories";

const CHIP_BASE =
  "inline-flex min-h-[44px] items-center border px-3 font-mono text-label uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";
const CHIP_IDLE =
  "border-border-dim text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]";
const CHIP_ACTIVE = "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]";

const ACTIVE = { exact: true, includeSearch: true } as const;

type WriteupsIndexProps = {
  /** Active category filter, already validated. */
  cat?: string;
};

/** Editorial list of every published writeup with a category filter. */
export function WriteupsIndex({ cat }: WriteupsIndexProps) {
  const items = cat
    ? INVESTIGATIONS.filter((investigation) => investigation.categories.includes(cat))
    : INVESTIGATIONS;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <header className="mb-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
          Writeups
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
          Investigaciones DFIR, threat hunting y análisis de malware resueltas en laboratorios
          prácticos, con metodología y hallazgos documentados.
        </p>
      </header>

      <nav aria-label="Filtrar por categoría" className="mb-8">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              to="/writeups"
              search={{}}
              replace
              activeOptions={ACTIVE}
              className={`${CHIP_BASE} ${cat ? CHIP_IDLE : CHIP_ACTIVE}`}
            >
              Todos
            </Link>
          </li>
          {WRITEUP_CATEGORIES.map((category) => (
            <li key={category}>
              <Link
                to="/writeups"
                search={{ cat: category }}
                replace
                activeOptions={ACTIVE}
                className={`${CHIP_BASE} ${cat === category ? CHIP_ACTIVE : CHIP_IDLE}`}
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="sr-only" role="status" aria-live="polite">
        {items.length} {items.length === 1 ? "writeup" : "writeups"}
      </p>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((investigation) => (
          <li
            key={investigation.id}
            className="flex flex-col gap-3 border border-border-dim bg-[var(--surface)] p-5"
          >
            {investigation.visual && (
              <img
                src={investigation.visual.src}
                alt={investigation.visual.alt}
                loading="lazy"
                className="aspect-video w-full border border-border-dim object-cover"
              />
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-[var(--accent-green)]/50 px-2 py-0.5 font-mono text-label uppercase tracking-[0.12em] text-[var(--accent-green)]">
                {investigation.platform}
              </span>
              {investigation.categories.map((category) => (
                <span
                  key={category}
                  className="border border-border-dim px-2 py-0.5 font-mono text-label uppercase tracking-[0.15em] text-[var(--muted-foreground)]"
                >
                  {category}
                </span>
              ))}
            </div>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              <Link
                to="/writeups/$slug"
                params={{ slug: investigation.slug }}
                className="hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {investigation.title}
              </Link>
            </h2>
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              {investigation.summary}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
