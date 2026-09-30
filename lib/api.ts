import { env } from "@/lib/env";
import { ApiError } from "@/lib/errors";
import {
  type RFC7807ProblemDetails,
  type AuthMeResponse,
  type PaginatedResponse,
  type ProbeRegistryItem,
  type ProbeConfig,
  type ModelUnderTest,
  type CreateModelInput,
  type Validator,
  type CreateValidatorInput,
  type RunSummary,
  type SubmitRunInput,
  type SubmitRunResponse,
  type ProbeAttempt,
  type ReportData,
} from "@/types/api";

export { ApiError };

export const API_BASE_URL = env.API_URL || "http://localhost:8000";

export interface ApiFetchOptions extends RequestInit {
  token?: string;
}

let globalTokenGetter: (() => Promise<string | null>) | null = null;

export function setApiAuthTokenGetter(getter: () => Promise<string | null>) {
  globalTokenGetter = getter;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  // 1. Prefix with /api/v1 unless path explicitly starts with "/" (e.g. /health, /ready)
  const normalizedPath = path.startsWith("/") ? path : `/api/v1/${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  const headers = new Headers(options.headers);

  // 2. Set Content-Type: application/json unless body is FormData
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // 3. Attach Bearer token if provided, or from globalTokenGetter
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  } else if (globalTokenGetter) {
    try {
      const token = await globalTokenGetter();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch {
      // Continue without token in unauthenticated contexts
    }
  }

  const fetchWithRetry = async (isRetry = false): Promise<Response> => {
    try {
      return await fetch(url, {
        ...options,
        headers,
      });
    } catch (networkError) {
      // 7. Retry idempotent GET requests once on network error
      const isGet = !options.method || options.method.toUpperCase() === "GET";
      if (isGet && !isRetry) {
        return fetchWithRetry(true);
      }
      throw new ApiError(
        networkError instanceof Error
          ? networkError.message
          : "Network connection failed",
        0
      );
    }
  };

  const response = await fetchWithRetry();

  // 6. Redirect to /login?next=... on 401 client-side
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/login") && !currentPath.startsWith("/signup")) {
        window.location.href = `/login?next=${encodeURIComponent(currentPath)}`;
      }
    }
  }

  // 4. Handle 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  // 5. Parse RFC 7807 error details if non-2xx
  if (!response.ok) {
    const requestId =
      response.headers.get("x-request-id") ||
      response.headers.get("request-id") ||
      undefined;

    let problem: RFC7807ProblemDetails;
    try {
      problem = await response.json();
    } catch {
      problem = {
        title: response.statusText || "Request Failed",
        status: response.status,
        detail: `HTTP error ${response.status} requesting ${normalizedPath}`,
      };
    }
    throw new ApiError(problem, response.status, requestId);
  }

  return response.json() as Promise<T>;
}

// -------------------------------------------------------------
// Typed Endpoint Helper Functions (take token as first arg)
// -------------------------------------------------------------

export const listRuns = (
  token?: string,
  params?: { page?: number; status?: string; probe_type?: string }
) => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.status) query.set("status", params.status);
  if (params?.probe_type) query.set("probe_type", params.probe_type);
  const qStr = query.toString();
  return apiFetch<PaginatedResponse<RunSummary>>(
    `/api/v1/runs${qStr ? `?${qStr}` : ""}`,
    { token }
  );
};

export const getRun = (token: string | undefined, id: string) =>
  apiFetch<RunSummary>(`/api/v1/runs/${id}`, { token });

export const submitRun = (token: string | undefined, data: SubmitRunInput) =>
  apiFetch<SubmitRunResponse>("/api/v1/runs", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });

export const abortRun = (token: string | undefined, id: string) =>
  apiFetch<{ aborted: boolean }>(`/api/v1/runs/${id}/abort`, {
    method: "POST",
    token,
  });

export const deleteRun = (token: string | undefined, id: string) =>
  apiFetch<void>(`/api/v1/runs/${id}`, {
    method: "DELETE",
    token,
  });

export const listProbes = (
  token?: string,
  params?: { page?: number; page_size?: number }
) => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.page_size) query.set("page_size", params.page_size.toString());
  const qStr = query.toString();
  return apiFetch<PaginatedResponse<ProbeConfig>>(
    `/api/v1/probes${qStr ? `?${qStr}` : ""}`,
    { token }
  );
};

export const getProbeRegistry = (token?: string) =>
  apiFetch<ProbeRegistryItem[]>("/api/v1/probes/registry", { token });

export const listValidators = (token?: string) =>
  apiFetch<Validator[]>("/api/v1/validators", { token });

export const createValidator = (
  token: string | undefined,
  data: CreateValidatorInput
) =>
  apiFetch<Validator>("/api/v1/validators", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });

export const updateValidator = (
  token: string | undefined,
  id: string,
  data: Partial<Validator>
) =>
  apiFetch<Validator>(`/api/v1/validators/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
  });

