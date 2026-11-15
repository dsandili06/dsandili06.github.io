import { Link } from "@tanstack/react-router";

const LINK_CLASS =
  "inline-flex min-h-[44px] items-center px-2 font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

/** Compact site header shared by the /writeups pages. */
export function WriteupsHeader() {
  return (
    <header className="border-b border-border-dim bg-[var(--surface)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 md:px-10">
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center font-display text-base font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          Santiago Daniel Sandili
        </Link>
        <nav aria-label="Navegación de writeups">
          <ul className="flex items-center gap-1">
            <li>
              <Link to="/writeups" className={LINK_CLASS}>
                Writeups
              </Link>
            </li>
            <li>
              <Link to="/" className={LINK_CLASS}>
                Inicio
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
