import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { INVESTIGATIONS } from "@/data/investigations";
import { WriteupsIndex } from "@/components/features/writeups/WriteupsIndex";
import { validateWriteupsSearch } from "@/components/features/writeups/writeupCategories";

async function renderIndex(cat?: string) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const index = createRoute({
    getParentRoute: () => rootRoute,
    path: "/writeups",
    component: () => <WriteupsIndex cat={cat} />,
  });
  const detail = createRoute({
    getParentRoute: () => rootRoute,
    path: "/writeups/$slug",
    component: () => null,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([index, detail]),
    history: createMemoryHistory({ initialEntries: ["/writeups"] }),
  });
  await act(async () => {
    render(<RouterProvider router={router} />);
    await router.load();
  });
}

describe("WriteupsIndex", () => {
  afterEach(cleanup);

  it("lists every writeup linking to /writeups/<slug>", async () => {
    await renderIndex();
    for (const inv of INVESTIGATIONS) {
      expect(screen.getByRole("link", { name: inv.title })).toHaveAttribute(
        "href",
        `/writeups/${inv.slug}`,
      );
    }
  });

  it("narrows the list to the selected category", async () => {
    await renderIndex("Malware Analysis");
    const expected = INVESTIGATIONS.filter((i) => i.categories.includes("Malware Analysis"));
    expect(expected.length).toBeLessThan(INVESTIGATIONS.length);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(expected.length);
    for (const inv of expected) {
      expect(screen.getByRole("link", { name: inv.title })).toBeInTheDocument();
    }
  });

  it("filter chips link with the cat search param", async () => {
    await renderIndex();
    expect(screen.getByRole("link", { name: "Threat Intel" }).getAttribute("href")).toContain(
      "cat=Threat+Intel",
    );
    expect(screen.getByRole("link", { name: "Todos" })).toHaveAttribute("aria-current", "page");
  });

  it("marks only the active filter tab with the accent underline", async () => {
    await renderIndex("Threat Intel");
    expect(screen.getByRole("link", { name: "Threat Intel" })).toHaveClass(
      "border-[var(--accent)]",
    );
    expect(screen.getByRole("link", { name: "Todos" })).not.toHaveClass("border-[var(--accent)]");
  });

  it("does not number the items", async () => {
    await renderIndex();
    expect(screen.queryByText(/^0?1$/)).not.toBeInTheDocument();
  });

  it("validateWriteupsSearch drops unknown categories", () => {
    expect(validateWriteupsSearch({ cat: "Nope" })).toEqual({});
    expect(validateWriteupsSearch({ cat: 3 })).toEqual({});
    expect(validateWriteupsSearch({ cat: "Threat Intel" })).toEqual({ cat: "Threat Intel" });
  });
});
