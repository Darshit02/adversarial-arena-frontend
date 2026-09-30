"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Server, Cloud, Cpu, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingStep1Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const options = [
    {
      id: "own_deployment",
      title: "My own LLM deployment",
      description: "Proprietary fine-tuned model served behind custom API endpoints or VPC gateways.",
      icon: Server,
    },
    {
      id: "third_party",
      title: "A third-party API (OpenAI, Anthropic, etc.)",
      description: "Hosted foundation models accessed via standard provider completion endpoints.",
      icon: Cloud,
    },
    {
      id: "internal_models",
      title: "Internal models (Ollama, vLLM)",
      description: "Locally running inference engines via Ollama, vLLM, or HuggingFace TGI.",
      icon: Cpu,
    },
    {
      id: "exploring",
      title: "Just exploring",
      description: "Browse pre-configured demo models and evaluate standard benchmark suites.",
      icon: Compass,
    },
  ];

  const toggleOption = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selected.length === 0) return;
    router.push("/onboarding/connect");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--accent)]">
          Step 1 of 3
        </span>
        <h1 className="font-display text-[32px] font-medium text-[var(--text-primary)] tracking-[-0.02em]">
          What are you testing?
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Select all ModelUnderTest categories you plan to benchmark in the arena.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected.includes(opt.id);

          return (
            <Card
              key={opt.id}
              interactive
              onClick={() => toggleOption(opt.id)}
              className={cn(
                "p-5 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-150",
                isSelected
                  ? "border-[var(--accent)] ring-1 ring-[var(--accent)] bg-[var(--surface-hover)]"
                  : "border-[var(--border)]"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "p-2 rounded-[8px] transition-colors",
                      isSelected
                        ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                        : "bg-[var(--surface-raised)] text-[var(--text-muted)]"
                    )}
                  >
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>

                  <div
                    className={cn(
                      "w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                        : "border-[var(--border)] bg-[var(--surface)]"
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                    {opt.title}
                  </h3>
                  <p className="text-[12px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
        <span className="text-[12px] text-[var(--text-muted)]">
          {selected.length} selected
        </span>

        <Button
          size="lg"
          variant="primary"
          disabled={selected.length === 0}
          onClick={handleNext}
          iconRight={<ArrowRight className="w-4 h-4 stroke-[1.75]" />}
        >
          Continue to Model Connection
        </Button>
      </div>
    </div>
  );
}
