export type BotPurpose = "training" | "search" | "user-action" | "unknown";

export interface AIBotEntry {
  name: string;
  uaPattern: string | RegExp;
  vendor: string;
  purpose: BotPurpose;
  docsUrl?: string;
}

export interface AIBotInfo {
  isBot: boolean;
  name: string | null;
  vendor: string | null;
  purpose: BotPurpose | null;
}

export const AI_BOTS: ReadonlyArray<AIBotEntry> = [
  {
    name: "GPTBot",
    uaPattern: "GPTBot",
    vendor: "OpenAI",
    purpose: "training",
    docsUrl: "https://platform.openai.com/docs/gptbot",
  },
  {
    name: "ChatGPT-User",
    uaPattern: "ChatGPT-User",
    vendor: "OpenAI",
    purpose: "user-action",
    docsUrl: "https://platform.openai.com/docs/bots",
  },
  {
    name: "OAI-SearchBot",
    uaPattern: "OAI-SearchBot",
    vendor: "OpenAI",
    purpose: "search",
    docsUrl: "https://platform.openai.com/docs/bots",
  },
  {
    name: "ClaudeBot",
    uaPattern: "ClaudeBot",
    vendor: "Anthropic",
    purpose: "training",
    docsUrl: "https://support.anthropic.com/en/articles/8896518",
  },
  {
    name: "Anthropic-ai",
    uaPattern: "Anthropic-ai",
    vendor: "Anthropic",
    purpose: "training",
  },
  {
    name: "Claude-Web",
    uaPattern: "Claude-Web",
    vendor: "Anthropic",
    purpose: "user-action",
  },
  {
    name: "Claude-SearchBot",
    uaPattern: "Claude-SearchBot",
    vendor: "Anthropic",
    purpose: "search",
    docsUrl: "https://support.anthropic.com/en/articles/8896518",
  },
  {
    name: "Claude-User",
    uaPattern: "Claude-User",
    vendor: "Anthropic",
    purpose: "user-action",
    docsUrl: "https://support.anthropic.com/en/articles/8896518",
  },
  {
    name: "PerplexityBot",
    uaPattern: "PerplexityBot",
    vendor: "Perplexity",
    purpose: "search",
    docsUrl: "https://docs.perplexity.ai/guides/bots",
  },
  {
    name: "Perplexity-User",
    uaPattern: "Perplexity-User",
    vendor: "Perplexity",
    purpose: "user-action",
    docsUrl: "https://docs.perplexity.ai/guides/bots",
  },
  {
    name: "Google-Extended",
    uaPattern: "Google-Extended",
    vendor: "Google",
    purpose: "training",
    docsUrl: "https://developers.google.com/search/docs/crawling-indexing/google-extended",
  },
  {
    name: "Applebot-Extended",
    uaPattern: "Applebot-Extended",
    vendor: "Apple",
    purpose: "training",
    docsUrl: "https://support.apple.com/en-us/119829",
  },
  {
    name: "cohere-ai",
    uaPattern: "cohere-ai",
    vendor: "Cohere",
    purpose: "training",
  },
  {
    name: "CCBot",
    uaPattern: "CCBot",
    vendor: "Common Crawl",
    purpose: "training",
    docsUrl: "https://commoncrawl.org/ccbot",
  },
  {
    name: "Bytespider",
    uaPattern: "Bytespider",
    vendor: "ByteDance",
    purpose: "training",
  },
  {
    name: "DeepSeekBot",
    uaPattern: "DeepSeekBot",
    vendor: "DeepSeek",
    purpose: "training",
  },
  {
    name: "Amazonbot",
    uaPattern: "Amazonbot",
    vendor: "Amazon",
    purpose: "training",
    docsUrl: "https://developer.amazon.com/amazonbot",
  },
  {
    name: "YouBot",
    uaPattern: "YouBot",
    vendor: "You.com",
    purpose: "search",
  },
  {
    name: "Diffbot",
    uaPattern: "Diffbot",
    vendor: "Diffbot",
    purpose: "training",
  },
  {
    name: "ImagesiftBot",
    uaPattern: "ImagesiftBot",
    vendor: "ImageSift",
    purpose: "training",
  },
  {
    name: "Omgilibot",
    uaPattern: "Omgilibot",
    vendor: "Webz.io",
    purpose: "training",
  },
  {
    name: "DuckAssistBot",
    uaPattern: "DuckAssistBot",
    vendor: "DuckDuckGo",
    purpose: "search",
  },
  {
    name: "Meta-ExternalAgent",
    uaPattern: "meta-externalagent",
    vendor: "Meta",
    purpose: "training",
  },
  {
    name: "Meta-ExternalFetcher",
    uaPattern: "meta-externalfetcher",
    vendor: "Meta",
    purpose: "training",
  },
];

function matches(ua: string, pattern: string | RegExp): boolean {
  if (typeof pattern === "string") {
    return ua.toLowerCase().includes(pattern.toLowerCase());
  }
  return pattern.test(ua);
}

export function detectAIBot(userAgent: string): AIBotInfo {
  if (!userAgent) {
    return { isBot: false, name: null, vendor: null, purpose: null };
  }
  for (const entry of AI_BOTS) {
    if (matches(userAgent, entry.uaPattern)) {
      return {
        isBot: true,
        name: entry.name,
        vendor: entry.vendor,
        purpose: entry.purpose,
      };
    }
  }
  return { isBot: false, name: null, vendor: null, purpose: null };
}
