import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useActiveSection } from "@/hooks/useActiveSection";

describe("useActiveSection", () => {
  const links = [
    { href: "#about", id: "about", label: "About" },
    { href: "#stack", id: "stack", label: "Stack" },
    { href: "#contacto", id: "contacto", label: "Contacto" },
  ];

  beforeEach(() => {
    // Set up DOM elements
    links.forEach((l) => {
      const el = document.createElement("section");
      el.id = l.id;
      el.style.height = "600px";
      document.body.appendChild(el);
    });
    // Set body height large enough for scrolling
    Object.defineProperty(document.body, "offsetHeight", {
      configurable: true,
      value: 3000,
    });
  });

  afterEach(() => {
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) el.remove();
    });
  });

  it("should return first section as active initially", () => {
    // Mock getBoundingClientRect for all sections properly
    const aboutEl = document.getElementById("about")!;
    vi.spyOn(aboutEl, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 600,
      height: 600,
      width: 800,
      left: 0,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    const stackEl = document.getElementById("stack")!;
    vi.spyOn(stackEl, "getBoundingClientRect").mockReturnValue({
      top: 800,
      bottom: 1400,
      height: 600,
      width: 800,
      left: 0,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    const contactoEl = document.getElementById("contacto")!;
    vi.spyOn(contactoEl, "getBoundingClientRect").mockReturnValue({
      top: 1600,
      bottom: 2200,
      height: 600,
      width: 800,
      left: 0,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    const { result } = renderHook(() => useActiveSection(links));
    // First section with top <= probe(120) wins, but about has top=0 so it's active
    expect(result.current).toBe("about");
  });

  it("should update active section on scroll", () => {
    // Mock all getBoundingClientRects so about is above viewport, stack is at top
    const aboutEl = document.getElementById("about")!;
    vi.spyOn(aboutEl, "getBoundingClientRect").mockReturnValue({
      top: -300,
      bottom: 300,
      height: 600,
      width: 800,
      left: 0,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    const stackEl = document.getElementById("stack")!;
    vi.spyOn(stackEl, "getBoundingClientRect").mockReturnValue({
      top: 0,
      bottom: 600,
      height: 600,
      width: 800,
      left: 0,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    const contactoEl = document.getElementById("contacto")!;
    vi.spyOn(contactoEl, "getBoundingClientRect").mockReturnValue({
      top: 800,
      bottom: 1400,
      height: 600,
      width: 800,
      left: 0,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    const { result } = renderHook(() => useActiveSection(links));

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe("stack");
  });
});
