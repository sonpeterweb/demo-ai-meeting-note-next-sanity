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

