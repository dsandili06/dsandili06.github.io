import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useModalHistory } from "@/hooks/useModalHistory";

describe("useModalHistory", () => {
  let pushStateSpy: ReturnType<typeof vi.spyOn>;
  let backSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    pushStateSpy = vi.spyOn(window.history, "pushState").mockImplementation(() => {});
    backSpy = vi.spyOn(window.history, "back").mockImplementation(() => {});
  });

  afterEach(() => {
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
    expect(pushStateSpy).toHaveBeenCalledWith({ modal: "writeup", id: "LAB_001" }, "");
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

  it("reverts history on unmount if modal was open and not closed by popstate", () => {
    const onClose = vi.fn();
    const { unmount } = renderHook(() =>
      useModalHistory({
        isOpen: true,
        onClose,
      }),
    );

    expect(backSpy).not.toHaveBeenCalled();
    unmount();
    expect(backSpy).toHaveBeenCalledTimes(1);
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

    unmount();
    // Should still only have been called once from handleClose
    expect(backSpy).toHaveBeenCalledTimes(1);
  });
});
