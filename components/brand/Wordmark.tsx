import React from "react";
import { cn } from "@/lib/utils";

export interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<WordmarkProps["size"]>, string> = {
  sm: "text-[15px] leading-tight",
  md: "text-[18px] leading-snug",
  lg: "text-[22px] leading-snug",
};

export function Wordmark({ size = "md", className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "font-display font-medium tracking-[-0.02em] text-[var(--text-primary)] select-none",
        sizeClasses[size],
        className
      )}
    >
      Adversarial Arena
    </span>
  );
}
