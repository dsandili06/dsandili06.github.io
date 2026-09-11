import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Certs } from "@/components/sections/Certs";

// Mock CertModal to verify in-page rendering
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

// Mock CompTIAModal to verify in-page tracking modal rendering
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

describe("Certs section", () => {
  it("renders all 3 certifications with date and org", () => {
    render(<Certs />);

    expect(screen.getByText("SAL1 (Security Analyst L1)")).toBeInTheDocument();
    expect(screen.getByText("Google Cybersecurity")).toBeInTheDocument();
    expect(screen.getByText("CompTIA Security+")).toBeInTheDocument();

    expect(screen.getByText("19/03/2026 · TryHackMe")).toBeInTheDocument();
    expect(screen.getByText("15/08/2026 · Google")).toBeInTheDocument();
    expect(screen.getByText("2026 · CompTIA")).toBeInTheDocument();
  });

  it("renders badge logo images next to certification titles", () => {
    render(<Certs />);

    const sal1Img = screen.getByAltText("Badge SAL1 (Security Analyst L1)");
    expect(sal1Img).toHaveAttribute("src", "/badges/sal1badge.png");

    const googleImg = screen.getByAltText("Badge Google Cybersecurity");
    expect(googleImg).toHaveAttribute("src", "/badges/badgegoogle.png");

    const comptiaImg = screen.getByAltText("Badge CompTIA Security+");
    expect(comptiaImg).toHaveAttribute("src", "/badges/comptiabadge.png");
  });

  it("opens in-page CertModal on click without redirecting", () => {
    render(<Certs />);

    // Click Google Cybersecurity card
    const googleBtn = screen.getByRole("button", { name: /Google Cybersecurity/i });
    fireEvent.click(googleBtn);

    expect(screen.getByTestId("cert-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Google Cybersecurity");
    expect(screen.getByTestId("modal-cert")).toHaveTextContent(
      "/certs/Google Cybersecurity Certificate.webp",
    );

    // Close modal
    fireEvent.click(screen.getByTestId("modal-close"));
  });

  it("opens in-page CertModal for SAL1 PNG on click", () => {
    render(<Certs />);

    const sal1Btn = screen.getByRole("button", { name: /SAL1 \(Security Analyst L1\)/i });
    fireEvent.click(sal1Btn);

    expect(screen.getByTestId("cert-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("SAL1 (Security Analyst L1)");
    expect(screen.getByTestId("modal-cert")).toHaveTextContent("/certs/THM-SAL1-Certificate.png");
  });

  it("renders latest mock exam score and tracking CTA on CompTIA Security+ card", () => {
    render(<Certs />);

    expect(screen.getByText("ÚLTIMO SCORE")).toBeInTheDocument();
    expect(screen.getByText("87%")).toBeInTheDocument();
    expect(screen.getByText("VER SEGUIMIENTO DE SIMULACROS →")).toBeInTheDocument();
  });

  it("opens in-page CompTIAModal on click of CompTIA Security+ card", () => {
    render(<Certs />);

    const comptiaBtn = screen.getByRole("button", { name: /CompTIA Security\+/i });
    fireEvent.click(comptiaBtn);

    expect(screen.getByTestId("comptia-modal")).toBeInTheDocument();
    expect(screen.getByTestId("comptia-modal-title")).toHaveTextContent("CompTIA Security+");

    // Close modal
    fireEvent.click(screen.getByTestId("comptia-modal-close"));
  });
});
