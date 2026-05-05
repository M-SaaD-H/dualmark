import type { Metadata } from "next";
import { PlaygroundClient } from "./playground-client";

export const metadata: Metadata = {
  title: "Score your site",
  description:
    "Free AI agent readiness score. Paste any URL, get a 0–125 conformance score against the AEO Spec v1.0. See exactly what to fix to be cited by ChatGPT, Claude, and Perplexity.",
  alternates: { canonical: "/play" },
  openGraph: {
    title: "Is your site AI-ready? — Dualmark Playground",
    description:
      "Free AI agent readiness check. Get a 0–125 score against the AEO Spec in under 200ms.",
    url: "/play",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is your site AI-ready?",
    description:
      "Free AI agent readiness check. Get a 0–125 score against the AEO Spec.",
  },
};

export default function PlayPage() {
  return <PlaygroundClient />;
}
