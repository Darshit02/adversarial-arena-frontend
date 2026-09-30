"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/components/ui/toast";
import { formatRelative } from "@/lib/formatters";
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Globe,
  Radio,
  Send,
  Lock,
  Sparkles,
} from "lucide-react";

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  created_at: string;
  last_used?: string;
  scopes: string[];
}

const initialKeys: ApiKeyItem[] = [
  {
    id: "key_01",
    name: "GitHub Actions CI Pipeline",
    prefix: "aa_live_9b2e7c4f",
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    last_used: new Date(Date.now() - 3600000 * 3).toISOString(),
    scopes: ["runs:write", "reports:read"],
  },
  {
    id: "key_02",
    name: "Internal Model Registry Webhook",
    prefix: "aa_live_1d4a8e2c",
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
    last_used: new Date(Date.now() - 86400000 * 2).toISOString(),
    scopes: ["models:read", "runs:read"],
  },
];

export default function ApiKeysSettingsPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>(initialKeys);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Webhook settings state
  const [webhookUrl, setWebhookUrl] = useState("https://ci.my-org.internal/hooks/adversarial-arena");
  const [webhookSecret, setWebhookSecret] = useState("whsec_984f1b2c3d4e5a6f");
  const [pinging, setPinging] = useState(false);

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Please provide a name for the API key");
      return;
    }

    const randomSecret = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const fullKey = `aa_live_${randomSecret}`;

    const newKeyItem: ApiKeyItem = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      prefix: `aa_live_${randomSecret.slice(0, 8)}`,
      created_at: new Date().toISOString(),
      scopes: ["runs:write", "models:read", "reports:read"],
    };

    setKeys([newKeyItem, ...keys]);
    setGeneratedKey(fullKey);
  };

  const handleCopyNewKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopiedKey(true);
      toast.success("API key copied to clipboard");
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleRevokeKey = (id: string, name: string) => {
    setKeys(keys.filter((k) => k.id !== id));
    toast.success(`Revoked API key "${name}"`);
  };

  const handleTestWebhookPing = () => {
    setPinging(true);
    setTimeout(() => {
      setPinging(false);
      toast.success("Test payload delivered successfully (HTTP 200 OK)");
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* 1. API Keys Section */}
      <div className="p-6 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
              Programmatic API Keys
            </h2>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Authenticate automated CI/CD security regression workflows and scheduled audits
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setNewKeyName("");
              setGeneratedKey(null);
              setCreateModalOpen(true);
            }}
            iconLeft={<Plus className="w-4 h-4 stroke-[1.75]" />}
          >
            Generate New Key
          </Button>
        </div>

        {/* Keys Table */}
        <div className="rounded-[8px] border border-[var(--border)] overflow-hidden">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="h-10 bg-[var(--surface-raised)] border-b border-[var(--border)] text-[11px] font-medium uppercase tracking-[0.03em] text-[var(--text-muted)]">
                <th className="px-4 text-left">Key Name</th>
                <th className="px-4 text-left">Token Prefix</th>
                <th className="px-4 text-left">Scopes</th>
                <th className="px-4 text-left">Last Used</th>
                <th className="px-4 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {keys.map((k) => (
                <tr
                  key={k.id}
                  className="h-12 hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <td className="px-4 py-2 font-medium text-[var(--text-primary)]">
                    {k.name}
                  </td>
                  <td className="px-4 py-2 font-mono text-[var(--text-secondary)] text-[12px]">
                    {k.prefix}••••••••
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {k.scopes.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-[12px] text-[var(--text-muted)]">
                    {k.last_used ? formatRelative(k.last_used) : "Never used"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleRevokeKey(k.id, k.name)}
                      className="p-1.5 rounded hover:bg-[var(--probe-bg)] text-[var(--text-muted)] hover:text-[var(--probe)] transition-colors focus-ring"
                      title="Revoke Key"
                      aria-label="Revoke Key"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.75]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Webhooks Section */}
      <div className="p-6 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] card-highlight space-y-6">
        <div>
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)]">
            Outbound Webhook Alerts
          </h2>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Receive automated POST events when benchmark runs complete or when bypass spikes are detected
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              Webhook Endpoint URL
            </label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              iconLeft={<Globe className="w-4 h-4 stroke-[1.75]" />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[var(--text-secondary)]">
              Signing Secret
            </label>
            <Input
              value={webhookSecret}
              type="password"
              disabled
              iconLeft={<Lock className="w-4 h-4 stroke-[1.75]" />}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-[11px] text-[var(--text-muted)]">
            Subscribed to: <code className="text-[var(--text-primary)]">run.completed</code>, <code className="text-[var(--text-primary)]">rfr.spike_detected</code>
          </span>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleTestWebhookPing}
            loading={pinging}
            iconLeft={<Send className="w-3.5 h-3.5 stroke-[1.75]" />}
          >
            Send Test Ping
          </Button>
        </div>
      </div>

      {/* Generate Key Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={generatedKey ? "API Key Created" : "Generate Programmatic API Key"}
        description={
          generatedKey
            ? "Copy this key immediately. For security, it will never be displayed again."
            : "Create a dedicated credential token for automated CI/CD runners."
        }
        size="md"
      >
        <div className="space-y-4 pt-1">
          {!generatedKey ? (
            <>
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-[var(--text-secondary)]">
                  Key Name / Client Identifier
                </label>
                <Input
                  placeholder="e.g. Nightly Robustness Benchmarker"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  iconLeft={<Key className="w-4 h-4 stroke-[1.75]" />}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGenerateKey}
                  iconLeft={<Sparkles className="w-4 h-4 stroke-[1.75]" />}
                >
                  Create Token
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-[8px] bg-[var(--bg-base)] border border-[var(--border)] font-mono text-[12px] text-[var(--accent)] break-all select-all flex items-center justify-between gap-3">
                <span>{generatedKey}</span>
                <button
                  type="button"
                  onClick={handleCopyNewKey}
                  className="p-1.5 rounded hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shrink-0"
                  title="Copy Key"
                >
                  {copiedKey ? (
                    <Check className="w-4 h-4 text-[var(--validator)]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="p-3 rounded-[8px] bg-[var(--warning-bg)] border border-[var(--warning)]/30 text-[11px] text-[var(--warning)]">
                Store this key in your secrets manager or GitHub Actions repository secrets.
              </div>

              <div className="flex justify-end pt-3 border-t border-[var(--border)]">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCreateModalOpen(false)}
                >
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
