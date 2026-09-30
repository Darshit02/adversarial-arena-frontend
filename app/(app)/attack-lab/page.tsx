"use client";

import React from "react";
import {
  useProbeRegistry,
  useModels,
  useValidators,
} from "@/hooks/useRuns";
import { useAttackConfig } from "@/hooks/useAttackConfig";
import { AttackTypeSelect } from "@/components/attack-lab/AttackTypeSelect";
import { DynamicParams } from "@/components/attack-lab/DynamicParams";
import { TargetModelPicker } from "@/components/attack-lab/TargetModelPicker";
import { ValidatorToggles } from "@/components/attack-lab/ValidatorToggles";
import { ValidatorChain } from "@/components/attack-lab/ValidatorChain";
import { PromptPreview } from "@/components/attack-lab/PromptPreview";
import { CompatibilityMatrix } from "@/components/attack-lab/CompatibilityMatrix";
import { LaunchPanel } from "@/components/attack-lab/LaunchPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sliders, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AttackLabPage() {
  const { data: probes, isLoading: probesLoading } = useProbeRegistry();
  const { data: models, isLoading: modelsLoading } = useModels();
  const { data: validators, isLoading: validatorsLoading } = useValidators();
  const { probeType, reset } = useAttackConfig();

  const isLoading = probesLoading || modelsLoading || validatorsLoading;

  if (isLoading || !probes || !models || !validators) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-4 space-y-4">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
          <div className="xl:col-span-5 space-y-4">
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </div>
          <div className="xl:col-span-3">
            <Skeleton variant="card" />
          </div>
        </div>
      </div>
    );
  }

  const currentProbe = probes.find((p) => p.type === probeType) || probes[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-[32px] font-medium text-[var(--text-primary)] tracking-[-0.02em]">
              Attack Lab Studio
            </h1>
            <Badge variant="validator" withDot>
              Registry Connected
            </Badge>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Configure multi-round adversarial probe suites, wire defensive validator chains, and test model robustness
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          iconLeft={<RotateCcw className="w-3.5 h-3.5 stroke-[1.75]" />}
        >
          Reset to Defaults
        </Button>
      </div>

      {/* 3-Column Layout (xl: 4/5/3 or 3/6/3 grid) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* COLUMN 1: Configuration (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          <AttackTypeSelect probes={probes} />

          <DynamicParams
            paramSchemas={currentProbe?.param_schemas || {}}
          />

          <TargetModelPicker models={models} />

          <ValidatorToggles validators={validators} />

          <ValidatorChain validators={validators} />
        </div>

        {/* COLUMN 2: Prompt Preview & Compatibility (5 cols) */}
        <div className="xl:col-span-5 space-y-6">
          <PromptPreview />

          <CompatibilityMatrix probes={probes} models={models} />
        </div>

        {/* COLUMN 3: Launch Panel (3 cols, sticky) */}
        <div className="xl:col-span-3">
          <LaunchPanel
            probes={probes}
            models={models}
            validators={validators}
          />
        </div>
      </div>
    </div>
  );
}
