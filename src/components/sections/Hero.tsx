import { motion } from "motion/react";
import { BootSequence } from "@/components/fx/BootSequence";
import { TerminalWindow } from "@/components/fx/TerminalWindow";
import { ParticlesBg } from "@/components/fx/ParticlesBg";
import { TextScramble } from "@/components/fx/TextScramble";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden border-b border-border-dim grid-bg"
    >
      {/* Grid pattern overlay — subtle cyber grid for depth */}
      <div
        className="absolute inset-0 -z-20 pointer-events-none opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 80%)",
        }}
      />
      {/* Radial glow behind hero content — adds premium depth */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 50%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 70%)",
        }}
      />
      {/* Scanline — subtle moving line for incident room feel */}
      <div className="scanline" aria-hidden />
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <ParticlesBg
          count={90}
          connectionDistance={130}
          particleColor="59,130,246"
          lineColor="59,130,246"
          maxOpacity={0.25}
          maxLineOpacity={0.08}
          speed={0.25}
        />
      </div>
      <div className="max-w-7xl w-full mx-auto px-6 md:px-10 pt-24 md:pt-28">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 border border-[var(--accent-green)]/50 text-[var(--accent-green)] inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
            ACTIVE_SESSION
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 border border-[var(--accent-green)]/50 text-[var(--accent-green)] inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
            AVAILABLE
          </span>
        </div>
      </div>
      <div className="max-w-7xl w-full mx-auto px-6 md:px-10 flex-1 grid grid-cols-1 md:grid-cols-[1fr_minmax(0,440px)] gap-10 md:gap-12 items-center py-12">
        <div className="flex flex-col">
          <div className="mb-8 min-h-[5.5rem]">
            <BootSequence />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glitch font-display font-bold leading-[0.88] tracking-[-0.025em] text-foreground"
            style={{ fontSize: "clamp(3.5rem, 8vw, 9rem)" }}
          >
            <span className="text-[var(--accent)]">
              <TextScramble text="Santiago" />
            </span>
            <br />
            <TextScramble text="Sandili" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-8 font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-[var(--muted-foreground)]"
          >
            SOC Analyst Jr. <span className="text-foreground/60">·</span> Blue Team{" "}
            <span className="text-foreground/60">·</span> DFIR
          </motion.p>
        </div>
        <div className="hidden md:block">
          <TerminalWindow start />
        </div>
      </div>
      <div className="max-w-7xl w-full mx-auto px-6 md:px-10 pb-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] gap-6 flex-wrap">
        <div className="flex items-center gap-6">
          <span>SCROLL ↓</span>
        </div>
        <div className="text-right">
          <div>
            STATUS: <span className="text-[var(--accent-green)]">DISPONIBLE</span>
          </div>
          <div className="mt-1">BASE: TUC, AR.</div>
        </div>
      </div>
    </section>
  );
}
