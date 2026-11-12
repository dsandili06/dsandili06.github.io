import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { Cursos } from "@/components/sections/Cursos";
import { COURSE_GROUPS, COURSES, FEATURED_COURSES } from "@/data/courses";
import { certificateBySrc } from "@/data/certificateCatalog";
import { captureModalRequests } from "@/test/modalRequests";

const reducedMotionState = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: () => reducedMotionState.value,
  };
});

function renderExpanded() {
  const utils = render(<Cursos />);
  fireEvent.click(screen.getByRole("button", { name: /Ver los \d+ cursos/i }));
  return utils;
}

describe("Cursos", () => {
  let capture: ReturnType<typeof captureModalRequests>;
  beforeEach(() => {
    reducedMotionState.value = false;
    capture = captureModalRequests();
  });
  afterEach(() => {
    capture.stop();
  });

  it("renders the section header with number 06 and learning log kicker", () => {
    render(<Cursos />);
    expect(screen.getByText(/SECTION_06 \/\/ LEARNING_LOG/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Cursos Completados/i })).toBeInTheDocument();
  });

  it("should render institution count telemetry", () => {
    render(<Cursos />);
    expect(screen.getByText(/INSTITUCIONES/)).toBeInTheDocument();
    const instMatches = screen.getAllByText(String(COURSE_GROUPS.length));
    expect(instMatches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/TODOS COMPLETADOS/)).toBeInTheDocument();
  });

  it("renders one card per featured course", () => {
    render(<Cursos />);
    const list = screen.getByRole("list", { name: /Cursos destacados/i });
    expect(within(list).getAllByRole("listitem")).toHaveLength(FEATURED_COURSES.length);
    for (const course of FEATURED_COURSES) {
      expect(within(list).getByText(course.title)).toBeInTheDocument();
    }
  });

  it("keeps the explorer collapsed by default", () => {
    render(<Cursos />);
    const toggle = screen.getByRole("button", { name: `Ver los ${COURSES.length} cursos` });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("aria-controls", "cursos-explorer");
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("expands and collapses the explorer with the toggle", () => {
    render(<Cursos />);
    const toggle = screen.getByRole("button", { name: /Ver los \d+ cursos/i });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveTextContent("Ocultar cursos");
    expect(screen.getAllByRole("tab")).toHaveLength(COURSE_GROUPS.length);
    expect(document.getElementById("cursos-explorer")).toContainElement(
      screen.getByRole("tablist"),
    );

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  it("requests the certificate when clicking a featured course card", () => {
    render(<Cursos />);
    const featured = FEATURED_COURSES.find((c) => c.cert)!;
    const list = screen.getByRole("list", { name: /Cursos destacados/i });
    fireEvent.click(within(list).getByLabelText(`Ver certificado: ${featured.title}`));

    const expected = certificateBySrc(featured.cert!);
    expect(expected?.title).toBe(featured.title);
    expect(capture.requests).toEqual([{ type: "cert", id: expected?.id }]);
  });

  it("should render all institutions in the Hub selector", () => {
    renderExpanded();
    const tabList = screen.getByRole("tablist");
    expect(tabList).toBeInTheDocument();

    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(COURSE_GROUPS.length);

    for (const group of COURSE_GROUPS) {
      const match = screen.getAllByText(new RegExp(group.meta?.shortName || group.org, "i"));
      expect(match.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("should have matching ARIA aria-controls and aria-labelledby between tab and tabpanel", () => {
    renderExpanded();
    const activeTab = screen.getByRole("tab", { selected: true });
    const tabpanel = screen.getByRole("tabpanel");

    const controlsId = activeTab.getAttribute("aria-controls");
    const panelId = tabpanel.getAttribute("id");
    expect(controlsId).toBe(panelId);

    const labelledById = tabpanel.getAttribute("aria-labelledby");
    const tabId = activeTab.getAttribute("id");
    expect(labelledById).toBe(tabId);
  });

  it("hub dock tablist should allow uninhibited vertical page scrolling and include touch-pan-x", () => {
    renderExpanded();
    const tablist = screen.getByRole("tablist");
    expect(tablist).not.toHaveAttribute("data-lenis-prevent");
    expect(tablist.className).toContain("touch-pan-x");
  });

  it("scrolls the institution dock smoothly when reduced motion is not requested", () => {
    renderExpanded();
    const tablist = screen.getByRole("tablist");
    Object.defineProperty(tablist, "scrollWidth", { configurable: true, value: 500 });
    Object.defineProperty(tablist, "clientWidth", { configurable: true, value: 200 });
    const scrollTo = vi.fn();
    tablist.scrollTo = scrollTo;

    fireEvent.click(screen.getAllByRole("tab")[1]);

    expect(scrollTo).toHaveBeenCalledWith({ left: 0, behavior: "smooth" });
  });

  it("uses instant dock scrolling when reduced motion is requested", () => {
    reducedMotionState.value = true;
    renderExpanded();
    const tablist = screen.getByRole("tablist");
    Object.defineProperty(tablist, "scrollWidth", { configurable: true, value: 500 });
    Object.defineProperty(tablist, "clientWidth", { configurable: true, value: 200 });
    const scrollTo = vi.fn();
    tablist.scrollTo = scrollTo;

    fireEvent.click(screen.getAllByRole("tab")[1]);

    expect(scrollTo).toHaveBeenCalledWith({ left: 0, behavior: "auto" });
  });

  it("uses instant scrollIntoView in the reduced-motion fallback path", () => {
    reducedMotionState.value = true;
    renderExpanded();
    const tablist = screen.getByRole("tablist");
    Object.defineProperty(tablist, "scrollWidth", { configurable: true, value: 500 });
    Object.defineProperty(tablist, "clientWidth", { configurable: true, value: 200 });
    tablist.scrollTo = vi.fn(() => {
      throw new Error("scrollTo unavailable");
    });
    const targetTab = screen.getAllByRole("tab")[1];
    const scrollIntoView = vi.fn();
    targetTab.scrollIntoView = scrollIntoView;

    fireEvent.click(targetTab);

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "nearest",
      inline: "nearest",
    });
  });

  it("should display initial institution (Coursera/Google) courses in the active dossier", () => {
    renderExpanded();
    expect(screen.getByText("Foundations of Cybersecurity")).toBeInTheDocument();
    expect(screen.getByText("Tools of the Trade: Linux and SQL")).toBeInTheDocument();
  });

  it("should switch active institution and display its specific courses when clicked", () => {
    renderExpanded();

    // Switch to TryHackMe
    const thmTab = screen.getByRole("tab", { name: /TryHackMe/i });
    fireEvent.click(thmTab);

    expect(thmTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Pre Security")).toBeInTheDocument();
    expect(within(screen.getByRole("tabpanel")).getByText("SOC L1 Path")).toBeInTheDocument();

    // Switch to Cisco
    const ciscoTab = screen.getByRole("tab", { name: /Cisco/i });
    fireEvent.click(ciscoTab);

    expect(ciscoTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Networking Basics")).toBeInTheDocument();
    expect(screen.getByText("Introduction to Cybersecurity")).toBeInTheDocument();
  });

  it("should render official badge image in dossier header when selecting an institution", () => {
    renderExpanded();

    const dojoTab = screen.getByRole("tab", { name: /DOJO/i });
    fireEvent.click(dojoTab);

    const dossierPanel = screen.getByRole("tabpanel");
    const badgeImg = dossierPanel.querySelector('img[alt="Badge DOJO COMMUNITY"]');
    expect(badgeImg).toBeInTheDocument();
    expect(badgeImg).toHaveAttribute("src", "/badges/dojo.png");
  });

  it("requests the SOC L1 Path certificate when clicking its TryHackMe course row", () => {
    renderExpanded();

    fireEvent.click(screen.getByRole("tab", { name: /TryHackMe/i }));
    fireEvent.click(screen.getByLabelText(/Ver certificado oficial: SOC L1 Path/i));

    const expected = certificateBySrc("/certs/THM-SOC L1 PATH.webp");
    expect(expected?.title).toBe("SOC L1 Path");
    expect(capture.requests).toEqual([{ type: "cert", id: expected?.id }]);
  });

  it("requests the course certificate when clicking a course row", () => {
    renderExpanded();

    fireEvent.click(
      screen.getByLabelText(/Ver certificado oficial: Foundations of Cybersecurity/i),
    );

    const expected = certificateBySrc("/certs/Coursera - Foundations of Cybersecurity.webp");
    expect(expected?.title).toBe("Foundations of Cybersecurity");
    expect(capture.requests).toEqual([{ type: "cert", id: expected?.id }]);
  });

  it("links every course certificate to the certificate catalog", () => {
    for (const course of COURSES.filter((c) => c.cert)) {
      expect(certificateBySrc(course.cert!)?.title).toBe(course.title);
    }
  });

  it("should support keyboard navigation between institution tabs", () => {
    renderExpanded();

    const tabs = screen.getAllByRole("tab");
    const firstTab = tabs[0];
    firstTab.focus();

    // ArrowDown -> advances to next tab (TryHackMe)
    fireEvent.keyDown(firstTab, { key: "ArrowDown" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");

    // ArrowUp -> goes back to previous tab (Google)
    fireEvent.keyDown(tabs[1], { key: "ArrowUp" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    // End -> goes to last tab
    fireEvent.keyDown(tabs[0], { key: "End" });
    expect(tabs[tabs.length - 1]).toHaveAttribute("aria-selected", "true");

    // Home -> goes to first tab
    fireEvent.keyDown(tabs[tabs.length - 1], { key: "Home" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("should support horizontal keyboard navigation (ArrowRight and ArrowLeft)", () => {
    renderExpanded();

    const tabs = screen.getAllByRole("tab");
    const firstTab = tabs[0];
    firstTab.focus();

    // ArrowRight -> advances to next tab
    fireEvent.keyDown(firstTab, { key: "ArrowRight" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");

    // ArrowLeft -> goes back to previous tab
    fireEvent.keyDown(tabs[1], { key: "ArrowLeft" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("should navigate to each institution and display their respective courses and metadata", () => {
    renderExpanded();

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(COURSE_GROUPS.length);

    for (let i = 0; i < COURSE_GROUPS.length; i++) {
      const group = COURSE_GROUPS[i];
      fireEvent.click(tabs[i]);

      expect(tabs[i]).toHaveAttribute("aria-selected", "true");
      // Dossier heading should show group name
      const dossierPanel = screen.getByRole("tabpanel");
      expect(dossierPanel).toHaveTextContent(group.org);

      // Should display all courses in this group
      for (const course of group.courses) {
        expect(within(dossierPanel).getByText(course.title)).toBeInTheDocument();
      }
    }
  });

  it("each course row should render sequence number and accessible action button", () => {
    renderExpanded();

    // Default is Coursera/Google
    const googleGroup = COURSE_GROUPS.find((g) => g.org === "Coursera/Google");
    expect(googleGroup).toBeDefined();

    const panel = screen.getByRole("tabpanel");
    for (const course of googleGroup!.courses) {
      const btn = within(panel).getByLabelText(new RegExp(course.title, "i"));
      expect(btn).toBeInTheDocument();
      expect(btn.tagName).toBe("BUTTON");
      expect(btn).toHaveAttribute("aria-haspopup", "dialog");
      expect(panel).toHaveTextContent(course.n);
    }
  });

  it("tabpanel should have tabIndex 0 and contain a semantic course list", () => {
    renderExpanded();
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("tabindex", "0");

    const list = within(panel).getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBeGreaterThan(0);
  });

  it("institution tabs have descriptive accessible names including course count", () => {
    renderExpanded();
    const tabs = screen.getAllByRole("tab");
    for (let i = 0; i < COURSE_GROUPS.length; i++) {
      const group = COURSE_GROUPS[i];
      const count = group.courses.length;
      const expectedLabel = `${group.org}, ${count} ${count === 1 ? "curso" : "cursos"}`;
      expect(tabs[i]).toHaveAttribute("aria-label", expectedLabel);
    }
  });

  it("manages roving tabIndex correctly between selected and unselected tabs", () => {
    renderExpanded();
    const tabs = screen.getAllByRole("tab");

    // First tab active by default
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    for (let i = 1; i < tabs.length; i++) {
      expect(tabs[i]).toHaveAttribute("tabindex", "-1");
      expect(tabs[i]).toHaveAttribute("aria-selected", "false");
    }

    // Switch tab to Cisco (index 2)
    fireEvent.click(tabs[2]);
    expect(tabs[2]).toHaveAttribute("tabindex", "0");
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "-1");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
  });

  it("keyboard navigation wraps cyclically between first and last institutions", () => {
    renderExpanded();
    const tabs = screen.getAllByRole("tab");
    const firstTab = tabs[0];
    const lastTab = tabs[tabs.length - 1];

    // ArrowUp on first tab wraps to last tab
    firstTab.focus();
    fireEvent.keyDown(firstTab, { key: "ArrowUp" });
    expect(lastTab).toHaveAttribute("aria-selected", "true");
    expect(lastTab).toHaveAttribute("tabindex", "0");

    // ArrowDown on last tab wraps back to first tab
    fireEvent.keyDown(lastTab, { key: "ArrowDown" });
    expect(firstTab).toHaveAttribute("aria-selected", "true");
    expect(firstTab).toHaveAttribute("tabindex", "0");
  });

  it("tablist includes mobile overscroll-x-contain to prevent accidental browser swipe-back", () => {
    renderExpanded();
    const tablist = screen.getByRole("tablist");
    expect(tablist.className).toContain("overscroll-x-contain");
  });

  it("tablist includes cross-browser scrollbar suppression classes", () => {
    renderExpanded();
    const tablist = screen.getByRole("tablist");
    expect(tablist.className).toContain("no-scrollbar");
    expect(tablist.className).toContain("[scrollbar-width:none]");
    expect(tablist.className).toContain("[&::-webkit-scrollbar]:hidden");
  });

  it("displays proper singular/plural grammar in the HUD header for course counts", () => {
    renderExpanded();

    // Default Coursera/Google has 9 courses -> plural CURSOS
    expect(screen.getByText(/\[ 09 CURSOS \]/)).toBeInTheDocument();

    // Switch to DOJO COMMUNITY which has 1 course -> singular CURSO
    const dojoTab = screen.getByRole("tab", { name: /DOJO/i });
    fireEvent.click(dojoTab);
    expect(screen.getByText(/\[ 01 CURSO \]/)).toBeInTheDocument();
  });

  it("course row button uses valid phrasing content without illegal nested divs", () => {
    renderExpanded();
    const buttons = screen.getAllByRole("button", { name: /Ver certificado oficial:/i });
    expect(buttons.length).toBeGreaterThan(0);

    for (const btn of buttons) {
      // In HTML5, buttons cannot contain div elements (flow content)
      const nestedDivs = btn.querySelectorAll("div");
      expect(nestedDivs.length).toBe(0);
    }
  });
});
