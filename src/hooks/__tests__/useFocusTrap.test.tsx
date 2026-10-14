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

  it("includes embedded PDF frames in the keyboard focus cycle", () => {
    const { container } = render(
      <TrapTest>
        <button data-testid="first">First</button>
        <iframe title="Certificate PDF" />
      </TrapTest>,
    );

    const first = screen.getByTestId("first");
    const frame = container.querySelector("iframe")!;
    first.focus();
    fireEvent.keyDown(first, { key: "Tab", shiftKey: true });

    expect(document.activeElement).toBe(frame);
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

  it("restores focus to the nested overlay opener and leaves the parent trap active", () => {
    function NestedTraps({ showChild }: { showChild: boolean }) {
      const parentRef = useFocusTrap<HTMLDivElement>();
      return (
        <div ref={parentRef} data-testid="parent-trap">
          <button type="button">Parent opener</button>
          {showChild && <ChildTrap />}
          <button type="button">Parent last</button>
        </div>
      );
    }
    function ChildTrap() {
      const childRef = useFocusTrap<HTMLDivElement>();
      return (
        <div ref={childRef} data-testid="child-trap">
          <button type="button">Child action</button>
        </div>
      );
    }

    const { rerender } = render(<NestedTraps showChild />);
    const opener = screen.getByRole("button", { name: "Parent opener" });
    const childAction = screen.getByRole("button", { name: "Child action" });
    opener.focus();
    rerender(<NestedTraps showChild={false} />);

    expect(document.activeElement).toBe(opener);
    fireEvent.keyDown(opener, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Parent last" }));
  });

  it("preserves focus in a child overlay when its parent exits first, then restores the outer opener", () => {
    function ParentTrap() {
      const ref = useFocusTrap<HTMLDivElement>();
      return (
        <div ref={ref} data-testid="parent-trap">
          <button type="button">Palette result</button>
        </div>
      );
    }
    function ChildTrap() {
      const ref = useFocusTrap<HTMLDivElement>();
      return (
        <div ref={ref} data-testid="child-trap">
          <button type="button">Modal close</button>
        </div>
      );
    }

    const outside = document.getElementById("outside-btn")!;
    outside.focus();
    const { rerender } = render(
      <>
        <ParentTrap key="parent" />
        <ChildTrap key="child" />
      </>,
    );
    const childControl = screen.getByRole("button", { name: "Modal close" });
    expect(document.activeElement).toBe(childControl);

    rerender(<ChildTrap key="child" />);
    expect(document.activeElement).toBe(childControl);

    rerender(<></>);
    expect(document.activeElement).toBe(outside);
  });
});
