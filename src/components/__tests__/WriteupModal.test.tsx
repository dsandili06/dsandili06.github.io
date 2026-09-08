import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { WriteupModal } from "@/components/WriteupModal";

/**
 * Regression tests for the mobile scroll bug:
 * the modal's scrollable body MUST have data-lenis-prevent so native
 * touch scrolling works while the global Lenis instance is stopped.
 */

const MD_CONTENT = "# FakeGPT\n\nContenido de prueba del writeup.";

function mockLenis() {
  const lenis = { stop: vi.fn(), start: vi.fn() };
  (window as unknown as Record<string, unknown>).__lenis = lenis;
  return lenis;
}

describe("WriteupModal", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(MD_CONTENT) }),
    );
    sessionStorage.clear();
    vi.spyOn(window.history, "pushState").mockImplementation(() => {});
    vi.spyOn(window.history, "back").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete (window as unknown as Record<string, unknown>).__lenis;
  });

  it("renders the scrollable body with data-lenis-prevent (mobile scroll fix)", async () => {
    render(<WriteupModal investigationId="LAB_001" onClose={() => {}} />);

    const scroller = await screen.findByText(MD_CONTENT.split("\n\n")[1]);
    expect(scroller).toBeInTheDocument();

    // The scroll container carries the attribute Lenis checks before preventDefault
    const container = document.querySelector("[data-lenis-prevent]");
    expect(container).not.toBeNull();
    expect(container?.className).toContain("overflow-y-auto");
  });

  it("pauses Lenis and locks body scroll on mount", async () => {
    const lenis = mockLenis();
    render(<WriteupModal investigationId="LAB_001" onClose={() => {}} />);

    expect(lenis.stop).toHaveBeenCalled();
    expect(document.body.style.overflow).toBe("hidden");
    await screen.findByText(MD_CONTENT.split("\n\n")[1]);
  });

  it("resumes Lenis and restores body scroll on unmount", async () => {
    const lenis = mockLenis();
    const { unmount } = render(<WriteupModal investigationId="LAB_001" onClose={() => {}} />);
    await screen.findByText(MD_CONTENT.split("\n\n")[1]);

    unmount();

    expect(lenis.start).toHaveBeenCalled();
    expect(document.body.style.overflow).toBe("");
  });

  it("renders fetched markdown content (images get resolved srcs)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () =>
          Promise.resolve(
            '<img src="https://github.com/user-attachments/assets/test-uuid" alt="screenshot" />',
          ),
      }),
    );

    render(<WriteupModal investigationId="LAB_001" onClose={() => {}} />);

    const img = await screen.findByAltText("screenshot");
    expect(img).toHaveAttribute("src", "https://github.com/user-attachments/assets/test-uuid");
  });

  it("resolves user-attachments.githubusercontent.com and s3.amazonaws.com while blocking untrusted CDNs", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () =>
          Promise.resolve(`
![s3-img](https://mybucket.s3.amazonaws.com/evidence.png)
![user-attachment](https://user-attachments.githubusercontent.com/123/img.png)
![data-img](data:image/png;base64,iVBORw0KGgo=)
![blocked-tracker](https://tracker.evil.com/pixel.png)
          `),
      }),
    );

    render(<WriteupModal investigationId="LAB_001" onClose={() => {}} />);

    const s3Img = await screen.findByAltText("s3-img");
    expect(s3Img).toHaveAttribute("src", "https://mybucket.s3.amazonaws.com/evidence.png");

    const attachmentImg = screen.getByAltText("user-attachment");
    expect(attachmentImg).toHaveAttribute(
      "src",
      "https://user-attachments.githubusercontent.com/123/img.png",
    );

    const dataImg = screen.getByAltText("data-img");
    expect(dataImg).toHaveAttribute("src", "data:image/png;base64,iVBORw0KGgo=");

    expect(screen.queryByAltText("blocked-tracker")).not.toBeInTheDocument();
  });

  it("shows error state when fetch fails (HTTP 404)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: "Not Found" }),
    );
    render(<WriteupModal investigationId="LAB_001" onClose={vi.fn()} />);

    expect(await screen.findByText("No se pudo cargar el writeup")).toBeInTheDocument();
    const retryBtn = screen.getByText("Reintentar");
    expect(retryBtn).toBeInTheDocument();
  });

  it("shows error state for unknown investigation ID", async () => {
    render(<WriteupModal investigationId="LAB_999" onClose={vi.fn()} />);

    expect(await screen.findByText("Writeup no encontrado")).toBeInTheDocument();
  });

  it("scrolls internal container smoothly when TOC index link is clicked", async () => {
    const markdownWithHeadings = `
## Section 1
Content 1
## Section 2
Content 2
## Section 3
Content 3
## Section 4
Content 4
    `;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(markdownWithHeadings) }),
    );

    render(<WriteupModal investigationId="LAB_001" onClose={() => {}} />);

    const tocLink = await screen.findByRole("link", { name: "Section 2" });
    expect(tocLink).toBeInTheDocument();

    const scrollContainer = document.body.querySelector("[data-lenis-prevent]") as HTMLElement;
    expect(scrollContainer).not.toBeNull();
    const scrollToMock = vi.fn();
    scrollContainer.scrollTo = scrollToMock;

    tocLink.click();

    expect(scrollToMock).toHaveBeenCalled();
  });

  it("calls onClose and reverts history when Escape is pressed", async () => {
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();
    const { findByText } = render(<WriteupModal investigationId="LAB_001" onClose={onClose} />);
    await findByText(MD_CONTENT.split("\n\n")[1]);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  it("pushes history state on open and calls onClose when popstate fires (mobile back gesture)", async () => {
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();

    const { findByText } = render(<WriteupModal investigationId="LAB_001" onClose={onClose} />);
    await findByText(MD_CONTENT.split("\n\n")[1]);

    expect(pushStateSpy).toHaveBeenCalledWith({ modal: "writeup", id: "LAB_001" }, "");

    // Simulate mobile back button / swipe gesture
    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(onClose).toHaveBeenCalledTimes(1);
    // Browser already popped the entry, so history.back must NOT be called redundantly
    expect(backSpy).not.toHaveBeenCalled();
  });

  it("reverts history when closed via X button", async () => {
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();

    const { findByText } = render(<WriteupModal investigationId="LAB_001" onClose={onClose} />);
    await findByText(MD_CONTENT.split("\n\n")[1]);

    const closeBtn = screen.getByRole("button", { name: /Cerrar/i });
    fireEvent.click(closeBtn);

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("reverts history when closed via backdrop click", async () => {
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();

    const { findByText } = render(<WriteupModal investigationId="LAB_001" onClose={onClose} />);
    await findByText(MD_CONTENT.split("\n\n")[1]);

    const backdrop = document.querySelector(".fixed.inset-0.z-\\[9999\\]") as HTMLElement;
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop);

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
