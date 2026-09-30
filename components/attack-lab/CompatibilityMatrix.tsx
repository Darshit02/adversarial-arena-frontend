"use client";

import React from "react";
import { useAttackConfig } from "@/hooks/useAttackConfig";
import { type ProbeRegistryItem, type ModelUnderTest } from "@/types/api";
import { Card } from "@/components/ui/card";
import { Check, X, Clock, DollarSign } from "lucide-react";

interface CompatibilityMatrixProps {
  probes: ProbeRegistryItem[];
  models: ModelUnderTest[];
}

export function CompatibilityMatrix({
  probes,
  models,
}: CompatibilityMatrixProps) {
  const { probeType, mutIds } = useAttackConfig();

  // White-box algorithms (like GCG) require weights/gradients, not compatible with black-box API
  const isCompatible = (probe: ProbeRegistryItem, model: ModelUnderTest) => {
    if (probe.requires_whitebox) {
      return model.provider === "ollama" || model.provider === "vllm";
    }
    return true;
  };

  const selectedProbe = probes.find((p) => p.type === probeType);
  const selectedModelsCount = mutIds.length || 1;

  // Approximate cost and runtime calculation
  const estCost = (0.14 * selectedModelsCount).toFixed(2);
  const estMinutes = Math.max(1, selectedModelsCount * 1.5).toFixed(0);
  const estSeconds = 20;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[13px] text-[var(--text-primary)]">
          Compatibility & Resource Estimates
        </span>
        <span className="text-[11px] text-[var(--text-muted)]">
          Target Support Grid
        </span>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-[6px] border border-[var(--border)]">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="bg-[var(--surface-raised)] border-b border-[var(--border)]">
              <th className="p-2 text-left font-medium text-[var(--text-muted)] text-[11px] uppercase tracking-wider">
                Model
              </th>
              {probes.slice(0, 4).map((p) => (
                <th
                  key={p.id}
                  className={`p-2 text-center font-medium text-[11px] uppercase tracking-wider ${
                    p.type === probeType
                      ? "text-[var(--accent)] font-semibold"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {p.type}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--surface)]">
            {models.map((model) => (
              <tr
                key={model.id}
                className={
                  mutIds.includes(model.id)
                    ? "bg-[var(--surface-hover)]/60"
                    : undefined
                }
              >
                <td className="p-2 font-medium text-[var(--text-primary)]">
                  {model.name}
                </td>
                {probes.slice(0, 4).map((p) => {
                  const compat = isCompatible(p, model);
                  return (
                    <td key={p.id} className="p-2 text-center">
                      {compat ? (
                        <Check className="w-3.5 h-3.5 text-[var(--validator)] mx-auto stroke-[2.5]" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-[var(--probe)] mx-auto stroke-[2.5]" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cost + Time Estimate Chips */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[var(--surface-raised)] border border-[var(--border)] text-[12px]">
            <DollarSign className="w-3.5 h-3.5 text-[var(--warning)] stroke-[2]" />
            <span className="text-[var(--text-muted)]">Est. Cost:</span>
            <span className="font-semibold text-[var(--text-primary)] tabular-nums">
              ~${estCost}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[var(--surface-raised)] border border-[var(--border)] text-[12px]">
            <Clock className="w-3.5 h-3.5 text-[var(--info)] stroke-[2]" />
            <span className="text-[var(--text-muted)]">Est. Time:</span>
            <span className="font-semibold text-[var(--text-primary)] tabular-nums">
              ~{estMinutes}m {estSeconds}s
            </span>
          </div>
        </div>

        <span className="text-[11px] text-[var(--text-muted)]">
          {mutIds.length} MUTs selected
        </span>
      </div>
    </Card>
  );
}
