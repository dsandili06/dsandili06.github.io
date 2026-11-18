import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Investigaciones } from "@/components/sections/Investigaciones";
import { INVESTIGATIONS, FEATURED_INVESTIGATIONS } from "@/data/investigations";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const { createRouterMock } = await import("@/test/routerMock");
  return createRouterMock(() => importOriginal<typeof import("@tanstack/react-router")>());
});

const expandLog = () =>
  fireEvent.click(screen.getByRole("button", { name: `Ver los ${INVESTIGATIONS.length} casos` }));

const slugByTitle = (title: string) => INVESTIGATIONS.find((i) => i.title.includes(title))?.slug;

/**
 * Smoke tests for the Full case log view toggle: switching between the
 * autoplay carousel and the table must mount/unmount embla cleanly
 * (autoplay plugin stops on unmount — regression guard).
 */
describe("Investigaciones", () => {
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

  it("displays the carousel counter matching the exact number of investigations", () => {
    render(<Investigaciones />);
    expandLog();

    const total = String(INVESTIGATIONS.length).padStart(2, "0");
    const offByOne = String(INVESTIGATIONS.length + 1).padStart(2, "0");
    const counter = screen.getByText(
      (_, el) => el?.tagName === "SPAN" && el.textContent === `CASO 01 / ${total}`,
    );
    expect(counter).toBeInTheDocument();
    expect(counter.textContent).not.toContain(`/ ${offByOne}`);
  });

  it("table lab rows show click affordance (cursor + hover styles)", () => {
    render(<Investigaciones />);
    expandLog();

    fireEvent.click(screen.getByRole("button", { name: /tabla/i }));
    const allLinks = screen.getAllByRole("link");
    const labRows = allLinks.filter(
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
      .getAllByRole("link")
      .filter((link) => link.textContent?.includes('Una extensión "ChatGPT" falsa'));

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
      .getAllByRole("link")
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

  it("links the lead featured card to its writeup page", () => {
    render(<Investigaciones />);

    const featuredCard = screen.getByRole("link", { name: "Abrir investigación: FakeGPT" });
    expect(featuredCard.className).toContain("absolute inset-0");
    expect(featuredCard).toHaveAttribute("href", `/writeups/${slugByTitle("FakeGPT")}`);
  });

  it("links a secondary featured case to its writeup page", () => {
    render(<Investigaciones />);

    const secondaryCard = screen.getByRole("link", { name: "Abrir caso: Brave" });
    expect(secondaryCard.className).toContain("absolute inset-0");
    expect(secondaryCard).toHaveAttribute("href", `/writeups/${slugByTitle("Brave")}`);
  });

  it("links every case in the expanded log and offers the full writeups index", () => {
    render(<Investigaciones />);
    expect(screen.getByRole("link", { name: "Ver todos los writeups" })).toHaveAttribute(
      "href",
      "/writeups",
    );

    expandLog();
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const i of INVESTIGATIONS) expect(hrefs).toContain(`/writeups/${i.slug}`);
  });
});
