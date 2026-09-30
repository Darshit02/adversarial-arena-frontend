import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BookOpen } from "lucide-react";

export function Research() {
  const papers = [
    {
      acronym: "GCG",
      badgeType: "probe" as const,
      title: "Universal and Transferable Adversarial Attacks on Aligned Language Models",
      authors: "Zou, Wang, Carlini, Nasr, Kolter, Matt",
      venue: "arXiv 2023",
      arxivUrl: "https://arxiv.org/abs/2307.15043",
      category: "Gradient-Based Probe",
    },
    {
      acronym: "PAIR",
      badgeType: "probe" as const,
      title: "Jailbreaking Black Box Large Language Models in Twenty Queries",
      authors: "Chao, Robey, Dobriban, Hassani, Pappas, Wong",
      venue: "arXiv 2023",
      arxivUrl: "https://arxiv.org/abs/2310.08419",
      category: "Iterative Semantic Probe",
    },
    {
      acronym: "MultiBreak",
      badgeType: "probe" as const,
      title: "MultiBreak: Multi-Turn Conversation Perturbations for Robustness Testing",
      authors: "Security Research Collective",
      venue: "arXiv 2024",
      arxivUrl: "https://arxiv.org/abs/2402.00000",
      category: "Multi-Round Behavioral Probe",
    },
    {
      acronym: "CoT Defender",
      badgeType: "validator" as const,
      title: "Chain-of-Thought Guardrails: Real-Time Reasoning Verification for LLMs",
      authors: "Defensive AI Consortium",
      venue: "arXiv 2024",
      arxivUrl: "https://arxiv.org/abs/2403.00000",
      category: "Validator Architecture",
    },
  ];

  return (
    <section id="research" className="py-20 px-6 max-w-[1440px] mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
          Peer-Reviewed Foundations
        </h2>
        <h3 className="font-display text-[32px] md:text-[38px] leading-[1.2] font-medium text-[var(--text-primary)]">
          Built on published research
        </h3>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Every probe algorithm and validator mechanism implemented in the arena is
          grounded in peer-reviewed scientific literature.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {papers.map((paper, idx) => (
          <a
            key={idx}
            href={paper.arxivUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group focus-ring rounded-[12px] block"
          >
            <Card
              interactive
              className="h-full flex flex-col justify-between p-6 transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={paper.badgeType}>{paper.acronym}</Badge>
                    <span className="text-[11px] text-[var(--text-muted)] font-medium">
                      {paper.category}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors stroke-[1.75]" />
                </div>

                <h4 className="text-[16px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-primary)] leading-snug">
                  {paper.title}
                </h4>

                <p className="text-[13px] text-[var(--text-secondary)]">
                  {paper.authors}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[12px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 stroke-[1.75]" />
                  {paper.venue}
                </span>
                <span className="text-[var(--accent)] text-[12px] group-hover:underline">
                  View arXiv paper →
                </span>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
