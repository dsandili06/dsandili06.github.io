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

  it("should contain CompTIA Security+ with Q3 2026 goal note", () => {
    const comptia = CERTIFICATIONS.find((c) => c.code === "SY0-701");
    expect(comptia).toBeDefined();
    expect(comptia?.status).toBe("EN PREPARACIÓN");
    expect(comptia?.note).toContain("Q3 de 2026");
  });

  it("should contain CompTIA Security+ with mock exams tracking data", () => {
    const comptia = CERTIFICATIONS.find((c) => c.code === "SY0-701");
    expect(comptia?.mockExams).toBeDefined();
    expect(comptia?.mockExams).toHaveLength(6);

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

    const latest = comptia?.mockExams?.[5];
    expect(latest?.id).toBe("dion-test-6");
    expect(latest?.title).toBe("Simulacro Dion #6");
    expect(latest?.date).toBe("25 Sep 2026");
    expect(latest?.score).toBe(77);
    expect(latest?.correctQuestions).toBe(70);
    expect(latest?.totalQuestions).toBe(90);
    expect(latest?.timeSpent).toBe("58 min");
    expect(latest?.image).toBe("/certs/comptia-prep/dion-test-6.jpg");
    expect(latest?.domains).toHaveLength(5);
    expect(latest?.domains?.[0]).toEqual({ domain: "1.0 General Security Concepts", score: 80 });
    expect(latest?.domains?.[1]).toEqual({
      domain: "2.0 Threats, Vulnerabilities, and Mitigations",
      score: 90,
    });
    expect(latest?.domains?.[2]).toEqual({ domain: "3.0 Security Architecture", score: 75 });
    expect(latest?.domains?.[3]).toEqual({ domain: "4.0 Security Operations", score: 88 });
    expect(latest?.domains?.[4]).toEqual({
      domain: "5.0 Security Program Management and Oversight",
      score: 50,
    });
    expect(latest?.highlightedDomains).toEqual([
      "2.0 Threats, Vulnerabilities, and Mitigations (90%)",
      "4.0 Security Operations (88%)",
    ]);
    expect(latest?.analysis).toContain("Simulacro #6 con 77%");
    expect(latest?.analysis).toContain("Gobernanza y Supervisión (50%)");
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
