import { motion, useReducedMotion } from "motion/react";
import type { ComponentType } from "react";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { CvDownloadButton } from "@/components/ui/CvDownloadButton";
import { Section } from "@/components/primitives/Section";
import { CONTACT_CHANNELS, CONTACT_META } from "@/data/contact";
import type { ContactChannel } from "@/types";

const CHANNEL_ICONS = {
  linkedin: LinkedinIcon,
  mail: Mail,
  github: GithubIcon,
} satisfies Record<
  ContactChannel["icon"],
  ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>
>;

export function Contacto() {
  const prefersReduced = useReducedMotion();

  return (
    <Section id="contacto" number="07" title="Contacto" kicker="SECURE_CHANNEL" reveal="fade-scale">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        {/* Left Column: Analyst Status Card */}
        <div className="w-full bg-[var(--surface)] border border-border-dim rounded p-5 sm:p-7 md:p-8 relative overflow-hidden">
          {/* Subtle top laser accent line */}
          <div
            aria-hidden="true"
            className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent pointer-events-none"
          />

          <div className="mb-6 font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
            <span>ANALYST STATUS</span>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <span
              className="relative flex items-center justify-center size-4 shrink-0"
              aria-hidden="true"
            >
              {!prefersReduced && (
                <motion.span
                  className="absolute rounded-full size-4 bg-[var(--accent-green)]"
                  animate={{ scale: [1, 1.4], opacity: [1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <span className="relative rounded-full size-2.5 bg-[var(--accent-green)] shadow-[0_0_8px_var(--accent-green)]" />
            </span>
            <span className="font-body text-sm text-foreground font-semibold break-words [overflow-wrap:anywhere]">
              DISPONIBLE PARA OPORTUNIDADES
            </span>
          </div>

          <dl className="flex flex-col">
            {CONTACT_META.map((m) => (
              <div
                key={m.k}
                className="flex items-center justify-between py-4 border-t border-border-dim gap-4 flex-wrap"
              >
                <dt className="font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)] shrink-0">
                  {m.k}
                </dt>
                <dd className="text-foreground text-sm font-medium break-words [overflow-wrap:anywhere] text-right">
                  {m.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right Column: Secure Communication Channels */}
        <div className="flex flex-col gap-3">
          {CONTACT_CHANNELS.map((c) => {
            const Icon = CHANNEL_ICONS[c.icon];
            return (
              <a
                key={c.code}
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                aria-label={c.ariaLabel}
                className="group block px-5 sm:px-6 py-4.5 sm:py-5 bg-[var(--surface)] hover:bg-[var(--surface-2)]/70 border border-border-dim hover:border-[var(--accent)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] relative overflow-hidden transform-gpu backface-hidden transition-[background-color,border-color,transform] duration-200 ease-out rounded active:scale-[0.99] motion-reduce:active:scale-100 active:duration-100 min-h-[44px]"
              >
                {/* Tactical left accent indicator bar */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 inset-y-0 w-[2px] rounded-l bg-[var(--accent)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200"
                />

                <div className="flex items-center justify-between font-mono text-label uppercase tracking-[0.14em] text-[var(--muted-foreground)] mb-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      className="size-3.5 text-[var(--muted-foreground)] group-hover:text-[var(--accent)] group-focus-visible:text-[var(--accent)] transition-colors duration-200 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="group-hover:text-foreground group-focus-visible:text-foreground transition-colors duration-200">
                      {c.label}
                    </span>
                  </div>
                  <span className="text-[var(--muted-foreground)] group-hover:text-[var(--accent)]/90 group-focus-visible:text-[var(--accent)]/90 transition-colors duration-200 text-label tracking-[0.12em] font-mono">
                    CH_{c.code}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <span className="font-semibold text-base md:text-lg text-foreground group-hover:text-[var(--accent)] group-focus-visible:text-[var(--accent)] transition-colors duration-200 break-words [overflow-wrap:anywhere]">
                    {c.value}
                  </span>
                  <span className="font-mono text-label uppercase tracking-[0.12em] text-[var(--accent)] opacity-0 max-md:opacity-100 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transform-none transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu shrink-0">
                    {c.cta}
                  </span>
                </div>
              </a>
            );
          })}
          <CvDownloadButton size="lg" className="w-full" />
        </div>
      </div>
    </Section>
  );
}
