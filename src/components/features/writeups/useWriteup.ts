import { useCallback, useEffect, useRef, useState } from "react";
import type { Investigation } from "@/types";
import { getWriteupCacheKey, toRawUrl } from "@/components/features/writeups/writeupSource";

const FETCH_TIMEOUT_MS = 10000;

export type UseWriteupResult = {
  markdown: string | null;
  loading: boolean;
  error: boolean;
  /** Drops the cached copy and re-runs the fetch on the current lifecycle signal. */
  retry: () => void;
};

/**
 * Loads the markdown of a writeup investigation from its GitHub repository.
 * Aborts an in-flight request on unmount and treats a timeout as a recoverable
 * error, so the viewer can retry.
 */
export function useWriteup(
  investigation: Investigation | undefined,
  investigationId: string,
): UseWriteupResult {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const cacheKey = getWriteupCacheKey(investigationId);
  const lifecycleSignalRef = useRef<AbortSignal | null>(null);

  const fetchWriteup = useCallback(
    async (signal?: AbortSignal) => {
      setError(false);
      setLoading(true);
      if (!investigation) {
        setLoading(false);
        setError(true);
        return;
      }
      let cached: string | null = null;
      try {
        cached = sessionStorage.getItem(cacheKey);
      } catch {
        /* storage can be unavailable; fetching remains available */
      }
      if (cached) {
        setMarkdown(cached);
        setLoading(false);
        return;
      }
      const controller = new AbortController();
      let timedOut = false;
      const timeout = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, FETCH_TIMEOUT_MS);
      const onAbort = () => controller.abort();
      signal?.addEventListener("abort", onAbort, { once: true });
      try {
        const rawUrl = toRawUrl(investigation.href);
        const res = await fetch(rawUrl, { signal: controller.signal });
        if (timedOut) {
          setError(true);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
        const text = await res.text();
        if (signal?.aborted) return;
        if (timedOut) {
          setError(true);
          return;
        }
        // Cache best-effort (QuotaExceededError in private Safari is swallowed)
        try {
          sessionStorage.setItem(cacheKey, text);
        } catch {
          /* quota — cache is optional */
        }
        setMarkdown(text);
      } catch (err: unknown) {
        if (signal?.aborted) return;
        if (timedOut) {
          setError(true);
          return;
        }
        if ((err as Error)?.name === "AbortError") return;
        console.error(`[WriteupModal] Failed to fetch ${investigation.id}:`, err);
        setError(true);
      } finally {
        clearTimeout(timeout);
        signal?.removeEventListener("abort", onAbort);
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [investigation, cacheKey],
  );

  useEffect(() => {
    setMarkdown(null);
    const controller = new AbortController();
    lifecycleSignalRef.current = controller.signal;
    fetchWriteup(controller.signal);
    return () => {
      controller.abort();
      lifecycleSignalRef.current = null;
    };
  }, [fetchWriteup]);

  const retry = useCallback(() => {
    try {
      sessionStorage.removeItem(cacheKey);
    } catch {
      /* storage can be unavailable; retry still works */
    }
    setError(false);
    setLoading(true);
    void fetchWriteup(lifecycleSignalRef.current || undefined);
  }, [cacheKey, fetchWriteup]);

  return { markdown, loading, error, retry };
}
