"use client";

import React from "react";
import { useAttackConfig } from "@/hooks/useAttackConfig";
import { type Validator } from "@/types/api";
import { ArrowRight, Cpu, ShieldAlert, ShieldCheck } from "lucide-react";

interface ValidatorChainProps {
  validators: Validator[];
}

export function ValidatorChain({ validators }: ValidatorChainProps) {
  const { probeType, validatorIds, mutIds } = useAttackConfig();

  const activeValidators = validators.filter((v) =>
    validatorIds.includes(v.id)
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] leading-[1.4] tracking-[0.03em] font-medium uppercase text-[var(--text-muted)] select-none">
          Live Defense Pipeline
        </label>
        <span className="text-[11px] text-[var(--text-muted)]">
          Inbound → Execution
        </span>
      </div>

      <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] flex items-center gap-2 overflow-x-auto text-[12px] select-none">
        {/* Probe Stage (Rose) */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[var(--probe-bg)] text-[var(--probe)] border border-[var(--probe)]/30 font-medium shrink-0">
          <ShieldAlert className="w-3.5 h-3.5 stroke-[1.75]" />
          <span className="capitalize">{probeType}</span>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />

        {/* Validator Middlewares (Sage) */}
        {activeValidators.length === 0 ? (
          <div className="inline-flex items-center px-2 py-1 rounded-[6px] bg-[var(--surface-raised)] text-[var(--text-muted)] border border-[var(--border)] text-[11px] italic shrink-0">
            No active guardrails
          </div>
        ) : (
          activeValidators.map((val) => (
            <React.Fragment key={val.id}>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[var(--validator-bg)] text-[var(--validator)] border border-[var(--validator)]/30 font-medium shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>{val.name}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            </React.Fragment>
          ))
        )}

        {/* MUT Target (Accent) */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[var(--surface-raised)] text-[var(--accent)] border border-[var(--accent)]/30 font-medium shrink-0">
          <Cpu className="w-3.5 h-3.5 stroke-[1.75]" />
          <span>
            {mutIds.length > 0 ? `${mutIds.length} MUTs` : "No MUT"}
          </span>
        </div>
      </div>
    </div>
  );
}
