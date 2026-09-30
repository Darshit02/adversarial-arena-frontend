import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export function PricingTeaser() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "For individual researchers exploring adversarial robustness.",
      badge: null,
      highlight: false,
      features: [
        "Up to 5 benchmark runs per month",
        "Community probe registry access",
        "Single ModelUnderTest target",
        "Keyword filter validator",
        "Community Discord support",
      ],
      ctaText: "Start Free",
      ctaVariant: "secondary" as const,
      href: "/signup",
    },
    {
      name: "Pro",
      price: "$49",
      billing: "/month",
      description: "For security engineers validating production guardrails.",
      badge: "Most popular",
      highlight: true,
      features: [
        "Unlimited automated probe runs",
        "Full probe registry (GCG, PAIR, Crescendo)",
        "Up to 10 ModelUnderTest targets",
        "Multi-stage validator middleware",
        "SSE live log streaming & export",
        "Signed PDF executive reports",
      ],
      ctaText: "Start 14-day Pro Trial",
      ctaVariant: "primary" as const,
      href: "/signup?plan=pro",
    },
    {
      name: "Team",
      price: "$199",
      billing: "/month",
      description: "For security and red teams collaborating on enterprise models.",
      badge: null,
      highlight: false,
      features: [
        "Everything in Pro tier",
        "Unlimited ModelUnderTest endpoints",
        "Team workspace & shared suites",
        "Custom validator webhook integration",
        "CI/CD regression test webhooks",
        "Priority dedicated SLA support",
      ],
      ctaText: "Contact Team Sales",
      ctaVariant: "secondary" as const,
      href: "/signup?plan=team",
    },
  ];

  return (
    <section className="py-20 px-6 max-w-[1440px] mx-auto space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
          Transparent Pricing
        </h2>
        <h3 className="font-display text-[32px] md:text-[38px] leading-[1.2] font-medium text-[var(--text-primary)]">
          Predictable plans for security teams
        </h3>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Deploy on our cloud or self-host the open-source core in your own VPC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, idx) => (
          <Card
            key={idx}
            className={`flex flex-col justify-between p-8 relative ${
              tier.highlight
                ? "border-2 border-[var(--accent)] ring-1 ring-[var(--accent)]/30"
                : "border-[var(--border)]"
            }`}
          >
            {tier.badge && (
              <div className="absolute -top-3 right-6">
                <Badge variant="validator" withDot>
                  {tier.badge}
                </Badge>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-[18px] font-semibold text-[var(--text-primary)]">
                  {tier.name}
                </h4>
                <p className="text-[13px] text-[var(--text-secondary)] min-h-[38px]">
                  {tier.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-display text-[40px] font-medium text-[var(--text-primary)] tabular-nums">
                  {tier.price}
                </span>
                {tier.billing && (
                  <span className="text-[13px] text-[var(--text-muted)]">
                    {tier.billing}
                  </span>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
                <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
                  Includes
                </span>
                <ul className="space-y-2.5 text-[13px] text-[var(--text-secondary)]">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[var(--validator)] shrink-0 mt-0.5 stroke-[1.75]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-6 border-t border-[var(--border-subtle)]">
              <Link href={tier.href} className="w-full block">
                <Button variant={tier.ctaVariant} size="lg" className="w-full">
                  {tier.ctaText}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
