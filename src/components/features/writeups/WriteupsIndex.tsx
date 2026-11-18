import { Link } from "@tanstack/react-router";
import { INVESTIGATIONS } from "@/data/investigations";
import { WRITEUP_CATEGORIES } from "@/components/features/writeups/writeupCategories";

const TAB_BASE =
  "inline-flex min-h-[44px] items-center border-b-2 px-1 font-mono text-label uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";
const TAB_IDLE = "border-transparent text-[var(--muted-foreground)] hover:text-foreground";
const TAB_ACTIVE = "border-[var(--accent)] text-[var(--accent)]";

const STRETCHED_LINK =
  "after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-[var(--accent)]";

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
  const [lead, ...rest] = items;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-10 md:py-12">
      <header className="border-b border-foreground/20 pb-10">
        <p className="font-mono text-label uppercase tracking-[0.14em] text-[var(--accent)]">
          Archivo de investigaciones · {INVESTIGATIONS.length} casos
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-[0.9] tracking-[-0.05em] text-foreground md:text-7xl lg:text-8xl">
          Writeups
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-[var(--muted-foreground)]">
          Investigaciones DFIR, threat hunting y análisis de malware resueltas en laboratorios
          prácticos, con metodología y hallazgos documentados.
        </p>
      </header>

      <nav aria-label="Filtrar por categoría" className="mt-4">
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          <li>
            <Link
              to="/writeups"
              search={{}}
              replace
              activeOptions={ACTIVE}
              className={`${TAB_BASE} ${cat ? TAB_IDLE : TAB_ACTIVE}`}
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
                className={`${TAB_BASE} ${cat === category ? TAB_ACTIVE : TAB_IDLE}`}
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

      {lead && (
        <article className="group relative grid gap-10 border-b border-border-dim py-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <p className="font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
              <span className="text-[var(--accent-green)]">{lead.platform}</span> ·{" "}
              {lead.categories.join(" / ")}
            </p>
            <h2 className="font-display text-4xl font-bold leading-[1] tracking-[-0.035em] text-foreground md:text-5xl">
              <Link
                to="/writeups/$slug"
                params={{ slug: lead.slug }}
                className={`transition-colors duration-300 group-hover:text-[var(--accent)] ${STRETCHED_LINK}`}
              >
                {lead.title}
              </Link>
            </h2>
            <p className="max-w-[60ch] text-lg leading-relaxed text-[var(--muted-foreground)]">
              {lead.summary}
            </p>
            <span
              aria-hidden="true"
              className="mt-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--accent)]"
            >
              Leer el informe →
            </span>
          </div>
          {lead.visual ? (
            <img
              src={lead.visual.src}
              alt={lead.visual.alt}
              loading="eager"
              decoding="async"
              className="h-auto w-full border border-border-dim"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex min-h-[220px] items-center justify-center overflow-hidden border border-border-dim p-6"
            >
              <span className="text-center font-display text-6xl font-bold leading-none tracking-[-0.04em] text-foreground/10 md:text-7xl">
                {lead.categories[0]}
              </span>
            </div>
          )}
        </article>
      )}

      <ul>
        {rest.map((investigation) => (
          <li
            key={investigation.id}
            className="group relative grid gap-x-8 gap-y-2 border-b border-border-dim py-7 transition-colors hover:bg-[color-mix(in_oklab,var(--accent)_4%,transparent)] md:grid-cols-[200px_minmax(0,1fr)_auto]"
          >
            <p className="font-mono text-label uppercase tracking-[0.14em] text-foreground/80">
              {investigation.categories.join(" / ")}
              <span className="mt-1 block text-[var(--muted-foreground)]">
                {investigation.platform}
              </span>
            </p>
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                <Link
                  to="/writeups/$slug"
                  params={{ slug: investigation.slug }}
                  className={`transition-colors duration-300 group-hover:text-[var(--accent)] ${STRETCHED_LINK}`}
                >
                  {investigation.title}
                </Link>
              </h2>
              <p className="mt-2 line-clamp-2 max-w-[65ch] text-[var(--muted-foreground)]">
                {investigation.summary}
              </p>
            </div>
            <span
              aria-hidden="true"
              className="hidden font-mono text-xl text-[var(--accent)] transition-transform duration-300 md:block motion-safe:group-hover:translate-x-1"
            >
              →
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
