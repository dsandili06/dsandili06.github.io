import { describe, expect, it } from "vitest";
import { SECURITY_PLUS_REVIEW } from "@/data/securityPlusReview";

describe("Security+ personal review", () => {
  it("records the first-attempt score and the reported preparation experience", () => {
    expect(SECURITY_PLUS_REVIEW.score).toBe(791);
    expect(SECURITY_PLUS_REVIEW.maxScore).toBe(900);
    expect(SECURITY_PLUS_REVIEW.attempt).toBe(1);
    expect(SECURITY_PLUS_REVIEW.duration).toBe("90 min");
    const narrative = SECURITY_PLUS_REVIEW.executiveSummary
      .flatMap((section) => section.paragraphs)
      .join(" ");
    expect(narrative).toMatch(/Professor Messer/);
    expect(narrative).toMatch(/unas 1400 preguntas/i);
    expect(narrative).toMatch(/varias opciones parecían plausibles/i);
    expect(narrative).not.toMatch(/948|1000|24 horas|Puntaje\.png/);
  });
});
