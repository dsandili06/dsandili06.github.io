import { useEffect, useRef, useState } from "react";

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
  const [keys, setKeys] = useState<string[]>([]);
  const activatedRef = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const newKeys = [...keys, e.key].slice(-KONAMI_CODE.length);
      setKeys(newKeys);

      if (
        newKeys.length === KONAMI_CODE.length &&
        newKeys.every((key, i) => key === KONAMI_CODE[i])
      ) {
        if (!activatedRef.current) {
          activatedRef.current = true;
          onActivate();
          // Reset after activation
          setTimeout(() => {
            activatedRef.current = false;
            setKeys([]);
          }, 100);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keys, onActivate]);

  return keys;
}
