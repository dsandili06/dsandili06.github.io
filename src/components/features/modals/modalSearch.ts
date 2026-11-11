import { certificateById } from "@/data/certificateCatalog";
import { investigationById } from "@/components/features/writeups/writeupSource";

/**
 * Search params that open a modal on the portfolio route.
 * Only one modal is open at a time, so at most one key is set.
 */
export type ModalSearch = {
  cert?: string;
  writeup?: string;
};

/**
 * `validateSearch` for the `/` route. Unknown or malformed ids are dropped so
 * a shared or tampered URL never opens a modal for content that does not exist.
 */
export function validateModalSearch(search: Record<string, unknown>): ModalSearch {
  if (typeof search.cert === "string" && certificateById(search.cert)) {
    return { cert: search.cert };
  }
  if (typeof search.writeup === "string" && investigationById(search.writeup)) {
    return { writeup: search.writeup };
  }
  return {};
}
