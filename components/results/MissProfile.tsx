"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/formatters";
import { AlertCircle, Tag, ShieldAlert } from "lucide-react";

interface PatternItem {
  pattern: string;
  count: number;
}

interface MissProfileProps {
  patterns: PatternItem[];
  falsePositiveRate: number;
}

export function MissProfile({
  patterns,
  falsePositiveRate,
}: MissProfileProps) {
  const maxCount = Math.max(...patterns.map((p) => p.count), 1);

  return (
    <div className="space-y-6">
      {/* Top Section: Vulnerability Pattern Distribution */}
      <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-5 card-highlight space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              Evasion Vectors & Subversion Patterns
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Frequency of syntactic and semantic tactics identified in successful bypasses
            </p>
          </div>
          <Badge variant="probe" className="gap-1">
            <ShieldAlert className="w-3.5 h-3.5 stroke-[1.75]" />
            {patterns.reduce((acc, p) => acc + p.count, 0)} Total Bypasses
          </Badge>
        </div>

        {/* Horizontal Bar Chart for Patterns */}
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={patterns}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="pattern"
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={190}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as PatternItem;
                    return (
                      <div className="rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] p-2.5 text-[12px] shadow-lg space-y-1">
                        <p className="font-medium text-[var(--text-primary)]">
                          {item.pattern}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--text-muted)]">Frequency:</span>
                          <span className="font-semibold text-[var(--probe)] tabular-nums">
                            {item.count} occurrences
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="var(--probe)" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Semantic Tags Cloud */}
      <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-5 card-highlight space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 stroke-[1.75] text-[var(--accent)]" />
          <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Identified Semantic Vulnerability Archetypes
          </h4>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {patterns.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[var(--surface-raised)] border border-[var(--border)] text-[12px]"
            >
              <span className="text-[var(--text-primary)] font-medium">
                {item.pattern}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[var(--probe-bg)] text-[var(--probe)] text-[10px] font-semibold tabular-nums">
                {item.count}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[12px] text-[var(--text-secondary)]">
            Context Window Overflow
            <span className="px-1.5 py-0.2 rounded bg-[var(--surface)] text-[var(--text-muted)] text-[10px] font-semibold">
              0
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[12px] text-[var(--text-secondary)]">
            Suffix Gradient Collision
            <span className="px-1.5 py-0.2 rounded bg-[var(--surface)] text-[var(--text-muted)] text-[10px] font-semibold">
              0
            </span>
          </div>
        </div>
      </div>

      {/* False Positive Rate Card */}
      <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-5 card-highlight flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 stroke-[1.75] text-[var(--warning)]" />
            <h4 className="text-[13px] font-semibold text-[var(--text-primary)]">
              False Positive Interception Rate
            </h4>
          </div>
          <p className="text-[12px] text-[var(--text-secondary)] max-w-xl">
            Proportion of benign baseline prompts erroneously blocked by active guardrail rules. Low false-positive rate ensures minimal friction for standard user queries.
          </p>
        </div>

        <div className="text-right sm:border-l sm:border-[var(--border)] sm:pl-6">
          <div className="text-[28px] font-medium text-[var(--warning)] tabular-nums">
            {formatPercent(falsePositiveRate)}
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            Within acceptable threshold (&lt;5%)
          </span>
        </div>
      </div>
    </div>
  );
}
