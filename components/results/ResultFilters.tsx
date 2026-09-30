"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, GitCompare, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  probeFilter: string;
  onProbeFilterChange: (probe: string) => void;
  selectedCount: number;
  onOpenCompare: () => void;
}

export function ResultFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  probeFilter,
  onProbeFilterChange,
  selectedCount,
  onOpenCompare,
}: ResultFiltersProps) {
  const statusOptions = ["ALL", "COMPLETED", "RUNNING", "FAILED", "ABORTED"];
  const probeOptions = ["ALL", "pair", "multiround", "autodan", "gcg"];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search by Run ID */}
        <div className="w-full sm:w-80">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by run ID (e.g. run_a4f9...)"
            iconLeft={<Search className="w-4 h-4 stroke-[1.75]" />}
            className="h-10"
          />
        </div>

        {/* Compare Action Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            disabled={selectedCount < 2}
            onClick={onOpenCompare}
            iconLeft={<GitCompare className="w-4 h-4 stroke-[1.75]" />}
          >
            Compare Selected ({selectedCount})
          </Button>
        </div>
      </div>

      {/* Filter Chips Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--border-subtle)] text-[12px]">
        <span className="text-[var(--text-muted)] flex items-center gap-1 font-medium mr-1">
          <Filter className="w-3.5 h-3.5 stroke-[1.75]" />
          <span>Status:</span>
        </span>

        {statusOptions.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => onStatusFilterChange(st)}
            className={cn(
              "px-2.5 py-1 rounded-[6px] transition-all font-medium select-none focus-ring text-[11px]",
              statusFilter === st
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-hover)]"
            )}
          >
            {st}
          </button>
        ))}

        <div className="w-px h-4 bg-[var(--border)] mx-2" />

        <span className="text-[var(--text-muted)] flex items-center gap-1 font-medium mr-1">
          <span>Probe Type:</span>
        </span>

        {probeOptions.map((pr) => (
          <button
            key={pr}
            type="button"
            onClick={() => onProbeFilterChange(pr)}
            className={cn(
              "px-2.5 py-1 rounded-[6px] transition-all font-medium select-none focus-ring text-[11px] uppercase",
              probeFilter === pr
                ? "bg-[var(--probe)] text-white"
                : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[var(--surface-hover)]"
            )}
          >
            {pr}
          </button>
        ))}

        {(statusFilter !== "ALL" || probeFilter !== "ALL" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              onStatusFilterChange("ALL");
              onProbeFilterChange("ALL");
              onSearchChange("");
            }}
            className="ml-auto inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-3 h-3 stroke-[2]" />
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
