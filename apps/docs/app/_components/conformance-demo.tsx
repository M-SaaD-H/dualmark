import { Section, SectionHeader } from "./section";

const tiers = [
  { label: "Basic", threshold: "60%", color: "var(--color-warning)" },
  { label: "Standard", threshold: "80%", color: "var(--color-info)" },
  { label: "Advanced", threshold: "95%", color: "var(--color-success)" },
];

export function ConformanceDemo() {
  return (
    <Section id="verify">
      <SectionHeader
        eyebrow="Catch regressions in CI"
        title={
          <>
            One command.{" "}
            <span className="text-[var(--color-accent)]">One score.</span>{" "}
            Fail the build.
          </>
        }
        description="Drop dualmark verify into GitHub Actions. Score every page on every PR. Block merges when a page drops below your conformance threshold. No black-box AI tooling."
      />

      <div className="mx-auto max-w-4xl overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elev-1)] shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elev-2)] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-[oklch(0.65_0.22_27)]/70" />
            <span className="size-3 rounded-full bg-[oklch(0.78_0.16_85)]/70" />
            <span className="size-3 rounded-full bg-[oklch(0.72_0.19_145)]/70" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
            .github/workflows/ci.yml
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)] opacity-60">
            yaml
          </span>
        </div>

        <div className="px-6 py-6 font-mono text-sm">
          <pre className="overflow-x-auto leading-relaxed text-[var(--color-fg-muted)]">
            <code>
              <span className="text-[var(--color-fg-subtle)]">name:</span>{" "}
              <span className="text-[var(--color-fg)]">CI</span>
              {"\n"}
              <span className="text-[var(--color-fg-subtle)]">on:</span>{" "}
              <span className="text-[var(--color-fg)]">[pull_request]</span>
              {"\n\n"}
              <span className="text-[var(--color-fg-subtle)]">jobs:</span>
              {"\n"}
              {"  "}
              <span className="text-[var(--color-fg)]">aeo-conformance:</span>
              {"\n"}
              {"    "}
              <span className="text-[var(--color-fg-subtle)]">runs-on:</span>{" "}
              <span className="text-[var(--color-fg)]">ubuntu-latest</span>
              {"\n"}
              {"    "}
              <span className="text-[var(--color-fg-subtle)]">steps:</span>
              {"\n"}
              {"      "}
              <span className="text-[var(--color-fg-subtle)]">- run:</span>{" "}
              <span className="text-[var(--color-accent)]">bunx @dualmark/cli</span>{" "}
              <span className="text-[var(--color-fg)]">verify \</span>
              {"\n"}
              {"          "}
              <span className="text-[var(--color-fg)]">https://staging.yourcompany.com/pricing \</span>
              {"\n"}
              {"          "}
              <span className="text-[var(--color-fg)]">--min-score 95</span>
              {"\n"}
              {"        "}
              <span className="text-[var(--color-fg-subtle)]"># exits non-zero below threshold</span>
            </code>
          </pre>
        </div>

        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-4">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="rounded bg-[var(--color-success)]/15 px-2 py-0.5 font-medium text-[var(--color-success)]">
              ✓ pass
            </span>
            <span className="text-[var(--color-fg-muted)]">
              /pricing — 125/125 Advanced
            </span>
            <span className="ml-auto text-[var(--color-fg-subtle)]">107ms</span>
          </div>
          <div className="mt-1.5 flex items-center gap-3 font-mono text-xs">
            <span className="rounded bg-[oklch(0.65_0.22_27)]/15 px-2 py-0.5 font-medium text-[oklch(0.65_0.22_27)]">
              ✗ fail
            </span>
            <span className="text-[var(--color-fg-muted)]">
              /compare — 88/125, missing X-Markdown-Tokens header
            </span>
            <span className="ml-auto text-[var(--color-fg-subtle)]">94ms</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-3 gap-3">
        {tiers.map((tier) => (
          <div
            key={tier.label}
            className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev-1)] px-4 py-3"
          >
            <div>
              <div className="text-sm font-medium text-[var(--color-fg)]">{tier.label}</div>
              <div className="text-xs text-[var(--color-fg-subtle)]">conformance</div>
            </div>
            <span
              className="font-mono text-lg font-medium"
              style={{ color: tier.color }}
            >
              {tier.threshold}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
