import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { certificateById } from "@/data/certificateCatalog";
import { MODAL_REQUEST_EVENT, type ModalRequest } from "./modalRequests";
import { validateModalSearch } from "./modalSearch";

// The certificate modal is lazy: the PDF/image viewer loads only when opened.
const CertModal = lazy(() =>
  import("@/components/features/certificates/CertModal").then((m) => ({ default: m.CertModal })),
);

function currentHash(): string | undefined {
  return window.location.hash ? window.location.hash.slice(1) : undefined;
}

/**
 * Renders the certificate modal from the `?cert=` search param. Opening pushes a history entry, so the browser Back button
 * closes the modal through the router. A modal reached by a shared link is
 * closed by replacing the URL instead, so Back does not leave the site.
 */
export function ModalHost() {
  // Re-validate: a non-strict read can include raw, unvalidated keys from the URL.
  const search = validateModalSearch(useSearch({ strict: false }));
  const navigate = useNavigate();
  const router = useRouter();
  const openedInApp = useRef(false);

  const certId = search.cert;

  // Keep the last payload mounted until its exit animation completes.
  const [shownCert, setShownCert] = useState(certId);
  if (certId && certId !== shownCert) setShownCert(certId);

  useEffect(() => {
    if (!certId) openedInApp.current = false;
  }, [certId]);

  useEffect(() => {
    const onRequest = (event: Event) => {
      const request = (event as CustomEvent<ModalRequest>).detail;
      openedInApp.current = true;
      // Closing goes Back to this entry; flag it so the router does not scroll to
      // the (possibly stale) hash when that entry becomes current again.
      window.history.replaceState(
        { ...window.history.state, __hashScrollIntoViewOptions: false },
        "",
      );
      void navigate({
        to: "/",
        search: {
          cert: request.id,
        },
        hash: currentHash(),
        // The hash may be stale (last jumped section); never scroll to it.
        hashScrollIntoView: false,
        resetScroll: false,
      });
    };
    window.addEventListener(MODAL_REQUEST_EVENT, onRequest);
    return () => window.removeEventListener(MODAL_REQUEST_EVENT, onRequest);
  }, [navigate]);

  const close = useCallback(() => {
    if (openedInApp.current) {
      router.history.back();
      return;
    }
    void navigate({
      to: "/",
      search: {},
      hash: currentHash(),
      replace: true,
      hashScrollIntoView: false,
      resetScroll: false,
    });
  }, [navigate, router]);

  const certificate = shownCert ? certificateById(shownCert) : undefined;

  return (
    <>
      {certificate && (
        <Suspense fallback={null}>
          <CertModal
            cert={certificate.src}
            title={certificate.title}
            isOpen={certId === shownCert}
            onClose={close}
            onExitComplete={() => setShownCert(undefined)}
          />
        </Suspense>
      )}
    </>
  );
}
