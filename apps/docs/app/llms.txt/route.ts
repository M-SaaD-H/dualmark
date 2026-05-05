import { renderLlmsTxt, type LlmsTxtSection } from "@dualmark/core";
import { source } from "@/lib/source";

export const dynamic = "force-static";

const SITE_URL = "https://dualmark.dev";

const SECTION_LABELS: Record<string, string> = {
  integrations: "Integrate",
  packages: "API reference",
  conformance: "Conformance",
  spec: "AEO Spec v1.0",
};

const ROOT_SECTION = "Get started";

interface PageLike {
  url: string;
  data: { title?: string; description?: string };
  slugs: string[];
}

export function GET(): Response {
  const grouped = new Map<string, LlmsTxtSection["links"]>();

  for (const page of source.getPages() as PageLike[]) {
    const sectionKey = page.slugs[0] ?? "";
    const isFolder = page.slugs.length > 1;
    const sectionTitle = isFolder
      ? (SECTION_LABELS[sectionKey] ?? sectionKey)
      : ROOT_SECTION;

    if (!grouped.has(sectionTitle)) grouped.set(sectionTitle, []);

    grouped.get(sectionTitle)!.push({
      title: page.data.title ?? page.slugs.join("/"),
      href: `${SITE_URL}${page.url}.md`,
      description: page.data.description,
    });
  }

  const sectionOrder = ["Get started", "Integrate", "API reference", "Conformance", "AEO Spec v1.0"];
  const sections: LlmsTxtSection[] = sectionOrder
    .filter((key) => grouped.has(key))
    .map((title) => ({
      title,
      links: grouped.get(title)!,
    }));

  sections.unshift({
    title: "Optional",
    links: [
      { title: "Playground", href: `${SITE_URL}/play`, description: "Score any URL against the AEO Spec" },
      { title: "GitHub", href: "https://github.com/dodopayments/dualmark", description: "Source code" },
      { title: "AEO Spec source", href: `${SITE_URL}/docs/spec/overview`, description: "Public, RFC-2119 compliant" },
    ],
  });

  const body = renderLlmsTxt({
    brandName: "Dualmark",
    description:
      "Open-source AEO infrastructure for marketing sites. Every page has a markdown twin at the same URL with .md appended. Picked by HTTP content negotiation. Drop into Astro, Next.js, or Cloudflare in 30 seconds.",
    sections,
  });

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "X-AEO-Version": "1.0",
    },
  });
}
