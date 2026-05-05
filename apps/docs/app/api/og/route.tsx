import { renderOgImage } from "@/lib/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Dualmark";
  const description = searchParams.get("description") ?? undefined;
  const eyebrow = searchParams.get("eyebrow") ?? undefined;
  const footer = searchParams.get("footer") ?? undefined;

  const response = renderOgImage({ title, description, eyebrow, footer });
  response.headers.set(
    "cache-control",
    "public, max-age=31536000, s-maxage=31536000, immutable",
  );
  return response;
}
