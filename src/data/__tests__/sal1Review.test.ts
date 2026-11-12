import { describe, it, expect } from "vitest";
import { SAL1_REVIEW } from "@/data/sal1Review";

describe("SAL1_REVIEW data integrity", () => {
  it("has valid certification metadata", () => {
    expect(SAL1_REVIEW.certCode).toBe("SAL1");
    expect(SAL1_REVIEW.title).toBe("Security Analyst Level 1 (SAL1)");
    expect(SAL1_REVIEW.org).toBe("TryHackMe");
    expect(SAL1_REVIEW.officialDate).toBe("19/03/2026");
    expect(SAL1_REVIEW.result).toBe("Pass");
    expect(SAL1_REVIEW.attempt).toBe(1);
    expect(SAL1_REVIEW.duration).toBe("4h 7m 55s");
  });

  it("reflects official score matching evidence", () => {
    expect(SAL1_REVIEW.score).toBe(948);
    expect(SAL1_REVIEW.maxScore).toBe(1000);
    expect(SAL1_REVIEW.requiredScore).toBe(750);
    expect(SAL1_REVIEW.score).toBeGreaterThanOrEqual(SAL1_REVIEW.requiredScore);
  });

  it("contains valid evidence and certificate image paths", () => {
    expect(SAL1_REVIEW.evidenceImage).toBe("/Puntaje.png");
    expect(SAL1_REVIEW.certImage).toBe("/certs/THM-SAL1-Certificate.png");
  });

  it("keeps the retained executive summary without removed review sections", () => {
    expect(SAL1_REVIEW.executiveSummary.map(({ heading }) => heading)).toEqual([
      "Formato",
      "Resultado",
      "Cómo trabajé los escenarios",
      "Qué me llevo",
    ]);
    expect(SAL1_REVIEW.executiveSummary.map(({ paragraphs }) => paragraphs.length)).toEqual([
      1, 1, 2, 1,
    ]);
    const narrative = SAL1_REVIEW.executiveSummary.flatMap((s) => s.paragraphs).join(" ");
    expect(narrative).toMatch(/948\/1000/);
    expect(narrative).toMatch(/Fowl Play B1 v2, con 371\/400/);
    expect(narrative).toMatch(/un ticket claro, con evidencia y una recomendación/);
    expect("sections" in SAL1_REVIEW).toBe(false);
    expect("verdict" in SAL1_REVIEW).toBe(false);
  });
});
