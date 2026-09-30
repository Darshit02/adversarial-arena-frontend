"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, ShieldCheck } from "lucide-react";

export function Hero() {
  const headlineWords = [
    { text: "Break", highlight: "probe" },
    { text: "your", highlight: null },
    { text: "AI", highlight: null },
    { text: "before", highlight: "validator" },
    { text: "someone", highlight: null },
    { text: "else", highlight: null },
    { text: "does.", highlight: null },
  ];

  return (
    <section className="relative pt-12 md:pt-20 pb-16 flex flex-col items-center text-center px-6">
      {/* Subtle top background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--accent)]/10 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* Eyebrow Pill */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
        className="mb-6"
      >
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[12px] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all card-highlight"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
          <span>v0.4.2 — Multi-turn probe support shipped</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[1.75] text-[var(--text-muted)]" />
        </Link>
      </motion.div>

      {/* Headline in Fraunces Display 48px */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] as const }}
        className="font-display text-[40px] md:text-[54px] lg:text-[60px] leading-[1.1] tracking-[-0.03em] font-medium text-[var(--text-primary)] max-w-7xl"
      >
        {headlineWords.map((item, idx) => {
                  return (
            <span key={idx} >
              {item.text}{" "}
            </span>
          );
        })}
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.16, ease: [0.16, 1, 0.3, 1] as const }}
        className="mt-6 text-[15px] md:text-[16px] leading-[1.6] text-[var(--text-secondary)] max-w-[640px]"
      >
        Adversarial Arena is the controlled testbed where security teams run
        adversarial probes against their LLM deployments — and measure exactly
        which guardrails hold.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.24, ease: [0.16, 1, 0.3, 1] as const }}
        className="mt-8 flex flex-col sm:flex-row items-center gap-4"
      >
        <Link href="/signup">
          <Button
            size="lg"
            variant="primary"
            iconRight={<ArrowRight className="w-4 h-4 stroke-[1.75]" />}
          >
            Start free trial
          </Button>
        </Link>
        <Link href="/docs">
          <Button size="lg" variant="ghost">
            Read the docs →
          </Button>
        </Link>
      </motion.div>

      {/* Micro trust line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.32 }}
        className="mt-5 text-[12px] tracking-[0.02em] text-[var(--text-muted)] flex items-center gap-2"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[var(--validator)] stroke-[1.75]" />
        <span>No credit card · Open-source core · SOC 2 in progress</span>
      </motion.div>
    </section>
  );
}
