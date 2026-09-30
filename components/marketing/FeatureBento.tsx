import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sliders,
  Terminal,
  Filter,
  Copy,
  Check,
  CheckCircle2,
  Cpu,
  Shield,
  Zap,
} from "lucide-react";
import { formatRFR } from "@/lib/formatters";

export function FeatureBento() {
  return (
    <section className="py-20 px-6 max-w-[1440px] mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
          Built For Rigorous Defense
        </h2>
        <h3 className="font-display text-[32px] md:text-[38px] leading-[1.2] font-medium text-[var(--text-primary)]">
          A precision instrument for AI safety engineering
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]">
        {/* Tile A (2x2 on desktop): Attack Lab Config Panel */}
        <div className="md:col-span-2 row-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-8 card-highlight flex flex-col justify-between overflow-hidden relative group">
          <div className="space-y-2 z-10">
            <div className="flex items-center gap-2 text-[var(--accent)] text-[12px] font-medium">
              <Sliders className="w-4 h-4 stroke-[1.75]" />
              <span>Attack Lab Studio</span>
            </div>
            <h4 className="text-[20px] font-semibold text-[var(--text-primary)]">
              Multi-Stage Probe Suite Orchestration
            </h4>
            <p className="text-[13px] text-[var(--text-secondary)] max-w-md">
              Configure automated gradient and semantic probes, tune perturbation
              budgets, and wire custom validator middleware pipelines in real time.
            </p>
          </div>

          {/* Interactive visual mockup inside card */}
          <div className="mt-6 bg-[var(--bg-base)] border border-[var(--border)] rounded-[8px] p-5 space-y-4">
            <div className="flex items-center justify-between text-[12px] pb-3 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)] font-medium">
                Validator Pipeline Chain
              </span>
              <Badge variant="validator" withDot>
                Pipeline Active
              </Badge>
            </div>

            {/* Pipeline Flow Visualization */}
            <div className="flex flex-wrap items-center gap-3 text-[12px]">
              <div className="px-3 py-1.5 rounded-[6px] bg-[var(--probe-bg)] text-[var(--probe)] border border-[var(--probe)]/30 font-medium">
                Probe: GCG
              </div>
              <span className="text-[var(--text-muted)]">→</span>
              <div className="px-3 py-1.5 rounded-[6px] bg-[var(--validator-bg)] text-[var(--validator)] border border-[var(--validator)]/30 font-medium">
                Keyword Filter
              </div>
              <span className="text-[var(--text-muted)]">→</span>
              <div className="px-3 py-1.5 rounded-[6px] bg-[var(--validator-bg)] text-[var(--validator)] border border-[var(--validator)]/30 font-medium">
                LLM Judge (v2)
              </div>
              <span className="text-[var(--text-muted)]">→</span>
              <div className="px-3 py-1.5 rounded-[6px] bg-[var(--surface-raised)] text-[var(--accent)] border border-[var(--accent)]/30 font-medium flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 stroke-[1.75]" />
                MUT: gpt-4o
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-[12px]">
              <div className="p-2.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-muted)] uppercase">
                  Seed Prompts
                </div>
                <div className="font-medium text-[var(--text-primary)] tabular-nums mt-0.5">
                  120 Curated
                </div>
              </div>
              <div className="p-2.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-muted)] uppercase">
                  Perturbation Budget
                </div>
                <div className="font-medium text-[var(--text-primary)] tabular-nums mt-0.5">
                  500 Tokens
                </div>
              </div>
              <div className="p-2.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border-subtle)]">
                <div className="text-[11px] text-[var(--text-muted)] uppercase">
                  Est. Duration
                </div>
                <div className="font-medium text-[var(--text-primary)] tabular-nums mt-0.5">
                  3m 20s
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tile B (1x1): Live Run Monitor */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-6 card-highlight flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[var(--validator)] text-[12px] font-medium">
              <Terminal className="w-4 h-4 stroke-[1.75]" />
              <span>Live Run Monitor</span>
            </div>
            <h4 className="text-[18px] font-semibold text-[var(--text-primary)]">
              SSE Telemetry Stream
            </h4>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Sub-second event logging with auto-scroll and pause-on-hover inspection.
            </p>
          </div>

          <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-[8px] p-3 text-[11px] space-y-1.5 text-left">
            <div className="text-[var(--probe)] tabular-nums">
              [14:23:07] PROBE PAIR → gpt-4o | attempt 3/5
            </div>
            <div className="text-[var(--warning)] tabular-nums">
              [14:23:08] BLOCKED by LLM-Judge [latency=120ms]
            </div>
            <div className="text-[var(--validator)] tabular-nums">
              [14:23:09] VALIDATOR Keyword Filter matched 1 token
            </div>
          </div>
        </div>

        {/* Tile C (1x1): Validator Funnel Chart */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-6 card-highlight flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[var(--info)] text-[12px] font-medium">
              <Filter className="w-4 h-4 stroke-[1.75]" />
              <span>Funnel Analysis</span>
            </div>
            <h4 className="text-[18px] font-semibold text-[var(--text-primary)]">
              Defensive Drop-off Funnel
            </h4>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Isolate which layer neutralizes prompts before they reach the model.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <div>
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mb-1">
                <span>Total Inbound Probes</span>
                <span className="tabular-nums">1,000 (100%)</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--surface-raised)] rounded-full">
                <div className="h-full bg-[var(--probe)] w-full rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mb-1">
                <span>Passed Keyword Filter</span>
                <span className="tabular-nums">420 (42%)</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--surface-raised)] rounded-full">
                <div className="h-full bg-[var(--warning)] w-[42%] rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)] mb-1">
                <span>Reached ModelUnderTest</span>
                <span className="tabular-nums">180 (18%)</span>
              </div>
              <div className="h-1.5 w-full bg-[var(--surface-raised)] rounded-full">
                <div className="h-full bg-[var(--validator)] w-[18%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Tile D (2x1 on desktop): Reproducible Runs */}
        <div className="md:col-span-2 lg:col-span-3 bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-6 card-highlight flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-[var(--accent)] text-[12px] font-medium">
              <Zap className="w-4 h-4 stroke-[1.75]" />
              <span>Deterministic Audits</span>
            </div>
            <h4 className="text-[18px] font-semibold text-[var(--text-primary)]">
              Reproducible Run Snapshots
            </h4>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Every benchmark run generates a cryptographic snapshot ID. Re-run identical suites to verify regression fixes across model releases.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[var(--bg-base)] border border-[var(--border)] px-4 py-2.5 rounded-[8px] shrink-0">
            <span className="text-[11px] uppercase tracking-[0.03em] text-[var(--text-muted)]">
              Run ID:
            </span>
            <span className="text-[14px] font-semibold text-[var(--text-primary)] tabular-nums">
              run_a4f9c2e1
            </span>
            <Badge variant="validator" withDot>
              Verified
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
