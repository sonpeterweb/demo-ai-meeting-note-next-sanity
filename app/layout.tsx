import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: {
    template: "%s | Listenote",
    default: "Listenote — AI Meeting Notes Assistant",
  },
  description:
    "Listenote helps teams turn meeting transcripts into summaries, decisions, and action items with an AI-powered meeting notes workflow.",
  openGraph: {
    title: "Listenote — AI Meeting Notes Assistant",
    description:
      "Listenote helps teams turn meeting transcripts into summaries, decisions, and action items with an AI-powered meeting notes workflow.",
    siteName: "Listenote",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Listenote — AI meeting notes assistant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: !isProduction ? "noindex, nofollow" : "index, follow",
  manifest: "/site.webmanifest",
};

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overscroll-none",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
