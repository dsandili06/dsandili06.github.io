import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { BootSequence } from "@/components/fx/BootSequence";
import { TerminalWindow } from "@/components/fx/TerminalWindow";
import { HeroShader } from "@/components/fx/HeroShader";
import { TextScramble } from "@/components/fx/TextScramble";
import { CertModal } from "@/components/CertModal";

type HeroCredential = {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  cert: string;
};

const HERO_CREDENTIALS: HeroCredential[] = [
  {
    id: "comptia-secplus",
    name: "CompTIA Security+",
    shortName: "Security+",
    logo: "/badges/comptiabadge.png",
    cert: "/certs/comptia-security-plus-sy0-701.webp",
  },
  {
    id: "sal1",
    name: "SAL1",
    shortName: "SAL1",
    logo: "/badges/sal1badge.png",
    cert: "/certs/THM-SAL1-Certificate.png",
  },
  {
    id: "google-cybersecurity",
    name: "Google Cybersecurity",
    shortName: "Google Cybersecurity",
    logo: "/badges/badgegoogle.png",
    cert: "/certs/Google Cybersecurity Certificate.webp",
  },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCert, setActiveCert] = useState<{ cert: string; name: string } | null>(null);
  const [modalCert, setModalCert] = useState<{ cert: string; name: string } | null>(null);

  // Watermark parallax — drifts slower than scroll, fades out
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const wmY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const wmOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const renderCredential = (credential: HeroCredential) => (
    <button
      key={credential.id}
      type="button"
      onClick={() => {
        setActiveCert({ cert: credential.cert, name: credential.name });
        setModalCert({ cert: credential.cert, name: credential.name });
      }}
      className={`hero-credential group flex min-h-[4.75rem] min-w-0 items-center gap-2 rounded-sm px-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#04070b] ${credential.id === "google-cybersecurity" ? "hero-credential--google" : ""}`}
      aria-label={`Ver credencial ${credential.name}`}
    >
      <span className="hero-credential__badge flex size-16 shrink-0 items-center justify-center">
        <img
          src={credential.logo}
          alt={`Insignia ${credential.shortName}`}
          className="size-full object-contain pointer-events-none"
          loading="eager"
          decoding="async"
        />
      </span>
      <span className="hero-credential__name flex min-w-0 flex-1 items-center font-display text-sm font-bold leading-tight tracking-tight text-foreground">
        {credential.shortName}
      </span>
      <span
        className="hero-credential__arrow shrink-0 font-mono text-sm leading-none text-[var(--accent)]"
        aria-hidden="true"
      >
        →
      </span>
    </button>
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100dvh] flex flex-col justify-between overflow-hidden border-b border-border-dim grid-bg"
    >
      {/* WebGL fluid gradient — accent flow + pointer glow */}
      <HeroShader />
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
      {/* Kinetic watermark — oversized outlined text with parallax */}
      <motion.div aria-hidden className="hero-watermark" style={{ y: wmY, opacity: wmOpacity }}>
        <span>
          BLUE
          <br />
          TEAM
        </span>
      </motion.div>
      {/* Scanline — subtle moving line for incident room feel */}
      <div className="scanline" aria-hidden />
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 pt-6 sm:pt-10 md:pt-28">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 border border-[var(--accent-green)]/50 text-[var(--accent-green)] inline-flex items-center gap-2">
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
            className="mt-8 font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-[var(--muted-foreground)]"
          >
            SOC Analyst Jr. <span className="text-foreground/60">·</span> Blue Team{" "}
            <span className="text-foreground/60">·</span> DFIR
          </motion.p>

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
        <div className="xl:max-w-[440px]">
          <TerminalWindow start />
        </div>
      </div>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 pb-10 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] gap-6 flex-wrap">
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

      {modalCert && (
        <CertModal
          cert={modalCert.cert}
          title={modalCert.name}
          isOpen={Boolean(activeCert)}
          onClose={() => setActiveCert(null)}
          onExitComplete={() => setModalCert(null)}
        />
      )}
    </section>
  );
}
