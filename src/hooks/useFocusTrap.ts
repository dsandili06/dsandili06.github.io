import { useCallback, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), iframe, textarea, input, select, [tabindex]:not([tabindex="-1"])';

type FocusScope = { container: HTMLElement; returnFocus: HTMLElement | null };
const focusScopes: FocusScope[] = [];

/**
 * Traps keyboard focus inside the referenced container while mounted
 * (modal accessibility). If focus moves outside the container — e.g. into
 * a nested lightbox — the trap stays passive until focus returns.
 * Restores focus to the previously focused element on unmount.
 */
export function useFocusTrap<T extends HTMLElement>({
  preventScroll = false,
}: { preventScroll?: boolean } = {}) {
  const containerRef = useRef<T | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  return useCallback(
    (container: T | null) => {
      if (containerRef.current === container) return;

      cleanupRef.current?.();
      cleanupRef.current = null;
      containerRef.current = container;
      if (!container) return;

      const previouslyFocused = document.activeElement as HTMLElement | null;
      const scope: FocusScope = { container, returnFocus: previouslyFocused };
      focusScopes.push(scope);
      const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));

      // Initial focus: first focusable element (usually the close button)
      const first = focusables()[0];
      const focus = (element: HTMLElement) => {
        if (preventScroll) element.focus({ preventScroll: true });
        else element.focus();
      };
      if (first) focus(first);
      else focus(container);

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
      cleanupRef.current = () => {
        container.removeEventListener("keydown", onKeyDown);
        const scopeIndex = focusScopes.indexOf(scope);
        if (scopeIndex !== -1) {
          for (const childScope of focusScopes.slice(scopeIndex + 1)) {
            if (container.contains(childScope.returnFocus)) {
              childScope.returnFocus = scope.returnFocus;
            }
          }
          focusScopes.splice(scopeIndex, 1);
        }

        const parentScope = focusScopes[focusScopes.length - 1];
        if (
          scope.returnFocus?.isConnected &&
          (!parentScope || parentScope.container.contains(scope.returnFocus))
        ) {
          focus(scope.returnFocus);
        }
      };
    },
    [preventScroll],
  );
}
