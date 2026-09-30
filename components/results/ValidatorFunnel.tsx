"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowRight, ShieldCheck, ShieldAlert } from "lucide-react";
import { formatPercent } from "@/lib/formatters";

interface FunnelStep {
  stage: string;
  count: number;
  dropoff_rate: number;
}

interface ValidatorFunnelProps {
  funnel: FunnelStep[];
}

export function ValidatorFunnel({ funnel }: ValidatorFunnelProps) {
  const initialCount = funnel[0]?.count || 1;

  return (
    <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-5 card-highlight space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Guardrail Defense Cascade & Drop-off Funnel
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Step-by-step filtering efficiency across the active validator chain
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {funnel.map((step, idx) => {
          const pctOfTotal = Math.round((step.count / initialCount) * 100);
          const isInitial = idx === 0;
          const isFinal = idx === funnel.length - 1;

          // Color logic: Probes entering (rose), filtered stages (sage), final bypasses (rose if >0)
          const barColor = isInitial
            ? "var(--probe)"
            : isFinal
            ? "var(--probe)"
            : "var(--validator)";

          const prevCount = idx > 0 ? funnel[idx - 1].count : step.count;
          const filteredOutHere = prevCount - step.count;

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[var(--text-primary)]">
                    {step.stage}
                  </span>
                  {idx > 0 && filteredOutHere > 0 && (
                    <Badge variant="validator" className="text-[10px] py-0 px-1.5">
                      -{filteredOutHere} blocked (
                      {formatPercent(step.dropoff_rate)})
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3 tabular-nums">
                  <span className="font-semibold text-[var(--text-primary)]">
                    {step.count}
                  </span>
                  <span className="text-[var(--text-muted)] text-[11px] w-10 text-right">
                    {pctOfTotal}%
                  </span>
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="h-2 w-full rounded-full bg-[var(--surface-raised)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(2, pctOfTotal)}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--validator)] stroke-[1.75]" />
          <span>
            {initialCount - (funnel[funnel.length - 1]?.count || 0)} probes
            neutralized before model execution
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[var(--probe)] stroke-[1.75]" />
          <span>
            {funnel[funnel.length - 1]?.count || 0} subversion vectors reached target
          </span>
        </div>
      </div>
    </div>
  );
}
