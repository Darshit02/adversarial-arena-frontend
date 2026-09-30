"use client";

import React, { use } from "react";
import { useRunStream } from "@/hooks/useRunStream";
import { RunHeader } from "@/components/run-monitor/RunHeader";
import { OverallProgress } from "@/components/run-monitor/OverallProgress";
import { LogStream } from "@/components/run-monitor/LogStream";
import { LiveMetrics } from "@/components/run-monitor/LiveMetrics";
import { AbortButton } from "@/components/run-monitor/AbortButton";

interface RunMonitorPageProps {
  params: Promise<{ id: string }>;
}

export default function RunMonitorPage({ params }: RunMonitorPageProps) {
  const resolvedParams = use(params);
  const runId = resolvedParams.id;

  const {
    events,
    status,
    connectionMode,
    isConnected,
    elapsedSeconds,
    rfrLive,
    blockedCount,
    completedCount,
    totalCount,
    avgLatencyMs,
    tokensConsumed,
    abortRun,
  } = useRunStream(runId);

  return (
    <div className="space-y-8">
      {/* 1. Header with Run ID, Status, Timer */}
      <RunHeader
        runId={runId}
        status={status}
        elapsedSeconds={elapsedSeconds}
      />

      {/* 2. Overall & Per-MUT Progress Bars */}
      <OverallProgress
        completedCount={completedCount}
        totalCount={totalCount}
      />

      {/* 3. Main Telemetry & Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Star Component - Live LogStream (7 cols) */}
        <div className="lg:col-span-7">
          <LogStream
            events={events}
            connectionMode={connectionMode}
            isConnected={isConnected}
          />
        </div>

        {/* Right: Live Telemetry Tiles (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <LiveMetrics
            rfrLive={rfrLive}
            blockedCount={blockedCount}
            avgLatencyMs={avgLatencyMs}
            tokensConsumed={tokensConsumed}
          />

          {/* Abort Run Controls */}
          <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] card-highlight flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                Emergency Stop
              </span>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Abort running probe threads immediately
              </p>
            </div>

            <AbortButton
              runId={runId}
              onAbort={abortRun}
              disabled={status !== "RUNNING"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
