"use client";

import React, { use, useState, useEffect } from "react";
import { useRunStream } from "@/hooks/useRunStream";
import { useRun, useRunResults, useRunReport } from "@/hooks/useRuns";
import { DetailHeader } from "@/components/results/DetailHeader";
import { OverviewTab } from "@/components/results/OverviewTab";
import { ProbesTab } from "@/components/results/ProbesTab";
import { ValidatorAnalysisTab } from "@/components/results/ValidatorAnalysisTab";
import { RawLogsTab } from "@/components/results/RawLogsTab";
import { OverallProgress } from "@/components/run-monitor/OverallProgress";
import { LogStream } from "@/components/run-monitor/LogStream";
import { LiveMetrics } from "@/components/run-monitor/LiveMetrics";
import { AbortButton } from "@/components/run-monitor/AbortButton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  FileSearch,
  ShieldCheck,
  Terminal,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RunDetailPageProps {
  params: Promise<{ id: string }>;
}

type TabType = "overview" | "probes" | "validator" | "logs" | "monitor";

export default function RunDetailPage({ params }: RunDetailPageProps) {
  const resolvedParams = use(params);
  const runId = resolvedParams.id;

  // Telemetry stream for live updates
  const {
    events: streamEvents,
    status: streamStatus,
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

  // Queries for post-run benchmark analysis
  const { data: run, isLoading: isRunLoading } = useRun(runId);
  const { data: results, isLoading: isResultsLoading } = useRunResults(runId);
  const { data: report, isLoading: isReportLoading } = useRunReport(runId);

  // Determine initial active tab based on status
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    if (run?.status === "RUNNING") {
      setActiveTab("monitor");
    } else {
      setActiveTab("overview");
    }
  }, [run?.status]);

  if (isRunLoading || !run) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-[12px]" />
          <Skeleton className="h-28 rounded-[12px]" />
          <Skeleton className="h-28 rounded-[12px]" />
          <Skeleton className="h-28 rounded-[12px]" />
        </div>
      </div>
    );
  }

  // Merged status: Stream status takes precedence if active
  const effectiveStatus = streamStatus || run.status;
  const isCurrentlyRunning = effectiveStatus === "RUNNING";

  return (
    <div className="space-y-6">
      {/* 1. Header with Metadata, Export Dropdown, Re-run */}
      <DetailHeader run={run} report={report} />

      {/* 2. Forensic Tabs Switcher */}
      <div className="border-b border-[var(--border)]">
        <nav className="flex items-center gap-2 -mb-px overflow-x-auto pb-1 sm:pb-0">
          {/* Overview Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap focus-ring rounded-t",
              activeTab === "overview"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            <BarChart3 className="w-4 h-4 stroke-[1.75]" />
            <span>Overview &amp; Metrics</span>
          </button>

          {/* Probes Detail Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("probes")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap focus-ring rounded-t",
              activeTab === "probes"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            <FileSearch className="w-4 h-4 stroke-[1.75]" />
            <span>Probe Payloads ({results?.total ?? 0})</span>
          </button>

          {/* Guardrail Analysis Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("validator")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap focus-ring rounded-t",
              activeTab === "validator"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
            <span>Guardrail Analysis</span>
          </button>

          {/* Raw Logs Replay Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap focus-ring rounded-t",
              activeTab === "logs"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            <Terminal className="w-4 h-4 stroke-[1.75]" />
            <span>Raw Logs</span>
          </button>

          {/* Live Monitor Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("monitor")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap focus-ring rounded-t ml-auto",
              activeTab === "monitor"
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            )}
          >
            <span className="relative flex h-2 w-2">
              {isCurrentlyRunning && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  isCurrentlyRunning ? "bg-[var(--accent)]" : "bg-[var(--text-muted)]"
                )}
              />
            </span>
            <span>Live Monitor</span>
          </button>
        </nav>
      </div>

      {/* 3. Tab Content Panes */}
      <div>
        {/* Tab 1: Forensic Overview */}
        {activeTab === "overview" && report && (
          <OverviewTab run={run} report={report} />
        )}

        {/* Tab 2: Probes Deep Dive */}
        {activeTab === "probes" && results && (
          <ProbesTab attempts={results.items} />
        )}

        {/* Tab 3: Guardrail & Evasion Analysis */}
        {activeTab === "validator" && report && (
          <ValidatorAnalysisTab run={run} report={report} />
        )}

        {/* Tab 4: Raw Telemetry Logs */}
        {activeTab === "logs" && (
          <RawLogsTab events={streamEvents} />
        )}

        {/* Tab 5: Live Execution Monitor */}
        {activeTab === "monitor" && (
          <div className="space-y-8">
            {/* Progress Bars */}
            <OverallProgress
              completedCount={completedCount}
              totalCount={totalCount}
            />

            {/* Main Telemetry & Metrics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Star Component - Live LogStream (7 cols) */}
              <div className="lg:col-span-7">
                <LogStream
                  events={streamEvents}
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
                    disabled={!isCurrentlyRunning}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
