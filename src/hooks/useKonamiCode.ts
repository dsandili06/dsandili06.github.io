import { useEffect, useRef } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonamiCode(onActivate: () => void) {
  const keysRef = useRef<string[]>([]);
  const activatedRef = useRef(false);
  const onActivateRef = useRef(onActivate);

  // Keep the callback ref updated without re-creating the listener
  useEffect(() => {
    onActivateRef.current = onActivate;
  }, [onActivate]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const newKeys = [...keysRef.current, e.key].slice(-KONAMI_CODE.length);
      keysRef.current = newKeys;

      if (
        newKeys.length === KONAMI_CODE.length &&
        newKeys.every((key, i) => key === KONAMI_CODE[i])
      ) {
        if (!activatedRef.current) {
          activatedRef.current = true;
          onActivateRef.current();
          // Reset after activation
          setTimeout(() => {
            activatedRef.current = false;
            keysRef.current = [];
          }, 100);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // Empty deps — listener is stable, no re-creation on keystroke
}
