export type MeetingOutput = {
  summary: string;
  keyDecisions: string[];
  actionItems: string[];
};

export function formatMeetingOutput({
  summary,
  keyDecisions,
  actionItems,
}: MeetingOutput): string {
  const decisionsBlock =
    keyDecisions.length > 0
      ? keyDecisions.map((item, idx) => `${idx + 1}. ${item}`).join("\n")
      : "None captured.";

  const actionsBlock =
    actionItems.length > 0
      ? actionItems.map((item, idx) => `${idx + 1}. ${item}`).join("\n")
      : "None captured.";

  return [
    `Summary:\n${summary}`,
    `\nKey decisions:\n${decisionsBlock}`,
    `\nAction items:\n${actionsBlock}`,
  ].join("\n");
}

export function isFallbackSummaryMessage(message?: string): boolean {
  if (!message) return false;
  return /unavailable|timed out|draft|quick draft/i.test(message);
}
