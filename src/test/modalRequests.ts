import { MODAL_REQUEST_EVENT, type ModalRequest } from "@/components/features/modals/modalRequests";

/** Records modal requests dispatched by sections. Call `stop()` in afterEach. */
export function captureModalRequests() {
  const requests: ModalRequest[] = [];
  const onRequest = (event: Event) => requests.push((event as CustomEvent<ModalRequest>).detail);
  window.addEventListener(MODAL_REQUEST_EVENT, onRequest);
  return {
    requests,
    stop: () => window.removeEventListener(MODAL_REQUEST_EVENT, onRequest),
  };
}
