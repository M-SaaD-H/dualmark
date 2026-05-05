import { Section, SectionHeader } from "./section";

const HTML_PREVIEW = `<!doctype html>
<html lang="en">
<head>
  <title>Pricing — YourCo</title>
  <link rel="stylesheet" href="/_app/main.css" />
  <script type="module" src="/_app/main.js"></script>
</head>
<body>
  <nav class="navbar">…</nav>
  <div id="cookie-banner">…</div>
  <main>
    <h1>Pricing</h1>
    <div class="pricing-table">
      <!-- React renders 80 KB of tier cards here -->
    </div>
  </main>
  <footer>…</footer>
</body>
</html>`;

const MD_PREVIEW = `# Pricing

> Plans, features, and limits. Compare tiers and pick the right
> level of usage for your team.

## Tiers

### Starter — Free
- Up to 1,000 API calls / month
- Community support
- All core features

### Pro — $49 / month
- 100,000 API calls / month
- Email support, 24h SLA
- Webhooks, audit logs

### Enterprise — Contact us
- Unlimited usage
- Dedicated support, custom SLA
- SAML SSO, SOC 2 reports`;

export function Transform() {
  return (
    <Section id="transform">
      <SectionHeader
        eyebrow="How it works"
        title={
          <>
            Same URL.{" "}
            <span className="text-[var(--color-accent)]">Two formats.</span>{" "}
            AI agents see the markdown.
          </>
        }
        description="Browsers get the page you already ship. AI agents get clean markdown — no JS, no nav, no cookie banner. Picked at the edge by HTTP content negotiation, no duplicate URLs."
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-2">
        <ResponseCard
          tone="neutral"
          eyebrow="To browsers"
          method="GET"
          url="/pricing"
          accept="text/html,*/*"
          contentType="text/html; charset=utf-8"
          bodyLabel="HTML response"
          body={HTML_PREVIEW}
          language="html"
        />
        <ResponseCard
          tone="accent"
          eyebrow="To AI agents"
          method="GET"
          url="/pricing"
          accept="text/markdown"
          contentType="text/markdown; charset=utf-8"
          bodyLabel="Markdown response"
          body={MD_PREVIEW}
          language="md"
        />
      </div>

      <p className="mx-auto mt-10 max-w-3xl text-pretty text-center text-sm text-[var(--color-fg-muted)]">
        Same URL. Same content. Different rendering. Picked by{" "}
        <code className="rounded bg-[var(--color-bg-elev-2)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-fg)]">
          Accept
        </code>{" "}
        header for known clients and by User-Agent for the 19 most-common AI
        crawlers (GPTBot, ClaudeBot, PerplexityBot, +16 more).
      </p>
    </Section>
  );
}

function ResponseCard({
  tone,
  eyebrow,
  method,
  url,
  accept,
  contentType,
  bodyLabel,
  body,
  language,
}: {
  tone: "neutral" | "accent";
  eyebrow: string;
  method: string;
  url: string;
  accept: string;
  contentType: string;
  bodyLabel: string;
  body: string;
  language: "html" | "md";
}) {
  const accentColor =
    tone === "accent" ? "var(--color-accent)" : "var(--color-fg-subtle)";
  const accentText =
    tone === "accent" ? "text-[var(--color-accent)]" : "text-[var(--color-fg-muted)]";

  return (
    <div
      className="overflow-hidden rounded-[var(--radius-card)] border bg-[var(--color-bg-elev-1)] shadow-2xl shadow-black/30"
      style={{
        borderColor:
          tone === "accent"
            ? "rgba(198, 254, 30, 0.35)"
            : "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elev-2)] px-4 py-2.5">
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.18em] ${accentText}`}
        >
          <span
            className="mr-2 inline-block size-1.5 rounded-full align-middle"
            style={{ background: accentColor }}
          />
          {eyebrow}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
          200 OK
        </span>
      </div>

      <div className="space-y-2 px-5 py-4 font-mono text-[11px]">
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          <span className="text-[var(--color-fg-subtle)]">{method}</span>
          <span className="text-[var(--color-fg)]">{url}</span>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          <span className="text-[var(--color-fg-subtle)]">Accept:</span>
          <span className="text-[var(--color-fg-muted)]">{accept}</span>
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          <span className="text-[var(--color-fg-subtle)]">Content-Type:</span>
          <span className={accentText}>{contentType}</span>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
            {bodyLabel}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
            .{language}
          </span>
        </div>
        <pre className="max-h-[420px] overflow-auto px-5 py-4 font-mono text-[12px] leading-relaxed text-[var(--color-fg-muted)]">
          <code>{body}</code>
        </pre>
      </div>
    </div>
  );
}
