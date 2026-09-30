"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateValidator } from "@/hooks/useValidatorsManager";
import { type ValidatorType } from "@/types/api";
import { toast } from "@/components/ui/toast";
import {
  ShieldCheck,
  Sparkles,
  Sliders,
  Terminal,
  FileCode,
  Globe,
} from "lucide-react";

const validatorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum([
    "keyword_filter",
    "llm_judge",
    "cot_defender",
    "custom_webhook",
  ]),
  description: z.string().min(5, "Description is required"),
  sensitivity: z.string().optional(),
  judge_model: z.string().optional(),
  threshold: z.number().min(0.1).max(1.0).optional(),
  max_depth: z.number().min(1).max(10).optional(),
  webhook_url: z.string().url().optional().or(z.literal("")),
});

type ValidatorFormData = z.infer<typeof validatorSchema>;

interface AddValidatorModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddValidatorModal({ open, onClose }: AddValidatorModalProps) {
  const createValidator = useCreateValidator();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ValidatorFormData>({
    resolver: zodResolver(validatorSchema),
    defaultValues: {
      name: "",
      type: "keyword_filter",
      description: "",
      sensitivity: "high",
      judge_model: "gpt-4o-mini",
      threshold: 0.8,
      max_depth: 3,
      webhook_url: "",
    },
  });

  const selectedType = watch("type");

  const handleTypeSelect = (type: ValidatorType) => {
    setValue("type", type);
    if (type === "keyword_filter") {
      setValue("name", "Static Keyword Matcher");
      setValue("description", "Inspects input tokens against banned safety terms and regular expressions.");
    } else if (type === "llm_judge") {
      setValue("name", "LLM Intent Guardrail");
      setValue("description", "Zero-shot classification of prompt malice using secondary evaluator.");
    } else if (type === "cot_defender") {
      setValue("name", "Deconstructive CoT Defender");
      setValue("description", "Multi-turn reasoning trace verification detecting obfuscated deception.");
    } else if (type === "custom_webhook") {
      setValue("name", "Enterprise Webhook Gateway");
      setValue("description", "Forward incoming queries to custom internal compliance microservice.");
    }
  };

  const onSubmit = async (data: ValidatorFormData) => {
    let config: Record<string, unknown> = {};

    if (data.type === "keyword_filter") {
      config = { sensitivity: data.sensitivity || "high" };
    } else if (data.type === "llm_judge") {
      config = {
        judge_model: data.judge_model || "gpt-4o-mini",
        threshold: data.threshold || 0.8,
      };
    } else if (data.type === "cot_defender") {
      config = { max_depth: data.max_depth || 3 };
    } else if (data.type === "custom_webhook") {
      config = { webhook_url: data.webhook_url };
    }

    try {
      await createValidator.mutateAsync({
        name: data.name,
        type: data.type,
        description: data.description,
        is_enabled: true,
        config,
      });
      toast.success(`Created guardrail "${data.name}"`);
      reset();
      onClose();
    } catch {
      toast.error("Failed to create validator");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Defensive Guardrail"
      description="Deploy a new inspection stage into the live adversarial validation pipeline."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">
        {/* Type Selection */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.03em]">
            Guardrail Architecture
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: "keyword_filter",
                label: "Keyword Filter",
                sub: "Sub-ms regex match",
              },
              {
                id: "llm_judge",
                label: "LLM Judge",
                sub: "Intent classifier",
              },
              {
                id: "cot_defender",
                label: "CoT Defender",
                sub: "Reasoning trace check",
              },
              {
                id: "custom_webhook",
                label: "Custom Webhook",
                sub: "External API relay",
              },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTypeSelect(t.id as ValidatorType)}
                className={`p-3 rounded-[8px] text-left border transition-colors focus-ring ${
                  selectedType === t.id
                    ? "bg-[var(--validator-bg)] border-[var(--validator)] text-[var(--text-primary)]"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <p className="text-[13px] font-medium">{t.label}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{t.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-[12px] font-medium text-[var(--text-secondary)]">
            Guardrail Name
          </label>
          <Input
            placeholder="e.g. Production Risk Filter"
            {...register("name")}
            error={errors.name?.message}
            iconLeft={<ShieldCheck className="w-4 h-4 stroke-[1.75]" />}
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-[12px] font-medium text-[var(--text-secondary)]">
            Description
          </label>
          <Input
            placeholder="Functional summary of the validation logic"
            {...register("description")}
            error={errors.description?.message}
          />
        </div>

        {/* Dynamic Fields */}
        {selectedType === "keyword_filter" && (
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              Matching Sensitivity
            </label>
            <select
              {...register("sensitivity")}
              className="w-full h-10 px-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] focus-ring"
            >
              <option value="low">Low (Explicit Harm Only)</option>
              <option value="medium">Medium (Standard Boundaries)</option>
              <option value="high">High (Strict Sanitization)</option>
            </select>
          </div>
        )}

        {selectedType === "llm_judge" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[var(--text-secondary)]">
                Judge Model
              </label>
              <select
                {...register("judge_model")}
                className="w-full h-10 px-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] focus-ring"
              >
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                <option value="llama3:8b">llama3:8b (Local)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[var(--text-secondary)]">
                Confidence Threshold (0-1)
              </label>
              <Input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                {...register("threshold", { valueAsNumber: true })}
                iconLeft={<Sliders className="w-4 h-4 stroke-[1.75]" />}
              />
            </div>
          </div>
        )}

        {selectedType === "cot_defender" && (
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              Maximum Reasoning Depth Steps
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              {...register("max_depth", { valueAsNumber: true })}
              iconLeft={<Sliders className="w-4 h-4 stroke-[1.75]" />}
            />
          </div>
        )}

        {selectedType === "custom_webhook" && (
          <div className="space-y-1">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              Webhook Endpoint URL
            </label>
            <Input
              placeholder="https://guardrail.internal/api/v1/inspect"
              {...register("webhook_url")}
              iconLeft={<Globe className="w-4 h-4 stroke-[1.75]" />}
            />
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={createValidator.isPending}
            iconLeft={<Sparkles className="w-4 h-4 stroke-[1.75]" />}
          >
            Deploy Guardrail
          </Button>
        </div>
      </form>
    </Modal>
  );
}
