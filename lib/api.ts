import {
  ApiError,
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let tokenGetter: (() => Promise<string | null>) | null = null;

export function setApiAuthTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers);

  // Set default content type if body exists
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Attach Clerk JWT token if available
  if (tokenGetter) {
    try {
      const token = await tokenGetter();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch {
      // Continue without token in unauthenticated/public paths
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized -> redirect to login if in browser
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/login") && !currentPath.startsWith("/signup")) {
        window.location.href = `/login?next=${encodeURIComponent(currentPath)}`;
      }
    }
  }

  if (!response.ok) {
    let problem: RFC7807ProblemDetails;
    try {
      problem = await response.json();
    } catch {
      problem = {
        title: response.statusText || "Request Failed",
        status: response.status,
        detail: `HTTP error ${response.status} requesting ${endpoint}`,
      };
    }
    throw new ApiError(problem);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Auth
  getMe: () => request<AuthMeResponse>("/api/v1/auth/me"),
  updateMe: (data: Partial<{ onboarding_completed: boolean; name: string }>) =>
    request<AuthMeResponse>("/api/v1/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Probes
  getProbes: (params?: { page?: number; page_size?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.page_size) query.set("page_size", params.page_size.toString());
    return request<PaginatedResponse<ProbeConfig>>(
      `/api/v1/probes${query.toString() ? `?${query}` : ""}`
    );
  },
  getProbeRegistry: () =>
    request<ProbeRegistryItem[]>("/api/v1/probes/registry"),
  getProbe: (id: string) => request<ProbeConfig>(`/api/v1/probes/${id}`),
  createProbe: (data: Partial<ProbeConfig>) =>
    request<ProbeConfig>("/api/v1/probes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProbe: (id: string, data: Partial<ProbeConfig>) =>
    request<ProbeConfig>(`/api/v1/probes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteProbe: (id: string) =>
    request<void>(`/api/v1/probes/${id}`, {
      method: "DELETE",
    }),

  // ModelsUnderTest (MUT)
  getModels: () => request<ModelUnderTest[]>("/api/v1/models"),
  createModel: (data: CreateModelInput) =>
    request<ModelUnderTest>("/api/v1/models", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteModel: (id: string) =>
    request<void>(`/api/v1/models/${id}`, {
      method: "DELETE",
    }),
  testModelConnectivity: (id: string) =>
    request<{ success: boolean; latency_ms: number; message: string }>(
      `/api/v1/models/${id}/test`,
      {
        method: "POST",
      }
    ),

  // Validators
  getValidators: () => request<Validator[]>("/api/v1/validators"),
  createValidator: (data: CreateValidatorInput) =>
    request<Validator>("/api/v1/validators", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateValidator: (id: string, data: Partial<Validator>) =>
    request<Validator>(`/api/v1/validators/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteValidator: (id: string) =>
    request<void>(`/api/v1/validators/${id}`, {
      method: "DELETE",
    }),

  // Runs
  submitRun: (data: SubmitRunInput) =>
    request<SubmitRunResponse>("/api/v1/runs", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getRuns: (params?: { page?: number; status?: string; probe_type?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.status) query.set("status", params.status);
    if (params?.probe_type) query.set("probe_type", params.probe_type);
    return request<PaginatedResponse<RunSummary>>(
      `/api/v1/runs${query.toString() ? `?${query}` : ""}`
    );
  },
  getRun: (id: string) => request<RunSummary>(`/api/v1/runs/${id}`),
  getRunResults: (id: string, page = 1) =>
    request<PaginatedResponse<ProbeAttempt>>(
      `/api/v1/runs/${id}/results?page=${page}`
    ),
  abortRun: (id: string) =>
    request<{ aborted: boolean }>(`/api/v1/runs/${id}/abort`, {
      method: "POST",
    }),
  deleteRun: (id: string) =>
    request<void>(`/api/v1/runs/${id}`, {
      method: "DELETE",
    }),

  // Reports
  getReportJson: (runId: string) =>
    request<ReportData>(`/api/v1/reports/${runId}`),
  getReportPdfUrl: (runId: string) =>
    `${API_BASE_URL}/api/v1/reports/${runId}/pdf`,
  compareReports: (runA: string, runB: string) =>
    request<{ comparison: unknown }>(
      `/api/v1/reports/compare?run_a=${runA}&run_b=${runB}`
    ),

  // Health
  getHealth: () => request<{ status: string }>("/api/v1/health"),
  getReady: () => request<{ ready: boolean }>("/api/v1/ready"),
};
