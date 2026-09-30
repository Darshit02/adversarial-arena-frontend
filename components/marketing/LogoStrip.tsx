import React from "react";

export function LogoStrip() {
  const teams = [
    "CYBERMETRIC LABS",
    "AETHER DEFENSE",
    "SYNAPSE RESEARCH",
    "NEXUS INTELLIGENCE",
    "SHIELD SEC",
    "QUANTUM ROBUST",
  ];

  return (
    <section className="py-12 border-y border-[var(--border-subtle)] bg-[var(--surface)]/30 px-6">
      <div className="max-w-[1440px] mx-auto text-center space-y-6">
        <h2 className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
          Trusted by security teams at
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-60">
          {teams.map((name, i) => (
            <span
              key={i}
              className="text-[14px] font-semibold tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
