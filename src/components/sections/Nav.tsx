import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { getLenis } from "@/lib/lenis";

const links = [
  { href: "#about", id: "about", label: "About" },
  { href: "#proyectos", id: "proyectos", label: "Proyectos" },
  { href: "#investigaciones", id: "investigaciones", label: "Labs" },
  { href: "#stack", id: "stack", label: "Stack" },
  { href: "#formacion", id: "formacion", label: "Certs" },
  { href: "#cursos", id: "cursos", label: "Cursos" },
  { href: "#contacto", id: "contacto", label: "Contacto" },
];

export function Nav() {
  const active = useActiveSection(links);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = getLenis();
    lenis?.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = originalOverflow;
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-border-dim pt-[env(safe-area-inset-top)] transition-colors ${
        menuOpen
          ? "bg-[#07080A]"
          : "bg-[#07080A]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#07080A]/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 h-14 sm:h-16 flex items-center justify-between">
        <a
          href="#top"
          aria-label="Inicio"
          className="group font-mono text-[11px] sm:text-xs leading-none flex items-center whitespace-nowrap"
        >
          <span className="text-[var(--muted-foreground)]">[</span>
          <span className="text-[var(--accent)]">artif4kt</span>
          <span className="text-[var(--muted-foreground)]">@</span>
          <span className="text-foreground">analyst</span>
          <span className="text-[var(--muted-foreground)]"> ~]</span>
          <span className="text-[var(--accent)] ml-1">$</span>
        </a>
        <div className="hidden md:flex items-center gap-9 font-mono text-[11px] uppercase tracking-[0.18em]">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative pb-1 transition-colors duration-200 ${isActive ? "text-[var(--accent)]" : "text-foreground/75 hover:text-[var(--accent)]"}`}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className="absolute left-0 right-0 -bottom-0.5 h-px bg-[var(--accent)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className="md:hidden inline-flex items-center justify-center size-11 min-h-[44px] min-w-[44px] text-[var(--accent)] border border-border-dim hover:border-[var(--accent)] transition-colors cursor-pointer"
        >
          {menuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>
      </div>

      {menuOpen && (
        <div
          role="presentation"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-[#07080A]/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <div
        inert={!menuOpen ? true : undefined}
        data-lenis-prevent
        className={`md:hidden relative z-50 overflow-y-auto overscroll-contain border-t border-border-dim bg-[#07080A] transition-[max-height,opacity] duration-300 ${menuOpen ? "nav-mobile-open max-h-[80vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
      >
        <ul className="flex flex-col px-4 sm:px-6 py-2 font-mono text-xs uppercase tracking-[0.2em]">
          {links.map((l, i) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${80 + i * 55}ms` : "0ms" }}
                className="nav-mobile-link flex items-center gap-3 min-h-[44px] py-3.5 border-b border-border-dim/60 text-foreground/80 hover:text-[var(--accent)] transition-colors"
              >
                <span className="text-[var(--accent)]/60">{">"}</span>
                <span>{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
