"use client";

import React from "react";
import { useAttackConfig } from "@/hooks/useAttackConfig";
import { type ProbeRegistryItem } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import {
  Sliders,
  Layers,
  Dna,
  Terminal,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AttackTypeSelectProps {
  probes: ProbeRegistryItem[];
}

export function AttackTypeSelect({ probes }: AttackTypeSelectProps) {
  const { probeType, setProbeType } = useAttackConfig();

  const getProbeIcon = (type: string) => {
    switch (type) {
      case "pair":
        return Sliders;
      case "multiround":
        return Layers;
      case "autodan":
        return Dna;
      case "gcg":
        return Terminal;
      default:
        return Sliders;
    }
  };

  const selectedProbe =
    probes.find((p) => p.type === probeType) || probes[0] || null;
  const SelectedIcon = selectedProbe ? getProbeIcon(selectedProbe.type) : Sliders;

  return (
    <div className="space-y-2">
      <label className="text-[11px] leading-[1.4] tracking-[0.03em] font-medium uppercase text-[var(--text-muted)] select-none">
        Probe Algorithm
      </label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="w-full h-auto min-h-[56px] p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-subtle)] transition-all flex items-center justify-between text-left focus-ring"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-[6px] bg-[var(--probe-bg)] text-[var(--probe)] shrink-0">
                <SelectedIcon className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[14px] text-[var(--text-primary)]">
                    {selectedProbe?.name || "Select Probe Algorithm"}
                  </span>
                  {selectedProbe?.requires_whitebox && (
                    <Badge variant="warning" className="text-[10px] py-0 h-[18px]">
                      White-box
                    </Badge>
                  )}
                </div>
                <p className="text-[12px] text-[var(--text-muted)] truncate mt-0.5">
                  {selectedProbe?.description}
                </p>
              </div>
            </div>

            <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0 ml-2" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[360px] p-1.5 space-y-1">
          {probes.map((probe) => {
            const Icon = getProbeIcon(probe.type);
            const isSelected = probe.type === probeType;

            return (
              <DropdownMenuItem
                key={probe.id}
                onClick={() => setProbeType(probe.type)}
                className={cn(
                  "p-2.5 rounded-[6px] cursor-pointer flex items-start gap-3",
                  isSelected && "bg-[var(--surface-raised)] border-l-2 border-l-[var(--accent)]"
                )}
              >
                <div className="p-1.5 rounded-[6px] bg-[var(--probe-bg)] text-[var(--probe)] mt-0.5 shrink-0">
                  <Icon className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[13px] text-[var(--text-primary)]">
                      {probe.name}
                    </span>
                    {probe.requires_whitebox && (
                      <Badge variant="warning" className="text-[9px] h-4 px-1">
                        White-box
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                    {probe.description}
                  </p>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
