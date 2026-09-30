"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Key, Building2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/settings/profile",
      label: "Account & Profile",
      icon: User,
    },
    {
      href: "/settings/api-keys",
      label: "API Keys & CI/CD",
      icon: Key,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[var(--border)]">
        <h1 className="font-display text-[32px] font-medium text-[var(--text-primary)] tracking-[-0.02em]">
          Platform Settings
        </h1>
        <p className="text-[13px] text-[var(--text-secondary)]">
          Manage identity, defense benchmark thresholds, and programmatic API access
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="border-b border-[var(--border)]">
        <nav className="flex items-center gap-2 -mb-px">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap focus-ring rounded-t",
                  isActive
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon className="w-4 h-4 stroke-[1.75]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Active Tab View */}
      <div>{children}</div>
    </div>
  );
}
