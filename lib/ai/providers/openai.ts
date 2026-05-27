import type { AIProviderConfig } from "@/lib/ai/config";

type SummarizeResponse = {
  summary: string;
  keyDecisions: string[];
  actionItems: string[];
};

const DEFAULT_SYSTEM_PROMPT =
  "You are Listenote, an AI assistant that reads meeting transcripts and produces concise summaries, key decisions, and action items.";

const DEFAULT_RESPONSE_INSTRUCTIONS =
  "Return valid JSON with the shape { summary: string, keyDecisions: string[], actionItems: string[] }. Provide concise bullet items.";

const MEETING_SUMMARY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    keyDecisions: {
      type: "array",
      items: { type: "string" },
    },
    actionItems: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["summary", "keyDecisions", "actionItems"],
} as const;

type OpenAIResponsesPayload = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

function extractResponseText(data: OpenAIResponsesPayload): string | undefined {
  if (typeof data.output_text === "string" && data.output_text.length > 0) {
    return data.output_text;
  }

  for (const item of data.output ?? []) {
    if (item.type !== "message") {
      continue;
    }
    for (const part of item.content ?? []) {
      if (
        (part.type === "output_text" || part.type === "text") &&
        part.text
      ) {
        return part.text;
      }
    }
  }

  return undefined;
}

export async function summarizeWithOpenAI({
  transcript,
  config,
  signal,
}: {
  transcript: string;
  config: AIProviderConfig;
  signal?: AbortSignal;
}): Promise<SummarizeResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const baseUrl = process.env.OPENAI_API_BASE ?? "https://api.openai.com/v1";

  const systemPrompt = config.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  const outputInstructions =
    config.postProcessingInstructions || DEFAULT_RESPONSE_INSTRUCTIONS;

  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      temperature: config.temperature,
      max_output_tokens: config.maxTokens,
      instructions: `${systemPrompt}\n\n${outputInstructions}`,
      text: {
        format: {
          type: "json_schema",
          name: "MeetingSummary",
          strict: true,
          schema: MEETING_SUMMARY_SCHEMA,
        },
      },
      input: `Here is the meeting transcript. Analyze it carefully.\n\n${transcript}`,
    }),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `OpenAI request failed (${response.status}): ${errorBody.slice(0, 2000)}`
    );
  }

  const data = (await response.json()) as OpenAIResponsesPayload;
  const responseText = extractResponseText(data);

  if (!responseText) {
    throw new Error("OpenAI response missing JSON content");
  }

  const parsed = JSON.parse(responseText) as Partial<SummarizeResponse>;

  return {
    summary: parsed.summary ?? "",
    keyDecisions: Array.isArray(parsed.keyDecisions)
      ? parsed.keyDecisions
      : [],
    actionItems: Array.isArray(parsed.actionItems)
      ? parsed.actionItems
      : [],
  };
}

