import { useEffect, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

const railLinks = [
  { id: "about", label: "01" },
  { id: "proyectos", label: "02" },
  { id: "investigaciones", label: "03" },
  { id: "stack", label: "04" },
  { id: "formacion", label: "05" },
  { id: "cursos", label: "06" },
  { id: "contacto", label: "07" },
];

/**
 * Fixed right-side section indicator rail (desktop only).
 * Shows 01–07; the active section expands its line and tints accent.
 * Click scrolls smoothly via the global Lenis instance.
 */
export function SectionRail() {
  const active = useActiveSection(railLinks.map((l) => ({ ...l, href: `#${l.id}` })));

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as Record<string, unknown>).__lenis as
      { scrollTo: (target: Element, opts?: { offset?: number }) => void } | undefined;
    if (lenis) {
      lenis.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
    history.replaceState(null, "", `#${id}`);
  };

  // Don't render rail items until at least one section exists (lazy sections)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(railLinks.some((l) => Boolean(document.getElementById(l.id))));
  }, []);

  if (!ready) return null;

  return (
    <nav aria-label="Secciones" className="section-rail">
      {railLinks.map((l) => (
        <button
          key={l.id}
          type="button"
          data-active={active === l.id}
          onClick={() => scrollTo(l.id)}
          className="section-rail__item"
          aria-label={l.id}
        >
          <span>{l.label}</span>
          <span className="section-rail__line" />
        </button>
      ))}
    </nav>
  );
}
