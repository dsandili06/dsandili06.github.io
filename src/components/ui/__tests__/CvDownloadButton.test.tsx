import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CvDownloadButton } from "@/components/ui/CvDownloadButton";
import { CONTACT } from "@/data/site";

describe("CvDownloadButton", () => {
  it("exposes a single accessible download link", () => {
    render(<CvDownloadButton />);
    const link = screen.getByRole("link", { name: "Descargar CV (PDF)" });
    expect(link).toHaveAttribute("href", CONTACT.cv);
    expect(link).toHaveAttribute("download");
  });

  it("keeps both visual labels inside aria-hidden layers", () => {
    render(<CvDownloadButton />);
    for (const text of ["Descargar CV", "¡Gracias!"]) {
      const layer = screen
        .getAllByText(text)
        .find(
          (el) => el.getAttribute("aria-hidden") === "true" && !el.className.includes("invisible"),
        );
      expect(layer).toBeDefined();
    }
  });

  it("applies custom class and size", () => {
    render(<CvDownloadButton size="lg" className="w-full" />);
    const link = screen.getByRole("link", { name: "Descargar CV (PDF)" });
    expect(link.className).toContain("w-full");
    expect(link.className).toContain("h-14");
  });
});
