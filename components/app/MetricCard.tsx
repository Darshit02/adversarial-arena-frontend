import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  delta?: string;
  isPositiveDelta?: boolean;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  delta,
  isPositiveDelta,
  subtitle,
  children,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("p-6 flex flex-col justify-between space-y-4", className)}>
      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)] select-none">
          {title}
        </span>

        <div className="flex items-baseline justify-between pt-1">
          <div className="text-[28px] font-semibold text-[var(--text-primary)]">
            {value}
          </div>

          {delta && (
            <div
              className={cn(
                "inline-flex items-center gap-0.5 text-[12px] font-medium tabular-nums",
                isPositiveDelta ? "text-[var(--validator)]" : "text-[var(--probe)]"
              )}
            >
              {isPositiveDelta ? (
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 stroke-[2]" />
              )}
              <span>{delta}</span>
            </div>
          )}
        </div>

        {subtitle && (
          <div className="text-[12px] text-[var(--text-secondary)] pt-0.5">
            {subtitle}
          </div>
        )}
      </div>

      {children && <div className="pt-2">{children}</div>}
    </Card>
  );
}
