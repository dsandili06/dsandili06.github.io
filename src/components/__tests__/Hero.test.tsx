import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";

// Mock child components with canvas / complex timers
vi.mock("@/components/fx/HeroShader", () => ({
  HeroShader: () => <div data-testid="hero-shader" />,
}));

vi.mock("@/components/fx/TerminalWindow", () => ({
  TerminalWindow: () => <div data-testid="terminal-window" />,
}));

vi.mock("@/components/fx/BootSequence", () => ({
  BootSequence: () => <div data-testid="boot-sequence" />,
}));

vi.mock("@/components/fx/TextScramble", () => ({
  TextScramble: ({ text }: { text: string }) => <span>{text}</span>,
}));

vi.mock("@/components/CertModal", () => ({
  CertModal: ({
    cert,
    title,
    isOpen,
    onClose,
    onExitComplete,
  }: {
    cert: string;
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onExitComplete: () => void;
  }) => (
    <div data-testid="cert-modal" data-open={isOpen}>
      <span data-testid="modal-title">{title}</span>
      <span data-testid="modal-cert">{cert}</span>
      <button data-testid="modal-close" onClick={onClose}>
        Close
      </button>
      <button data-testid="modal-exit-complete" onClick={onExitComplete}>
        Exit complete
      </button>
    </div>
  ),
}));

describe("Hero section", () => {
  it("renders without mounting the removed shader and keeps the three primary credentials in order", () => {
    render(<Hero />);

    expect(screen.queryByTestId("hero-shader")).not.toBeInTheDocument();

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

  it("opens the SAL1 certificate when clicking its Hero credential", () => {
    render(<Hero />);

    const sal1Btn = screen.getByRole("button", {
      name: /Ver credencial SAL1/i,
    });
    fireEvent.click(sal1Btn);

    expect(screen.getByTestId("cert-modal")).toBeInTheDocument();
    expect(screen.getByTestId("cert-modal")).toHaveAttribute("data-open", "true");
    expect(screen.getByTestId("modal-title")).toHaveTextContent("SAL1");
    expect(screen.getByTestId("modal-cert")).toHaveTextContent("/certs/THM-SAL1-Certificate.png");

    // Close modal
    fireEvent.click(screen.getByTestId("modal-close"));
    expect(screen.getByTestId("cert-modal")).toHaveAttribute("data-open", "false");
  });

  it("opens the official CompTIA certificate when clicking its Hero badge", () => {
    render(<Hero />);

    const comptiaBtn = screen.getByRole("button", {
      name: "Ver credencial CompTIA Security+",
    });
    fireEvent.click(comptiaBtn);

    expect(screen.getByTestId("cert-modal")).toBeInTheDocument();
    expect(screen.getByTestId("cert-modal")).toHaveAttribute("data-open", "true");
    expect(screen.getByTestId("modal-title")).toHaveTextContent("CompTIA Security+");
    expect(screen.getByTestId("modal-cert")).toHaveTextContent(
      "/certs/comptia-security-plus-sy0-701.webp",
    );

    // Close modal
    fireEvent.click(screen.getByTestId("modal-close"));
    expect(screen.getByTestId("cert-modal")).toHaveAttribute("data-open", "false");
  });

  it("opens and closes the Google certificate while preserving exit completion", () => {
    render(<Hero />);

    fireEvent.click(screen.getByRole("button", { name: "Ver credencial Google Cybersecurity" }));
    expect(screen.getByTestId("cert-modal")).toHaveAttribute("data-open", "true");
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Google Cybersecurity");
    expect(screen.getByTestId("modal-cert")).toHaveTextContent(
      "/certs/Google Cybersecurity Certificate.webp",
    );

    fireEvent.click(screen.getByTestId("modal-close"));
    expect(screen.getByTestId("cert-modal")).toHaveAttribute("data-open", "false");
    fireEvent.click(screen.getByTestId("modal-exit-complete"));
    expect(screen.queryByTestId("cert-modal")).not.toBeInTheDocument();
  });
});
