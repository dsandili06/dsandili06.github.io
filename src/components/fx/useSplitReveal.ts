import { useEffect, useRef } from "react";
import SplitType from "split-type";

/**
 * Splits the target element's text into words and reveals them with a
 * staggered rise animation when the element enters the viewport.
 * - Reduced motion: no-op (text renders normally).
 * - Cleanup calls SplitType.revert() to restore the original DOM
 *   (safe under StrictMode double-effect).
 */
export function useSplitReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const split = new SplitType(el, { types: "words" });
    const words = split.words ?? [];
    if (words.length === 0) return;

    words.forEach((w) => {
      const word = w as HTMLElement;
      word.style.display = "inline-block";
      word.style.opacity = "0";
      word.style.transform = "translateY(0.6em)";
      word.style.transition =
        "opacity 0.5s var(--ease-out-expo), transform 0.65s var(--ease-out-expo)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          words.forEach((w, i) => {
            const word = w as HTMLElement;
            word.style.transitionDelay = `${i * 55}ms`;
            word.style.opacity = "1";
            word.style.transform = "translateY(0)";
          });
          io.disconnect();
          break;
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      split.revert();
    };
  }, []);

  return ref;
}
