"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Cpu } from "lucide-react";

interface OverallProgressProps {
  completedCount: number;
  totalCount: number;
  models?: Array<{ id: string; name: string; completed: number; total: number }>;
}

export function OverallProgress({
  completedCount,
  totalCount,
  models = [
    { id: "m1", name: "gpt-4o-mini", completed: 8, total: 20 },
    { id: "m2", name: "llama3:8b", completed: 4, total: 20 },
  ],
}: OverallProgressProps) {
  const percent = Math.min(100, Math.round((completedCount / (totalCount || 1)) * 100));

  return (
    <Card className="p-6 space-y-5">
      {/* Overall Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[var(--text-primary)]">
            Overall Suite Progress
          </span>
          <span className="font-medium text-[var(--text-muted)] tabular-nums">
            {completedCount} / {totalCount} probes complete ({percent}%)
          </span>
        </div>

        {/* Accent Main Progress Bar */}
        <div className="h-2.5 w-full bg-[var(--surface-raised)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Per-MUT Sub-progress Bars */}
      <div className="pt-3 border-t border-[var(--border-subtle)] space-y-3">
        <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)] select-none">
          Per-ModelUnderTest Progress
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {models.map((m) => {
            const mPercent = Math.min(100, Math.round((m.completed / (m.total || 1)) * 100));

            return (
              <div
                key={m.id}
                className="p-3 rounded-[8px] bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-2"
              >
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
                    <Cpu className="w-3.5 h-3.5 text-[var(--text-muted)] stroke-[1.75]" />
                    <span>{m.name}</span>
                  </div>
                  <span className="text-[var(--text-muted)] tabular-nums">
                    {m.completed}/{m.total}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-[var(--surface-raised)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent-muted)] rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${mPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
