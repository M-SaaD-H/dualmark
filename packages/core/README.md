# @dualmark/core

Framework-agnostic primitives for AEO (Answer Engine Optimization) infrastructure.

Zero runtime dependencies. ESM + CJS. Strict TypeScript.

## Install

```bash
pnpm add @dualmark/core
```

## What's in it

- **Content negotiation** (`parseAcceptHeader`, `negotiateFormat`) — RFC 7231 §5.3.2 compliant
- **AI bot detection** (`detectAIBot`, `AI_BOTS`) — registry of 19 known crawlers with vendor + purpose metadata
- **Markdown response** (`markdownResponse`, `injectMarkdownAlternateLink`) — builds `Response` objects with all AEO headers
- **Path utilities** (`toMarkdownPath`, `toMarkdownUrl`) — convert HTML paths/URLs to their markdown twins
- **Token estimation** (`estimateTokens`) — default is whitespace-split
- **Text utilities** (`normalizeUnicode`, `cleanBody`, `slugToTitle`, `fmtDate`, `joinLines`) — for writing markdown converters
- **Composition helpers** (`listingToMarkdown`, `renderRelatedLinks`, `renderFAQSection`)
- **llms.txt rendering** (`renderLlmsTxt`)

## Quick example

```ts
import { negotiateFormat, markdownResponse, detectAIBot } from "@dualmark/core";

export default {
  async fetch(request) {
    const accept = request.headers.get("accept") ?? "";
    const ua = request.headers.get("user-agent") ?? "";
    const bot = detectAIBot(ua);
    const fmt = negotiateFormat(accept);

    if (fmt === null) return new Response("Not Acceptable", { status: 406 });

    if (bot.isBot || fmt === "markdown") {
      return markdownResponse("# Hello\n\nThis is the markdown twin.");
    }

    return new Response("<html><body>Hello</body></html>", {
      headers: { "Content-Type": "text/html" },
    });
  },
};
```

## License

MIT — see [LICENSE](../../LICENSE).

## Spec

This package implements the [AEO Specification v1.0](../../spec/README.md).
