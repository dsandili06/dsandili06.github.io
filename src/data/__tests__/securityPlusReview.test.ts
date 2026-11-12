import { describe, expect, it } from "vitest";
import { SECURITY_PLUS_REVIEW } from "@/data/securityPlusReview";

describe("Security+ personal review", () => {
  it("records the first-attempt score and the reported preparation experience", () => {
    expect(SECURITY_PLUS_REVIEW.score).toBe(791);
    expect(SECURITY_PLUS_REVIEW.maxScore).toBe(900);
    expect(SECURITY_PLUS_REVIEW.attempt).toBe(1);
    expect(SECURITY_PLUS_REVIEW.result).toBe("Pass");
    expect(SECURITY_PLUS_REVIEW.duration).toBe("90 min");
    expect(SECURITY_PLUS_REVIEW.evidenceImage).toBeNull();
    expect(SECURITY_PLUS_REVIEW.executiveSummary.map(({ heading }) => heading)).toEqual([
      "Preparación",
      "El examen",
      "Lo que recomiendo",
    ]);
    expect(
      SECURITY_PLUS_REVIEW.executiveSummary.map(({ paragraphs }) => paragraphs.length),
    ).toEqual([2, 1, 2]);
    const narrative = SECURITY_PLUS_REVIEW.executiveSummary
      .flatMap((section) => section.paragraphs)
      .join(" ");
    expect(narrative).toMatch(/Professor Messer/);
    expect(narrative).toMatch(/LinkedIn Learning/);
    expect(narrative).toMatch(/unas 1\.400 preguntas de práctica/);
    expect(narrative).toMatch(/dos o más respuestas parecían correctas/);
    expect(narrative).toMatch(/Las PBQ \(preguntas prácticas\)/);
    expect(narrative).toMatch(/no para acumular respuestas memorizadas/);
    expect(narrative).not.toMatch(/948|24 horas|Puntaje\.png/);
  });
});
