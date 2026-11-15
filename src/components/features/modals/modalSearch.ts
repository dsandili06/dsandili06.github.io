import { certificateById } from "@/data/certificateCatalog";

/**
 * Search params that open a modal on the portfolio route.
 * Only one modal is open at a time.
 */
export type ModalSearch = {
  cert?: string;
};

/**
 * `validateSearch` for the `/` route. Unknown or malformed ids are dropped so
 * a shared or tampered URL never opens a modal for content that does not exist.
 */
export function validateModalSearch(search: Record<string, unknown>): ModalSearch {
  if (typeof search.cert === "string" && certificateById(search.cert)) {
    return { cert: search.cert };
  }
  return {};
}
