import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Cursos } from "@/components/sections/Cursos";
import { COURSE_GROUPS, COURSES } from "@/data/courses";

// Mock CertModal
vi.mock("@/components/CertModal", () => ({
  CertModal: ({
    title,
    cert,
    initialTab,
    isOpen = true,
    onClose,
  }: {
    title: string;
    cert?: string;
    initialTab?: "cert" | "review";
    isOpen?: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="cert-modal">
        <span data-testid="modal-title">{title}</span>
        <span data-testid="modal-cert">{cert}</span>
        <span data-testid="modal-tab">{initialTab || "none"}</span>
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

describe("Cursos", () => {
  it("renders the section header with number 06 and learning log kicker", () => {
    render(<Cursos />);
    expect(screen.getByText(/SECTION_06 \/\/ LEARNING_LOG/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Cursos Completados/i })).toBeInTheDocument();
  });

  it("should render total count and institution count telemetry", () => {
    render(<Cursos />);
    expect(screen.getByText(/TOTAL/)).toBeInTheDocument();
    const countMatches = screen.getAllByText(String(COURSES.length));
    expect(countMatches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/INSTITUCIONES/)).toBeInTheDocument();
    const instMatches = screen.getAllByText(String(COURSE_GROUPS.length));
    expect(instMatches.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/TODOS COMPLETADOS/)).toBeInTheDocument();
  });

  it("should render all institutions in the Hub selector", () => {
    render(<Cursos />);
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
    render(<Cursos />);
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
    render(<Cursos />);
    const tablist = screen.getByRole("tablist");
    expect(tablist).not.toHaveAttribute("data-lenis-prevent");
    expect(tablist.className).toContain("touch-pan-x");
  });

  it("should display initial institution (Coursera/Google) courses in the active dossier", () => {
    render(<Cursos />);
    expect(screen.getByText("Foundations of Cybersecurity")).toBeInTheDocument();
    expect(screen.getByText("Tools of the Trade: Linux and SQL")).toBeInTheDocument();
  });

  it("should switch active institution and display its specific courses when clicked", () => {
    render(<Cursos />);

    // Switch to TryHackMe
    const thmTab = screen.getByRole("tab", { name: /TryHackMe/i });
    fireEvent.click(thmTab);

    expect(thmTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Pre Security")).toBeInTheDocument();
    expect(screen.getByText("SOC L1 Path")).toBeInTheDocument();

    // Switch to Cisco
    const ciscoTab = screen.getByRole("tab", { name: /Cisco/i });
    fireEvent.click(ciscoTab);

    expect(ciscoTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Networking Basics")).toBeInTheDocument();
    expect(screen.getByText("Introduction to Cybersecurity")).toBeInTheDocument();
  });

  it("should render official badge image in dossier header when selecting an institution", () => {
    render(<Cursos />);

    const dojoTab = screen.getByRole("tab", { name: /DOJO/i });
    fireEvent.click(dojoTab);

    const dossierPanel = screen.getByRole("tabpanel");
    const badgeImg = dossierPanel.querySelector('img[alt="Badge DOJO COMMUNITY"]');
    expect(badgeImg).toBeInTheDocument();
    expect(badgeImg).toHaveAttribute("src", "/badges/dojo.png");
  });

  it("should open CertModal when clicking course row for TryHackMe SOC L1 and close it", () => {
    render(<Cursos />);

    // Switch to TryHackMe where SOC L1 is located
    const thmTab = screen.getByRole("tab", { name: /TryHackMe/i });
    fireEvent.click(thmTab);

    const sal1Btn = screen.getByLabelText(/Ver certificado oficial: SOC L1 Path/i);
    fireEvent.click(sal1Btn);

    expect(screen.getByTestId("cert-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("SOC L1 Path");
    expect(screen.getByTestId("modal-cert")).toHaveTextContent("THM-SOC L1 PATH.webp");

    // Close the modal
    const closeBtn = screen.getByTestId("modal-close");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("cert-modal")).toBeNull();
  });

  it("should open CertModal when clicking a course row and close it", () => {
    render(<Cursos />);

    const courseBtn = screen.getByLabelText(
      /Ver certificado oficial: Foundations of Cybersecurity/i,
    );
    fireEvent.click(courseBtn);

    expect(screen.getByTestId("cert-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Foundations of Cybersecurity");
    expect(screen.getByTestId("modal-cert")).toHaveTextContent(
      "Coursera - Foundations of Cybersecurity.webp",
    );

    // Close the modal
    const closeBtn = screen.getByTestId("modal-close");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("cert-modal")).toBeNull();
  });

  it("should support keyboard navigation between institution tabs", () => {
    render(<Cursos />);

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
    render(<Cursos />);

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

  it("should navigate to each of the 8 institutions and display their respective courses and metadata", () => {
    render(<Cursos />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBe(8);

    for (let i = 0; i < COURSE_GROUPS.length; i++) {
      const group = COURSE_GROUPS[i];
      fireEvent.click(tabs[i]);

      expect(tabs[i]).toHaveAttribute("aria-selected", "true");
      // Dossier heading should show group name
      const dossierPanel = screen.getByRole("tabpanel");
      expect(dossierPanel).toHaveTextContent(group.org);

      // Should display all courses in this group
      for (const course of group.courses) {
        expect(screen.getByText(course.title)).toBeInTheDocument();
      }
    }
  });

  it("each course row should render sequence number and accessible action button", () => {
    render(<Cursos />);

    // Default is Coursera/Google
    const googleGroup = COURSE_GROUPS.find((g) => g.org === "Coursera/Google");
    expect(googleGroup).toBeDefined();

    const panel = screen.getByRole("tabpanel");
    for (const course of googleGroup!.courses) {
      const btn = screen.getByLabelText(new RegExp(course.title, "i"));
      expect(btn).toBeInTheDocument();
      expect(btn.tagName).toBe("BUTTON");
      expect(btn).toHaveAttribute("aria-haspopup", "dialog");
      expect(panel).toHaveTextContent(course.n);
    }
  });

  it("tabpanel should have tabIndex 0 and contain a semantic course list", () => {
    render(<Cursos />);
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("tabindex", "0");

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    expect(list.children.length).toBeGreaterThan(0);
  });

  it("institution tabs have descriptive accessible names including course count", () => {
    render(<Cursos />);
    const tabs = screen.getAllByRole("tab");
    for (let i = 0; i < COURSE_GROUPS.length; i++) {
      const group = COURSE_GROUPS[i];
      const count = group.courses.length;
      const expectedLabel = `${group.org}, ${count} ${count === 1 ? "curso" : "cursos"}`;
      expect(tabs[i]).toHaveAttribute("aria-label", expectedLabel);
    }
  });

  it("manages roving tabIndex correctly between selected and unselected tabs", () => {
    render(<Cursos />);
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
    render(<Cursos />);
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
    render(<Cursos />);
    const tablist = screen.getByRole("tablist");
    expect(tablist.className).toContain("overscroll-x-contain");
  });

  it("tablist includes cross-browser scrollbar suppression classes", () => {
    render(<Cursos />);
    const tablist = screen.getByRole("tablist");
    expect(tablist.className).toContain("no-scrollbar");
    expect(tablist.className).toContain("[scrollbar-width:none]");
    expect(tablist.className).toContain("[&::-webkit-scrollbar]:hidden");
  });

  it("displays proper singular/plural grammar in the HUD header for course counts", () => {
    render(<Cursos />);

    // Default Coursera/Google has 9 courses -> plural CURSOS
    expect(screen.getByText(/\[ 09 CURSOS \]/)).toBeInTheDocument();

    // Switch to DOJO COMMUNITY which has 1 course -> singular CURSO
    const dojoTab = screen.getByRole("tab", { name: /DOJO/i });
    fireEvent.click(dojoTab);
    expect(screen.getByText(/\[ 01 CURSO \]/)).toBeInTheDocument();
  });

  it("course row button uses valid phrasing content without illegal nested divs", () => {
    render(<Cursos />);
    const buttons = screen.getAllByRole("button", { name: /Ver certificado oficial:/i });
    expect(buttons.length).toBeGreaterThan(0);

    for (const btn of buttons) {
      // In HTML5, buttons cannot contain div elements (flow content)
      const nestedDivs = btn.querySelectorAll("div");
      expect(nestedDivs.length).toBe(0);
    }
  });
});
