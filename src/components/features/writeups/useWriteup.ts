import { useCallback, useEffect, useRef, useState } from "react";
import type { Investigation } from "@/types";
import { loadWriteupMarkdown } from "@/components/features/writeups/writeupContent";

export type UseWriteupResult = {
  markdown: string | null;
  loading: boolean;
  error: boolean;
  /** Re-runs the load of the current writeup. */
  retry: () => void;
};

/**
 * Loads the markdown of a writeup from the bundled content (lazy chunk per slug).
 * Results arriving after unmount or after a newer request are ignored.
 */
export function useWriteup(
  investigation: Investigation | undefined,
  investigationId: string,
): UseWriteupResult {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const requestRef = useRef(0);
  const slug = investigation?.slug;

  const load = useCallback(async () => {
    const request = ++requestRef.current;
    setError(false);
    setLoading(true);
    if (!slug) {
      setMarkdown(null);
      setLoading(false);
      setError(true);
      return;
    }
    try {
      const text = await loadWriteupMarkdown(slug);
      if (request !== requestRef.current) return;
      setMarkdown(text);
      setLoading(false);
    } catch (err: unknown) {
      if (request !== requestRef.current) return;
      console.error(`[Writeup] Failed to load ${investigationId}:`, err);
      setMarkdown(null);
      setError(true);
      setLoading(false);
    }
  }, [slug, investigationId]);

  useEffect(() => {
    setMarkdown(null);
    void load();
    const counter = requestRef;
    return () => {
      // Invalidate any in-flight request on unmount or slug change.
      counter.current++;
    };
  }, [load]);

  const retry = useCallback(() => {
    void load();
  }, [load]);

  return { markdown, loading, error, retry };
}
