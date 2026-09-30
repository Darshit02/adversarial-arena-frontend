"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Filter, Cpu, Check, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function OnboardingValidatorsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [validators, setValidators] = useState([
    {
      id: "keyword_filter",
      name: "Keyword filter",
      type: "keyword_filter" as const,
      badge: "Recommended",
      description: "Sub-millisecond static token and pattern matching for banned primitives.",
      enabled: true,
      icon: Filter,
    },
    {
      id: "llm_judge",
      name: "LLM-as-Judge guardrail",
      type: "llm_judge" as const,
      badge: "Standard",
      description: "Semantic verifier evaluating intent and potential alignment violations.",
      enabled: true,
      icon: ShieldCheck,
    },
    {
      id: "cot_defender",
      name: "CoT Defender",
      type: "cot_defender" as const,
      badge: "Advanced",
      description: "Deep reasoning step analysis inspecting internal multi-step logic traces.",
      enabled: false,
      icon: Cpu,
    },
  ]);

  const toggleValidator = (id: string) => {
    setValidators((prev) =>
      prev.map((val) =>
        val.id === id ? { ...val, enabled: !val.enabled } : val
      )
    );
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Create enabled validators in backend
      for (const val of validators.filter((v) => v.enabled)) {
        try {
          await api.createValidator({
            name: val.name,
            type: val.type,
            is_enabled: true,
          });
        } catch {
          // Continue if already exists
        }
      }

      // Mark onboarding completed on /auth/me
      await api.updateMe({ onboarding_completed: true });
    } catch {
      // In offline/mock mode, continue to dashboard
    } finally {
      setLoading(false);
      toast.success("Onboarding completed! Welcome to Adversarial Arena.");
      router.push("/dashboard");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--validator)]">
          Step 3 of 3
        </span>
        <h1 className="font-display text-[32px] font-medium text-[var(--text-primary)] tracking-[-0.02em]">
          Pick your starting validators
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Validators run in sequence as middleware. Any probe blocked by a validator
          is prevented from reaching your ModelUnderTest.
        </p>
      </div>

      <div className="space-y-4">
        {validators.map((val) => {
          const Icon = val.icon;
          return (
            <Card
              key={val.id}
              interactive
              onClick={() => toggleValidator(val.id)}
              className={cn(
                "p-5 flex items-center justify-between cursor-pointer transition-all duration-150",
                val.enabled
                  ? "border-[var(--validator)] ring-1 ring-[var(--validator)]/40 bg-[var(--surface-hover)]"
                  : "border-[var(--border)] opacity-70"
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-2.5 rounded-[8px] transition-colors shrink-0",
                    val.enabled
                      ? "bg-[var(--validator-bg)] text-[var(--validator)]"
                      : "bg-[var(--surface-raised)] text-[var(--text-muted)]"
                  )}
                >
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                      {val.name}
                    </h3>
                    <Badge
                      variant={val.enabled ? "validator" : "neutral"}
                      className="text-[10px]"
                    >
                      {val.badge}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>

              {/* Switch-style toggle representation */}
              <div
                className={cn(
                  "w-11 h-6 rounded-full transition-colors p-1 flex items-center shrink-0 ml-4",
                  val.enabled ? "bg-[var(--validator)]" : "bg-[var(--surface-raised)] border border-[var(--border)]"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform",
                    val.enabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
        <span className="text-[12px] text-[var(--text-muted)]">
          {validators.filter((v) => v.enabled).length} active in chain
        </span>

        <Button
          size="lg"
          variant="primary"
          loading={loading}
          onClick={handleFinish}
          iconRight={<ArrowRight className="w-4 h-4 stroke-[1.75]" />}
        >
          Finish & Enter Dashboard
        </Button>
      </div>
    </div>
  );
}
