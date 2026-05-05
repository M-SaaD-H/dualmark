# AEO Specification v1.0

**Status:** Draft (May 2026)
**Editors:** The Dualmark Working Group
**Repository:** https://github.com/dodopayments/dualmark

This specification defines a set of HTTP conventions for serving content to AI agents (LLM-powered search engines, training crawlers, and user-action retrieval bots) alongside conventional HTML for human browsers.

The specification is **independent of any framework**. Anyone can implement it in any language. The reference implementation is the [`@dualmark/*`](../packages) packages.

## 1. Scope

This specification defines:

1. HTTP content negotiation between text/html and text/markdown
2. A required header set (`Content-Type`, `X-Markdown-Tokens`, `X-Robots-Tag`, `Vary`)
3. A discovery mechanism via the `Link rel="alternate"` header
4. An AI agent registry (canonical UA patterns + vendor mapping)
5. Conformance testing levels and a public test suite

This specification does NOT define:

- HTML structure or semantics
- Markdown dialect or extensions (use CommonMark or GitHub-Flavored Markdown)
- AI-specific schemas (JSON-LD, llms.txt are addressed in [extensions](./llms-txt-extensions.md))
- Authentication, rate limiting, or business logic

## 2. Terminology

The keywords MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

- **AI Agent**: an automated client identifying as one of the User-Agent patterns listed in [§5: AI Agent Registry](./ai-bot-detection.md), or a client sending an `Accept` header that prefers `text/markdown`.
- **Markdown Twin**: the markdown representation of an HTML page. By convention, served at `<url>.md` (e.g. `/blog/hello.md` for `/blog/hello`).
- **Conformant Server**: a server that implements §3 (content negotiation) + §4 (response headers) + §6 (discovery) at the Basic conformance level (see [conformance.md](./conformance.md)).

## 3. Content Negotiation

See [content-negotiation.md](./content-negotiation.md).

A conformant server:

- **MUST** honor `Accept: text/markdown` by serving the markdown twin
- **MUST** honor `Accept: text/html` (and the implicit default) by serving HTML
- **MUST** set `Vary: Accept` on any response whose representation depends on the `Accept` header
- **SHOULD** return `406 Not Acceptable` if neither `text/html` nor `text/markdown` (nor a wildcard) is acceptable
- **MAY** also serve markdown when the `User-Agent` matches an entry in the [AI Agent Registry](./ai-bot-detection.md)

## 4. Required Response Headers

See [headers.md](./headers.md).

On every markdown twin response (including `4xx` markdown error pages), a conformant server:

- **MUST** set `Content-Type: text/markdown; charset=utf-8`
- **MUST** set `X-Markdown-Tokens: <integer>` with an estimated token count of the body
- **MUST** set `X-Robots-Tag` to a value containing `noindex` to prevent duplicate indexing
- **MUST** set `Vary: Accept`
- **SHOULD** set `X-Content-Type-Options: nosniff`
- **SHOULD** set `X-AEO-Version: 1.0` to advertise the implemented spec version

## 5. AI Agent Registry

See [ai-bot-detection.md](./ai-bot-detection.md).

The registry is normative for purposes of detection but extensible by implementations. The registry SHOULD be considered a living document; a conformant server MAY maintain its own extensions.

## 6. Discovery

See [discovery.md](./discovery.md).

A conformant server:

- **MUST** advertise the markdown twin via `Link: <url.md>; rel="alternate"; type="text/markdown"` on every HTML response that has a markdown twin
- **MAY** publish an `llms.txt` file at the root path describing the site's AI-relevant content
- **MAY** include `.md` URLs in `sitemap.xml`

## 7. Conformance

See [conformance.md](./conformance.md).

Three levels are defined: Basic, Standard, Advanced. The reference test runner is [`@dualmark/cli`](../packages/cli) — `dualmark verify <url>`.

## 8. Security Considerations

- The `noindex` directive prevents AI-friendly markdown twins from being indexed as duplicate pages by traditional search engines.
- Content negotiation introduces no new attack surface beyond standard HTTP. Caches that key on URL alone (without honoring `Vary: Accept`) MAY serve the wrong representation; a conformant server MUST set `Vary: Accept`.
- The `X-Markdown-Tokens` value is informational and MUST NOT be relied upon for billing or authorization.

## 9. IANA Considerations

This specification reserves no media types. `text/markdown` is registered in [RFC 7763](https://www.rfc-editor.org/rfc/rfc7763).

## 10. Versioning & Stability

This is **AEO Spec v1.0**. Future revisions follow semver:

- Patch (1.0.x) — clarifications, errata
- Minor (1.x.0) — backward-compatible additions
- Major (x.0.0) — breaking changes

Implementations advertise their target version via `X-AEO-Version`.

## 11. References

- [RFC 7231 §5.3.2: HTTP Content Negotiation](https://www.rfc-editor.org/rfc/rfc7231#section-5.3.2)
- [RFC 7232: HTTP Conditional Requests](https://www.rfc-editor.org/rfc/rfc7232)
- [RFC 7763: text/markdown media type](https://www.rfc-editor.org/rfc/rfc7763)
- [RFC 8288: Web Linking](https://www.rfc-editor.org/rfc/rfc8288)
- [llms.txt proposal](https://llmstxt.org)
