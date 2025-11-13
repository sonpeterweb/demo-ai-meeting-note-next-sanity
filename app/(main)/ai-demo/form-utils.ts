import { z } from "zod";

export const FORM_SCHEMA = z.object({
  transcript: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, "Please provide a meeting transcript."),
  sampleId: z
    .string()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
});

export type SummarizeFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: {
    transcript?: string;
    sampleId?: string;
    general?: string;
  };
  result?: {
    summary: string;
    keyDecisions: string[];
    actionItems: string[];
  };
};

export const INITIAL_FORM_STATE: SummarizeFormState = {
  status: "idle",
  errors: {},
};

export const parseTranscriptForm = (formData: FormData) =>
  FORM_SCHEMA.safeParse({
    transcript: formData.get("transcript"),
    sampleId: formData.get("sampleId"),
  });

export function synthesizeFromTranscript(transcript: string) {
  const sentences = transcript
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const summary = sentences.slice(0, 3).join(" ").slice(0, 600);

  const actionItems = transcript
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.startsWith("-") ||
        line.startsWith("*") ||
        /action item/i.test(line) ||
        /(todo|follow up|assign)/i.test(line)
    )
    .map((line) => line.replace(/^[-*]\s*/, ""))
    .slice(0, 5);

  const keyDecisions = sentences
    .filter((sentence) => /(decided|agreed|approved|will proceed)/i.test(sentence))
    .slice(0, 3);

  return {
    summary:
      summary.length > 0
        ? summary
        : transcript.slice(0, 600) || "Summary is unavailable for this transcript.",
    keyDecisions,
    actionItems,
  };
}

