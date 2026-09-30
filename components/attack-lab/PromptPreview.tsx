"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useAttackConfig } from "@/hooks/useAttackConfig";
import { Button } from "@/components/ui/button";
import { Edit3, Check, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] w-full bg-[var(--surface)] border border-[var(--border)] rounded-[8px] flex items-center justify-center text-[12px] text-[var(--text-muted)] animate-pulse">
      Loading seed prompt editor...
    </div>
  ),
});

export function PromptPreview() {
  const { seedPrompts, setSeedPrompts } = useAttackConfig();
  const [isEditable, setIsEditable] = useState(false);

  const handleEditorMount = (_editor: any, monaco: any) => {
    // Define custom Arena Dark theme matching our palette
    monaco.editor.defineTheme("arena-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6B6E78", fontStyle: "italic" },
        { token: "keyword", foreground: "7C7FE8" },
        { token: "string", foreground: "7FB88E" },
        { token: "number", foreground: "D4A574" },
      ],
      colors: {
        "editor.background": "#15161B",
        "editor.foreground": "#EDEDF0",
        "editorLineNumber.foreground": "#4A4D57",
        "editorLineNumber.activeForeground": "#A8ABB5",
        "editor.lineHighlightBackground": "#1D1F26",
        "editor.selectionBackground": "#4A4C8A40",
        "editorCursor.foreground": "#7C7FE8",
      },
    });
    monaco.editor.setTheme("arena-dark");
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[var(--accent)] stroke-[1.75]" />
          <span className="font-semibold text-[14px] text-[var(--text-primary)]">
            Seed Prompts & Trajectory Templates
          </span>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsEditable(!isEditable)}
          iconLeft={
            isEditable ? (
              <Check className="w-3.5 h-3.5 stroke-[2] text-[var(--validator)]" />
            ) : (
              <Edit3 className="w-3.5 h-3.5 stroke-[1.75]" />
            )
          }
        >
          {isEditable ? "Done Editing" : "Edit seed prompts"}
        </Button>
      </div>

      <div className="rounded-[8px] overflow-hidden border border-[var(--border)]">
        <Editor
          height="280px"
          language="markdown"
          value={seedPrompts}
          onChange={(val) => setSeedPrompts(val || "")}
          onMount={handleEditorMount}
          theme="arena-dark"
          options={{
            readOnly: !isEditable,
            minimap: { enabled: false },
            fontSize: 12,
            fontFamily: "var(--font-inter), system-ui, sans-serif",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            renderLineHighlight: isEditable ? "all" : "none",
            overviewRulerBorder: false,
            folding: false,
          }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
        <span>
          {isEditable ? "Editing enabled" : "Read-only mode (click edit to modify seed prompts)"}
        </span>
        <span className="tabular-nums">
          {seedPrompts.split("\n").filter(Boolean).length} prompts loaded
        </span>
      </div>
    </Card>
  );
}
