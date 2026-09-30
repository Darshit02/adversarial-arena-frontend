"use client";

import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Activity, Terminal, Radio } from "lucide-react";
import { formatRFR, formatDuration } from "@/lib/formatters";

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(6);
  const [rotateY, setRotateY] = useState(-3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation with max 5deg tilt
    const maxDegree = 5;
    const rotX = -((y - centerY) / centerY) * maxDegree;
    const rotY = ((x - centerX) / centerX) * maxDegree;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    // Smooth reset
    setRotateX(4);
    setRotateY(-2);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative max-w-5xl mx-auto px-4 w-full perspective-[1200px] select-none py-8"
    >
      {/* Indigo Radial Glow behind mockup */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-[var(--accent)]/15 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Floating Card Left: Probe: PAIR · Attempt 3/5 */}
      <div
        className="absolute -left-2 md:left-2 top-20 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] overlay-shadow card-highlight transition-transform duration-300"
        style={{
          transform: `translate3d(${rotateY * -2}px, ${rotateX * -2}px, 40px)`,
        }}
      >
        <Badge variant="probe" withDot>
          Probe: PAIR
        </Badge>
        <span className="text-[12px] text-[var(--text-secondary)] tabular-nums">
          Attempt 3/5
        </span>
      </div>

      {/* Floating Card Right: Blocked by: LLM-Judge */}
      <div
        className="absolute -right-2 md:right-2 bottom-16 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] overlay-shadow card-highlight transition-transform duration-300"
        style={{
          transform: `translate3d(${rotateY * 2}px, ${rotateX * 2}px, 40px)`,
        }}
      >
        <ShieldCheck className="w-4 h-4 text-[var(--validator)] stroke-[1.75]" />
        <span className="text-[12px] text-[var(--text-primary)] font-medium">
          Blocked by:
        </span>
        <Badge variant="validator">LLM-Judge</Badge>
      </div>

      {/* Perspective Tilted Mockup Frame */}
      <div
        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[12px] overflow-hidden overlay-shadow card-highlight transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Mockup Header Bar */}
        <div className="h-10 px-4 bg-[var(--surface-raised)] border-b border-[var(--border)] flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--border)]" />
            <span className="ml-2 font-medium text-[var(--text-muted)] tabular-nums">
              run_a4f9c2e1 — Run Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[var(--validator)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--validator)] animate-pulse" />
              Live Feed
            </span>
            <span className="text-[var(--text-muted)] tabular-nums text-[11px]">
              00:03:24
            </span>
          </div>
        </div>

        {/* Mockup Body Content */}
        <div className="p-6 space-y-6">
          {/* Top Progress & Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-[8px]">
              <span className="text-[11px] uppercase tracking-[0.03em] text-[var(--text-muted)] font-medium">
                Robustness Failure Rate
              </span>
              <div className="font-display text-[26px] font-medium text-[var(--probe)] tabular-nums mt-0.5">
                {formatRFR(0.473)}
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-[8px]">
              <span className="text-[11px] uppercase tracking-[0.03em] text-[var(--text-muted)] font-medium">
                Probes Completed
              </span>
              <div className="text-[20px] font-semibold text-[var(--text-primary)] tabular-nums mt-0.5">
                12 / 40
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-[8px]">
              <span className="text-[11px] uppercase tracking-[0.03em] text-[var(--text-muted)] font-medium">
                Blocked by Guardrails
              </span>
              <div className="text-[20px] font-semibold text-[var(--validator)] tabular-nums mt-0.5">
                18
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-[8px]">
              <span className="text-[11px] uppercase tracking-[0.03em] text-[var(--text-muted)] font-medium">
                ModelUnderTest
              </span>
              <div className="text-[14px] font-medium text-[var(--text-primary)] mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--validator)]" />
                gpt-4o-mini
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
              <span>Overall Suite Progress</span>
              <span className="tabular-nums">30% Complete</span>
            </div>
            <div className="h-1.5 w-full bg-[var(--surface-raised)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--accent)] w-[30%] rounded-full" />
            </div>
          </div>

          {/* Mock Log Terminal Stream */}
          <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-[8px] p-4 text-[12px] space-y-2 text-left font-sans">
            <div className="flex items-center justify-between text-[var(--text-muted)] pb-1 border-b border-[var(--border-subtle)]/50">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 stroke-[1.75]" />
                Streaming Telemetry
              </span>
              <span className="tabular-nums text-[11px]">4 attempts / sec</span>
            </div>

            <div className="text-[var(--text-muted)] tabular-nums">
              [14:23:04] INFO Initializing probe suite configuration · PAIR algorithm
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--probe)] tabular-nums">
                [14:23:05] PROBE PAIR → gpt-4o-mini | attempt 1/5 | len=640
              </span>
              <span className="text-[var(--text-faint)] tabular-nums">380ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--warning)] tabular-nums">
                [14:23:06] BLOCKED by Keyword Filter [confidence=0.98]
              </span>
              <span className="text-[var(--text-faint)] tabular-nums">12ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--info)] tabular-nums">
                [14:23:07] MUT-QUERY Reformulating prompt with semantic obfuscation
              </span>
              <span className="text-[var(--text-faint)] tabular-nums">540ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--validator)] tabular-nums">
                [14:23:08] VALIDATOR LLM-Judge inspection passed: benign classification
              </span>
              <span className="text-[var(--text-faint)] tabular-nums">210ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
