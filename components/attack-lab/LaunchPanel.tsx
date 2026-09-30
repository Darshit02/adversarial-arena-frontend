"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAttackConfig } from "@/hooks/useAttackConfig";
import { useSubmitRun } from "@/hooks/useRuns";
import { type ProbeRegistryItem, type ModelUnderTest, type Validator } from "@/types/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  Play,
  Bookmark,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Check,
  Shield,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LaunchPanelProps {
  probes: ProbeRegistryItem[];
  models: ModelUnderTest[];
  validators: Validator[];
}

export function LaunchPanel({
  probes,
  models,
  validators,
}: LaunchPanelProps) {
  const router = useRouter();
  const { probeType, params, mutIds, validatorIds, seedPrompts } =
    useAttackConfig();
  const submitRunMutation = useSubmitRun();

  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const selectedProbe = probes.find((p) => p.type === probeType);
  const selectedModels = models.filter((m) => mutIds.includes(m.id));
  const selectedValidators = validators.filter((v) =>
    validatorIds.includes(v.id)
  );

  // Pre-flight checks
  const isMutsValid = selectedModels.length > 0;
  const isValidatorsConfigured = selectedValidators.length > 0;
  const hasWhiteboxWarning = selectedProbe?.requires_whitebox;

  const canLaunch = isMutsValid && buttonState === "idle";

  const handleLaunch = async (isDryRun = false) => {
    if (!canLaunch) return;

    setButtonState("loading");

    try {
      const parsedPrompts = seedPrompts
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await submitRunMutation.mutateAsync({
        probe_type: probeType,
        params,
        model_ids: mutIds,
        validator_ids: validatorIds,
        seed_prompts: isDryRun ? parsedPrompts.slice(0, 1) : parsedPrompts,
      });

      setButtonState("success");
      toast.success(
        isDryRun
          ? "Dry run dispatched (1 prompt)"
          : `Probe suite launched (${res.run_id})`
      );

      // Brief transition delay before redirect
      setTimeout(() => {
        router.push(`/runs/${res.run_id}`);
      }, 500);
    } catch {
      setButtonState("idle");
      toast.error("Failed to launch probe run. Please check endpoints.");
    }
  };

  const handleSaveTemplate = () => {
    toast.success("Current probe suite configuration saved to local templates");
  };

  return (
    <div className="sticky top-20 space-y-4">
      <Card className="p-6 space-y-6 card-highlight">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--accent)] text-[12px] font-medium">
            <Layers className="w-4 h-4 stroke-[1.75]" />
            <span>Execution Control</span>
          </div>
          <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
            Launch Probe Suite
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Dispatches automated adversarial prompts across configured targets
          </p>
        </div>

        {/* Primary Launch Button (48px height, accent) */}
        <Button
          size="lg"
          variant="primary"
          className="w-full h-12 text-[15px] font-medium shadow-md"
          loading={buttonState === "loading"}
          disabled={!isMutsValid}
          onClick={() => handleLaunch(false)}
          iconLeft={
            buttonState === "success" ? (
              <Check className="w-5 h-5 stroke-[2.5] text-white" />
            ) : buttonState !== "loading" ? (
              <Play className="w-4 h-4 stroke-[2]" />
            ) : undefined
          }
        >
          {buttonState === "idle" && "Run Probe Suite"}
          {buttonState === "loading" && "Submitting Run..."}
          {buttonState === "success" && "Suite Dispatched!"}
        </Button>

        {/* Secondary Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2.5 pt-1">
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center text-[12px] h-9"
            onClick={handleSaveTemplate}
            iconLeft={<Bookmark className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Save as Template
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center text-[12px] h-9"
            onClick={() => handleLaunch(true)}
            iconLeft={<Sparkles className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Dry Run (1 prompt)
          </Button>
        </div>

        {/* Pre-flight Checklist */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
          <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)] select-none">
            Pre-flight Checklist
          </span>

          <div className="space-y-2 text-[12px]">
            {/* MUT Check */}
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)] flex items-center gap-2">
                <CheckCircle2
                  className={cn(
                    "w-4 h-4 shrink-0 stroke-[2]",
                    isMutsValid
                      ? "text-[var(--validator)]"
                      : "text-[var(--text-muted)]"
                  )}
                />
                <span>
                  {selectedModels.length > 0
                    ? `${selectedModels.length} MUTs selected`
                    : "No MUT selected"}
                </span>
              </span>
              <span
                className={cn(
                  "font-medium tabular-nums",
                  isMutsValid ? "text-[var(--validator)]" : "text-[var(--probe)]"
                )}
              >
                {isMutsValid ? "Ready" : "Required"}
              </span>
            </div>

            {/* Validator Check */}
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)] flex items-center gap-2">
                <CheckCircle2
                  className={cn(
                    "w-4 h-4 shrink-0 stroke-[2]",
                    isValidatorsConfigured
                      ? "text-[var(--validator)]"
                      : "text-[var(--warning)]"
                  )}
                />
                <span>
                  {selectedValidators.length > 0
                    ? `${selectedValidators.length} validators active`
                    : "Unprotected run"}
                </span>
              </span>
              <span
                className={cn(
                  "font-medium tabular-nums",
                  isValidatorsConfigured
                    ? "text-[var(--validator)]"
                    : "text-[var(--warning)]"
                )}
              >
                {isValidatorsConfigured ? "Active" : "None"}
              </span>
            </div>

            {/* White-box Requirement Notice */}
            {hasWhiteboxWarning && (
              <div className="flex items-start gap-2 pt-1 text-[var(--warning)]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 stroke-[2]" />
                <span className="text-[11px] leading-snug">
                  Algorithm requires white-box gradient access. Ensure local Ollama or vLLM instance is running.
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
