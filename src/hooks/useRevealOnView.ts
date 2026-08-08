import { useEffect } from "react";

export function useRevealOnView() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      els.forEach((el) => el.classList.add("reveal-on-view", "in-view"));
      return;
    }
    els.forEach((el) => el.classList.add("reveal-on-view"));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            requestAnimationFrame(() => el.classList.add("in-view"));
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: [0, 0.1] },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
