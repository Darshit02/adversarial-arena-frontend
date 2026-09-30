"use client";

import React, { useState, useMemo } from "react";
import { type ProbeAttempt } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProbeDrawer } from "./ProbeDrawer";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  ChevronRight,
  Filter,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProbesTabProps {
  attempts: ProbeAttempt[];
}

export function ProbesTab({ attempts }: ProbesTabProps) {
  const [selectedAttempt, setSelectedAttempt] = useState<ProbeAttempt | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState<"ALL" | "BYPASS" | "BLOCKED">("ALL");

  const filteredAttempts = useMemo(() => {
    return attempts.filter((att) => {
      const matchesSearch =
        !searchQuery ||
        att.attempt_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        att.model_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOutcome =
        outcomeFilter === "ALL" ||
        (outcomeFilter === "BYPASS" && att.is_robustness_failure) ||
        (outcomeFilter === "BLOCKED" && !att.is_robustness_failure);

      return matchesSearch && matchesOutcome;
    });
  }, [attempts, searchQuery, outcomeFilter]);

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search prompt payload or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<Search className="w-4 h-4 stroke-[1.75]" />}
          />
        </div>

        {/* Outcome Filter Segmented Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setOutcomeFilter("ALL")}
            className={cn(
              "px-3 py-1 rounded-[6px] text-[12px] font-medium transition-colors focus-ring",
              outcomeFilter === "ALL"
                ? "bg-[var(--surface-raised)] text-[var(--text-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            All ({attempts.length})
          </button>
          <button
            type="button"
            onClick={() => setOutcomeFilter("BYPASS")}
            className={cn(
              "px-3 py-1 rounded-[6px] text-[12px] font-medium transition-colors focus-ring",
              outcomeFilter === "BYPASS"
                ? "bg-[var(--probe-bg)] text-[var(--probe)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            Bypasses ({attempts.filter((a) => a.is_robustness_failure).length})
          </button>
          <button
            type="button"
            onClick={() => setOutcomeFilter("BLOCKED")}
            className={cn(
              "px-3 py-1 rounded-[6px] text-[12px] font-medium transition-colors focus-ring",
              outcomeFilter === "BLOCKED"
                ? "bg-[var(--validator-bg)] text-[var(--validator)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            Neutralized ({attempts.filter((a) => !a.is_robustness_failure).length})
          </button>
        </div>
      </div>

      {/* Attempts Table */}
      <div className="rounded-[10px] border border-[var(--border)] overflow-hidden bg-[var(--surface)]">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="h-10 bg-[var(--surface-raised)] border-b border-[var(--border)] text-[11px] font-medium uppercase tracking-[0.03em] text-[var(--text-muted)]">
                <th className="px-4 text-left w-24">Attempt ID</th>
                <th className="px-4 text-left">Probe Prompt Payload</th>
                <th className="px-4 text-left w-36">MUT</th>
                <th className="px-4 text-left w-48">Guardrail Interception</th>
                <th className="px-4 text-left w-32">Outcome</th>
                <th className="px-4 text-right w-24">Latency</th>
                <th className="px-4 text-center w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredAttempts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-[var(--text-muted)] italic"
                  >
                    No matching probe attempts found.
                  </td>
                </tr>
              ) : (
                filteredAttempts.map((attempt) => {
                  const lastFailedValidator = attempt.validator_results.find(
                    (v) => !v.passed
                  );

                  return (
                    <tr
                      key={attempt.attempt_id}
                      onClick={() => setSelectedAttempt(attempt)}
                      className="h-12 transition-colors hover:bg-[var(--surface-hover)] cursor-pointer group"
                    >
                      {/* Attempt ID */}
                      <td className="px-4 py-2 font-medium text-[var(--text-primary)] tabular-nums">
                        {attempt.attempt_id}
                      </td>

                      {/* Prompt (truncated at 65 characters with full text in title) */}
                      <td
                        className="px-4 py-2 text-[var(--text-secondary)] max-w-md truncate"
                        title={attempt.prompt}
                      >
                        {attempt.prompt}
                      </td>

                      {/* Model Under Test */}
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
                          {attempt.model_name}
                        </span>
                      </td>

                      {/* Guardrail Status */}
                      <td className="px-4 py-2">
                        {attempt.is_robustness_failure ? (
                          <span className="text-[11px] text-[var(--probe)] flex items-center gap-1 font-medium">
                            Bypassed All Stages
                          </span>
                        ) : lastFailedValidator ? (
                          <Badge variant="validator" className="text-[10px]">
                            {lastFailedValidator.validator_name}
                          </Badge>
                        ) : (
                          <Badge variant="neutral" className="text-[10px]">
                            Filtered
                          </Badge>
                        )}
                      </td>

                      {/* Outcome Badge */}
                      <td className="px-4 py-2">
                        {attempt.is_robustness_failure ? (
                          <Badge variant="probe" className="gap-1 text-[11px]">
                            <ShieldAlert className="w-3 h-3 stroke-[2]" />
                            Failure
                          </Badge>
                        ) : (
                          <Badge variant="validator" className="gap-1 text-[11px]">
                            <ShieldCheck className="w-3 h-3 stroke-[2]" />
                            Defended
                          </Badge>
                        )}
                      </td>

                      {/* Latency */}
                      <td className="px-4 py-2 text-right tabular-nums text-[var(--text-muted)]">
                        {attempt.latency_ms} ms
                      </td>

                      {/* View Action */}
                      <td className="px-4 py-2 text-center text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">
                        <ChevronRight className="w-4 h-4 stroke-[1.75] inline" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Drawer for inspection */}
      <ProbeDrawer
        attempt={selectedAttempt}
        onClose={() => setSelectedAttempt(null)}
      />
    </div>
  );
}
