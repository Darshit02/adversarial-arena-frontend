"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { type RunSummary } from "@/types/api";
import { ResultsTable } from "@/components/results/ResultsTable";
import { ResultFilters } from "@/components/results/ResultFilters";
import { CompareModal } from "@/components/results/CompareModal";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const initialRuns: RunSummary[] = [
  {
    run_id: "run_a4f9c2e1",
    status: "COMPLETED",
    probe_type: "pair",
    model_ids: ["model_gpt4o_mini", "model_llama3_8b"],
    validator_ids: ["val_keyword_filter", "val_llm_judge"],
    total_attempts: 40,
    completed_attempts: 40,
    blocked_attempts: 21,
    successful_bypasses: 19,
    rfr: 0.473,
    duration_ms: 200000,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1.9).toISOString(),
  },
  {
    run_id: "run_8e3b1c90",
    status: "RUNNING",
    probe_type: "multiround",
    model_ids: ["model_gpt4o_mini"],
    validator_ids: ["val_keyword_filter", "val_llm_judge", "val_cot_defender"],
    total_attempts: 50,
    completed_attempts: 28,
    blocked_attempts: 23,
    successful_bypasses: 5,
    rfr: 0.182,
    duration_ms: 140000,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 3.8).toISOString(),
  },
  {
    run_id: "run_3c7d9e4a",
    status: "COMPLETED",
    probe_type: "autodan",
    model_ids: ["model_llama3_8b"],
    validator_ids: ["val_keyword_filter"],
    total_attempts: 30,
    completed_attempts: 30,
    blocked_attempts: 18,
    successful_bypasses: 12,
    rfr: 0.384,
    duration_ms: 180000,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 7.9).toISOString(),
  },
  {
    run_id: "run_f1b2c3d4",
    status: "COMPLETED",
    probe_type: "gcg",
    model_ids: ["model_gpt4o_mini", "model_claude35"],
    validator_ids: ["val_keyword_filter", "val_llm_judge"],
    total_attempts: 60,
    completed_attempts: 60,
    blocked_attempts: 52,
    successful_bypasses: 8,
    rfr: 0.125,
    duration_ms: 320000,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 23.8).toISOString(),
  },
  {
    run_id: "run_7a8b9c0d",
    status: "FAILED",
    probe_type: "crescendo",
    model_ids: ["model_claude35"],
    validator_ids: ["val_keyword_filter"],
    total_attempts: 25,
    completed_attempts: 11,
    blocked_attempts: 5,
    successful_bypasses: 6,
    rfr: 0.54,
    duration_ms: 95000,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 47.9).toISOString(),
  },
  {
    run_id: "run_5e6f7a8b",
    status: "ABORTED",
    probe_type: "pair",
    model_ids: ["model_gpt4o_mini"],
    validator_ids: ["val_llm_judge"],
    total_attempts: 20,
    completed_attempts: 7,
    blocked_attempts: 4,
    successful_bypasses: 3,
    rfr: 0.428,
    duration_ms: 45000,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 71.9).toISOString(),
  },
];

export default function RunsPage() {
  const [runs, setRuns] = useState<RunSummary[]>(initialRuns);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [probeFilter, setProbeFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const filteredRuns = useMemo(() => {
    return runs.filter((run) => {
      const matchesSearch =
        !searchQuery ||
        run.run_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        run.probe_type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || run.status === statusFilter;

      const matchesProbe =
        probeFilter === "ALL" ||
        run.probe_type.toLowerCase() === probeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesProbe;
    });
  }, [runs, searchQuery, statusFilter, probeFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const deleteRun = (id: string) => {
    setRuns((prev) => prev.filter((r) => r.run_id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  // Find two runs for comparison
  const runA = runs.find((r) => r.run_id === selectedIds[0]) || null;
  const runB = runs.find((r) => r.run_id === selectedIds[1]) || null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div className="space-y-1">
          <h1 className="font-display text-[32px] font-medium text-[var(--text-primary)] tracking-[-0.02em]">
            Benchmark Runs
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Historical audit log of adversarial probe suite executions and guardrail evaluations
          </p>
        </div>

        <Link href="/attack-lab">
          <Button
            variant="primary"
            iconLeft={<Play className="w-4 h-4 stroke-[1.75]" />}
          >
            New Probe Suite
          </Button>
        </Link>
      </div>

      {/* Toolbar & Filters */}
      <ResultFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        probeFilter={probeFilter}
        onProbeFilterChange={setProbeFilter}
        selectedCount={selectedIds.length}
        onOpenCompare={() => setCompareOpen(true)}
      />

      {/* TanStack Table */}
      <ResultsTable
        runs={filteredRuns}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        onDeleteRun={deleteRun}
      />

      {/* Side-by-side Compare Modal */}
      <CompareModal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        runA={runA}
        runB={runB}
      />
    </div>
  );
}
