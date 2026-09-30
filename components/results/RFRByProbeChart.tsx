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

interface RFRByProbeChartProps {
  data: Record<string, number>;
}

export function RFRByProbeChart({ data }: RFRByProbeChartProps) {
  const chartData = Object.entries(data).map(([probe, rfr]) => ({
    probe,
    rfr: Math.round(rfr * 100),
    rawRfr: rfr,
  }));

  const getColor = (rfrVal: number) => {
    if (rfrVal > 50) return "var(--probe)"; // dusty rose #C77B7B
    if (rfrVal >= 20) return "var(--warning)"; // warm amber #D4A574
    return "var(--validator)"; // sage green #7FB88E
  };

  return (
    <div className="rounded-[12px] bg-[var(--surface)] border border-[var(--border)] p-5 card-highlight space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
            Failure Rate by Probe Variant
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Bypass success percentage per adversarial attack strategy
          </p>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-subtle)"
              vertical={false}
            />
            <XAxis
              dataKey="probe"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
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
                        {item.probe}
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
            <Bar dataKey="rfr" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.rfr)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
