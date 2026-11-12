import type { ReviewSection } from "@/types";

interface SecurityPlusReviewData {
  score: number;
  maxScore: number;
  attempt: number;
  result: "Pass";
  duration: string;
  evidenceImage: null;
  executiveSummary: ReviewSection[];
}

export const SECURITY_PLUS_REVIEW: SecurityPlusReviewData = {
  score: 791,
  maxScore: 900,
  attempt: 1,
  result: "Pass",
  duration: "90 min",
  evidenceImage: null,
  executiveSummary: [
    {
      heading: "Preparación",
      paragraphs: [
        "Mi recurso principal fueron los videos gratuitos de Professor Messer en YouTube. Los completé con el curso de preparación de Infosec en LinkedIn Learning, porque ya tenía Premium, y con el Set 1 de exámenes de práctica de Jason Dion.",
        "El primer simulacro de Dion me salió muy mal, pero fue lo más útil de toda la preparación: me mostró con claridad qué temas tenía flojos y en qué tenía que enfocarme. Para practicar armé mi propia herramienta, con simulacros, un glosario y los puertos más habituales. En total respondí unas 1.400 preguntas de práctica.",
      ],
    },
    {
      heading: "El examen",
      paragraphs: [
        "Aprobé en el primer intento con 791/900 y usé los 90 minutos completos. Lo más difícil fueron unas diez preguntas en las que dos o más respuestas parecían correctas y había que elegir la más adecuada para el escenario. Ahí es donde más tiempo invertí y donde más me costó mantener la calma. Las PBQ (preguntas prácticas) me resultaron accesibles, salvo una que no supe cómo resolver.",
      ],
    },
    {
      heading: "Lo que recomiendo",
      paragraphs: [
        "Si volviera a prepararme, no empezaría comprando recursos. Professor Messer es gratis y alcanza de sobra para construir la base. Los simulacros pagos ayudan, pero no son imprescindibles.",
        "Tampoco centraría el estudio en memorizar puertos y acrónimos. Me sirvió mucho más practicar, equivocarme y repasar por qué cada respuesta era la correcta. Mi consejo es usar los simulacros para encontrar los puntos débiles, no para acumular respuestas memorizadas.",
      ],
    },
  ],
};
