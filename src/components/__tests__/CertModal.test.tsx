import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CertModal } from "@/components/CertModal";

describe("CertModal component", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renders modal with image, title and responsive close hints", () => {
    render(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    expect(screen.getByText("Google Cybersecurity")).toBeInTheDocument();
    expect(screen.getByText("Tocá fuera para cerrar")).toBeInTheDocument();
    expect(screen.getByText("ESC para cerrar")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Abrir en nueva pestaña/i });
    expect(link).toHaveAttribute("href", "/certs/Google Cybersecurity Certificate.webp");
    expect(link.className).toContain("min-h-[44px]");

    const closeBtn = screen.getByRole("button", { name: /Cerrar/i });
    expect(closeBtn.className).toContain("min-h-[44px]");
    expect(closeBtn.className).toContain("min-w-[44px]");
  });

  it("applies safe-area insets on modal backdrop container", () => {
    const { baseElement } = render(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    const backdrop = baseElement.querySelector(".fixed.inset-0.z-\\[9999\\]");
    expect(backdrop).not.toBeNull();
    expect(backdrop?.className).toContain("pt-[max(1rem,env(safe-area-inset-top))]");
    expect(backdrop?.className).toContain("pb-[max(1rem,env(safe-area-inset-bottom))]");
  });
});
