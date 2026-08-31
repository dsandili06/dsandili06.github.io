import { Section } from "@/components/primitives/Section";
import { STACK_GROUPS } from "@/data/stack";

export function Stack() {
  return (
    <Section id="stack" number="04" title="Stack Técnico" kicker="TOOLING" reveal="stagger-items">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {STACK_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="font-mono uppercase mb-4 pb-3 text-[var(--accent)] tracking-[0.15em] text-[11px] border-b border-border-dim">
              {group.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="stack-chip font-mono transition-all duration-150 ease-out cursor-default bg-[var(--surface)] border border-border-dim text-[#E2E8F0] text-[11px] px-2.5 py-1 rounded-xs hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
