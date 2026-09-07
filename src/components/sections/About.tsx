import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SpotlightCard } from "@/components/fx/SpotlightCard";
import { Section } from "@/components/primitives/Section";

type AboutTabId = "triage" | "dfir" | "hunting";

interface TabContent {
  id: AboutTabId;
  label: string;
  title: string;
  description: string;
  highlights: string[];
}

const DOSSIER_TABS: TabContent[] = [
  {
    id: "triage",
    label: "TRIAGE & RESPUESTA",
    title: "Validación de alertas y aislamiento preventivo",
    description:
      "Análisis de telemetría de endpoints en tiempo real, descarte sistemático de falsos positivos y ejecución de contención preventiva en hosts comprometidos ante actividades anómalas.",
    highlights: [
      "Telemetría de procesos, parentesco anómalo y conexiones de red",
      "Aislamiento de hosts y corte de comunicación con infraestructura C2",
    ],
  },
  {
    id: "dfir",
    label: "DFIR & FORENSE",
    title: "Reconstrucción forense de la intrusión",
    description:
      "Extracción y triaje de evidencia volátil en memoria RAM, disección de artefactos de disco y estructuración cronológica de eventos para identificar el vector de acceso.",
    highlights: [
      "Volcados de memoria: inyecciones de código y procesos ocultos",
      "Timelines forenses de persistencia y ejecución de artefactos",
    ],
  },
  {
    id: "hunting",
    label: "DETECCIÓN & HUNTING",
    title: "Búsqueda proactiva y reglas de detección",
    description:
      "Correlación de telemetría y eventos en SIEM (Splunk, Elastic Stack), y mapeo metódico de tácticas adversarias contra MITRE ATT&CK.",
    highlights: [
      "Detección de TTPs en fases de ejecución y movimiento lateral",
      "Reglas Sigma y YARA orientadas a telemetría de laboratorio",
    ],
  },
];

export function About() {
  const [activeTab, setActiveTab] = useState<AboutTabId | null>("triage");
  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (accordionRef.current && !accordionRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <Section id="about" number="01" title="About Me" kicker="PROFILE">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-14 items-start">
        {/* Left Column: Authentic & Grounded Narrative Bio */}
        <div className="space-y-6 text-[15px] md:text-base leading-relaxed text-foreground/80 max-w-[58ch] lg:pt-5">
          <p className="text-base sm:text-[17px] text-foreground/90 font-normal leading-relaxed">
            Mi vínculo con la informática empezó desde la curiosidad de entender cómo funcionan los
            sistemas por dentro. Con el tiempo, esa inquietud se transformó en una vocación clara
            por la{" "}
            <span className="text-[var(--accent)] font-medium">ciberseguridad defensiva</span>:
            comprender cómo se originan las amenazas, qué rastros dejan y cómo neutralizarlas de
            raíz.
          </p>
          <p>
            Me defino por un aprendizaje constante y experimental. Lejos de quedarme en la teoría,
            dedico gran parte de mi tiempo a reconstruir incidentes en entornos simulados,
            diseccionar muestras de malware y analizar telemetría real de endpoints. En el{" "}
            <span className="text-[var(--accent)] font-medium">Blue Team</span> encontré la
            combinación perfecta entre pensamiento crítico, paciencia y rigor técnico.
          </p>
          <div className="border-l-2 border-[var(--accent)]/50 pl-4 py-2 bg-[color-mix(in_oklab,var(--accent)_3%,transparent)] rounded-r-xs">
            <p className="text-[14.5px] sm:text-base text-foreground/90 italic font-normal leading-relaxed">
              Mi objetivo es aportar serenidad, análisis metódico y capacidad de respuesta inmediata
              ante cualquier anomalía, convirtiendo datos aislados en defensas sólidas.
            </p>
          </div>
        </div>

        {/* Right Column: Tactical Rack Accordion */}
        <SpotlightCard className="backdrop-blur-md bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_32px_-4px_rgba(0,0,0,0.5)] border border-[var(--accent)]/30 hover:border-[var(--accent)] transition-all duration-200 p-6 sm:p-7">
          <div>
            {/* Header: Centered Titular with hairline architectural anchors */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-border-dim/60" />
              <h3 className="font-display font-semibold text-sm sm:text-base text-foreground text-center tracking-tight select-none">
                Enfoque operacional
              </h3>
              <div className="h-px flex-1 bg-border-dim/60" />
            </div>

            {/* Tactical Accordion Rack */}
            <div ref={accordionRef} className="space-y-3">
              {DOSSIER_TABS.map((item, index) => {
                const isActive = activeTab === item.id;
                return (
                  <div
                    key={item.id}
                    className={`border transition-all duration-200 rounded-xs overflow-hidden ${
                      isActive
                        ? "border-[var(--accent)]/50 bg-[color-mix(in_oklab,var(--surface-2)_60%,transparent)] shadow-xs"
                        : "border-border-dim/70 bg-[color-mix(in_oklab,var(--surface-2)_20%,transparent)] hover:border-border-dim hover:bg-[color-mix(in_oklab,var(--surface-2)_35%,transparent)]"
                    }`}
                  >
                    {/* Module Trigger Header */}
                    <button
                      type="button"
                      onClick={() => setActiveTab((curr) => (curr === item.id ? null : item.id))}
                      aria-label={item.label}
                      aria-expanded={isActive}
                      className="w-full py-3.5 px-4 flex items-center justify-between text-left select-none group transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            isActive
                              ? "bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
                              : "bg-[var(--muted-foreground)]/40 group-hover:bg-[var(--accent)]/60"
                          }`}
                        />
                        <span
                          className={`font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] font-semibold transition-colors ${
                            isActive
                              ? "text-[var(--accent)]"
                              : "text-[var(--muted-foreground)] group-hover:text-foreground"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5" aria-hidden="true">
                        <span className="font-mono text-[10px] text-[var(--muted-foreground)] opacity-60">
                          {`0${index + 1}`}
                        </span>
                        <motion.span
                          animate={{ rotate: isActive ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className={`text-xs select-none transition-colors ${
                            isActive ? "text-[var(--accent)]" : "text-[var(--muted-foreground)]"
                          }`}
                        >
                          ▾
                        </motion.span>
                      </div>
                    </button>

                    {/* Expandable Module Content */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1.5 border-t border-border-dim/40 space-y-3">
                            <h4 className="font-display font-bold text-base sm:text-lg text-foreground leading-tight">
                              {item.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed">
                              {item.description}
                            </p>

                            <ul className="space-y-1.5 pt-1">
                              {item.highlights.map((h) => (
                                <li
                                  key={h}
                                  className="flex items-start gap-2.5 p-2 rounded-xs bg-[var(--surface)]/70 border border-border-dim/40 text-[11px] sm:text-xs text-foreground/80 hover:border-[var(--accent)]/30 transition-colors"
                                >
                                  <span className="text-[var(--accent)] font-mono text-xs select-none">
                                    ›
                                  </span>
                                  <span className="leading-snug">{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </SpotlightCard>
      </div>
    </Section>
  );
}
