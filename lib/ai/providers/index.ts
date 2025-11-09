import type { AIProviderConfig } from "@/lib/ai/config";
import { summarizeWithOpenAI } from "./openai";

export type SummarizeArgs = {
  transcript: string;
  config: AIProviderConfig;
  signal?: AbortSignal;
};

export async function summarizeTranscript({
  transcript,
  config,
  signal,
}: SummarizeArgs) {
  switch (config.provider) {
    case "openai":
    default:
      return summarizeWithOpenAI({ transcript, config, signal });
  }
}

