import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { CommandPalette } from "@/components/CommandPalette";
import { openCommandPalette } from "@/hooks/useCommandPalette";

vi.mock("@/components/WriteupModal", () => new Promise(() => {}));

describe("CommandPalette", () => {
  beforeEach(() => {
    // Reset body style
    document.body.style.overflow = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not render dialog initially", () => {
    render(<CommandPalette />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens when openCommandPalette() is called", () => {
    render(<CommandPalette />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    act(() => {
      openCommandPalette();
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Buscar casos, herramientas, certificaciones o secciones..."),
    ).toBeInTheDocument();
  });

  it("opens on Ctrl+K key combination", () => {
    render(<CommandPalette />);

    act(() => {
      fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes when Escape key is pressed", async () => {
    render(<CommandPalette />);

    act(() => {
      openCommandPalette();
    });
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });

    await waitForElementToBeRemoved(dialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("restores focus to the opener after the palette closes", async () => {
    const opener = document.createElement("button");
    opener.textContent = "Open palette";
    document.body.appendChild(opener);
    opener.focus();

    render(<CommandPalette />);
    act(() => openCommandPalette());
    const dialog = screen.getByRole("dialog");
    const input = screen.getByPlaceholderText(
      "Buscar casos, herramientas, certificaciones o secciones...",
    );
    await waitFor(() => expect(document.activeElement).toBe(input));

    fireEvent.keyDown(window, { key: "Escape" });
    await waitForElementToBeRemoved(dialog);
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it("renders system sections and writeups", () => {
    render(<CommandPalette />);

    act(() => {
      openCommandPalette();
    });

    // Check presence of sections
    expect(screen.getByText("SECCIONES DEL SISTEMA")).toBeInTheDocument();
    expect(screen.getByText("Sobre Mí")).toBeInTheDocument();
    expect(screen.getByText("Labs & Investigaciones DFIR")).toBeInTheDocument();
    expect(screen.getByText("Proyectos & Repositorios")).toBeInTheDocument();
    expect(
      screen.getByText("Perfil profesional, trayectoria en Blue Team y enfoque operacional"),
    ).toBeInTheDocument();

    // Check presence of investigations
    expect(screen.getByText("INVESTIGACIONES & WRITEUPS DFIR")).toBeInTheDocument();
    expect(screen.getByText("FakeGPT")).toBeInTheDocument();
    expect(screen.getByText("3CX Supply Chain")).toBeInTheDocument();
  });

  it("finds the obtained CompTIA Security+ credential and opens its certificate", () => {
    render(<CommandPalette />);
    act(() => openCommandPalette());

    fireEvent.change(
      screen.getByPlaceholderText("Buscar casos, herramientas, certificaciones o secciones..."),
      { target: { value: "SY0-701" } },
    );

    expect(screen.getByText("OBTENIDA")).toBeInTheDocument();
    fireEvent.click(screen.getByText("CompTIA Security+"));

    expect(screen.getByRole("dialog", { name: "CompTIA Security+" })).toBeInTheDocument();
    expect(screen.getByText(/Professor Messer/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /CERTIFICADO OFICIAL/i }));
    expect(screen.getByAltText("CompTIA Security+")).toHaveAttribute(
      "src",
      "/certs/comptia-security-plus-sy0-701.webp",
    );
  });

  it("provides 44px touch targets for compact actions and every command item", () => {
    render(<CommandPalette />);
    act(() => openCommandPalette());

    const closeButton = screen.getByRole("button", { name: "Cerrar paleta de comandos" });
    expect(closeButton.className).toContain("size-11");
    expect(closeButton.className).toContain("min-h-[44px]");
    expect(closeButton.className).toContain("min-w-[44px]");

    const commandItems = Array.from(document.querySelectorAll<HTMLElement>("[cmdk-item]"));
    expect(commandItems.length).toBeGreaterThan(0);
    for (const item of commandItems) {
      expect(item.className).toContain("min-h-[44px]");
    }

    fireEvent.change(
      screen.getByPlaceholderText("Buscar casos, herramientas, certificaciones o secciones..."),
      { target: { value: "FakeGPT" } },
    );
    const clearButton = screen.getByRole("button", { name: "LIMPIAR" });
    expect(clearButton.className).toContain("min-h-[44px]");
    expect(clearButton.className).toContain("min-w-[44px]");
  });

  it("selects a registry section and navigates after the palette exits", async () => {
    const section = document.createElement("section");
    section.id = "formacion";
    section.scrollIntoView = vi.fn();
    document.body.appendChild(section);

    render(<CommandPalette />);
    act(() => openCommandPalette());
    fireEvent.click(screen.getByText("Certificaciones"));
    expect(document.body.style.overflow).toBe("hidden");

    await waitFor(() =>
      expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" }),
    );
    expect(document.body.style.overflow).toBe("");
    expect(window.location.hash).toBe("#formacion");
    section.remove();
    history.replaceState(null, "", window.location.pathname);
  });

  it("uses an instant fallback scroll when reduced motion is preferred", async () => {
    const section = document.createElement("section");
    section.id = "formacion";
    section.scrollIntoView = vi.fn();
    document.body.appendChild(section);
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<CommandPalette />);
    act(() => openCommandPalette());
    fireEvent.click(screen.getByText("Certificaciones"));

    await waitFor(() => expect(section.scrollIntoView).toHaveBeenCalledWith({ behavior: "auto" }));
    section.remove();
    history.replaceState(null, "", window.location.pathname);
  });

  it("filters items when search text is entered", () => {
    render(<CommandPalette />);

    act(() => {
      openCommandPalette();
    });

    const input = screen.getByPlaceholderText(
      "Buscar casos, herramientas, certificaciones o secciones...",
    );

    act(() => {
      fireEvent.change(input, { target: { value: "FakeGPT" } });
    });

    expect(screen.getByText("FakeGPT")).toBeInTheDocument();
  });

  it("copies analyst email to clipboard on select", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<CommandPalette />);

    act(() => {
      openCommandPalette();
    });

    const copyItem = screen.getByText(/Copiar correo del analista/i);
    await act(async () => {
      fireEvent.click(copyItem);
    });

    expect(writeTextMock).toHaveBeenCalledWith("sdsandili06@gmail.com");
  });

  it("announces the lazy writeup viewer while its module loads", () => {
    render(<CommandPalette />);
    act(() => openCommandPalette());

    fireEvent.click(screen.getByText("FakeGPT"));

    const fallback = screen.getByText("Cargando visor del writeup...");
    expect(fallback).toHaveAttribute("role", "status");
    expect(fallback).toHaveAttribute("aria-live", "polite");
  });
});
