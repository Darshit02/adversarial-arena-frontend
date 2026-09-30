"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type RunSummary, type ReportData } from "@/types/api";
import { RunStatusPill } from "@/components/app/RunStatusPill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown";
import { toast } from "@/components/ui/toast";
import { formatDuration, formatRelative } from "@/lib/formatters";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Copy,
  Check,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  RotateCw,
  ExternalLink,
  Shield,
  Layers,
  Cpu,
} from "lucide-react";

interface DetailHeaderProps {
  run: RunSummary;
  report?: ReportData;
}

export function DetailHeader({ run, report }: DetailHeaderProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(run.run_id);
    setCopied(true);
    toast.success(`Copied ${run.run_id} to clipboard`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const dataToExport = report || run;
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${run.run_id}-benchmark-report.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Benchmark JSON report downloaded");
  };

  const handleExportCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Run ID,Probe Type,Total Attempts,Completed,Blocked,Bypasses,RFR,Duration ms,Status,Created At"]
        .concat(
          `"${run.run_id}","${run.probe_type}",${run.total_attempts},${run.completed_attempts},${run.blocked_attempts},${run.successful_bypasses},${run.rfr},${run.duration_ms},"${run.status}","${run.created_at}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${run.run_id}-metrics.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("CSV metrics report downloaded");
  };

  const handleExportPdf = () => {
    const pdfUrl = api.getReportPdfUrl(run.run_id);
    window.open(pdfUrl, "_blank");
    toast.info("Opening benchmark PDF report...");
  };

  const handleRerun = () => {
    toast.success(`Loaded configuration from ${run.run_id}`);
    router.push("/attack-lab");
  };

  return (
    <div className="space-y-4 pb-6 border-b border-[var(--border)]">
      {/* Top backlink */}
      <div>
        <Link
          href="/runs"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-ring rounded"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.75]" />
          <span>Back to Benchmark Runs</span>
        </Link>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Run Identity */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-[28px] font-medium text-[var(--text-primary)] tracking-[-0.02em] tabular-nums">
              {run.run_id}
            </h1>

            <button
              type="button"
              onClick={handleCopyId}
              className="p-1.5 rounded-[6px] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-ring"
              title="Copy Run ID"
              aria-label="Copy Run ID"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[var(--validator)] stroke-[2]" />
              ) : (
                <Copy className="w-4 h-4 stroke-[1.75]" />
              )}
            </button>

            <RunStatusPill status={run.status} />

            <Badge variant="probe" className="capitalize">
              {run.probe_type} Probe
            </Badge>
          </div>

          {/* Subtext info */}
          <div className="flex items-center gap-3 text-[12px] text-[var(--text-secondary)] flex-wrap">
            <span>Executed {formatRelative(run.created_at)}</span>
            <span>•</span>
            <span>Duration: {formatDuration(run.duration_ms)}</span>
            <span>•</span>
            <span className="tabular-nums">
              {run.completed_attempts} of {run.total_attempts} attempts evaluated
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRerun}
            iconLeft={<RotateCw className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Re-run Suite
          </Button>

          {/* Export Report Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="primary"
                size="sm"
                iconLeft={<Download className="w-3.5 h-3.5 stroke-[1.75]" />}
              >
                Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportJson} className="gap-2.5">
                <FileJson className="w-4 h-4 stroke-[1.75] text-[var(--accent)]" />
                <span>Download JSON</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCsv} className="gap-2.5">
                <FileSpreadsheet className="w-4 h-4 stroke-[1.75] text-[var(--validator)]" />
                <span>Export as CSV</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportPdf} className="gap-2.5">
                <FileText className="w-4 h-4 stroke-[1.75] text-[var(--warning)]" />
                <span>Executive PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Target & Guardrail Pipeline Badges Row */}
      <div className="flex items-center gap-4 text-[12px] pt-1 flex-wrap">
        {/* Target Models */}
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--text-muted)] flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 stroke-[1.75]" />
            Target Models:
          </span>
          <div className="flex items-center gap-1.5">
            {run.model_ids.map((id) => (
              <span
                key={id}
                className="px-2 py-0.5 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border)] text-[11px] text-[var(--text-primary)]"
              >
                {id.replace("model_", "").replace("_", "-")}
              </span>
            ))}
          </div>
        </div>

        <span className="text-[var(--border)]">|</span>

        {/* Guardrail Chain */}
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--text-muted)] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 stroke-[1.75]" />
            Guardrails:
          </span>
          <div className="flex items-center gap-1.5">
            {run.validator_ids.map((vId) => (
              <Badge key={vId} variant="validator" className="text-[11px]">
                {vId.replace("val_", "").replace("_", " ")}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
