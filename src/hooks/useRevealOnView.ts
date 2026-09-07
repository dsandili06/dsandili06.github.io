import { useEffect } from "react";

export function useRevealOnView() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observed = new WeakSet<HTMLElement>();

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            requestAnimationFrame(() => {
              el.classList.add("in-view");
              el.addEventListener(
                "animationend",
                () => {
                  el.classList.add("reveal-done");
                },
                { once: true },
              );
            });
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: [0, 0.1] },
    );

    const observeEl = (el: HTMLElement) => {
      if (observed.has(el)) return;
      observed.add(el);
      if (prefersReduced) {
        el.classList.add("reveal-on-view", "in-view", "reveal-done");
        return;
      }
      el.classList.add("reveal-on-view");
      obs.observe(el);
    };

    // Initial pass for statically mounted elements
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(observeEl);

    // Watch for dynamically mounted elements (lazy-loaded sections 03-07)
    let mo: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      mo = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              if (el.hasAttribute?.("data-reveal")) {
                observeEl(el);
              }
              if (el.querySelectorAll) {
                el.querySelectorAll<HTMLElement>("[data-reveal]").forEach(observeEl);
              }
            }
          }
        }
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      obs.disconnect();
      mo?.disconnect();
    };
  }, []);
}
