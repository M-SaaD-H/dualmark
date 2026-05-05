# @dualmark/cli

`dualmark verify <url>` — conformance test runner for the AEO Specification.

## Install

```bash
pnpm add -D @dualmark/cli
# or run directly:
pnpm dlx @dualmark/cli verify https://example.com/blog/hello
```

## Usage

```bash
dualmark verify https://example.com/blog/hello
dualmark verify https://example.com/blog/hello.md --skip-negotiation
dualmark verify https://example.com --json
dualmark verify https://example.com --timeout 5000
```

### Flags

| Flag | Effect |
|---|---|
| `--json` | Emit machine-readable JSON instead of human-readable text |
| `--skip-negotiation` | Skip Accept-header / Link-header / 406 checks. Use against sites that serve markdown only at `.md` URLs without runtime content negotiation (e.g. static-only deploys) |
| `--timeout <ms>` | Per-request timeout (default 10000) |

### Exit codes

- `0` — pass (score ≥ 80% of max)
- `1` — fail (below threshold)
- `2` — CLI usage error

## Programmatic usage

```ts
import { verifyUrl } from "@dualmark/cli";
const report = await verifyUrl("https://example.com/blog/hello");
console.log(report.score, "/", report.maxScore);
```

## What's checked

- `md.fetch` — markdown twin URL is reachable (2xx)
- `md.contentType` — `text/markdown; charset=utf-8`
- `md.tokensHeader` — `X-Markdown-Tokens` is a positive integer
- `md.noindex` — `X-Robots-Tag` includes `noindex`
- `md.vary` — `Vary` includes `Accept`
- `md.body` — body is non-empty
- `md.aeoVersion` — `X-AEO-Version` advertised (recommended)
- `md.nosniff` — `X-Content-Type-Options: nosniff` (recommended)

When negotiation is enabled (default):

- `html.reachable` — HTML URL is 2xx
- `html.linkAlternate` — HTML response advertises markdown twin via `Link rel="alternate"`
- `html.vary` — HTML response `Vary: Accept` (recommended)
- `negotiation.botUa` — GPTBot UA receives markdown
- `negotiation.acceptHeader` — `Accept: text/markdown` receives markdown
- `negotiation.notAcceptable` — Accept that excludes html+markdown returns `406` (recommended)

## License

MIT
