import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FileSearch, Binary, Network, Terminal, Activity } from "lucide-react";
import { Section } from "@/components/primitives/Section";
import { STACK_GROUPS } from "@/data/stack";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<
  string,
  {
    icon: typeof FileSearch;
    accentColor: string;
    borderActive: string;
    borderHover: string;
    dotColor: string;
    borderCorner: string;
    barBg: string;
  }
> = {
  "FORENSE & TRIAGE": {
    icon: FileSearch,
    accentColor: "text-cyan-400",
    borderActive: "border-cyan-400/50 bg-[color-mix(in_oklab,#22d3ee_6%,var(--surface))]",
    borderHover: "hover:border-cyan-400/40",
    dotColor: "bg-cyan-400",
    borderCorner: "border-cyan-400/60",
    barBg: "bg-cyan-400",
  },
  "MALWARE ANALYSIS": {
    icon: Binary,
    accentColor: "text-sky-400",
    borderActive: "border-sky-400/50 bg-[color-mix(in_oklab,#38bdf8_6%,var(--surface))]",
    borderHover: "hover:border-sky-400/40",
    dotColor: "bg-sky-400",
    borderCorner: "border-sky-400/60",
    barBg: "bg-sky-400",
  },
  "SIEM & NETWORK": {
    icon: Network,
    accentColor: "text-blue-400",
    borderActive: "border-blue-500/50 bg-[color-mix(in_oklab,#3b82f6_6%,var(--surface))]",
    borderHover: "hover:border-blue-500/40",
    dotColor: "bg-blue-400",
    borderCorner: "border-blue-500/60",
    barBg: "bg-blue-500",
  },
  "SCRIPTING & OSINT": {
    icon: Terminal,
    accentColor: "text-indigo-400",
    borderActive: "border-indigo-500/50 bg-[color-mix(in_oklab,#6366f1_6%,var(--surface))]",
    borderHover: "hover:border-indigo-500/40",
    dotColor: "bg-indigo-400",
    borderCorner: "border-indigo-500/60",
    barBg: "bg-indigo-500",
  },
};

