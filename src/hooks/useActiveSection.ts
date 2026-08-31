import { useEffect, useState } from "react";

type NavLink = { href: string; id: string; label: string };

export function useActiveSection(links: NavLink[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      const sections = links
        .map((l) => ({ id: l.id, el: document.getElementById(l.id) }))
        .filter((s): s is { id: string; el: HTMLElement } => Boolean(s.el));

      if (sections.length === 0) return;

      const probe = 120;
      let current = sections[0].id;
      for (const s of sections) {
        const top = s.el.getBoundingClientRect().top;
        if (top - probe <= 0) current = s.id;
        else break;
      }
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = sections[sections.length - 1].id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return active;
}
