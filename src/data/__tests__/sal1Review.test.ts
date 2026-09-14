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

  it("contains exactly 3 exam sections with direct scenario names, scores, overview, and takeaway", () => {
    expect(SAL1_REVIEW.sections).toHaveLength(3);

    const [sec1, sec2, sec3] = SAL1_REVIEW.sections;

    // Section 1: Security Analyst Fundamentals
    expect(sec1.id).toBe("fundamentals");
    expect(sec1.name).toBe("Security Analyst Fundamentals");
    expect(sec1.score).toBe(185);
    expect(sec1.maxScore).toBe(200);
    expect(sec1.overview).toBeTruthy();
    expect(sec1.takeaway).toBeTruthy();

    // Section 2: Fowl Play B1 v2
    expect(sec2.id).toBe("fowl-play");
    expect(sec2.name).toBe("Fowl Play B1 v2");
    expect(sec2.score).toBe(371);
    expect(sec2.maxScore).toBe(400);
    expect(sec2.overview).toBeTruthy();
    expect(sec2.takeaway).toBeTruthy();

    // Section 3: Red Alert: Command and Control B2 V2
    expect(sec3.id).toBe("red-alert-c2");
    expect(sec3.name).toBe("Red Alert: Command and Control B2 V2");
    expect(sec3.score).toBe(392);
    expect(sec3.maxScore).toBe(400);
    expect(sec3.overview).toBeTruthy();
    expect(sec3.takeaway).toBeTruthy();

    // Score sum matches total
    expect(sec1.score + sec2.score + sec3.score).toBe(948);
  });

  it("contains analytical verdict with rating, strengths, and considerations without methodology or conclusion quote", () => {
    expect(SAL1_REVIEW.verdict.rating).toBe("9.5 / 10");
    expect(SAL1_REVIEW.verdict.strengths.length).toBeGreaterThan(0);
    expect(SAL1_REVIEW.verdict.considerations.length).toBeGreaterThan(0);
    expect("methodology" in SAL1_REVIEW).toBe(false);
    expect("conclusion" in SAL1_REVIEW.verdict).toBe(false);
  });
});
