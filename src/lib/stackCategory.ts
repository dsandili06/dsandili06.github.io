/** Lets the command palette select a category in the Stack section. */
export const STACK_CATEGORY_EVENT = "set-stack-category";

export type StackCategoryDetail = { category: string };

export function selectStackCategory(category: string): void {
  window.dispatchEvent(
    new CustomEvent<StackCategoryDetail>(STACK_CATEGORY_EVENT, { detail: { category } }),
  );
}
