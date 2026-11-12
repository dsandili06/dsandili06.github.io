import { motion } from "motion/react";
import { Download } from "lucide-react";
import { BootSequence } from "@/components/fx/BootSequence";
import { TerminalWindow } from "@/components/fx/TerminalWindow";
import { TextScramble } from "@/components/fx/TextScramble";
import { openCertificateBySrc } from "@/components/features/modals/modalRequests";
import { ACTION_PRIMARY_CLASS, ACTION_SECONDARY_CLASS } from "@/components/ui/actionLinkStyles";
import { CERTIFICATIONS } from "@/data/certifications";
import { HERO_CREDENTIALS, HERO_SUMMARY } from "@/data/heroCredentials";
import { CONTACT } from "@/data/site";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { HeroCredential } from "@/types";

export function Hero() {
  const showTerminal = useMediaQuery("(min-width: 1280px)");

  const renderCredential = (credential: HeroCredential) => {
    const score = CERTIFICATIONS.find((cert) => cert.href === credential.cert)?.score;
    return (
      <button
        key={credential.id}
        type="button"
        onClick={() => openCertificateBySrc(credential.cert)}
        className={`hero-credential group flex min-h-[4.75rem] min-w-0 items-center gap-2 rounded-sm px-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${credential.id === "google-cybersecurity" ? "hero-credential--google" : ""}`}
        aria-label={`Ver credencial ${credential.name}`}
      >
        <span className="hero-credential__badge flex size-16 shrink-0 items-center justify-center">
          <img
            src={credential.logo}
            alt={`Insignia ${credential.shortName}`}
            width={64}
            height={64}
            className="size-full object-contain pointer-events-none"
            loading="eager"
            decoding="async"
          />
        </span>
        <span className="hero-credential__name flex min-w-0 flex-1 flex-col justify-center gap-0.5 font-display text-sm font-bold leading-tight tracking-tight text-foreground">
          {credential.shortName}
          {score && (
            <span className="whitespace-nowrap font-mono text-label font-normal tracking-normal text-[var(--accent)]">
              {score}
            </span>
          )}
        </span>
        <span
          className="hero-credential__arrow shrink-0 font-mono text-sm leading-none text-[var(--accent)]"
          aria-hidden="true"
        >
          →
        </span>
      </button>
    );
  };

  return (
    <section
      id="top"
      className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden border-b border-border-dim"
    >
      {/* Scanline — subtle moving line for incident room feel */}
      <div className="scanline" aria-hidden />
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 pt-6 sm:pt-10 md:pt-28">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-label uppercase tracking-[0.14em] px-2.5 py-1 border border-[var(--accent-green)]/50 text-[var(--accent-green)] inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
            ACTIVE_SESSION
          </span>
        </div>
      </div>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 flex-1 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,440px)] gap-10 xl:gap-12 items-center py-6 sm:py-8 md:py-12">
        <div className="flex flex-col">
          <div className="hidden sm:block mb-8 min-h-[5.5rem]">
            <BootSequence />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glitch font-display font-bold leading-[0.88] tracking-[-0.025em] text-foreground text-[clamp(3.35rem,14.5vw,4.75rem)] sm:text-[clamp(4.25rem,10.5vw,6rem)] md:text-[clamp(4.75rem,7.5vw,9rem)]"
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
            className="mt-8 font-mono text-xs md:text-sm uppercase tracking-[0.14em] text-[var(--muted-foreground)]"
          >
            SOC Analyst Jr. <span className="text-foreground/60">·</span> Blue Team{" "}
            <span className="text-foreground/60">·</span> DFIR
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]"
          >
            {HERO_SUMMARY}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <a href="#investigaciones" className={ACTION_PRIMARY_CLASS}>
              Ver investigaciones
            </a>
            <a
              href={CONTACT.cv}
              download
              aria-label="Descargar CV (PDF)"
              className={ACTION_SECONDARY_CLASS}
            >
              <Download className="size-4 shrink-0" aria-hidden="true" />
              Descargar CV
            </a>
          </motion.div>

          <div className="mt-7 pt-5 border-t border-[var(--border)]/40">
            <div className="hero-credential__surface">
              <div
                role="group"
                aria-label="Credenciales principales"
                className="hero-credential__grid"
              >
                {HERO_CREDENTIALS.map(renderCredential)}
              </div>
            </div>
          </div>
        </div>
        {showTerminal && (
          <div className="xl:max-w-[440px] opacity-80">
            <TerminalWindow start />
          </div>
        )}
      </div>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 pb-10 flex items-end justify-between font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)] gap-6 flex-wrap">
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
