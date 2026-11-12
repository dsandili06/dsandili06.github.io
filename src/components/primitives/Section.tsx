import type { ReactNode } from "react";
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
      className="relative py-16 md:py-32 border-b border-border-dim scroll-mt-0"
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
  const titleRef = useSplitReveal<HTMLHeadingElement>();
  return (
    <div className="relative mb-14 md:mb-20">
      <div className="relative flex items-end justify-between gap-6 pb-5 border-b border-border-dim">
        <div>
          <div className="font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)] mb-3">
            SECTION_{number}
            {kicker ? ` // ${kicker}` : ""}
          </div>
          <h2
            ref={titleRef}
            className="font-display font-bold leading-none tracking-[-0.02em] text-foreground"
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
