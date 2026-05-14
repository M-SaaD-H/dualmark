import { describe, it, expect } from "vitest";
import { detectAIBot, AI_BOTS } from "../src/bots.js";

function uaPatternOk(pattern: string, name: string, vendor: string): boolean {
  if (pattern.includes("-")) return true; // hyphen: namespaced id
  const p = pattern.toLowerCase();
  if (vendor.toLowerCase().split(/[^a-z0-9]+/).some((t) => t.length >= 3 && p.includes(t))) return true; // vendor substring (≥3 alnum)
  const c = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return c(pattern) === c(name); // same identity as bot name
}

describe("detectAIBot", () => {
  it("returns isBot=false for empty UA", () => {
    expect(detectAIBot("")).toEqual({ isBot: false, name: null, vendor: null, purpose: null });
  });

  it("returns isBot=false for typical browser UA", () => {
    const chrome =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
    expect(detectAIBot(chrome).isBot).toBe(false);
  });

  it("detects GPTBot", () => {
    const r = detectAIBot("Mozilla/5.0 GPTBot/1.0");
    expect(r).toMatchObject({ isBot: true, name: "GPTBot", vendor: "OpenAI", purpose: "training" });
  });

  it("detects ClaudeBot", () => {
    const r = detectAIBot("ClaudeBot/1.0 (+http://anthropic.com)");
    expect(r).toMatchObject({ isBot: true, name: "ClaudeBot", vendor: "Anthropic" });
  });

  it("detects PerplexityBot", () => {
    expect(detectAIBot("PerplexityBot/1.0").vendor).toBe("Perplexity");
  });

  it("detects Google-Extended", () => {
    expect(detectAIBot("Mozilla/5.0 (compatible; Google-Extended/1.0)").name).toBe("Google-Extended");
  });

  it("is case-insensitive on UA matching strings", () => {
    expect(detectAIBot("gptbot/1.0").isBot).toBe(true);
  });

  it("returns first matching bot when UA contains multiple substrings", () => {
    const r = detectAIBot("ChatGPT-User and GPTBot");
    expect(["ChatGPT-User", "GPTBot"]).toContain(r.name);
  });

  it("includes Meta-ExternalAgent (case-insensitive)", () => {
    expect(detectAIBot("meta-externalagent/1.0").vendor).toBe("Meta");
  });

  it("detects DeepSeekBot", () => {
    const r = detectAIBot("Mozilla/5.0 (compatible; DeepSeekBot/1.0; +https://www.deepseek.com/bot)");
    expect(r).toMatchObject({ isBot: true, name: "DeepSeekBot", vendor: "DeepSeek", purpose: "training" });
  });

  it("detects Claude-SearchBot", () => {
    const r = detectAIBot("Mozilla/5.0 (compatible; Claude-SearchBot/1.0; searchbot@anthropic.com)");
    expect(r).toMatchObject({ isBot: true, name: "Claude-SearchBot", vendor: "Anthropic" });
  });

  it("detects Claude-User", () => {
    const r = detectAIBot("Mozilla/5.0 (compatible; Claude-User/1.0)");
    expect(r).toMatchObject({ isBot: true, name: "Claude-User", vendor: "Anthropic" });
  });

  it("detects Meta-ExternalFetcher (vendor-namespaced token, case-insensitive)", () => {
    expect(detectAIBot("Mozilla/5.0 (compatible; Meta-ExternalFetcher/1.0)").name).toBe("Meta-ExternalFetcher");
    expect(detectAIBot("meta-externalfetcher/1.0").name).toBe("Meta-ExternalFetcher");
  });

  it("does not falsely match generic ExternalFetcher UAs", () => {
    expect(detectAIBot("Mozilla/5.0 SomeBrand-ExternalFetcher/2.0").isBot).toBe(false);
    expect(detectAIBot("Mozilla/5.0 (compatible; MyExternalFetcher/1.0)").isBot).toBe(false);
    expect(detectAIBot("Bot ExternalFetcher v3").isBot).toBe(false);
  });

  it("detects Perplexity-User", () => {
    expect(detectAIBot("Mozilla/5.0 (compatible; Perplexity-User/1.0)").name).toBe("Perplexity-User");
  });

  it("AI_BOTS uaPattern invariant: hyphen, vendor token (≥3), or collapsed name", () => {
    for (const b of AI_BOTS) {
      if (typeof b.uaPattern !== "string") continue;
      expect(uaPatternOk(b.uaPattern, b.name, b.vendor), `${b.name}: ${JSON.stringify(b.uaPattern)}`).toBe(true);
    }
    expect(uaPatternOk("ExternalFetcher", "Meta-ExternalFetcher", "Meta")).toBe(false);
  });

  it("AI_BOTS export has unique names", () => {
    const names = AI_BOTS.map((b) => b.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("every bot entry has required fields", () => {
    for (const b of AI_BOTS) {
      expect(b.name).toBeTruthy();
      expect(b.vendor).toBeTruthy();
      expect(b.uaPattern).toBeTruthy();
      expect(["training", "search", "user-action", "unknown"]).toContain(b.purpose);
    }
  });
});
