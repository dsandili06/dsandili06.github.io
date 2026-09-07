import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { BootSequence } from "@/components/fx/BootSequence";
import { TerminalWindow } from "@/components/fx/TerminalWindow";
import { HeroShader } from "@/components/fx/HeroShader";
import { TextScramble } from "@/components/fx/TextScramble";
import { CertModal } from "@/components/CertModal";

const HERO_BADGES = [
  {
    id: "sal1",
    name: "SAL1 (Security Analyst L1)",
    org: "TryHackMe",
    logo: "/badges/sal1badge.png",
    cert: "/certs/THM-SAL1-Certificate.png",
  },
  {
    id: "google",
    name: "Google Cybersecurity",
    org: "Google",
    logo: "/badges/badgegoogle.png",
    cert: "/certs/Google Cybersecurity Certificate.webp",
  },
  {
    id: "blue-team",
    name: "Fundamentos en Blue Team: Ciberinteligencia, Forense y Respuesta",
    org: "Academia de Capacitación en Ciberseguridad",
    logo: "/badges/ciber.png",
    cert: "/certs/Certificado_de_Aprobacion -  ACAD DE CIBERSEGURIDAD.webp",
  },
  {
    id: "nse1",
    name: "NSE 1 Network Security Associate",
    org: "Fortinet",
    logo: "/badges/fortinet-nse-1-certified-in-cybersecurity.png",
    cert: "/certs/Fortinet NSE 1 Certified in Cybersecurity.webp",
  },
  {
    id: "nse2",
    name: "NSE 2 Network Security Associate",
    org: "Fortinet",
    logo: "/badges/fortinet-nse-2-certified-in-cybersecurity.1.png",
    cert: "/certs/Fortinet NSE 2 Certified in Cybersecurity.webp",
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
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] px-2.5 py-1 border border-[var(--accent-green)]/50 text-[var(--accent-green)] inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
            AVAILABLE
          </span>
        </div>
      </div>
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-10 flex-1 grid grid-cols-1 md:grid-cols-[1fr_minmax(0,440px)] gap-10 md:gap-12 items-center py-6 sm:py-8 md:py-12">
        <div className="flex flex-col">
          <div className="hidden sm:block mb-8 min-h-[5.5rem]">
            <BootSequence />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glitch font-display font-bold leading-[0.88] tracking-[-0.025em] text-foreground"
            style={{ fontSize: "clamp(2.5rem, 8vw, 9rem)" }}
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

          {/* Tactical Verified Credentials Dock */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-8 pt-6 border-t border-[var(--border)]/40 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
              <span className="size-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
              <span>VERIFIED_CREDENTIALS</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {HERO_BADGES.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setActiveCert(b);
                    setModalCert(b);
                  }}
                  className="group relative size-12 sm:size-14 md:size-20 shrink-0 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
                  title={`${b.name} (${b.org}) — Click para ver credencial`}
                  aria-label={`Ver credencial ${b.name}`}
                >
                  <img
                    src={b.logo}
                    alt={`Badge ${b.name}`}
                    className="size-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_16px_rgba(59,130,246,0.6)] group-hover:brightness-115 transition-all duration-300 pointer-events-none"
                    loading="eager"
                    decoding="async"
                  />
                  {/* Micro-destello estelar en esquina */}
                  <div
                    className="absolute -top-1 -right-1 pointer-events-none opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out"
                    aria-hidden="true"
                  >
                    <div className="absolute -inset-1 rounded-full bg-cyan-400/30 blur-sm" />
                    <svg
                      viewBox="0 0 24 24"
                      className="relative size-4 sm:size-5 text-white filter drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] transition-transform duration-700 ease-out group-hover:rotate-45"
                      fill="currentColor"
                    >
                      <path d="M12 0C12 6.627 17.373 12 24 12C17.373 12 12 17.373 12 24C12 17.373 6.627 12 0 12C6.627 12 12 6.627 12 0Z" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="md:max-w-[440px]">
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