export const deleteValidator = (token: string | undefined, id: string) =>
  apiFetch<void>(`/api/v1/validators/${id}`, {
    method: "DELETE",
    token,
  });

export const listModels = (token?: string) =>
  apiFetch<ModelUnderTest[]>("/api/v1/models", { token });

export const createModel = (
  token: string | undefined,
  data: CreateModelInput
) =>
  apiFetch<ModelUnderTest>("/api/v1/models", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });

export const deleteModel = (token: string | undefined, id: string) =>
  apiFetch<void>(`/api/v1/models/${id}`, {
    method: "DELETE",
    token,
  });

export const testModel = (token: string | undefined, id: string) =>
  apiFetch<{ success: boolean; latency_ms: number; message: string }>(
    `/api/v1/models/${id}/test`,
    {
      method: "POST",
      token,
    }
  );

export const getReport = (token: string | undefined, runId: string) =>
  apiFetch<ReportData>(`/api/v1/reports/${runId}`, { token });

export const getReportPdfUrl = (runId: string) =>
  `${API_BASE_URL}/api/v1/reports/${runId}/pdf`;

export const compareReports = (
  token: string | undefined,
  runA: string,
  runB: string
) =>
  apiFetch<{ comparison: unknown }>(
    `/api/v1/reports/compare?run_a=${runA}&run_b=${runB}`,
    { token }
  );

export const getHealth = () => apiFetch<{ status: string }>("/health");

export const getReady = () => apiFetch<{ ready: boolean }>("/ready");

export const getAuthMe = (token?: string) =>
  apiFetch<AuthMeResponse>("/api/v1/auth/me", { token });

export const updateMe = (
  token: string | undefined,
  data: Partial<{ onboarding_completed: boolean; name: string }>
) =>
  apiFetch<AuthMeResponse>("/api/v1/auth/me", {
    method: "PATCH",
    body: JSON.stringify(data),
    token,
  });

// Backward-compatible API object
export const api = {
  getMe: (token?: string) => getAuthMe(token),
  updateMe: (
    data: Partial<{ onboarding_completed: boolean; name: string }>,
    token?: string
  ) => updateMe(token, data),
  getProbes: (params?: { page?: number; page_size?: number }, token?: string) =>
    listProbes(token, params),
  getProbeRegistry: (token?: string) => getProbeRegistry(token),
  getModels: (token?: string) => listModels(token),
  createModel: (data: CreateModelInput, token?: string) =>
    createModel(token, data),
  deleteModel: (id: string, token?: string) => deleteModel(token, id),
  testModelConnectivity: (id: string, token?: string) => testModel(token, id),
  getValidators: (token?: string) => listValidators(token),
  createValidator: (data: CreateValidatorInput, token?: string) =>
    createValidator(token, data),
  updateValidator: (id: string, data: Partial<Validator>, token?: string) =>
    updateValidator(token, id, data),
  deleteValidator: (id: string, token?: string) =>
    deleteValidator(token, id),
  submitRun: (data: SubmitRunInput, token?: string) =>
    submitRun(token, data),
  getRuns: (
    params?: { page?: number; status?: string; probe_type?: string },
    token?: string
  ) => listRuns(token, params),
  getRun: (id: string, token?: string) => getRun(token, id),
  getRunResults: (id: string, page = 1, token?: string) =>
    apiFetch<PaginatedResponse<ProbeAttempt>>(
      `/api/v1/runs/${id}/results?page=${page}`,
      { token }
    ),
  abortRun: (id: string, token?: string) => abortRun(token, id),
  deleteRun: (id: string, token?: string) => deleteRun(token, id),
  getReportJson: (runId: string, token?: string) => getReport(token, runId),
  getReportPdfUrl,
  compareReports: (runA: string, runB: string, token?: string) =>
    compareReports(token, runA, runB),
  getHealth,
  getReady,
};
