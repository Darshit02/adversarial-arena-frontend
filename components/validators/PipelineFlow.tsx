"use client";

import React from "react";
import { type Validator } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, ShieldAlert, Cpu, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineFlowProps {
  validators: Validator[];
}

export function PipelineFlow({ validators }: PipelineFlowProps) {
  const enabledValidators = validators.filter((v) => v.is_enabled);

  return (
    <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-5 card-highlight space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Active Guardrail Defense Pipeline
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Sequential interception topology applied to incoming probe payloads
          </p>
        </div>

        <Badge variant="validator" className="text-[11px]">
          {enabledValidators.length} Active Stages
        </Badge>
      </div>

      {/* Visual Pipeline Strip */}
      <div className="overflow-x-auto py-2">
        <div className="flex items-center gap-3 min-w-[700px]">
          {/* 1. Origin: Adversarial Probe Ingestion */}
          <div className="p-3 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] w-40 shrink-0 space-y-1 text-center">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold flex items-center justify-center gap-1">
              <Terminal className="w-3 h-3 stroke-[1.75]" /> Ingestion
            </span>
            <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">
              Probe Vector
            </p>
          </div>

          <ArrowRight className="w-4 h-4 stroke-[1.75] text-[var(--text-muted)] shrink-0" />

          {/* 2. Sequential Validator Nodes */}
          {validators.length === 0 ? (
            <div className="p-3 rounded-[8px] border border-dashed border-[var(--border)] text-[12px] text-[var(--text-muted)] text-center w-full">
              No guardrails configured in pipeline.
            </div>
          ) : (
            validators.map((val, idx) => (
              <React.Fragment key={val.id}>
                <div
                  className={cn(
                    "p-3 rounded-[8px] border w-48 shrink-0 space-y-1 transition-all",
                    val.is_enabled
                      ? "bg-[var(--validator-bg)] border-[var(--validator)]/40 shadow-sm"
                      : "bg-[var(--surface-raised)] border-[var(--border-subtle)] opacity-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">
                      Stage {idx + 1}
                    </span>
                    {val.is_enabled ? (
                      <span className="text-[10px] text-[var(--validator)] font-semibold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)]">
                        BYPASSED
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">
                    {val.name}
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] capitalize truncate">
                    {val.type.replace("_", " ")}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 stroke-[1.75] text-[var(--text-muted)] shrink-0" />
              </React.Fragment>
            ))
          )}

          {/* 3. Destination: Model Under Test */}
          <div className="p-3 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] w-40 shrink-0 space-y-1 text-center">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold flex items-center justify-center gap-1">
              <Cpu className="w-3 h-3 stroke-[1.75]" /> Target MUT
            </span>
            <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">
              Foundation Model
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
