import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ModalHost } from "@/components/features/modals/ModalHost";
import { validateModalSearch } from "@/components/features/modals/modalSearch";
import { requestModal } from "@/components/features/modals/modalRequests";

type MockModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
};

vi.mock("@/components/features/certificates/CertModal", () => ({
  CertModal: ({
    cert,
    title,
    isOpen,
    onClose,
    onExitComplete,
  }: MockModalProps & {
    cert: string;
    title: string;
  }) => (
    <div data-testid="cert-modal" data-open={String(isOpen)} data-src={cert}>
      <span>{title}</span>
      <button onClick={onClose}>Cerrar certificado</button>
      <button onClick={onExitComplete}>Fin de salida</button>
    </div>
  ),
}));

vi.mock("@/components/features/writeups/WriteupModal", () => ({
  WriteupModal: ({
    investigationId,
    isOpen,
    onClose,
  }: MockModalProps & {
    investigationId: string;
  }) => (
    <div data-testid="writeup-modal" data-open={String(isOpen)}>
      <span>{investigationId}</span>
      <button onClick={onClose}>Cerrar writeup</button>
    </div>
  ),
}));

async function renderHost(initialEntry = "/") {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    validateSearch: validateModalSearch,
    component: ModalHost,
  });
  const history = createMemoryHistory({ initialEntries: [initialEntry] });
  const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute]), history });
  await act(async () => {
    render(<RouterProvider router={router} />);
    await router.load();
  });
  return { router, history };
}

describe("ModalHost", () => {
  afterEach(() => {
    cleanup();
  });

  it("opens the certificate named by ?cert= on load", async () => {
    await renderHost("/?cert=sal1");

    const modal = await screen.findByTestId("cert-modal");
    expect(modal).toHaveAttribute("data-open", "true");
    expect(modal).toHaveAttribute("data-src", "/certs/THM-SAL1-Certificate.png");
    expect(screen.getByText("SAL1 (Security Analyst L1)")).toBeInTheDocument();
  });

  it("opens the writeup named by ?writeup= on load", async () => {
    await renderHost("/?writeup=LAB_001");

    const modal = await screen.findByTestId("writeup-modal");
    expect(modal).toHaveAttribute("data-open", "true");
    expect(screen.getByText("LAB_001")).toBeInTheDocument();
  });

  it("ignores unknown ids from the URL", async () => {
    await renderHost("/?cert=nope&writeup=<script>");

    expect(screen.queryByTestId("cert-modal")).toBeNull();
    expect(screen.queryByTestId("writeup-modal")).toBeNull();
  });

  it("pushes a history entry on request and closes with Back", async () => {
    const { router, history } = await renderHost("/");

    await act(async () => {
      requestModal({ type: "cert", id: "google" });
    });

    expect(router.state.location.search).toEqual({ cert: "google" });
    expect(await screen.findByTestId("cert-modal")).toHaveAttribute("data-open", "true");
    expect(history.length).toBe(2);

    await act(async () => {
      fireEvent.click(screen.getByText("Cerrar certificado"));
    });

    expect(router.state.location.search).toEqual({});
    expect(screen.getByTestId("cert-modal")).toHaveAttribute("data-open", "false");

    // The modal unmounts only after its exit animation reports completion.
    fireEvent.click(screen.getByText("Fin de salida"));
    expect(screen.queryByTestId("cert-modal")).toBeNull();
  });

  it("replaces the URL when closing a modal reached by a shared link", async () => {
    const { router, history } = await renderHost("/?writeup=LAB_001");
    await screen.findByTestId("writeup-modal");

    await act(async () => {
      fireEvent.click(screen.getByText("Cerrar writeup"));
    });

    expect(router.state.location.search).toEqual({});
    expect(history.length).toBe(1);
    expect(screen.getByTestId("writeup-modal")).toHaveAttribute("data-open", "false");
  });

  it("switches modals when a different one is requested", async () => {
    const { router } = await renderHost("/?cert=sal1");
    await screen.findByTestId("cert-modal");

    await act(async () => {
      requestModal({ type: "writeup", id: "LAB_001" });
    });

    expect(router.state.location.search).toEqual({ writeup: "LAB_001" });
    expect(await screen.findByTestId("writeup-modal")).toHaveAttribute("data-open", "true");
    expect(screen.getByTestId("cert-modal")).toHaveAttribute("data-open", "false");
  });
});
