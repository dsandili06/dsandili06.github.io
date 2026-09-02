import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Investigaciones } from "@/components/sections/Investigaciones";

/**
 * Smoke tests for the Full case log view toggle: switching between the
 * autoplay carousel and the table must mount/unmount embla cleanly
 * (autoplay plugin stops on unmount — regression guard).
 */
describe("Investigaciones", () => {
  it("renders featured cases and the view toggle", () => {
    render(<Investigaciones />);

    expect(screen.getByText("FEATURED_CASES")).toBeInTheDocument();
    expect(screen.getByText("FULL_CASE_LOG")).toBeInTheDocument();
    // The toggle buttons use LayoutGrid icon for "Carrusel" and Table icon for "Tabla"
    const carouselBtns = screen.getAllByRole("button", { name: /carrusel/i });
    expect(carouselBtns.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: /tabla/i })).toBeInTheDocument();
  });

  it("toggles between carousel and table views without errors", () => {
    render(<Investigaciones />);

    // Carousel is the default view (desktop jsdom mock)
    const tableBtn = screen.getByRole("button", { name: /tabla/i });
    const carouselBtns = screen.getAllByRole("button", { name: /carrusel/i });
    // The first carousel button is the view toggle (has aria-pressed)
    const carouselToggle = carouselBtns.find((b) => b.hasAttribute("aria-pressed"));
    expect(carouselToggle).toBeTruthy();
    expect(carouselToggle).toHaveAttribute("aria-pressed", "true");

    // Switch to table — embla (with autoplay) unmounts cleanly
    fireEvent.click(tableBtn);
    expect(tableBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByText(/Próximo writeup/i).length).toBeGreaterThanOrEqual(1);

    // Switch back — carousel remounts, autoplay restarts
    fireEvent.click(carouselToggle!);
    expect(carouselToggle).toHaveAttribute("aria-pressed", "true");
  });

  it("table lab rows show click affordance (cursor + hover styles)", () => {
    render(<Investigaciones />);

    fireEvent.click(screen.getByRole("button", { name: /tabla/i }));
    const allButtons = screen.getAllByRole("button");
    const labRows = allButtons.filter(
      (b) => b.className.includes("cursor-pointer") && b.className.includes("grid"),
    );
    expect(labRows.length).toBeGreaterThanOrEqual(15);
    for (const row of labRows) {
      expect(row.className).toContain("group");
    }
  });
});
