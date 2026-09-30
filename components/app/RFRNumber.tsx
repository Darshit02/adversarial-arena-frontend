import React from "react";
import { cn } from "@/lib/utils";
import { rfrColor } from "@/lib/color-semantics";
import { formatRFR } from "@/lib/formatters";

export interface RFRNumberProps {
  rfr: number;
  size?: "sm" | "md" | "lg" | "display";
  className?: string;
  showPercent?: boolean;
}

const sizeClasses = {
  sm: "text-[13px] font-semibold tabular-nums",
  md: "text-[16px] font-semibold tabular-nums",
  lg: "text-[24px] font-semibold tabular-nums",
  display: "font-display text-[44px] md:text-[48px] leading-[1.1] font-medium tracking-[-0.03em] tabular-nums",
};

const colorClasses = {
  probe: "text-[var(--probe)]",
  warning: "text-[var(--warning)]",
  validator: "text-[var(--validator)]",
};

export function RFRNumber({
  rfr,
  size = "md",
  className,
}: RFRNumberProps) {
  const semantic = rfrColor(rfr);

  return (
    <span
      className={cn(
        sizeClasses[size],
        colorClasses[semantic],
        className
      )}
    >
      {formatRFR(rfr)}
    </span>
  );
}
