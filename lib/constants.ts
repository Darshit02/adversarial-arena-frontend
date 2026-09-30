/**
 * Application Constants & Defensive Arena Configuration
 */

export const APP_NAME = "Adversarial Arena";
export const APP_DESCRIPTION =
  "Controlled testbed for running adversarial probes against LLM deployments and measuring guardrail robustness.";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ENDPOINTS = {
  authMe: "/api/v1/auth/me",
  probes: "/api/v1/probes",
  probeRegistry: "/api/v1/probes/registry",
  models: "/api/v1/models",
  validators: "/api/v1/validators",
  runs: "/api/v1/runs",
  reports: "/api/v1/reports",
  health: "/api/v1/health",
  ready: "/api/v1/ready",
} as const;

export const ROUTES = {
  home: "/",
  pricing: "/pricing",
  docs: "/docs",
  login: "/login",
  signup: "/signup",
  onboarding: "/onboarding",
  onboardingConnect: "/onboarding/connect",
  onboardingValidators: "/onboarding/validators",
  dashboard: "/dashboard",
  attackLab: "/attack-lab",
  runs: "/runs",
  runDetail: (id: string) => `/runs/${id}`,
  validators: "/validators",
  models: "/models",
  settingsProfile: "/settings/profile",
  settingsApiKeys: "/settings/api-keys",
  devComponents: "/dev/components",
} as const;

export const RFR_THRESHOLDS = {
  HIGH_RISK: 50, // > 50% -> --probe
  MODERATE_RISK: 20, // 20-50% -> --warning
  // < 20% -> --validator
} as const;
