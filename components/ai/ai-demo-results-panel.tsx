"use client";

import {
  CheckCircle2,
  ClipboardList,
  FileText,
  Sparkles,
} from "lucide-react";

import type { SummarizeFormState } from "@/app/(main)/ai-demo/form-utils";
import { isFallbackSummaryMessage } from "@/lib/ai/format-meeting-output";
import AIDemoOutputActions from "@/components/ai/ai-demo-output-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SummarizeResult = NonNullable<SummarizeFormState["result"]>;

type Props = {
  result: SummarizeResult;
  message?: SummarizeFormState["message"];
};

export default function AIDemoResultsPanel({ result, message }: Props) {
  const { summary, keyDecisions, actionItems } = result;
  const isDraft = isFallbackSummaryMessage(message);
  const isSample = Boolean(message?.includes("sample summary"));

  return (
    <section
      className="space-y-6"
      aria-label="Meeting insights"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Your meeting notes</h2>
        <div className="flex flex-wrap gap-2">
          {isDraft && (
            <Badge variant="secondary">Draft summary (fallback)</Badge>
          )}
          {isSample && (
            <Badge variant="outline">Sample preview</Badge>
          )}
          {!isDraft && !isSample && (
            <Badge className="gap-1">
              <Sparkles className="h-3 w-3" aria-hidden />
              AI generated
            </Badge>
          )}
        </div>
      </div>

      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" aria-hidden />
            Summary
          </CardTitle>
          <CardDescription>High-level recap of what happened</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground md:text-base">
            {summary}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden />
              Key decisions
            </CardTitle>
            <CardDescription>Commitments and go/no-go calls</CardDescription>
          </CardHeader>
          <CardContent>
            {keyDecisions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No explicit decisions captured. Mention agreements or approvals in
                the transcript for better results.
              </p>
            ) : (
              <ul className="space-y-2">
                {keyDecisions.map((decision, index) => (
                  <li
                    key={`decision-${index}`}
                    className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-sm leading-relaxed"
                  >
                    {decision}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5 text-primary" aria-hidden />
              Action items
            </CardTitle>
            <CardDescription>Next steps with clear owners when possible</CardDescription>
          </CardHeader>
          <CardContent>
            {actionItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No action items identified. Use bullet lists or phrases like
                &quot;follow up&quot; and &quot;assign&quot; in the transcript.
              </p>
            ) : (
              <ul className="space-y-2">
                {actionItems.map((item, index) => (
                  <li
                    key={`action-${index}`}
                    className="flex gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-sm leading-relaxed"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <AIDemoOutputActions result={result} />
    </section>
  );
}
