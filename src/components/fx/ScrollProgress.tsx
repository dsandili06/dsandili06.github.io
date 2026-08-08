import { useEffect, useRef } from "react";

/**
 * Thin accent-colored progress bar fixed to the top of the viewport.
 * Uses GPU-accelerated scaleX transform for 60fps scrolling.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const progress = max > 0 ? el.scrollTop / max : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-[var(--accent)]"
      style={{ transform: "scaleX(0)", willChange: "transform" }}
    />
  );
}
