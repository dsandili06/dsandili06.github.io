import { ArrowUp, Download, Github, Linkedin, Mail } from "lucide-react";
import { CONTACT } from "@/data/site";

const LINK_CLASS =
  "inline-flex min-h-[44px] items-center gap-2 rounded-xs px-2 text-meta text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]";

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

export function Footer() {
  return (
    <footer
      className="border-t border-border-dim bg-[var(--surface)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-display text-base font-bold tracking-tight text-foreground">
              Santiago Daniel Sandili
            </p>
            <p className="mt-1 text-meta text-[var(--muted-foreground)]">
              Analista SOC · Blue Team · DFIR
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página">
            <ul className="flex flex-wrap items-center gap-x-2 gap-y-1 -mx-2">
              <li>
                <a href={CONTACT.linkedin} {...EXTERNAL} className={LINK_CLASS}>
                  <Linkedin className="size-4 shrink-0" aria-hidden="true" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={CONTACT.github} {...EXTERNAL} className={LINK_CLASS}>
                  <Github className="size-4 shrink-0" aria-hidden="true" />
                  GitHub
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className={LINK_CLASS}>
                  <Mail className="size-4 shrink-0" aria-hidden="true" />
                  Email
                </a>
              </li>
              <li>
                <a href={CONTACT.cv} download className={LINK_CLASS}>
                  <Download className="size-4 shrink-0" aria-hidden="true" />
                  CV
                </a>
              </li>
              <li>
                <a href="#top" className={LINK_CLASS}>
                  <ArrowUp className="size-4 shrink-0" aria-hidden="true" />
                  Volver arriba
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-6 border-t border-border-dim pt-4 font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          © 2026 Santiago Daniel Sandili
        </p>
      </div>
    </footer>
  );
}
