import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Terminal, Shield, ArrowRight, Layers } from "lucide-react";

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Quickstart guide to connecting your first ModelUnderTest and running a baseline probe suite.",
      badge: "Essential",
      icon: Terminal,
    },
    {
      title: "Probe Registry & Algorithms",
      description: "Mathematical formulations, parameter spaces, and execution protocols for GCG, PAIR, and Crescendo.",
      badge: "Probes",
      icon: Layers,
    },
    {
      title: "Validator Middleware Architecture",
      description: "Configuring cascaded guardrail verification chains, keyword tokenizers, and LLM-as-judge prompts.",
      badge: "Validators",
      icon: Shield,
    },
    {
      title: "API & REST Reference",
      description: "Specifications for RFC 7807 error models, Clerk JWT authorization, and SSE event schemas.",
      badge: "API v1",
      icon: BookOpen,
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16 space-y-12">
      <div className="space-y-3">
        <Badge variant="validator" withDot>
          Documentation v0.4.2
        </Badge>
        <h1 className="font-display text-[38px] leading-[1.2] font-medium text-[var(--text-primary)]">
          Adversarial Arena Documentation
        </h1>
        <p className="text-[15px] text-[var(--text-secondary)] max-w-2xl">
          Everything you need to integrate ModelUnderTest endpoints, configure
          iterative probe suites, and analyze validator drop-off telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <Card key={idx} interactive className="p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)]">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <Badge variant="neutral">{sec.badge}</Badge>
                </div>
                <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
                  {sec.title}
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {sec.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center text-[13px] text-[var(--accent)] font-medium">
                <span>Read guide →</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-8 bg-[var(--surface-raised)] border border-[var(--border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Explore the Interactive Design System
          </h4>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Inspect all UI components, buttons, tokens, and semantic badges in our dev workbench.
          </p>
        </div>
        <Link href="/dev/components">
          <Button variant="secondary" iconRight={<ArrowRight className="w-4 h-4 stroke-[1.75]" />}>
            Visit /dev/components
          </Button>
        </Link>
      </Card>
    </div>
  );
}
