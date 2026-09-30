"use client";

import React, { useState } from "react";
import { type ModelUnderTest } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTestModel } from "@/hooks/useModels";
import { toast } from "@/components/ui/toast";
import { formatRelative } from "@/lib/formatters";
import {
  Cpu,
  Globe,
  Radio,
  Trash2,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelCardProps {
  model: ModelUnderTest;
  onDelete: (model: ModelUnderTest) => void;
}

export function ModelCard({ model, onDelete }: ModelCardProps) {
  const testModel = useTestModel();
  const [testing, setTesting] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const res = await testModel.mutateAsync(model.id);
      if (res.success) {
        toast.success(`Connected to ${model.name} (${res.latency_ms}ms)`, {
          description: res.message,
        });
      } else {
        toast.error(`Connection failed for ${model.name}`);
      }
    } catch {
      toast.error(`Could not reach ${model.base_url}`);
    } finally {
      setTesting(false);
    }
  };

  const getStatusIndicator = () => {
    if (model.status === "online") {
      return (
        <span className="flex items-center gap-1.5 text-[11px] text-[var(--validator)] font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--validator)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--validator)]" />
          </span>
          Online
        </span>
      );
    }
    if (model.status === "offline") {
      return (
        <span className="flex items-center gap-1.5 text-[11px] text-[var(--probe)] font-medium">
          <span className="h-2 w-2 rounded-full bg-[var(--probe)]" />
          Offline
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-[11px] text-[var(--warning)] font-medium">
        <span className="h-2 w-2 rounded-full bg-[var(--warning)]" />
        Untested
      </span>
    );
  };

  return (
    <div className="p-5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-4 flex flex-col justify-between transition-all hover:border-[var(--border-subtle)]">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[15px] text-[var(--text-primary)]">
                {model.name}
              </h3>
              <Badge variant="neutral" className="capitalize text-[10px]">
                {model.provider}
              </Badge>
            </div>
            <p className="text-[12px] font-mono text-[var(--text-secondary)] tabular-nums">
              {model.model_identifier}
            </p>
          </div>

          <div>{getStatusIndicator()}</div>
        </div>

        {/* Endpoint Base URL */}
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] pt-1">
          <Globe className="w-3.5 h-3.5 stroke-[1.75] shrink-0" />
          <span className="truncate max-w-[280px]" title={model.base_url}>
            {model.base_url}
          </span>
        </div>
      </div>

      {/* Latency & Metadata Row */}
      <div className="py-2.5 px-3 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
          <Clock className="w-3.5 h-3.5 stroke-[1.75]" />
          <span>Ping Latency:</span>
          <span className="font-semibold text-[var(--text-primary)] tabular-nums">
            {model.latency_ms ? `${model.latency_ms} ms` : "—"}
          </span>
        </div>

        <span className="text-[var(--text-faint)]">
          Added {formatRelative(model.created_at)}
        </span>
      </div>

      {/* Actions Row */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleTestConnection}
          loading={testing}
          iconLeft={<Activity className="w-3.5 h-3.5 stroke-[1.75]" />}
        >
          Check Ping
        </Button>

        <button
          type="button"
          onClick={() => onDelete(model)}
          className="p-2 rounded-[6px] hover:bg-[var(--probe-bg)] text-[var(--text-muted)] hover:text-[var(--probe)] transition-colors focus-ring"
          title="Remove Model Under Test"
          aria-label="Remove Model Under Test"
        >
          <Trash2 className="w-4 h-4 stroke-[1.75]" />
        </button>
      </div>
    </div>
  );
}
