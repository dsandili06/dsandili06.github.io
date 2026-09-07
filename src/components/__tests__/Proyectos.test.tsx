import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Proyectos } from "@/components/sections/Proyectos";
import { PROJECTS } from "@/data/projects";

describe("Proyectos section - Tactical Repository Dossiers", () => {
  it("renders the section header and kicker", () => {
    render(<Proyectos />);
    expect(screen.getByRole("heading", { name: /Proyectos/i })).toBeInTheDocument();
    expect(screen.getByText(/SECTION_02 \/\/ REPOSITORIES/i)).toBeInTheDocument();
  });

  it("renders both tactical project dossier cards with titles and descriptions", () => {
    render(<Proyectos />);
    for (const p of PROJECTS) {
      expect(screen.getByRole("heading", { name: p.title })).toBeInTheDocument();
      expect(screen.getByText(p.description)).toBeInTheDocument();
    }
  });

  it("renders project IDs without domain labels or main/MIT telemetry", () => {
    render(<Proyectos />);
    expect(screen.getByText("PRJ_01")).toBeInTheDocument();
    expect(screen.getByText("PRJ_02")).toBeInTheDocument();
    expect(screen.queryByText(/LABS_SOC\.REPO/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/AUTOMATION_BT\.REPO/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\/\/ MIT/i)).not.toBeInTheDocument();
  });

  it("renders direct GitHub repository links with secure attributes", () => {
    render(<Proyectos />);
    for (const p of PROJECTS) {
      const link = screen.getByRole("link", {
        name: new RegExp(`Ver repositorio ${p.title}`, "i"),
      });
      expect(link).toHaveAttribute("href", p.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("renders verified scripts in BlueTeam-Scripts arsenal", () => {
    render(<Proyectos />);
    expect(screen.getByText("event_log_parser.py")).toBeInTheDocument();
    expect(screen.getByText("autoruns_analyzer.ps1")).toBeInTheDocument();
    expect(screen.getByText("dll_checker.ps1")).toBeInTheDocument();
    expect(screen.getByText("suspicious_powershell_detector.py")).toBeInTheDocument();
  });

  it("renders in-page bridge link from Artifakt Labs to #investigaciones", () => {
    render(<Proyectos />);
    const bridgeLink = screen.getByRole("link", { name: /Explorar Writeups \(#03\)/i });
    expect(bridgeLink).toHaveAttribute("href", "#investigaciones");
  });

  it("renders verified arsenal modules in Artifakt Labs", () => {
    render(<Proyectos />);
    expect(screen.getByText("Disk Forensics")).toBeInTheDocument();
    expect(screen.getByText("Memory Forensics")).toBeInTheDocument();
    expect(screen.getByText("Network Forensics")).toBeInTheDocument();
    expect(screen.getByText("TTPs Mapping")).toBeInTheDocument();
  });

  it("renders tactical bento metrics on both projects", () => {
    render(<Proyectos />);
    expect(screen.getByText("15+ Writeups")).toBeInTheDocument();
    expect(screen.getByText("12+ Scripts")).toBeInTheDocument();
    expect(screen.getByText("CyberDefenders · THM")).toBeInTheDocument();
    expect(screen.getByText("Blue Team · DFIR")).toBeInTheDocument();
  });

  it("renders the minimalist WIP card with animated progress bar", () => {
    render(<Proyectos />);
    expect(screen.getByText("PRJ_03")).toBeInTheDocument();
    expect(screen.getByText("EN PROCESO")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Próximo proyecto en construcción/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/ESTADO: EN DESARROLLO/i)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
