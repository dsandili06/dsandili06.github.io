import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { About } from "@/components/sections/About";

describe("About section - Profile Narrative & Tactical Dossier", () => {
  it("renders section header with section number, title and kicker", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: /About Me/i })).toBeInTheDocument();
    expect(screen.getByText(/SECTION_01 \/\/ PROFILE/i)).toBeInTheDocument();
  });

  it("renders the authentic narrative bio paragraphs", () => {
    render(<About />);
    expect(
      screen.getByText(/Mi vínculo con la informática empezó desde la curiosidad/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Me defino por un aprendizaje constante y experimental/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Mi objetivo es aportar serenidad, análisis metódico/i),
    ).toBeInTheDocument();
  });

  it("renders the centered Enfoque operacional titular", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: "Enfoque operacional" })).toBeInTheDocument();
  });

  it("renders all 3 operational tabs without slide numbers", () => {
    render(<About />);
    expect(screen.getByRole("button", { name: /^TRIAGE & RESPUESTA$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^DFIR & FORENSE$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^DETECCIÓN & HUNTING$/i })).toBeInTheDocument();
  });

  it("displays the initial active tab content (TRIAGE & RESPUESTA)", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { name: /Validación de alertas y aislamiento preventivo/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Telemetría de procesos, parentesco anómalo y conexiones de red/i),
    ).toBeInTheDocument();
  });

  it("switches to DFIR & FORENSE tab when clicked", () => {
    render(<About />);
    const dfirBtn = screen.getByRole("button", { name: /^DFIR & FORENSE$/i });
    fireEvent.click(dfirBtn);

    expect(
      screen.getByRole("heading", { name: /Reconstrucción forense de la intrusión/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Volcados de memoria: inyecciones de código y procesos ocultos/i),
    ).toBeInTheDocument();
  });

  it("switches to DETECCIÓN & HUNTING tab when clicked", () => {
    render(<About />);
    const huntingBtn = screen.getByRole("button", { name: /^DETECCIÓN & HUNTING$/i });
    fireEvent.click(huntingBtn);

    expect(
      screen.getByRole("heading", { name: /Búsqueda proactiva y reglas de detección/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Detección de TTPs en fases de ejecución y movimiento lateral/i),
    ).toBeInTheDocument();
  });

  it("does not render removed telemetry or kickers", () => {
    render(<About />);
    expect(screen.queryByText("DOSSIER_01")).not.toBeInTheDocument();
    expect(screen.queryByText("ONLINE")).not.toBeInTheDocument();
    expect(screen.queryByText(/OPERATIONAL FOCUS/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/HOST TELEMETRY/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/RECONSTRUCCIÓN FORENSE/i)).not.toBeInTheDocument();
  });

  it("renders the mission callout and tactical highlight micro-panels", () => {
    const { container } = render(<About />);
    const callout = container.querySelector(".border-l-2");
    expect(callout).toBeInTheDocument();
    expect(callout).toHaveTextContent(/Mi objetivo es aportar serenidad/i);

    const highlights = container.querySelectorAll("ul li");
    expect(highlights.length).toBe(2);
    expect(highlights[0]).toHaveTextContent("›");
  });

  it("minimizes the open tab when clicking on it again", () => {
    render(<About />);
    const triageBtn = screen.getByRole("button", { name: /^TRIAGE & RESPUESTA$/i });
    expect(triageBtn).toHaveAttribute("aria-expanded", "true");

    // Click again to minimize
    fireEvent.click(triageBtn);
    expect(triageBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("minimizes the open tab when clicking outside the accordion", () => {
    render(<About />);
    const triageBtn = screen.getByRole("button", { name: /^TRIAGE & RESPUESTA$/i });
    expect(triageBtn).toHaveAttribute("aria-expanded", "true");

    // Fire pointerdown outside
    fireEvent.pointerDown(document.body);
    expect(triageBtn).toHaveAttribute("aria-expanded", "false");
  });
});
