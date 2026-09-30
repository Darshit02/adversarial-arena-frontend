"use client";

import React from "react";
import { type Validator } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelative } from "@/lib/formatters";
import {
  Shield,
  Sliders,
  Trash2,
  CheckCircle,
  XCircle,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidatorCardProps {
  validator: Validator;
  onToggle: (id: string, is_enabled: boolean) => void;
  onConfigure: (validator: Validator) => void;
  onDelete: (validator: Validator) => void;
}

export function ValidatorCard({
  validator,
  onToggle,
  onConfigure,
  onDelete,
}: ValidatorCardProps) {
  const getBadgeLabel = () => {
    switch (validator.type) {
      case "keyword_filter":
        return "Keyword Filter";
      case "llm_judge":
        return "LLM Judge";
      case "cot_defender":
        return "CoT Defender";
      case "custom_webhook":
        return "Custom Webhook";
      default:
        return validator.type;
    }
  };

  return (
    <div
      className={cn(
        "p-5 rounded-[12px] bg-[var(--surface)] border card-highlight flex flex-col justify-between transition-all space-y-4",
        validator.is_enabled
          ? "border-[var(--border)]"
          : "border-[var(--border-subtle)] opacity-70"
      )}
    >
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[15px] text-[var(--text-primary)]">
                {validator.name}
              </h3>
              <Badge variant="validator" className="text-[10px]">
                {getBadgeLabel()}
              </Badge>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
              {validator.description}
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={validator.is_enabled}
            onClick={() => onToggle(validator.id, !validator.is_enabled)}
            className={cn(
              "w-11 h-6 rounded-full transition-colors relative focus-ring shrink-0",
              validator.is_enabled
                ? "bg-[var(--validator)]"
                : "bg-[var(--surface-raised)] border border-[var(--border)]"
            )}
            title={validator.is_enabled ? "Disable guardrail" : "Enable guardrail"}
          >
            <span
              className={cn(
                "block w-4 h-4 rounded-full bg-white transition-transform absolute top-1",
                validator.is_enabled ? "left-6" : "left-1"
              )}
            />
          </button>
        </div>

        {/* Configuration Tags */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px]">
          {Object.entries(validator.config || {}).map(([key, val]) => (
            <span
              key={key}
              className="px-2 py-0.5 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[var(--text-secondary)] tabular-nums"
            >
              <strong className="text-[var(--text-muted)] font-normal mr-1">
                {key}:
              </strong>
              {String(val)}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onConfigure(validator)}
          iconLeft={<Sliders className="w-3.5 h-3.5 stroke-[1.75]" />}
        >
          Configure &amp; Test
        </Button>

        <button
          type="button"
          onClick={() => onDelete(validator)}
          className="p-2 rounded-[6px] hover:bg-[var(--probe-bg)] text-[var(--text-muted)] hover:text-[var(--probe)] transition-colors focus-ring"
          title="Delete Guardrail"
          aria-label="Delete Guardrail"
        >
          <Trash2 className="w-4 h-4 stroke-[1.75]" />
        </button>
      </div>
    </div>
  );
}
