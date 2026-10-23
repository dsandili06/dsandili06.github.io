import { useCallback, useState } from "react";
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
import { useOverlayLifecycle } from "@/hooks/useOverlayLifecycle";
import { useModalHistory } from "@/hooks/useModalHistory";
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
  const { overlayRef } = useOverlayLifecycle({
    isOpen,
    onEscape: () => {
      if (lightboxOpen) return false;
      handleClose();
      return true;
    },
  });
  const panelLifecycleRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef(node);
      overlayRef(node);
    },
    [panelRef, overlayRef],
  );

  if (mockExams.length === 0) return null;

  const currentExam = mockExams[selectedIndex] ?? mockExams[0];
  const latestExam = mockExams[mockExams.length - 1];
  const firstExam = mockExams[0];
  const totalGain = latestExam.score - firstExam.score;
  const maxScore = mockExams.length > 0 ? Math.max(...mockExams.map((e) => e.score)) : 0;

  const handleTimelineKeyDown = (e: React.KeyboardEvent) => {
    if (mockExams.length === 0) return;
    let nextIndex = selectedIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (selectedIndex + 1) % mockExams.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (selectedIndex - 1 + mockExams.length) % mockExams.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = mockExams.length - 1;
    } else {
      return;
    }

    setSelectedIndex(nextIndex);
    const nextTab = document.getElementById(`tab-exam-${mockExams[nextIndex].id}`);
    nextTab?.focus();
  };

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
              background: "color-mix(in srgb, var(--background) 88%, transparent)",
              backdropFilter: "blur(14px) saturate(180%)",
              WebkitBackdropFilter: "blur(14px) saturate(180%)",
            }}
            onClick={handleClose}
          >
            <motion.div
              ref={panelLifecycleRef}
              key="comptia-modal-panel"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl flex flex-col bg-[var(--surface)] border border-border-dim rounded-lg shadow-2xl overflow-hidden"
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
              <div className="flex items-start justify-between p-4 sm:p-6 pb-4 border-b border-border-dim bg-[var(--surface-2)] shrink-0">
                <div className="min-w-0 pr-2">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)] flex items-center gap-1.5">
                      <Award size={13} className="text-[var(--accent)]" />
                      SIMULACROS JASON DION · SY0-701
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs font-mono text-[9px] uppercase tracking-wider bg-[var(--accent-green)]/15 border border-[var(--accent-green)]/40 text-[var(--accent-green)]">
                      <CheckCircle2 size={10} />
                      Objetivo CompTIA Superado ({maxScore}% vs ~83%)
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
                  className="shrink-0 flex items-center justify-center size-11 min-h-[44px] min-w-[44px] border border-border-dim text-[var(--muted-foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:border-[var(--accent)] transition-colors cursor-pointer rounded-xs"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Global Benchmark Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 sm:p-4 rounded-md bg-[var(--surface-2)] border border-border-dim font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-[var(--accent)]/10 text-[var(--accent)] shrink-0">
                      <TrendingUp size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                        Evolución Neta
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {firstExam.score}% → {latestExam.score}%{" "}
                        <span
                          className={`font-semibold ${
                            totalGain >= 0
                              ? "text-[var(--accent-green)]"
                              : "text-[var(--accent-amber)]"
                          }`}
                        >
                          ({totalGain >= 0 ? `+${totalGain}%` : `${totalGain}%`})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-[var(--accent-green)]/10 text-[var(--accent-green)] shrink-0">
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
                    <div
                      className={`p-2 rounded shrink-0 ${
                        maxScore >= 90
                          ? "bg-[var(--accent-green)]/10 text-[var(--accent-green)]"
                          : "bg-[var(--accent-amber)]/10 text-[var(--accent-amber)]"
                      }`}
                    >
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                        Criterio Jason Dion
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        90% Target ·{" "}
                        <span
                          className={`font-semibold ${
                            maxScore >= 90
                              ? "text-[var(--accent-green)]"
                              : "text-[var(--accent-amber)]"
                          }`}
                        >
                          {maxScore >= 90
                            ? `${maxScore}% pico (Superado +${maxScore - 90}%)`
                            : `${maxScore}% pico (-${90 - maxScore}%)`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline / Selector de Simulacros */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                      Historial de Intentos
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)] font-semibold">
                      {mockExams.length} INTENTOS REGISTRADOS
                    </span>
                  </div>

                  <div
                    role="tablist"
                    aria-label="Historial de simulacros CompTIA Security+"
                    onKeyDown={handleTimelineKeyDown}
                    className={`grid grid-cols-2 sm:grid-cols-3 ${
                      mockExams.length >= 7 ? "lg:grid-cols-7" : "lg:grid-cols-6"
                    } gap-2.5`}
                  >
                    {mockExams.map((exam, idx) => {
                      const isSelected = idx === selectedIndex;
                      const prevExam = idx > 0 ? mockExams[idx - 1] : null;
                      const delta = prevExam ? exam.score - prevExam.score : null;
                      const isOddTotal = mockExams.length % 2 !== 0;

                      return (
                        <button
                          key={exam.id}
                          type="button"
                          role="tab"
                          id={`tab-exam-${exam.id}`}
                          aria-selected={isSelected}
                          aria-controls="panel-exam-details"
                          tabIndex={isSelected ? 0 : -1}
                          onClick={() => setSelectedIndex(idx)}
                          className={`p-2.5 sm:p-3 rounded-md text-left transition-all relative border cursor-pointer transform-gpu backface-hidden active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] ${
                            isOddTotal
                              ? "last:col-span-2 sm:last:col-span-1 lg:last:col-span-1"
                              : ""
                          } ${
                            isSelected
                              ? "bg-[var(--surface-2)] border-[var(--accent)] shadow-[0_0_16px_color-mix(in_srgb,var(--accent)_15%,transparent)] ring-1 ring-[var(--accent)]"
                              : "bg-[var(--surface)] border-border-dim hover:border-[var(--muted-foreground)]/40 hover:bg-[var(--surface-2)]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted-foreground)] truncate">
                              {exam.shortLabel ?? `Simulacro #${idx + 1}`}
                            </span>
                            {delta !== null && (
                              <span
                                className={`font-mono text-[9px] font-bold ${
                                  delta >= 0
                                    ? "text-[var(--accent-green)]"
                                    : "text-[var(--accent-amber)]"
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
                <div
                  id="panel-exam-details"
                  role="tabpanel"
                  aria-labelledby={`tab-exam-${currentExam.id}`}
                  tabIndex={0}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2 focus-visible:outline-none"
                >
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
                            : "bg-[var(--accent-amber)]";
                        const textColor = excellent
                          ? "text-[var(--accent-green)]"
                          : pass
                            ? "text-[var(--accent)]"
                            : "text-[var(--accent-amber)]";

                        return (
                          <div
                            key={d.domain}
                            className="p-2.5 rounded bg-[var(--surface-2)] border border-border-dim space-y-1.5"
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
                                aria-hidden="true"
                              />
                              <div
                                role="progressbar"
                                aria-valuenow={d.score}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${d.domain}: ${d.score}%`}
                                className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                                style={{ width: `${Math.min(100, Math.max(0, d.score))}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary Notes */}
                    <div className="p-3 rounded bg-[var(--surface-2)] border border-border-dim font-mono text-[11px] text-[var(--muted-foreground)] leading-relaxed">
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
                        className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] hover:underline inline-flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]"
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
                        className="size-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-105 transform-gpu backface-hidden will-change-transform"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 justify-between pointer-events-none">
                        <span className="font-mono text-[11px] text-white flex items-center gap-1.5 font-medium">
                          <Maximize2 size={14} className="text-[var(--accent)]" />
                          Clic para pantalla completa
                        </span>
                        <span className="font-mono text-[10px] text-[var(--accent)] font-bold">
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
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-border-dim bg-[var(--surface-2)] shrink-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                  <span className="md:hidden">Tocá fuera para cerrar</span>
                  <span className="hidden md:inline">ESC para cerrar</span>
                </span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded border border-border-dim text-[var(--muted-foreground)] hover:text-foreground hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors cursor-pointer min-h-[44px] flex items-center"
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
