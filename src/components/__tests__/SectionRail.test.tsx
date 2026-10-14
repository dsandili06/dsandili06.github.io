import { describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { SectionRail } from "@/components/fx/SectionRail";

describe("SectionRail", () => {
  it("renders ordered registry numbers once a section is ready and scrolls to its ID", async () => {
    const sections = [
      "about",
      "formacion",
      "proyectos",
      "investigaciones",
      "stack",
      "cursos",
      "contacto",
    ];
    sections.forEach((id) => {
      const section = document.createElement("section");
      section.id = id;
      section.scrollIntoView = vi.fn();
      document.body.appendChild(section);
    });

    render(<SectionRail />);
    const rail = await screen.findByRole("navigation", { name: "Secciones" });
    expect(
      Array.from(rail.querySelectorAll("button span:first-child")).map((span) => span.textContent),
    ).toEqual(["01", "02", "03", "04", "05", "06", "07"]);

    fireEvent.click(screen.getByRole("button", { name: "proyectos" }));
    expect(document.getElementById("proyectos")?.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
    expect(window.location.hash).toBe("#proyectos");
    cleanup();
    sections.forEach((id) => document.getElementById(id)?.remove());
    history.replaceState(null, "", window.location.pathname);
  });
});
