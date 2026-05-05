import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "edge";
export const alt = "Dualmark Playground — score any URL against the AEO Spec";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Playground",
    title: "Is your site AI-ready?",
    description:
      "Free AI agent readiness check. Get a 0–125 score against the AEO Spec in under 200ms.",
    footer: "$ dualmark verify <url>",
  });
}
