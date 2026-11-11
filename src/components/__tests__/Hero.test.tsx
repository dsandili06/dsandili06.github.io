import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";
import { certificateBySrc } from "@/data/certificateCatalog";
import { HERO_CREDENTIALS } from "@/data/heroCredentials";
import { captureModalRequests } from "@/test/modalRequests";

// Mock child components with canvas / complex timers
vi.mock("@/components/fx/TerminalWindow", () => ({
  TerminalWindow: () => <div data-testid="terminal-window" />,
}));

vi.mock("@/components/fx/BootSequence", () => ({
  BootSequence: () => <div data-testid="boot-sequence" />,
}));

vi.mock("@/components/fx/TextScramble", () => ({
  TextScramble: ({ text }: { text: string }) => <span>{text}</span>,
}));

describe("Hero section", () => {
  let capture: ReturnType<typeof captureModalRequests>;
  beforeEach(() => {
    capture = captureModalRequests();
  });
  afterEach(() => {
    capture.stop();
  });

  it("keeps the three primary credentials in order", () => {
    render(<Hero />);

    expect(screen.getByAltText("Insignia Security+")).toHaveAttribute(
      "src",
      "/badges/comptiabadge.png",
    );
    expect(screen.getByAltText("Insignia SAL1")).toHaveAttribute("src", "/badges/sal1badge.png");
    expect(screen.getByAltText("Insignia Google Cybersecurity")).toHaveAttribute(
      "src",
      "/badges/badgegoogle.png",
    );

    const credentials = screen.getByRole("group", { name: "Credenciales principales" });
    const buttons = [...credentials.querySelectorAll("button")];
    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.getAttribute("aria-label"))).toEqual([
      "Ver credencial CompTIA Security+",
      "Ver credencial SAL1",
      "Ver credencial Google Cybersecurity",
    ]);
    expect(credentials.textContent).toMatch(/Security\+.*SAL1.*Google Cybersecurity/s);
    expect(credentials.textContent).not.toMatch(/Ver credencial →|TryHackMe|948|1000/);
  });

  it("links every Hero credential to a known certificate", () => {
    for (const credential of HERO_CREDENTIALS) {
      expect(certificateBySrc(credential.cert)).toBeDefined();
    }
  });

  it.each([
    ["Ver credencial SAL1", "sal1"],
    ["Ver credencial CompTIA Security+", "sy0-701"],
    ["Ver credencial Google Cybersecurity", "google"],
  ])("requests the certificate modal when clicking %s", (name, id) => {
    render(<Hero />);

    fireEvent.click(screen.getByRole("button", { name }));

    expect(capture.requests).toEqual([{ type: "cert", id }]);
  });
});
