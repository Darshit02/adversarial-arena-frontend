import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center justify-center h-[22px] px-2 rounded-[6px] text-[11px] font-medium leading-none select-none tracking-[0.02em] whitespace-nowrap transition-colors border",
  {
    variants: {
      variant: {
        neutral:
          "bg-[var(--surface-raised)] text-[var(--text-secondary)] border-[var(--border-subtle)]",
        probe:
          "bg-[var(--probe-bg)] text-[var(--probe)] border-[var(--probe)]/20",
        validator:
          "bg-[var(--validator-bg)] text-[var(--validator)] border-[var(--validator)]/20",
        warning:
          "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20",
        info:
          "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]/20",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

const dotColors: Record<
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>,
  string
> = {
  neutral: "bg-[var(--text-muted)]",
  probe: "bg-[var(--probe)]",
  validator: "bg-[var(--validator)]",
  warning: "bg-[var(--warning)]",
  info: "bg-[var(--info)]",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  withDot?: boolean;
}

export function Badge({
  className,
  variant = "neutral",
  withDot = false,
  children,
  ...props
}: BadgeProps) {
  const safeVariant = variant || "neutral";

  return (
    <span className={cn(badgeVariants({ variant: safeVariant }), className)} {...props}>
      {withDot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0 mr-1.5",
            dotColors[safeVariant]
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
