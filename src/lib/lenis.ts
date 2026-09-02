/**
 * Global Lenis instance contract.
 * LenisProvider exposes the instance on window.__lenis so that
 * WriteupModal (pause/resume) and SectionRail (scrollTo) can use it
 * without a React context. It may be undefined when prefers-reduced-motion
 * is active (LenisProvider returns early in that case).
 */
export type LenisInstance = {
  stop: () => void;
  start: () => void;
  scrollTo: (target: Element, opts?: { offset?: number }) => void;
};

export function getLenis(): LenisInstance | undefined {
  return (window as unknown as Record<string, unknown>).__lenis as LenisInstance | undefined;
}
