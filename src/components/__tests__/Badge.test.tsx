import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders with default variant and project tokens", () => {
    render(<Badge>Default Badge</Badge>);
    const el = screen.getByText("Default Badge");
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("bg-accent");
    expect(el.className).not.toContain("bg-primary");
  });

  it("renders with secondary variant and project tokens", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const el = screen.getByText("Secondary Badge");
    expect(el).toBeInTheDocument();
    expect(el.className).toContain("bg-surface");
    expect(el.className).not.toContain("bg-secondary");
  });

  it("renders with success variant and dot", () => {
    const { container } = render(
      <Badge variant="success" dot pulse>
        Active Status
      </Badge>,
    );
    expect(screen.getByText("Active Status")).toBeInTheDocument();
    const dot = container.querySelector(".size-1");
    expect(dot).toBeInTheDocument();
    expect(dot?.className).toContain("animate-pulse");
  });

  it("renders tactical and warning variants without phantom classes", () => {
    const { rerender } = render(<Badge variant="tactical">Tactical</Badge>);
    expect(screen.getByText("Tactical").className).toContain("border-accent/40");

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText("Warning").className).toContain("text-[var(--accent-amber)]");
  });

  it("applies size classes correctly without variant collisions", () => {
    const { rerender } = render(<Badge size="sm">Small Badge</Badge>);
    const smEl = screen.getByText("Small Badge");
    expect(smEl.className).toContain("text-[9px]");
    expect(smEl.className).toContain("px-1.5");

    rerender(<Badge size="lg">Large Badge</Badge>);
    const lgEl = screen.getByText("Large Badge");
    expect(lgEl.className).toContain("text-[11px]");
    expect(lgEl.className).toContain("px-2.5");
  });
});
