import { useCallback } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useOverlayLifecycle, type UseOverlayLifecycleOptions } from "@/hooks/useOverlayLifecycle";

/**
 * Wires a modal panel to the shared overlay stack (scroll lock, Lenis pause,
 * Escape) and to the focus trap (Tab containment and focus restoration).
 * Attach the returned ref to the panel kept mounted by AnimatePresence.
 */
export function useDialogLifecycle<T extends HTMLElement = HTMLDivElement>(
  options: UseOverlayLifecycleOptions,
) {
  const focusTrapRef = useFocusTrap<T>();
  const { overlayRef } = useOverlayLifecycle(options);

  return useCallback(
    (node: T | null) => {
      focusTrapRef(node);
      overlayRef(node);
    },
    [focusTrapRef, overlayRef],
  );
}
