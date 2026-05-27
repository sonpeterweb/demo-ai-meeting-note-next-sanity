"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Copy, Download, Mail } from "lucide-react";

import { formatMeetingOutput } from "@/lib/ai/format-meeting-output";
import type { MeetingOutput } from "@/lib/ai/format-meeting-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Props = {
  result: MeetingOutput;
};

export default function AIDemoOutputActions({ result }: Props) {
  const formattedSummary = useMemo(
    () => formatMeetingOutput(result),
    [result]
  );
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("Listenote meeting summary");
    const body = encodeURIComponent(formattedSummary);
    return `mailto:?subject=${subject}&body=${body}`;
  }, [formattedSummary]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedSummary);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2500);
    } catch {
      setCopyStatus("failed");
      window.setTimeout(() => setCopyStatus("idle"), 2500);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([formattedSummary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "listenote-meeting-summary.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="h-5 w-5 text-primary" aria-hidden />
          Share &amp; reuse
        </CardTitle>
        <CardDescription>
          Copy the full summary or open your email client with everything pre-filled.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="meeting-output-preview">Copyable output</Label>
          <textarea
            id="meeting-output-preview"
            readOnly
            rows={8}
            value={formattedSummary}
            className="w-full resize-y rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono text-xs leading-relaxed text-foreground sm:text-sm"
          />
        </div>

        <p
          className="min-h-5 text-sm font-medium text-primary"
          role="status"
          aria-live="polite"
        >
          {copyStatus === "copied" && "Copied to clipboard."}
          {copyStatus === "failed" && "Copy failed — select the text above manually."}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={handleCopy}
          >
            {copyStatus === "copied" ? (
              <>
                <Check className="mr-2 h-4 w-4" aria-hidden />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" aria-hidden />
                Copy all
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" aria-hidden />
            Download .txt
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={mailtoHref}>
              <Mail className="mr-2 h-4 w-4" aria-hidden />
              Email summary
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
