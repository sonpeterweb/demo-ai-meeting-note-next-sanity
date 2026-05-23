import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  onRetry: () => void;
  disabled: boolean;
  isRetrying: boolean;
};

export default function AIDemoErrorPanel({ onRetry, disabled, isRetrying }: Props) {
  return (
    <Card className="border-destructive/40 bg-destructive/10">
      <CardContent className="flex flex-col gap-4 py-6">
        <div className="flex items-start gap-3 text-destructive">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              We couldn&apos;t process that transcript
            </p>
            <p className="text-sm text-muted-foreground">
              Check your connection, try a shorter excerpt, or load a demo sample.
              If the AI provider is offline, the demo can still produce a draft
              summary on retry.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={onRetry}
            disabled={disabled}
          >
            {isRetrying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                Retrying…
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
                Try again
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Need at least 200 characters, or select a sample to run instantly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
