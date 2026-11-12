import type { ReviewSection } from "@/types";

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
  executiveSummary: ReviewSection[];
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
    {
      heading: "Formato",
      paragraphs: [
        "El SAL1 de TryHackMe es un examen práctico pensado para analistas SOC y de Blue Team. Hay 24 horas para completar un bloque de fundamentos teóricos y dos simulaciones de incidentes en el SOC Simulator. La parte práctica no es de opción múltiple: hay que investigar alertas en una consola SIEM, cruzar telemetría de endpoints y de red, clasificar cada alerta como verdadero o falso positivo y justificar la decisión por escrito, sin pistas.",
      ],
    },
    {
      heading: "Resultado",
      paragraphs: [
        "Aprobé en el primer intento con 948/1000 (el mínimo es 750) y terminé en 4 h 7 min 55 s. Los dos escenarios que me tocaron fueron Fowl Play B1 v2, con 371/400, y Red Alert: Command and Control B2 V2, con 392/400.",
      ],
    },
    {
      heading: "Cómo trabajé los escenarios",
      paragraphs: [
        "Gran parte del trabajo fue separar el ruido de lo importante. Muchas alertas eran falsos positivos, y había que descartarlas con evidencia, no por intuición. Otras parecían menores por separado, pero estaban relacionadas con alertas de mayor severidad: eran verdaderos positivos que formaban parte del mismo incidente. Correlacionarlas era clave para ver el ataque completo y no tratarlo como eventos aislados.",
        "En cada caso intenté contestar las mismas cuatro preguntas: qué pasó, cómo entró la amenaza, qué impacto tuvo y qué había que contener de inmediato. Con esa cronología armada, justificar cada decisión salía mucho más claro.",
      ],
    },
    {
      heading: "Qué me llevo",
      paragraphs: [
        "El examen penaliza pegar logs sin criterio y premia explicar el incidente con una secuencia lógica. Es lo mismo que se espera de un analista L1 en el día a día: un ticket claro, con evidencia y una recomendación, que otra persona del equipo pueda retomar sin tener que empezar de cero.",
      ],
    },
  ],
};
