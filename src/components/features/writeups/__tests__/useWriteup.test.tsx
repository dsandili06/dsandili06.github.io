import { describe, expect, it, vi, beforeEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { Investigation } from "@/types";
import { useWriteup } from "@/components/features/writeups/useWriteup";
import { loadWriteupMarkdown } from "@/components/features/writeups/writeupContent";

vi.mock("@/components/features/writeups/writeupContent", () => ({
  loadWriteupMarkdown: vi.fn(),
}));

const loadMock = vi.mocked(loadWriteupMarkdown);

const INVESTIGATION: Investigation = {
  slug: "fakegpt",
  id: "LAB_001",
  title: "FakeGPT",
  platform: "CyberDefenders",
  summary: "Resumen",
  categories: ["Malware Analysis"],
  href: "https://github.com/dsandili06/Artifakt-Labs/blob/main/Writeups/CyberDefenders/FakeGPT.md",
};

const MARKDOWN = "Contenido.\n\n## Sección";

describe("useWriteup", () => {
  beforeEach(() => {
    loadMock.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("loads the markdown for the investigation slug", async () => {
    loadMock.mockResolvedValue(MARKDOWN);
    const { result } = renderHook(() => useWriteup(INVESTIGATION, INVESTIGATION.id));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(loadMock).toHaveBeenCalledWith("fakegpt");
    expect(result.current.markdown).toBe(MARKDOWN);
    expect(result.current.error).toBe(false);
  });

  it("reports an error for a missing investigation without loading", async () => {
    const { result } = renderHook(() => useWriteup(undefined, "LAB_999"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(loadMock).not.toHaveBeenCalled();
    expect(result.current.error).toBe(true);
  });

  it("reports loader rejection and recovers on retry", async () => {
    loadMock.mockRejectedValueOnce(new Error("Writeup not found: fakegpt"));
    const { result } = renderHook(() => useWriteup(INVESTIGATION, INVESTIGATION.id));

    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.markdown).toBeNull();

    loadMock.mockResolvedValueOnce(MARKDOWN);
    act(() => result.current.retry());

    await waitFor(() => expect(result.current.markdown).toBe(MARKDOWN));
    expect(result.current.error).toBe(false);
    expect(loadMock).toHaveBeenCalledTimes(2);
  });

  it("ignores a late resolve after unmount", async () => {
    let resolve!: (value: string) => void;
    loadMock.mockReturnValue(
      new Promise<string>((r) => {
        resolve = r;
      }),
    );
    const { result, unmount } = renderHook(() => useWriteup(INVESTIGATION, INVESTIGATION.id));
    expect(result.current.loading).toBe(true);

    unmount();
    await act(() => {
      resolve(MARKDOWN);
      return Promise.resolve();
    });

    expect(result.current.markdown).toBeNull();
    expect(result.current.loading).toBe(true);
  });
});
