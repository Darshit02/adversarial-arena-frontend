"use client";

import React from "react";
import { type RunSummary, type ReportData } from "@/types/api";
import { MissProfile } from "./MissProfile";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Zap, CheckCircle2 } from "lucide-react";
import { formatPercent } from "@/lib/formatters";

interface ValidatorAnalysisTabProps {
  run: RunSummary;
  report: ReportData;
}

export function ValidatorAnalysisTab({
  run,
  report,
}: ValidatorAnalysisTabProps) {
  // Validator performance breakdown
  const validatorStats = [
    {
      id: "val_keyword_filter",
      name: "Keyword Filter",
      type: "Deterministic Pattern Matcher",
      blocked: 8,
      totalProcessed: 40,
      efficiency: 0.2,
      avgLatencyMs: 2,
      fpRate: 0.01,
    },
    {
      id: "val_llm_judge",
      name: "LLM-as-Judge Guardrail",
      type: "Semantic Intent Classifier (gpt-4o-mini)",
      blocked: 8,
      totalProcessed: 32,
      efficiency: 0.25,
      avgLatencyMs: 135,
      fpRate: 0.038,
    },
    {
      id: "val_cot_defender",
      name: "CoT Defender",
      type: "Chain-of-Thought Deconstruction",
      blocked: 5,
      totalProcessed: 24,
      efficiency: 0.208,
      avgLatencyMs: 290,
      fpRate: 0.045,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Per-Validator Pipeline Performance Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Guardrail Pipeline Efficiency
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Stage-by-stage interception metrics and latency overhead
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {validatorStats.map((val) => {
            const isActive = run.validator_ids.includes(val.id);
            return (
              <div
                key={val.id}
                className="p-5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-[var(--text-primary)]">
                      {val.name}
                    </span>
                    {isActive ? (
                      <Badge variant="validator" className="text-[10px]">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="neutral" className="text-[10px]">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {val.type}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-subtle)] text-[12px]">
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block">
                      Neutralized
                    </span>
                    <span className="font-semibold text-[var(--validator)] tabular-nums">
                      {val.blocked} payloads
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block">
                      Efficiency
                    </span>
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {formatPercent(val.efficiency)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block">
                      Avg Latency
                    </span>
                    <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                      {val.avgLatencyMs} ms
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block">
                      False Positives
                    </span>
                    <span className="font-semibold text-[var(--warning)] tabular-nums">
                      {formatPercent(val.fpRate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Miss Profile & Evasion Analysis */}
      <MissProfile
        patterns={report.miss_profile.top_patterns}
        falsePositiveRate={report.miss_profile.false_positive_rate}
      />
    </div>
  );
}
