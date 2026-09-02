import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
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
  });

  afterEach(() => {
    cleanup();
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

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    const { findByText } = render(<WriteupModal investigationId="LAB_001" onClose={onClose} />);
    await findByText(MD_CONTENT.split("\n\n")[1]);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  });
