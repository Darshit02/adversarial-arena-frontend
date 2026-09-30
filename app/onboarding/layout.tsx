"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getStepNumber = () => {
    if (pathname.includes("/connect")) return 2;
    if (pathname.includes("/validators")) return 3;
    return 1;
  };

  const currentStep = getStepNumber();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col justify-between p-6">
      {/* Top Header */}
      <header className="max-w-[720px] w-full mx-auto flex items-center justify-between py-6">
        <Logo withWordmark size={24} />

        {/* 3 Progress Dots */}
        <div className="flex items-center gap-2.5">
          {[1, 2, 3].map((step) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;

            return (
              <div key={step} className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-200",
                    isCurrent && "bg-[var(--accent)] ring-4 ring-[var(--accent)]/20 scale-110",
                    isCompleted && "bg-[var(--validator)]",
                    !isCurrent && !isCompleted && "bg-[var(--border)]"
                  )}
                  aria-label={`Step ${step}`}
                />
                {step < 3 && (
                  <div
                    className={cn(
                      "w-6 h-0.5 transition-colors",
                      step < currentStep ? "bg-[var(--validator)]" : "bg-[var(--border)]"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </header>

      {/* Main Wizard Content: Centered max-w-[720px] */}
      <main className="max-w-[720px] w-full mx-auto my-auto py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="max-w-[720px] w-full mx-auto text-center py-6 text-[12px] text-[var(--text-muted)]">
        Adversarial Arena · Defensive Security Research Platform
      </footer>
    </div>
  );
}
