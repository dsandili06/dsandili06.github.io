import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { HeroShader } from "@/components/fx/HeroShader";

const mockRender = vi.fn();
const mockSetSize = vi.fn();

vi.mock("ogl", () => {
  class MockRenderer {
    gl = {
      clearColor: vi.fn(),
      canvas: { width: 100, height: 100 },
    };
    setSize = mockSetSize;
    render = mockRender;
  }
  class MockProgram {
    uniforms = {
      uTime: { value: 0 },
      uRes: { value: { set: vi.fn() } },
      uMouse: { value: { x: 0.5, y: 0.4 } },
    };
  }
  class MockMesh {}
  class MockTriangle {}
  class MockVec2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    set = vi.fn();
  }

  return {
    Renderer: MockRenderer,
    Program: MockProgram,
    Mesh: MockMesh,
    Triangle: MockTriangle,
    Vec2: MockVec2,
  };
});

describe("HeroShader rAF lifecycle", () => {
  let ioCallback: IntersectionObserverCallback;
  const originalIO = window.IntersectionObserver;
  let rafCallbacks: FrameRequestCallback[] = [];
  let rafIdCounter = 1;
  const mockRaf = vi.fn((cb: FrameRequestCallback) => {
    rafCallbacks.push(cb);
    return rafIdCounter++;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    rafCallbacks = [];
    rafIdCounter = 1;
    vi.stubGlobal("requestAnimationFrame", mockRaf);

    // Stub getBoundingClientRect to non-zero so setSize returns true
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 800,
      height: 600,
      top: 0,
      left: 0,
      bottom: 600,
      right: 800,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));

    // Mock IntersectionObserver to capture callback
    class MockIO {
      constructor(cb: IntersectionObserverCallback) {
        ioCallback = cb;
      }
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    window.IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    window.IntersectionObserver = originalIO;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("pauses rAF when out of viewport and resumes when visible", () => {
    const { unmount } = render(<HeroShader />);

    // 1. Initial rAF scheduled for start()
    expect(mockRaf).toHaveBeenCalledTimes(1);

    // Flush start() callback
    const startCb = rafCallbacks.shift()!;
    startCb(0);

    // 2. start() should have scheduled the first frame()
    expect(mockRaf).toHaveBeenCalledTimes(2);

    // 3. User scrolls hero out of viewport
    if (ioCallback) {
      ioCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    }

    // Flush active frame callback while invisible
    const frameCb = rafCallbacks.shift()!;
    frameCb(16);

    // Because visible=false, frame() should NOT schedule another rAF
    expect(mockRaf).toHaveBeenCalledTimes(2);

    // 4. User scrolls hero back into viewport
    if (ioCallback) {
      ioCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    }

    // IntersectionObserver should resume the loop by scheduling a new frame
    expect(mockRaf).toHaveBeenCalledTimes(3);

    unmount();
  });
});
