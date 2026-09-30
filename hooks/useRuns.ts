import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  type ProbeRegistryItem,
  type ModelUnderTest,
  type Validator,
  type SubmitRunInput,
  type SubmitRunResponse,
  type RunSummary,
  type ProbeAttempt,
  type PaginatedResponse,
} from "@/types/api";

// Fallback Mock Probe Registry
export const mockProbeRegistry: ProbeRegistryItem[] = [
  {
    id: "pair",
    type: "pair",
    name: "Prompt Automatic Iterative Refinement (PAIR)",
    description: "Iterative two-player semantic probe algorithm exploring jailbreak trajectories in few queries.",
    paper_reference: "Chao et al., arXiv:2310.08419",
    requires_whitebox: false,
    param_schemas: {
      iterations: {
        type: "number",
        description: "Maximum iterative refinement turns per prompt",
        default: 5,
        min: 1,
        max: 20,
        step: 1,
      },
      n_streams: {
        type: "number",
        description: "Concurrent parallel probe exploration branches",
        default: 3,
        min: 1,
        max: 10,
        step: 1,
      },
      temperature: {
        type: "number",
        description: "Sampling entropy for perturbation candidate generation",
        default: 0.7,
        min: 0.1,
        max: 1.5,
        step: 0.05,
      },
      judge_threshold: {
        type: "number",
        description: "Confidence cutoff to flag successful bypass vector",
        default: 0.85,
        min: 0.5,
        max: 1.0,
        step: 0.05,
      },
    },
  },
  {
    id: "multiround",
    type: "multiround",
    name: "Multi-Round Crescendo Probe",
    description: "Conversational multi-turn probe that introduces adversarial concepts incrementally.",
    paper_reference: "Microsoft Research, 2024",
    requires_whitebox: false,
    param_schemas: {
      max_turns: {
        type: "number",
        description: "Maximum dialog depth per conversation",
        default: 6,
        min: 2,
        max: 15,
        step: 1,
      },
      escalation_rate: {
        type: "enum",
        description: "Rate of semantic complexity increase",
        default: "linear",
        options: ["gentle", "linear", "aggressive"],
      },
      backtrack_on_refusal: {
        type: "boolean",
        description: "Attempt branch rewinding when guardrail flags a turn",
        default: true,
      },
    },
  },
  {
    id: "autodan",
    type: "autodan",
    name: "AutoDAN Hierarchical Genetic Search",
    description: "Gradient-free semantic token mutation optimizing stealth and bypass likelihood.",
    paper_reference: "Liu et al., arXiv:2310.04451",
    requires_whitebox: false,
    param_schemas: {
      population_size: {
        type: "number",
        description: "Number of candidate adversarial prefixes per generation",
        default: 20,
        min: 5,
        max: 100,
        step: 5,
      },
      generations: {
        type: "number",
        description: "Evolutionary mutation epochs",
        default: 10,
        min: 1,
        max: 50,
        step: 1,
      },
      crossover_rate: {
        type: "number",
        description: "Probability of prompt recombination",
        default: 0.6,
        min: 0.1,
        max: 1.0,
        step: 0.1,
      },
    },
  },
  {
    id: "gcg",
    type: "gcg",
    name: "Greedy Coordinate Gradient (GCG)",
    description: "White-box token optimization computing exact gradient projections on vocabulary embeddings.",
    paper_reference: "Zou et al., arXiv:2307.15043",
    requires_whitebox: true,
    param_schemas: {
      suffix_length: {
        type: "number",
        description: "Length of optimized adversarial token sequence",
        default: 20,
        min: 5,
        max: 50,
        step: 1,
      },
      batch_size: {
        type: "number",
        description: "Number of top-k coordinate substitutions per step",
        default: 128,
        min: 16,
        max: 512,
        step: 16,
      },
      loss_threshold: {
        type: "number",
        description: "Early-stopping target cross-entropy loss",
        default: 0.1,
        min: 0.01,
        max: 0.5,
        step: 0.01,
      },
    },
  },
];

// Fallback Mock ModelsUnderTest
export const mockModels: ModelUnderTest[] = [
  {
    id: "model_gpt4o_mini",
    name: "gpt-4o-mini",
    provider: "openai",
    base_url: "https://api.openai.com/v1",
    model_identifier: "gpt-4o-mini",
    is_active: true,
    status: "online",
    latency_ms: 240,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "model_llama3_8b",
    name: "llama3:8b",
    provider: "ollama",
    base_url: "http://localhost:11434",
    model_identifier: "llama3:8b",
    is_active: true,
    status: "online",
    latency_ms: 180,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "model_claude35",
    name: "claude-3-5-sonnet",
    provider: "anthropic",
    base_url: "https://api.anthropic.com/v1",
    model_identifier: "claude-3-5-sonnet-20240620",
    is_active: true,
    status: "online",
    latency_ms: 320,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

// Fallback Mock Validators
export const mockValidators: Validator[] = [
  {
    id: "val_keyword_filter",
    name: "Keyword Filter",
    type: "keyword_filter",
    description: "Sub-millisecond static token and regex matching against banned primitives.",
    is_enabled: true,
    config: { sensitivity: "high" },
    created_at: new Date().toISOString(),
  },
  {
    id: "val_llm_judge",
    name: "LLM-as-Judge Guardrail",
    type: "llm_judge",
    description: "Evaluates intent, subversion tactics, and harmful utility before model execution.",
    is_enabled: true,
    config: { judge_model: "gpt-4o-mini", threshold: 0.8 },
    created_at: new Date().toISOString(),
  },
  {
    id: "val_cot_defender",
    name: "CoT Defender",
    type: "cot_defender",
    description: "Deep multi-step reasoning trace verification detecting obfuscated deception.",
    is_enabled: false,
    config: { max_depth: 3 },
    created_at: new Date().toISOString(),
  },
];

export function useProbeRegistry() {
  return useQuery<ProbeRegistryItem[]>({
    queryKey: ["probes", "registry"],
    queryFn: async () => {
      try {
        const res = await api.getProbeRegistry();
        return res && res.length > 0 ? res : mockProbeRegistry;
      } catch {
        return mockProbeRegistry;
      }
    },
    staleTime: 60000,
  });
}

export function useModels() {
  return useQuery<ModelUnderTest[]>({
    queryKey: ["models"],
    queryFn: async () => {
      try {
        const res = await api.getModels();
        return res && res.length > 0 ? res : mockModels;
      } catch {
        return mockModels;
      }
    },
    staleTime: 30000,
  });
}

export function useValidators() {
  return useQuery<Validator[]>({
    queryKey: ["validators"],
    queryFn: async () => {
      try {
        const res = await api.getValidators();
        return res && res.length > 0 ? res : mockValidators;
      } catch {
        return mockValidators;
      }
    },
    staleTime: 30000,
  });
}

export function useSubmitRun() {
  const queryClient = useQueryClient();

  return useMutation<SubmitRunResponse, Error, SubmitRunInput>({
    mutationFn: async (input: SubmitRunInput) => {
      try {
        return await api.submitRun(input);
      } catch {
        // Fallback for offline demo mode: generate realistic run_id
        const randomHex = Math.random().toString(16).substring(2, 10);
        return {
          run_id: `run_${randomHex}`,
          status: "ACCEPTED",
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}
