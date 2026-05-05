# Dualmark

> The AEO infrastructure your marketing site is missing.

Your blog ranks #1 on Google. ChatGPT cites your competitor.

That's not a content problem. It's an **infrastructure problem**. AI search engines (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews) read the web differently from humans — they want clean markdown without nav chrome, JavaScript, or cookie banners. Most marketing sites give them HTML soup and wonder why they get ignored.

**Dualmark gives every page a markdown twin.** Same URL. Two formats. Picked by HTTP content negotiation. Drop it into your Astro/Next.js/Cloudflare stack in 30 seconds. Score it with `dualmark verify`.

```diff
- pnpm add @next-seo/some-meta-tag-thing
+ pnpm add @dualmark/astro
```

[Quickstart](#quickstart) · [Why](#why-marketing-teams-need-this) · [Examples](./examples) · [Spec](./spec) · [Docs](https://dualmark.dev)

---

## Quickstart

### Astro (30 seconds)

```bash
pnpm add @dualmark/astro
```

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import dualmark from "@dualmark/astro";

export default defineConfig({
  site: "https://yourcompany.com",
  integrations: [
    dualmark({
      siteUrl: "https://yourcompany.com",
      collections: {
        blog: { converter: "blog" },           // /blog/*.md auto-generated
        glossary: { converter: "glossary" },   // /glossary/*.md auto-generated
      },
      llmsTxt: { enabled: true },              // /llms.txt auto-generated
    }),
  ],
});
```

```bash
pnpm build && pnpm dualmark verify https://localhost:4321/blog/your-post
# → Score 80/80 ✓
```

That's it. Every blog post has a markdown twin at `/blog/<slug>.md`. `llms.txt` is generated. Every HTML response advertises its twin via `Link: <…>; rel="alternate"; type="text/markdown"`. ChatGPT crawler sees clean markdown. Your existing pages don't change.

### Cloudflare Workers (60 seconds)

Wrap your existing Worker. AI bots get markdown at the edge — single-digit-ms first-byte from 300+ cities.

```ts
import { createAEOWorker } from "@dualmark/cloudflare";
import upstream from "./your-existing-worker.js";

export default createAEOWorker({
  upstream,
  trailingSlash: "never",
  analytics: { binding: "AI_AGENT_ANALYTICS" },  // optional: track which bot, what page
});
```

[Full example with `wrangler dev` → 125/125 conformance score →](./examples/astro-cloudflare-full)

### Next.js 15 App Router

No adapter package needed — `@dualmark/core` plugs into middleware + a route handler.

```ts
// middleware.ts
import { detectAIBot, negotiateFormat } from "@dualmark/core";
// ...full middleware in examples/nextjs-app-router
```

[Full Next.js example →](./examples/nextjs-app-router)

---

## Why marketing teams need this

You already invested in SEO. Now invest in AEO — for **a fraction of the effort**.

| Problem | Without Dualmark | With Dualmark |
|---|---|---|
| **AI cites competitors instead of you** | Bots scrape your HTML, get nav menus + JS errors, pick the cleaner source | Same URL serves clean markdown to bots, polished HTML to humans |
| **No way to know if you're discoverable** | "We hope ChatGPT can read this" | `dualmark verify` returns a 0–125 score with line-item failures |
| **`llms.txt` proposal keeps changing** | Hand-maintained, drifts from sitemap | Auto-generated from the same config that drives your routes |
| **Every team rebuilds this** | Custom middleware in every repo, none of them quite right | One battle-tested package, conforms to a public spec |
| **No analytics for AI traffic** | "Was that a bot or a human?" | `onAIRequest` hook + Cloudflare Analytics Engine integration: bot name, vendor, page, tokens, country |
| **Slow to roll out across pages** | Marketing waits weeks for engineering | Add `converter: "compare"` to a collection — done. 12 converters bundled. |

**Built and battle-tested at [Dodo Payments](https://dodopayments.com)** for our own marketing site. Now extracted as OSS so you don't have to write the same content negotiation, bot detection, and edge wrapping over and over.

---

## What you actually ship

```
yourcompany.com/pricing             ← human visitors get this
yourcompany.com/pricing.md          ← AI agents get this
yourcompany.com/llms.txt            ← AI agents discover everything
```

Same URL. Same content. Different rendering. Picked automatically by:
- `Accept: text/markdown` header → markdown
- Known AI bot User-Agent (GPTBot, ClaudeBot, PerplexityBot, +16 more) → markdown
- Direct `.md` URL → markdown
- Anything else → HTML, with `Link rel="alternate"` pointing to the twin

No duplicate content penalties (markdown twin sets `X-Robots-Tag: noindex`). No JS framework rewrites. No content team retraining. **Your existing pages stay the same.**

---

## Built-in converters (`@dualmark/converters`)

Drop-in markdown generation for the 12 page types every marketing site has:

| Converter | What it's for | Marketing examples |
|---|---|---|
| `blog` | Long-form posts | Engineering blog, customer stories |
| `glossary` | Term definitions | "What is a payment gateway?" |
| `compare` | Us vs. competitor | "Stripe alternative" pages |
| `case-study` | Customer wins | Logos with stats |
| `legal` | Policy pages | Terms, Privacy, DPA |
| `tool` | Standalone calculators | "Currency converter" |
| `video` | Video landing pages | Webinar replays |
| `tax` | Tax pSEO | "Tax for SaaS in Germany" |
| `country` | Country pSEO | "Payments in India" |
| `currency` | Currency pSEO | "Accept INR online" |
| `payment-method` | Method pSEO | "Accept UPI" |
| `product` | Product pages | Product overview + FAQ |

Each converter takes your collection entry → returns clean markdown with the right structure for AI consumption (title, description, breadcrumbs, FAQ extraction, related links). No prompt engineering required.

```ts
import { compareConverter } from "@dualmark/converters";

const convert = compareConverter({
  siteUrl: "https://yourcompany.com",
  basePath: "/compare",
});

const md = convert(yourComparePage);  // → battle-tested markdown layout
```

---

## Verify any site against the spec

```bash
npx @dualmark/cli verify https://yourcompany.com/pricing
```

```
Dualmark Conformance Report
URL:         https://yourcompany.com/pricing
Markdown:    https://yourcompany.com/pricing.md
Score:       125/125
Duration:    107ms

Passed:
  [+20] md.fetch         — Markdown twin URL is reachable
  [+10] md.contentType   — Content-Type is text/markdown; charset=utf-8
  [+10] md.tokensHeader  — X-Markdown-Tokens header is present
  [+10] md.noindex       — X-Robots-Tag includes noindex
  [+10] md.vary          — Vary header includes Accept
  [+10] md.body          — Body is non-empty markdown
  [+10] html.linkAlternate — HTML response advertises markdown twin
  [+10] negotiation.botUa — GPTBot UA receives text/markdown
  [+10] negotiation.acceptHeader — Accept: text/markdown receives text/markdown
  ...
```

Three conformance levels — **Basic** (60%), **Standard** (80%), **Advanced** (95%). Drop the score in your CI to prevent regressions.

```yaml
# .github/workflows/ci.yml
- run: npx @dualmark/cli verify https://staging.yourcompany.com/pricing
  # exits non-zero if any required check fails
```

---

## What's in the box

| Package | npm | Size | What it does |
|---|---|---|---|
| [`@dualmark/core`](./packages/core) | `npm i @dualmark/core` | 14 KB | Framework-agnostic primitives: content negotiation (RFC 7231), AI-bot detection (19 known bots), markdown response builder, token estimation, composition helpers, `llms.txt` rendering. Zero runtime deps. |
| [`@dualmark/converters`](./packages/converters) | `npm i @dualmark/converters` | 16 KB | 12 production-tested converter factories. |
| [`@dualmark/astro`](./packages/astro) | `npm i @dualmark/astro` | 22 KB | Astro 5 integration. Auto-generates `.md` endpoints, ships middleware, generates `llms.txt`. |
| [`@dualmark/cloudflare`](./packages/cloudflare) | `npm i @dualmark/cloudflare` | 9 KB | Workers edge adapter. Wraps any upstream Worker. Hooks for analytics + telemetry. |
| [`@dualmark/cli`](./packages/cli) | `npm i -g @dualmark/cli` | 16 KB | `dualmark verify <url>`. Programmatic API too. |

Plus:

- [**`spec/`**](./spec) — the **AEO Specification v1.0**. Public, framework-agnostic, RFC-2119-compliant. Implement it in Go, Rust, PHP, Ruby — your call.
- [**`apps/docs/`**](./apps/docs) — Fumadocs site at [dualmark.dev](https://dualmark.dev)
- [**`apps/playground/`**](./apps/playground) — paste an Accept header + UA, see how it negotiates. Live in your browser.
- [**`examples/`**](./examples) — three end-to-end working examples (Astro, Astro+Cloudflare, Next.js).

---

## End-to-end verified

| Surface | Status |
|---|---|
| `@dualmark/core` | 156 tests pass (vitest + fast-check property tests) |
| `@dualmark/converters` | 19 tests pass |
| `@dualmark/cloudflare` | 23 tests pass |
| `@dualmark/cli` | 15 tests pass |
| `@dualmark/astro` | 35 tests pass |
| `examples/astro-blog` | **80/80** under `astro dev` (`--skip-negotiation`) |
| `examples/astro-cloudflare-full` | **125/125 perfect** under `wrangler dev` (full negotiation) |
| `examples/nextjs-app-router` | **120/125** under `next dev` |
| `apps/docs` | 26 routes prerendered, all serve 200 |
| `apps/playground` | Vite build clean, all interactive elements render |

```bash
pnpm install
pnpm build && pnpm test && pnpm typecheck   # 248 tests across 5 packages
```

---

## Where it goes from here

We're building toward Dualmark being **the** AEO infrastructure for marketing sites — the same way Tailwind became the default for marketing CSS or Vercel for marketing hosting. The roadmap:

- **More framework adapters**: SvelteKit, Remix/React Router, Nuxt, dedicated `@dualmark/nextjs`
- **More edge adapters**: Vercel, Netlify, Fastly Compute, Deno Deploy
- **More converters**: pricing tables, changelog, docs/API reference, status pages, integrations
- **AEO Analytics**: a hosted dashboard on top of the `onAIRequest` hook, so marketing can see which bot reads which page, when
- **Spec evolution toward AEO 1.1+** with structured data hints, per-section markdown anchors, and sitemap.md
- **CMS integrations**: Sanity, Contentful, Builder.io plugins so non-engineers can author dual-marked content

If you're a marketing engineer reading this and any of those would land in your stack, [open an issue](https://github.com/dodopayments/dualmark/issues) or [+1 an existing one](https://github.com/dodopayments/dualmark/issues).

---

## Contributing

We're early. Issues, PRs, and "I tried it on $framework and it broke" reports are all welcome.

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for the dev loop and release flow.
- The AEO Spec is authoritative — if you implement it elsewhere (in any language), we want to link to your implementation.

```bash
pnpm install
pnpm build   # turbo-orchestrated build
pnpm test    # vitest across all packages
pnpm typecheck
```

## License

MIT — see [LICENSE](./LICENSE). Use it for anything. Attribution appreciated, never required.

## Status

**Pre-1.0.** APIs may change in patch releases until 1.0. The AEO Spec v1.0 is authoritative; framework code follows. Production-ready for early adopters; we're [running it on dodopayments.com](https://dodopayments.com).
