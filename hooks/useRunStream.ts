"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { env } from "@/lib/env";
import { apiFetch } from "@/lib/api";
import {
  type LogStreamEvent,
  type RunStatus,
  type RunSummary,
} from "@/types/api";
import { formatLogTimestamp } from "@/lib/formatters";

const API_BASE_URL = env.API_URL || "http://localhost:8000";

export type SSEStreamStatus = "connecting" | "live" | "closed" | "error";

export interface UseRunStreamReturn {
  events: LogStreamEvent[];
  status: RunStatus;
  streamStatus: SSEStreamStatus;
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
  const { getToken } = useAuth();

  const [events, setEvents] = useState<LogStreamEvent[]>([]);
  const [status, setStatus] = useState<RunStatus>("RUNNING");
  const [streamStatus, setStreamStatus] = useState<SSEStreamStatus>("connecting");
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
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  // Elapsed time tracker
  useEffect(() => {
    if (status !== "RUNNING" && status !== "PENDING") return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // Fallback Polling Function: calls GET /api/v1/runs/{id} every 2000ms until terminal
  const startFallbackPolling = useCallback(
    async (token?: string) => {
      if (pollingIntervalRef.current) return;
      setConnectionMode("polling");
      setIsConnected(true);
      setStreamStatus("live");

      const poll = async () => {
        try {
          const run = await apiFetch<RunSummary>(`/api/v1/runs/${runId}`, {
            token,
          });
          if (run) {
            setStatus(run.status);
            setRfrLive(run.rfr);
            setCompletedCount(run.completed_attempts);
            setBlockedCount(run.blocked_attempts);

            // If terminal state, stop polling
            if (
              run.status === "COMPLETED" ||
              run.status === "FAILED" ||
              run.status === "ABORTED"
            ) {
              if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
              }
              setStreamStatus("closed");
            }
          }
        } catch {
          // Keep polling until terminal or unmount
        }
      };

      await poll();
      pollingIntervalRef.current = setInterval(poll, 2000);
    },
    [runId]
  );

  // Connect to SSE stream
  const connectSSE = useCallback(async () => {
    let token: string | undefined;
    try {
      token = (await getTokenRef.current()) || undefined;
    } catch {
      // Continue without token if session unavailable
    }

    const url = `${API_BASE_URL}/api/v1/runs/${runId}/stream${
      token ? `?token=${encodeURIComponent(token)}` : ""
    }`;

    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      setStreamStatus("connecting");
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onopen = () => {
        setIsConnected(true);
        setStreamStatus("live");
        setConnectionMode("live");
        sseFailuresRef.current = 0;
      };

      // Handle standard message
      es.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          handleIncomingEvent(parsed);
        } catch {
          // Raw message
        }
      };

      // Custom event listeners according to backend contract
      const eventTypes = [
        "started",
        "progress",
        "completed",
        "failed",
        "aborted",
        "timeout",
      ];

      eventTypes.forEach((type) => {
        es.addEventListener(type, (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            handleIncomingEvent(data, type);
          } catch {
            // raw text event
          }
        });
      });

      es.onerror = () => {
        es.close();
        eventSourceRef.current = null;
        sseFailuresRef.current += 1;
        setStreamStatus("error");
        setIsConnected(false);

        // Exponential backoff retry (up to 3 attempts: 1s, 2s, 4s)
        if (sseFailuresRef.current < 3) {
          const backoffMs = Math.pow(2, sseFailuresRef.current - 1) * 1000;
          retryTimeoutRef.current = setTimeout(() => {
            connectSSE();
          }, backoffMs);
        } else {
          // Fall back to polling GET /api/v1/runs/{id}
          startFallbackPolling(token);
        }
      };
    } catch {
      startFallbackPolling(token);
    }
  }, [runId, startFallbackPolling]);

  const handleIncomingEvent = (data: any, customType?: string) => {
    if (customType === "completed") {
      setStatus("COMPLETED");
      setStreamStatus("closed");
    } else if (customType === "failed" || customType === "timeout") {
      setStatus("FAILED");
      setStreamStatus("closed");
    } else if (customType === "aborted") {
      setStatus("ABORTED");
      setStreamStatus("closed");
    } else if (customType === "started") {
      setStatus("RUNNING");
    }

    if (data.rfr_live !== undefined) setRfrLive(data.rfr_live);
    if (data.attempt_index !== undefined) setCompletedCount(data.attempt_index);
    if (data.blocked_count !== undefined) setBlockedCount(data.blocked_count);
    if (data.tokens !== undefined)
      setTokensConsumed((prev) => prev + (data.tokens || 0));
    if (data.latency_ms !== undefined) setAvgLatencyMs(data.latency_ms);

    const newLog: LogStreamEvent = {
      id: data.id || `evt-${Date.now()}-${Math.random()}`,
      timestamp: data.timestamp || formatLogTimestamp(),
      type: (data.type as any) || (customType === "completed" ? "SUCCESS" : "INFO"),
      probe_type: data.probe_type || "PAIR",
      model_name: data.model_name || "target",
      attempt_index: data.attempt_index,
      total_attempts: data.total_attempts,
      message: data.message || `Event received: ${customType || "message"}`,
      latency_ms: data.latency_ms,
      tokens: data.tokens,
      rfr_live: data.rfr_live,
    };

    setEvents((prev) => [...prev.slice(-150), newLog]);
  };

  useEffect(() => {
    connectSSE();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [connectSSE]);

  const abortRun = useCallback(async () => {
    try {
      const token = (await getToken()) || undefined;
      await apiFetch(`/api/v1/runs/${runId}/abort`, {
        method: "POST",
        token,
      });
    } catch {
      // Offline fallback
    }
    setStatus("ABORTED");
    setStreamStatus("closed");
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
  }, [runId, getToken]);

  return {
    events,
    status,
    streamStatus,
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
