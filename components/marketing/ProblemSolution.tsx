import React from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, ShieldCheck, Bug, Layers, Repeat } from "lucide-react";

export function ProblemSolution() {
  const problems = [
    {
      icon: Bug,
      title: "Probe papers don't ship code",
      description:
        "Academic jailbreak papers introduce theoretical algorithms, but production teams lack standardized implementations ready for benchmark pipelines.",
    },
    {
      icon: AlertCircle,
      title: "Guardrails are tested in isolation",
      description:
        "Keyword filters, LLM judges, and input sanitizers are tested piecemeal rather than as an interconnected defensive multi-stage middleware stack.",
    },
    {
      icon: Layers,
      title: "You can't measure what you can't run",
      description:
        "Ad-hoc manual red teaming provides anecdotal feedback without statistical confidence intervals, versioned snapshots, or reproducible runs.",
    },
  ];

  const solutions = [
    {
      icon: ShieldCheck,
      title: "Pluggable probes",
      description:
        "Turnkey implementations of verified algorithms — GCG, PAIR, Crescendo, MultiBreak — ready to execute against any OpenAI-compatible target.",
    },
    {
      icon: CheckCircle2,
      title: "Validator middleware",
      description:
        "Chain real-time guardrails in series. Measure exact drop-off rates at each stage from input filter to reasoning verifier.",
    },
    {
      icon: Repeat,
      title: "Reproducible runs",
      description:
        "Cryptographically signed run configurations with locked seed prompts, full telemetry replay, and exportable PDF audit reports.",
    },
  ];

  return (
    <section className="py-20 px-6 max-w-[1440px] mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-7xl mx-auto">
        <h2 className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
          The Defensive Imperative
        </h2>
        <h3 className="font-display text-[32px] md:text-[38px] leading-[1.2] font-medium text-[var(--text-primary)]">
          Moving from ad-hoc red teaming to continuous robustness verification
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Probe Accent Problems */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--probe)]" />
            <span className="text-[12px] uppercase tracking-[0.03em] font-semibold text-[var(--probe)]">
              The Challenge
            </span>
          </div>

          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className="border-l-4 border-l-[var(--probe)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-[8px] bg-[var(--probe-bg)] text-[var(--probe)] shrink-0">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-[16px] font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </h4>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Column: Validator Accent Solutions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[var(--validator)]" />
            <span className="text-[12px] uppercase tracking-[0.03em] font-semibold text-[var(--validator)]">
              The Architecture
            </span>
          </div>

          {solutions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className="border-l-4 border-l-[var(--validator)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-[8px] bg-[var(--validator-bg)] text-[var(--validator)] shrink-0">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-[16px] font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </h4>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
