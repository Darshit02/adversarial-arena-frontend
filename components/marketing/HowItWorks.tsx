import React from "react";
import { Card } from "@/components/ui/card";
import { Sliders, PlayCircle, BarChart3 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Configure",
      icon: Sliders,
      description:
        "Select published probe algorithms, pick target ModelUnderTest endpoints, and configure multi-layered validator middleware.",
    },
    {
      num: "02",
      title: "Launch",
      icon: PlayCircle,
      description:
        "Execute distributed probe batches in parallel. Monitor real-time telemetry, token consumption, and instant drop-offs via SSE streams.",
    },
    {
      num: "03",
      title: "Analyze",
      icon: BarChart3,
      description:
        "Evaluate Robustness Failure Rate (RFR) across risk categories, inspect exact bypass vectors, and download signed executive PDF reports.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 max-w-[1440px] mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
          Methodology
        </h2>
        <h3 className="font-display text-[32px] md:text-[38px] leading-[1.2] font-medium text-[var(--text-primary)]">
          Three steps to quantified robustness
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Card key={idx} className="p-8 relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-[44px] leading-none text-[var(--text-muted)] opacity-60">
                  {step.num}
                </span>
                <div className="p-2.5 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)]">
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[18px] font-semibold text-[var(--text-primary)]">
                  {step.title}
                </h4>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
