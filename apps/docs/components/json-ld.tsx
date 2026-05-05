interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE_URL = "https://dualmark.dev";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}#organization`,
  name: "Dualmark",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description:
    "Your blog ranks #1 on Google. ChatGPT cites your competitor. Dualmark is open-source AEO infrastructure that gives every page a markdown twin AI agents can read.",
  sameAs: ["https://github.com/dodopayments/dualmark"],
  foundingDate: "2026",
  parentOrganization: {
    "@type": "Organization",
    name: "Dodo Payments",
    url: "https://dodopayments.com",
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  url: SITE_URL,
  name: "Dualmark",
  description: "AEO infrastructure for marketing sites",
  publisher: { "@id": `${SITE_URL}#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/docs?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}#software`,
  name: "Dualmark",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Cross-platform (Node.js, Cloudflare Workers, Edge)",
  description:
    "Framework-agnostic AEO infrastructure. Serves a markdown twin of every HTML page via HTTP content negotiation.",
  url: SITE_URL,
  downloadUrl: "https://www.npmjs.com/package/@dualmark/core",
  softwareVersion: "0.x",
  license: "https://www.apache.org/licenses/LICENSE-2.0",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@id": `${SITE_URL}#organization` },
  programmingLanguage: "TypeScript",
  codeRepository: "https://github.com/dodopayments/dualmark",
};

export function techArticleSchema(input: {
  title: string;
  description: string;
  url: string;
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: input.title,
    description: input.description,
    url: `${SITE_URL}${input.url}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${input.url}` },
    isPartOf: { "@id": `${SITE_URL}#website` },
    publisher: { "@id": `${SITE_URL}#organization` },
    author: { "@id": `${SITE_URL}#organization` },
    inLanguage: "en",
    articleSection: input.section,
    proficiencyLevel: "Beginner",
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
