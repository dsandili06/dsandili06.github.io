import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { TerminalWindow } from "@/components/fx/TerminalWindow";

describe("TerminalWindow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not passively focus the input element when boot animation completes", () => {
    render(<TerminalWindow start={true} />);

    // Fast-forward past the entire auto-typing boot sequence (allowing React state updates between lines)
    for (let i = 0; i < 15; i++) {
      act(() => {
        vi.advanceTimersByTime(500);
      });
    }

    const input = screen.getByLabelText("Terminal input");
    expect(input).toBeInTheDocument();

    // Verify input is NOT actively focused without user interaction
    expect(document.activeElement).not.toBe(input);
  });

  it("focuses input when user clicks on the terminal container", () => {
    const { container } = render(<TerminalWindow start={true} />);

    for (let i = 0; i < 15; i++) {
      act(() => {
        vi.advanceTimersByTime(500);
      });
    }

    const input = screen.getByLabelText("Terminal input");
    expect(document.activeElement).not.toBe(input);

    // Click terminal container
    const terminalDiv = container.firstChild as HTMLElement;
    fireEvent.click(terminalDiv);

    expect(document.activeElement).toBe(input);
  });
});
