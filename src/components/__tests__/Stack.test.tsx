import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Stack } from "@/components/sections/Stack";
import { STACK_GROUPS } from "@/data/stack";

describe("Stack section - SOC Workstation Deck", () => {
  it("renders the section header with number 05 and tooling kicker", () => {
    render(<Stack />);
    expect(screen.getByText(/SECTION_05 \/\/ TOOLING/i)).toBeInTheDocument();
  });

  it("renders all 4 category selectors with their exact titles", () => {
    render(<Stack />);

    // Selector buttons
    expect(screen.getByRole("button", { name: /FORENSE & TRIAGE/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /MALWARE ANALYSIS/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /SIEM & NETWORK/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /SCRIPTING & OSINT/i })).toBeInTheDocument();
  });

  it("renders initial domain tools (FORENSE & TRIAGE) by default", () => {
    render(<Stack />);

    const forenseGroup = STACK_GROUPS.find((g) => g.title === "FORENSE & TRIAGE")!;
    for (const tool of forenseGroup.items) {
      expect(screen.getByText(tool)).toBeInTheDocument();
    }
  });

  it("switches domain on category click and displays respective tools", () => {
    render(<Stack />);

    // Switch to SIEM & NETWORK
    const siemBtn = screen.getByRole("button", { name: /SIEM & NETWORK/i });
    fireEvent.click(siemBtn);

    const siemGroup = STACK_GROUPS.find((g) => g.title === "SIEM & NETWORK")!;
    for (const tool of siemGroup.items) {
      expect(screen.getByText(tool)).toBeInTheDocument();
    }
  });

  it("renders the steady telemetry status readout", () => {
    render(<Stack />);
    expect(screen.getByText(/STATUS \/\//i)).toBeInTheDocument();
    expect(screen.getByText(/TOOLS READY/i)).toBeInTheDocument();
    expect(screen.queryByText(/INSPECTING/i)).not.toBeInTheDocument();
  });
});
