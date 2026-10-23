import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ExternalLink,
  Maximize2,
  Award,
  FileText,
  CheckCircle2,
  Clock,
  Target,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import type { ControllerRef } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useOverlayLifecycle } from "@/hooks/useOverlayLifecycle";
import { useModalHistory } from "@/hooks/useModalHistory";
import { SAL1_REVIEW } from "@/data/sal1Review";
import { SECURITY_PLUS_REVIEW } from "@/data/securityPlusReview";

type CertModalProps = {
  cert: string;
  title: string;
  isOpen?: boolean;
  initialTab?: "cert" | "review";
  onClose: () => void;
  onExitComplete?: () => void;
};

export function CertModal({
  cert,
  title,
  isOpen = true,
  initialTab,
  onClose,
  onExitComplete,
}: CertModalProps) {
  const isSal1 = cert === "/certs/THM-SAL1-Certificate.png";
  const isSecurityPlus = cert === "/certs/comptia-security-plus-sy0-701.webp";
  const hasReview = isSal1 || isSecurityPlus;
  const review = isSal1 ? SAL1_REVIEW : hasReview ? SECURITY_PLUS_REVIEW : null;
  const [activeTab, setActiveTab] = useState<"cert" | "review">(() =>
    initialTab === "cert" ? "cert" : hasReview ? "review" : "cert",
  );
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const lightboxControllerRef = useRef<ControllerRef | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const previousIdentity = useRef(`${cert}\0${title}`);
  const restoreDialogFocusOnLightboxExit = useRef(false);

  const panelRef = useFocusTrap<HTMLDivElement>();
  const { handleClose } = useModalHistory({
    isOpen,
    onClose,
    stateData: { modal: "cert", title },
  });
  const { overlayRef } = useOverlayLifecycle({
    isOpen,
    onEscape: () => {
      if (lightboxImage) return false;
      handleClose();
      return true;
    },
  });
  const panelLifecycleRef = useCallback(
    (node: HTMLDivElement | null) => {
      dialogRef.current = node;
      panelRef(node);
      overlayRef(node);
    },
    [panelRef, overlayRef],
  );

  useEffect(() => {
    setActiveTab(initialTab === "cert" ? "cert" : hasReview ? "review" : "cert");
  }, [initialTab, hasReview, cert, title]);

  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp"
    ) {
      e.preventDefault();
      const nextTab = activeTab === "cert" ? "review" : "cert";
      setActiveTab(nextTab);
      const nextEl = document.getElementById(nextTab === "cert" ? "tab-cert" : "tab-review");
      nextEl?.focus();
    }
  };

  useEffect(() => {
    const identity = `${cert}\0${title}`;
    if (previousIdentity.current !== identity) {
      previousIdentity.current = identity;
      if (lightboxImage) {
        restoreDialogFocusOnLightboxExit.current = true;
        lightboxControllerRef.current?.close();
      }
    }
  }, [cert, title, lightboxImage]);

  useEffect(() => {
    if (lightboxImage || !restoreDialogFocusOnLightboxExit.current) return;
    restoreDialogFocusOnLightboxExit.current = false;
    if (!isOpenRef.current) return;
    const dialog = dialogRef.current;
    if (!dialog?.isConnected) return;
    const activeTab = dialog.querySelector<HTMLElement>('[role="tab"][tabindex="0"]');
    const closeButton = dialog.querySelector<HTMLElement>('button[aria-label="Cerrar"]');
    (activeTab ?? closeButton)?.focus();
  }, [lightboxImage]);

  return createPortal(
    <>
      <AnimatePresence onExitComplete={onExitComplete}>
        {isOpen && (
          <motion.div
            key="cert-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
            style={{
              background: "color-mix(in srgb, var(--background) 92%, transparent)",
              backdropFilter: "blur(14px) saturate(160%)",
              WebkitBackdropFilter: "blur(14px) saturate(160%)",
            }}
            onClick={handleClose}
          >
            <motion.div
              ref={panelLifecycleRef}
              key="cert-modal-panel"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full flex flex-col bg-[var(--surface)] border border-border-dim rounded-lg shadow-2xl overflow-hidden ${
                hasReview ? "max-w-5xl" : "max-w-4xl"
              }`}
              style={{
                maxHeight: hasReview ? "92dvh" : "90dvh",
                boxShadow:
                  "0 12px 40px -4px rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="certificate-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-4 sm:p-5 border-b border-border-dim bg-[var(--surface-2)] shrink-0">
                <div className="min-w-0 pr-2">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] flex items-center gap-1.5">
                      {isSal1 ? (
                        <>
                          <ShieldCheck size={13} className="text-[var(--accent)]" />
                          TRYHACKME // SAL1-VERIFIED
                        </>
                      ) : (
                        "CERTIFICADO"
                      )}
                    </span>
                    {isSal1 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs font-mono text-[9px] uppercase tracking-wider bg-[var(--accent-green)]/15 border border-[var(--accent-green)]/40 text-[var(--accent-green)]">
                        <CheckCircle2 size={10} />
                        Score Oficial: 948 / 1000 · Aprobado (Intento 1)
                      </span>
                    )}
                  </div>
                  <h2
                    id="certificate-title"
                    className="font-display font-bold text-lg sm:text-xl md:text-2xl text-foreground leading-snug truncate"
                  >
                    {title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Cerrar"
                  className="shrink-0 flex items-center justify-center size-11 min-h-[44px] min-w-[44px] border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:border-[var(--accent)] transition-colors cursor-pointer rounded-xs"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Tab Bar (Only when SAL1 review is available) */}
              {hasReview && (
                <div
                  role="tablist"
                  aria-label="Vistas del expediente de certificación"
                  onKeyDown={handleTabKeyDown}
                  className="flex border-b border-border-dim px-4 sm:px-6 bg-[var(--surface-2)] gap-2 shrink-0"
                >
                  <button
                    type="button"
                    role="tab"
                    id="tab-cert"
                    aria-selected={activeTab === "cert"}
                    aria-controls="panel-cert"
                    tabIndex={activeTab === "cert" ? 0 : -1}
                    onClick={() => setActiveTab("cert")}
                    className={`py-3 px-3 sm:px-4 font-mono text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] ${
                      activeTab === "cert"
                        ? "border-[var(--accent)] text-[var(--accent)] font-semibold bg-[var(--surface)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-foreground"
                    }`}
                  >
                    <Award size={14} />
                    <span>[ CERTIFICADO OFICIAL ]</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="tab-review"
                    aria-selected={activeTab === "review"}
                    aria-controls="panel-review"
                    tabIndex={activeTab === "review" ? 0 : -1}
                    onClick={() => setActiveTab("review")}
                    className={`py-3 px-3 sm:px-4 font-mono text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] ${
                      activeTab === "review"
                        ? "border-[var(--accent)] text-[var(--accent)] font-semibold bg-[var(--surface)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-foreground"
                    }`}
                  >
                    <FileText size={14} />
                    <span>[ REVIEW TÉCNICA DEL EXAMEN ]</span>
                    <span className="hidden sm:inline-flex ml-1 px-1.5 py-0.5 rounded-xs text-[9px] bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/40 font-mono font-bold">
                      {isSal1 ? "948 PTS" : "791 PTS"}
                    </span>
                  </button>
                </div>
              )}

              {/* Modal Body */}
              {activeTab === "cert" ? (
                /* TAB 1: CERTIFICADO OFICIAL */
                <div
                  id={hasReview ? "panel-cert" : undefined}
                  role={hasReview ? "tabpanel" : undefined}
                  aria-labelledby={hasReview ? "tab-cert" : undefined}
                  tabIndex={hasReview ? 0 : undefined}
                  data-lenis-prevent
                  className="flex-1 flex flex-col min-h-0 overflow-hidden focus-visible:outline-none"
                >
                  <div
                    className="flex-1 overflow-hidden flex items-center justify-center p-3 sm:p-4"
                    style={{ background: "var(--surface-2)", minHeight: 0 }}
                  >
                    {cert.toLowerCase().endsWith(".pdf") ? (
                      <iframe
                        src={cert}
                        title={title}
                        className="w-full h-full min-h-[65dvh] rounded border-0"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setLightboxImage(cert)}
                        className="group relative cursor-pointer flex items-center justify-center rounded overflow-hidden max-h-[70dvh] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        title="Clic para ampliar certificado en pantalla completa"
                        aria-label={`Ampliar certificado oficial de ${title}`}
                      >
                        <img
                          src={cert}
                          alt={title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain rounded transition-transform duration-300 ease-out group-hover:scale-[1.01] transform-gpu backface-hidden will-change-transform"
                          style={{ maxHeight: isSal1 ? "70dvh" : "78dvh" }}
                        />
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 border border-white/10 px-2.5 py-1 rounded font-mono text-[10px] text-white flex items-center gap-1.5 pointer-events-none shadow-md">
                          <Maximize2 size={12} className="text-[var(--accent)]" />
                          Ampliar Certificado
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Footer for Cert Tab */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 border-t border-border-dim bg-[var(--surface-2)] shrink-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                      <span className="md:hidden">Tocá fuera para cerrar</span>
                      <span className="hidden md:inline">ESC para cerrar</span>
                    </span>
                    <div className="flex items-center gap-4">
                      {hasReview && (
                        <button
                          type="button"
                          onClick={() => setActiveTab("review")}
                          className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
                        >
                          <Terminal size={12} />
                          Ver Review Técnica →
                        </button>
                      )}
                      <a
                        href={cert}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] hover:underline inline-flex items-center min-h-[44px] py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
                      >
                        Abrir en nueva pestaña →
                      </a>
                    </div>
                  </div>
                </div>
              ) : review ? (
                /* TAB 2: REVIEW TÉCNICA DEL EXAMEN (SAL1) */
                <div
                  id={hasReview ? "panel-review" : undefined}
                  role={hasReview ? "tabpanel" : undefined}
                  aria-labelledby={hasReview ? "tab-review" : undefined}
                  tabIndex={hasReview ? 0 : undefined}
                  data-lenis-prevent
                  className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 focus-visible:outline-none"
                  style={{ background: "var(--surface)" }}
                >
                  {/* Telemetry Metric Cards */}
                  <div
                    className={`grid grid-cols-2 ${isSal1 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-3`}
                  >
                    <div className="p-3.5 sm:p-4 rounded bg-[var(--surface-2)] border border-border-dim flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]">
                        <span>Puntaje Obtenido</span>
                        <Target size={14} className="text-[var(--accent-green)]" />
                      </div>
                      <div className="mt-2">
                        <div className="font-display font-bold text-2xl sm:text-3xl text-[var(--accent-green)]">
                          {review.score}{" "}
                          <span className="text-xs font-mono text-[var(--muted-foreground)] font-normal">
                            / {review.maxScore}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--accent-green)]">
                          {isSal1 ? "+198 pts s/ umbral (750)" : "Primer intento"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded bg-[var(--surface-2)] border border-border-dim flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]">
                        <span>Tiempo de Examen</span>
                        <Clock size={14} className="text-[var(--accent)]" />
                      </div>
                      <div className="mt-2">
                        <div className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                          {review.duration}
                        </div>
                        {isSal1 && (
                          <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                            Ventana máx: 24 horas
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded bg-[var(--surface-2)] border border-border-dim flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]">
                        <span>Resultado Oficial</span>
                        <CheckCircle2 size={14} className="text-[var(--accent-green)]" />
                      </div>
                      <div className="mt-2">
                        <div className="font-display font-bold text-2xl sm:text-3xl text-[var(--accent-green)]">
                          {review.result}
                        </div>
                        <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                          Intento #{review.attempt} (Primero)
                        </span>
                      </div>
                    </div>

                    {isSal1 && (
                      <div className="p-3.5 sm:p-4 rounded bg-[var(--surface-2)] border border-border-dim flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]">
                          <span>Simulaciones SOC</span>
                          <Terminal size={14} className="text-[var(--accent)]" />
                        </div>
                        <div className="mt-2">
                          <div className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                            2 / 2
                          </div>
                          <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                            Fowl Play & Red Alert C2
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {review.evidenceImage && (
                    <>
                      {/* Official Evidence Banner with Lightbox Trigger */}
                      <div className="p-4 sm:p-5 rounded-md bg-[var(--surface-2)] border border-border-dim space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-[var(--accent-green)] shadow-[0_0_8px_var(--accent-green)]" />
                            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-foreground">
                              Evidencia Oficial de Resultados (TryHackMe Exam Portal)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLightboxImage(review.evidenceImage)}
                            className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Maximize2 size={13} />
                            Ampliar Captura Oficial
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setLightboxImage(review.evidenceImage)}
                          className="group relative w-full rounded-md border border-border-dim overflow-hidden bg-[var(--background)] cursor-pointer flex items-center justify-center text-left py-4 px-2 sm:px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                          aria-label="Ampliar captura oficial de puntaje y escenarios SAL1"
                        >
                          <img
                            src={review.evidenceImage}
                            alt="Captura oficial de resultados de certificación TryHackMe SAL1: 948 puntos sobre 1000, aprobado en 4h 7m 55s"
                            className="max-h-[380px] sm:max-h-[460px] w-auto max-w-full object-contain mx-auto rounded shadow-lg transition-transform duration-300 ease-out group-hover:scale-[1.01] transform-gpu backface-hidden will-change-transform"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 sm:p-4 justify-between pointer-events-none">
                            <span className="font-mono text-xs text-white flex items-center gap-2 font-medium">
                              <Maximize2 size={14} className="text-[var(--accent)]" />
                              Clic para ver captura en pantalla completa
                            </span>
                            <span className="font-mono text-xs text-[var(--accent-green)] font-bold">
                              948 / 1000 · PASS (INTENTO 1)
                            </span>
                          </div>
                        </button>

                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
                          <span>Desglose verificado por telemetría del simulador de TryHackMe</span>
                          <a
                            href={review.evidenceImage}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 min-h-[44px] py-2"
                          >
                            <ExternalLink size={12} />
                            Abrir archivo original →
                          </a>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-3 text-sm sm:text-[15px] text-foreground/85 leading-relaxed">
                    {review.executiveSummary
                      .flatMap((item) => (typeof item === "string" ? [item] : item.paragraphs))
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </div>
              ) : null}

              {/* Footer for Review Tab */}
              {activeTab === "review" && review && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 border-t border-border-dim bg-[var(--surface-2)] shrink-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    <span className="md:hidden">Tocá fuera para cerrar</span>
                    <span className="hidden md:inline">ESC para cerrar</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("cert")}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded border border-border-dim text-[var(--accent)] hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors cursor-pointer min-h-[44px] flex items-center gap-1.5"
                    >
                      <Award size={13} />
                      Ver Certificado Oficial →
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded border border-border-dim text-[var(--muted-foreground)] hover:text-foreground hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors cursor-pointer min-h-[44px] flex items-center"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for Fullscreen inspection (evidence or official cert) */}
      <Lightbox
        open={Boolean(lightboxImage)}
        close={() => setLightboxImage(null)}
        slides={[
          {
            src: lightboxImage ?? (review?.evidenceImage || cert),
            alt:
              lightboxImage === cert
                ? `Certificado oficial ${title}`
                : isSal1
                  ? "TryHackMe SAL1 - Resultados Oficiales del Examen"
                  : `Certificado oficial ${title}`,
          },
        ]}
        carousel={{ finite: true }}
        controller={{ ref: lightboxControllerRef }}
        styles={{ container: { zIndex: 10000 } }}
      />
    </>,
    document.body,
  );
}
