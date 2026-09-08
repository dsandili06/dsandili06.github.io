import { useEffect, useRef, useCallback } from "react";

export interface UseModalHistoryOptions {
  isOpen?: boolean;
  onClose: () => void;
  stateData?: Record<string, unknown>;
}

/**
 * Synchronizes modal open/close state with browser history.
 *
 * - When the modal opens, it pushes an entry to window.history.
 * - When the user navigates back (hardware back, mobile swipe, or browser back button),
 *   popstate fires and triggers `onClose()`.
 * - When the user closes the modal via UI triggers (X button, backdrop click, Escape key),
 *   `handleClose()` reverts the pushed history entry via `window.history.back()` and calls `onClose()`.
 * - Prevents duplicate close calls and loop cycles between programmatic back and popstate events.
 */
export function useModalHistory({ isOpen = true, onClose, stateData }: UseModalHistoryOptions) {
  const isPushedRef = useRef(false);
  const closedByPopstateRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const stateDataRef = useRef(stateData);
  stateDataRef.current = stateData;

  const handleClose = useCallback(() => {
    if (isPushedRef.current && !closedByPopstateRef.current) {
      isPushedRef.current = false;
      try {
        window.history.back();
      } catch {
        /* ignore environments where history is not available */
      }
    }
    onCloseRef.current();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isOpen) {
      if (isPushedRef.current && !closedByPopstateRef.current) {
        isPushedRef.current = false;
        try {
          window.history.back();
        } catch {
          /* ignore */
        }
      }
      return;
    }

    // Modal is open
    closedByPopstateRef.current = false;
    try {
      window.history.pushState(stateDataRef.current ?? { modal: true }, "");
      isPushedRef.current = true;
    } catch {
      /* ignore */
    }

    const onPopState = () => {
      if (!isPushedRef.current) return;

      // The browser's back action already removed the pushed history entry
      isPushedRef.current = false;
      closedByPopstateRef.current = true;
      onCloseRef.current();
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
      if (isPushedRef.current && !closedByPopstateRef.current) {
        isPushedRef.current = false;
        try {
          window.history.back();
        } catch {
          /* ignore */
        }
      }
    };
  }, [isOpen]);

  return { handleClose };
}
