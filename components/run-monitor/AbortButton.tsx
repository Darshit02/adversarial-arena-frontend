"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { AlertOctagon, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/toast";

interface AbortButtonProps {
  runId: string;
  onAbort: () => Promise<void>;
  disabled?: boolean;
}

export function AbortButton({
  runId,
  onAbort,
  disabled = false,
}: AbortButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isAborting, setIsAborting] = useState(false);

  const isConfirmed = confirmInput.trim() === runId;

  const handleConfirmAbort = async () => {
    if (!isConfirmed) return;
    setIsAborting(true);
    try {
      await onAbort();
      toast.success("Benchmark suite execution aborted");
      setModalOpen(false);
    } catch {
      toast.error("Failed to signal abort to runner");
    } finally {
      setIsAborting(false);
    }
  };

  return (
    <>
      <Button
        variant="danger"
        size="md"
        disabled={disabled}
        onClick={() => setModalOpen(true)}
        iconLeft={<AlertOctagon className="w-4 h-4 stroke-[2]" />}
      >
        Abort Benchmark Run
      </Button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Run Abort"
        description="Immediately halts all active probe threads and cancels downstream validator evaluations."
        size="md"
      >
        <div className="space-y-4 py-2">
          <div className="p-3 rounded-[8px] bg-[var(--probe-bg)] border border-[var(--probe)]/30 flex items-start gap-3 text-[12px] text-[var(--probe)]">
            <AlertTriangle className="w-4 h-4 stroke-[2] shrink-0 mt-0.5" />
            <span>
              This action cannot be undone. In-flight requests will be canceled and telemetry logged as ABORTED.
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-[13px] text-[var(--text-secondary)]">
              To confirm, type the run identifier{" "}
              <strong className="text-[var(--text-primary)] tabular-nums">
                {runId}
              </strong>{" "}
              below:
            </p>

            <Input
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder={runId}
              className="tabular-nums"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={!isConfirmed || isAborting}
              loading={isAborting}
              onClick={handleConfirmAbort}
            >
              Confirm Immediate Abort
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
