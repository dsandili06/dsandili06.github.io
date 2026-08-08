import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/primitives/Section";
import { PROJECTS } from "@/data/projects";

export function Proyectos() {
  return (
    <Section id="proyectos" number="02" title="Proyectos" kicker="REPOSITORIES">
      <div className="flex flex-col">
        {PROJECTS.map((p, idx) => (
          <motion.a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group grid grid-cols-1 md:grid-cols-[80px_1fr_auto] gap-6 md:gap-10 items-start py-8 border-t border-border-dim hover:bg-[var(--surface)]/50 transition-colors px-4 -mx-4"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] pt-1">
              PRJ_{p.id}
            </div>
            <div className="max-w-2xl">
              <h3 className="font-display font-semibold text-2xl md:text-[1.75rem] leading-tight tracking-tight text-foreground group-hover:text-[var(--accent)] transition-colors mb-3">
                {p.title}
              </h3>
              <p className="text-foreground/65 leading-relaxed text-[15px] mb-4">{p.description}</p>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                {p.label}
              </span>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--accent)] opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all pt-1">
              VER REPO →
            </div>
          </motion.a>
        ))}
        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_auto] gap-6 md:gap-10 items-start py-8 border-t border-dashed border-[var(--accent)]/30 px-4 -mx-4 progress-shimmer">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--accent)] pt-1">
            PRJ_03
          </div>
          <div className="max-w-2xl opacity-60">
            <h3 className="font-display font-semibold text-2xl md:text-[1.75rem] leading-tight tracking-tight text-foreground/70 mb-3">
              Próximo proyecto en construcción
            </h3>
            <p className="text-foreground/55 leading-relaxed text-[15px] mb-4">
              Más detalles cuando esté listo para publicar.
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
              NEXT_PROJECT.WIP
            </span>
          </div>
          <div className="pt-1">
            <Badge variant="warning" dot>
              EN PROCESO
            </Badge>
          </div>
        </div>
      </div>
    </Section>
  );
}
