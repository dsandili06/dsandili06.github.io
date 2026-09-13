import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Nav } from "@/components/sections/Nav";

describe("Nav component", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renders navigation brand and desktop links", () => {
    render(<Nav />);
    expect(screen.getByLabelText("Inicio")).toBeInTheDocument();
    expect(screen.getAllByText("About").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Proyectos").length).toBeGreaterThan(0);
  });

  it("renders navigation links in the updated order", () => {
    const { container } = render(<Nav />);
    const desktopLinks = Array.from(container.querySelectorAll("div.hidden.md\\:flex > a")).map(
      (a) => a.getAttribute("href"),
    );
    expect(desktopLinks).toEqual([
      "#about",
      "#formacion",
      "#proyectos",
      "#investigaciones",
      "#stack",
      "#cursos",
      "#contacto",
    ]);
  });

  it("toggles mobile menu on hamburger button click and manages body scroll lock", () => {
    render(<Nav />);
    const menuBtn = screen.getByRole("button", { name: /Abrir menú/i });
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");

    // Open menu
    fireEvent.click(menuBtn);
    expect(screen.getByRole("button", { name: /Cerrar menú/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(document.body.style.overflow).toBe("hidden");

    // Close menu via button
    const closeBtn = screen.getByRole("button", { name: /Cerrar menú/i });
    fireEvent.click(closeBtn);
    expect(screen.getByRole("button", { name: /Abrir menú/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("closes mobile menu when clicking the backdrop and unlocks body scroll", () => {
    const { container } = render(<Nav />);
    const menuBtn = screen.getByRole("button", { name: /Abrir menú/i });
    fireEvent.click(menuBtn);
    expect(document.body.style.overflow).toBe("hidden");

    // Find backdrop element
    const backdrop = container.querySelector('[role="presentation"]');
    expect(backdrop).not.toBeNull();

    // Click backdrop to close
    fireEvent.click(backdrop!);
    expect(screen.getByRole("button", { name: /Abrir menú/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("closes mobile menu and unlocks scroll when clicking a mobile link", () => {
    const { container } = render(<Nav />);
    const menuBtn = screen.getByRole("button", { name: /Abrir menú/i });
    fireEvent.click(menuBtn);
    expect(document.body.style.overflow).toBe("hidden");
    const mobileLink = container.querySelector(
      '.nav-mobile-link[href="#proyectos"]',
    ) as HTMLElement;
    expect(mobileLink).not.toBeNull();
    fireEvent.click(mobileLink);

    expect(screen.getByRole("button", { name: /Abrir menú/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("closes mobile menu when pressing Escape key and unlocks scroll", () => {
    render(<Nav />);
    const menuBtn = screen.getByRole("button", { name: /Abrir menú/i });
    fireEvent.click(menuBtn);
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: /Abrir menú/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("resets mobile menu and unlocks body scroll when window is resized to desktop width", () => {
    render(<Nav />);
    const menuBtn = screen.getByRole("button", { name: /Abrir menú/i });
    fireEvent.click(menuBtn);
    expect(document.body.style.overflow).toBe("hidden");

    window.innerWidth = 1024;
    fireEvent(window, new Event("resize"));

    expect(screen.getByRole("button", { name: /Abrir menú/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("omits backdrop-blur on nav root when menu is open to prevent containing-block trap, and drawer has data-lenis-prevent", () => {
    const { container } = render(<Nav />);
    const nav = container.querySelector("nav")!;
    expect(nav.className).toContain("backdrop-blur-xl");

    const menuBtn = screen.getByRole("button", { name: /Abrir menú/i });
    fireEvent.click(menuBtn);

    // When open, backdrop-blur is disabled on nav so fixed inset-0 spans full viewport
    expect(nav.className).not.toContain("backdrop-blur-xl");

    const drawer = container.querySelector("[data-lenis-prevent]");
    expect(drawer).not.toBeNull();
    expect(drawer?.className).toContain("overflow-y-auto");
  });
});
