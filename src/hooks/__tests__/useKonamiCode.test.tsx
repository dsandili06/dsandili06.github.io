import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKonamiCode } from "@/hooks/useKonamiCode";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function fireKey(key: string) {
  window.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
}

describe("useKonamiCode", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should call onActivate when Konami code is entered", () => {
    const onActivate = vi.fn();
    renderHook(() => useKonamiCode(onActivate));

    KONAMI_SEQUENCE.forEach((key) => fireKey(key));

    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it("should NOT activate when keys are wrong", () => {
    const onActivate = vi.fn();
    renderHook(() => useKonamiCode(onActivate));

    // Wrong sequence
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].forEach((key) => fireKey(key));

    expect(onActivate).not.toHaveBeenCalled();
  });

  it("should NOT activate when typing in an input", () => {
    const onActivate = vi.fn();
    renderHook(() => useKonamiCode(onActivate));

    const input = document.createElement("input");
    document.body.appendChild(input);

    KONAMI_SEQUENCE.forEach((key) => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    });

    expect(onActivate).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });
});
