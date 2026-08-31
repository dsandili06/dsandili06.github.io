import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import { Contacto } from "@/components/sections/Contacto";

// Mock motion/react
vi.mock("motion/react", () => ({
  motion: {
    span: ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
      <span {...props}>{children}</span>
    ),
    div: ({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children?: ReactNode }) => <>{children}</>,
}));

describe("Contacto", () => {
  it("should render status card with availability", () => {
    render(<Contacto />);
    expect(screen.getByText("ANALYST STATUS")).toBeInTheDocument();
    expect(screen.getByText(/DISPONIBLE PARA OPORTUNIDADES/)).toBeInTheDocument();
  });

  it("should render 3 channel cards with correct links", () => {
    render(<Contacto />);

    const linkedin = screen.getByText("CHANNEL_01 · LinkedIn");
    expect(linkedin).toBeInTheDocument();

    const email = screen.getByText("CHANNEL_02 · Email");
    expect(email).toBeInTheDocument();

    const github = screen.getByText("CHANNEL_03 · GitHub");
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
});
