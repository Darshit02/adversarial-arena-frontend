"use client";

import React, { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Wordmark } from "@/components/brand/Wordmark";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown";
import { Tooltip } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toast";
import {
  ShieldAlert,
  Play,
  ArrowRight,
  Search,
  Key,
  MoreVertical,
  Activity,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  rfrColor,
  probeClasses,
  validatorClasses,
  warningClasses,
  infoClasses,
} from "@/lib/color-semantics";
import { formatRFR, formatDuration, formatNumber } from "@/lib/formatters";

export default function DevComponentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<"sm" | "md" | "lg" | "xl">("md");

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] p-8 max-w-[1440px] mx-auto space-y-12">
      {/* Page Header */}
      <header className="border-b border-[var(--border)] pb-8 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <h1 className="font-display text-[32px] leading-[1.2] tracking-[-0.02em] font-medium text-[var(--text-primary)]">
              Design System & Component Showcase
            </h1>
          </div>
          <Badge variant="validator" withDot>
            Phase 12 Complete
          </Badge>
        </div>
        <p className="text-[14px] text-[var(--text-secondary)] max-w-[65ch]">
          Precision instrument workbench testing every variant, state, semantic
          color token, and interactive behavior under dark mode specifications.
        </p>
      </header>

      {/* 1. Brand Elements */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
          1. Brand Assets & Typography
        </h2>
        <Card className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
              Logo Variants & Sizes
            </span>
            <div className="flex items-center gap-4 bg-[var(--bg-base)] p-4 rounded-[8px] border border-[var(--border)]">
              <Logo size={24} />
              <Logo size={32} />
              <Logo size={40} />
              <div className="text-[var(--text-secondary)]">
                <Logo size={32} variant="mono" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
              Wordmark (Fraunces Medium)
            </span>
            <div className="flex flex-col gap-2 bg-[var(--bg-base)] p-4 rounded-[8px] border border-[var(--border)]">
              <Wordmark size="sm" />
              <Wordmark size="md" />
              <Wordmark size="lg" />
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
              Brand Lockups
            </span>
            <div className="flex flex-col gap-3 bg-[var(--bg-base)] p-4 rounded-[8px] border border-[var(--border)]">
              <BrandLockup orientation="horizontal" size="sm" />
              <BrandLockup orientation="horizontal" size="md" />
              <BrandLockup orientation="vertical" size="sm" />
            </div>
          </div>
        </Card>
      </section>

      {/* 2. Semantic Color Palette */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
          2. Semantic Colors & Domain Tokens
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-[12px] bg-[var(--probe-bg)] border border-[var(--probe)]/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--probe)]">
                --probe
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--probe)]" />
            </div>
            <p className="text-[12px] text-[var(--text-muted)]">
              #C77B7B · Probes & High RFR (&gt;50%)
            </p>
          </div>

          <div className="p-4 rounded-[12px] bg-[var(--validator-bg)] border border-[var(--validator)]/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--validator)]">
                --validator
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--validator)]" />
            </div>
            <p className="text-[12px] text-[var(--text-muted)]">
              #7FB88E · Validators & Low RFR (&lt;20%)
            </p>
          </div>

          <div className="p-4 rounded-[12px] bg-[var(--warning-bg)] border border-[var(--warning)]/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--warning)]">
                --warning
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]" />
            </div>
            <p className="text-[12px] text-[var(--text-muted)]">
              #D4A574 · Warnings & Mod RFR (20-50%)
            </p>
          </div>

          <div className="p-4 rounded-[12px] bg-[var(--info-bg)] border border-[var(--info)]/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--info)]">
                --info
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--info)]" />
            </div>
            <p className="text-[12px] text-[var(--text-muted)]">
              #7FA8C9 · Telemetry & MUT Queries
            </p>
          </div>
        </div>
      </section>

      {/* 3. Button Component */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
          3. Button Variants & States
        </h2>
        <Card className="space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
              Variants (Primary, Secondary, Ghost, Danger)
            </span>
            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="ghost">Ghost Action</Button>
              <Button variant="danger">Danger Action</Button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
              Sizes (sm: 32px, md: 40px, lg: 48px)
            </span>
            <div className="flex flex-wrap gap-4 items-center">
              <Button size="sm">Small (32px)</Button>
              <Button size="md">Medium (40px)</Button>
              <Button size="lg">Large (48px)</Button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-[var(--text-muted)]">
              States: Icons, Loading, Disabled, Active
            </span>
            <div className="flex flex-wrap gap-4 items-center">
              <Button iconLeft={<Play className="w-4 h-4 stroke-[1.75]" />}>
                Run Probe Suite
              </Button>
              <Button
                variant="secondary"
                iconRight={<ArrowRight className="w-4 h-4 stroke-[1.75]" />}
              >
                Next Step
              </Button>
              <Button loading>Deploying...</Button>
              <Button disabled>Disabled Action</Button>
            </div>
          </div>
        </Card>
      </section>

      {/* 4. Input Component */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
          4. Input States & Decorators
        </h2>
        <Card className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Default Input"
            placeholder="e.g. gpt-4o-mini"
            hint="Input with placeholder and helper hint"
          />

          <Input
            label="Search with Icon"
            placeholder="Search probes by ID..."
            iconLeft={<Search className="w-4 h-4 stroke-[1.75]" />}
          />

          <Input
            label="API Key with Error"
            type="password"
            defaultValue="invalid_key_sample"
            error="Invalid endpoint credentials provided"
            iconLeft={<Key className="w-4 h-4 stroke-[1.75]" />}
          />

          <Input
            label="Disabled Input"
            disabled
            defaultValue="system-assigned-identifier"
            hint="Read-only system assigned value"
          />
        </Card>
      </section>

      {/* 5. Badge Component */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
          5. Badge Variants & Semantic Indicators
        </h2>
        <Card className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Badge variant="neutral">Neutral Badge</Badge>
            <Badge variant="probe">Probe: PAIR</Badge>
            <Badge variant="validator">Validator: LLM-Judge</Badge>
            <Badge variant="warning">Warning: 38.5% RFR</Badge>
            <Badge variant="info">MUT: gpt-4o</Badge>
          </div>

          <div className="flex flex-wrap gap-3 items-center pt-2">
            <Badge variant="neutral" withDot>
              Offline
            </Badge>
            <Badge variant="probe" withDot>
              Probe Executing
            </Badge>
            <Badge variant="validator" withDot>
              Active Guardrail
            </Badge>
            <Badge variant="warning" withDot>
              Rate Limited
            </Badge>
            <Badge variant="info" withDot>
              SSE Stream Connected
            </Badge>
          </div>
        </Card>
      </section>

      {/* 6. Card & Table Components */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
          6. Card Structure & Table
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card interactive className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>
                Card with 1px top inset highlight and hover elevation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--text-secondary)]">Robustness Failure Rate</span>
                  <span className="font-medium tabular-nums text-[var(--probe)]">
                    {formatRFR(0.612)}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[var(--text-secondary)]">Run Duration</span>
                  <span className="tabular-nums">{formatDuration(200000)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="text-[11px] uppercase tracking-[0.03em] text-[var(--text-muted)]">
                Status
              </span>
              <Badge variant="probe" withDot>
                High Risk
              </Badge>
            </CardFooter>
          </Card>

          <div className="lg:col-span-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Run ID</TableHead>
                  <TableHead>Probe Type</TableHead>
                  <TableHead>MUT</TableHead>
                  <TableHead isNumber>Attempts</TableHead>
                  <TableHead isNumber>RFR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium tabular-nums">
                    run_a4f9c2e1
                  </TableCell>
                  <TableCell>
                    <Badge variant="probe">multiround</Badge>
                  </TableCell>
                  <TableCell>gpt-4o-mini</TableCell>
                  <TableCell isNumber className="tabular-nums">
                    {formatNumber(40)}
                  </TableCell>
                  <TableCell isNumber className="tabular-nums font-semibold text-[var(--probe)]">
                    {formatRFR(0.473)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium tabular-nums">
                    run_8e3b1c90
                  </TableCell>
                  <TableCell>
                    <Badge variant="probe">pair</Badge>
                  </TableCell>
                  <TableCell>llama3</TableCell>
                  <TableCell isNumber className="tabular-nums">
                    {formatNumber(25)}
                  </TableCell>
                  <TableCell isNumber className="tabular-nums font-semibold text-[var(--validator)]">
                    {formatRFR(0.182)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium tabular-nums">
                    run_3c7d9e4a
                  </TableCell>
                  <TableCell>
                    <Badge variant="probe">autodan</Badge>
                  </TableCell>
                  <TableCell>claude-3-5-sonnet</TableCell>
                  <TableCell isNumber className="tabular-nums">
                    {formatNumber(60)}
                  </TableCell>
                  <TableCell isNumber className="tabular-nums font-semibold text-[var(--warning)]">
                    {formatRFR(0.384)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* 7. Dialog, Dropdown & Tooltip */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
          7. Modals, Dropdowns & Tooltips
        </h2>
        <Card className="flex flex-wrap gap-6 items-center">
          <Button
            variant="secondary"
            onClick={() => {
              setModalSize("md");
              setModalOpen(true);
            }}
          >
            Open Modal Dialog
          </Button>

          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Configure Target Model"
            description="Provide connection endpoints and encrypted authentication credentials."
            size={modalSize}
          >
            <div className="space-y-4 py-2">
              <Input
                label="Model Identifier"
                defaultValue="gpt-4o-2024-08-06"
                placeholder="e.g. gpt-4o"
              />
              <Input
                label="Base URL"
                defaultValue="https://api.openai.com/v1"
                placeholder="https://..."
              />
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setModalOpen(false);
                    toast.success("Model target verified and saved");
                  }}
                >
                  Save Model
                </Button>
              </div>
            </div>
          </Modal>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                iconRight={<ChevronDown className="w-4 h-4 stroke-[1.75]" />}
              >
                Actions Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Run Management</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => toast.info("Opening run details")}>
                View Run Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Configuration cloned")}>
                Clone Suite
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast("Export initiated")}>
                Export PDF Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="danger"
                onClick={() => toast.error("Aborted run execution")}
              >
                Abort Run
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip content="Robustness Failure Rate: Percentage of probes bypassing all configured validators">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] bg-[var(--surface-hover)] border border-[var(--border)] text-[13px] cursor-help">
              <ShieldAlert className="w-4 h-4 text-[var(--warning)] stroke-[1.75]" />
              Hover for RFR Tooltip
            </span>
          </Tooltip>
        </Card>
      </section>

      {/* 8. Toasts (Sonner) */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
          8. Feedback Toasts (Sonner)
        </h2>
        <Card className="flex flex-wrap gap-4 items-center">
          <Button
            variant="secondary"
            onClick={() => toast("Standard notification dispatched")}
          >
            Default Toast
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.success("Validator configuration validated successfully")
            }
          >
            Success Toast
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.error("Probe connection refused: Target MUT unreachable")
            }
          >
            Error Toast
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.warning("White-box access required for full gradient probe")
            }
          >
            Warning Toast
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.info("Streaming probe log feed connected")}
          >
            Info Toast
          </Button>
        </Card>
      </section>

      {/* 9. Skeletons */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
          9. Loading Skeletons (No Spinners)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="card" />
          <div className="space-y-2 border border-[var(--border)] rounded-[8px] p-4 bg-[var(--surface)]">
            <Skeleton variant="table-row" />
            <Skeleton variant="table-row" />
            <Skeleton variant="table-row" />
          </div>
        </div>
      </section>

      {/* 10. Empty State */}
      <section className="space-y-4">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-[-0.01em]">
          10. Empty State Component
        </h2>
        <Card>
          <EmptyState
            icon={Layers}
            title="No benchmark runs executed yet"
            description="Launch your first adversarial probe suite against a ModelUnderTest to measure your guardrail coverage and failure rates."
            action={
              <Button
                variant="primary"
                iconLeft={<Play className="w-4 h-4 stroke-[1.75]" />}
                onClick={() => toast.info("Navigate to Attack Lab")}
              >
                Launch First Probe Suite
              </Button>
            }
          />
        </Card>
      </section>
    </div>
  );
}
