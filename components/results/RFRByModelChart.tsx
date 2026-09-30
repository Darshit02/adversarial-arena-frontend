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
import { formatPercent } from "@/lib/formatters";

interface RFRByModelChartProps {
  data: Record<string, number>;
}

export function RFRByModelChart({ data }: RFRByModelChartProps) {
  const chartData = Object.entries(data).map(([model, rfr]) => ({
    model,
    rfr: Math.round(rfr * 100),
    rawRfr: rfr,
  }));

  const getColor = (rfrVal: number) => {
    if (rfrVal > 50) return "var(--probe)";
    if (rfrVal >= 20) return "var(--warning)";
    return "var(--validator)";
  };

  return (
    <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-5 card-highlight space-y-4">
      <div>
        <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
          Resilience by Model Under Test (MUT)
        </h3>
        <p className="text-[12px] text-[var(--text-secondary)]">
          Comparative failure rates across target LLM foundations
        </p>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-subtle)"
              vertical={false}
            />
            <XAxis
              dataKey="model"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] p-2.5 text-[12px] shadow-lg space-y-1">
                      <p className="font-medium text-[var(--text-primary)]">
                        {item.model}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)]">RFR:</span>
                        <span
                          className="font-semibold tabular-nums"
                          style={{ color: getColor(item.rfr) }}
                        >
                          {formatPercent(item.rawRfr)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="rfr" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-model-${index}`} fill={getColor(entry.rfr)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
