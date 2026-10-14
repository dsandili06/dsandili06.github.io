import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, act } from "@testing-library/react";
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
    window.dispatchEvent(new PopStateEvent("popstate"));
    vi.useRealTimers();
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

  it("announces loading and marks the dialog busy until content is ready", async () => {
    let resolveFetch!: (response: { ok: boolean; text: () => Promise<string> }) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<{ ok: boolean; text: () => Promise<string> }>((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );

    render(<WriteupModal investigationId="LAB_001" onClose={() => {}} />);

    const dialog = screen.getByRole("dialog");
    const status = screen.getByRole("status");
    expect(dialog).toHaveAttribute("aria-busy", "true");
    expect(dialog).not.toContainElement(status);
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Fetching writeup...");
    expect(
      screen
        .getAllByText("Fetching writeup...")
        .find((element) => element.closest('[aria-hidden="true"]')),
    ).toBeDefined();

    await act(async () => {
      resolveFetch({ ok: true, text: () => Promise.resolve(MD_CONTENT) });
    });

    expect(await screen.findByText(MD_CONTENT.split("\n\n")[1])).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-busy", "false");
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
          Promise.resolve("![screenshot](https://github.com/user-attachments/assets/test-uuid)"),
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

  it("does not render raw HTML and rejects dangerous link and image schemes", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () =>
          Promise.resolve(`
<script>window.__xss = true</script><img src="x" onerror="window.__xss = true">
[javascript](javascript:alert%281%29)
[vbscript](vbscript:alert%281%29)
[html data](data:text/html,evil)
![javascript image](javascript:alert%281%29)
![vbscript image](vbscript:alert%281%29)
![html data image](data:text/html,evil)
[data image link](data:image/png;base64,AAAA)
          `),
      }),
    );

    render(<WriteupModal investigationId="LAB_001" onClose={() => {}} />);

    expect(await screen.findByText("javascript")).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
    expect(document.querySelector("img[onerror]")).toBeNull();
    expect(
      document.querySelector('a[href^="javascript:"], a[href^="vbscript:"], a[href^="data:"]'),
    ).toBeNull();
    expect(screen.getByText("data image link").closest("a")).not.toHaveAttribute("href");
    expect(screen.queryByAltText("javascript image")).not.toBeInTheDocument();
    expect(screen.queryByAltText("vbscript image")).not.toBeInTheDocument();
    expect(screen.queryByAltText("html data image")).not.toBeInTheDocument();
  });

  it("shows a recoverable timeout error and can retry", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(
      (_url: string, { signal }: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<WriteupModal investigationId="LAB_001" onClose={() => {}} />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });
    expect(screen.getByRole("alert")).toHaveTextContent("No se pudo cargar el writeup");

    fetchMock.mockResolvedValueOnce({ ok: true, text: () => Promise.resolve(MD_CONTENT) });
    await act(async () => {
      fireEvent.click(screen.getByText("Reintentar"));
    });
    expect(screen.getByText(MD_CONTENT.split("\n\n")[1])).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("aborts an in-flight request when unmounted", () => {
    let requestSignal: AbortSignal | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, { signal }: { signal: AbortSignal }) => {
        requestSignal = signal;
        return new Promise(() => {});
      }),
    );

    const { unmount } = render(<WriteupModal investigationId="LAB_001" onClose={() => {}} />);
    unmount();

    expect(requestSignal?.aborted).toBe(true);
  });

  it("shows error state when fetch fails (HTTP 404)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: "Not Found" }),
    );
    render(<WriteupModal investigationId="LAB_001" onClose={vi.fn()} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo cargar el writeup");
    const retryBtn = screen.getByText("Reintentar");
    expect(retryBtn).toBeInTheDocument();
  });

  it("shows error state for unknown investigation ID", async () => {
    render(<WriteupModal investigationId="LAB_999" onClose={vi.fn()} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Writeup no encontrado");
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

    expect(pushStateSpy).toHaveBeenCalledWith(
      { modal: "writeup", id: "LAB_001" },
      "",
      window.location.href,
    );

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

  it("renders full investigation description without line-clamp truncation for Brave (LAB_012)", async () => {
    const { findByText } = render(<WriteupModal investigationId="LAB_012" onClose={() => {}} />);
    await findByText(MD_CONTENT.split("\n\n")[1]);

    const summaryEl = screen.getByText(
      "Análisis forense de memoria de host Windows sospechoso de exfiltración. Identificación de conexiones, sesiones web cifradas (T1071.001) y uso de LOLApps. Reconstrucción de actividad vía UserAssist.",
    );
    expect(summaryEl).toBeInTheDocument();
    expect(summaryEl.className).not.toContain("line-clamp");
  });
});
