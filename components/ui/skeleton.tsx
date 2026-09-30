import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "table-row" | "avatar" | "custom";
}

export function Skeleton({
  variant = "text",
  className,
  ...props
}: SkeletonProps) {
  if (variant === "table-row") {
    return (
      <div
        className={cn(
          "flex items-center gap-4 h-[42px] px-4 w-full border-b border-[var(--border-subtle)]",
          className
        )}
        {...props}
      >
        <div className="h-3 w-16 rounded-[4px] animate-shimmer" />
        <div className="h-3 w-28 rounded-[4px] animate-shimmer" />
        <div className="h-3 w-40 rounded-[4px] animate-shimmer flex-1" />
        <div className="h-3 w-16 rounded-[4px] animate-shimmer" />
        <div className="h-3 w-12 rounded-[4px] animate-shimmer" />
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 card-highlight",
          className
        )}
        {...props}
      >
        <div className="h-4 w-1/3 rounded-[4px] animate-shimmer" />
        <div className="h-8 w-2/3 rounded-[6px] animate-shimmer" />
        <div className="h-3 w-full rounded-[4px] animate-shimmer" />
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div
        className={cn("w-8 h-8 rounded-full animate-shimmer shrink-0", className)}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn("h-4 w-full rounded-[4px] animate-shimmer", className)}
      {...props}
    />
  );
}
