import { StrictMode, type PropsWithChildren } from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useOverlayLifecycle } from "@/hooks/useOverlayLifecycle";

const { lenis, lenisAvailable } = vi.hoisted(() => ({
  lenis: { stop: vi.fn(), start: vi.fn() },
  lenisAvailable: { current: true },
}));

vi.mock("@/lib/lenis", () => ({
  getLenis: () => (lenisAvailable.current ? lenis : undefined),
}));

type OverlayProbeProps = {
  isOpen?: boolean;
  onEscape?: () => boolean;
};

function OverlayProbe({ isOpen = true, onEscape }: OverlayProbeProps) {
  const { overlayRef } = useOverlayLifecycle({ isOpen, onEscape });
  return <div ref={overlayRef} data-open={isOpen} />;
}

describe("useOverlayLifecycle", () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
    lenisAvailable.current = true;
    vi.clearAllMocks();
  });

  it("shares the body lock and Lenis lease until the last overlay node unmounts", () => {
    document.body.style.overflow = "clip";
    const view = render(
      <>
        <OverlayProbe key="parent" />
        <OverlayProbe key="child" />
      </>,
    );

    expect(document.body.style.overflow).toBe("hidden");
    expect(lenis.stop).toHaveBeenCalledTimes(1);

    view.rerender(<OverlayProbe key="child" />);
    expect(document.body.style.overflow).toBe("hidden");
    expect(lenis.start).not.toHaveBeenCalled();

    view.unmount();
    expect(document.body.style.overflow).toBe("clip");
    expect(lenis.start).toHaveBeenCalledTimes(1);
  });

  it("keeps the lock through an exit state and releases it when the visual node unmounts", () => {
    document.body.style.overflow = "scroll";
    const view = render(<OverlayProbe isOpen />);
    view.rerender(<OverlayProbe isOpen={false} />);

    expect(document.body.style.overflow).toBe("hidden");
    expect(lenis.stop).toHaveBeenCalledTimes(1);
    expect(lenis.start).not.toHaveBeenCalled();

    view.unmount();
    expect(document.body.style.overflow).toBe("scroll");
    expect(lenis.start).toHaveBeenCalledTimes(1);
  });

  it("locks and restores body scrolling when Lenis is unavailable", () => {
    lenisAvailable.current = false;
    document.body.style.overflow = "scroll";
    const view = render(<OverlayProbe />);

    expect(document.body.style.overflow).toBe("hidden");
    expect(lenis.stop).not.toHaveBeenCalled();
    view.unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("sends Escape only to the top overlay and lets a rejecting top pass it through", () => {
    const parentEscape = vi.fn(() => true);
    const childEscape = vi.fn(() => true);
    const view = render(
      <>
        <OverlayProbe key="parent" onEscape={parentEscape} />
        <OverlayProbe key="child" onEscape={childEscape} />
      </>,
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(childEscape).toHaveBeenCalledTimes(1);
    expect(parentEscape).not.toHaveBeenCalled();

    const blockedEscape = vi.fn(() => false);
    view.rerender(
      <>
        <OverlayProbe key="parent" onEscape={parentEscape} />
        <OverlayProbe key="child" onEscape={blockedEscape} />
      </>,
    );
    const event = new KeyboardEvent("keydown", { key: "Escape", cancelable: true });
    act(() => window.dispatchEvent(event));
    expect(blockedEscape).toHaveBeenCalledTimes(1);
    expect(parentEscape).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);

    const closingChildEscape = vi.fn(() => true);
    view.rerender(
      <>
        <OverlayProbe key="parent" onEscape={parentEscape} />
        <OverlayProbe key="child" isOpen={false} onEscape={closingChildEscape} />
      </>,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(closingChildEscape).not.toHaveBeenCalled();
    expect(parentEscape).not.toHaveBeenCalled();

    view.rerender(<OverlayProbe key="parent" onEscape={parentEscape} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(parentEscape).toHaveBeenCalledTimes(1);
  });

  it("keeps one active lease after StrictMode effect replay", () => {
    document.body.style.overflow = "clip";
    const onEscape = vi.fn(() => true);
    const wrapper = ({ children }: PropsWithChildren) => <StrictMode>{children}</StrictMode>;
    const view = render(wrapper({ children: <OverlayProbe onEscape={onEscape} /> }));

    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onEscape).toHaveBeenCalledTimes(1);

    view.unmount();
    expect(document.body.style.overflow).toBe("clip");
  });
});
