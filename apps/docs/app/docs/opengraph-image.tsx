import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "edge";
export const alt = "Dualmark Documentation";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Documentation",
    title: "Build your AEO infrastructure in 30 seconds.",
    description:
      "Quickstarts, integrations, packages, conformance, and the public AEO Spec.",
  });
}
