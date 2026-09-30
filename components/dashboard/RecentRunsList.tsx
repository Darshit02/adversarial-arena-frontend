"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RFRNumber } from "@/components/app/RFRNumber";
import { ArrowRight } from "lucide-react";
import { type RunStatus } from "@/types/api";

interface RecentRunItem {
  id: string;
  probeType: string;
  models: string[];
  rfr: number;
  status: RunStatus;
  timestamp: string;
}

const mockRecentRuns: RecentRunItem[] = [
  {
    id: "run_a4f9c2e1",
    probeType: "pair",
    models: ["gpt-4o-mini", "llama3:8b"],
    rfr: 0.473,
    status: "COMPLETED",
    timestamp: "12m ago",
  },
  {
    id: "run_8e3b1c90",
    probeType: "multiround",
    models: ["gpt-4o-mini"],
    rfr: 0.182,
    status: "RUNNING",
    timestamp: "24m ago",
  },
  {
    id: "run_3c7d9e4a",
    probeType: "autodan",
    models: ["llama3:8b"],
    rfr: 0.384,
    status: "COMPLETED",
    timestamp: "2h ago",
  },
  {
    id: "run_f1b2c3d4",
    probeType: "gcg",
    models: ["gpt-4o-mini", "claude-3-5"],
    rfr: 0.125,
    status: "COMPLETED",
    timestamp: "5h ago",
  },
  {
    id: "run_7a8b9c0d",
    probeType: "crescendo",
    models: ["claude-3-5"],
    rfr: 0.54,
    status: "FAILED",
    timestamp: "1d ago",
  },
];

export function RecentRunsList() {
  const statusDots = {
    RUNNING: "bg-[var(--warning)] animate-pulse",
    COMPLETED: "bg-[var(--validator)]",
    FAILED: "bg-[var(--probe)]",
    ABORTED: "bg-[var(--text-muted)]",
    PENDING: "bg-[var(--info)]",
  };

  return (
    <Card className="p-6 flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle>Recent Runs</CardTitle>
          <CardDescription>Last 5 benchmark executions</CardDescription>
        </div>

        <Link
          href="/runs"
          className="text-[12px] text-[var(--accent)] hover:underline font-medium flex items-center gap-1 focus-ring rounded-[4px]"
        >
          <span>All runs</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[1.75]" />
        </Link>
      </CardHeader>

      <div className="divide-y divide-[var(--border-subtle)]">
        {mockRecentRuns.map((run) => (
          <Link
            key={run.id}
            href={`/runs/${run.id}`}
            className="group py-3 flex items-center justify-between transition-colors hover:bg-[var(--surface-hover)] -mx-2 px-2 rounded-[6px]"
          >
            {/* Left: ID & Probe */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${statusDots[run.status]}`}
                />
                <span className="font-medium text-[13px] text-[var(--text-primary)] tabular-nums">
                  {run.id}
                </span>
                <Badge variant="probe">{run.probeType}</Badge>
              </div>

              {/* Models Avatar Stack / Pills */}
              <div className="flex items-center gap-1.5 pl-4">
                {run.models.map((m, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-[var(--text-muted)] bg-[var(--surface-raised)] px-1.5 py-0.5 rounded-[4px] border border-[var(--border-subtle)]"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: RFR, Timestamp & View link */}
            <div className="text-right flex items-center gap-4">
              <div>
                <RFRNumber rfr={run.rfr} size="sm" />
                <div className="text-[11px] text-[var(--text-muted)] tabular-nums">
                  {run.timestamp}
                </div>
              </div>

              <span className="text-[12px] font-medium text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-flex items-center gap-1">
                View →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
