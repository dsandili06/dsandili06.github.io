import { useCallback, useRef } from "react";
import { getLenis } from "@/lib/lenis";

type OverlayEntry = {
  id: symbol;
  onEscape?: () => boolean;
};

const overlays: OverlayEntry[] = [];
let originalOverflow = "";
let lockedLenis: ReturnType<typeof getLenis>;

function handleKeyDown(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  const top = overlays[overlays.length - 1];
  if (top?.onEscape?.()) {
    event.preventDefault();
    event.stopPropagation();
  }
}

function acquireOverlay(entry: OverlayEntry) {
  if (overlays.length === 0) {
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lockedLenis = getLenis();
    lockedLenis?.stop();
    window.addEventListener("keydown", handleKeyDown);
  }
  overlays.push(entry);

  return () => {
    const index = overlays.findIndex(({ id }) => id === entry.id);
    if (index === -1) return;
    overlays.splice(index, 1);
    if (overlays.length !== 0) return;
    window.removeEventListener("keydown", handleKeyDown);
    document.body.style.overflow = originalOverflow;
    lockedLenis?.start();
    lockedLenis = undefined;
  };
}

export interface UseOverlayLifecycleOptions {
  isOpen?: boolean;
  /** Return false to let the Escape event continue to an inner overlay (e.g. Lightbox). */
  onEscape?: () => boolean;
}

/**
 * Coordinates an overlay while its visual layer is mounted. Attach `overlayRef`
 * to the element retained by AnimatePresence so locks survive its exit animation.
 */
export function useOverlayLifecycle({ isOpen = true, onEscape }: UseOverlayLifecycleOptions = {}) {
  const onEscapeRef = useRef(onEscape);
  const elementRef = useRef<HTMLElement | null>(null);
  const releaseRef = useRef<(() => void) | null>(null);
  onEscapeRef.current = onEscape;
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const overlayRef = useCallback((element: HTMLElement | null) => {
    if (elementRef.current === element) return;
    releaseRef.current?.();
    releaseRef.current = null;
    elementRef.current = element;
    if (!element) return;

    const entry: OverlayEntry = {
      id: Symbol("overlay"),
      onEscape: () => (isOpenRef.current ? (onEscapeRef.current?.() ?? false) : false),
    };
    releaseRef.current = acquireOverlay(entry);
  }, []);

  return { overlayRef };
}
