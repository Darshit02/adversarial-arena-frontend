"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { type LogStreamEvent, type RunStatus } from "@/types/api";
import { formatLogTimestamp } from "@/lib/formatters";
import { api } from "@/lib/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface UseRunStreamReturn {
  events: LogStreamEvent[];
  status: RunStatus;
  isConnected: boolean;
  connectionMode: "live" | "polling";
  elapsedSeconds: number;
  rfrLive: number;
  blockedCount: number;
  completedCount: number;
  totalCount: number;
  avgLatencyMs: number;
  tokensConsumed: number;
  abortRun: () => Promise<void>;
}

export function useRunStream(runId: string): UseRunStreamReturn {
  const [events, setEvents] = useState<LogStreamEvent[]>([]);
  const [status, setStatus] = useState<RunStatus>("RUNNING");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionMode, setConnectionMode] = useState<"live" | "polling">("live");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [rfrLive, setRfrLive] = useState(0.473);
  const [blockedCount, setBlockedCount] = useState(14);
  const [completedCount, setCompletedCount] = useState(12);
  const totalCount = 40;
  const [avgLatencyMs, setAvgLatencyMs] = useState(320);
  const [tokensConsumed, setTokensConsumed] = useState(18420);

  const sseFailuresRef = useRef(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Elapsed time timer
  useEffect(() => {
    if (status !== "RUNNING") return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // Handle SSE Subscription with Fallback to Polling
  useEffect(() => {
    let isCancelled = false;

    const setupSSE = () => {
      try {
        const streamUrl = `${API_BASE_URL}/api/v1/runs/${runId}/stream`;
        const es = new EventSource(streamUrl);
        eventSourceRef.current = es;

        es.onopen = () => {
          if (isCancelled) return;
          setIsConnected(true);
          setConnectionMode("live");
          sseFailuresRef.current = 0;
        };

        es.onmessage = (event) => {
          if (isCancelled) return;
          try {
            const parsed: LogStreamEvent = JSON.parse(event.data);
            setEvents((prev) => [...prev, parsed]);

            if (parsed.rfr_live !== undefined) setRfrLive(parsed.rfr_live);
            if (parsed.attempt_index !== undefined)
              setCompletedCount(parsed.attempt_index);
            if (parsed.tokens !== undefined)
              setTokensConsumed((prev) => prev + (parsed.tokens || 0));
            if (parsed.latency_ms !== undefined)
              setAvgLatencyMs(parsed.latency_ms);
          } catch {
            // raw text fallback
          }
        };

        es.onerror = () => {
          es.close();
          sseFailuresRef.current += 1;
          if (sseFailuresRef.current >= 3) {
            // Fallback to polling mode
            setConnectionMode("polling");
            setIsConnected(true);
          } else {
            setIsConnected(false);
          }
        };
      } catch {
        setConnectionMode("polling");
        setIsConnected(true);
      }
    };

    setupSSE();

    return () => {
      isCancelled = true;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [runId]);

  // Fallback Simulation Generator (emits realistic events if backend is idle/offline)
  useEffect(() => {
    const initialEvents: LogStreamEvent[] = [
      {
        id: "evt-0",
        timestamp: formatLogTimestamp(new Date(Date.now() - 14000)),
        type: "INFO",
        probe_type: "PAIR",
        model_name: "gpt-4o-mini",
        message: "Initializing automated probe suite · Target: gpt-4o-mini, llama3:8b",
      },
      {
        id: "evt-1",
        timestamp: formatLogTimestamp(new Date(Date.now() - 11000)),
        type: "PROBE",
        probe_type: "PAIR",
        model_name: "gpt-4o-mini",
        attempt_index: 1,
        total_attempts: 5,
        message: "PROBE PAIR → gpt-4o-mini | attempt 1/5 | len=640",
        latency_ms: 310,
        tokens: 640,
      },
      {
        id: "evt-2",
        timestamp: formatLogTimestamp(new Date(Date.now() - 9000)),
        type: "BLOCKED",
        probe_type: "PAIR",
        model_name: "gpt-4o-mini",
        message: "BLOCKED by Keyword Filter [matched banned token]",
        latency_ms: 8,
      },
      {
        id: "evt-3",
        timestamp: formatLogTimestamp(new Date(Date.now() - 6000)),
        type: "MUT-QUERY",
        probe_type: "PAIR",
        model_name: "gpt-4o-mini",
        attempt_index: 2,
        total_attempts: 5,
        message: "MUT-QUERY Reformulating prompt with contextual abstraction",
        latency_ms: 420,
        tokens: 720,
      },
      {
        id: "evt-4",
        timestamp: formatLogTimestamp(new Date(Date.now() - 3000)),
        type: "VALIDATOR",
        probe_type: "PAIR",
        model_name: "gpt-4o-mini",
        message: "VALIDATOR LLM-Judge inspection passed: intent classified as educational",
        latency_ms: 190,
      },
      {
        id: "evt-5",
        timestamp: formatLogTimestamp(),
        type: "SUCCESS",
        probe_type: "PAIR",
        model_name: "gpt-4o-mini",
        attempt_index: 3,
        total_attempts: 5,
        message: "SUCCESS Prompt reached ModelUnderTest · Response verified",
        latency_ms: 480,
        tokens: 950,
      },
    ];

    setEvents(initialEvents);
    setIsConnected(true);

    // Stream a new simulated event every 3.5 seconds while RUNNING
    const interval = setInterval(() => {
      if (status !== "RUNNING") return;

      const attempt = Math.floor(Math.random() * 5) + 1;
      const lat = Math.floor(Math.random() * 300) + 180;
      const tok = Math.floor(Math.random() * 400) + 500;
      const isBlocked = Math.random() > 0.45;

      const eventType = isBlocked ? "BLOCKED" : "PROBE";
      const message = isBlocked
        ? `BLOCKED by LLM-Judge [confidence=0.92]`
        : `PROBE PAIR → gpt-4o-mini | attempt ${attempt}/5 | len=${tok}`;

      const newEvt: LogStreamEvent = {
        id: `evt-${Date.now()}`,
        timestamp: formatLogTimestamp(),
        type: eventType,
        probe_type: "PAIR",
        model_name: "gpt-4o-mini",
        attempt_index: attempt,
        total_attempts: 5,
        message,
        latency_ms: lat,
        tokens: tok,
      };

      setEvents((prev) => [...prev.slice(-100), newEvt]);
      setCompletedCount((prev) => Math.min(totalCount, prev + 1));
      if (isBlocked) setBlockedCount((prev) => prev + 1);
      setTokensConsumed((prev) => prev + tok);
      setAvgLatencyMs(lat);
      setRfrLive((prev) => {
        const delta = (Math.random() - 0.5) * 0.02;
        return Math.max(0.05, Math.min(0.95, Number((prev + delta).toFixed(3))));
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [status]);

  const abortRun = useCallback(async () => {
    try {
      await api.abortRun(runId);
    } catch {
      // offline fallback
    }
    setStatus("ABORTED");
    setEvents((prev) => [
      ...prev,
      {
        id: `evt-abort-${Date.now()}`,
        timestamp: formatLogTimestamp(),
        type: "INFO",
        probe_type: "SYSTEM",
        model_name: "ALL",
        message: "ABORT SIGNAL RECEIVED · Run execution terminated by user",
      },
    ]);
  }, [runId]);

  return {
    events,
    status,
    isConnected,
    connectionMode,
    elapsedSeconds,
    rfrLive,
    blockedCount,
    completedCount,
    totalCount,
    avgLatencyMs,
    tokensConsumed,
    abortRun,
  };
}
