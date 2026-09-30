"use client";

import React from "react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { RFRNumber } from "@/components/app/RFRNumber";
import { formatDuration, formatNumber } from "@/lib/formatters";
import { type RunSummary } from "@/types/api";
import { ArrowRight, GitCompare, Shield, Cpu } from "lucide-react";

interface CompareModalProps {
  open: boolean;
  onClose: () => void;
  runA: RunSummary | null;
  runB: RunSummary | null;
}

export function CompareModal({
  open,
  onClose,
  runA,
  runB,
}: CompareModalProps) {
  if (!runA || !runB) return null;

  const rfrDiff = ((runB.rfr - runA.rfr) * 100).toFixed(1);
  const isImproved = runB.rfr < runA.rfr;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-[var(--accent)] stroke-[1.75]" />
          <span>Differential Benchmark Comparison</span>
        </div>
      }
      description="Comparing two execution runs to quantify guardrail efficacy regressions and delta."
      size="lg"
    >
      <div className="space-y-6 py-2">
        {/* Delta Callout */}
        <div className="p-4 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
              RFR Net Delta
            </span>
            <div className="text-[13px] text-[var(--text-secondary)]">
              {isImproved
                ? "Run B demonstrated higher defensive resilience than Run A."
                : "Run B suffered higher robustness failure rate than Run A."}
            </div>
          </div>

          <div
            className={`font-display text-[26px] font-medium tabular-nums ${
              isImproved ? "text-[var(--validator)]" : "text-[var(--probe)]"
            }`}
          >
            {Number(rfrDiff) > 0 ? `+${rfrDiff}%` : `${rfrDiff}%`}
          </div>
        </div>

        {/* 2-Column Comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Run A Card */}
          <div className="p-5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="font-semibold text-[14px] text-[var(--text-primary)] tabular-nums">
                {runA.run_id}
              </span>
              <Badge variant="probe">{runA.probe_type}</Badge>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Robustness Failure Rate:</span>
                <RFRNumber rfr={runA.rfr} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Probes Evaluated:</span>
                <span className="tabular-nums font-medium text-[var(--text-primary)]">
                  {formatNumber(runA.total_attempts)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Blocked Probes:</span>
                <span className="tabular-nums font-medium text-[var(--validator)]">
                  {runA.blocked_attempts}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Duration:</span>
                <span className="tabular-nums text-[var(--text-muted)]">
                  {formatDuration(runA.duration_ms)}
                </span>
              </div>
            </div>
          </div>

          {/* Run B Card */}
          <div className="p-5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="font-semibold text-[14px] text-[var(--text-primary)] tabular-nums">
                {runB.run_id}
              </span>
              <Badge variant="probe">{runB.probe_type}</Badge>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Robustness Failure Rate:</span>
                <RFRNumber rfr={runB.rfr} size="sm" />
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Probes Evaluated:</span>
                <span className="tabular-nums font-medium text-[var(--text-primary)]">
                  {formatNumber(runB.total_attempts)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Blocked Probes:</span>
                <span className="tabular-nums font-medium text-[var(--validator)]">
                  {runB.blocked_attempts}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Duration:</span>
                <span className="tabular-nums text-[var(--text-muted)]">
                  {formatDuration(runB.duration_ms)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
