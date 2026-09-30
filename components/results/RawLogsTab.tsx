"use client";

import React, { useState, useMemo } from "react";
import { type LogStreamEvent, type LogStreamEventType } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { Search, Download, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface RawLogsTabProps {
  events: LogStreamEvent[];
}

export function RawLogsTab({ events }: RawLogsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchesSearch =
        !searchQuery ||
        ev.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.probe_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.model_name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "ALL" || ev.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [events, searchQuery, typeFilter]);

  const handleCopyLogs = () => {
    const text = filteredEvents
      .map(
        (ev) =>
          `[${ev.timestamp}] [${ev.type}] [${ev.model_name}] ${ev.message}`
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied logs to clipboard");
  };

  const handleDownloadLogs = () => {
    const text = JSON.stringify(filteredEvents, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "run-telemetry-logs.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Downloaded telemetry logs JSON");
  };

  const getTypeBadgeClass = (type: LogStreamEventType) => {
    switch (type) {
      case "SUCCESS":
        return "bg-[var(--probe-bg)] text-[var(--probe)] border-[var(--probe)]/30";
      case "BLOCKED":
        return "bg-[var(--validator-bg)] text-[var(--validator)] border-[var(--validator)]/30";
      case "VALIDATOR":
        return "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]/30";
      case "MUT-QUERY":
        return "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/30";
      case "PROBE":
        return "bg-[var(--surface-raised)] text-[var(--accent)] border-[var(--accent)]/30";
      default:
        return "bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--border)]";
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search log messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            iconLeft={<Search className="w-4 h-4 stroke-[1.75]" />}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Log Type Filters */}
          <div className="flex items-center gap-1 p-1 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] overflow-x-auto">
            {["ALL", "INFO", "PROBE", "VALIDATOR", "MUT-QUERY", "SUCCESS", "BLOCKED"].map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-colors focus-ring whitespace-nowrap",
                    typeFilter === type
                      ? "bg-[var(--surface-raised)] text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  )}
                >
                  {type}
                </button>
              )
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyLogs}
            iconLeft={<Copy className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Copy
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadLogs}
            iconLeft={<Download className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            JSON
          </Button>
        </div>
      </div>

      {/* Log Terminal Window */}
      <div className="rounded-[12px] bg-[var(--bg-base)] border border-[var(--border)] overflow-hidden shadow-inner font-normal text-[12px]">
        {/* Terminal Header */}
        <div className="px-4 py-2.5 bg-[var(--surface-raised)] border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <Terminal className="w-3.5 h-3.5 stroke-[1.75]" />
            <span className="text-[11px] uppercase tracking-wider font-semibold">
              Execution Log Stream Replay
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
            {filteredEvents.length} events logged
          </span>
        </div>

        {/* Stream Entries */}
        <div className="p-4 max-h-[500px] overflow-y-auto space-y-2 select-text divide-y divide-[var(--border-subtle)]/40">
          {filteredEvents.length === 0 ? (
            <div className="py-8 text-center text-[var(--text-muted)] italic">
              No matching log records found.
            </div>
          ) : (
            filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="pt-2 first:pt-0 flex items-start gap-3 hover:bg-[var(--surface)]/40 p-1.5 rounded transition-colors"
              >
                {/* Timestamp */}
                <span className="text-[var(--text-muted)] text-[11px] tabular-nums whitespace-nowrap pt-0.5">
                  {ev.timestamp.split("T")[1]?.slice(0, 8) || ev.timestamp}
                </span>

                {/* Event Type Pill */}
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-[4px] border text-[10px] font-semibold tracking-wider uppercase tabular-nums shrink-0",
                    getTypeBadgeClass(ev.type)
                  )}
                >
                  {ev.type}
                </span>

                {/* MUT target tag */}
                <span className="text-[11px] text-[var(--text-muted)] tabular-nums shrink-0">
                  [{ev.model_name}]
                </span>

                {/* Message */}
                <span className="flex-1 text-[var(--text-primary)] text-[12px] leading-relaxed break-words">
                  {ev.message}
                </span>

                {/* Latency if available */}
                {ev.latency_ms && (
                  <span className="text-[10px] text-[var(--text-muted)] tabular-nums shrink-0">
                    {ev.latency_ms}ms
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
