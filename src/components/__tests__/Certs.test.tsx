import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Certs } from "@/components/sections/Certs";
import { captureModalRequests } from "@/test/modalRequests";

describe("Certs section", () => {
  let capture: ReturnType<typeof captureModalRequests>;
  beforeEach(() => {
    capture = captureModalRequests();
  });
  afterEach(() => {
    capture.stop();
  });

  it("renders the section header with number 02 and credentials kicker", () => {
    render(<Certs />);
    expect(
      screen.getByRole("heading", { level: 2, name: /^Certificaciones$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/SECTION_02 \/\/ CREDENTIALS/i)).toBeInTheDocument();
  });

  it("renders Security+ first with its official score, date and issuer", () => {
    render(<Certs />);

    expect(screen.getByText("SAL1 (Security Analyst L1)")).toBeInTheDocument();
    expect(screen.getByText("Google Cybersecurity")).toBeInTheDocument();
    expect(screen.getByText("CompTIA Security+")).toBeInTheDocument();

    expect(screen.getByText("19/03/2026 · TryHackMe")).toBeInTheDocument();
    expect(screen.getByText("15/08/2026 · Google")).toBeInTheDocument();
    expect(screen.getByText("20/10/2026 · CompTIA")).toBeInTheDocument();
    expect(screen.getByText("791 / 900")).toBeInTheDocument();
    expect(screen.queryByText(/SY0-701.*Vigente hasta/i)).not.toBeInTheDocument();

    const certificationTitles = Array.from(document.querySelectorAll("h3")).map((title) =>
      title.textContent?.trim(),
    );
    expect(certificationTitles.slice(0, 3)).toEqual([
      "CompTIA Security+",
      "SAL1 (Security Analyst L1)",
      "Google Cybersecurity",
    ]);
  });

  it("renders badge logo images next to certification titles", () => {
    render(<Certs />);

    const sal1Img = screen.getByAltText("Badge SAL1 (Security Analyst L1)");
    expect(sal1Img).toHaveAttribute("src", "/badges/sal1badge.png");

    const googleImg = screen.getByAltText("Badge Google Cybersecurity");
    expect(googleImg).toHaveAttribute("src", "/badges/badgegoogle.png");

    const comptiaImg = screen.getByAltText("Badge CompTIA Security+");
    expect(comptiaImg).toHaveAttribute("src", "/badges/comptiabadge.png");
  });

  it("requests the certificate modal on click without redirecting", () => {
    render(<Certs />);

    fireEvent.click(screen.getByRole("button", { name: /Google Cybersecurity/i }));

    expect(capture.requests).toEqual([{ type: "cert", id: "google" }]);
  });

  it("requests the SAL1 certificate modal on click", () => {
    render(<Certs />);

    fireEvent.click(screen.getByRole("button", { name: /SAL1 \(Security Analyst L1\)/i }));

    expect(capture.requests).toEqual([{ type: "cert", id: "sal1" }]);
  });

  it("does not expose preparation tracking on the obtained CompTIA card", () => {
    render(<Certs />);

    expect(screen.queryByText("ÚLTIMO SCORE")).not.toBeInTheDocument();
    expect(screen.queryByText("VER SEGUIMIENTO DE SIMULACROS →")).not.toBeInTheDocument();
    expect(screen.queryByText("EN PREPARACIÓN")).not.toBeInTheDocument();
  });

  it("requests the official CompTIA certificate on click", () => {
    render(<Certs />);

    fireEvent.click(screen.getByRole("button", { name: /CompTIA Security\+/i }));

    expect(capture.requests).toEqual([{ type: "cert", id: "sy0-701" }]);
  });

  it("advertises review on Security+ card", () => {
    render(<Certs />);
    expect(
      screen.getByRole("button", {
        name: /Ver certificado y review técnica de CompTIA Security\+/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("VER CERTIFICADO & REVIEW TÉCNICA →")).toHaveLength(2);
  });

  it("renders clean SAL1 card with review CTA and without simulation hours or review available badge", () => {
    render(<Certs />);

    expect(screen.getAllByText("VER CERTIFICADO & REVIEW TÉCNICA →")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /Ver certificado y review técnica de SAL1/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Review Técnica Disponible/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/SIMULACIONES SOC/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/4H 07M/i)).not.toBeInTheDocument();
  });

  it("renders Credly official profile verification card with logo and external link", () => {
    render(<Certs />);

    const credlyLink = screen.getByRole("link", {
      name: /Ver perfil oficial de credenciales e insignias en Credly/i,
    });
    expect(credlyLink).toBeInTheDocument();
    expect(credlyLink).toHaveAttribute("href", "https://www.credly.com/users/sdsandili");
    expect(credlyLink).toHaveAttribute("target", "_blank");
    expect(credlyLink).toHaveAttribute("rel", "noreferrer");

    const credlyLogo = screen.getByAltText("Credly");
    expect(credlyLogo).toBeInTheDocument();
    expect(credlyLogo).toHaveAttribute("src", "/badges/credly.svg");

    expect(screen.getByText("EXPEDIENTE DIGITAL // CREDLY")).toBeInTheDocument();
    expect(screen.getByText("Insignias y Certificaciones Verificadas")).toBeInTheDocument();
    expect(screen.getByText("VER PERFIL EN CREDLY")).toBeInTheDocument();
  });
});
