import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

type CertModalProps = {
  cert: string;
  title: string;
  onClose: () => void;
};

export function CertModal({ cert, title, onClose }: CertModalProps) {
  const panelRef = useFocusTrap<HTMLDivElement>();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="cert-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 md:p-8"
        style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
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
              onClick={onClose}
              aria-label="Cerrar"
              className="ml-4 shrink-0 flex items-center justify-center w-9 h-9 border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Content */}
          <div
            className="flex-1 border border-border-dim overflow-hidden flex items-center justify-center p-2 rounded"
            style={{ background: "#0b1118", minHeight: 0 }}
          >
            <img
              src={cert}
              alt={title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain rounded"
              style={{ maxHeight: "78dvh" }}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
              ESC para cerrar
            </span>
            <a
              href={cert}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] hover:underline"
            >
              Abrir en nueva pestaña →
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
