import { useState, useEffect } from "react";
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
import "yet-another-react-lightbox/styles.css";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useModalHistory } from "@/hooks/useModalHistory";
import { getLenis } from "@/lib/lenis";
import { SAL1_REVIEW } from "@/data/sal1Review";

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
  const isSal1 = title.includes("SAL1") || cert.includes("SAL1");
  const [activeTab, setActiveTab] = useState<"cert" | "review">(() =>
    initialTab ? initialTab : isSal1 ? "review" : "cert",
  );
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const panelRef = useFocusTrap<HTMLDivElement>();
  const { handleClose } = useModalHistory({
    isOpen,
    onClose,
    stateData: { modal: "cert", title },
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (isSal1) {
      setActiveTab("review");
    } else {
      setActiveTab("cert");
    }
  }, [initialTab, isSal1, cert]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      getLenis()?.start();
      return;
    }
    const lenis = getLenis();
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !lightboxImage) {
        handleClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, lightboxImage, handleClose]);

  const review = SAL1_REVIEW;

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
              background: "rgba(4, 7, 11, 0.92)",
              backdropFilter: "blur(14px) saturate(160%)",
            }}
            onClick={handleClose}
          >
            <motion.div
              ref={panelRef}
              key="cert-modal-panel"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-full flex flex-col bg-[#070b12]/98 border border-white/10 rounded-lg shadow-2xl overflow-hidden ${
                isSal1 ? "max-w-5xl" : "max-w-4xl"
              }`}
              style={{
                maxHeight: isSal1 ? "92dvh" : "90dvh",
                boxShadow:
                  "0 12px 40px -4px rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="certificate-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-4 sm:p-5 border-b border-white/10 bg-[#090e17]/90 shrink-0">
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
                  <h3
                    id="certificate-title"
                    className="font-display font-bold text-lg sm:text-xl md:text-2xl text-foreground leading-snug truncate"
                  >
                    {title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Cerrar"
                  className="shrink-0 flex items-center justify-center size-11 min-h-[44px] min-w-[44px] border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer rounded-xs"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Tab Bar (Only when SAL1 review is available) */}
              {isSal1 && (
                <div className="flex border-b border-white/10 px-4 sm:px-6 bg-[#080d15] gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab("cert")}
                    className={`py-3 px-3 sm:px-4 font-mono text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                      activeTab === "cert"
                        ? "border-[var(--accent)] text-[var(--accent)] font-semibold bg-white/[0.02]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-foreground"
                    }`}
                  >
                    <Award size={14} />
                    <span>[ CERTIFICADO OFICIAL ]</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("review")}
                    className={`py-3 px-3 sm:px-4 font-mono text-xs uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                      activeTab === "review"
                        ? "border-[var(--accent)] text-[var(--accent)] font-semibold bg-white/[0.02]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-foreground"
                    }`}
                  >
                    <FileText size={14} />
                    <span>[ REVIEW TÉCNICA DEL EXAMEN ]</span>
                    <span className="hidden sm:inline-flex ml-1 px-1.5 py-0.5 rounded-xs text-[9px] bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/40 font-mono font-bold">
                      948 PTS
                    </span>
                  </button>
                </div>
              )}

              {/* Modal Body */}
              {activeTab === "cert" ? (
                /* TAB 1: CERTIFICADO OFICIAL */
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <div
                    className="flex-1 overflow-hidden flex items-center justify-center p-3 sm:p-4"
                    style={{ background: "#0b1118", minHeight: 0 }}
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
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 border-t border-white/10 bg-[#06090e] shrink-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                      <span className="md:hidden">Tocá fuera para cerrar</span>
                      <span className="hidden md:inline">ESC para cerrar</span>
                    </span>
                    <div className="flex items-center gap-4">
                      {isSal1 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab("review")}
                          className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Terminal size={12} />
                          Ver Review Técnica →
                        </button>
                      )}
                      <a
                        href={cert}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] hover:underline inline-flex items-center min-h-[44px] py-2"
                      >
                        Abrir en nueva pestaña →
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: REVIEW TÉCNICA DEL EXAMEN (SAL1) */
                <div
                  data-lenis-prevent
                  className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8"
                  style={{ background: "#070b12" }}
                >
                  {/* Telemetry Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3.5 sm:p-4 rounded bg-[#0b121c] border border-white/10 flex flex-col justify-between">
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
                          +198 pts s/ umbral (750)
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded bg-[#0b121c] border border-white/10 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]">
                        <span>Tiempo de Examen</span>
                        <Clock size={14} className="text-[var(--accent)]" />
                      </div>
                      <div className="mt-2">
                        <div className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                          {review.duration}
                        </div>
                        <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                          Ventana máx: 24 horas
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded bg-[#0b121c] border border-white/10 flex flex-col justify-between">
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

                    <div className="p-3.5 sm:p-4 rounded bg-[#0b121c] border border-white/10 flex flex-col justify-between">
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
                  </div>

                  {/* Official Evidence Banner with Lightbox Trigger */}
                  <div className="p-4 sm:p-5 rounded-md bg-[#090f18] border border-white/10 space-y-3">
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
                      className="group relative w-full rounded-md border border-white/10 overflow-hidden bg-[#04080e] cursor-pointer flex items-center justify-center text-left py-4 px-2 sm:px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
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

                  {/* Resumen Ejecutivo */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-border-dim/60" />
                      <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                        Resumen Ejecutivo & Alcance
                      </h4>
                      <div className="h-px flex-1 bg-border-dim/60" />
                    </div>

                    <div className="border-l-2 border-[var(--accent)]/60 pl-4 sm:pl-5 py-2 bg-white/[0.02] rounded-r space-y-3 text-xs sm:text-sm text-foreground/85 leading-relaxed">
                      {review.executiveSummary.map((paragraph) => (
                        <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Escenarios Evaluados */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-border-dim/60" />
                      <h4 className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--accent)] font-semibold">
                        Escenarios Evaluados
                      </h4>
                      <div className="h-px flex-1 bg-border-dim/60" />
                    </div>

                    <div className="space-y-4">
                      {review.sections.map((section) => {
                        const percentage = Math.round((section.score / section.maxScore) * 100);

                        return (
                          <div
                            key={section.id}
                            className="p-4 sm:p-5 rounded-md bg-[#090e17] border border-white/10 space-y-3"
                          >
                            {/* Scenario Header: Name & Score */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                              <h5 className="font-display font-bold text-base sm:text-lg text-foreground">
                                {section.name}
                              </h5>
                              <div className="flex items-baseline gap-1.5 font-mono">
                                <span className="text-xl sm:text-2xl font-bold text-[var(--accent-green)] leading-none">
                                  {section.score}
                                </span>
                                <span className="text-xs text-[var(--muted-foreground)]">
                                  / {section.maxScore} pts ({percentage}%)
                                </span>
                              </div>
                            </div>

                            {/* Brief Summary */}
                            <p className="text-xs sm:text-[13px] text-foreground/80 leading-relaxed">
                              {section.overview}
                            </p>

                            {/* Takeaway */}
                            <div className="p-3 rounded bg-[color-mix(in_oklab,var(--accent)_4%,transparent)] border border-[var(--accent)]/20 text-[11px] sm:text-xs text-foreground/85 font-mono leading-relaxed">
                              💡 <strong className="text-[var(--accent)]">Takeaway:</strong>{" "}
                              {section.takeaway}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Veredicto y Recomendaciones */}
                  <div className="p-4 sm:p-5 rounded-md bg-[#0a111a] border border-[var(--accent)]/30 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                          Evaluación Técnica Final
                        </span>
                        <h4 className="font-display font-bold text-base sm:text-lg text-foreground mt-0.5">
                          Veredicto del Analista & Recomendaciones
                        </h4>
                      </div>
                      <div className="font-mono text-right">
                        <span className="text-[10px] text-[var(--muted-foreground)] uppercase">
                          Valoración
                        </span>
                        <div className="text-xl sm:text-2xl font-bold text-[var(--accent)]">
                          {review.verdict.rating}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-green)] font-semibold block">
                          Aspectos Sobresalientes:
                        </span>
                        <ul className="space-y-1.5">
                          {review.verdict.strengths.map((s) => (
                            <li
                              key={s}
                              className="text-[11px] sm:text-xs text-foreground/80 flex items-start gap-2"
                            >
                              <span className="text-[var(--accent-green)] font-mono">✓</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">
                          Puntos a Considerar:
                        </span>
                        <ul className="space-y-1.5">
                          {review.verdict.considerations.map((c) => (
                            <li
                              key={c}
                              className="text-[11px] sm:text-xs text-foreground/80 flex items-start gap-2"
                            >
                              <span className="text-amber-400 font-mono">!</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer for Review Tab */}
              {activeTab === "review" && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 border-t border-white/10 bg-[#06090e] shrink-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                    <span className="md:hidden">Tocá fuera para cerrar</span>
                    <span className="hidden md:inline">
                      ESC para cerrar · Clic fuera para salir
                    </span>
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("cert")}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded border border-border-dim text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer min-h-[44px] flex items-center gap-1.5"
                    >
                      <Award size={13} />
                      Ver Certificado Oficial →
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded border border-border-dim text-[var(--muted-foreground)] hover:text-foreground hover:border-white/30 transition-colors cursor-pointer min-h-[44px] flex items-center"
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
            src: lightboxImage ?? review.evidenceImage,
            alt:
              lightboxImage === cert
                ? `Certificado oficial ${title}`
                : "TryHackMe SAL1 - Resultados Oficiales del Examen",
          },
        ]}
        carousel={{ finite: true }}
        styles={{ container: { zIndex: 10000 } }}
      />
    </>,
    document.body,
  );
}
