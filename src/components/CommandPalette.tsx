import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  FileText,
  Terminal,
  Shield,
  Award,
  BookOpen,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Copy,
  Check,
  Layers,
  Sparkles,
  ArrowRight,
  X,
  Radio,
} from "lucide-react";
import { INVESTIGATIONS } from "@/data/investigations";
import { STACK_GROUPS } from "@/data/stack";
import { CERTIFICATIONS } from "@/data/certifications";
import { getLenis } from "@/lib/lenis";
import { COMMAND_PALETTE_OPEN_EVENT, COMMAND_PALETTE_CLOSE_EVENT } from "@/hooks/useCommandPalette";
import { CertModal } from "@/components/CertModal";

// Lazy-load WriteupModal so react-markdown is only fetched if a writeup is opened
const WriteupModal = lazy(() =>
  import("@/components/WriteupModal").then((m) => ({ default: m.WriteupModal })),
);

const SECTIONS = [
  {
    id: "about",
    number: "01",
    label: "Sobre Mí",
    desc: "Perfil profesional, trayectoria en Blue Team y enfoque operacional",
    icon: FileText,
  },
  {
    id: "proyectos",
    number: "02",
    label: "Proyectos & Repositorios",
    desc: "Artifakt Labs, BlueTeam-Scripts y herramientas defensivas",
    icon: Layers,
  },
  {
    id: "investigaciones",
    number: "03",
    label: "Labs & Investigaciones DFIR",
    desc: "15 writeups técnicos de CyberDefenders con análisis forense",
    icon: Shield,
  },
  {
    id: "stack",
    number: "04",
    label: "Arsenal & Stack Tecnológico",
    desc: "SIEM, EDR, análisis de memoria, network forensics y scripting",
    icon: Terminal,
  },
  {
    id: "formacion",
    number: "05",
    label: "Certificaciones",
    desc: "Credenciales verificadas de TryHackMe, Google, Fortinet y CompTIA",
    icon: Award,
  },
  {
    id: "cursos",
    number: "06",
    label: "Cursos & Especializaciones",
    desc: "Formación continua en Cisco, Palo Alto Networks, Infosec y Dojo",
    icon: BookOpen,
  },
  {
    id: "contacto",
    number: "07",
    label: "Canales de Contacto",
    desc: "Contacto directo, redes profesionales y clave pública",
    icon: Mail,
  },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Writeup modal trigger from palette
  const [modalWriteupId, setModalWriteupId] = useState<string | null>(null);
  const [activeWriteupId, setActiveWriteupId] = useState<string | null>(null);

  // Cert modal trigger from palette
  const [modalCert, setModalCert] = useState<{ cert: string; title: string } | null>(null);
  const [activeCert, setActiveCert] = useState<{ cert: string; title: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Custom event listeners for programmatic open/close
  useEffect(() => {
    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);
    window.addEventListener(COMMAND_PALETTE_OPEN_EVENT, onOpen);
    window.addEventListener(COMMAND_PALETTE_CLOSE_EVENT, onClose);
    return () => {
      window.removeEventListener(COMMAND_PALETTE_OPEN_EVENT, onOpen);
      window.removeEventListener(COMMAND_PALETTE_CLOSE_EVENT, onClose);
    };
  }, []);

  // Body scroll lock & Lenis pause while palette is open
  useEffect(() => {
    if (!isOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Auto-focus input on open
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = originalOverflow;
      lenis?.start();
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const scrollToElement = useCallback((id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
    history.replaceState(null, "", `#${id}`);
  }, []);

  const handleSelectSection = useCallback(
    (id: string) => {
      scrollToElement(id);
    },
    [scrollToElement],
  );

  const handleSelectWriteup = useCallback((labId: string) => {
    setIsOpen(false);
    setModalWriteupId(labId);
    setActiveWriteupId(labId);
  }, []);

  const handleSelectCert = useCallback((certHref: string, certTitle: string) => {
    setIsOpen(false);
    setModalCert({ cert: certHref, title: certTitle });
    setActiveCert({ cert: certHref, title: certTitle });
  }, []);

  const handleSelectTool = useCallback(
    (groupTitle: string) => {
      setIsOpen(false);
      scrollToElement("stack");
      // Notify Stack.tsx to select the respective tool category
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("set-stack-category", { detail: { category: groupTitle } }),
        );
      }
    },
    [scrollToElement],
  );

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("sdsandili06@gmail.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // fallback
    }
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-4 md:p-6 pt-[max(2rem,env(safe-area-inset-top))] sm:pt-[10vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-[#04070B]/80 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Command Dialog Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="SOC Command Palette"
              initial={{ opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-[#080D14] border border-[var(--accent)]/30 rounded-xs shadow-[0_24px_64px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.08)] overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[75vh]"
            >
              {/* Tactical HUD Header Bar */}
              <div className="flex items-center justify-between px-3.5 sm:px-4 py-2 bg-[var(--surface)]/90 border-b border-border-dim text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--muted-foreground)] select-none">
                <div className="flex items-center gap-2">
                  <span className="inline-block size-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
                  <span className="text-foreground/90">SOC_OPERATIONS // COMMAND_PALETTE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-[9px] text-[var(--muted-foreground)]/70">
                    ESC PARA SALIR
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="size-5 inline-flex items-center justify-center text-[var(--muted-foreground)] hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Cerrar paleta de comandos"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* CMDK Root Container */}
              <Command
                label="Buscador global del portafolio"
                className="flex flex-col flex-1 min-h-0 bg-transparent"
              >
                {/* Search Input Bar */}
                <div className="flex items-center px-3.5 sm:px-4 border-b border-border-dim/80 bg-[#0A1017]">
                  <Search className="size-4 text-[var(--accent)] shrink-0 select-none mr-3" />
                  <Command.Input
                    ref={inputRef}
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Buscar casos, herramientas, certificaciones o secciones..."
                    className="flex-1 bg-transparent py-3.5 font-mono text-xs sm:text-[13px] text-foreground placeholder:text-[var(--muted-foreground)]/70 outline-none"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="text-[10px] font-mono uppercase text-[var(--muted-foreground)] hover:text-foreground px-1.5 py-0.5 rounded-xs border border-border-dim"
                    >
                      LIMPIAR
                    </button>
                  )}
                </div>

                {/* Command List (Scrollable Area with Lenis Protection) */}
                <Command.List
                  data-lenis-prevent
                  className="flex-1 overflow-y-auto p-2 sm:p-3 font-mono text-xs overscroll-contain focus:outline-none"
                >
                  {/* Empty state */}
                  <Command.Empty className="py-10 text-center">
                    <Radio className="size-7 mx-auto mb-3 text-[var(--accent)]/50 animate-pulse" />
                    <p className="font-display font-semibold text-sm text-foreground">
                      No se encontraron resultados para &ldquo;{search}&rdquo;
                    </p>
                    <p className="mt-1.5 text-[11px] font-mono text-[var(--muted-foreground)]">
                      Probá buscando: <span className="text-[var(--accent)]">3CX</span>,{" "}
                      <span className="text-[var(--accent)]">Volatility</span>,{" "}
                      <span className="text-[var(--accent)]">SAL1</span>,{" "}
                      <span className="text-[var(--accent)]">Splunk</span> o{" "}
                      <span className="text-[var(--accent)]">DFIR</span>.
                    </p>
                  </Command.Empty>

                  {/* Grupo: Acciones Rápidas */}
                  <Command.Group
                    heading="ACCIONES RÁPIDAS"
                    className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-[var(--muted-foreground)]/80 mb-2"
                  >
                    <Command.Item
                      value="copiar correo email contacto santiago sandili"
                      onSelect={handleCopyEmail}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xs cursor-pointer text-foreground/90 transition-colors data-[selected='true']:bg-[var(--surface-2)] data-[selected='true']:text-[var(--accent)] data-[selected='true']:border-l-2 data-[selected='true']:border-[var(--accent)]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {copiedEmail ? (
                          <Check size={14} className="text-[var(--accent-green)] shrink-0" />
                        ) : (
                          <Copy size={14} className="text-[var(--accent)] shrink-0" />
                        )}
                        <span className="truncate">
                          {copiedEmail
                            ? "¡Correo copiado al portapapeles!"
                            : "Copiar correo del analista (sdsandili06@gmail.com)"}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 border border-border-dim text-[var(--muted-foreground)] shrink-0 ml-2">
                        {copiedEmail ? "COPIADO" : "CLICK / ↵"}
                      </span>
                    </Command.Item>

                    <Command.Item
                      value="github repositorio perfil artifakt labs blueteam scripts"
                      onSelect={() => {
                        setIsOpen(false);
                        window.open(
                          "https://github.com/dsandili06",
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xs cursor-pointer text-foreground/90 transition-colors data-[selected='true']:bg-[var(--surface-2)] data-[selected='true']:text-[var(--accent)] data-[selected='true']:border-l-2 data-[selected='true']:border-[var(--accent)]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Github size={14} className="text-[var(--accent)] shrink-0" />
                        <span className="truncate">Abrir perfil de GitHub (dsandili06)</span>
                      </div>
                      <ExternalLink
                        size={12}
                        className="text-[var(--muted-foreground)] shrink-0 ml-2"
                      />
                    </Command.Item>

                    <Command.Item
                      value="linkedin perfil profesional santiago sandili"
                      onSelect={() => {
                        setIsOpen(false);
                        window.open(
                          "https://www.linkedin.com/in/santiagodsandili/",
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xs cursor-pointer text-foreground/90 transition-colors data-[selected='true']:bg-[var(--surface-2)] data-[selected='true']:text-[var(--accent)] data-[selected='true']:border-l-2 data-[selected='true']:border-[var(--accent)]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Linkedin size={14} className="text-[var(--accent)] shrink-0" />
                        <span className="truncate">Abrir perfil de LinkedIn</span>
                      </div>
                      <ExternalLink
                        size={12}
                        className="text-[var(--muted-foreground)] shrink-0 ml-2"
                      />
                    </Command.Item>
                  </Command.Group>

                  <Command.Separator className="h-px bg-border-dim/60 my-2" />

                  {/* Grupo: Secciones */}
                  <Command.Group
                    heading="SECCIONES DEL SISTEMA"
                    className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-[var(--muted-foreground)]/80 mb-2"
                  >
                    {SECTIONS.map((sec) => {
                      const Icon = sec.icon;
                      return (
                        <Command.Item
                          key={sec.id}
                          value={`${sec.number} ${sec.label} ${sec.desc}`}
                          onSelect={() => handleSelectSection(sec.id)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xs cursor-pointer text-foreground/90 transition-colors data-[selected='true']:bg-[var(--surface-2)] data-[selected='true']:text-[var(--accent)] data-[selected='true']:border-l-2 data-[selected='true']:border-[var(--accent)]"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono text-[10px] text-[var(--accent)] font-semibold shrink-0">
                              {sec.number}
                            </span>
                            <Icon size={14} className="text-[var(--muted-foreground)] shrink-0" />
                            <div className="flex flex-col min-w-0">
                              <span className="truncate font-medium">{sec.label}</span>
                              <span className="text-[10px] text-[var(--muted-foreground)] truncate hidden sm:block">
                                {sec.desc}
                              </span>
                            </div>
                          </div>
                          <ArrowRight
                            size={12}
                            className="text-[var(--muted-foreground)] shrink-0 ml-2"
                          />
                        </Command.Item>
                      );
                    })}
                  </Command.Group>

                  <Command.Separator className="h-px bg-border-dim/60 my-2" />

                  {/* Grupo: Writeups & Casos DFIR */}
                  <Command.Group
                    heading="INVESTIGACIONES & WRITEUPS DFIR"
                    className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-[var(--muted-foreground)]/80 mb-2"
                  >
                    {INVESTIGATIONS.map((lab) => (
                      <Command.Item
                        key={lab.id}
                        value={`${lab.id} ${lab.title} ${lab.platform} ${lab.categories.join(" ")} ${lab.summary}`}
                        onSelect={() => handleSelectWriteup(lab.id)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xs cursor-pointer text-foreground/90 transition-colors data-[selected='true']:bg-[var(--surface-2)] data-[selected='true']:text-[var(--accent)] data-[selected='true']:border-l-2 data-[selected='true']:border-[var(--accent)]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-[var(--surface)] border border-border-dim text-[var(--accent)] shrink-0">
                            {lab.id}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-medium text-foreground">
                              {lab.title}
                            </span>
                            <span className="text-[10px] text-[var(--muted-foreground)] truncate">
                              {lab.platform} · {lab.categories.join(" · ")}
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--accent-green)] border border-[var(--accent-green)]/40 px-1.5 py-0.5 rounded-xs shrink-0 ml-2 hidden sm:inline-block">
                          LEER CASO
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>

                  <Command.Separator className="h-px bg-border-dim/60 my-2" />

                  {/* Grupo: Herramientas del Arsenal */}
                  <Command.Group
                    heading="ARSENAL DE HERRAMIENTAS"
                    className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-[var(--muted-foreground)]/80 mb-2"
                  >
                    {STACK_GROUPS.flatMap((grp) =>
                      grp.items.map((tool) => (
                        <Command.Item
                          key={`${grp.title}-${tool}`}
                          value={`${tool} ${grp.title}`}
                          onSelect={() => handleSelectTool(grp.title)}
                          className="flex items-center justify-between px-3 py-2 rounded-xs cursor-pointer text-foreground/90 transition-colors data-[selected='true']:bg-[var(--surface-2)] data-[selected='true']:text-[var(--accent)] data-[selected='true']:border-l-2 data-[selected='true']:border-[var(--accent)]"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-[var(--accent)] font-mono text-xs select-none shrink-0">
                              ›
                            </span>
                            <span className="truncate font-medium">{tool}</span>
                          </div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--muted-foreground)]/70 shrink-0 ml-2">
                            {grp.title}
                          </span>
                        </Command.Item>
                      )),
                    )}
                  </Command.Group>

                  <Command.Separator className="h-px bg-border-dim/60 my-2" />

                  {/* Grupo: Certificaciones */}
                  <Command.Group
                    heading="CERTIFICACIONES"
                    className="[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-[var(--muted-foreground)]/80 mb-2"
                  >
                    {CERTIFICATIONS.map((cert) => (
                      <Command.Item
                        key={cert.code}
                        value={`${cert.code} ${cert.title} ${cert.org} ${cert.status}`}
                        onSelect={() => {
                          if (cert.href) {
                            handleSelectCert(cert.href, cert.title);
                          } else {
                            handleSelectSection("formacion");
                          }
                        }}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xs cursor-pointer text-foreground/90 transition-colors data-[selected='true']:bg-[var(--surface-2)] data-[selected='true']:text-[var(--accent)] data-[selected='true']:border-l-2 data-[selected='true']:border-[var(--accent)]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Award size={14} className="text-[var(--accent)] shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-medium">{cert.title}</span>
                            <span className="text-[10px] text-[var(--muted-foreground)] truncate">
                              {cert.org} · {cert.year}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs border shrink-0 ml-2 ${
                            cert.status === "OBTENIDA"
                              ? "border-[var(--accent-green)]/40 text-[var(--accent-green)]"
                              : "border-[var(--accent)]/40 text-[var(--accent)]"
                          }`}
                        >
                          {cert.status}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>

                {/* Tactical Footer Telemetry Bar */}
                <div className="flex items-center justify-between px-3.5 sm:px-4 py-2 border-t border-border-dim bg-[var(--surface)] text-[10px] font-mono text-[var(--muted-foreground)] select-none">
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-[var(--surface-2)] border border-border-dim rounded-xs text-foreground/80">
                        ↑↓
                      </kbd>{" "}
                      Navegar
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-[var(--surface-2)] border border-border-dim rounded-xs text-foreground/80">
                        ↵
                      </kbd>{" "}
                      Abrir
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <kbd className="px-1 py-0.5 bg-[var(--surface-2)] border border-border-dim rounded-xs text-foreground/80">
                        ESC
                      </kbd>{" "}
                      Cerrar
                    </span>
                  </div>
                  <div className="hidden sm:block text-[9px] text-[var(--accent)] font-semibold tracking-wider">
                    15 CASOS · 20+ TOOLS · 5 CERTS
                  </div>
                </div>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Writeup Modal Triggered from Command Palette */}
      {modalWriteupId && (
        <Suspense fallback={null}>
          <WriteupModal
            investigationId={modalWriteupId}
            isOpen={Boolean(activeWriteupId)}
            onClose={() => setActiveWriteupId(null)}
            onExitComplete={() => setModalWriteupId(null)}
          />
        </Suspense>
      )}

      {/* Cert Modal Triggered from Command Palette */}
      {modalCert && (
        <CertModal
          cert={modalCert.cert}
          title={modalCert.title}
          isOpen={Boolean(activeCert)}
          onClose={() => setActiveCert(null)}
          onExitComplete={() => setModalCert(null)}
        />
      )}
    </>,
    document.body,
  );
}
