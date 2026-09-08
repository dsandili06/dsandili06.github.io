import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { CertModal } from "@/components/CertModal";

describe("CertModal component", () => {
  beforeEach(() => {
    vi.spyOn(window.history, "pushState").mockImplementation(() => {});
    vi.spyOn(window.history, "back").mockImplementation(() => {});
    document.body.style.overflow = "";
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    document.body.style.overflow = "";
  });

  it("renders modal with image, title and responsive close hints", () => {
    render(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    expect(screen.getByText("Google Cybersecurity")).toBeInTheDocument();
    expect(screen.getByText("Tocá fuera para cerrar")).toBeInTheDocument();
    expect(screen.getByText("ESC para cerrar")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Abrir en nueva pestaña/i });
    expect(link).toHaveAttribute("href", "/certs/Google Cybersecurity Certificate.webp");
    expect(link.className).toContain("min-h-[44px]");

    const closeBtn = screen.getByRole("button", { name: /Cerrar/i });
    expect(closeBtn.className).toContain("min-h-[44px]");
    expect(closeBtn.className).toContain("min-w-[44px]");
  });

  it("applies safe-area insets on modal backdrop container", () => {
    const { baseElement } = render(
      <CertModal
        isOpen={true}
        onClose={vi.fn()}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    const backdrop = baseElement.querySelector(".fixed.inset-0.z-\\[9999\\]");
    expect(backdrop).not.toBeNull();
    expect(backdrop?.className).toContain("pt-[max(1rem,env(safe-area-inset-top))]");
    expect(backdrop?.className).toContain("pb-[max(1rem,env(safe-area-inset-bottom))]");
  });

  it("pushes history state on open and calls onClose on popstate (mobile back gesture)", () => {
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();

    render(
      <CertModal
        isOpen={true}
        onClose={onClose}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    expect(pushStateSpy).toHaveBeenCalledWith({ modal: "cert", title: "Google Cybersecurity" }, "");

    window.dispatchEvent(new PopStateEvent("popstate"));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(backSpy).not.toHaveBeenCalled();
  });

  it("reverts history when closed via X button", () => {
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();

    render(
      <CertModal
        isOpen={true}
        onClose={onClose}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    const closeBtn = screen.getByRole("button", { name: /Cerrar/i });
    closeBtn.click();

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("reverts history when closed via backdrop click", () => {
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();

    const { baseElement } = render(
      <CertModal
        isOpen={true}
        onClose={onClose}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    const backdrop = baseElement.querySelector(".fixed.inset-0.z-\\[9999\\]") as HTMLElement;
    expect(backdrop).not.toBeNull();
    backdrop.click();

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("reverts history when closed via Escape key", () => {
    const backSpy = vi.spyOn(window.history, "back");
    const onClose = vi.fn();

    render(
      <CertModal
        isOpen={true}
        onClose={onClose}
        cert="/certs/Google Cybersecurity Certificate.webp"
        title="Google Cybersecurity"
      />,
    );

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(backSpy).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
