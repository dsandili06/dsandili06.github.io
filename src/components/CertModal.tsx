import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useModalHistory } from "@/hooks/useModalHistory";
import { getLenis } from "@/lib/lenis";

type CertModalProps = {
  cert: string;
  title: string;
  isOpen?: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
};

export function CertModal({ cert, title, isOpen = true, onClose, onExitComplete }: CertModalProps) {
  const panelRef = useFocusTrap<HTMLDivElement>();
  const { handleClose } = useModalHistory({
    isOpen,
    onClose,
    stateData: { modal: "cert", title },
  });
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      getLenis()?.start();
      return;
    }
    const lenis = getLenis();
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && (
        <motion.div
          key="cert-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 md:p-8 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
          style={{ background: "rgba(4, 7, 11, 0.9)", backdropFilter: "blur(12px)" }}
          onClick={handleClose}
        >
          <motion.div
            ref={panelRef}
            key="cert-modal-panel"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl flex flex-col"
            style={{ maxHeight: "90dvh" }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                  CERTIFICADO
                </span>
                <h3
                  id="certificate-title"
                  className="font-display font-semibold text-base text-foreground leading-snug mt-0.5"
                >
                  {title}
                </h3>
              </div>
              <button
                onClick={handleClose}
                aria-label="Cerrar"
                className="ml-4 shrink-0 flex items-center justify-center size-11 min-h-[44px] min-w-[44px] border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            <div
              className="flex-1 border border-border-dim overflow-hidden flex items-center justify-center p-2 rounded"
              style={{ background: "#0b1118", minHeight: 0 }}
            >
              {cert.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={cert}
                  title={title}
                  className="w-full h-full min-h-[75dvh] rounded border-0"
                />
              ) : (
                <img
                  src={cert}
                  alt={title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain rounded"
                  style={{ maxHeight: "78dvh" }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                <span className="md:hidden">Tocá fuera para cerrar</span>
                <span className="hidden md:inline">ESC para cerrar</span>
              </span>
              <a
                href={cert}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] hover:underline inline-flex items-center min-h-[44px] py-2"
              >
                Abrir en nueva pestaña →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
