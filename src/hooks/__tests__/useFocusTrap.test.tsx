import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

function TrapTest({ children }: { children: React.ReactNode }) {
  const ref = useFocusTrap<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="trap-container">
      {children}
    </div>
  );
}

describe("useFocusTrap", () => {
  beforeEach(() => {
    // Add a focusable element outside the trap
    const outside = document.createElement("button");
    outside.id = "outside-btn";
    outside.textContent = "Outside";
    document.body.appendChild(outside);
  });

  afterEach(() => {
    const btn = document.getElementById("outside-btn");
    if (btn) btn.remove();
    document.body.innerHTML = "";
  });

  it("focuses the first focusable element on mount", () => {
    const { container } = render(
      <TrapTest>
        <button data-testid="btn-1">First</button>
        <button data-testid="btn-2">Last</button>
      </TrapTest>,
    );

    const btn1 = screen.getByTestId("btn-1");
    expect(document.activeElement).toBe(btn1);
  });

  it("wraps Tab from last to first focusable element", () => {
    render(
      <TrapTest>
        <button data-testid="btn-1">First</button>
        <button data-testid="btn-2">Last</button>
      </TrapTest>,
    );

    const btn2 = screen.getByTestId("btn-2");
    btn2.focus();
    fireEvent.keyDown(btn2, { key: "Tab" });

    const btn1 = screen.getByTestId("btn-1");
    expect(document.activeElement).toBe(btn1);
  });

  it("wraps Shift+Tab from first to last focusable element", () => {
    render(
      <TrapTest>
        <button data-testid="btn-1">First</button>
        <button data-testid="btn-2">Last</button>
      </TrapTest>,
    );

    const btn1 = screen.getByTestId("btn-1");
    btn1.focus();
    fireEvent.keyDown(btn1, { key: "Tab", shiftKey: true });

    const btn2 = screen.getByTestId("btn-2");
    expect(document.activeElement).toBe(btn2);
  });

  it("restores focus to previously focused element on unmount", () => {
    const outsideBtn = document.getElementById("outside-btn")!;
    outsideBtn.focus();

    const { unmount } = render(
      <TrapTest>
        <button>Some button</button>
      </TrapTest>,
    );

    unmount();
    expect(document.activeElement).toBe(outsideBtn);
  });
});
