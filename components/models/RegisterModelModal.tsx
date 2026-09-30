"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateModel } from "@/hooks/useModels";
import { toast } from "@/components/ui/toast";
import {
  Lock,
  Cpu,
  Globe,
  Key,
  Shield,
  Eye,
  EyeOff,
  Server,
  Sparkles,
} from "lucide-react";

const modelSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  provider: z.enum(["openai", "anthropic", "ollama", "vllm", "custom"]),
  model_identifier: z.string().min(2, "Model identifier is required"),
  base_url: z.string().url("Must be a valid endpoint URL"),
  api_key: z.string().optional(),
});

type ModelFormData = z.infer<typeof modelSchema>;

interface RegisterModelModalProps {
  open: boolean;
  onClose: () => void;
}

const PROVIDER_PRESETS: Record<
  string,
  { base_url: string; default_model: string }
> = {
  openai: {
    base_url: "https://api.openai.com/v1",
    default_model: "gpt-4o-mini",
  },
  anthropic: {
    base_url: "https://api.anthropic.com/v1",
    default_model: "claude-3-5-sonnet-20240620",
  },
  ollama: {
    base_url: "http://localhost:11434",
    default_model: "llama3:8b",
  },
  vllm: {
    base_url: "http://localhost:8000/v1",
    default_model: "meta-llama/Meta-Llama-3-8B-Instruct",
  },
  custom: {
    base_url: "https://api.my-cluster.internal/v1",
    default_model: "custom-safety-tuned-v1",
  },
};

export function RegisterModelModal({ open, onClose }: RegisterModelModalProps) {
  const [showKey, setShowKey] = useState(false);
  const createModel = useCreateModel();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ModelFormData>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: "",
      provider: "openai",
      model_identifier: "gpt-4o-mini",
      base_url: "https://api.openai.com/v1",
      api_key: "",
    },
  });

  const selectedProvider = watch("provider");

  const handleProviderSelect = (provider: ModelFormData["provider"]) => {
    setValue("provider", provider);
    const preset = PROVIDER_PRESETS[provider];
    if (preset) {
      setValue("base_url", preset.base_url);
      setValue("model_identifier", preset.default_model);
    }
  };

  const onSubmit = async (data: ModelFormData) => {
    try {
      await createModel.mutateAsync({
        name: data.name,
        provider: data.provider,
        base_url: data.base_url,
        model_identifier: data.model_identifier,
        api_key: data.api_key || undefined,
      });
      toast.success(`Registered model "${data.name}"`, {
        description: "Credentials securely encrypted via zero-knowledge vault.",
      });
      reset();
      onClose();
    } catch {
      toast.error("Failed to register model under test");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Register Model Under Test"
      description="Connect a local or cloud LLM endpoint for adversarial robustness benchmarking."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">
        {/* Provider Selector Tabs */}
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.03em]">
            Foundation Provider
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: "openai", label: "OpenAI" },
              { id: "anthropic", label: "Anthropic" },
              { id: "ollama", label: "Ollama" },
              { id: "vllm", label: "vLLM" },
              { id: "custom", label: "Custom" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() =>
                  handleProviderSelect(p.id as ModelFormData["provider"])
                }
                className={`py-2 px-1 rounded-[8px] text-[12px] font-medium border transition-colors text-center focus-ring ${
                  selectedProvider === p.id
                    ? "bg-[var(--surface-raised)] border-[var(--accent)] text-[var(--text-primary)]"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Display Name */}
        <div className="space-y-1">
          <label className="text-[12px] font-medium text-[var(--text-secondary)]">
            Friendly Display Name
          </label>
          <Input
            placeholder="e.g. Production Risk Classifier"
            {...register("name")}
            error={errors.name?.message}
            iconLeft={<Cpu className="w-4 h-4 stroke-[1.75]" />}
          />
        </div>

        {/* Model Identifier */}
        <div className="space-y-1">
          <label className="text-[12px] font-medium text-[var(--text-secondary)]">
            Model Identifier
          </label>
          <Input
            placeholder="e.g. gpt-4o-mini or llama3:8b"
            {...register("model_identifier")}
            error={errors.model_identifier?.message}
            iconLeft={<Server className="w-4 h-4 stroke-[1.75]" />}
          />
        </div>

        {/* Base URL */}
        <div className="space-y-1">
          <label className="text-[12px] font-medium text-[var(--text-secondary)]">
            Base Endpoint URL
          </label>
          <Input
            placeholder="https://api.openai.com/v1"
            {...register("base_url")}
            error={errors.base_url?.message}
            iconLeft={<Globe className="w-4 h-4 stroke-[1.75]" />}
          />
        </div>

        {/* API Key (Optional for local) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              API Authorization Key
            </label>
            <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
              <Lock className="w-3 h-3 stroke-[1.75] text-[var(--validator)]" />
              AES-256 GCM Encrypted
            </span>
          </div>
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              placeholder={
                selectedProvider === "ollama"
                  ? "Not required for local Ollama"
                  : "sk-..."
              }
              {...register("api_key")}
              iconLeft={<Key className="w-4 h-4 stroke-[1.75]" />}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {showKey ? (
                <EyeOff className="w-4 h-4 stroke-[1.75]" />
              ) : (
                <Eye className="w-4 h-4 stroke-[1.75]" />
              )}
            </button>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={createModel.isPending}
            iconLeft={<Sparkles className="w-4 h-4 stroke-[1.75]" />}
          >
            Register Model
          </Button>
        </div>
      </form>
    </Modal>
  );
}
