import React from "react";
import { type RunStatus } from "@/types/api";
import { cn } from "@/lib/utils";

export interface RunStatusPillProps {
  status: RunStatus | "RUNNING" | "COMPLETED" | "FAILED" | "ABORTED" | "PENDING";
  className?: string;
}

export function RunStatusPill({ status, className }: RunStatusPillProps) {
  const configs = {
    RUNNING: {
      label: "Running",
      badge: "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/30",
      dot: "bg-[var(--warning)] animate-pulse",
    },
    COMPLETED: {
      label: "Completed",
      badge: "bg-[var(--validator-bg)] text-[var(--validator)] border-[var(--validator)]/30",
      dot: "bg-[var(--validator)]",
    },
    FAILED: {
      label: "Failed",
      badge: "bg-[var(--probe-bg)] text-[var(--probe)] border-[var(--probe)]/30",
      dot: "bg-[var(--probe)]",
    },
    ABORTED: {
      label: "Aborted",
      badge: "bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--border)]",
      dot: "bg-[var(--text-muted)]",
    },
    PENDING: {
      label: "Pending",
      badge: "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]/30",
      dot: "bg-[var(--info)] animate-pulse",
    },
  };

  const config = configs[status] || configs.PENDING;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-[22px] px-2 rounded-[6px] text-[11px] font-medium leading-none select-none tracking-[0.02em] border",
        config.badge,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      <span>{config.label}</span>
    </span>
  );
}
