export interface Sal1Section {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  overview: string;
  takeaway: string;
}

export interface Sal1ReviewData {
  title: string;
  certCode: string;
  org: string;
  officialDate: string;
  score: number;
  maxScore: number;
  requiredScore: number;
  result: "Pass";
  attempt: number;
  duration: string;
  evidenceImage: string;
  certImage: string;
  executiveSummary: string[];
  sections: Sal1Section[];
  verdict: {
    rating: string;
    strengths: string[];
    considerations: string[];
  };
}

export const SAL1_REVIEW: Sal1ReviewData = {
  title: "Security Analyst Level 1 (SAL1)",
  certCode: "SAL1",
  org: "TryHackMe",
  officialDate: "19/03/2026",
  score: 948,
  maxScore: 1000,
  requiredScore: 750,
  result: "Pass",
  attempt: 1,
  duration: "4h 7m 55s",
  evidenceImage: "/Puntaje.png",
  certImage: "/certs/THM-SAL1-Certificate.png",
  executiveSummary: [
    "La certificación Security Analyst Level 1 (SAL1) de TryHackMe es una evaluación técnica y práctica diseñada para validar competencias reales de un Analista SOC y Blue Team en escenarios de intrusión simulados en vivo. A diferencia de exámenes puramente memorísticos o de opción múltiple descontextualizados, el SAL1 evalúa la capacidad de operar en consolas SIEM reales, reconstruir incidentes a partir de telemetría de endpoints y red, y redactar justificaciones precisas de triaje y contención sin ningún tipo de asistencia o pistas.",
    "El examen otorga una ventana autogestionada de 24 horas para completar una sección de fundamentos teóricos de seguridad y dos simulaciones completas en el entorno SOC Simulator. Completé la evaluación en un tiempo neto de 4 horas, 7 minutos y 55 segundos, obteniendo una puntuación final de 948 sobre 1000 puntos (umbral de aprobación: 750) en mi primer intento.",
    "Los dos escenarios prácticos asignados en mi evaluación fueron 'Fowl Play B1 v2' (371/400) y 'Red Alert: Command and Control B2 V2' (392/400). Más allá del puntaje, lo valioso de la prueba radica en que penaliza severamente el copiar y pegar logs sin criterio y premia la capacidad de estructurar una cronología causal coherente: qué ocurrió, cómo ingresó la amenaza, qué impacto generó y qué medidas de mitigación inmediatas deben ejecutarse.",
  ],
  sections: [
    {
      id: "fundamentals",
      name: "Security Analyst Fundamentals",
      score: 185,
      maxScore: 200,
      overview:
        "Evaluación de opción múltiple sobre fundamentos de operaciones de seguridad, marcos defensivos (NIST/MITRE), análisis de red y telemetría de endpoints.",
      takeaway:
        "No es un cuestionario conceptual de memoria: exige entender la cadena completa del incidente, desde la inspección de tráfico y reglas Snort hasta la correlación de logs en el SIEM, priorizando qué fuentes de datos consultar según la táctica adversaria observada.",
    },
    {
      id: "fowl-play",
      name: "Fowl Play B1 v2",
      score: 371,
      maxScore: 400,
      overview: "Simulación práctica de operaciones en entorno SOC ante un incidente de seguridad.",
      takeaway:
        "El reporte final y la justificación de escalado definen el puntaje: identificar la alerta real no alcanza si no sabés filtrar los falsos positivos y explicar con precisión técnica por qué el incidente debe ser escalado.",
    },
    {
      id: "red-alert-c2",
      name: "Red Alert: Command and Control B2 V2",
      score: 392,
      maxScore: 400,
      overview:
        "Simulación práctica de operaciones en entorno SOC ante actividad adversaria en la red.",
      takeaway:
        "La clave estuvo en discriminar el ruido benigno de la comunicación maliciosa y redactar un informe claro: el valor del analista radica en documentar la evidencia con rigor para que el equipo de respuesta actúe sin demoras.",
    },
  ],
  verdict: {
    rating: "9.5 / 10",
    strengths: [
      "Simulación 100% práctica: evalúa habilidades analíticas reales frente a consolas SIEM y telemetría auténtica.",
      "Cero pistas o 'hints': el analista debe deducir la causalidad por sí mismo, reflejando la realidad de un centro de operaciones.",
      "Énfasis en la documentación: premia la claridad, el rigor cronológico y la fundamentación defensiva en los reportes.",
      "Ventana de 24 horas flexible: permite trabajar con serenidad, contrastar hipótesis y revisar exhaustivamente las evidencias.",
    ],
    considerations: [
      "En horas de alta concurrencia de la plataforma, el aprovisionamiento de las máquinas del simulador puede demorar un par de minutos.",
      "Requiere familiaridad previa con la sintaxis de búsqueda en Splunk (SPL) y la telemetría de Sysmon para no perder tiempo en consultas ineficientes.",
    ],
  },
};
