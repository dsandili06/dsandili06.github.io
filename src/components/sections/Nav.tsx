import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Search } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useOverlayLifecycle } from "@/hooks/useOverlayLifecycle";
import { openCommandPalette } from "@/hooks/useCommandPalette";
import { SECTIONS } from "@/data/sections";
import { getLenis } from "@/lib/lenis";

const links = SECTIONS.map((section) => ({
  href: `#${section.id}`,
  id: section.id,
  label: section.navLabel,
}));

export function Nav() {
  const active = useActiveSection(links);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useFocusTrap<HTMLDivElement>();
  const pendingNavigationRef = useRef<string | null>(null);

  const { overlayRef } = useOverlayLifecycle({
    isOpen: menuOpen,
    onEscape: () => {
      setMenuOpen(false);
      return true;
    },
  });
  const drawerRef = useCallback(
    (node: HTMLDivElement | null) => {
      menuRef(node);
      overlayRef(node);
    },
    [menuRef, overlayRef],
  );

  const handleExitComplete = useCallback(() => {
    const id = pendingNavigationRef.current;
    pendingNavigationRef.current = null;
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { offset: 0 });
    } else {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    }
    history.replaceState(null, "", `#${id}`);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 h-14 sm:h-16 flex items-center justify-between relative z-50">
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
        <div className="hidden md:flex items-center gap-7 lg:gap-9 font-mono text-[11px] uppercase tracking-[0.18em]">
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

          {/* Tactical Command Palette Button */}
          <button
            type="button"
            onClick={openCommandPalette}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xs border border-border-dim bg-[var(--surface-2)]/60 text-[var(--muted-foreground)] hover:text-foreground hover:border-[var(--accent)]/50 transition-colors text-[11px] font-mono cursor-pointer"
            title="Abrir buscador"
            aria-label="Abrir buscador"
          >
            <Search size={13} className="text-[var(--accent)]" />
            <span className="text-[10px] tracking-wider text-[var(--muted-foreground)]">
              BUSCAR
            </span>
          </button>
        </div>

        {/* Mobile Actions: Search + Hamburger Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Abrir buscador"
            className="inline-flex items-center justify-center size-11 min-h-[44px] min-w-[44px] text-[var(--accent)] border border-border-dim hover:border-[var(--accent)] transition-colors cursor-pointer"
            title="Buscar en el portafolio"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="inline-flex items-center justify-center size-11 min-h-[44px] min-w-[44px] text-[var(--accent)] border border-border-dim hover:border-[var(--accent)] transition-colors cursor-pointer"
          >
            {menuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence onExitComplete={handleExitComplete}>
        {menuOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              key="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              role="presentation"
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 top-14 sm:top-16 bg-[#07080A]/80 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Mobile Drawer */}
            <motion.div
              ref={drawerRef}
              key="mobile-nav-drawer"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              data-lenis-prevent
              className="fixed inset-x-0 top-14 sm:top-16 z-50 md:hidden bg-[#07080A] border-b border-border-dim shadow-2xl overflow-y-auto max-h-[calc(100dvh-3.5rem)] sm:max-h-[calc(100dvh-4rem)]"
            >
              <ul className="flex flex-col px-4 sm:px-6 py-2 font-mono text-xs uppercase tracking-[0.2em]">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={(event) => {
                        event.preventDefault();
                        pendingNavigationRef.current = l.id;
                        setMenuOpen(false);
                      }}
                      className="nav-mobile-link flex items-center gap-3 min-h-[44px] py-3.5 border-b border-border-dim/60 text-foreground hover:text-[var(--accent)] active:text-[var(--accent)] transition-colors opacity-100"
                    >
                      <span className="text-[var(--accent)]/70 font-semibold">{">"}</span>
                      <span className="text-foreground tracking-wider font-medium text-[13px]">
                        {l.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
