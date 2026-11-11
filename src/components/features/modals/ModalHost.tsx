import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { certificateById } from "@/data/certificateCatalog";
import { WriteupModalFallback } from "@/components/features/writeups/WriteupModalFallback";
import { MODAL_REQUEST_EVENT, type ModalRequest } from "./modalRequests";
import { validateModalSearch } from "./modalSearch";

// Both modals are lazy: react-markdown and the lightbox load only when opened.
const WriteupModal = lazy(() =>
  import("@/components/features/writeups/WriteupModal").then((m) => ({ default: m.WriteupModal })),
);
const CertModal = lazy(() =>
  import("@/components/features/certificates/CertModal").then((m) => ({ default: m.CertModal })),
);

function currentHash(): string | undefined {
  return window.location.hash ? window.location.hash.slice(1) : undefined;
}

/**
 * Renders the certificate and writeup modals from the `?cert=` / `?writeup=`
 * search params. Opening pushes a history entry, so the browser Back button
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
  const writeupId = search.writeup;

  // Keep the last payload mounted until its exit animation completes.
  const [shownCert, setShownCert] = useState(certId);
  const [shownWriteup, setShownWriteup] = useState(writeupId);
  if (certId && certId !== shownCert) setShownCert(certId);
  if (writeupId && writeupId !== shownWriteup) setShownWriteup(writeupId);

  useEffect(() => {
    if (!certId && !writeupId) openedInApp.current = false;
  }, [certId, writeupId]);

  useEffect(() => {
    const onRequest = (event: Event) => {
      const request = (event as CustomEvent<ModalRequest>).detail;
      openedInApp.current = true;
      void navigate({
        to: "/",
        search: {
          cert: request.type === "cert" ? request.id : undefined,
          writeup: request.type === "writeup" ? request.id : undefined,
        },
        hash: currentHash(),
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
      resetScroll: false,
    });
  }, [navigate, router]);

  const certificate = shownCert ? certificateById(shownCert) : undefined;

  return (
    <>
      {shownWriteup && (
        <Suspense fallback={<WriteupModalFallback />}>
          <WriteupModal
            investigationId={shownWriteup}
            isOpen={writeupId === shownWriteup}
            onClose={close}
            onExitComplete={() => setShownWriteup(undefined)}
          />
        </Suspense>
      )}
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
