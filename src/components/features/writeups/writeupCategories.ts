import { INVESTIGATIONS } from "@/data/investigations";

/** Every category present in the writeup catalog, in first-seen order. */
export const WRITEUP_CATEGORIES: string[] = [
  ...new Set(INVESTIGATIONS.flatMap((investigation) => investigation.categories)),
];

export type WriteupsSearch = { cat?: string };

/** Keeps `cat` only when it names a known category; unknown values are dropped. */
export function validateWriteupsSearch(search: Record<string, unknown>): WriteupsSearch {
  const cat = search.cat;
  return typeof cat === "string" && WRITEUP_CATEGORIES.includes(cat) ? { cat } : {};
}
