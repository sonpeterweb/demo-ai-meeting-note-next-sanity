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
  const instructions =
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
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "MeetingSummary",
          schema: {
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
          },
          strict: true,
        },
      },
      input: [
        {
          role: "system",
          content: [
            { type: "text", text: systemPrompt },
            { type: "text", text: instructions },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Here is the meeting transcript. Analyze it carefully.\n\n${transcript}`,
            },
          ],
        },
      ],
    }),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `OpenAI request failed (${response.status}): ${errorBody.slice(0, 2000)}`
    );
  }

  const data = (await response.json()) as {
    output?: Array<{
      content?: Array<{ type: string; text?: string }>;
    }>;
  };

  const jsonContent = data.output?.[0]?.content?.find(
    (entry) => entry.type === "output_text" || entry.type === "text"
  );

  if (!jsonContent?.text) {
    throw new Error("OpenAI response missing JSON content");
  }

  const parsed = JSON.parse(jsonContent.text);

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

