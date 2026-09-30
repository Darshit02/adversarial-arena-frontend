"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { env } from "@/lib/env";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCw,
  Activity,
  Shield,
  ExternalLink,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CheckStatus = "pending" | "running" | "success" | "failure" | "skipped";

interface HealthCheckItem {
  id: string;
  name: string;
  description: string;
  status: CheckStatus;
  detail?: string;
  diagnosis?: string;
}

export default function ConnectionHealthPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const [checks, setChecks] = useState<HealthCheckItem[]>([
    {
      id: "api_url",
      name: "API URL configured",
      description: "NEXT_PUBLIC_API_URL environment variable is set and parsed",
      status: "pending",
    },
    {
      id: "health_liveness",
      name: "/health returns 200",
      description: "FastAPI server liveness probe is reachable",
      status: "pending",
    },
    {
      id: "ready_probe",
      name: "/ready returns 200",
      description: "FastAPI readiness probe reports healthy backend services",
      status: "pending",
    },
    {
      id: "cors_preflight",
      name: "CORS preflight succeeds",
      description: "Browser cross-origin HTTP request allowed by backend",
      status: "pending",
    },
    {
      id: "clerk_mounted",
      name: "Clerk provider mounted",
      description: "ClerkProvider is active in React component tree",
      status: "pending",
    },
    {
      id: "current_user",
      name: "Current user session",
      description: "Identifies active signed-in user or guest state",
      status: "pending",
    },
    {
      id: "jwt_fetch",
      name: "JWT fetch works",
      description: "Clerk getToken() generates valid bearer token",
      status: "pending",
    },
    {
      id: "auth_header",
      name: "Auth header reaches backend",
      description: "Authorization: Bearer header accepted without rejection",
      status: "pending",
    },
    {
      id: "auth_me",
      name: "/api/v1/auth/me returns user",
      description: "FastAPI validates JWT and returns user organization profile",
      status: "pending",
    },
  ]);

  const [runningAll, setRunningAll] = useState(false);

  const updateCheck = (
    id: string,
    status: CheckStatus,
    detail?: string,
    diagnosis?: string
  ) => {
    setChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, detail, diagnosis } : c))
    );
  };

  const runAllChecks = useCallback(async () => {
    setRunningAll(true);

    // 1. API URL configured
    try {
      if (env.API_URL) {
        updateCheck("api_url", "success", `Configured: ${env.API_URL}`);
      } else {
        updateCheck(
          "api_url",
          "failure",
          "Missing URL",
          "Set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local"
        );
      }
    } catch (e: any) {
      updateCheck("api_url", "failure", e.message, "Check lib/env.ts parsing");
    }

    // 2. /health probe
    try {
      const health = await apiFetch<{ status: string }>("/health");
      updateCheck("health_liveness", "success", `Status: ${health.status || "ok"}`);
    } catch (e: any) {
      updateCheck(
        "health_liveness",
        "failure",
        e.message || "Failed to reach /health",
        "Ensure FastAPI backend is running on NEXT_PUBLIC_API_URL"
      );
    }

    // 3. /ready probe
    try {
      const ready = await apiFetch<{ ready: boolean }>("/ready");
      updateCheck("ready_probe", "success", `Ready: ${ready.ready ?? true}`);
    } catch (e: any) {
      updateCheck(
        "ready_probe",
        "failure",
        e.message || "Failed to reach /ready",
        "Check backend database, worker pools, and dependencies"
      );
    }

    // 4. CORS preflight check
    try {
      const res = await fetch(`${env.API_URL}/health`, {
        method: "OPTIONS",
      });
      if (res.ok || res.status === 204 || res.status === 200 || res.status === 405) {
        updateCheck("cors_preflight", "success", "Preflight accepted");
      } else {
        updateCheck(
          "cors_preflight",
          "failure",
          `Status ${res.status}`,
          "Backend CORS_ORIGINS must include http://localhost:3000"
        );
      }
    } catch (e: any) {
      updateCheck(
        "cors_preflight",
        "failure",
        e.message,
        "Backend CORS_ORIGINS must include frontend origin (http://localhost:3000)"
      );
    }

    // 5. Clerk provider mounted
    if (isLoaded) {
      updateCheck("clerk_mounted", "success", "Clerk context loaded");
    } else {
      updateCheck(
        "clerk_mounted",
        "failure",
        "Clerk not loaded",
        "Verify NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is configured"
      );
    }

    // 6. Current user
    if (isSignedIn && user) {
      updateCheck(
        "current_user",
        "success",
        user.primaryEmailAddress?.emailAddress || user.id
      );
    } else {
      updateCheck(
        "current_user",
        "skipped",
        "Signed out (Guest mode)",
        "Sign in at /login to test authenticated endpoints"
      );
    }

    // 7. JWT fetch
    let token: string | null = null;
    if (isSignedIn) {
      try {
        token = await getToken();
        if (token) {
          updateCheck(
            "jwt_fetch",
            "success",
            `JWT active (${token.slice(0, 16)}...)`
          );
        } else {
          updateCheck(
            "jwt_fetch",
            "failure",
            "Null token returned",
            "Verify Clerk session is active in browser cookies"
          );
        }
      } catch (e: any) {
        updateCheck("jwt_fetch", "failure", e.message, "Check Clerk credentials");
      }
    } else {
      updateCheck(
        "jwt_fetch",
        "skipped",
        "Skipped (Not signed in)",
        "Sign in at /login to test token generation"
      );
    }

    // 8. Auth header reaches backend
    if (token) {
      try {
        await apiFetch("/api/v1/auth/me", { token });
        updateCheck(
          "auth_header",
          "success",
          "Bearer token validated by FastAPI"
        );
      } catch (e: any) {
        if (e.status === 401) {
          updateCheck(
            "auth_header",
            "failure",
            "401 Unauthorized",
            "Ensure backend CLERK_SECRET_KEY / CLERK_PEM matches frontend Clerk app"
          );
        } else {
          updateCheck("auth_header", "failure", e.message);
        }
      }
    } else {
      updateCheck(
        "auth_header",
        "skipped",
        "Skipped (No token)",
        "Sign in to verify bearer header transmission"
      );
    }

    // 9. /api/v1/auth/me profile
    if (token) {
      try {
        const me = await apiFetch<any>("/api/v1/auth/me", { token });
        updateCheck(
          "auth_me",
          "success",
          `User: ${me?.user?.email || "verified"} · Org: ${
            me?.org?.name || "default"
          }`
        );
      } catch (e: any) {
        updateCheck(
          "auth_me",
          "failure",
          e.message,
          "Verify /api/v1/auth/me router in FastAPI app"
        );
      }
    } else {
      updateCheck(
        "auth_me",
        "skipped",
        "Skipped (No token)",
        "Sign in to retrieve user and organization profile"
      );
    }

    setRunningAll(false);
  }, [isLoaded, isSignedIn, user, getToken]);

  useEffect(() => {
    runAllChecks();
  }, [runAllChecks]);

  const successCount = checks.filter((c) => c.status === "success").length;
  const failureCount = checks.filter((c) => c.status === "failure").length;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] p-6 md:p-12 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[var(--accent)] stroke-[2]" />
            <h1 className="font-display text-[28px] font-medium text-[var(--text-primary)] tracking-[-0.02em]">
              Connection Health &amp; Diagnostics
            </h1>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Automated verification of API endpoints, CORS headers, Clerk authentication, and JWT relays
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={runAllChecks}
            loading={runningAll}
            iconLeft={<RotateCw className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Re-run Checks
          </Button>
        </div>
      </div>

      {/* Summary Score Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
            Passed Checks
          </span>
          <div className="text-[24px] font-medium text-[var(--validator)] tabular-nums">
            {successCount} of {checks.length}
          </div>
        </div>

        <div className="p-4 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
            Failures Detected
          </span>
          <div className="text-[24px] font-medium text-[var(--probe)] tabular-nums">
            {failureCount}
          </div>
        </div>

        <div className="p-4 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">
            Target API URL
          </span>
          <div className="text-[14px] font-medium text-[var(--text-primary)] truncate font-mono">
            {env.API_URL}
          </div>
        </div>
      </div>

      {/* Main Connection Checks Table */}
      <div className="rounded-[12px] border border-[var(--border)] overflow-hidden bg-[var(--surface)]">
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr className="h-10 bg-[var(--surface-raised)] border-b border-[var(--border)] text-[11px] font-medium uppercase tracking-[0.03em] text-[var(--text-muted)]">
              <th className="px-5 text-left w-64">Check</th>
              <th className="px-5 text-left">Description &amp; Detail</th>
              <th className="px-5 text-right w-36">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {checks.map((item) => {
              const isSuccess = item.status === "success";
              const isFailure = item.status === "failure";
              const isSkipped = item.status === "skipped";

              return (
                <tr
                  key={item.id}
                  className="hover:bg-[var(--surface-hover)] transition-colors"
                >
                  {/* Check Name */}
                  <td className="px-5 py-3.5 font-medium text-[var(--text-primary)] align-top">
                    {item.name}
                  </td>

                  {/* Description & Diagnostic detail */}
                  <td className="px-5 py-3.5 space-y-1 align-top">
                    <p className="text-[12px] text-[var(--text-secondary)]">
                      {item.description}
                    </p>
                    {item.detail && (
                      <p className="text-[11px] font-mono text-[var(--text-muted)]">
                        {item.detail}
                      </p>
                    )}
                    {item.diagnosis && isFailure && (
                      <div className="p-2 rounded-[6px] bg-[var(--probe-bg)] border border-[var(--probe)]/30 text-[11px] text-[var(--probe)] flex items-start gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{item.diagnosis}</span>
                      </div>
                    )}
                  </td>

                  {/* Status Indicator */}
                  <td className="px-5 py-3.5 text-right align-top">
                    {isSuccess && (
                      <Badge variant="validator" className="gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                        Passed
                      </Badge>
                    )}
                    {isFailure && (
                      <Badge variant="probe" className="gap-1.5">
                        <XCircle className="w-3.5 h-3.5 stroke-[2]" />
                        Failed
                      </Badge>
                    )}
                    {isSkipped && (
                      <Badge variant="neutral" className="gap-1">
                        Skipped
                      </Badge>
                    )}
                    {item.status === "running" && (
                      <Badge variant="neutral" className="gap-1">
                        Testing...
                      </Badge>
                    )}
                    {item.status === "pending" && (
                      <span className="text-[11px] text-[var(--text-muted)]">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
