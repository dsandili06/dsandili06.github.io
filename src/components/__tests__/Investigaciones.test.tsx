import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Investigaciones } from "@/components/sections/Investigaciones";
import { INVESTIGATIONS, FEATURED_INVESTIGATIONS } from "@/data/investigations";
import { captureModalRequests } from "@/test/modalRequests";

const expandLog = () =>
  fireEvent.click(screen.getByRole("button", { name: `Ver los ${INVESTIGATIONS.length} casos` }));

const idByTitle = (title: string) => INVESTIGATIONS.find((i) => i.title.includes(title))?.id;

/**
 * Smoke tests for the Full case log view toggle: switching between the
 * autoplay carousel and the table must mount/unmount embla cleanly
 * (autoplay plugin stops on unmount — regression guard).
 */
describe("Investigaciones", () => {
  let capture: ReturnType<typeof captureModalRequests>;
  beforeEach(() => {
    capture = captureModalRequests();
  });
  afterEach(() => {
    capture.stop();
  });

  it("renders the section header with number 04 and case log kicker", () => {
    render(<Investigaciones />);
    expect(screen.getByText(/SECTION_04 \/\/ CASE_LOG/i)).toBeInTheDocument();
  });

  it("renders featured cases and the view toggle", () => {
    render(<Investigaciones />);
    expandLog();

    expect(screen.getByText("FEATURED_CASES")).toBeInTheDocument();
    expect(screen.getByText("FULL_CASE_LOG")).toBeInTheDocument();
    // The toggle buttons use LayoutGrid icon for "Carrusel" and Table icon for "Tabla"
    const carouselBtns = screen.getAllByRole("button", { name: /carrusel/i });
    expect(carouselBtns.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: /tabla/i })).toBeInTheDocument();
  });

  it("keeps the full case log collapsed until the disclosure is opened", () => {
    render(<Investigaciones />);

    const toggle = screen.getByRole("button", { name: `Ver los ${INVESTIGATIONS.length} casos` });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "investigaciones-case-log");
    expect(screen.queryByText("FULL_CASE_LOG")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /tabla/i })).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleName("Ocultar casos");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("FULL_CASE_LOG")).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.queryByText("FULL_CASE_LOG")).not.toBeInTheDocument();
  });

  it("renders a captioned conceptual illustration for the lead investigation", () => {
    render(<Investigaciones />);

    const illustration = screen.getByRole("img", {
      name: /ilustración conceptual.*extensión falsa/i,
    });
    expect(illustration).toHaveAttribute("src", "/investigations/fakegpt-concept.svg");
    expect(screen.getByText(/Ilustración conceptual.*Image Beacon/i)).toBeInTheDocument();
    expect(screen.getByText("CONCEPTUAL")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("toggles between carousel and table views without errors", () => {
    render(<Investigaciones />);
    expandLog();

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
    expect(screen.queryByText(/Próximo writeup/i)).not.toBeInTheDocument();

    // Switch back — carousel remounts, autoplay restarts
    fireEvent.click(carouselToggle!);
    expect(carouselToggle).toHaveAttribute("aria-pressed", "true");
  });

  it("table lab rows show click affordance (cursor + hover styles)", () => {
    render(<Investigaciones />);
    expandLog();

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

  it("shows lab title, category and a bullet summary in table view without case numbers", () => {
    render(<Investigaciones />);
    expandLog();
    fireEvent.click(screen.getByRole("button", { name: /tabla/i }));

    expect(screen.getByText("SOBRE EL LAB")).toBeInTheDocument();
    const labRows = screen
      .getAllByRole("button")
      .filter((button) => button.textContent?.includes("Análisis de malware en extensión"));

    expect(labRows.length).toBeGreaterThan(0);
    for (const row of labRows) {
      expect(row.textContent).toContain("FakeGPT");
      expect(row.textContent).toContain("Malware Analysis");
      expect(row.textContent).not.toContain("LAB_001");
    }
  });

  it("featured cases show cursor affordance and can be clicked", () => {
    render(<Investigaciones />);

    const spotlightButtons = screen
      .getAllByRole("button")
      .filter((b) => b.textContent?.includes("SPOTLIGHT_0"));

    expect(spotlightButtons).toHaveLength(FEATURED_INVESTIGATIONS.length);
    for (const btn of spotlightButtons) {
      expect(btn.className).toContain("cursor-pointer");
    }
  });

  it("renders forensic watermark elements in featured cases", () => {
    render(<Investigaciones />);

    expect(screen.getAllByText("LAB_001").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("LAB_012").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("LAB_003").length).toBeGreaterThanOrEqual(1);
  });

  it("requests the lead writeup when its featured card is clicked", () => {
    render(<Investigaciones />);

    const featuredCard = screen.getByRole("button", { name: "Abrir investigación: FakeGPT" });
    expect(featuredCard.className).toContain("absolute inset-0");
    fireEvent.click(featuredCard);

    expect(capture.requests).toEqual([{ type: "writeup", id: idByTitle("FakeGPT") }]);
  });

  it("requests a secondary featured case when its card body is clicked", () => {
    render(<Investigaciones />);

    const secondaryCard = screen.getByRole("button", { name: "Abrir caso: Brave" });
    expect(secondaryCard.className).toContain("absolute inset-0");
    fireEvent.click(secondaryCard);

    expect(capture.requests).toEqual([{ type: "writeup", id: idByTitle("Brave") }]);
  });
});
