import type { AnchorHTMLAttributes, ReactNode } from "react";
import { vi } from "vitest";

type MockLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  params?: Record<string, string>;
  search?: unknown;
  replace?: boolean;
  activeOptions?: unknown;
  children?: ReactNode;
};

/** Substitutes `$param` segments the way the router would. */
export function resolvePath(to: string, params: Record<string, string> = {}): string {
  return to.replace(/\$(\w+)/g, (_, key: string) => params[key] ?? "");
}

export const navigateMock = vi.fn();

/**
 * Factory for `vi.mock("@tanstack/react-router", ...)` in component tests that
 * render links/navigation without mounting a router. Keeps tests synchronous.
 */
export async function createRouterMock(
  importOriginal: () => Promise<typeof import("@tanstack/react-router")>,
) {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => navigateMock,
    Link: ({ to, params, search, replace, activeOptions, children, ...rest }: MockLinkProps) => {
      void search;
      void replace;
      void activeOptions;
      return (
        <a href={resolvePath(to, params)} {...rest}>
          {children}
        </a>
      );
    },
  };
}
