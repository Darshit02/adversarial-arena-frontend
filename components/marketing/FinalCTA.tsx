import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-24 px-6 overflow-hidden border-t border-[var(--border)]">
      {/* Accent Radial Glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[var(--accent)]/15 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] text-[12px] text-[var(--accent)]">
          <Shield className="w-3.5 h-3.5 stroke-[1.75]" />
          <span>Continuous Robustness Verification</span>
        </div>

        <h2 className="font-display text-[38px] md:text-[48px] leading-[1.1] font-medium tracking-[-0.03em] text-[var(--text-primary)]">
          Your model is only as safe as its worst day.
        </h2>

        <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] max-w-xl mx-auto">
          Start testing your LLM deployments against verified adversarial probe suites today. Benchmark guardrail coverage before shipping to production.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button
              size="lg"
              variant="primary"
              iconRight={<ArrowRight className="w-4 h-4 stroke-[1.75]" />}
            >
              Start free →
            </Button>
          </Link>
          <Link href="/docs">
            <Button size="lg" variant="ghost">
              Explore the documentation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
