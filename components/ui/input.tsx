import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      hint,
      iconLeft,
      iconRight,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full flex flex-col">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] leading-[1.4] tracking-[0.03em] font-medium uppercase text-[var(--text-muted)] mb-1.5 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {iconLeft && (
            <div className="absolute left-3 text-[var(--text-muted)] pointer-events-none flex items-center justify-center">
              {iconLeft}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              "h-10 w-full rounded-[8px] bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-[14px]",
              "border border-[var(--border)] transition-all duration-150",
              "focus:outline-none focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent)]/20",
              "disabled:cursor-not-allowed disabled:opacity-40",
              iconLeft ? "pl-9" : "pl-3",
              iconRight ? "pr-9" : "pr-3",
              error &&
                "border-[var(--probe)] focus:border-[var(--probe)] focus:ring-[var(--probe)]/20",
              className
            )}
            {...props}
          />

          {iconRight && (
            <div className="absolute right-3 text-[var(--text-muted)] pointer-events-none flex items-center justify-center">
              {iconRight}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-[12px] text-[var(--probe)] flex items-center gap-1 font-normal">
            {error}
          </p>
        )}

        {!error && hint && (
          <p className="mt-1.5 text-[12px] text-[var(--text-muted)] font-normal">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
