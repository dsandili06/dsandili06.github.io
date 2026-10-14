import { describe, expect, it } from "vitest";
import { SECTIONS } from "@/data/sections";

describe("SECTIONS data integrity", () => {
  it("keeps section IDs and numbers unique", () => {
    expect(new Set(SECTIONS.map((section) => section.id)).size).toBe(SECTIONS.length);
    expect(new Set(SECTIONS.map((section) => section.number)).size).toBe(SECTIONS.length);
  });

  it("keeps the editorial order, navigation labels, and numbering stable", () => {
    expect(SECTIONS.map(({ id, number, navLabel }) => ({ id, number, navLabel }))).toEqual([
      { id: "about", number: "01", navLabel: "About" },
      { id: "formacion", number: "02", navLabel: "Certs" },
      { id: "proyectos", number: "03", navLabel: "Proyectos" },
      { id: "investigaciones", number: "04", navLabel: "Labs" },
      { id: "stack", number: "05", navLabel: "Stack" },
      { id: "cursos", number: "06", navLabel: "Cursos" },
      { id: "contacto", number: "07", navLabel: "Contacto" },
    ]);
  });
});
