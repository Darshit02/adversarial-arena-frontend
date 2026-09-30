import React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { Wordmark } from "./Wordmark";

export interface BrandLockupProps {
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "default" | "mono";
}

const logoSizeMap: Record<NonNullable<BrandLockupProps["size"]>, number> = {
  sm: 24,
  md: 32,
  lg: 44,
};

export function BrandLockup({
  orientation = "horizontal",
  size = "md",
  className,
  variant = "default",
}: BrandLockupProps) {
  const logoPx = logoSizeMap[size];

  return (
    <div
      className={cn(
        "inline-flex items-center select-none",
        orientation === "horizontal"
          ? "flex-row gap-3"
          : "flex-col gap-2.5 text-center",
        className
      )}
    >
      <Logo size={logoPx} variant={variant} />
      <Wordmark size={size} />
    </div>
  );
}
