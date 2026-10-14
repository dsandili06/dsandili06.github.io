import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { Investigation } from "@/types";
import { useWriteup } from "@/components/features/writeups/useWriteup";

const INVESTIGATION: Investigation = {
  id: "LAB_001",
  title: "FakeGPT",
  platform: "CyberDefenders",
  summary: "Resumen",
  categories: ["Malware Analysis"],
  href: "https://github.com/dsandili06/Artifakt-Labs/blob/main/Writeups/CyberDefenders/FakeGPT.md",
};

const MARKDOWN = "# FakeGPT\n\nContenido.";

function mockFetchOk() {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: () => Promise.resolve(MARKDOWN) });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("useWriteup", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("requests the raw writeup url exactly once per investigation", async () => {
    const fetchMock = mockFetchOk();

    const { result } = renderHook(() => useWriteup(INVESTIGATION, INVESTIGATION.id));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/dsandili06/Artifakt-Labs/main/Writeups/CyberDefenders/FakeGPT.md",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(result.current.markdown).toBe(MARKDOWN);
    expect(result.current.error).toBe(false);
  });

  it("serves a cached writeup without fetching again", async () => {
    sessionStorage.setItem(`writeup-${INVESTIGATION.id}`, MARKDOWN);
    const fetchMock = mockFetchOk();

    const { result } = renderHook(() => useWriteup(INVESTIGATION, INVESTIGATION.id));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.markdown).toBe(MARKDOWN);
  });

  it("still fetches when session storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    const fetchMock = mockFetchOk();

    const { result } = renderHook(() => useWriteup(INVESTIGATION, INVESTIGATION.id));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.markdown).toBe(MARKDOWN);
  });

  it("reports an error for an unknown investigation without fetching", async () => {
    const fetchMock = mockFetchOk();

    const { result } = renderHook(() => useWriteup(undefined, "LAB_999"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.current.error).toBe(true);
  });

  it("retries by dropping the cached copy and fetching again", async () => {
    const fetchMock = mockFetchOk();
    const { result } = renderHook(() => useWriteup(INVESTIGATION, INVESTIGATION.id));
    await waitFor(() => expect(result.current.loading).toBe(false));

    result.current.retry();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(result.current.markdown).toBe(MARKDOWN);
    expect(result.current.error).toBe(false);
  });
});
