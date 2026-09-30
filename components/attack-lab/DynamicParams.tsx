"use client";

import React from "react";
import { useAttackConfig } from "@/hooks/useAttackConfig";
import { type ProbeParamSchema } from "@/types/api";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown";
import { ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicParamsProps {
  paramSchemas: Record<string, ProbeParamSchema>;
}

export function DynamicParams({ paramSchemas }: DynamicParamsProps) {
  const { params, setParam } = useAttackConfig();

  if (!paramSchemas || Object.keys(paramSchemas).length === 0) {
    return (
      <div className="text-[12px] text-[var(--text-muted)] italic">
        No configurable hyperparameters for this probe.
      </div>
    );
  }

  const formatParamLabel = (key: string) => {
    return key
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-[11px] leading-[1.4] tracking-[0.03em] font-medium uppercase text-[var(--text-muted)] select-none">
          Hyperparameters
        </label>
        <span className="text-[11px] text-[var(--text-muted)]">
          {Object.keys(paramSchemas).length} configurable
        </span>
      </div>

      <div className="space-y-3 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] p-4">
        {Object.entries(paramSchemas).map(([key, schema]) => {
          const currentValue = params[key] ?? schema.default;

          if (schema.type === "number") {
            const numVal = Number(currentValue ?? 0);
            const step = schema.step || 1;
            const min = schema.min ?? 0;
            const max = schema.max ?? 1000;

            const increment = () => {
              const next = Math.min(max, Number((numVal + step).toFixed(2)));
              setParam(key, next);
            };

            const decrement = () => {
              const next = Math.max(min, Number((numVal - step).toFixed(2)));
              setParam(key, next);
            };

            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-[var(--text-primary)]">
                    {formatParamLabel(key)}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {schema.description}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={numVal}
                      step={step}
                      min={min}
                      max={max}
                      onChange={(e) => setParam(key, Number(e.target.value))}
                      className="h-9 w-full rounded-[6px] bg-[var(--surface-raised)] text-[var(--text-primary)] px-3 text-[13px] tabular-nums border border-[var(--border)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>

                  {/* Stepper Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={decrement}
                      className="w-9 h-9 flex items-center justify-center rounded-[6px] bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors focus-ring"
                    >
                      <Minus className="w-3.5 h-3.5 stroke-[2]" />
                    </button>
                    <button
                      type="button"
                      onClick={increment}
                      className="w-9 h-9 flex items-center justify-center rounded-[6px] bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors focus-ring"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          if (schema.type === "enum") {
            const options = schema.options || [];
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-[var(--text-primary)]">
                    {formatParamLabel(key)}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {schema.description}
                  </span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full h-9 px-3 rounded-[6px] bg-[var(--surface-raised)] border border-[var(--border)] text-[13px] flex items-center justify-between text-left focus-ring"
                    >
                      <span className="font-medium text-[var(--text-primary)] capitalize">
                        {String(currentValue)}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    {options.map((opt) => (
                      <DropdownMenuItem
                        key={opt}
                        onClick={() => setParam(key, opt)}
                        className="capitalize"
                      >
                        {opt}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          }

          if (schema.type === "boolean") {
            const boolVal = Boolean(currentValue);
            return (
              <div
                key={key}
                onClick={() => setParam(key, !boolVal)}
                className="flex items-center justify-between py-1 cursor-pointer"
              >
                <div>
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">
                    {formatParamLabel(key)}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {schema.description}
                  </div>
                </div>

                <div
                  className={cn(
                    "w-9 h-5 rounded-full p-0.5 transition-colors flex items-center shrink-0 ml-3",
                    boolVal
                      ? "bg-[var(--accent)]"
                      : "bg-[var(--surface-raised)] border border-[var(--border)]"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full bg-white transition-transform",
                      boolVal ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </div>
              </div>
            );
          }

          // Fallback string input
          return (
            <div key={key} className="space-y-1">
              <span className="text-[12px] font-medium text-[var(--text-primary)]">
                {formatParamLabel(key)}
              </span>
              <Input
                value={String(currentValue ?? "")}
                onChange={(e) => setParam(key, e.target.value)}
                placeholder={schema.description}
                className="h-9"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
