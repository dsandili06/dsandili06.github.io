import { motion } from "motion/react";

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
    <section
      id="contacto"
      data-reveal="fade-scale"
      className="relative py-24 md:py-32 border-b border-border-dim"
    >
      <div className="mb-14 md:mb-20">
        <h2
          className="font-display font-bold leading-[0.95] tracking-tight text-[var(--accent)]"
          style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
        >
          CONTACTO
        </h2>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          [SECURE_CHANNEL] · Tiempo de respuesta: {"< 24h"}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        <div className="w-full bg-[var(--surface)] border border-border-dim rounded p-8">
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
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground font-semibold">
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
                <span className="text-foreground text-sm font-medium">{m.v}</span>
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
              className="group block px-6 py-5 bg-[var(--surface)] border border-border-dim hover:border-[var(--accent)] transition-all duration-200 rounded"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-2">
                CHANNEL_{c.code} · {c.label}
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <span className="font-semibold text-base md:text-lg text-foreground group-hover:text-[var(--accent)] transition-colors break-all">
                  {c.value}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  {c.cta}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
