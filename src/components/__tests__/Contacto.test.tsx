import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { Contacto } from "@/components/sections/Contacto";

let mockReducedMotion = false;

// Mock motion/react
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => mockReducedMotion,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
    motion: {
      ...actual.motion,
      span: ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
        <span {...props}>{children}</span>
      ),
      div: ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
        <div {...props}>{children}</div>
      ),
    },
    AnimatePresence: ({ children }: { children?: ReactNode }) => <>{children}</>,
  };
});

describe("Contacto", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("renders the section header with number 07 and secure channel kicker", () => {
    render(<Contacto />);
    expect(screen.getByText(/SECTION_07 \/\/ SECURE_CHANNEL/i)).toBeInTheDocument();
  });

  it("should render status card with availability and operational status badge", () => {
    render(<Contacto />);
    expect(screen.getByText("ANALYST STATUS")).toBeInTheDocument();
    expect(screen.getByText("OPERATIONAL")).toBeInTheDocument();
    expect(screen.getByText(/DISPONIBLE PARA OPORTUNIDADES/)).toBeInTheDocument();
  });

  it("should render 3 channel cards with correct links", () => {
    render(<Contacto />);

    const linkedin = screen.getByText("LinkedIn");
    expect(linkedin).toBeInTheDocument();

    const email = screen.getByText("Email");
    expect(email).toBeInTheDocument();

    const github = screen.getByText("GitHub");
    expect(github).toBeInTheDocument();
  });

  it("should render metadata rows", () => {
    render(<Contacto />);
    expect(screen.getByText("UBICACIÓN")).toBeInTheDocument();
    expect(screen.getByText("Tucumán, Argentina")).toBeInTheDocument();
    expect(screen.getByText("MODALIDAD")).toBeInTheDocument();
    expect(screen.getByText("Remoto / Híbrido")).toBeInTheDocument();
    expect(screen.getByText("RESPUESTA")).toBeInTheDocument();
  });

  it("renders channel cards with correct href, target and rel attributes", () => {
    render(<Contacto />);

    const linkedinLink = screen.getByLabelText(/Conectar con Santiago en LinkedIn/i);
    expect(linkedinLink).toHaveAttribute("href", "https://linkedin.com/in/santiagodsandili");
    expect(linkedinLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("rel", "noreferrer noopener");

    const emailLink = screen.getByLabelText(/Enviar correo a sdsandili06@gmail.com/i);
    expect(emailLink).toHaveAttribute("href", "mailto:sdsandili06@gmail.com");
    expect(emailLink).not.toHaveAttribute("target");

    const githubLink = screen.getByLabelText(/Ver perfil y repositorios de Santiago en GitHub/i);
    expect(githubLink).toHaveAttribute("href", "https://github.com/dsandili06");
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noreferrer noopener");
  });

  it("renders channel cards with telemetry codes CH_01, CH_02, CH_03 and uppercase CTAs", () => {
    render(<Contacto />);

    expect(screen.getByText("CH_01")).toBeInTheDocument();
    expect(screen.getByText("CH_02")).toBeInTheDocument();
    expect(screen.getByText("CH_03")).toBeInTheDocument();

    expect(screen.getByText("CONECTAR →")).toBeInTheDocument();
    expect(screen.getByText("ENVIAR EMAIL →")).toBeInTheDocument();
    expect(screen.getByText("VER PERFIL →")).toBeInTheDocument();
  });

  it("renders interactive channel cards with focus-visible, ring-offset and touch-target classes", () => {
    render(<Contacto />);

    const cards = screen.getAllByRole("link");
    expect(cards).toHaveLength(3);

    cards.forEach((card) => {
      expect(card.className).toContain("focus-visible:outline-none");
      expect(card.className).toContain("focus-visible:ring-2");
      expect(card.className).toContain("focus-visible:ring-[var(--accent)]");
      expect(card.className).toContain("focus-visible:ring-offset-[var(--background)]");
      expect(card.className).toContain("overflow-hidden");
      expect(card.className).toContain("min-h-[44px]");
      expect(card.className).toContain("active:scale-[0.99]");
      expect(card.className).toContain("motion-reduce:active:scale-100");
    });
  });

  it("renders tactical metadata rows with consistent right-aligned values", () => {
    render(<Contacto />);

    const locationValue = screen.getByText("Tucumán, Argentina");
    expect(locationValue).toHaveClass("text-right");
    expect(locationValue.className).not.toContain("sm:text-left");

    const modalValue = screen.getByText("Remoto / Híbrido");
    expect(modalValue).toHaveClass("text-right");
    expect(modalValue.className).not.toContain("sm:text-left");

    const responseValue = screen.getByText("< 24 horas");
    expect(responseValue).toHaveClass("text-right");
    expect(responseValue.className).not.toContain("sm:text-left");
  });

  it("respects reduced motion by not rendering motion pulse and applying motion-reduce utility", () => {
    mockReducedMotion = true;
    const { container } = render(<Contacto />);

    const motionSpans = container.querySelectorAll(".bg-\\[var\\(--accent-green\\)\\].size-4");
    expect(motionSpans.length).toBe(0);

    const operationalBadgeDot = container.querySelector(".animate-pulse");
    expect(operationalBadgeDot?.className).toContain("motion-reduce:animate-none");
  });
});
