import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WriteupTocPanel } from "@/components/features/writeups/WriteupTocPanel";

const entries = [
  { id: "a", text: "Alfa", depth: 2 as const },
  { id: "b", text: "Beta", depth: 2 as const },
];

describe("WriteupTocPanel", () => {
  it("renders a labelled nav", () => {
    render(<WriteupTocPanel entries={entries} onSelect={vi.fn()} />);
    expect(screen.getByRole("navigation", { name: "En este informe" })).toBeInTheDocument();
  });

  it("marks the active link with aria-current", () => {
    render(<WriteupTocPanel entries={entries} onSelect={vi.fn()} activeId="b" />);
    expect(screen.getByRole("link", { name: "Beta" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Alfa" })).not.toHaveAttribute("aria-current");
  });
});
