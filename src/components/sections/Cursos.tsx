import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/primitives/Section";
import { CertModal } from "@/components/CertModal";
import { COURSES, COURSE_GROUPS } from "@/data/courses";
import type { Course } from "@/types";

function CourseRow({
  course,
  onOpen,
  index,
}: {
  course: Course;
  onOpen: (course: Course) => void;
  index: number;
}) {
  const hasCert = Boolean(course.cert);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.25, delay: index * 0.035, ease: [0.16, 1, 0.3, 1] }}
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
    </motion.button>
  );
}

export function Cursos() {
  const [activeCert, setActiveCert] = useState<{ cert: string; title: string } | null>(null);
  const openCertificate = (course: Course) => {
    if (course.cert) setActiveCert({ cert: course.cert, title: course.title });
  };

  return (
    <Section id="cursos" number="06" title="Cursos Completados" kicker="LEARNING_LOG">
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

      <div className="hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c, idx) => {
          const hasCert = Boolean(c.cert);
          return (
            <motion.div
              key={c.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.35, delay: (idx % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              onClick={hasCert ? () => setActiveCert({ cert: c.cert!, title: c.title }) : undefined}
              role={hasCert ? "button" : undefined}
              tabIndex={hasCert ? 0 : undefined}
              onKeyDown={
                hasCert
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveCert({ cert: c.cert!, title: c.title });
                      }
                    }
                  : undefined
              }
              aria-label={
                hasCert ? `Ver certificado: ${c.title}` : `${c.title}, certificado pendiente`
              }
              className={`group flex w-full flex-col justify-between gap-3 p-5 text-left bg-[var(--surface)] border border-border-dim transition-all duration-200 ${hasCert ? "cursor-pointer hover:border-[var(--accent)]/60 hover:bg-[color-mix(in_oklab,var(--accent)_4%,var(--surface))]" : "opacity-70 cursor-default"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--accent)]/60 tabular-nums mt-0.5">
                  {c.n}
                </span>
                <span
                  className={`size-1.5 rounded-full mt-1.5 shrink-0 ${hasCert ? "bg-[var(--accent-green)]" : "bg-[var(--muted-foreground)]/40"}`}
                />
              </div>
              <div className="flex-1">
                <h4
                  className={`font-display font-semibold text-[14px] leading-snug tracking-tight transition-colors ${hasCert ? "text-foreground group-hover:text-[var(--accent)]" : "text-foreground/60"}`}
                >
                  {c.title}
                </h4>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border-dim">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                  {c.org}
                </span>
                {hasCert && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                    VER CERT →
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="md:hidden">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          Seleccioná una institución para ver sus certificados
        </p>
        <div className="border border-border-dim bg-[var(--surface)]">
          {COURSE_GROUPS.map((group) => (
            <details key={group.org} className="group border-b border-border-dim last:border-b-0">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 [&::-webkit-details-marker]:hidden">
                <span className="size-1.5 shrink-0 rounded-full bg-[var(--accent-green)]" />
                <span className="min-w-0 flex-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                  {group.org}
                </span>
                <span className="font-mono text-[10px] text-[var(--muted-foreground)]">
                  {String(group.courses.length).padStart(2, "0")}
                </span>
                <ChevronDown
                  size={15}
                  className="shrink-0 text-[var(--muted-foreground)] transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="px-4 pb-3">
                {group.courses.map((course, index) => (
                  <CourseRow
                    key={course.n}
                    course={course}
                    onOpen={openCertificate}
                    index={index}
                  />
                ))}
              </div>
            </details>
          ))}
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
