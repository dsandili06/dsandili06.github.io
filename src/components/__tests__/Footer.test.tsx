import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { CONTACT } from "@/data/site";

describe("Footer", () => {
  it("shows identity, role and copyright", () => {
    render(<Footer />);
    expect(screen.getByText("Analista SOC · Blue Team · DFIR")).toBeInTheDocument();
    expect(screen.getAllByText(/Santiago Daniel Sandili/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/© 2026/)).toBeInTheDocument();
  });

  it("links to profiles, email, CV and top with safe attributes", () => {
    render(<Footer />);

    for (const [name, href] of [
      ["LinkedIn", CONTACT.linkedin],
      ["GitHub", CONTACT.github],
    ] as const) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }

    expect(screen.getByRole("link", { name: "Email" })).toHaveAttribute(
      "href",
      `mailto:${CONTACT.email}`,
    );
    const cv = screen.getByRole("link", { name: "CV" });
    expect(cv).toHaveAttribute("href", CONTACT.cv);
    expect(cv).toHaveAttribute("download");
    expect(screen.getByRole("link", { name: "Volver arriba" })).toHaveAttribute("href", "#top");
  });
});
