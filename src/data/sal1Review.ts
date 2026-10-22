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
};
