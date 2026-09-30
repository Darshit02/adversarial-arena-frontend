import Link from "next/link";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-[var(--bg-base)]">
      <div className="max-w-xl space-y-6">
        <BrandLockup orientation="vertical" size="lg" />
        <h1 className="font-display text-[32px] font-medium tracking-[-0.02em] text-[var(--text-primary)]">
          Controlled LLM Robustness Benchmarking
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
          Defensive security research testbed measuring exact guardrail efficacy
          against automated multi-round adversarial probes.
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link href="/dev/components">
            <Button
              variant="primary"
              size="lg"
              iconRight={<ArrowRight className="w-4 h-4 stroke-[1.75]" />}
            >
              Component Showcase (/dev/components)
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
