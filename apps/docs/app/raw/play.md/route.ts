import { markdownResponse } from "@dualmark/core";

export const dynamic = "force-static";

const BODY = `# Dualmark Playground

> Free AI agent readiness check. Score any URL against the AEO Spec v1.0.

Paste any URL into https://dualmark.dev/play and get back a 0–125 conformance score in under 200ms. Tells you exactly which AEO checks pass and fail, with the exact response details.

## Use the API directly

\`\`\`bash
curl -X POST https://dualmark.dev/api/play/score \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://yoursite.com/your-page"}'
\`\`\`

Returns a JSON \`VerifyReport\` with score, level (Below Basic / Basic / Standard / Advanced), passed checks, and failed checks.

## Or use the CLI locally

\`\`\`bash
pnpm dlx @dualmark/cli verify https://yoursite.com/your-page
\`\`\`

Same engine, same checks, exits non-zero on failure. Drop into CI to fail builds when conformance drops.

## What's checked

13 checks across markdown twin reachability, headers, body content, HTML link advertising, and HTTP content negotiation. See https://dualmark.dev/docs/conformance/scoring for the full breakdown and weights.

## Links

- Run interactively: https://dualmark.dev/play
- API endpoint: https://dualmark.dev/api/play/score
- CLI docs: https://dualmark.dev/docs/conformance/cli
- Scoring breakdown: https://dualmark.dev/docs/conformance/scoring
`;

export function GET(): Response {
  return markdownResponse(BODY, {
    cacheControl: "public, max-age=3600",
    noindex: true,
  });
}
