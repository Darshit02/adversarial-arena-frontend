"use client";

import React, { useState, useMemo } from "react";
import {
  useValidatorsList,
  useUpdateValidator,
} from "@/hooks/useValidatorsManager";
import { type Validator } from "@/types/api";
import { PipelineFlow } from "@/components/validators/PipelineFlow";
import { ValidatorCard } from "@/components/validators/ValidatorCard";
import { AddValidatorModal } from "@/components/validators/AddValidatorModal";
import { ValidatorConfigDrawer } from "@/components/validators/ValidatorConfigDrawer";
import { DeleteValidatorModal } from "@/components/validators/DeleteValidatorModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toast";
import { Plus, Search, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ValidatorsPage() {
  const { data: validators, isLoading } = useValidatorsList();
  const updateValidator = useUpdateValidator();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedForConfig, setSelectedForConfig] = useState<Validator | null>(null);
  const [validatorToDelete, setValidatorToDelete] = useState<Validator | null>(null);

  const filteredValidators = useMemo(() => {
    if (!validators) return [];
    return validators.filter((v) => {
      const matchesSearch =
        !searchQuery ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "ALL" || v.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [validators, searchQuery, typeFilter]);

  const handleToggle = async (id: string, is_enabled: boolean) => {
    try {
      await updateValidator.mutateAsync({
        id,
        data: { is_enabled },
      });
      toast.success(
        is_enabled
          ? "Guardrail stage activated in pipeline"
          : "Guardrail stage bypassed"
      );
    } catch {
      toast.error("Failed to toggle guardrail");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div className="space-y-1">
          <h1 className="font-display text-[32px] font-medium text-[var(--text-primary)] tracking-[-0.02em]">
            Defensive Guardrails
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Multi-tier validation pipeline intercepting, sanitizing, and filtering adversarial payloads
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setAddModalOpen(true)}
          iconLeft={<Plus className="w-4 h-4 stroke-[1.75]" />}
        >
          Add Guardrail Stage
        </Button>
      </div>

      {/* Visual Pipeline Sequence Topology */}
      {validators && validators.length > 0 && (
        <PipelineFlow validators={validators} />
      )}

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search guardrail name or logic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<Search className="w-4 h-4 stroke-[1.75]" />}
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] overflow-x-auto self-start sm:self-auto">
          {[
            { id: "ALL", label: "All Types" },
            { id: "keyword_filter", label: "Keyword" },
            { id: "llm_judge", label: "LLM Judge" },
            { id: "cot_defender", label: "CoT Defender" },
            { id: "custom_webhook", label: "Webhook" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTypeFilter(item.id)}
              className={cn(
                "px-3 py-1 rounded-[6px] text-[12px] font-medium transition-colors focus-ring whitespace-nowrap",
                typeFilter === item.id
                  ? "bg-[var(--surface-raised)] text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Skeleton className="h-44 rounded-[12px]" />
          <Skeleton className="h-44 rounded-[12px]" />
          <Skeleton className="h-44 rounded-[12px]" />
        </div>
      )}

      {/* Validator Cards Grid */}
      {!isLoading && filteredValidators.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredValidators.map((val) => (
            <ValidatorCard
              key={val.id}
              validator={val}
              onToggle={handleToggle}
              onConfigure={setSelectedForConfig}
              onDelete={setValidatorToDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredValidators.length === 0 && (
        <div className="py-12">
          <EmptyState
            icon={ShieldCheck}
            title="No Guardrail Stages Found"
            description={
              searchQuery || typeFilter !== "ALL"
                ? "No validators match your active search or architecture filter."
                : "Add your first defensive guardrail stage to begin hardening models under test."
            }
            action={
              <Button
                variant="primary"
                onClick={() => setAddModalOpen(true)}
                iconLeft={<Plus className="w-4 h-4 stroke-[1.75]" />}
              >
                Add Guardrail Stage
              </Button>
            }
          />
        </div>
      )}

      {/* Modals & Drawer */}
      <AddValidatorModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <ValidatorConfigDrawer
        validator={selectedForConfig}
        onClose={() => setSelectedForConfig(null)}
      />

      <DeleteValidatorModal
        validator={validatorToDelete}
        onClose={() => setValidatorToDelete(null)}
      />
    </div>
  );
}
