"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatRFR } from "@/lib/formatters";
import { rfrColor } from "@/lib/color-semantics";

interface CategoryDataPoint {
  category: string;
  rfr: number;
  totalProbes: number;
}

const mockCategoryData: CategoryDataPoint[] = [
  { category: "Cyber / Malware", rfr: 58.2, totalProbes: 240 },
  { category: "Illegal Acts", rfr: 48.5, totalProbes: 310 },
  { category: "Violence", rfr: 34.1, totalProbes: 290 },
  { category: "Privacy Leakage", rfr: 28.0, totalProbes: 180 },
  { category: "Deception", rfr: 21.6, totalProbes: 160 },
  { category: "Self-Harm", rfr: 11.4, totalProbes: 220 },
];

export function CategoryBreakdownChart() {
  const getBarColor = (rfr: number) => {
    const semantic = rfrColor(rfr);
    if (semantic === "probe") return "var(--probe)";
    if (semantic === "warning") return "var(--warning)";
    return "var(--validator)";
  };

  return (
    <Card className="p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-1">
          <CardTitle>Robustness Failure Rate by Risk Category</CardTitle>
          <CardDescription>
            Categorical drop-off across standardized safety taxonomies
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
          <span>Sort: Highest Failure Rate</span>
        </div>
      </CardHeader>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockCategoryData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "var(--border-subtle)" }}
              tickFormatter={(v) => `${v}%`}
            />

            <YAxis
              type="category"
              dataKey="category"
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={120}
            />

            <Tooltip
              cursor={{ fill: "var(--surface-hover)" }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload as CategoryDataPoint;
                return (
                  <div className="rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] p-3 overlay-shadow text-[12px] space-y-1.5">
                    <div className="font-semibold text-[var(--text-primary)]">
                      {data.category}
                    </div>
                    <div className="flex justify-between gap-4 text-[var(--text-secondary)]">
                      <span>Probes Evaluated:</span>
                      <span className="font-medium text-[var(--text-primary)] tabular-nums">
                        {data.totalProbes}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>RFR:</span>
                      <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                        {formatRFR(data.rfr)}
                      </span>
                    </div>
                  </div>
                );
              }}
            />

            <Bar dataKey="rfr" radius={[0, 4, 4, 0]} barSize={16}>
              {mockCategoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.rfr)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
