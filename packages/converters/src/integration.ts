import { cleanBody, normalizeUnicode } from "@dualmark/core";
import type { BaseConverterConfig, CollectionEntry, Converter } from "./types.js";

export interface IntegrationConverterConfig extends BaseConverterConfig {
  basePath: string;
}

export interface IntegrationEntryData {
  title: string;
  vendor: string;
  categories: string[];
  description: string;
  capabilities: string[];
  setupSteps?: string[];
  pricing?: string;
  requirements?: string[];
}

function resolveIntegrationHeading(
  entry: CollectionEntry<IntegrationEntryData>,
  data: IntegrationEntryData,
): string {
  const fromTitle = typeof data.title === "string" ? data.title.trim() : "";
  if (fromTitle !== "") return fromTitle;

  const fromVendor = typeof data.vendor === "string" ? data.vendor.trim() : "";
  if (fromVendor !== "") return fromVendor;

  return entry.id;
}

export function integrationConverter(
  config: IntegrationConverterConfig,
): Converter<CollectionEntry<IntegrationEntryData>> {
  const { basePath, siteUrl, brandFooter } = config;
  return (entry) => {
    const d = entry.data;
    const parts: string[] = [`# ${resolveIntegrationHeading(entry, d)}`];

    parts.push(`\n- **URL**: ${siteUrl}${basePath}/${entry.id}`);
    parts.push(`- **Vendor**: ${d.vendor}`);
    if (d.categories.length > 0) {
      parts.push(`- **Categories**: ${d.categories.join(", ")}`);
    }

    if (d.description) {
      parts.push(`\n> ${d.description}`);
    }

    if (d.capabilities.length > 0) {
      parts.push(`\n## Capabilities\n\n${d.capabilities.map((c) => `- ${c}`).join("\n")}`);
    }

    if (d.setupSteps && d.setupSteps.length > 0) {
      parts.push(`\n## Setup\n\n${d.setupSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`);
    }

    if (d.pricing) {
      parts.push(`\n## Pricing\n\n${d.pricing}`);
    }

    if (d.requirements && d.requirements.length > 0) {
      parts.push(`\n## Requirements\n\n${d.requirements.map((r) => `- ${r}`).join("\n")}`);
    }

    if (entry.body) {
      parts.push(`\n---\n\n${cleanBody(entry.body)}`);
    }

    if (brandFooter) {
      parts.push(`\n---\n${brandFooter}`);
    }

    return normalizeUnicode(parts.join("\n"));
  };
}
