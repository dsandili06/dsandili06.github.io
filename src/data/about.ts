import type { AboutTab } from "@/types";

/** Focus areas shown as tabs in the About dossier, in display order. */
export const ABOUT_DOSSIER_TABS: AboutTab[] = [
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
