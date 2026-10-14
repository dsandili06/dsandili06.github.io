import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Nav } from "@/components/sections/Nav";

describe("Nav component", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
    delete (window as unknown as Record<string, unknown>).__lenis;
  });

  it("renders navigation brand and desktop links", () => {
    render(<Nav />);
    expect(screen.getByRole("navigation", { name: "Navegación principal" })).toBeInTheDocument();
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
    expect(
      Array.from(container.querySelectorAll("div.hidden.md\\:flex > a")).map((a) =>
        a.textContent?.trim(),
      ),
    ).toEqual(["About", "Certs", "Proyectos", "Labs", "Stack", "Cursos", "Contacto"]);
  });

  it("toggles mobile menu on hamburger button click and manages body scroll lock", async () => {
    render(<Nav />);
    const menuBtn = screen.getByRole("button", { name: /Abrir menú/i });
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    expect(document.body.style.overflow).toBe("");

    // Open menu
    fireEvent.click(menuBtn);
    expect(screen.getByRole("button", { name: /^Cerrar menú$/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(document.body.style.overflow).toBe("hidden");

    // Close menu via button
    const closeBtn = screen.getByRole("button", { name: /^Cerrar menú$/i });
    fireEvent.click(closeBtn);
    expect(screen.getByRole("button", { name: /Abrir menú/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });

  it("exposes the mobile drawer as a named modal connected to its trigger", () => {
    render(<Nav />);
    const menuButton = screen.getByRole("button", { name: /Abrir menú/i });

    expect(menuButton).toHaveAttribute("aria-controls", "mobile-navigation-drawer");
    expect(menuButton).toHaveAttribute("aria-haspopup", "dialog");

    fireEvent.click(menuButton);
    const drawer = screen.getByRole("dialog", { name: "Menú principal" });
    expect(drawer).toHaveAttribute("id", "mobile-navigation-drawer");
    expect(drawer).toHaveAttribute("aria-modal", "true");
    expect(drawer.className).toContain("top-[calc(3.5rem+env(safe-area-inset-top))]");
    expect(drawer.className).toContain(
      "max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))]",
    );
    expect(drawer.querySelector('button[aria-label="Cerrar menú móvil"]')).toBeInTheDocument();
  });

  it("keeps body scroll locked until the backdrop exit completes", async () => {
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
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });

  it("unlocks scroll and navigates after the mobile drawer exits", async () => {
    const lenis = { stop: vi.fn(), start: vi.fn(), scrollTo: vi.fn() };
    (window as unknown as Record<string, unknown>).__lenis = lenis;
    const target = document.createElement("section");
    target.id = "proyectos";
    document.body.appendChild(target);
    const { container } = render(<Nav />);
    const menuBtn = screen.getByRole("button", { name: /Abrir menú/i });
    fireEvent.click(menuBtn);
    expect(document.body.style.overflow).toBe("hidden");
    expect(lenis.stop).toHaveBeenCalledTimes(1);
    const mobileLink = container.querySelector(
      '.nav-mobile-link[href="#proyectos"]',
    ) as HTMLElement;
    expect(mobileLink).not.toBeNull();
    fireEvent.click(mobileLink);

    expect(screen.getByRole("button", { name: /Abrir menú/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(document.body.style.overflow).toBe("hidden");
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
    expect(lenis.start).toHaveBeenCalledTimes(1);
    expect(lenis.scrollTo).toHaveBeenCalledWith(target, { offset: 0 });
    expect(window.location.hash).toBe("#proyectos");
    target.remove();
    history.replaceState(null, "", window.location.pathname);
  });

  it("focuses the mobile drawer on open and restores focus to its trigger on close", async () => {
    render(<Nav />);
    const menuButton = screen.getByRole("button", { name: /Abrir menú/i });
    menuButton.focus();
    fireEvent.click(menuButton);

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cerrar menú móvil" }));

    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(document.activeElement).toBe(menuButton));
  });

  it("keeps body scroll locked until Escape exit completes", async () => {
    render(<Nav />);
    const menuBtn = screen.getByRole("button", { name: /Abrir menú/i });
    fireEvent.click(menuBtn);
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("button", { name: /Abrir menú/i })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });

  it("keeps body scroll locked until resize exit completes", async () => {
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
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
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
