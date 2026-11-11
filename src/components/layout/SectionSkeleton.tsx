/** Suspense fallback for lazy below-the-fold sections. */
export function SectionSkeleton() {
  return (
    <div className="py-16 md:py-32 border-b border-border-dim">
      <div className="mb-14 md:mb-20">
        <div className="h-8 w-32 bg-[var(--surface)] rounded animate-pulse" />
        <div className="mt-3 h-12 w-64 bg-[var(--surface)] rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-24 bg-[var(--surface)] rounded animate-pulse" />
        <div className="h-24 bg-[var(--surface)] rounded animate-pulse" />
        <div className="h-24 bg-[var(--surface)] rounded animate-pulse" />
      </div>
    </div>
  );
}
