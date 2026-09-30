"use client";

import React, { useState, useMemo } from "react";
import { useModelsList } from "@/hooks/useModels";
import { type ModelUnderTest } from "@/types/api";
import { ModelCard } from "@/components/models/ModelCard";
import { RegisterModelModal } from "@/components/models/RegisterModelModal";
import { DeleteModelModal } from "@/components/models/DeleteModelModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Plus, Search, Cpu, Server } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ModelsPage() {
  const { data: models, isLoading } = useModelsList();
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("ALL");
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<ModelUnderTest | null>(null);

  const filteredModels = useMemo(() => {
    if (!models) return [];
    return models.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.model_identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.base_url.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProvider =
        providerFilter === "ALL" || m.provider === providerFilter;

      return matchesSearch && matchesProvider;
    });
  }, [models, searchQuery, providerFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div className="space-y-1">
          <h1 className="font-display text-[32px] font-medium text-[var(--text-primary)] tracking-[-0.02em]">
            Models Under Test
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Manage target foundation models, local clusters, and API endpoints evaluated in probe benchmarks
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setRegisterModalOpen(true)}
          iconLeft={<Plus className="w-4 h-4 stroke-[1.75]" />}
        >
          Register Target Model
        </Button>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search model name or endpoint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<Search className="w-4 h-4 stroke-[1.75]" />}
          />
        </div>

        {/* Provider Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] overflow-x-auto self-start sm:self-auto">
          {["ALL", "openai", "anthropic", "ollama", "vllm", "custom"].map(
            (provider) => (
              <button
                key={provider}
                type="button"
                onClick={() => setProviderFilter(provider)}
                className={cn(
                  "px-3 py-1 rounded-[6px] text-[12px] font-medium transition-colors focus-ring whitespace-nowrap capitalize",
                  providerFilter === provider
                    ? "bg-[var(--surface-raised)] text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                {provider === "ALL" ? "All Providers" : provider}
              </button>
            )
          )}
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Skeleton className="h-48 rounded-[12px]" />
          <Skeleton className="h-48 rounded-[12px]" />
          <Skeleton className="h-48 rounded-[12px]" />
        </div>
      )}

      {/* Models Grid */}
      {!isLoading && filteredModels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onDelete={setModelToDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredModels.length === 0 && (
        <div className="py-12">
          <EmptyState
            icon={Cpu}
            title="No Models Under Test Found"
            description={
              searchQuery || providerFilter !== "ALL"
                ? "No target models match your active search or provider filter."
                : "Register your first cloud or local language model endpoint to begin adversarial robustness benchmarking."
            }
            action={
              <Button
                variant="primary"
                onClick={() => setRegisterModalOpen(true)}
                iconLeft={<Plus className="w-4 h-4 stroke-[1.75]" />}
              >
                Register Target Model
              </Button>
            }
          />
        </div>
      )}

      {/* Modals */}
      <RegisterModelModal
        open={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />

      <DeleteModelModal
        model={modelToDelete}
        onClose={() => setModelToDelete(null)}
      />
    </div>
  );
}
