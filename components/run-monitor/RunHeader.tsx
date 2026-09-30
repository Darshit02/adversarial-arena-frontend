"use client";

import React, { useState } from "react";
import { type RunStatus } from "@/types/api";
import { RunStatusPill } from "@/components/app/RunStatusPill";
import { formatDuration } from "@/lib/formatters";
import { Copy, Check, Clock } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface RunHeaderProps {
  runId: string;
  status: RunStatus;
  elapsedSeconds: number;
}

export function RunHeader({ runId, status, elapsedSeconds }: RunHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(runId);
    setCopied(true);
    toast.success("Run ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[var(--surface)] border border-[var(--border)] rounded-[12px] card-highlight">
      {/* Left: Run ID & Copy */}
      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)] select-none">
          Benchmark Run Identifier
        </span>

        <div className="flex items-center gap-3">
          <h1 className="text-[24px] font-semibold text-[var(--text-primary)] tabular-nums tracking-[-0.01em]">
            {runId}
          </h1>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border)] transition-colors focus-ring"
            title="Copy Run ID"
          >
            {copied ? (
              <Check className="w-4 h-4 stroke-[2.5] text-[var(--validator)]" />
            ) : (
              <Copy className="w-4 h-4 stroke-[1.75]" />
            )}
          </button>
        </div>
      </div>

      {/* Right: Status Pill & Elapsed Timer */}
      <div className="flex items-center gap-6">
        <div className="space-y-1 text-right sm:text-left">
          <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)] select-none">
            State
          </span>
          <div>
            <RunStatusPill status={status} />
          </div>
        </div>

        <div className="space-y-1 text-right">
          <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)] select-none">
            Elapsed Time
          </span>
          <div className="flex items-center gap-1.5 text-[15px] font-medium text-[var(--text-primary)] tabular-nums justify-end">
            <Clock className="w-4 h-4 text-[var(--text-muted)] stroke-[1.75]" />
            <span>{formatDuration(elapsedSeconds * 1000)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
