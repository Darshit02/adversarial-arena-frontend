"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type ProbeAttempt } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  X,
  Copy,
  Check,
  Flag,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Coins,
  Cpu,
  CornerDownRight,
} from "lucide-react";

interface ProbeDrawerProps {
  attempt: ProbeAttempt | null;
  onClose: () => void;
}

export function ProbeDrawer({ attempt, onClose }: ProbeDrawerProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);

  if (!attempt) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(attempt.prompt);
    setCopiedPrompt(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyResponse = () => {
    if (attempt.response) {
      navigator.clipboard.writeText(attempt.response);
      setCopiedResponse(true);
      toast.success("Model response copied to clipboard");
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const handleFlagFalsePositive = () => {
    setIsFlagged(true);
    toast.success(`Flagged ${attempt.attempt_id} as false positive`, {
      description: "Validator training dataset updated with this feedback.",
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Slide-over panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.25 }}
          className="relative w-full max-w-xl bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl h-full flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[15px] text-[var(--text-primary)] tabular-nums">
                  {attempt.attempt_id}
                </span>
                {attempt.is_robustness_failure ? (
                  <Badge variant="probe" className="gap-1">
                    <ShieldAlert className="w-3 h-3 stroke-[2]" />
                    Bypass / Failure
                  </Badge>
                ) : (
                  <Badge variant="validator" className="gap-1">
                    <ShieldCheck className="w-3 h-3 stroke-[2]" />
                    Neutralized
                  </Badge>
                )}
              </div>
              <p className="text-[12px] text-[var(--text-secondary)]">
                Probe instance detail & guardrail evaluation trace
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[6px] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-ring"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>

          {/* Body Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Metadata Pills */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[12px]">
              <div className="space-y-1">
                <span className="text-[var(--text-muted)] text-[11px] flex items-center gap-1">
                  <Cpu className="w-3 h-3 stroke-[1.75]" /> MUT
                </span>
                <p className="font-medium text-[var(--text-primary)]">
                  {attempt.model_name}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[var(--text-muted)] text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 stroke-[1.75]" /> Latency
                </span>
                <p className="font-medium text-[var(--text-primary)] tabular-nums">
                  {attempt.latency_ms} ms
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[var(--text-muted)] text-[11px] flex items-center gap-1">
                  <Coins className="w-3 h-3 stroke-[1.75]" /> Tokens
                </span>
                <p className="font-medium text-[var(--text-primary)] tabular-nums">
                  {attempt.tokens_used ?? "—"}
                </p>
              </div>
            </div>

            {/* 1. Full Probe Prompt */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.03em]">
                  Adversarial Probe Payload
                </label>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-ring rounded p-1 transition-colors"
                >
                  {copiedPrompt ? (
                    <Check className="w-3.5 h-3.5 text-[var(--validator)]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedPrompt ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="p-3.5 rounded-[8px] bg-[var(--bg-base)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] leading-[1.55] select-text">
                {attempt.prompt}
              </div>
            </div>

            {/* 2. Validator Reasoning Trace */}
            <div className="space-y-3">
              <label className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.03em] flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5 text-[var(--accent)]" />
                Validator Evaluation Chain
              </label>

              <div className="space-y-2.5">
                {attempt.validator_results.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border)] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-[var(--text-primary)]">
                          {res.validator_name}
                        </span>
                        {res.passed ? (
                          <Badge variant="validator" className="text-[10px] py-0 px-1.5">
                            Permitted
                          </Badge>
                        ) : (
                          <Badge variant="probe" className="text-[10px] py-0 px-1.5">
                            Blocked
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
                        {res.latency_ms} ms
                      </span>
                    </div>

                    {res.reasoning && (
                      <p className="text-[12px] text-[var(--text-secondary)] bg-[var(--bg-base)] p-2 rounded-[6px] border border-[var(--border-subtle)]">
                        {res.reasoning}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Model Response (if reached) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.03em]">
                  Model Response
                </label>
                {attempt.response && (
                  <button
                    type="button"
                    onClick={handleCopyResponse}
                    className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-ring rounded p-1 transition-colors"
                  >
                    {copiedResponse ? (
                      <Check className="w-3.5 h-3.5 text-[var(--validator)]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedResponse ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>

              {attempt.response ? (
                <div className="p-3.5 rounded-[8px] bg-[var(--bg-base)] border border-[var(--border)] text-[13px] text-[var(--text-primary)] leading-[1.55] select-text">
                  {attempt.response}
                </div>
              ) : (
                <div className="p-3.5 rounded-[8px] bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[12px] text-[var(--text-muted)] italic">
                  No response generated. Adversarial payload was intercepted prior to model execution.
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleFlagFalsePositive}
              disabled={isFlagged}
              iconLeft={<Flag className="w-3.5 h-3.5 stroke-[1.75]" />}
            >
              {isFlagged ? "Flagged as False Positive" : "Flag False Positive"}
            </Button>

            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
