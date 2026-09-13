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
  CertModal: ({ cert, title, onClose }: { cert: string; title: string; onClose: () => void }) => (
    <div data-testid="cert-modal">
      <span data-testid="modal-title">{title}</span>
      <span data-testid="modal-cert">{cert}</span>
      <button data-testid="modal-close" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

vi.mock("@/components/CompTIAModal", () => ({
  CompTIAModal: ({
    certification,
    onClose,
  }: {
    certification: { title: string };
    onClose: () => void;
  }) => (
    <div data-testid="comptia-modal">
      <span data-testid="comptia-modal-title">{certification.title}</span>
      <button data-testid="comptia-modal-close" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

describe("Hero section", () => {
  it("renders verified credentials badges dock with obtained certs and CompTIA in-progress", () => {
    render(<Hero />);

    expect(screen.getByText("VERIFIED_CREDENTIALS")).toBeInTheDocument();

    expect(screen.getByAltText("Badge SAL1 (Security Analyst L1)")).toHaveAttribute(
      "src",
      "/badges/sal1badge.png",
    );
    expect(screen.getByAltText("Badge Google Cybersecurity")).toHaveAttribute(
      "src",
      "/badges/badgegoogle.png",
    );
    expect(screen.getByAltText("Badge CompTIA Security+")).toHaveAttribute(
      "src",
      "/badges/comptiabadge.png",
    );
    expect(screen.getByText("EN PREPARACIÓN")).toBeInTheDocument();
    expect(
      screen.getByAltText("Badge Fundamentos en Blue Team: Ciberinteligencia, Forense y Respuesta"),
    ).toHaveAttribute("src", "/badges/ciber.png");
    expect(screen.getByAltText("Badge NSE 1 Network Security Associate")).toHaveAttribute(
      "src",
      "/badges/fortinet-nse-1-certified-in-cybersecurity.png",
    );
    expect(screen.getByAltText("Badge NSE 2 Network Security Associate")).toHaveAttribute(
      "src",
      "/badges/fortinet-nse-2-certified-in-cybersecurity.1.png",
    );
  });

  it("opens in-page CertModal when clicking an obtained credential badge in the Hero", () => {
    render(<Hero />);

    const googleBtn = screen.getByRole("button", {
      name: /Ver credencial Google Cybersecurity/i,
    });
    fireEvent.click(googleBtn);

    expect(screen.getByTestId("cert-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Google Cybersecurity");
    expect(screen.getByTestId("modal-cert")).toHaveTextContent(
      "/certs/Google Cybersecurity Certificate.webp",
    );

    // Close modal
    fireEvent.click(screen.getByTestId("modal-close"));
  });

  it("opens in-page CompTIAModal when clicking the CompTIA credential badge in the Hero", () => {
    render(<Hero />);

    const comptiaBtn = screen.getByRole("button", {
      name: /Ver seguimiento de preparación CompTIA Security\+/i,
    });
    fireEvent.click(comptiaBtn);

    expect(screen.getByTestId("comptia-modal")).toBeInTheDocument();
    expect(screen.getByTestId("comptia-modal-title")).toHaveTextContent("CompTIA Security+");

    // Close modal
    fireEvent.click(screen.getByTestId("comptia-modal-close"));
  });
});
