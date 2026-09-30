"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from "@tanstack/react-table";
import { type RunSummary } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { RFRNumber } from "@/components/app/RFRNumber";
import { RunStatusPill } from "@/components/app/RunStatusPill";
import { formatDuration, formatRelative } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  MoreVertical,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Download,
  Eye,
  Trash2,
  Repeat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsTableProps {
  runs: RunSummary[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearSelection: () => void;
  onDeleteRun?: (id: string) => void;
}

export function ResultsTable({
  runs,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onDeleteRun,
}: ResultsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    toast.success(`Copied ${id} to clipboard`);
  };

  const handleExportJson = (run: RunSummary) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(run, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${run.run_id}_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("JSON benchmark report exported");
  };

  const columns = useMemo<ColumnDef<RunSummary>[]>(
    () => [
      // 1. Selection Checkbox
      {
        id: "select",
        header: ({ table }) => {
          const isAllSelected =
            runs.length > 0 && selectedIds.length === runs.length;
          return (
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => {
                if (e.target.checked) {
                  onSelectAll(runs.map((r) => r.run_id));
                } else {
                  onClearSelection();
                }
              }}
              className="rounded-[4px] border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] focus:ring-[var(--accent)]"
              aria-label="Select all runs"
            />
          );
        },
        cell: ({ row }) => {
          const isSelected = selectedIds.includes(row.original.run_id);
          return (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onToggleSelect(row.original.run_id);
              }}
              className="rounded-[4px] border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] focus:ring-[var(--accent)]"
              aria-label={`Select run ${row.original.run_id}`}
            />
          );
        },
        enableSorting: false,
      },

      // 2. Run ID
      {
        accessorKey: "run_id",
        header: "Run ID",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/runs/${row.original.run_id}`}
              className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)] tabular-nums transition-colors focus-ring rounded"
            >
              {row.original.run_id}
            </Link>
            <button
              type="button"
              onClick={(e) => handleCopyId(e, row.original.run_id)}
              className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Copy ID"
            >
              <Copy className="w-3.5 h-3.5 stroke-[1.75]" />
            </button>
          </div>
        ),
      },

      // 3. Probe Type
      {
        accessorKey: "probe_type",
        header: "Probe Algorithm",
        cell: ({ row }) => (
          <Badge variant="probe" className="capitalize">
            {row.original.probe_type}
          </Badge>
        ),
      },

      // 4. ModelsUnderTest Stack
      {
        id: "models",
        header: "Target Models",
        cell: ({ row }) => {
          const models = row.original.model_ids;
          const display = models.slice(0, 3);
          const extra = models.length - 3;

          return (
            <div className="flex items-center gap-1.5 flex-wrap">
              {display.map((m, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]"
                >
                  {m.replace("model_", "").replace("_", "-")}
                </span>
              ))}
              {extra > 0 && (
                <Badge variant="neutral" className="text-[10px] h-[18px]">
                  +{extra}
                </Badge>
              )}
            </div>
          );
        },
        enableSorting: false,
      },

      // 5. Validators Stack
      {
        id: "validators",
        header: "Guardrails",
        cell: ({ row }) => {
          const vals = row.original.validator_ids;
          const display = vals.slice(0, 2);
          const extra = vals.length - 2;

          return (
            <div className="flex items-center gap-1.5 flex-wrap">
              {display.map((v, idx) => (
                <Badge key={idx} variant="validator" className="text-[10px]">
                  {v.replace("val_", "").replace("_", " ")}
                </Badge>
              ))}
              {extra > 0 && (
                <Badge variant="neutral" className="text-[10px] h-[18px]">
                  +{extra}
                </Badge>
              )}
            </div>
          );
        },
        enableSorting: false,
      },

      // 6. RFR
      {
        accessorKey: "rfr",
        header: "Failure Rate",
        cell: ({ row }) => (
          <div className="text-right">
            <RFRNumber rfr={row.original.rfr} size="sm" />
          </div>
        ),
      },

      // 7. Duration
      {
        accessorKey: "duration_ms",
        header: "Duration",
        cell: ({ row }) => (
          <span className="tabular-nums text-[var(--text-muted)] text-right block">
            {formatDuration(row.original.duration_ms)}
          </span>
        ),
      },

      // 8. Status
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <RunStatusPill status={row.original.status} />,
      },

      // 9. Actions Dropdown
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const run = row.original;
          return (
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-1 rounded-[6px] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus-ring"
                    aria-label="Actions"
                  >
                    <MoreVertical className="w-4 h-4 stroke-[1.75]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    onClick={() => router.push(`/runs/${run.run_id}`)}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4 stroke-[1.75]" />
                    <span>View Detail</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleExportJson(run)}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4 stroke-[1.75]" />
                    <span>Export JSON</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => {
                      toast.success(`Cloned configuration for ${run.run_id}`);
                      router.push("/attack-lab");
                    }}
                    className="gap-2"
                  >
                    <Repeat className="w-4 h-4 stroke-[1.75]" />
                    <span>Clone Suite</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="danger"
                    onClick={() => {
                      if (onDeleteRun) onDeleteRun(run.run_id);
                      toast.success(`Deleted run ${run.run_id}`);
                    }}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.75]" />
                    <span>Delete Record</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        enableSorting: false,
      },
    ],
    [runs, selectedIds, onSelectAll, onClearSelection, onToggleSelect, onDeleteRun, router]
  );

  const table = useReactTable({
    data: runs,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* TanStack Table Container */}
      <div className="rounded-[10px] border border-[var(--border)] overflow-hidden bg-[var(--surface)]">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="h-10 bg-[var(--surface-raised)] border-b border-[var(--border)]"
                >
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const isSorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className={cn(
                          "px-4 text-left font-medium uppercase tracking-[0.03em] text-[11px] text-[var(--text-muted)] select-none",
                          canSort && "cursor-pointer hover:text-[var(--text-primary)]"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1.5">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {canSort && (
                            <span className="text-[var(--text-muted)]">
                              {isSorted === "asc" ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : isSorted === "desc" ? (
                                <ChevronDown className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-[var(--border-subtle)]">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-8 text-center text-[var(--text-muted)] italic"
                  >
                    No matching benchmark runs found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => router.push(`/runs/${row.original.run_id}`)}
                    className="h-11 transition-colors hover:bg-[var(--surface-hover)] cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-2 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-[12px] text-[var(--text-muted)] px-1">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {Math.max(1, table.getPageCount())} (
          {table.getFilteredRowModel().rows.length} total runs)
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            iconLeft={<ChevronLeft className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Previous
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            iconRight={<ChevronRight className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
