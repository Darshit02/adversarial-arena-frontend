"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { RFRNumber } from "@/components/app/RFRNumber";
import { formatNumber } from "@/lib/formatters";
import { ShieldCheck, Clock, Zap, AlertTriangle } from "lucide-react";

interface LiveMetricsProps {
  rfrLive: number;
  blockedCount: number;
  avgLatencyMs: number;
  tokensConsumed: number;
}

export function LiveMetrics({
  rfrLive,
  blockedCount,
  avgLatencyMs,
  tokensConsumed,
}: LiveMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Tile 1: Current Live RFR */}
      <Card className="p-5 space-y-1">
        <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px] uppercase tracking-[0.03em] font-medium">
          <span>Current RFR</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--probe)] animate-pulse" />
        </div>
        <div>
          <RFRNumber rfr={rfrLive} size="display" />
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          Live bypass rate across validators
        </p>
      </Card>

      {/* Tile 2: Blocked by Guardrails */}
      <Card className="p-5 space-y-1">
        <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px] uppercase tracking-[0.03em] font-medium">
          <span>Probes Blocked</span>
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--validator)] stroke-[1.75]" />
        </div>
        <div className="font-display text-[40px] font-medium text-[var(--validator)] tabular-nums transition-all duration-300">
          {blockedCount}
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          Neutralized by validator chain
        </p>
      </Card>

      {/* Tile 3: Avg Latency */}
      <Card className="p-5 space-y-1">
        <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px] uppercase tracking-[0.03em] font-medium">
          <span>Avg Latency</span>
          <Clock className="w-3.5 h-3.5 text-[var(--info)] stroke-[1.75]" />
        </div>
        <div className="font-display text-[40px] font-medium text-[var(--text-primary)] tabular-nums transition-all duration-300">
          {avgLatencyMs}
          <span className="text-[20px] font-normal text-[var(--text-muted)] ml-1">
            ms
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          Per probe round-trip response
        </p>
      </Card>

      {/* Tile 4: Tokens Consumed */}
      <Card className="p-5 space-y-1">
        <div className="flex items-center justify-between text-[var(--text-muted)] text-[11px] uppercase tracking-[0.03em] font-medium">
          <span>Tokens Used</span>
          <Zap className="w-3.5 h-3.5 text-[var(--warning)] stroke-[1.75]" />
        </div>
        <div className="font-display text-[40px] font-medium text-[var(--text-primary)] tabular-nums transition-all duration-300">
          {formatNumber(tokensConsumed)}
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          Total input & completion tokens
        </p>
      </Card>
    </div>
  );
}
