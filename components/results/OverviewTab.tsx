"use client";

import React from "react";
import { type RunSummary, type ReportData } from "@/types/api";
import { RFRNumber } from "@/components/app/RFRNumber";
import { Badge } from "@/components/ui/badge";
import { RFRByProbeChart } from "./RFRByProbeChart";
import { RFRByCategoryChart } from "./RFRByCategoryChart";
import { RFRByModelChart } from "./RFRByModelChart";
import { ValidatorFunnel } from "./ValidatorFunnel";
import { formatPercent, formatDuration } from "@/lib/formatters";
import { ShieldCheck, ShieldAlert, Zap, Target } from "lucide-react";

interface OverviewTabProps {
  run: RunSummary;
  report: ReportData;
}

export function OverviewTab({ run, report }: OverviewTabProps) {
  const getTierBadge = (rfr: number) => {
    if (rfr > 0.5) {
      return (
        <Badge variant="probe" className="text-[11px]">
          Critical Risk (&gt;50%)
        </Badge>
      );
    }
    if (rfr >= 0.2) {
      return (
        <Badge variant="warning" className="text-[11px]">
          Elevated Risk (20-50%)
        </Badge>
      );
    }
    return (
      <Badge variant="validator" className="text-[11px]">
        Resilient Tier (&lt;20%)
      </Badge>
    );
  };

  const blockedPct = run.total_attempts > 0 ? run.blocked_attempts / run.total_attempts : 0;
  const bypassPct = run.total_attempts > 0 ? run.successful_bypasses / run.total_attempts : 0;
  const avgLatency = run.completed_attempts > 0 ? Math.round(run.duration_ms / run.completed_attempts) : 0;

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Overall RFR */}
        <div className="p-5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.03em]">
              Robustness Failure Rate
            </span>
            <Target className="w-4 h-4 stroke-[1.75] text-[var(--text-muted)]" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <RFRNumber rfr={run.rfr} size="lg" />
            {getTierBadge(run.rfr)}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] pt-1">
            Proportion of adversarial payloads that successfully bypassed all guardrails
          </p>
        </div>

        {/* 2. Probes Succeeded (Bypasses) */}
        <div className="p-5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.03em]">
              Bypass Vectors
            </span>
            <ShieldAlert className="w-4 h-4 stroke-[1.75] text-[var(--probe)]" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-[28px] font-medium text-[var(--probe)] tabular-nums">
              {run.successful_bypasses}
            </span>
            <span className="text-[12px] text-[var(--probe)] tabular-nums font-medium">
              {formatPercent(bypassPct)} of total
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] pt-1">
            Prompts that induced jailbreak or policy violations in target models
          </p>
        </div>

        {/* 3. Probes Blocked */}
        <div className="p-5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.03em]">
              Guardrail Neutralized
            </span>
            <ShieldCheck className="w-4 h-4 stroke-[1.75] text-[var(--validator)]" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-[28px] font-medium text-[var(--validator)] tabular-nums">
              {run.blocked_attempts}
            </span>
            <span className="text-[12px] text-[var(--validator)] tabular-nums font-medium">
              {formatPercent(blockedPct)} intercepted
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] pt-1">
            Interceptions executed by keyword filters, judges, or reasoning defenders
          </p>
        </div>

        {/* 4. Avg Latency / Attempts */}
        <div className="p-5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[var(--text-secondary)] uppercase tracking-[0.03em]">
              Avg Evaluation Latency
            </span>
            <Zap className="w-4 h-4 stroke-[1.75] text-[var(--accent)]" />
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-[28px] font-medium text-[var(--text-primary)] tabular-nums">
              {avgLatency}
              <span className="text-[14px] text-[var(--text-muted)] font-normal ml-1">
                ms
              </span>
            </span>
            <span className="text-[12px] text-[var(--text-muted)] tabular-nums">
              Total {formatDuration(run.duration_ms)}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] pt-1">
            Average end-to-end latency including validator inference and model response
          </p>
        </div>
      </div>

      {/* 4 Recharts Forensic Visualizations (2x2 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RFRByProbeChart data={report.rfr_by_probe} />
        <RFRByCategoryChart data={report.rfr_by_category} />
        <RFRByModelChart data={report.rfr_by_model} />
        <ValidatorFunnel funnel={report.validator_funnel} />
      </div>
    </div>
  );
}
