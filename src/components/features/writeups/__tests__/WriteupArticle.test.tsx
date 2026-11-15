import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, act, fireEvent } from "@testing-library/react";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { INVESTIGATIONS } from "@/data/investigations";
import { WriteupArticle } from "@/components/features/writeups/WriteupArticle";

const useWriteupMock = vi.fn<(...args: unknown[]) => unknown>();
vi.mock("@/components/features/writeups/useWriteup", () => ({
  useWriteup: (...args: unknown[]) => useWriteupMock(...args),
}));

const MD = "## Resumen\n\nContenido de prueba del writeup.";

async function renderArticle(index: number) {
  const investigation = INVESTIGATIONS[index];
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const detail = createRoute({
    getParentRoute: () => rootRoute,
    path: "/writeups/$slug",
    component: () => <WriteupArticle investigation={investigation} />,
  });
  const list = createRoute({
    getParentRoute: () => rootRoute,
    path: "/writeups",
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([detail, list]),
    history: createMemoryHistory({ initialEntries: [`/writeups/${investigation.slug}`] }),
  });
  await act(async () => {
    render(<RouterProvider router={router} />);
    await router.load();
  });
  return investigation;
}

describe("WriteupArticle", () => {
  beforeEach(() => {
    useWriteupMock.mockReturnValue({ markdown: MD, loading: false, error: false, retry: vi.fn() });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders title, platform, categories and summary", async () => {
    const inv = await renderArticle(0);
    expect(screen.getByRole("heading", { level: 1, name: inv.title })).toBeInTheDocument();
    expect(screen.getByText(inv.platform)).toBeInTheDocument();
    expect(screen.getByText(inv.categories[0])).toBeInTheDocument();
    expect(screen.getByText(inv.summary)).toBeInTheDocument();
  });

  it("focuses the h1 on mount", async () => {
    const inv = await renderArticle(0);
    expect(screen.getByRole("heading", { level: 1, name: inv.title })).toHaveFocus();
  });

  it("renders the fetched markdown", async () => {
    await renderArticle(0);
    expect(screen.getByText("Contenido de prueba del writeup.")).toBeInTheDocument();
  });

  it("announces loading state", async () => {
    useWriteupMock.mockReturnValue({ markdown: null, loading: true, error: false, retry: vi.fn() });
    await renderArticle(0);
    expect(screen.getByRole("status")).toHaveTextContent("Fetching writeup...");
    expect(screen.getByRole("article")).toHaveAttribute("aria-busy", "true");
  });

  it("shows error with GitHub link and retry", async () => {
    const retry = vi.fn();
    useWriteupMock.mockReturnValue({ markdown: null, loading: false, error: true, retry });
    const inv = await renderArticle(0);
    expect(screen.getByRole("alert")).toHaveTextContent("No se pudo cargar el writeup");
    expect(screen.getByRole("link", { name: /Ver en GitHub$/ })).toHaveAttribute("href", inv.href);
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("links to the previous and next writeups and back to the index", async () => {
    await renderArticle(1);
    expect(screen.getByRole("link", { name: /Anterior/ })).toHaveAttribute(
      "href",
      `/writeups/${INVESTIGATIONS[0].slug}`,
    );
    expect(screen.getByRole("link", { name: /Siguiente/ })).toHaveAttribute(
      "href",
      `/writeups/${INVESTIGATIONS[2].slug}`,
    );
    expect(screen.getByRole("link", { name: /Volver a writeups/ })).toHaveAttribute(
      "href",
      "/writeups",
    );
  });

  it("omits the previous link on the first writeup", async () => {
    await renderArticle(0);
    expect(screen.queryByRole("link", { name: /Anterior/ })).not.toBeInTheDocument();
  });
});
