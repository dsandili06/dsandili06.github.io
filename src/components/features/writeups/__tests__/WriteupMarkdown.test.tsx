import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WriteupMarkdown } from "@/components/features/writeups/WriteupMarkdown";

const HREF =
  "https://github.com/dsandili06/Artifakt-Labs/blob/main/Writeups/CyberDefenders/FakeGPT.md";

describe("WriteupMarkdown", () => {
  it("strips a leading emoji from heading text but keeps the heading id", () => {
    render(
      <WriteupMarkdown
        markdown={"## \u{1F50D} Análisis inicial\n\nCuerpo \u{1F50D} intacto"}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(/^Análisis inicial$/);
    expect(heading).toHaveAttribute("id", "writeup-content--análisis-inicial");
    expect(screen.getByText("Cuerpo \u{1F50D} intacto")).toBeInTheDocument();
  });

  it("visually hides only a leading H1 that duplicates the modal title", () => {
    const { unmount } = render(
      <WriteupMarkdown
        markdown={["# FakeGPT Lab WriteUp", "", "Intro", "", "# Otro titulo"].join("\n")}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    const [first, second] = screen.getAllByRole("heading", { level: 1 });
    expect(first).toHaveClass("sr-only");
    expect(first).toHaveAttribute("id", "writeup-content-fakegpt-lab-writeup");
    expect(second).not.toHaveClass("sr-only");
    unmount();

    render(
      <WriteupMarkdown
        markdown={["Intro primero", "", "# Titulo tardio"].join("\n")}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );
    expect(screen.getByRole("heading", { level: 1 })).not.toHaveClass("sr-only");
  });

  it("renders an accessible copy action for fenced code blocks", () => {
    render(
      <WriteupMarkdown
        markdown={"```bash\nwhoami\n```"}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Copiar comando" })).toBeInTheDocument();
    expect(screen.getByText("whoami")).toBeInTheDocument();
  });

  it("opens external links safely and drops untrusted image hosts", () => {
    render(
      <WriteupMarkdown
        markdown={[
          "[GitHub](https://github.com/dsandili06)",
          "![ok](https://user-attachments.githubusercontent.com/1/img.png)",
          "![blocked](https://tracker.example.com/pixel.png)",
        ].join("\n")}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByAltText("ok")).toHaveAttribute(
      "src",
      "https://user-attachments.githubusercontent.com/1/img.png",
    );
    expect(screen.queryByAltText("blocked")).not.toBeInTheDocument();
  });

  it("gives zoomable images an accessible name with and without alt text", () => {
    render(
      <WriteupMarkdown
        markdown={[
          "![](https://user-attachments.githubusercontent.com/1/a.png)",
          "![Diagrama](https://user-attachments.githubusercontent.com/1/b.png)",
        ].join("\n\n")}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Ampliar imagen" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ampliar imagen: Diagrama" })).toBeInTheDocument();
  });
  it("renders a titled image as figure with figcaption outside any paragraph", () => {
    const { container } = render(
      <WriteupMarkdown
        markdown={
          '![Captura](https://user-attachments.githubusercontent.com/1/c.png "Pie de foto")'
        }
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    const figure = container.querySelector("figure");
    expect(figure).not.toBeNull();
    expect(figure?.querySelector("figcaption")).toHaveTextContent("Pie de foto");
    expect(figure?.closest("p")).toBeNull();
    expect(screen.getByAltText("Captura")).not.toHaveAttribute("title");
  });

  it("marks lab question paragraphs as English and leaves normal paragraphs untouched", () => {
    render(
      <WriteupMarkdown
        markdown={"**Q1.** Which encoding method?\n\nUn párrafo normal"}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    const question = screen.getByText("Q1.").closest("p");
    expect(question).toHaveAttribute("lang", "en");
    expect(question).toHaveTextContent("Q1. Which encoding method?");
    expect(screen.getByText("Un párrafo normal").closest("p")).not.toHaveAttribute("lang");
  });

  it("renders a Respuesta blockquote as a note callout", () => {
    render(
      <WriteupMarkdown
        markdown={"> **Respuesta:** `192.168.1.10`"}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    expect(screen.getByRole("note", { name: "Respuesta del laboratorio" })).toHaveTextContent(
      "192.168.1.10",
    );
    expect(screen.queryByRole("blockquote")).not.toBeInTheDocument();
  });

  it("renders an original **R:** answer blockquote as a note callout", () => {
    render(
      <WriteupMarkdown
        markdown={"> **R:** `10.0.2.4`"}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    expect(screen.getByRole("note", { name: "Respuesta del laboratorio" })).toHaveTextContent(
      "10.0.2.4",
    );
  });

  it("renders any other blockquote as a pull quote", () => {
    const { container } = render(
      <WriteupMarkdown
        markdown={"> Una frase destacada."}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    expect(container.querySelector("blockquote")).toHaveTextContent("Una frase destacada.");
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });
});
