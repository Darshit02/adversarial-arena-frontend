"use client";

import React from "react";
import { useAttackConfig } from "@/hooks/useAttackConfig";
import { type ModelUnderTest } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TargetModelPickerProps {
  models: ModelUnderTest[];
}

export function TargetModelPicker({ models }: TargetModelPickerProps) {
  const { mutIds, toggleMut } = useAttackConfig();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] leading-[1.4] tracking-[0.03em] font-medium uppercase text-[var(--text-muted)] select-none">
          Models Under Test (MUT)
        </label>
        <span className="text-[11px] text-[var(--text-muted)]">
          {mutIds.length} of {models.length} selected
        </span>
      </div>

      <div className="space-y-2">
        {models.map((model) => {
          const isSelected = mutIds.includes(model.id);

          return (
            <div
              key={model.id}
              onClick={() => toggleMut(model.id)}
              className={cn(
                "p-3 rounded-[8px] border transition-all cursor-pointer flex items-center justify-between select-none",
                isSelected
                  ? "bg-[var(--surface-hover)] border-[var(--accent)] ring-1 ring-[var(--accent)]/30"
                  : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border-subtle)]"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Custom Checkbox */}
                <div
                  className={cn(
                    "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0",
                    isSelected
                      ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                      : "border-[var(--border)] bg-[var(--surface-raised)]"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                </div>

                {/* Model Info */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[13px] text-[var(--text-primary)]">
                      {model.name}
                    </span>
                    <Badge variant="neutral" className="text-[10px] h-[18px]">
                      {model.provider}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate max-w-[200px]">
                    {model.model_identifier}
                  </div>
                </div>
              </div>

              {/* Status Dot & Latency Estimate */}
              <div className="flex items-center gap-2.5 text-right shrink-0">
                <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
                  ~{model.latency_ms || 240}ms
                </span>
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    model.status === "online"
                      ? "bg-[var(--validator)]"
                      : "bg-[var(--text-muted)]"
                  )}
                  title={model.status === "online" ? "Online" : "Offline"}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
