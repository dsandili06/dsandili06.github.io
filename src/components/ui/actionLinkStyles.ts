const BASE =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xs px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";

/** Solid accent call to action. */
export const ACTION_PRIMARY_CLASS = `${BASE} bg-[var(--accent)] text-[var(--background)] hover:brightness-110`;

/** Outlined accent call to action. */
export const ACTION_SECONDARY_CLASS = `${BASE} border border-[var(--accent)] bg-transparent text-[var(--accent)] hover:bg-[var(--surface-2)]`;
