import { useEffect, useRef, useCallback } from "react";

export interface UseModalHistoryOptions {
  isOpen?: boolean;
  onClose: () => void;
  stateData?: Record<string, unknown>;
}

type HistoryEntry = {
  pushed: boolean;
  deferredPush: boolean;
  stateData: Record<string, unknown>;
  onClose: () => void;
};

const modalStack: HistoryEntry[] = [];
let ignoredBackEvents = 0;

function pushHistoryEntry(entry: HistoryEntry) {
  try {
    window.history.pushState(entry.stateData, "", window.location.href);
    entry.pushed = true;
    entry.deferredPush = false;
  } catch {
    /* History may be unavailable in embedded browser contexts. */
  }
}

function pushDeferredEntries() {
  for (const entry of modalStack) {
    if (entry.deferredPush) pushHistoryEntry(entry);
  }
}

function updatePopListener() {
  if (modalStack.length > 0 || ignoredBackEvents > 0) {
    window.addEventListener("popstate", onPopState);
  } else {
    window.removeEventListener("popstate", onPopState);
  }
}

function removeEntry(entry: HistoryEntry) {
  const index = modalStack.indexOf(entry);
  if (index !== -1) modalStack.splice(index, 1);
}

function onPopState() {
  if (ignoredBackEvents > 0) {
    ignoredBackEvents -= 1;
    // An explicit history.back() may race a newly opened modal. Wait until
    // traversal settles, then push any still-active modal entries in order.
    if (ignoredBackEvents === 0) pushDeferredEntries();
    updatePopListener();
    return;
  }
  const top = modalStack[modalStack.length - 1];
  if (!top) return;
  removeEntry(top);
  top.pushed = false;
  top.onClose();
  updatePopListener();
}

function addEntry(entry: HistoryEntry) {
  modalStack.push(entry);
  if (ignoredBackEvents > 0) entry.deferredPush = true;
  else pushHistoryEntry(entry);
  updatePopListener();
}

function closeEntry(entry: HistoryEntry, shouldNavigateBack: boolean) {
  const index = modalStack.indexOf(entry);
  if (index === -1) return;
  const isTop = index === modalStack.length - 1;
  removeEntry(entry);

  // History cannot remove an older entry while a newer modal entry is above it.
  // Keep that browser entry in place rather than accidentally popping the newer modal.
  if (shouldNavigateBack && isTop && entry.pushed) {
    entry.pushed = false;
    ignoredBackEvents += 1;
    try {
      window.history.back();
    } catch {
      ignoredBackEvents -= 1;
    }
  }
  updatePopListener();
}

export function useModalHistory({ isOpen = true, onClose, stateData }: UseModalHistoryOptions) {
  const entryRef = useRef<HistoryEntry | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const stateDataRef = useRef(stateData);
  stateDataRef.current = stateData;
  const mountLifecycle = useRef({ version: 0 }).current;

  const handleClose = useCallback(() => {
    const entry = entryRef.current;
    if (!entry) return;
    closeEntry(entry, true);
    entryRef.current = null;
    onCloseRef.current();
  }, []);

  useEffect(() => {
    if (!isOpen || entryRef.current) {
      if (!isOpen && entryRef.current) {
        closeEntry(entryRef.current, true);
        entryRef.current = null;
      }
      return;
    }

    const entry: HistoryEntry = {
      pushed: false,
      deferredPush: false,
      stateData: stateDataRef.current ?? { modal: true },
      onClose: () => {
        entryRef.current = null;
        onCloseRef.current();
      },
    };
    entryRef.current = entry;
    addEntry(entry);
  }, [isOpen]);

  useEffect(() => {
    const mountVersion = ++mountLifecycle.version;
    return () => {
      // React StrictMode replays effects during mount. Defer cleanup by one
      // microtask so the replay can register the still-open modal again.
      void Promise.resolve().then(() => {
        // This is intentionally a mutable generation counter so an unmount
        // queued by StrictMode's effect replay can be distinguished from a real
        // unmount without closing the modal between the replayed setups.
        if (mountLifecycle.version !== mountVersion) return;
        if (entryRef.current) {
          closeEntry(entryRef.current, false);
          entryRef.current = null;
        }
      });
    };
  }, [mountLifecycle]);

  return { handleClose };
}
