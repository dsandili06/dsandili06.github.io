/**
 * Updates the URL hash without adding a history entry. The current history
 * state is kept: TanStack Router stores its entry key there, and replacing it
 * with `null` breaks Back/Forward bookkeeping.
 */
export function replaceHash(id: string): void {
  history.replaceState(history.state, "", `#${id}`);
}
