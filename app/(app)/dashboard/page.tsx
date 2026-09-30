"use client";

import React from "react";
import Link from "next/link";
import { MetricCard } from "@/components/app/MetricCard";
import { RFRNumber } from "@/components/app/RFRNumber";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RFRTrendChart } from "@/components/dashboard/RFRTrendChart";
import { RecentRunsList } from "@/components/dashboard/RecentRunsList";
import { CategoryBreakdownChart } from "@/components/dashboard/CategoryBreakdownChart";
import { formatNumber, formatDuration } from "@/lib/formatters";
import { Play, Sliders, Shield, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function DashboardPage() {
  const sparklinePoints = [68, 64, 72, 59, 63, 55, 61, 58, 52, 47];
  const maxPoint = Math.max(...sparklinePoints);
  const minPoint = Math.min(...sparklinePoints);

  // Normalize points to SVG viewBox 120 x 24
  const svgCoords = sparklinePoints
    .map((pt, idx) => {
      const x = (idx / (sparklinePoints.length - 1)) * 120;
      const y = 22 - ((pt - minPoint) / (maxPoint - minPoint || 1)) * 18;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className="space-y-8">
      {/* Page Title & Launch Shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-[32px] font-medium text-[var(--text-primary)] tracking-[-0.02em]">
            Executive Robustness Telemetry
          </h1>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Continuous adversarial benchmarking and validator middleware performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/attack-lab">
            <Button
              variant="primary"
              iconLeft={<Play className="w-4 h-4 stroke-[1.75]" />}
            >
              Configure & Run Suite
            </Button>
          </Link>
        </div>
      </div>

      {/* Section 1: Hero Metrics (4 equal-width cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Overall RFR */}
        <MetricCard
          title="Overall Robustness Failure Rate"
          value={<RFRNumber rfr={0.473} size="display" />}
          delta="-4.7%"
          isPositiveDelta={true}
          subtitle="Down 4.7% vs previous 10 benchmark suites"
        >
          {/* Sparkline for last 10 runs */}
          <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)]">
            <span className="text-[11px] text-[var(--text-muted)]">10-Run Sparkline</span>
            <svg
              className="w-28 h-6 overflow-visible"
              viewBox="0 0 120 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="RFR Sparkline"
            >
              <polyline
                fill="none"
                stroke="var(--probe)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={svgCoords}
              />
            </svg>
          </div>
        </MetricCard>

        {/* Card 2: Probes Tested */}
        <MetricCard
          title="Probes Tested"
          value={
            <span className="font-display text-[38px] font-medium text-[var(--text-primary)] tabular-nums">
              {formatNumber(14250)}
            </span>
          }
          delta="+18.2%"
          isPositiveDelta={true}
          subtitle="Across 4 automated probe families"
        >
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
            <span>Weekly delta:</span>
            <span className="text-[var(--text-primary)] font-medium tabular-nums">
              +2,180 probes
            </span>
          </div>
        </MetricCard>

        {/* Card 3: Validators Active */}
        <MetricCard
          title="Validators Active"
          value={
            <span className="font-display text-[38px] font-medium text-[var(--validator)] tabular-nums">
              3
            </span>
          }
          subtitle="Active in middleware defense chain"
        >
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
            <Badge variant="validator" className="text-[10px]">
              Keyword Filter
            </Badge>
            <Badge variant="validator" className="text-[10px]">
              LLM Judge
            </Badge>
            <Badge variant="validator" className="text-[10px]">
              CoT Defender
            </Badge>
          </div>
        </MetricCard>

        {/* Card 4: Avg Run Time */}
        <MetricCard
          title="Avg Run Time"
          value={
            <span className="font-display text-[38px] font-medium text-[var(--text-primary)] tabular-nums">
              {formatDuration(200000)}
            </span>
          }
          delta="-14s"
          isPositiveDelta={true}
          subtitle="Average latency per complete suite"
        >
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
            <span>Throughput:</span>
            <span className="text-[var(--text-primary)] font-medium tabular-nums">
              ~4.2 attempts / sec
            </span>
          </div>
        </MetricCard>
      </section>

      {/* Section 2: Two-column (60/40) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <RFRTrendChart />
        </div>
        <div className="lg:col-span-5">
          <RecentRunsList />
        </div>
      </section>

      {/* Section 3: Category Breakdown */}
      <section>
        <CategoryBreakdownChart />
      </section>
    </div>
  );
}
