import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import { StrictMode, type PropsWithChildren } from "react";
import { useModalHistory } from "@/hooks/useModalHistory";

describe("useModalHistory", () => {
  let pushStateSpy: ReturnType<typeof vi.spyOn>;
  let backSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    pushStateSpy = vi.spyOn(window.history, "pushState").mockImplementation(() => {});
    backSpy = vi.spyOn(window.history, "back").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    act(() => window.dispatchEvent(new PopStateEvent("popstate")));
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("pushes history state on mount when isOpen is true", () => {
    const onClose = vi.fn();
    renderHook(() =>
      useModalHistory({
        isOpen: true,
        onClose,
        stateData: { modal: "writeup", id: "LAB_001" },
      }),
    );

    expect(pushStateSpy).toHaveBeenCalledTimes(1);
    expect(pushStateSpy).toHaveBeenCalledWith(
      { modal: "writeup", id: "LAB_001" },
      "",
      window.location.href,
    );
  });

  it("does not duplicate history entries under StrictMode effect replay", () => {
    const onClose = vi.fn();
    const wrapper = ({ children }: PropsWithChildren) => <StrictMode>{children}</StrictMode>;

    renderHook(() => useModalHistory({ onClose }), { wrapper });

    expect(pushStateSpy).toHaveBeenCalledTimes(1);
    act(() => window.dispatchEvent(new PopStateEvent("popstate")));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not push history state when isOpen is false", () => {
    const onClose = vi.fn();
    renderHook(() =>
      useModalHistory({
        isOpen: false,
        onClose,
        stateData: { modal: "writeup", id: "LAB_001" },
      }),
    );

    expect(pushStateSpy).not.toHaveBeenCalled();
  });

  it("calls onClose when popstate event fires (mobile back gesture)", () => {
    const onClose = vi.fn();
    renderHook(() =>
      useModalHistory({
        isOpen: true,
        onClose,
        stateData: { modal: "writeup", id: "LAB_001" },
      }),
    );

    expect(pushStateSpy).toHaveBeenCalledTimes(1);

    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    // Browser already popped the state, so history.back must NOT be called
    expect(backSpy).not.toHaveBeenCalled();
  });

  it("reverts history and calls onClose when handleClose is invoked (X button / ESC)", () => {
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useModalHistory({
        isOpen: true,
        onClose,
        stateData: { modal: "writeup", id: "LAB_001" },
      }),
    );

    expect(pushStateSpy).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.handleClose();
    });

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    // Any delayed popstate event triggered by history.back must not call onClose again
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("reverts history when isOpen transitions from true to false", () => {
    const onClose = vi.fn();
    const { rerender } = renderHook(
      ({ isOpen }) =>
        useModalHistory({
          isOpen,
          onClose,
        }),
      { initialProps: { isOpen: true } },
    );

    expect(backSpy).not.toHaveBeenCalled();
    rerender({ isOpen: false });
    expect(backSpy).toHaveBeenCalledTimes(1);
    act(() => window.dispatchEvent(new PopStateEvent("popstate")));
  });

  it("defers a new modal history entry until a pending programmatic back settles", () => {
    const closedFirst = vi.fn();
    const first = renderHook(() => useModalHistory({ onClose: closedFirst }));

    act(() => first.result.current.handleClose());
    expect(backSpy).toHaveBeenCalledTimes(1);
    first.unmount();

    const closedSecond = vi.fn();
    const second = renderHook(() => useModalHistory({ onClose: closedSecond }));
    expect(pushStateSpy).toHaveBeenCalledTimes(1);

    // The first pop is the asynchronous result of closing the previous modal.
    act(() => window.dispatchEvent(new PopStateEvent("popstate")));
    expect(closedSecond).not.toHaveBeenCalled();
    expect(pushStateSpy).toHaveBeenCalledTimes(2);

    // A subsequent, user-initiated back closes the newly opened modal.
    act(() => window.dispatchEvent(new PopStateEvent("popstate")));

    expect(closedSecond).toHaveBeenCalledTimes(1);
    second.unmount();
  });

  it("waits for all pending back traversals before pushing deferred overlays", () => {
    const first = renderHook(() => useModalHistory({ onClose: vi.fn() }));
    const second = renderHook(() => useModalHistory({ onClose: vi.fn() }));
    act(() => second.result.current.handleClose());
    act(() => first.result.current.handleClose());
    expect(backSpy).toHaveBeenCalledTimes(2);

    const onClose = vi.fn();
    const next = renderHook(() => useModalHistory({ onClose }));
    expect(pushStateSpy).toHaveBeenCalledTimes(2);

    act(() => window.dispatchEvent(new PopStateEvent("popstate")));
    expect(pushStateSpy).toHaveBeenCalledTimes(2);
    expect(onClose).not.toHaveBeenCalled();

    act(() => window.dispatchEvent(new PopStateEvent("popstate")));
    expect(pushStateSpy).toHaveBeenCalledTimes(3);
    expect(onClose).not.toHaveBeenCalled();

    act(() => window.dispatchEvent(new PopStateEvent("popstate")));
    expect(onClose).toHaveBeenCalledTimes(1);

    first.unmount();
    second.unmount();
    next.unmount();
  });

  it("does not call history.back on unmount if modal was closed via popstate", () => {
    const onClose = vi.fn();
    const { unmount } = renderHook(() =>
      useModalHistory({
        isOpen: true,
        onClose,
      }),
    );

    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(onClose).toHaveBeenCalledTimes(1);

    unmount();
    // backSpy must not be called because browser already handled pop
    expect(backSpy).not.toHaveBeenCalled();
  });

  it("does not call history.back on unmount if handleClose was already executed", () => {
    const onClose = vi.fn();
    const { result, unmount } = renderHook(() =>
      useModalHistory({
        isOpen: true,
        onClose,
      }),
    );

    act(() => {
      result.current.handleClose();
    });

    expect(backSpy).toHaveBeenCalledTimes(1);
    act(() => window.dispatchEvent(new PopStateEvent("popstate")));

    unmount();
    // Should still only have been called once from handleClose
    expect(backSpy).toHaveBeenCalledTimes(1);
  });

  it("closes only the history-top modal on popstate", () => {
    const lowerClose = vi.fn();
    const upperClose = vi.fn();
    const lower = renderHook(() => useModalHistory({ onClose: lowerClose }));
    const upper = renderHook(() => useModalHistory({ onClose: upperClose }));

    act(() => window.dispatchEvent(new PopStateEvent("popstate")));

    expect(upperClose).toHaveBeenCalledTimes(1);
    expect(lowerClose).not.toHaveBeenCalled();
    expect(backSpy).not.toHaveBeenCalled();

    act(() => lower.result.current.handleClose());
    expect(lowerClose).toHaveBeenCalledTimes(1);
    lower.unmount();
    upper.unmount();
  });

  it("ignores the delayed pop for an explicit top close instead of closing the lower modal", () => {
    const lowerClose = vi.fn();
    const upperClose = vi.fn();
    const lower = renderHook(() => useModalHistory({ onClose: lowerClose }));
    const upper = renderHook(() => useModalHistory({ onClose: upperClose }));

    act(() => upper.result.current.handleClose());
    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(upperClose).toHaveBeenCalledTimes(1);
    expect(lowerClose).not.toHaveBeenCalled();

    act(() => window.dispatchEvent(new PopStateEvent("popstate")));
    expect(lowerClose).not.toHaveBeenCalled();

    act(() => lower.result.current.handleClose());
    expect(lowerClose).toHaveBeenCalledTimes(1);
    lower.unmount();
    upper.unmount();
  });

  it("closes an out-of-order modal without navigating back over the upper entry", () => {
    const lowerClose = vi.fn();
    const upperClose = vi.fn();
    const lower = renderHook(() => useModalHistory({ onClose: lowerClose }));
    const upper = renderHook(() => useModalHistory({ onClose: upperClose }));

    act(() => lower.result.current.handleClose());

    expect(backSpy).not.toHaveBeenCalled();
    expect(lowerClose).toHaveBeenCalledTimes(1);
    expect(upperClose).not.toHaveBeenCalled();
    act(() => window.dispatchEvent(new PopStateEvent("popstate")));
    expect(upperClose).toHaveBeenCalledTimes(1);

    lower.unmount();
    upper.unmount();
  });
});
