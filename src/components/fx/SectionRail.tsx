import { useEffect, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { getLenis } from "@/lib/lenis";
import { SECTIONS } from "@/data/sections";

/**
 * Fixed right-side section indicator rail (desktop only).
 * Shows 01–07; the active section expands its line and tints accent.
 * Click scrolls smoothly via the global Lenis instance.
 */
export function SectionRail() {
  const active = useActiveSection(
    SECTIONS.map((section) => ({
      id: section.id,
      label: section.number,
      href: `#${section.id}`,
    })),
  );

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (!lenis) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      lenis.scrollTo(el, { offset: 0 });
    }
    history.replaceState(null, "", `#${id}`);
  };

  // Don't render rail items until at least one section exists (lazy sections)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(SECTIONS.some((section) => Boolean(document.getElementById(section.id))));
  }, []);

  if (!ready) return null;

  return (
    <nav aria-label="Secciones" className="section-rail">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          data-active={active === section.id}
          onClick={() => scrollTo(section.id)}
          className="section-rail__item"
          aria-label={section.id}
        >
          <span>{section.number}</span>
          <span className="section-rail__line" />
        </button>
      ))}
    </nav>
  );
}
