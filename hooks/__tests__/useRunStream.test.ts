import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRunStream } from "@/hooks/useRunStream";

// Mock Clerk useAuth
const mockGetToken = vi.fn().mockResolvedValue("mock_jwt_token");
vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: mockGetToken,
    isLoaded: true,
    isSignedIn: true,
  }),
}));

// Mock EventSource implementation
class MockEventSource {
  static instances: MockEventSource[] = [];
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: any) => void) | null = null;
  onerror: (() => void) | null = null;
  listeners: Record<string, ((event: any) => void)[]> = {};
  close = vi.fn();

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
    setTimeout(() => {
      if (this.onopen) this.onopen();
    }, 10);
  }

  addEventListener(type: string, listener: (event: any) => void) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);
  }

  emit(type: string, data: any) {
    if (this.listeners[type]) {
      this.listeners[type].forEach((fn) =>
        fn({ data: JSON.stringify(data) })
      );
    }
  }
}

describe("useRunStream", () => {
  const originalEventSource = global.EventSource;

  beforeEach(() => {
    vi.restoreAllMocks();
    MockEventSource.instances = [];
    (global as any).EventSource = MockEventSource as any;
  });

  afterEach(() => {
    global.EventSource = originalEventSource;
  });

  it("initializes EventSource with run stream URL and token query parameter", async () => {
    const { result } = renderHook(() => useRunStream("run_test_123"));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(MockEventSource.instances.length).toBeGreaterThan(0);
    const instance = MockEventSource.instances[0];
    expect(instance.url).toContain("/api/v1/runs/run_test_123/stream");
    expect(instance.url).toContain("token=mock_jwt_token");
    expect(result.current.isConnected).toBe(true);
  });

  it("handles incoming custom stream events and updates metrics", async () => {
    const { result } = renderHook(() => useRunStream("run_test_123"));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    const instance = MockEventSource.instances[0];

    await act(async () => {
      instance.emit("progress", {
        rfr_live: 0.35,
        attempt_index: 8,
        blocked_count: 5,
        message: "Validator blocked adversarial candidate",
      });
    });

    expect(result.current.rfrLive).toBe(0.35);
    expect(result.current.completedCount).toBe(8);
    expect(result.current.blockedCount).toBe(5);
  });

  it("transitions to terminal status on completed event", async () => {
    const { result } = renderHook(() => useRunStream("run_test_123"));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    const instance = MockEventSource.instances[0];

    await act(async () => {
      instance.emit("completed", {
        rfr_live: 0.28,
        message: "Run evaluation finished successfully",
      });
    });

    expect(result.current.status).toBe("COMPLETED");
    expect(result.current.streamStatus).toBe("closed");
  });
});
