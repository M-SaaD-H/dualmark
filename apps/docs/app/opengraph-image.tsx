import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "edge";
export const alt = "Dualmark — AEO infrastructure for marketing sites";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Open source · Apache 2.0",
    title: "The AEO infrastructure your marketing site is missing.",
    description:
      "Your blog ranks #1 on Google. ChatGPT cites your competitor. Give every page a markdown twin AI agents can read.",
    footer: "$ bunx @dualmark/cli verify",
  });
}
