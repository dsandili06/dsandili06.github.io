import { describe, it, expect } from "vitest";
import { CERTIFICATIONS } from "@/data/certifications";

describe("CERTIFICATIONS data integrity", () => {
  it("should have 3 certifications", () => {
    expect(CERTIFICATIONS).toHaveLength(3);
  });

  it("should contain Google Cybersecurity", () => {
    const google = CERTIFICATIONS.find((c) => c.title === "Google Cybersecurity");
    expect(google).toBeDefined();
    expect(google?.status).toBe("OBTENIDA");
    expect(google?.href).toBeTruthy();
  });

  it("should contain SAL1 (Security Analyst L1)", () => {
    const sal1 = CERTIFICATIONS.find((c) => c.code === "SAL1");
    expect(sal1).toBeDefined();
    expect(sal1?.title).toBe("SAL1 (Security Analyst L1)");
    expect(sal1?.year).toBe("19/03/2026");
    expect(sal1?.status).toBe("OBTENIDA");
    expect(sal1?.hasReview).toBe(true);
  });

  it("should contain the obtained CompTIA Security+ certificate and validity date", () => {
    const comptia = CERTIFICATIONS.find((c) => c.code === "SY0-701");
    expect(comptia).toBeDefined();
    expect(comptia?.status).toBe("OBTENIDA");
    expect(comptia?.year).toBe("20/10/2026");
    expect(comptia?.note).toContain("Vigente hasta 20/10/2029");
    expect(comptia?.href).toBe("/certs/comptia-security-plus-sy0-701.webp");
  });

  it("should contain CompTIA Security+ with mock exams tracking data", () => {
    const comptia = CERTIFICATIONS.find((c) => c.code === "SY0-701");
    expect(comptia?.mockExams).toBeDefined();
    expect(comptia?.mockExams).toHaveLength(10);

    const exam4 = comptia?.mockExams?.[3];
    expect(exam4?.score).toBe(87);
    expect(exam4?.correctQuestions).toBe(79);
    expect(exam4?.totalQuestions).toBe(90);
    expect(exam4?.image).toBe("/certs/comptia-prep/dion-test-4.jpg");
    expect(exam4?.domains).toHaveLength(5);
    expect(exam4?.analysis).toContain("Puntuación máxima");

    const exam5 = comptia?.mockExams?.[4];
    expect(exam5?.id).toBe("dion-test-5");
    expect(exam5?.score).toBe(80);
    expect(exam5?.correctQuestions).toBe(72);
    expect(exam5?.totalQuestions).toBe(90);
    expect(exam5?.timeSpent).toBe("1h 14m");
    expect(exam5?.image).toBe("/certs/comptia-prep/dion-test-5.jpg");
    expect(exam5?.domains).toHaveLength(5);
    expect(exam5?.highlightedDomains).toBeDefined();
    expect(exam5?.highlightedDomains?.length).toBeGreaterThan(0);
    expect(exam5?.analysis).toContain("Simulacro #5 con 80%");

    const exam6 = comptia?.mockExams?.[5];
    expect(exam6?.id).toBe("dion-test-6");
    expect(exam6?.title).toBe("Simulacro Dion #6");
    expect(exam6?.date).toBe("25 Sep 2026");
    expect(exam6?.score).toBe(77);
    expect(exam6?.correctQuestions).toBe(70);
    expect(exam6?.totalQuestions).toBe(90);
    expect(exam6?.timeSpent).toBe("58 min");
    expect(exam6?.image).toBe("/certs/comptia-prep/dion-test-6.jpg");
    expect(exam6?.domains).toHaveLength(5);
    expect(exam6?.domains?.[4]).toEqual({
      domain: "5.0 Security Program Management and Oversight",
      score: 50,
    });
    expect(exam6?.analysis).toContain("Simulacro #6 con 77%");

    const exam3Retake = comptia?.mockExams?.[7];
    expect(exam3Retake?.id).toBe("dion-test-3-v2");
    expect(exam3Retake?.title).toBe("Simulacro Dion #3 (2da Pasada)");
    expect(exam3Retake?.shortLabel).toBe("Simulacro #3 (2da)");
    expect(exam3Retake?.date).toBe("04 Oct 2026");
    expect(exam3Retake?.score).toBe(90);
    expect(exam3Retake?.correctQuestions).toBe(81);
    expect(exam3Retake?.timeSpent).toBe("51 min");
    expect(exam3Retake?.image).toBe("/certs/comptia-prep/dion-test-3-pass2.png");
    expect(exam3Retake?.domains).toHaveLength(5);

    const exam4Retake = comptia?.mockExams?.[8];
    expect(exam4Retake?.id).toBe("dion-test-4-v2");
    expect(exam4Retake?.title).toBe("Simulacro Dion #4 (2da Pasada)");
    expect(exam4Retake?.shortLabel).toBe("Simulacro #4 (2da)");
    expect(exam4Retake?.date).toBe("05 Oct 2026");
    expect(exam4Retake?.score).toBe(90);
    expect(exam4Retake?.correctQuestions).toBe(81);
    expect(exam4Retake?.timeSpent).toBe("48 min");
    expect(exam4Retake?.image).toBe("/certs/comptia-prep/dion-test-4-pass2.png");
    expect(exam4Retake?.domains).toHaveLength(5);

    const latest = comptia?.mockExams?.[9];
    expect(latest?.id).toBe("dion-test-5-v2");
    expect(latest?.title).toBe("Simulacro Dion #5 (2da Pasada)");
    expect(latest?.shortLabel).toBe("Simulacro #5 (2da)");
    expect(latest?.date).toBe("14 Oct 2026");
    expect(latest?.score).toBe(90);
    expect(latest?.correctQuestions).toBe(81);
    expect(latest?.totalQuestions).toBe(90);
    expect(latest?.timeSpent).toBe("52 min");
    expect(latest?.image).toBe("/certs/comptia-prep/dion-test-5-pass2.png");
    expect(latest?.domains).toHaveLength(5);
    expect(latest?.domains?.[0]).toEqual({ domain: "1.0 General Security Concepts", score: 90 });
    expect(latest?.domains?.[1]).toEqual({
      domain: "2.0 Threats, Vulnerabilities, and Mitigations",
      score: 100,
    });
    expect(latest?.domains?.[2]).toEqual({ domain: "3.0 Security Architecture", score: 81 });
    expect(latest?.domains?.[3]).toEqual({ domain: "4.0 Security Operations", score: 88 });
    expect(latest?.domains?.[4]).toEqual({
      domain: "5.0 Security Program Management and Oversight",
      score: 89,
    });
    expect(latest?.highlightedDomains).toEqual([
      "2.0 Threats, Vulnerabilities, and Mitigations (100%)",
      "1.0 General Security Concepts (90%)",
    ]);
    expect(latest?.analysis).toContain("Segunda pasada");
    expect(latest?.analysis).toContain("90%");
  });

  it("each certification should have required fields", () => {
    for (const c of CERTIFICATIONS) {
      expect(c.code).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.org).toBeTruthy();
      expect(c.year).toBeTruthy();
      expect(["OBTENIDA", "EN PREPARACIÓN"]).toContain(c.status);
    }
  });
});
