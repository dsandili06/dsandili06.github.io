import { certificateBySrc } from "@/data/certificateCatalog";

/**
 * Sections ask for a modal through a typed window event instead of owning
 * modal state. `ModalHost` listens, writes the request into the URL and
 * renders the modal, so sections stay independent of the router.
 */
export type ModalRequest = { type: "cert"; id: string } | { type: "writeup"; id: string };

export const MODAL_REQUEST_EVENT = "portfolio:open-modal";

export function requestModal(request: ModalRequest): void {
  window.dispatchEvent(new CustomEvent<ModalRequest>(MODAL_REQUEST_EVENT, { detail: request }));
}

export function openWriteup(id: string): void {
  requestModal({ type: "writeup", id });
}

/** Opens the certificate whose image or PDF lives at `src`. Unknown sources are ignored. */
export function openCertificateBySrc(src: string): void {
  const entry = certificateBySrc(src);
  if (entry) requestModal({ type: "cert", id: entry.id });
}
