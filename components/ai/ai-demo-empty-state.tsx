import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  hasSamples: boolean;
  onTrySample?: () => void;
  onFocusForm?: () => void;
};

export default function AIDemoEmptyState({
  hasSamples,
  onTrySample,
  onFocusForm,
}: Props) {
  return (
    <Card className="border-dashed border-primary/30 bg-muted/20">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" aria-hidden />
          <CardTitle className="text-xl">How this demo works</CardTitle>
        </div>
        <CardDescription className="text-base leading-relaxed">
          Paste a messy meeting transcript and Listenote turns it into a clean
          summary, key decisions, and action items you can copy or email to your
          team.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ol className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <li className="flex gap-2 rounded-lg border bg-background/80 p-3">
            <span className="font-semibold text-foreground">1.</span>
            <span>Load a sample or paste your own transcript (200+ characters).</span>
          </li>
          <li className="flex gap-2 rounded-lg border bg-background/80 p-3">
            <span className="font-semibold text-foreground">2.</span>
            <span>Generate insights — AI when configured, or a smart draft fallback.</span>
          </li>
          <li className="flex gap-2 rounded-lg border bg-background/80 p-3">
            <span className="font-semibold text-foreground">3.</span>
            <span>Copy, download, or email the structured output.</span>
          </li>
        </ol>

        <div className="flex flex-col gap-2 sm:flex-row">
          {hasSamples && onTrySample && (
            <Button type="button" className="w-full sm:w-auto" onClick={onTrySample}>
              Try a sample transcript
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
          )}
          {onFocusForm && (
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onFocusForm}
            >
              Paste your transcript
            </Button>
          )}
        </div>

        <div
          className="rounded-xl border bg-background p-4 shadow-sm"
          aria-label="Example output preview"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Example output
          </p>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-medium text-foreground">Summary</p>
                <p className="text-muted-foreground">
                  Team aligned on the onboarding timeline, flagged mobile QA risks,
                  and agreed on follow-ups before launch.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-medium text-foreground">Key decisions</p>
                <p className="text-muted-foreground">
                  Proceed with the revamp; mobile release waits on regression results.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-medium text-foreground">Action items</p>
                <p className="text-muted-foreground">
                  Design delivers mockups Tuesday · Mobile runs regression · PM
                  updates release comms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
