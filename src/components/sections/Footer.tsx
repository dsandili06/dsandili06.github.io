export function Footer() {
  return (
    <footer className="border-t border-border-dim bg-[var(--surface)]/30">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] leading-none flex items-center whitespace-nowrap">
              <span className="text-[var(--muted-foreground)]">[</span>
              <span className="text-[var(--accent)]">artif4kt</span>
              <span className="text-[var(--muted-foreground)]">@</span>
              <span className="text-foreground">analyst</span>
              <span className="text-[var(--muted-foreground)]"> ~]</span>
            </span>
          </div>

          {/* Copyright */}
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
            © 2026 Santiago Daniel Sandili · Construido con criterio técnico
          </span>

          {/* Back to top */}
          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] hover:text-[var(--accent)] transition-colors"
          >
            <span>Volver arriba</span>
            <span className="text-[var(--accent)] group-hover:-translate-y-0.5 transition-transform">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
