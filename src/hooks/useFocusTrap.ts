import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus inside the referenced container while mounted
 * (modal accessibility). If focus moves outside the container — e.g. into
 * a nested lightbox — the trap stays passive until focus returns.
 * Restores focus to the previously focused element on unmount.
 */
export function useFocusTrap<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));

    // Initial focus: first focusable element (usually the close button)
    const first = focusables()[0];
    if (first) first.focus();
    else container.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      // Focus escaped the container (nested lightbox) — don't fight it
      if (!container.contains(document.activeElement)) return;

      const list = focusables();
      if (list.length === 0) return;
      const firstEl = list[0];
      const lastEl = list[list.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, []);

  return ref;
}
