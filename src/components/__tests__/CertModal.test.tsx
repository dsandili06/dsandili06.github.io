import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { CertModal } from "@/components/CertModal";
import { SAL1_REVIEW } from "@/data/sal1Review";
import { SECURITY_PLUS_REVIEW } from "@/data/securityPlusReview";

const securityPlusParagraphs = SECURITY_PLUS_REVIEW.executiveSummary.flatMap((item) =>
  typeof item === "string" ? [item] : item.paragraphs,
);

describe("CertModal component", () => {
  beforeEach(() => {
    vi.spyOn(window.history, "pushState").mockImplementation(() => {});
    vi.spyOn(window.history, "back").mockImplementation(() => {});
    document.body.style.overflow = "";
  });

  afterEach(() => {
    cleanup();
    window.dispatchEvent(new PopStateEvent("popstate"));
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

  it("shows Security+ personal review by default with its score and no SAL1 evidence", () => {
    render(
      <CertModal
        isOpen
        onClose={vi.fn()}
        cert="/certs/comptia-security-plus-sy0-701.webp"
        title="CompTIA Security+"
      />,
    );
    expect(screen.getByRole("tab", { name: /REVIEW TÉCNICA/i })).toBeInTheDocument();
    expect(screen.getByText("791")).toBeInTheDocument();
    expect(screen.getByText("/ 900")).toBeInTheDocument();
    expect(screen.getAllByText(/Professor Messer/)).toHaveLength(2);
    expect(screen.getByText(/unas 1400 preguntas/i)).toBeInTheDocument();
    expect(screen.queryByText(/948/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ventana máx: 24 horas/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Evidencia Oficial de Resultados/)).not.toBeInTheDocument();
  });

  it("renders Security+ review as its complete ordered paragraphs without section headings", () => {
    render(
      <CertModal
        isOpen
        onClose={vi.fn()}
        cert="/certs/comptia-security-plus-sy0-701.webp"
        title="CompTIA Security+"
      />,
    );

    const narrative = document.body.querySelector('[role="tabpanel"]');
    expect(narrative).not.toBeNull();
    expect(
      Array.from(narrative!.querySelectorAll("p"), (paragraph) => paragraph.textContent),
    ).toEqual(securityPlusParagraphs);
    expect(narrative!.querySelector("h3, h4")).toBeNull();
    expect(narrative!.textContent).not.toContain("Resumen Ejecutivo & Alcance");
    expect(narrative!.textContent).not.toMatch(
      /Preparación|El examen|Lo que recomiendo|Lo que me llevé/,
    );
  });

  it("respects certificate tab and falls back to certificate for unsupported review", () => {
    const { rerender } = render(
      <CertModal
        isOpen
        onClose={vi.fn()}
        cert="/certs/comptia-security-plus-sy0-701.webp"
        title="CompTIA Security+"
        initialTab="cert"
      />,
    );
    expect(screen.getByAltText("CompTIA Security+")).toBeInTheDocument();
    rerender(
      <CertModal
        isOpen
        onClose={vi.fn()}
        cert="/certs/google.webp"
        title="Google Cybersecurity"
        initialTab="review"
      />,
    );
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByAltText("Google Cybersecurity")).toBeInTheDocument();
    expect(screen.queryByText(/Professor Messer/)).not.toBeInTheDocument();
  });

  it("does not infer a review from course titles or similar SAL1 titles", () => {
    const { rerender } = render(
      <CertModal
        isOpen
        onClose={vi.fn()}
        cert="/certs/CertificateOfCompletion_CompTIA Security SY0701 Cert Prep by Infosec.webp"
        title="CompTIA Security+ (SY0-701) Cert Prep"
        initialTab="cert"
      />,
    );
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByAltText("CompTIA Security+ (SY0-701) Cert Prep")).toBeInTheDocument();

    rerender(
      <CertModal
        isOpen
        onClose={vi.fn()}
        cert="/certs/other-certificate.png"
        title="SAL1 Training"
        initialTab="review"
      />,
    );
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
    expect(screen.getByAltText("SAL1 Training")).toBeInTheDocument();
  });

  it("restores focus inside the new credential after the real lightbox exit", async () => {
    const { rerender } = render(
      <CertModal isOpen onClose={vi.fn()} cert="/certs/THM-SAL1-Certificate.png" title="SAL1" />,
    );
    const evidenceButton = screen.getByRole("button", {
      name: /Ampliar captura oficial de puntaje/i,
    });
    evidenceButton.focus();
    fireEvent.keyDown(evidenceButton, { key: "Enter" });
    // jsdom does not synthesize native button activation from Enter keydown.
    fireEvent.click(evidenceButton);
    await waitFor(() => expect(document.querySelector(".yarl__portal")).toBeInTheDocument());

    rerender(
      <CertModal
        isOpen
        onClose={vi.fn()}
        cert="/certs/comptia-security-plus-sy0-701.webp"
        title="CompTIA Security+"
      />,
    );

    await waitFor(() => expect(document.querySelector(".yarl__portal")).not.toBeInTheDocument());
    expect(
      screen.queryByAltText(/Captura oficial de resultados de certificación TryHackMe SAL1/i),
    ).not.toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: /REVIEW TÉCNICA/i }));
    expect(document.activeElement).not.toBe(document.body);
  });

  it("does not restore focus into the dialog after it has closed", async () => {
    const outsideButton = document.createElement("button");
    document.body.append(outsideButton);
    try {
      outsideButton.focus();
      const onExitComplete = vi.fn();
      const { rerender } = render(
        <CertModal
          isOpen
          onClose={vi.fn()}
          onExitComplete={onExitComplete}
          cert="/certs/THM-SAL1-Certificate.png"
          title="SAL1"
        />,
      );
      const evidenceButton = screen.getByRole("button", {
        name: /Ampliar captura oficial de puntaje/i,
      });
      evidenceButton.focus();
      fireEvent.keyDown(evidenceButton, { key: "Enter" });
      fireEvent.click(evidenceButton);
      await waitFor(() => expect(document.querySelector(".yarl__portal")).toBeInTheDocument());

      rerender(
        <CertModal
          isOpen={false}
          onClose={vi.fn()}
          onExitComplete={onExitComplete}
          cert="/certs/comptia-security-plus-sy0-701.webp"
          title="CompTIA Security+"
        />,
      );

      await waitFor(() => expect(onExitComplete).toHaveBeenCalledOnce());
      await waitFor(() => expect(document.querySelector(".yarl__portal")).not.toBeInTheDocument());
      expect(document.activeElement).toBe(outsideButton);
    } finally {
      outsideButton.remove();
    }
  });

  it("recognizes SAL1 short title and resets the lightbox when credential changes", async () => {
    const { rerender } = render(
      <CertModal isOpen onClose={vi.fn()} cert="/certs/THM-SAL1-Certificate.png" title="SAL1" />,
    );
    expect(screen.getByText(SAL1_REVIEW.executiveSummary[0])).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Ampliar captura oficial de puntaje/i }));
    rerender(
      <CertModal
        isOpen
        onClose={vi.fn()}
        cert="/certs/comptia-security-plus-sy0-701.webp"
        title="CompTIA Security+"
      />,
    );
    await waitFor(() => expect(document.querySelector(".yarl__portal")).not.toBeInTheDocument());
    expect(screen.getAllByText(/Professor Messer/)).toHaveLength(2);
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
    const tablist = screen.getByRole("tablist", {
      name: /Vistas del expediente de certificación/i,
    });
    expect(tablist).toBeInTheDocument();

    const certTab = screen.getByRole("tab", { name: /\[ CERTIFICADO OFICIAL \]/i });
    const reviewTab = screen.getByRole("tab", { name: /\[ REVIEW TÉCNICA DEL EXAMEN \]/i });
    expect(certTab).toBeInTheDocument();
    expect(reviewTab).toBeInTheDocument();

    expect(screen.queryByText("Escenarios Evaluados")).not.toBeInTheDocument();
    expect(screen.queryByText("Veredicto del Analista & Recomendaciones")).not.toBeInTheDocument();
    expect(screen.queryByText("9.5 / 10")).not.toBeInTheDocument();
    const narrative = document.body.querySelector('[role="tabpanel"]');
    expect(narrative).not.toBeNull();
    expect(
      Array.from(narrative!.querySelectorAll("p"), (paragraph) => paragraph.textContent),
    ).toEqual(SAL1_REVIEW.executiveSummary);
    expect(narrative!.querySelector("h3, h4")).toBeNull();
    expect(narrative!.textContent).not.toContain("Resumen Ejecutivo & Alcance");
    expect(
      screen.getByRole("button", { name: /Ampliar captura oficial de puntaje/i }),
    ).toBeInTheDocument();

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

    const certTab = screen.getByRole("tab", { name: /\[ CERTIFICADO OFICIAL \]/i });
    const reviewTab = screen.getByRole("tab", { name: /\[ REVIEW TÉCNICA DEL EXAMEN \]/i });

    // Click cert tab
    fireEvent.click(certTab);
    const certImg = screen.getByAltText("SAL1 (Security Analyst L1)");
    expect(certImg).toBeInTheDocument();
    expect(certImg).toHaveAttribute("src", "/certs/THM-SAL1-Certificate.png");

    // Click review tab
    fireEvent.click(reviewTab);
    expect(screen.getByText(SAL1_REVIEW.executiveSummary[0])).toBeInTheDocument();
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

    expect(screen.getByText(SAL1_REVIEW.executiveSummary[0])).toBeInTheDocument();
  });

  it("does not show removed scenario progress bars", () => {
    render(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/THM-SAL1-Certificate.png"
        title="SAL1 (Security Analyst L1)"
        initialTab="review"
      />,
    );

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("renders tabs with WAI-ARIA tablist, tab roles, aria-selected, roving tabindex and keyboard navigation", () => {
    render(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/THM-SAL1-Certificate.png"
        title="SAL1 (Security Analyst L1)"
        initialTab="review"
      />,
    );

    const tablist = screen.getByRole("tablist", {
      name: /Vistas del expediente de certificación/i,
    });
    expect(tablist).toBeInTheDocument();

    const reviewTab = screen.getByRole("tab", { name: /\[ REVIEW TÉCNICA DEL EXAMEN \]/i });
    const certTab = screen.getByRole("tab", { name: /\[ CERTIFICADO OFICIAL \]/i });

    expect(reviewTab).toHaveAttribute("aria-selected", "true");
    expect(reviewTab).toHaveAttribute("tabindex", "0");
    expect(certTab).toHaveAttribute("aria-selected", "false");
    expect(certTab).toHaveAttribute("tabindex", "-1");
    expect(reviewTab.className).toContain("focus-visible:ring-1");

    // Test Arrow key navigation
    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(certTab).toHaveAttribute("aria-selected", "true");
    expect(reviewTab).toHaveAttribute("aria-selected", "false");
  });

  it("renders tabpanel with accessible labelling and scrollability attributes", () => {
    render(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/THM-SAL1-Certificate.png"
        title="SAL1 (Security Analyst L1)"
        initialTab="review"
      />,
    );

    const panel = screen.getByRole("tabpanel", { name: /\[ REVIEW TÉCNICA DEL EXAMEN \]/i });
    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute("data-lenis-prevent");
    expect(panel).toHaveAttribute("tabindex", "0");
  });
});
