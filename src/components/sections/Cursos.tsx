import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/primitives/Section";
import { CertModal } from "@/components/CertModal";
import { COURSES, COURSE_GROUPS } from "@/data/courses";
import type { Course } from "@/types";

function CourseRow({ course, onOpen }: { course: Course; onOpen: (course: Course) => void }) {
  const hasCert = Boolean(course.cert);

  return (
    <button
      type="button"
      onClick={hasCert ? () => onOpen(course) : undefined}
      disabled={!hasCert}
      aria-label={
        hasCert ? `Ver certificado: ${course.title}` : `${course.title}, certificado pendiente`
      }
      className={`group/row flex w-full items-center gap-3 border-t border-border-dim py-3 text-left first:border-t-0 ${hasCert ? "cursor-pointer" : "cursor-default opacity-60"}`}
    >
      <span className="w-6 shrink-0 font-mono text-[10px] tracking-[0.16em] text-[var(--accent)]/60 tabular-nums">
        {course.n}
      </span>
      <span
        className={`min-w-0 flex-1 text-[13px] font-medium leading-snug ${hasCert ? "text-foreground group-hover/row:text-[var(--accent)]" : "text-foreground/60"}`}
      >
        {course.title}
      </span>
      <span className="hidden max-w-[28%] truncate font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--muted-foreground)] sm:block">
        {course.org}
      </span>
      {hasCert && (
        <ChevronRight
          size={14}
          className="shrink-0 text-[var(--accent)] opacity-40 transition-all group-hover/row:translate-x-0.5 group-hover/row:opacity-100"
        />
      )}
    </button>
  );
}

export function Cursos() {
  const [activeCert, setActiveCert] = useState<{ cert: string; title: string } | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const openCertificate = (course: Course) => {
    if (course.cert) setActiveCert({ cert: course.cert, title: course.title });
  };

  return (
    <Section
      id="cursos"
      number="06"
      title="Cursos Completados"
      kicker="LEARNING_LOG"
      reveal="stagger-items"
    >
      <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] md:mb-10">
        <span>
          TOTAL <span className="text-[var(--accent)] font-bold text-sm">{COURSES.length}</span>
        </span>
        <span>
          INSTITUCIONES{" "}
          <span className="text-[var(--accent)] font-bold text-sm">{COURSE_GROUPS.length}</span>
        </span>
        <span className="hidden h-px min-w-10 flex-1 bg-border-dim sm:block" />
        <Badge variant="success" dot>
          TODOS COMPLETADOS
        </Badge>
      </div>

      {/* Accordion — single-open, visible en todas las resoluciones */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Seleccioná una institución para ver sus certificados
        </p>
        <div className="border border-border-dim bg-[var(--surface)]">
          {COURSE_GROUPS.map((group) => {
            const isOpen = openGroup === group.org;
            return (
              <div key={group.org} className="border-b border-border-dim last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : group.org)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-[var(--accent-green)]" />
                  <span className="min-w-0 flex-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                    {group.org}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
                    {String(group.courses.length).padStart(2, "0")}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`shrink-0 text-[var(--muted-foreground)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {/* Smooth height animation via CSS grid trick */}
                <div
                  className="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 pb-3">
                      {group.courses.map((course) => (
                        <CourseRow key={course.n} course={course} onOpen={openCertificate} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeCert && (
        <CertModal
          cert={activeCert.cert}
          title={activeCert.title}
          onClose={() => setActiveCert(null)}
        />
      )}
    </Section>
  );
}
