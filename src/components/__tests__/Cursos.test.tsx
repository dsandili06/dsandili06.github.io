import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Cursos } from "@/components/sections/Cursos";

// Mock CertModal
vi.mock("@/components/CertModal", () => ({
  CertModal: ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div data-testid="cert-modal">
      <span>{title}</span>
      <button data-testid="modal-close" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

// Mock lucide icons
vi.mock("lucide-react", () => ({
  ChevronDown: ({ className }: { className?: string }) => (
    <span data-testid="chevron-down" className={className} />
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <span data-testid="chevron-right" className={className} />
  ),
}));

describe("Cursos", () => {
  it("should render total count and institution count", () => {
    render(<Cursos />);
    expect(screen.getByText(/TOTAL/)).toBeInTheDocument();
    expect(screen.getByText(/INSTITUCIONES/)).toBeInTheDocument();
  });

  it("should render accordion groups", () => {
    render(<Cursos />);
    // At least one institution should be visible (use getAllByText since "Google" appears in org buttons + course rows)
    const googleBtns = screen.getAllByText("Google");
    expect(googleBtns.length).toBeGreaterThanOrEqual(1);
  });

  it("should expand group on click", () => {
    render(<Cursos />);

    // Use getAllByText and pick the first "Google" button
    const googleBtns = screen.getAllByText("Google");
    expect(googleBtns.length).toBeGreaterThanOrEqual(1);
    const googleBtn = googleBtns[0];
    fireEvent.click(googleBtn);

    // After clicking, courses should be visible (e.g. Foundations of Cybersecurity)
    const foundations = screen.getByText("Foundations of Cybersecurity");
    expect(foundations).toBeInTheDocument();
  });
});
