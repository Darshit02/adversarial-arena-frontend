"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import {
  LayoutDashboard,
  Sliders,
  Activity,
  ShieldCheck,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function Sidebar({
  collapsed: controlledCollapsed,
  onToggleCollapse,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed =
    controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Attack Lab",
      href: "/attack-lab",
      icon: Sliders,
    },
    {
      label: "Runs",
      href: "/runs",
      icon: Activity,
    },
    {
      label: "Validators",
      href: "/validators",
      icon: ShieldCheck,
    },
    {
      label: "Models",
      href: "/models",
      icon: Cpu,
    },
    {
      label: "Settings",
      href: "/settings/profile",
      icon: Settings,
    },
  ];

  const mutStatuses = [
    { name: "gpt-4o-mini", online: true },
    { name: "llama3:8b", online: true },
    { name: "claude-3-5", online: false },
  ];

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-[var(--surface)] border-r border-[var(--border)] transition-all duration-200 z-30 flex flex-col justify-between select-none",
        isCollapsed ? "w-[64px]" : "w-[240px]",
        className
      )}
    >
      {/* Top Section: Brand + Collapse Toggle */}
      <div>
        <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--border-subtle)]">
          <Link href="/dashboard" className="focus-ring rounded-[6px] overflow-hidden flex items-center">
            {isCollapsed ? (
              <Logo size={24} />
            ) : (
              <Logo withWordmark size={24} />
            )}
          </Link>

          <button
            type="button"
            onClick={handleToggle}
            className="p-1 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors focus-ring"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 stroke-[1.75]" />
            ) : (
              <ChevronLeft className="w-4 h-4 stroke-[1.75]" />
            )}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-[6px] text-[13px] font-medium transition-all group focus-ring relative",
                  isActive
                    ? "bg-[var(--surface-hover)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                )}
              >
                {/* Active left border indicator (2px accent) */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1 bottom-1 w-[2px] bg-[var(--accent)] rounded-r-full"
                    aria-hidden="true"
                  />
                )}

                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 stroke-[1.75] transition-colors",
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                  )}
                />

                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: MUT Status Pills */}
      <div className="p-3 border-t border-[var(--border-subtle)] space-y-2">
        {!isCollapsed && (
          <div className="px-1 text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
            Models Under Test
          </div>
        )}

        <div className="space-y-1.5">
          {mutStatuses.map((mut, idx) => (
            <div
              key={idx}
              title={`${mut.name} (${mut.online ? "Online" : "Offline"})`}
              className={cn(
                "flex items-center gap-2 px-2 py-1 rounded-[6px] text-[12px] bg-[var(--surface-raised)] border border-[var(--border-subtle)]/50",
                isCollapsed ? "justify-center" : "justify-between"
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    mut.online ? "bg-[var(--validator)]" : "bg-[var(--text-muted)]"
                  )}
                />
                {!isCollapsed && (
                  <span className="truncate text-[var(--text-secondary)] text-[11px]">
                    {mut.name}
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  {mut.online ? "Live" : "Idle"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
