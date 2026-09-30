"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is running adversarial probes on third-party LLMs legally compliant?",
      a: "Yes. Adversarial Arena is strictly engineered for defensive security research and model alignment benchmarking. Users test deployments against their own API keys or models they have authorized permission to assess, consistent with standard security audit practices.",
    },
    {
      q: "Can I self-host Adversarial Arena in an air-gapped environment?",
      a: "Yes. The core engine and runner services can be deployed via Docker containers and Kubernetes helm charts directly in your own VPC or air-gapped private cloud without outbound internet dependencies.",
    },
    {
      q: "How does Adversarial Arena handle confidential model outputs and API keys?",
      a: "All API keys are encrypted at rest using AES-256-GCM. We never store raw prompts or model responses in public telemetry unless explicitly exported to your private S3 bucket or audit folder.",
    },
    {
      q: "Which model providers and architectures are supported?",
      a: "Any OpenAI-compatible completion endpoint is supported out of the box, including OpenAI, Anthropic, Mistral, Google Gemini, Ollama, vLLM, and HuggingFace TGI endpoints.",
    },
    {
      q: "Do you offer enterprise SLAs and single-tenant hosting?",
      a: "Yes. Enterprise agreements include dedicated infrastructure clusters, custom probe algorithms tailored to proprietary domains, custom SSO/SAML integration, and 99.9% uptime SLAs.",
    },
    {
      q: "How should I cite Adversarial Arena in academic papers?",
      a: "We provide standard BibTeX citations in our documentation repository. All benchmark configurations export deterministic snapshot hashes to satisfy peer review reproducibility requirements.",
    },
  ];

  return (
    <section className="py-20 px-6 max-w-[960px] mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
          Questions & Answers
        </h2>
        <h3 className="font-display text-[32px] md:text-[38px] leading-[1.2] font-medium text-[var(--text-primary)]">
          Frequently asked questions
        </h3>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <Card
              key={idx}
              className="p-0 border border-[var(--border)] overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 focus-ring"
                aria-expanded={isOpen}
              >
                <span className="text-[15px] font-medium text-[var(--text-primary)]">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform duration-200 stroke-[1.75]",
                    isOpen && "rotate-180 text-[var(--accent)]"
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-0 text-[13px] leading-relaxed text-[var(--text-secondary)] border-t border-[var(--border-subtle)]/50 pt-4">
                  {faq.a}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
