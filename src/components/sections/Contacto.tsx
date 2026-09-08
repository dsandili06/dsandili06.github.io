import { motion } from "motion/react";
import { Section } from "@/components/primitives/Section";

const channels = [
  {
    code: "01",
    label: "LinkedIn",
    value: "/in/santiagodsandili",
    href: "https://linkedin.com/in/santiagodsandili",
    cta: "Ver perfil →",
    external: true,
  },
  {
    code: "02",
    label: "Email",
    value: "sdsandili06@gmail.com",
    href: "mailto:sdsandili06@gmail.com",
    cta: "Enviar mensaje →",
    external: false,
  },
  {
    code: "03",
    label: "GitHub",
    value: "github.com/dsandili06",
    href: "https://github.com/dsandili06",
    cta: "Ver repositorios →",
    external: true,
  },
];

const meta = [
  { k: "UBICACIÓN", v: "Tucumán, Argentina" },
  { k: "MODALIDAD", v: "Remoto / Híbrido" },
  { k: "RESPUESTA", v: "< 24 horas" },
];

export function Contacto() {
  return (
    <Section id="contacto" number="07" title="Contacto" kicker="SECURE_CHANNEL">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        <div className="w-full bg-[var(--surface)] border border-border-dim rounded p-5 sm:p-7 md:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_4px_20px_-4px_rgba(0,0,0,0.4)]">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-6">
            ANALYST STATUS
          </div>
          <div className="flex items-center gap-3 mb-8">
            <span className="relative flex items-center justify-center size-4">
              <motion.span
                className="absolute rounded-full size-4 bg-[var(--accent-green)]"
                animate={{ scale: [1, 1.4], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
              <span className="relative rounded-full size-2.5 bg-[var(--accent-green)]" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground font-semibold break-words [overflow-wrap:anywhere]">
              DISPONIBLE PARA OPORTUNIDADES
            </span>
          </div>
          <div className="flex flex-col">
            {meta.map((m) => (
              <div
                key={m.k}
                className="flex items-center justify-between py-4 border-t border-border-dim"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                  {m.k}
                </span>
                <span className="text-foreground text-sm font-medium break-words [overflow-wrap:anywhere]">
                  {m.v}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {channels.map((c) => (
            <a
              key={c.code}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group block px-6 py-5 bg-[var(--surface)] border border-border-dim hover:border-[var(--accent)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_2px_8px_-2px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_20px_-4px_rgba(0,0,0,0.5),0_0_15px_-4px_rgba(34,211,238,0.12)] hover:-translate-y-0.5 transition-all duration-200 rounded"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-2">
                {c.label}
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="font-semibold text-base md:text-lg text-foreground group-hover:text-[var(--accent)] transition-colors break-words [overflow-wrap:anywhere]">
                  {c.value}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] opacity-0 max-md:opacity-100 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  {c.cta}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
