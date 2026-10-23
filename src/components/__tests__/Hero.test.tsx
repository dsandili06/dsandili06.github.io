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
  }: {
    cert: string;
    title: string;
    isOpen: boolean;
    onClose: () => void;
  }) => (
    <div data-testid="cert-modal" data-open={isOpen}>
      <span data-testid="modal-title">{title}</span>
      <span data-testid="modal-cert">{cert}</span>
      <button data-testid="modal-close" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

describe("Hero section", () => {
  it("renders only the primary Security+ and SAL1 credentials in display order", () => {
    render(<Hero />);

    expect(screen.getByAltText("Insignia Security+")).toHaveAttribute(
      "src",
      "/badges/comptiabadge.png",
    );
    expect(screen.getByAltText("Insignia SAL1")).toHaveAttribute("src", "/badges/sal1badge.png");

    const credentials = screen.getByRole("group", { name: "Credenciales principales" });
    expect(credentials.querySelectorAll("button")).toHaveLength(2);
    expect(credentials.textContent).toMatch(/Security\+.*SAL1/s);
    expect(credentials.textContent).toContain("Ver credencial →");
    expect(credentials.textContent).not.toMatch(/CompTIA|TryHackMe|948|1000/);
    expect(screen.queryByRole("button", { name: /Google Cybersecurity/i })).not.toBeInTheDocument();
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
});
