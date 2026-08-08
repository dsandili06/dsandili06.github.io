import type { Project } from "@/types";

export const PROJECTS: Project[] = [
  {
    id: "01",
    title: "Artifakt Labs",
    description:
      "Repositorio de laboratorios prácticos de SOC que reúne investigaciones de incidentes, análisis de alertas, detección de TTPs y ejercicios de threat hunting sobre entornos simulados.",
    href: "https://github.com/dsandili06/Artifakt-Labs",
    label: "LABS_SOC.REPO",
  },
  {
    id: "02",
    title: "Blue Team Automation Scripts",
    description:
      "Colección de scripts para tareas operativas de SOC y DFIR, con utilidades para triage, parsing, recolección de evidencia y automatización de tareas repetitivas.",
    href: "https://github.com/dsandili06/blueteam-scripts",
    label: "AUTOMATION_BT.REPO",
  },
];
