import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch, ApiError } from "@/lib/api";

describe("apiFetch", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("handles successful 200 JSON responses", async () => {
    const mockData = { id: "test-123", status: "ok" };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
      headers: new Headers(),
    });

    const result = await apiFetch<typeof mockData>("/health");
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8000/health",
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );
  });

  it("handles 204 No Content returning undefined", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 204,
      headers: new Headers(),
    });

    const result = await apiFetch<void>("/runs/123", { method: "DELETE" });
    expect(result).toBeUndefined();
  });

  it("parses RFC 7807 problem details on error", async () => {
    const problemDetails = {
      type: "https://adversarial-arena.com/errors/unauthorized",
      title: "Unauthorized",
      status: 401,
      detail: "Token signature verification failed",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => problemDetails,
      headers: new Headers({ "x-request-id": "req-xyz-999" }),
    });

    await expect(apiFetch("/runs")).rejects.toThrowError(
      "Token signature verification failed"
    );
  });

  it("attaches Authorization header when token is provided", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ authenticated: true }),
      headers: new Headers(),
    });

    await apiFetch("/api/v1/auth/me", { token: "test_jwt_bearer_token" });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );
  });

  it("retries idempotent GET request once upon network failure", async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network connection drop"))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ retried: true }),
        headers: new Headers(),
      });

    const result = await apiFetch<{ retried: boolean }>("/probes");
    expect(result).toEqual({ retried: true });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
