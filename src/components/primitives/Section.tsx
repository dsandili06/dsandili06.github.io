import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useSplitReveal } from "@/components/fx/useSplitReveal";

type SectionProps = {
  id: string;
  number: string;
  title: string;
  kicker?: string;
  reveal?: string;
  children: ReactNode;
};

export function Section({ id, number, title, kicker, reveal, children }: SectionProps) {
  return (
    <section
      id={id}
      data-reveal={reveal || "slide-up"}
      className="relative py-16 md:py-32 border-b border-border-dim"
    >
      <SectionHeader number={number} title={title} kicker={kicker} />
      {children}
    </section>
  );
}

type SectionHeaderProps = {
  number: string;
  title: string;
  kicker?: string;
};

export function SectionHeader({ number, title, kicker }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleRef = useSplitReveal<HTMLHeadingElement>();
  const prefersReduced = useReducedMotion();

  // Parallax — the giant background number drifts slower than the scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], prefersReduced ? [0, 0] : [48, -48]);

  return (
    <div ref={ref} className="relative mb-14 md:mb-20">
      <motion.span
        aria-hidden
        className="absolute -top-6 md:-top-10 -left-2 md:-left-6 font-display font-bold leading-none text-[var(--surface)] select-none pointer-events-none"
        style={{ fontSize: "clamp(5rem, 14vw, 12rem)", y }}
      >
        {number}
      </motion.span>
      <div className="relative flex items-end justify-between gap-6 pb-5 border-b border-border-dim">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-3">
            SECTION_{number}
            {kicker ? ` // ${kicker}` : ""}
          </div>
          <h2
            ref={titleRef}
            className="font-display font-bold leading-none tracking-[-0.02em] text-[var(--accent)]"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            {title}
          </h2>
        </div>
        <span aria-hidden className="hidden md:block size-1.5 bg-[var(--accent)] mb-3" />
      </div>
    </div>
  );
}
