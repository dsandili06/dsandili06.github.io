import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { About } from "@/components/sections/About";

describe("About section - Profile Narrative & Tactical Dossier", () => {
  it("renders section header with section number, title and kicker", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: /About Me/i })).toBeInTheDocument();
    expect(screen.getByText(/SECTION_01 \/\/ PROFILE/i)).toBeInTheDocument();
  });

  it("renders the four authorized narrative paragraphs in order", () => {
    const { container } = render(<About />);
    const narrative = Array.from(container.querySelectorAll("div")).find((element) =>
      element.className.includes("max-w-[58ch]"),
    );
    expect(narrative).toBeDefined();

    const normalizeWhitespace = (text: string) => text.replace(/\s+/g, " ").trim();
    const paragraphs = Array.from(narrative!.querySelectorAll("p"));
    expect(paragraphs.map((paragraph) => normalizeWhitespace(paragraph.textContent ?? ""))).toEqual(
      [
        "Mi interés por la informática nació de una curiosidad simple: entender qué sucede detrás de cada sistema, cómo funciona y qué ocurre cuando algo deja de comportarse como debería. Con el tiempo, esa curiosidad encontró su lugar en la ciberseguridad defensiva, especialmente en el Blue Team y las operaciones de seguridad (SOC).",
        "Disfruto el proceso de investigar, conectar evidencias y comprender el comportamiento de una amenaza más allá de una alerta. Mi formación combina el estudio constante con la práctica en laboratorios, donde analizo eventos de seguridad, investigo incidentes simulados, examino artefactos forenses y busco entender no solo qué ocurrió, sino también cómo y por qué.",
        "Creo que un buen analista no se define únicamente por las herramientas que domina, sino por su capacidad de hacer las preguntas correctas, prestar atención a los detalles y mantener el criterio incluso frente a la incertidumbre.",
        "Hoy busco dar el siguiente paso hacia mi primera experiencia profesional en un SOC, aportando curiosidad, pensamiento analítico y una mentalidad de mejora continua. Porque, para mí, la ciberseguridad no consiste solamente en detectar amenazas, sino en comprenderlas para construir mejores defensas.",
      ],
    );
    expect(paragraphs).toHaveLength(4);
    expect(narrative!.querySelector(".border-l-2 p")).toBe(paragraphs[3]);
    expect(narrative).not.toHaveTextContent(/Mi vínculo con la informática/i);
    expect(narrative).not.toHaveTextContent(/Me defino por un aprendizaje constante/i);
    expect(narrative).not.toHaveTextContent(/Mi objetivo es aportar serenidad/i);
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

  it("renders the fourth paragraph in the mission callout and tactical highlight micro-panels", () => {
    const { container } = render(<About />);
    const callout = container.querySelector(".border-l-2");
    expect(callout).toBeInTheDocument();
    expect(callout).toHaveTextContent(
      "Hoy busco dar el siguiente paso hacia mi primera experiencia profesional en un SOC, aportando curiosidad, pensamiento analítico y una mentalidad de mejora continua. Porque, para mí, la ciberseguridad no consiste solamente en detectar amenazas, sino en comprenderlas para construir mejores defensas.",
    );
    expect(callout).not.toHaveTextContent(/Mi objetivo es aportar serenidad/i);

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
