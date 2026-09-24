import { useState, useRef } from "react";
import { ChevronRight, ExternalLink, ShieldCheck, Award, Terminal } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/primitives/Section";
import { CertModal } from "@/components/CertModal";
import { COURSES, COURSE_GROUPS, type CourseGroup } from "@/data/courses";
import type { Course } from "@/types";

function getGroupSlug(group: CourseGroup): string {
  return group.meta?.id || group.org.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function CourseRow({ course, onOpen }: { course: Course; onOpen: (course: Course) => void }) {
  const hasCert = Boolean(course.cert);

  return (
    <button
      type="button"
      onClick={hasCert ? () => onOpen(course) : undefined}
      disabled={!hasCert}
      aria-haspopup={hasCert ? "dialog" : undefined}
      aria-label={
        hasCert
          ? `Ver certificado oficial: ${course.title}`
          : `${course.title}, certificado pendiente`
      }
      className={`group/row relative flex w-full min-h-[56px] items-center gap-3 sm:gap-4 p-3.5 sm:p-4 text-left hover:z-10 transform-gpu backface-hidden transition-all duration-200 ease-out ${
        hasCert
          ? "hover:bg-[var(--surface-2)]/90 cursor-pointer active:scale-[0.995] active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset"
          : "cursor-default opacity-85"
      }`}
    >
      {/* Active hover accent strip */}
      <span className="absolute left-0 inset-y-0 w-[2px] bg-[var(--accent)] opacity-0 group-hover/row:opacity-100 group-focus-visible/row:opacity-100 transition-opacity duration-200" />

      {/* Course Sequence */}
      <span className="w-7 shrink-0 font-mono text-[11px] font-semibold tracking-[0.16em] text-[var(--accent-secondary)] tabular-nums">
        {course.n}
      </span>

      {/* Course Title & Mobile Org */}
      <div className="min-w-0 flex-1">
        <span
          className={`block text-[13px] sm:text-[14px] font-medium leading-snug transition-colors duration-200 ${
            hasCert
              ? "text-foreground group-hover/row:text-[var(--accent-secondary)] group-focus-visible/row:text-[var(--accent-secondary)]"
              : "text-foreground/80"
          }`}
        >
          {course.title}
        </span>
        <span className="mt-0.5 inline-block font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted-foreground)] sm:hidden">
          {course.org}
        </span>
      </div>

      {/* CTA Button Badge */}
      {hasCert ? (
        <div className="flex items-center gap-1.5 shrink-0 rounded-xs border border-border-dim/80 bg-[var(--surface)] px-2 sm:px-2.5 py-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[var(--accent-secondary)] group-hover/row:border-[var(--accent)]/50 group-hover/row:bg-[var(--accent)]/15 group-hover/row:text-white group-focus-visible/row:border-[var(--accent)]/50 group-focus-visible/row:bg-[var(--accent)]/15 group-focus-visible/row:text-white transition-all duration-200">
          <span className="hidden sm:inline">VER CERTIFICADO</span>
          <span className="sm:hidden">VER</span>
          <ExternalLink
            size={11}
            className="shrink-0 opacity-80 group-hover/row:opacity-100 group-focus-visible/row:opacity-100 group-hover/row:translate-x-0.5 group-focus-visible/row:translate-x-0.5 transition-all duration-200 ease-out transform-gpu"
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className="flex items-center gap-1.5 shrink-0 rounded-xs border border-border-dim/50 bg-[var(--surface-2)]/50 px-2 sm:px-2.5 py-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
          <span>PENDIENTE</span>
        </div>
      )}
    </button>
  );
}

export function Cursos() {
  const [activeCert, setActiveCert] = useState<{
    cert: string;
    title: string;
    initialTab?: "cert" | "review";
  } | null>(null);
  const [modalCert, setModalCert] = useState<{
    cert: string;
    title: string;
    initialTab?: "cert" | "review";
  } | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<string>(
    COURSE_GROUPS[0]?.org || "Coursera/Google",
  );

  const tabsRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const activeGroup = COURSE_GROUPS.find((group) => group.org === selectedOrg) ||
    COURSE_GROUPS[0] || {
      org: "Coursera/Google",
      courses: [],
      meta: undefined,
    };

  const activeSlug = getGroupSlug(activeGroup);

  const openCertificate = (course: Course) => {
    if (course.cert) {
      const isSal1 = course.title.includes("SAL1") || course.cert.includes("SAL1");
      const item = {
        cert: course.cert,
        title: course.title,
        initialTab: (isSal1 ? "review" : "cert") as "cert" | "review",
      };
      setModalCert(item);
      setActiveCert(item);
    }
  };

  const handleSelectOrg = (org: string, buttonElement?: HTMLButtonElement | null) => {
    setSelectedOrg(org);
    if (buttonElement && typeof buttonElement.scrollIntoView === "function") {
      try {
        buttonElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      } catch {
        buttonElement.scrollIntoView();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const total = COURSE_GROUPS.length;
    let nextIndex = index;

    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = (index + 1) % total;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex = (index - 1 + total) % total;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = total - 1;
    } else {
      return;
    }

    const nextOrg = COURSE_GROUPS[nextIndex]?.org;
    if (nextOrg) {
      const buttons = tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      const targetBtn = buttons?.[nextIndex];
      handleSelectOrg(nextOrg, targetBtn);
      targetBtn?.focus();
    }
  };

  return (
    <Section
      id="cursos"
      number="06"
      title="Cursos Completados"
      kicker="LEARNING_LOG"
      reveal="stagger-items"
    >
      {/* Telemetry Bar */}
      <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] md:mb-10">
        <span>
          TOTAL{" "}
          <span className="text-[var(--accent-secondary)] font-bold text-sm">{COURSES.length}</span>
        </span>
        <span>
          INSTITUCIONES{" "}
          <span className="text-[var(--accent-secondary)] font-bold text-sm">
            {COURSE_GROUPS.length}
          </span>
        </span>
        <span className="hidden h-px min-w-10 flex-1 bg-border-dim sm:block" />
        <Badge variant="success" dot>
          TODOS COMPLETADOS
        </Badge>
      </div>

      {/* Split-Pane Terminal Hub */}
      <div className="relative border border-border-dim bg-[var(--surface)] shadow-[0_8px_30px_-6px_rgba(0,0,0,0.5)]">
        {/* Tactical Corner Accents */}
        <span className="absolute top-0 left-0 size-2.5 border-t-2 border-l-2 border-[var(--accent)]/60 pointer-events-none z-10" />
        <span className="absolute top-0 right-0 size-2.5 border-t-2 border-r-2 border-[var(--accent)]/60 pointer-events-none z-10" />
        <span className="absolute bottom-0 left-0 size-2.5 border-b-2 border-l-2 border-[var(--accent)]/60 pointer-events-none z-10" />
        <span className="absolute bottom-0 right-0 size-2.5 border-b-2 border-r-2 border-[var(--accent)]/60 pointer-events-none z-10" />

        {/* HUD Sub-header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-dim bg-[var(--surface-2)]/50 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          <div className="flex items-center gap-2.5">
            <Terminal size={14} className="text-[var(--accent)]" />
            <span className="text-foreground font-semibold">
              <span className="sm:hidden">TERMINAL_HUB // EMISORES</span>
              <span className="hidden sm:inline">TERMINAL_HUB // EMISORES_VERIFICADOS</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[var(--muted-foreground)]">
              EXPEDIENTE //{" "}
              <span
                className="text-[var(--accent-secondary)] font-semibold max-w-[200px] md:max-w-[280px] lg:max-w-none truncate inline-block align-bottom"
                title={activeGroup.org}
              >
                {activeGroup.org}
              </span>
            </span>
            <span className="h-2 w-px bg-border-dim hidden sm:inline" />
            <span className="text-[var(--accent-secondary)] font-bold tabular-nums">
              [ {String(activeGroup.courses.length).padStart(2, "0")} CURSOS ]
            </span>
          </div>
        </div>

        {/* Responsive Grid Layout: Sidebar + Active Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-[310px_1fr] lg:grid-cols-[340px_1fr] xl:grid-cols-[370px_1fr]">
          {/* Left Column: Hub de Emisores */}
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Emisores de cursos y certificaciones"
            aria-orientation="vertical"
            className="flex md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar p-2.5 sm:p-3 gap-2 border-b md:border-b-0 md:border-r border-border-dim bg-[var(--surface-2)]/25 snap-x snap-proximity touch-pan-x overscroll-x-contain"
          >
            <div className="hidden md:flex items-center justify-between px-2 pb-2 pt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
              <span>// EMISORES</span>
              <span className="text-[var(--accent-secondary)] font-semibold">
                [{String(COURSE_GROUPS.length).padStart(2, "0")}]
              </span>
            </div>

            {COURSE_GROUPS.map((group, index) => {
              const isSelected = selectedOrg === group.org;
              const hasBadge = Boolean(group.meta?.badge);
              const groupSlug = getGroupSlug(group);

              return (
                <button
                  key={group.org}
                  type="button"
                  role="tab"
                  id={`tab-${groupSlug}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${groupSlug}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={(e) => handleSelectOrg(group.org, e.currentTarget)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  aria-label={`${group.org}, ${group.courses.length} ${group.courses.length === 1 ? "curso" : "cursos"}`}
                  className={`group/tab relative shrink-0 snap-start flex items-center gap-3 w-[240px] sm:w-[260px] md:w-full px-3 py-2.5 sm:px-3.5 sm:py-3 text-left hover:z-10 transform-gpu backface-hidden transition-all duration-200 ease-out cursor-pointer min-h-[58px] sm:min-h-[62px] border active:scale-[0.99] active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset ${
                    isSelected
                      ? "bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface-2))] border-[var(--accent)]/70 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_0_18px_-3px_rgba(59,130,246,0.2)] z-[1]"
                      : "bg-[var(--surface)]/80 hover:bg-[var(--surface-2)] border-border-dim/60 text-[var(--muted-foreground)] hover:text-foreground hover:border-border-dim"
                  }`}
                >
                  {/* Active Indicator Strip */}
                  {isSelected && (
                    <span className="absolute left-0 inset-y-0 w-1 bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
                  )}

                  {/* Monogram or Official Badge Tile with high-contrast background */}
                  <div className="relative size-11 sm:size-12 shrink-0 flex items-center justify-center p-1.5 rounded-xs bg-white border border-white/20 ring-1 ring-black/10 shadow-xs overflow-hidden">
                    {hasBadge && group.meta?.badge ? (
                      <img
                        src={group.meta.badge}
                        alt=""
                        aria-hidden="true"
                        width={48}
                        height={48}
                        className="size-full object-contain pointer-events-none select-none"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span
                        className="font-mono text-[10px] font-bold tracking-wider text-slate-800"
                        aria-hidden="true"
                      >
                        {group.meta?.code || group.org.slice(0, 4).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Institution Details */}
                  <div className="min-w-0 flex-1">
                    <div
                      title={group.meta?.shortName || group.org}
                      className={`truncate md:whitespace-normal md:leading-tight text-[13px] sm:text-[14px] font-medium transition-colors duration-200 ${
                        isSelected
                          ? "text-foreground font-semibold"
                          : "text-foreground/85 group-hover/tab:text-foreground"
                      }`}
                    >
                      {group.meta?.shortName || group.org}
                    </div>
                  </div>

                  {/* Course Counter */}
                  <span
                    className={`shrink-0 font-mono text-[10px] tracking-[0.15em] tabular-nums px-1.5 py-0.5 rounded-xs transition-colors duration-200 ${
                      isSelected
                        ? "bg-[var(--accent)]/20 text-[var(--accent-secondary)] font-bold border border-[var(--accent)]/40"
                        : "bg-black/30 text-[var(--muted-foreground)] border border-border-dim/40 group-hover/tab:text-foreground"
                    }`}
                  >
                    [{String(group.courses.length).padStart(2, "0")}]
                  </span>

                  {/* Arrow Indicator on Desktop */}
                  <ChevronRight
                    size={14}
                    className={`hidden md:block shrink-0 transition-transform duration-200 ease-out transform-gpu ${
                      isSelected
                        ? "text-[var(--accent)] translate-x-0.5 opacity-100"
                        : "text-[var(--muted-foreground)] opacity-0 group-hover/tab:opacity-60"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Panel de Expediente Activo */}
          <div
            role="tabpanel"
            id={`panel-${activeSlug}`}
            aria-labelledby={`tab-${activeSlug}`}
            tabIndex={0}
            className="flex flex-col min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset"
          >
            <motion.div
              key={activeGroup.org}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
              }
              className="flex flex-col h-full transform-gpu backface-hidden"
            >
              {/* Dossier Header Info */}
              <div className="border-b border-border-dim p-4 sm:p-6 bg-gradient-to-b from-[var(--surface-2)]/40 to-transparent">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5 sm:gap-5 min-w-0">
                    <div className="relative size-14 sm:size-16 shrink-0 flex items-center justify-center p-2 rounded-xs bg-white border border-white/20 shadow-md ring-1 ring-black/10 overflow-hidden">
                      {activeGroup.meta?.badge ? (
                        <img
                          src={activeGroup.meta.badge}
                          alt={`Badge ${activeGroup.org}`}
                          width={64}
                          height={64}
                          className="size-full object-contain select-none"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="font-mono text-sm font-bold tracking-wider text-slate-800">
                          {activeGroup.meta?.code || activeGroup.org.slice(0, 4).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight break-words">
                          {activeGroup.org}
                        </h3>
                      </div>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-secondary)]">
                        {activeGroup.meta?.domain || "Especialización Defensiva"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-xs border border-border-dim/60 bg-[var(--surface-2)]/60 font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--muted-foreground)] shrink-0">
                    <Award size={14} className="text-[var(--accent)]" aria-hidden="true" />
                    <span>EXPEDIENTE ACTIVO</span>
                  </div>
                </div>

                {activeGroup.meta?.description && (
                  <p className="mt-3.5 text-xs sm:text-[13px] text-[var(--muted-foreground)] leading-relaxed max-w-3xl">
                    {activeGroup.meta.description}
                  </p>
                )}
              </div>

              {/* Course Records Table / List */}
              <ul className="divide-y divide-border-dim flex-1" role="list">
                {activeGroup.courses.map((course) => (
                  <li key={course.n} className="list-none relative hover:z-10">
                    <CourseRow course={course} onOpen={openCertificate} />
                  </li>
                ))}
              </ul>

              {/* Dossier Footer Summary */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-dim px-4 py-3 bg-[var(--surface-2)]/30 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={12} className="text-[var(--accent-green)]" />
                  <span>AUDITORÍA: 100% COMPLETADO Y VERIFICADO</span>
                </span>
                <span className="tabular-nums text-foreground/80">
                  MOSTRANDO {activeGroup.courses.length} DE {COURSES.length} CURSOS
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {modalCert && (
        <CertModal
          cert={modalCert.cert}
          title={modalCert.title}
          initialTab={modalCert.initialTab}
          isOpen={Boolean(activeCert)}
          onClose={() => setActiveCert(null)}
          onExitComplete={() => setModalCert(null)}
        />
      )}
    </Section>
  );
}
