import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitForElementToBeRemoved } from "@testing-library/react";
import { CommandPalette } from "@/components/CommandPalette";
import { openCommandPalette } from "@/hooks/useCommandPalette";

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

  it("renders system sections and writeups", () => {
    render(<CommandPalette />);

    act(() => {
      openCommandPalette();
    });

    // Check presence of sections
    expect(screen.getByText("SECCIONES DEL SISTEMA")).toBeInTheDocument();
    expect(screen.getByText("Sobre Mí")).toBeInTheDocument();
    expect(screen.getByText("Labs & Investigaciones DFIR")).toBeInTheDocument();

    // Check presence of investigations
    expect(screen.getByText("INVESTIGACIONES & WRITEUPS DFIR")).toBeInTheDocument();
    expect(screen.getByText("FakeGPT")).toBeInTheDocument();
    expect(screen.getByText("3CX Supply Chain")).toBeInTheDocument();
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
});
