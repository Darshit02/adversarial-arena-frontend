"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import {
  User,
  Mail,
  Building,
  Shield,
  Bell,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const [name, setName] = useState("Darshit AI Safety Labs");
  const [email, setEmail] = useState("researcher@adversarial-arena.dev");
  const [orgName, setOrgName] = useState("Autonomous Robustness Initiative");
  const [alertThreshold, setAlertThreshold] = useState("40");
  const [concurrency, setConcurrency] = useState("4");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile and benchmarking preferences saved");
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* 1. Identity & Organization */}
      <div className="p-6 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-6">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Researcher Identity
          </h2>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Personal profile and affiliated research institution credentials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              Researcher Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              iconLeft={<User className="w-4 h-4 stroke-[1.75]" />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              Email Address
            </label>
            <Input
              value={email}
              disabled
              iconLeft={<Mail className="w-4 h-4 stroke-[1.75]" />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              Organization Name
            </label>
            <Input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              iconLeft={<Building className="w-4 h-4 stroke-[1.75]" />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              Current Tier
            </label>
            <div className="h-10 px-3.5 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between text-[13px]">
              <span className="text-[var(--text-primary)] font-medium">
                Enterprise Defense Lab
              </span>
              <Badge variant="validator" className="text-[10px]">
                Unlimited Audits
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Defensive Benchmark Preferences */}
      <div className="p-6 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-6">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Defense Benchmark Defaults
          </h2>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Execution thresholds and automated alert triggers for probe runs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              Critical RFR Alert Threshold (%)
            </label>
            <Input
              type="number"
              min="10"
              max="90"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(e.target.value)}
              iconLeft={<Bell className="w-4 h-4 stroke-[1.75]" />}
            />
            <p className="text-[11px] text-[var(--text-muted)]">
              Sends high-priority alerts when a run bypass rate exceeds this cutoff
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              Default Parallel Probe Threads
            </label>
            <Input
              type="number"
              min="1"
              max="16"
              value={concurrency}
              onChange={(e) => setConcurrency(e.target.value)}
              iconLeft={<Shield className="w-4 h-4 stroke-[1.75]" />}
            />
            <p className="text-[11px] text-[var(--text-muted)]">
              Simultaneous probe payload evaluation streams dispatched to MUTs
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[var(--border-subtle)]">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            loading={saving}
            iconLeft={<Save className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Save Preferences
          </Button>
        </div>
      </div>

      {/* 3. Danger Zone */}
      <div className="p-6 rounded-[12px] bg-[var(--surface)] border border-[var(--probe)]/30 card-highlight space-y-4">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--probe)]">
            Danger Zone
          </h2>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Destructive actions that permanently purge telemetry or organization records
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[8px] bg-[var(--probe-bg)] border border-[var(--probe)]/20 text-[12px]">
          <div className="space-y-0.5">
            <span className="font-semibold text-[var(--text-primary)]">
              Purge All Historical Benchmark Runs
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">
              Deletes all past probe logs, forensic telemetry, and reports
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={() =>
              toast.error("Safety confirmation required to purge records.")
            }
            iconLeft={<Trash2 className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Purge Data
          </Button>
        </div>
      </div>
    </div>
  );
}
