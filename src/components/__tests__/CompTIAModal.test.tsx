import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { CompTIAModal } from "@/components/CompTIAModal";
import { CERTIFICATIONS } from "@/data/certifications";

const comptiaCert = CERTIFICATIONS.find((c) => c.code === "SY0-701")!;

describe("CompTIAModal component", () => {
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

  it("renders modal header, title, and benchmark metrics", () => {
    render(<CompTIAModal isOpen={true} onClose={vi.fn()} certification={comptiaCert} />);

    expect(screen.getByText("Seguimiento CompTIA Security+")).toBeInTheDocument();
    expect(screen.getByText(/SIMULACROS JASON DION/i)).toBeInTheDocument();
    expect(screen.getByText(/Objetivo CompTIA Superado/i)).toBeInTheDocument();
    expect(screen.getByText(/67% → 87%/i)).toBeInTheDocument();
  });

  it("renders all 4 mock exams in timeline selector and selects the latest by default", () => {
    render(<CompTIAModal isOpen={true} onClose={vi.fn()} certification={comptiaCert} />);

    expect(screen.getByText("Simulacro #1")).toBeInTheDocument();
    expect(screen.getByText("Simulacro #2")).toBeInTheDocument();
    expect(screen.getByText("Simulacro #3")).toBeInTheDocument();
    expect(screen.getByText("Simulacro #4")).toBeInTheDocument();

    // Latest exam header is shown in domain breakdown
    expect(screen.getByText(/Simulacro Dion #4/i)).toBeInTheDocument();
    expect(screen.getByText("79 de 90 aciertos")).toBeInTheDocument();
  });

  it("renders the scrollable body with data-lenis-prevent for Lenis compatibility", () => {
    render(<CompTIAModal isOpen={true} onClose={vi.fn()} certification={comptiaCert} />);

    const scrollContainer = document.querySelector("[data-lenis-prevent]");
    expect(scrollContainer).toBeInTheDocument();
  });

  it("switches displayed exam details and dynamic technical analysis when another mock is clicked", () => {
    render(<CompTIAModal isOpen={true} onClose={vi.fn()} certification={comptiaCert} />);

    // Initially selects latest exam (Simulacro #4)
    expect(screen.getByText(/Simulacro Dion #4/i)).toBeInTheDocument();
    expect(screen.getByText(/Puntuación máxima del ciclo/i)).toBeInTheDocument();

    const exam1Btn = screen.getByText("Simulacro #1").closest("button");
    expect(exam1Btn).not.toBeNull();
    fireEvent.click(exam1Btn!);

    expect(screen.getByText(/Simulacro Dion #1/i)).toBeInTheDocument();
    expect(screen.getByText("61 de 90 aciertos")).toBeInTheDocument();
    expect(screen.getByText("44 min")).toBeInTheDocument();
    // Dynamic technical analysis changes to reflect exam #1
    expect(screen.getByText(/Línea base inicial/i)).toBeInTheDocument();
  });

  it("renders domain breakdown scores correctly", () => {
    render(<CompTIAModal isOpen={true} onClose={vi.fn()} certification={comptiaCert} />);

    expect(screen.getByText("1.0 General Security Concepts")).toBeInTheDocument();
    expect(screen.getByText("2.0 Threats, Vulnerabilities, and Mitigations")).toBeInTheDocument();
    expect(screen.getByText("3.0 Security Architecture")).toBeInTheDocument();
    expect(screen.getByText("4.0 Security Operations")).toBeInTheDocument();
    expect(screen.getByText("5.0 Security Program Management and Oversight")).toBeInTheDocument();
  });

  it("renders accessible screenshot preview button", () => {
    render(<CompTIAModal isOpen={true} onClose={vi.fn()} certification={comptiaCert} />);

    const previewBtn = screen.getByRole("button", {
      name: /Ampliar captura de Simulacro Dion #4/i,
    });
    expect(previewBtn).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<CompTIAModal isOpen={true} onClose={onClose} certification={comptiaCert} />);

    const closeBtn = screen.getByRole("button", { name: /Cerrar modal/i });
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<CompTIAModal isOpen={true} onClose={onClose} certification={comptiaCert} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("pushes history state on open and calls onClose on popstate", () => {
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const onClose = vi.fn();

    render(<CompTIAModal isOpen={true} onClose={onClose} certification={comptiaCert} />);

    expect(pushStateSpy).toHaveBeenCalledWith(
      { modal: "comptia-prep", title: "CompTIA Security+" },
      "",
      window.location.href,
    );

    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
