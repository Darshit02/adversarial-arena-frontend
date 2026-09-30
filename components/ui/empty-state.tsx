import React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center max-w-[400px] mx-auto py-12 px-6",
        className
      )}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] mb-4">
        <Icon className="w-8 h-8 text-[var(--text-muted)] stroke-[1.75]" />
      </div>

      <h3 className="text-[18px] font-semibold text-[var(--text-primary)] tracking-[-0.01em] mb-1.5">
        {title}
      </h3>

      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-6">
        {description}
      </p>

      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
