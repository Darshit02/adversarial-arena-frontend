"use client";

import React from "react";
import { useAttackConfig } from "@/hooks/useAttackConfig";
import { type Validator } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Filter, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidatorTogglesProps {
  validators: Validator[];
}

export function ValidatorToggles({ validators }: ValidatorTogglesProps) {
  const { validatorIds, toggleValidator } = useAttackConfig();

  const getValidatorIcon = (type: string) => {
    switch (type) {
      case "keyword_filter":
        return Filter;
      case "llm_judge":
        return ShieldCheck;
      case "cot_defender":
        return Cpu;
      default:
        return ShieldCheck;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] leading-[1.4] tracking-[0.03em] font-medium uppercase text-[var(--text-muted)] select-none">
          Validator Defense Stack
        </label>
        <span className="text-[11px] text-[var(--text-muted)]">
          {validatorIds.length} active in chain
        </span>
      </div>

      <div className="space-y-2">
        {validators.map((val) => {
          const isEnabled = validatorIds.includes(val.id);
          const Icon = getValidatorIcon(val.type);

          return (
            <div
              key={val.id}
              onClick={() => toggleValidator(val.id)}
              className={cn(
                "p-3 rounded-[8px] border transition-all cursor-pointer flex items-center justify-between select-none relative",
                isEnabled
                  ? "bg-[var(--surface-hover)] border-[var(--border)] border-l-[3px] border-l-[var(--validator)]"
                  : "bg-[var(--surface)] border-[var(--border)] opacity-60 hover:opacity-90"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "p-1.5 rounded-[6px] transition-colors mt-0.5 shrink-0",
                    isEnabled
                      ? "bg-[var(--validator-bg)] text-[var(--validator)]"
                      : "bg-[var(--surface-raised)] text-[var(--text-muted)]"
                  )}
                >
                  <Icon className="w-4 h-4 stroke-[1.75]" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[13px] text-[var(--text-primary)]">
                      {val.name}
                    </span>
                    <Badge
                      variant={isEnabled ? "validator" : "neutral"}
                      className="text-[9px] h-4 px-1"
                    >
                      {val.type}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-snug line-clamp-1">
                    {val.description}
                  </p>
                </div>
              </div>

              {/* Toggle representation */}
              <div
                className={cn(
                  "w-9 h-5 rounded-full p-0.5 transition-colors flex items-center shrink-0 ml-3",
                  isEnabled
                    ? "bg-[var(--validator)]"
                    : "bg-[var(--surface-raised)] border border-[var(--border)]"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform",
                    isEnabled ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
