"use client";

import React, { useState, useEffect } from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Code2, Activity } from "lucide-react";
import { formatRFR, formatNumber } from "@/lib/formatters";

export function BrandPanel() {
  const stats = [
    {
      rfr: 0.473,
      runs: 2400,
      label: "avg RFR across 2,400 runs this week.",
    },
    {
      rfr: 0.182,
      runs: 1850,
      label: "with multi-stage validator middleware active.",
    },
    {
      rfr: 0.612,
      runs: 920,
      label: "baseline failure rate on raw unaligned models.",
    },
  ];

  const [currentStatIdx, setCurrentStatIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStatIdx((prev) => (prev + 1) % stats.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [stats.length]);

  const activeStat = stats[currentStatIdx];

  return (
    <div className="relative h-full w-full bg-[var(--surface)] border-l border-[var(--border)] p-12 flex flex-col justify-between overflow-hidden select-none">
      {/* Animated Grid Background (2% subtle opacity) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #EDEDF0 1px, transparent 1px),
            linear-gradient(to bottom, #EDEDF0 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Subtle accent radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--accent)]/10 blur-[100px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Top area */}
      <div className="relative z-10 flex items-center justify-between">
        <Badge variant="validator" withDot>
          Security Research Tier
        </Badge>
        <span className="text-[12px] text-[var(--text-muted)] tabular-nums">
          v0.4.2
        </span>
      </div>

      {/* Center: BrandLockup & Rotating Stat */}
      <div className="relative z-10 my-auto text-center space-y-8 max-w-sm mx-auto">
        <BrandLockup orientation="vertical" size="lg" />

        {/* Rotating Telemetry Stat Card */}
        <div className="p-6 rounded-[12px] bg-[var(--bg-base)] border border-[var(--border)] card-highlight space-y-2 transition-all duration-300">
          <div className="flex items-center justify-center gap-2 text-[var(--text-muted)] text-[11px] uppercase tracking-[0.03em] font-medium">
            <Activity className="w-3.5 h-3.5 stroke-[1.75] text-[var(--probe)]" />
            <span>Live Telemetry Benchmark</span>
          </div>

          <div className="font-display text-[36px] font-medium text-[var(--probe)] tabular-nums">
            {formatRFR(activeStat.rfr)}
          </div>

          <p className="text-[13px] text-[var(--text-secondary)] leading-snug">
            {activeStat.label}
          </p>
        </div>
      </div>

      {/* Bottom: 3 Trust Badges */}
      <div className="relative z-10 pt-8 border-t border-[var(--border-subtle)] flex items-center justify-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--validator)] stroke-[1.75]" />
          <span>SOC 2 in progress</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] font-medium">
          <Lock className="w-3.5 h-3.5 text-[var(--info)] stroke-[1.75]" />
          <span>GDPR Compliant</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] font-medium">
          <Code2 className="w-3.5 h-3.5 text-[var(--accent)] stroke-[1.75]" />
          <span>Open-source core</span>
        </div>
      </div>
    </div>
  );
}
