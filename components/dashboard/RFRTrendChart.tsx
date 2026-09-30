"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatRFR } from "@/lib/formatters";

interface TrendDataPoint {
  date: string;
  rawRfr: number; // without validator
  defendedRfr: number; // with validator
}

const mockTrendData: TrendDataPoint[] = [
  { date: "Sep 21", rawRfr: 68, defendedRfr: 22 },
  { date: "Sep 22", rawRfr: 64, defendedRfr: 19 },
  { date: "Sep 23", rawRfr: 72, defendedRfr: 25 },
  { date: "Sep 24", rawRfr: 59, defendedRfr: 16 },
  { date: "Sep 25", rawRfr: 63, defendedRfr: 18 },
  { date: "Sep 26", rawRfr: 55, defendedRfr: 14 },
  { date: "Sep 27", rawRfr: 61, defendedRfr: 17 },
  { date: "Sep 28", rawRfr: 58, defendedRfr: 15 },
  { date: "Sep 29", rawRfr: 52, defendedRfr: 12 },
  { date: "Sep 30", rawRfr: 47, defendedRfr: 11 },
];

export function RFRTrendChart() {
  return (
    <Card className="p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-1">
          <CardTitle>RFR Efficacy Trend</CardTitle>
          <CardDescription>
            Robustness Failure Rate comparison across consecutive benchmark suites
          </CardDescription>
        </div>

        {/* Legend in micro style text */}
        <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.03em] font-medium">
          <div className="flex items-center gap-1.5 text-[var(--probe)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--probe)] shrink-0" />
            <span>Raw MUT (No Validator)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--validator)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--validator)] shrink-0" />
            <span>Defended Pipeline</span>
          </div>
        </div>
      </CardHeader>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockTrendData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="probeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--probe)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--probe)" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="validatorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--validator)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--validator)" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-subtle)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "var(--border-subtle)" }}
            />

            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] p-3 overlay-shadow text-[12px] space-y-1.5">
                    <div className="text-[11px] font-medium text-[var(--text-muted)] pb-1 border-b border-[var(--border-subtle)]">
                      {label}
                    </div>
                    <div className="flex items-center justify-between gap-4 text-[var(--probe)]">
                      <span>Raw MUT:</span>
                      <span className="font-semibold tabular-nums">
                        {formatRFR(Number(payload[0]?.value))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-[var(--validator)]">
                      <span>Defended:</span>
                      <span className="font-semibold tabular-nums">
                        {formatRFR(Number(payload[1]?.value))}
                      </span>
                    </div>
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="rawRfr"
              stroke="var(--probe)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#probeGradient)"
            />

            <Area
              type="monotone"
              dataKey="defendedRfr"
              stroke="var(--validator)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#validatorGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
