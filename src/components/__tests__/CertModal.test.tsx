import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { CertModal } from "@/components/CertModal";

describe("CertModal component", () => {
  beforeEach(() => {
    vi.spyOn(window.history, "pushState").mockImplementation(() => {});
    vi.spyOn(window.history, "back").mockImplementation(() => {});
    document.body.style.overflow = "";
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
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

  it("pushes history state on open and calls onClose on popstate (mobile back gesture)", () => {
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();

    render(
      <CertModal
        isOpen={true}
        onClose={onClose}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    expect(pushStateSpy).toHaveBeenCalledWith(
      { modal: "cert", title: "Google Cybersecurity" },
      "",
      window.location.href,
    );

    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(backSpy).not.toHaveBeenCalled();
  });

  it("reverts history when closed via X button", () => {
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();

    render(
      <CertModal
        isOpen={true}
        onClose={onClose}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    const closeBtn = screen.getByRole("button", { name: /Cerrar/i });
    closeBtn.click();

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("reverts history when closed via backdrop click", () => {
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();

    const { baseElement } = render(
      <CertModal
        isOpen={true}
        onClose={onClose}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    const backdrop = baseElement.querySelector(".fixed.inset-0.z-\\[9999\\]") as HTMLElement;
    expect(backdrop).not.toBeNull();
    backdrop.click();

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("reverts history when closed via Escape key", () => {
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();

    render(
      <CertModal
        isOpen={true}
        onClose={onClose}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders tabbed interface for SAL1 with official certificate and technical review tabs", () => {
    render(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/THM-SAL1-Certificate.png"
        title="SAL1 (Security Analyst L1)"
      />,
    );

    // Tab buttons exist
    const certTab = screen.getByRole("button", { name: /\[ CERTIFICADO OFICIAL \]/i });
    const reviewTab = screen.getByRole("button", { name: /\[ REVIEW TÉCNICA DEL EXAMEN \]/i });
    expect(certTab).toBeInTheDocument();
    expect(reviewTab).toBeInTheDocument();

    // Defaults to review tab or allows reading technical breakdown
    expect(screen.getByText("Escenarios Evaluados")).toBeInTheDocument();
    expect(screen.getByText("Security Analyst Fundamentals")).toBeInTheDocument();
    expect(screen.getByText("Fowl Play B1 v2")).toBeInTheDocument();
    expect(screen.getByText("Red Alert: Command and Control B2 V2")).toBeInTheDocument();

    // Check takeaways and scores
    const takeaways = screen.getAllByText("Takeaway:");
    expect(takeaways.length).toBe(3);
    expect(screen.queryByText(/Takeaway defensivo/i)).not.toBeInTheDocument();

    // Check methodology is removed
    expect(screen.queryByText("Metodología Aplicada en la Ventana de 24h")).not.toBeInTheDocument();

    // Check verdict conclusion quote is removed
    expect(
      screen.queryByText(/El SAL1 de TryHackMe es una de las certificaciones más sólidas/i),
    ).not.toBeInTheDocument();

    // Score telemetry
    expect(screen.getByText(/4h 7m 55s/i)).toBeInTheDocument();
    expect(screen.getByText(/Intento #1 \(Primero\)/i)).toBeInTheDocument();
  });

  it("switches tabs between review and official certificate in SAL1 modal", () => {
    render(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/THM-SAL1-Certificate.png"
        title="SAL1 (Security Analyst L1)"
        initialTab="review"
      />,
    );

    const certTab = screen.getByRole("button", { name: /\[ CERTIFICADO OFICIAL \]/i });
    const reviewTab = screen.getByRole("button", { name: /\[ REVIEW TÉCNICA DEL EXAMEN \]/i });

    // Click cert tab
    fireEvent.click(certTab);
    const certImg = screen.getByAltText("SAL1 (Security Analyst L1)");
    expect(certImg).toBeInTheDocument();
    expect(certImg).toHaveAttribute("src", "/certs/THM-SAL1-Certificate.png");

    // Click review tab
    fireEvent.click(reviewTab);
    expect(screen.getByText("Resumen Ejecutivo & Alcance")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Ampliar captura oficial de puntaje/i }),
    ).toBeInTheDocument();
  });

  it("renders evidence image uncropped with object-contain and comfortable height", () => {
    render(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/THM-SAL1-Certificate.png"
        title="SAL1 (Security Analyst L1)"
        initialTab="review"
      />,
    );

    const evidenceImg = screen.getByAltText(
      /Captura oficial de resultados de certificación TryHackMe SAL1/i,
    );
    expect(evidenceImg).toBeInTheDocument();
    expect(evidenceImg.className).toContain("object-contain");
    expect(evidenceImg.className).not.toContain("aspect-[21/9]");
  });

  it("reactively updates active tab when initialTab prop changes dynamically", () => {
    const { rerender } = render(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/THM-SAL1-Certificate.png"
        title="SAL1 (Security Analyst L1)"
        initialTab="cert"
      />,
    );

    expect(screen.getByAltText("SAL1 (Security Analyst L1)")).toBeInTheDocument();

    rerender(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/THM-SAL1-Certificate.png"
        title="SAL1 (Security Analyst L1)"
        initialTab="review"
      />,
    );

    expect(screen.getByText("Resumen Ejecutivo & Alcance")).toBeInTheDocument();
  });
});
