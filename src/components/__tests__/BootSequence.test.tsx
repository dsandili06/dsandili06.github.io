import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { BootSequence } from "@/components/fx/BootSequence";

const mockMatchMedia = (reduced: boolean) =>
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    matches: reduced && query === "(prefers-reduced-motion: reduce)",
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

describe("BootSequence", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("shows the final text immediately and calls onDone once with reduced motion", () => {
    vi.useFakeTimers();
    mockMatchMedia(true);
    const onDone = vi.fn();

    const { container } = render(<BootSequence onDone={onDone} />);

    expect(container.textContent).toContain("[RUN]  Santiago Daniel Sandili >");
    expect(container.textContent).toContain("[INIT] Cargando perfil analista...");
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("types progressively and eventually calls onDone without reduced motion", () => {
    vi.useFakeTimers();
    mockMatchMedia(false);
    const onDone = vi.fn();

    const { container } = render(<BootSequence onDone={onDone} />);

    expect(onDone).not.toHaveBeenCalled();
    expect(container.textContent).not.toContain("[RUN]");

    for (let i = 0; i < 500 && onDone.mock.calls.length === 0; i++) {
      act(() => {
        vi.advanceTimersByTime(100);
      });
    }

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain("[RUN]  Santiago Daniel Sandili >");
  });
});
