import { cache } from "react";
import { fetchAIDemoConfig } from "@/sanity/lib/fetch";

export type AIProviderConfig = {
  provider: "openai";
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt?: string | null;
  postProcessingInstructions?: string | null;
};

export const getAIDemoConfig = cache(async (): Promise<AIProviderConfig> => {
  const envProvider = process.env.AI_DEMO_PROVIDER || "openai";
  const envModel = process.env.AI_DEMO_MODEL || "gpt-4o-mini";
  const envMaxTokens = Number(process.env.AI_DEMO_MAX_TOKENS ?? 1200);
  const envTemperature = Number(process.env.AI_DEMO_TEMPERATURE ?? 0.7);

  const config = await fetchAIDemoConfig();

  return {
    provider: envProvider as AIProviderConfig["provider"],
    model: config?.model ?? envModel,
    maxTokens: config?.maxTokens ?? envMaxTokens,
    temperature: config?.temperature ?? envTemperature,
    systemPrompt: config?.systemPrompt,
    postProcessingInstructions: config?.postProcessingInstructions,
  };
});
type SupportedProvider = "openai";

function assertValue(value: string | undefined, key: string) {
  if (!value) {
    throw new Error(
      `Missing environment variable: ${key}. See README "AI Provider Setup".`
    );
  }
  return value;
}

const provider = (process.env.AI_PROVIDER || "openai") as SupportedProvider;

export const AI_CONFIG = {
  provider,
  openai:
    provider === "openai"
      ? {
          apiKey: assertValue(process.env.OPENAI_API_KEY, "OPENAI_API_KEY"),
          model: process.env.OPENAI_API_MODEL || "gpt-4o-mini",
          baseURL: process.env.OPENAI_API_BASE_URL,
        }
      : undefined,
} as const;

export type OpenAIConfig = NonNullable<typeof AI_CONFIG["openai"]>;

