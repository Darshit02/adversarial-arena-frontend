"use client";

import React, { useState, useRef, useEffect } from "react";
import { type LogStreamEvent } from "@/types/api";
import { Terminal, Pause, Play, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogStreamProps {
  events: LogStreamEvent[];
  connectionMode: "live" | "polling";
  isConnected: boolean;
}

export function LogStream({
  events,
  connectionMode,
  isConnected,
}: LogStreamProps) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new events when not paused
  useEffect(() => {
    if (!isPaused && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [events, isPaused]);

  const getLineColor = (type: LogStreamEvent["type"]) => {
    switch (type) {
      case "INFO":
        return "text-[var(--text-muted)]";
      case "PROBE":
        return "text-[var(--probe)]";
      case "VALIDATOR":
        return "text-[var(--validator)]";
      case "MUT-QUERY":
        return "text-[var(--info)]";
      case "SUCCESS":
        return "text-[var(--text-primary)] font-medium";
      case "BLOCKED":
        return "text-[var(--warning)]";
      default:
        return "text-[var(--text-secondary)]";
    }
  };

  return (
    <div className="space-y-2">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between text-[12px] px-1">
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <Terminal className="w-4 h-4 stroke-[1.75]" />
          <span className="font-semibold text-[var(--text-primary)]">
            Live Telemetry Stream
          </span>
          {isPaused && (
            <span className="inline-flex items-center gap-1 text-[var(--warning)] bg-[var(--warning-bg)] px-2 py-0.5 rounded text-[10px] font-medium border border-[var(--warning)]/30">
              <Pause className="w-3 h-3 stroke-[2]" />
              Auto-scroll paused (hovering)
            </span>
          )}
        </div>

        {/* Connection Mode Indicator */}
        <div className="flex items-center gap-2">
          {connectionMode === "live" ? (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--validator)] bg-[var(--validator-bg)] px-2 py-0.5 rounded-[4px] border border-[var(--validator)]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--validator)] animate-pulse" />
              Live SSE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--warning)] bg-[var(--warning-bg)] px-2 py-0.5 rounded-[4px] border border-[var(--warning)]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] animate-pulse" />
              Polling (2s)
            </span>
          )}
        </div>
      </div>

      {/* Main Stream Container */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-5 h-[400px] overflow-y-auto space-y-2 card-highlight font-sans text-[12.5px] leading-relaxed transition-colors select-text"
      >
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[var(--text-muted)] italic text-[13px]">
            Connecting to event stream pipeline...
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              className="flex items-start justify-between gap-4 hover:bg-[var(--surface-hover)] -mx-2 px-2 py-0.5 rounded transition-colors group"
            >
              {/* Left Line Content */}
              <div className="flex items-baseline gap-2.5 overflow-hidden">
                <span className="text-[var(--text-faint)] tabular-nums shrink-0 select-none text-[11px]">
                  [{evt.timestamp}]
                </span>

                <span
                  className={cn(
                    "tabular-nums break-words",
                    getLineColor(evt.type)
                  )}
                >
                  {evt.message}
                </span>
              </div>

              {/* Right Line Telemetry (Latency + Tokens) */}
              <div className="flex items-center gap-3 text-right shrink-0 text-[11px] text-[var(--text-muted)] select-none">
                {evt.tokens !== undefined && (
                  <span className="tabular-nums">{evt.tokens} tok</span>
                )}
                {evt.latency_ms !== undefined && (
                  <span className="tabular-nums font-medium text-[var(--text-secondary)]">
                    {evt.latency_ms}ms
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
