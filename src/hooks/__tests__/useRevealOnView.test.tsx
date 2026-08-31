import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRevealOnView } from "@/hooks/useRevealOnView";

// Polyfill requestAnimationFrame so the in-view class gets added synchronously
beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useRevealOnView", () => {
  beforeEach(() => {
    const el = document.createElement("section");
    el.id = "test-section";
    el.setAttribute("data-reveal", "");
    document.body.appendChild(el);
  });

  afterEach(() => {
    const el = document.getElementById("test-section");
    if (el) el.remove();
  });

  it("should add reveal-on-view class to elements with data-reveal", () => {
    renderHook(() => useRevealOnView());

    const el = document.getElementById("test-section")!;
    expect(el.classList.contains("reveal-on-view")).toBe(true);
  });

  it("should add in-view class for immediate intersection", () => {
    renderHook(() => useRevealOnView());

    const el = document.getElementById("test-section")!;
    // The mock IntersectionObserver + requestAnimationFrame fires synchronously
    expect(el.classList.contains("in-view")).toBe(true);
  });
});