export function Stack() {
  const [selectedCategory, setSelectedCategory] = useState<string>(STACK_GROUPS[0].title);

  useEffect(() => {
    const handleCategoryChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ category: string }>;
      if (customEvent.detail?.category) {
        setSelectedCategory(customEvent.detail.category);
      }
    };
    window.addEventListener("set-stack-category", handleCategoryChange);
    return () => window.removeEventListener("set-stack-category", handleCategoryChange);
  }, []);

  const activeGroup = STACK_GROUPS.find((g) => g.title === selectedCategory) ?? STACK_GROUPS[0];
  const activeMeta = CATEGORY_META[activeGroup.title] ?? {
    icon: Terminal,
    accentColor: "text-cyan-400",
    borderActive: "border-cyan-400/50 bg-[color-mix(in_oklab,#22d3ee_6%,var(--surface))]",
    borderHover: "hover:border-cyan-400/40",
    dotColor: "bg-cyan-400",
    borderCorner: "border-cyan-400/60",
    barBg: "bg-cyan-400",
  };
  const ActiveIcon = activeMeta.icon;

  return (
    <Section id="stack" number="04" title="Stack Técnico" kicker="TOOLING" reveal="fade-scale">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 items-start">
        {/* Left: Domain Command Selector */}
        <div className="flex flex-col gap-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] flex items-center justify-between pb-2 border-b border-border-dim">
            <span>OPERATIONAL_DOMAINS</span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Activity className="size-3 animate-pulse" />
              <span>LIVE_DECK</span>
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {STACK_GROUPS.map((group) => {
              const meta = CATEGORY_META[group.title] ?? {
                icon: Terminal,
                accentColor: "text-cyan-400",
                borderActive:
                  "border-cyan-400/50 bg-[color-mix(in_oklab,#22d3ee_6%,var(--surface))]",
                borderHover: "hover:border-cyan-400/40",
                dotColor: "bg-cyan-400",
                borderCorner: "border-cyan-400/60",
                barBg: "bg-cyan-400",
                code: "BAY_01",
              };
              const Icon = meta.icon;
              const isSelected = group.title === selectedCategory;

              return (
                <motion.button
                  key={group.title}
                  type="button"
                  onClick={() => setSelectedCategory(group.title)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  className={cn(
                    "group relative flex items-center justify-between p-3 sm:p-4 rounded-xs border text-left cursor-pointer select-none overflow-hidden transition-all duration-200",
                    isSelected
                      ? cn("border-border-dim", meta.borderActive)
                      : cn(
                          "border-border-dim bg-[var(--surface)] hover:bg-[color-mix(in_oklab,var(--accent)_4%,var(--surface))]",
                          meta.borderHover,
                        ),
                  )}
                  aria-pressed={isSelected}
                >
                  {/* Fluid Active Category Indicator (Sliding spring pill & bar) */}
                  {isSelected && (
                    <>
                      <motion.div
                        layoutId="activeDeckPill"
                        className="absolute inset-0 bg-white/[0.03] pointer-events-none"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                      <motion.div
                        layoutId="activeDeckBar"
                        className={cn(
                          "absolute left-0 top-0 bottom-0 w-1 pointer-events-none",
                          meta.barBg,
                        )}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    </>
                  )}

                  <div className="relative z-10 flex items-center gap-2 sm:gap-3 min-w-0">
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-transform duration-200",
                        isSelected
                          ? cn(meta.accentColor, "scale-110")
                          : "text-[var(--muted-foreground)] group-hover:text-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "font-mono text-xs uppercase tracking-[0.14em] truncate transition-colors duration-200",
                        isSelected
                          ? "text-foreground font-bold"
                          : "text-foreground/75 group-hover:text-foreground",
                      )}
                    >
                      {group.title}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "relative z-10 font-mono text-[9px] px-2 py-0.5 rounded-xs border shrink-0 transition-colors duration-200",
                      isSelected
                        ? "border-[var(--accent)]/30 text-foreground bg-[var(--accent)]/10"
                        : "border-border-dim text-[var(--muted-foreground)] group-hover:text-foreground",
                    )}
                  >
                    {group.items.length}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right: Tactical Instrument Bay */}
        <div className="relative flex flex-col p-4 sm:p-6 md:p-8 rounded-xs border border-[var(--accent)]/30 bg-[var(--surface)] backdrop-blur-md min-h-[380px] overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_24px_-8px_rgba(0,0,0,0.5)]">
          {/* Tactical HUD Corner Brackets */}
          <span
            className={cn(
              "absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 pointer-events-none transition-colors duration-300",
              activeMeta.borderCorner,
            )}
          />
          <span
            className={cn(
              "absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 pointer-events-none transition-colors duration-300",
              activeMeta.borderCorner,
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 pointer-events-none transition-colors duration-300",
              activeMeta.borderCorner,
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 pointer-events-none transition-colors duration-300",
              activeMeta.borderCorner,
            )}
          />

          {/* Laser Scanline Beam on Category Activation */}
          <motion.div
            key={`scan-${activeGroup.title}`}
            initial={{ left: "-100%", width: "100%", opacity: 0 }}
            animate={{ left: "100%", opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={cn(
              "absolute top-0 h-[1.5px] bg-gradient-to-r from-transparent via-current to-transparent pointer-events-none z-10",
              activeMeta.accentColor,
            )}
          />

          {/* Bay Header Telemetry */}
          <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-border-dim flex-wrap">
            <div className="flex items-center gap-3">
              <span className={cn("size-2 rounded-full", activeMeta.dotColor, "animate-pulse")} />
              <div className="flex items-center gap-2">
                <ActiveIcon className={cn("size-4", activeMeta.accentColor)} />
                <h3 className="font-display font-bold text-xl leading-tight tracking-tight text-foreground">
                  {activeGroup.title}
                </h3>
              </div>
            </div>

            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
              <span>
                STATUS //{" "}
                <span className="text-foreground/80">{activeGroup.items.length} TOOLS READY</span>
              </span>
            </div>
          </div>

          {/* Tools Grid: Harmonized with surface tokens and in-place animation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 flex-1 content-start">
            {activeGroup.items.map((item, idx) => (
              <motion.div
                key={`${activeGroup.title}-${item}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.15,
                  delay: idx * 0.015,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ scale: 1.015 }}
                className="group/tool relative flex items-center justify-between p-3.5 rounded-xs border border-border-dim bg-[color-mix(in_oklab,var(--background)_40%,var(--surface))] hover:bg-[color-mix(in_oklab,var(--accent)_6%,var(--surface))] hover:border-[var(--accent)]/50 transition-all duration-200 cursor-default select-none overflow-hidden"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={cn(
                      "font-mono text-[11px] font-bold transition-all duration-200 shrink-0",
                      activeMeta.accentColor,
                      "opacity-60 group-hover/tool:opacity-100 group-hover/tool:translate-x-0.5",
                    )}
                  >
                    ›
                  </span>
                  <span className="font-mono text-xs text-foreground/80 group-hover/tool:text-foreground font-medium transition-colors truncate">
                    {item}
                  </span>
                </div>

                {/* Micro-destello estelar (4-point sparkle) en hover de esquina */}
                <svg
                  className={cn(
                    "size-2.5 shrink-0 pointer-events-none opacity-0 group-hover/tool:opacity-90 group-hover/tool:scale-125 transition-all duration-300",
                    activeMeta.accentColor,
                  )}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
