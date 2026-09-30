/**
 * Backend API Contract Types (RFC 7807 compliant)
 * Strictly enforces neutral defensive security terminology:
 * - probe (not attack)
 * - validator (not defense)
 * - ModelUnderTest / MUT (not target)
 * - Robustness Failure Rate / RFR (not ASR)
 */

export interface RFC7807ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  invalid_params?: Array<{
    name: string;
    reason: string;
  }>;
  [key: string]: unknown;
}

export class ApiError extends Error {
  public status: number;
  public problem: RFC7807ProblemDetails;

  constructor(problem: RFC7807ProblemDetails) {
    super(problem.detail || problem.title || "An API error occurred");
    this.name = "ApiError";
    this.status = problem.status;
    this.problem = problem;
  }
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  onboarding_completed: boolean;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "team" | "enterprise";
  created_at: string;
}

export interface AuthMeResponse {
  user: User;
  org: Organization;
}

// Probe Registry & Schema
export type ProbeParamType = "string" | "number" | "boolean" | "enum";

export interface ProbeParamSchema {
  type: ProbeParamType;
  description: string;
  default?: string | number | boolean;
  options?: string[]; // for enum
  min?: number;
  max?: number;
  step?: number;
}

export interface ProbeRegistryItem {
  id: string;
  type: string;
  name: string;
  description: string;
  paper_reference?: string;
  requires_whitebox: boolean;
  param_schemas: Record<string, ProbeParamSchema>;
}

export interface ProbeConfig {
  id: string;
  name: string;
  probe_type: string;
  params: Record<string, unknown>;
  seed_prompts?: string[];
  created_at: string;
  updated_at?: string;
}

// ModelUnderTest (MUT)
export interface ModelUnderTest {
  id: string;
  name: string;
  provider: "openai" | "anthropic" | "ollama" | "vllm" | "custom";
  base_url: string;
  model_identifier: string;
  is_active: boolean;
  status?: "online" | "offline" | "untested";
  latency_ms?: number;
  created_at: string;
}

export interface CreateModelInput {
  name: string;
  provider: string;
  base_url: string;
  model_identifier: string;
  api_key?: string;
}

// Validators
export type ValidatorType = "keyword_filter" | "llm_judge" | "cot_defender" | "custom_webhook";

export interface Validator {
  id: string;
  name: string;
  type: ValidatorType;
  description: string;
  is_enabled: boolean;
  config: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

export interface CreateValidatorInput {
  name: string;
  type: ValidatorType;
  description?: string;
  is_enabled?: boolean;
  config?: Record<string, unknown>;
}

// Runs
export type RunStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "ABORTED";

export interface RunSummary {
  run_id: string;
  status: RunStatus;
  probe_type: string;
  model_ids: string[];
  validator_ids: string[];
  total_attempts: number;
  completed_attempts: number;
  blocked_attempts: number;
  successful_bypasses: number; // probe succeeded -> robustness failure
  rfr: number; // Robustness Failure Rate (0.0 to 1.0)
  duration_ms: number;
  created_at: string;
  updated_at: string;
}

export interface SubmitRunInput {
  probe_type: string;
  params: Record<string, unknown>;
  model_ids: string[];
  validator_ids: string[];
  seed_prompts?: string[];
}

export interface SubmitRunResponse {
  run_id: string;
  status: "ACCEPTED";
}

export interface ProbeAttempt {
  attempt_id: string;
  run_id: string;
  probe_id: string;
  prompt: string;
  response?: string;
  model_id: string;
  model_name: string;
  validator_results: Array<{
    validator_id: string;
    validator_name: string;
    passed: boolean;
    reasoning?: string;
    latency_ms: number;
  }>;
  bypassed_all_validators: boolean;
  is_robustness_failure: boolean;
  latency_ms: number;
  tokens_used?: number;
  timestamp: string;
}

// SSE Stream Event
export type LogStreamEventType = "INFO" | "PROBE" | "VALIDATOR" | "MUT-QUERY" | "SUCCESS" | "BLOCKED";

export interface LogStreamEvent {
  id: string;
  timestamp: string;
  type: LogStreamEventType;
  probe_type: string;
  model_name: string;
  attempt_index?: number;
  total_attempts?: number;
  message: string;
  latency_ms?: number;
  tokens?: number;
  rfr_live?: number;
}

// Reports
export interface ReportData {
  run: RunSummary;
  rfr_by_probe: Record<string, number>;
  rfr_by_category: Record<string, number>;
  rfr_by_model: Record<string, number>;
  validator_funnel: Array<{
    stage: string;
    count: number;
    dropoff_rate: number;
  }>;
  miss_profile: {
    top_patterns: Array<{ pattern: string; count: number }>;
    false_positive_rate: number;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
