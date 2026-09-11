import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ExternalLink,
  Maximize2,
  CheckCircle2,
  TrendingUp,
  Clock,
  Target,
  Award,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useModalHistory } from "@/hooks/useModalHistory";
import { getLenis } from "@/lib/lenis";
import type { Certification, MockExam } from "@/types";

interface CompTIAModalProps {
  certification: Certification;
  isOpen?: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
}

export function CompTIAModal({
  certification,
  isOpen = true,
  onClose,
  onExitComplete,
}: CompTIAModalProps) {
  const mockExams: MockExam[] = certification.mockExams ?? [];
  const [selectedIndex, setSelectedIndex] = useState<number>(() =>
    mockExams.length > 0 ? mockExams.length - 1 : 0,
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const panelRef = useFocusTrap<HTMLDivElement>();
  const { handleClose } = useModalHistory({
    isOpen,
    onClose,
    stateData: { modal: "comptia-prep", title: certification.title },
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
      if (e.key === "Escape" && !lightboxOpen) {
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
  }, [isOpen, lightboxOpen, handleClose]);

  if (mockExams.length === 0) return null;

  const currentExam = mockExams[selectedIndex] ?? mockExams[0];
  const latestExam = mockExams[mockExams.length - 1];
  const firstExam = mockExams[0];
  const totalGain = latestExam.score - firstExam.score;

  return createPortal(
    <>
      <AnimatePresence onExitComplete={onExitComplete}>
        {isOpen && (
          <motion.div
            key="comptia-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            style={{
              background: "rgba(4, 7, 11, 0.88)",
              backdropFilter: "blur(14px) saturate(180%)",
            }}
            onClick={handleClose}
          >
            <motion.div
              ref={panelRef}
              key="comptia-modal-panel"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl flex flex-col bg-[#070b12]/95 border border-white/10 rounded-lg shadow-2xl overflow-hidden"
              style={{
                maxHeight: "92dvh",
                boxShadow:
                  "0 8px 32px -2px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="comptia-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-4 sm:p-6 pb-4 border-b border-white/10 bg-[#090e17]/80 shrink-0">
                <div className="min-w-0 pr-2">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] flex items-center gap-1.5">
                      <Award size={13} className="text-[var(--accent)]" />
                      SIMULACROS JASON DION · SY0-701
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs font-mono text-[9px] uppercase tracking-wider bg-[var(--accent-green)]/15 border border-[var(--accent-green)]/40 text-[var(--accent-green)]">
                      <CheckCircle2 size={10} />
                      Objetivo CompTIA Superado (87% vs ~83%)
                    </span>
                  </div>
                  <h2
                    id="comptia-modal-title"
                    className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-foreground leading-tight"
                  >
                    Seguimiento CompTIA Security+
                  </h2>
                  <p className="mt-1 text-xs font-mono text-[var(--muted-foreground)]">
                    Registro de evolución técnica y desglose de dominios en exámenes de práctica
                    oficiales.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Cerrar modal"
                  className="shrink-0 flex items-center justify-center size-11 min-h-[44px] min-w-[44px] border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer rounded-xs"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Global Benchmark Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 sm:p-4 rounded-md bg-[#0d1420] border border-white/5 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-cyan-500/10 text-[var(--accent)] shrink-0">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                        Evolución Neta
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {firstExam.score}% → {latestExam.score}%{" "}
                        <span className="text-[var(--accent-green)] font-semibold">
                          (+{totalGain}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-green-500/10 text-[var(--accent-green)] shrink-0">
                      <Target size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                        Aprobación CompTIA
                      </div>
                      <div className="text-sm font-bold text-[var(--accent-green)]">
                        ~83.3% (750/900) · <span className="underline">Superado</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-amber-500/10 text-amber-400 shrink-0">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                        Criterio Jason Dion
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        90% Target ·{" "}
                        <span className="text-amber-400 font-semibold">87% actual (-3%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline / Selector de 4 Simulacros */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                      Historial de Intentos
                    </span>
                    <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
                      Selecciona un simulacro para ver métricas y captura
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {mockExams.map((exam, idx) => {
                      const isSelected = idx === selectedIndex;
                      const prevExam = idx > 0 ? mockExams[idx - 1] : null;
                      const delta = prevExam ? exam.score - prevExam.score : null;

                      return (
                        <button
                          key={exam.id}
                          type="button"
                          onClick={() => setSelectedIndex(idx)}
                          className={`p-3 rounded-md text-left transition-all relative border cursor-pointer ${
                            isSelected
                              ? "bg-[var(--surface-2)] border-[var(--accent)] shadow-[0_0_16px_rgba(34,211,238,0.15)] ring-1 ring-[var(--accent)]"
                              : "bg-[#0b1017] border-white/5 hover:border-white/20 hover:bg-[#0f1622]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] truncate">
                              Simulacro #{idx + 1}
                            </span>
                            {delta !== null && (
                              <span
                                className={`font-mono text-[9px] font-bold ${
                                  delta >= 0 ? "text-[var(--accent-green)]" : "text-amber-400"
                                }`}
                              >
                                {delta > 0 ? `+${delta}%` : `${delta}%`}
                              </span>
                            )}
                          </div>
                          <div className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                            {exam.score}%
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-[var(--muted-foreground)]">
                            <span>{exam.date}</span>
                            <span>
                              {exam.correctQuestions}/{exam.totalQuestions}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Section for Selected Exam */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
                  {/* Left Column: Domain Breakdown & Metrics (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">
                          Desglose por Dominios
                        </span>
                        <h3 className="font-display font-semibold text-lg text-foreground mt-0.5">
                          {currentExam.title} ({currentExam.date})
                        </h3>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-[10px] text-[var(--muted-foreground)] uppercase">
                          Tiempo Empleado
                        </div>
                        <div className="text-sm font-semibold text-foreground flex items-center justify-end gap-1">
                          <Clock size={13} className="text-[var(--accent)]" />
                          {currentExam.timeSpent}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {currentExam.domains.map((d) => {
                        const pass = d.score >= 80;
                        const excellent = d.score >= 90;
                        const barColor = excellent
                          ? "bg-[var(--accent-green)]"
                          : pass
                            ? "bg-[var(--accent)]"
                            : "bg-amber-400";
                        const textColor = excellent
                          ? "text-[var(--accent-green)]"
                          : pass
                            ? "text-[var(--accent)]"
                            : "text-amber-400";

                        return (
                          <div
                            key={d.domain}
                            className="p-2.5 rounded bg-[#0b1119] border border-white/5 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-foreground/90 font-medium truncate pr-2">
                                {d.domain}
                              </span>
                              <span className={`font-bold shrink-0 ${textColor}`}>{d.score}%</span>
                            </div>
                            {/* Track bar */}
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                              {/* Reference line for 83% CompTIA Pass */}
                              <div
                                className="absolute top-0 bottom-0 w-0.5 bg-white/30 z-10"
                                style={{ left: "83.3%" }}
                                title="Umbral CompTIA ~83%"
                              />
                              <div
                                className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                                style={{ width: `${Math.min(100, Math.max(0, d.score))}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary Notes */}
                    <div className="p-3 rounded bg-white/[0.02] border border-white/5 font-mono text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                      💡 <strong className="text-foreground/90">Análisis técnico:</strong>{" "}
                      {currentExam.analysis ? (
                        <span>{currentExam.analysis}</span>
                      ) : (
                        <span>
                          Dominios con mayor desempeño:{" "}
                          <span className="text-[var(--accent-green)] font-semibold">
                            {currentExam.domains[0]?.domain} ({currentExam.domains[0]?.score}%)
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Screenshot Viewer (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                        Evidencia del Examen
                      </span>
                      <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Maximize2 size={12} />
                        Ampliar Captura
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="group relative w-full rounded-md border border-white/10 overflow-hidden bg-black/50 cursor-pointer aspect-video flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] text-left"
                      aria-label={`Ampliar captura de ${currentExam.title}`}
                    >
                      <img
                        src={currentExam.image}
                        alt={`Captura de resultado ${currentExam.title}`}
                        className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 justify-between pointer-events-none">
                        <span className="font-mono text-[11px] text-white flex items-center gap-1.5 font-medium">
                          <Maximize2 size={14} className="text-[var(--accent)]" />
                          Clic para pantalla completa
                        </span>
                        <span className="font-mono text-[10px] text-cyan-300 font-bold">
                          {currentExam.score}%
                        </span>
                      </div>
                    </button>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)] pt-1">
                      <span>
                        {currentExam.correctQuestions} de {currentExam.totalQuestions} aciertos
                      </span>
                      <a
                        href={currentExam.image}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 min-h-[44px] py-2"
                      >
                        <ExternalLink size={12} />
                        Abrir original →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-white/10 bg-[#06090e] shrink-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  <span className="md:hidden">Tocá fuera para cerrar</span>
                  <span className="hidden md:inline">ESC para cerrar · Clic fuera para salir</span>
                </span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded border border-border-dim text-[var(--muted-foreground)] hover:text-foreground hover:border-white/30 transition-colors cursor-pointer min-h-[44px] flex items-center"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for Fullscreen high-resolution capture viewing */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selectedIndex}
        on={{
          view: ({ index }) => setSelectedIndex(index),
        }}
        slides={mockExams.map((exam) => ({
          src: exam.image,
          title: `${exam.title} - Score: ${exam.score}% (${exam.correctQuestions}/${exam.totalQuestions})`,
          description: `Fecha: ${exam.date} · Tiempo: ${exam.timeSpent}`,
        }))}
        carousel={{ finite: true }}
        styles={{ container: { zIndex: 10000 } }}
      />
    </>,
    document.body,
  );
}
