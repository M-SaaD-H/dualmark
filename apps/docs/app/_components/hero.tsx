import Link from "next/link";
import { BeamsBackground } from "./beams-bg";
import { InstallCommandClient } from "./install-command";

export function Hero() {
  return (
    <section className="relative isolate border-b border-[var(--color-border)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 mx-auto w-full max-w-7xl overflow-hidden"
      >
        <BeamsBackground />
        <div className="absolute inset-0 bg-grid mask-radial-fade opacity-30" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-24 pt-16 md:px-8 md:pb-32 md:pt-24">
        <Link
          href="https://github.com/dodopayments/dualmark"
          className="group mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elev-1)]/70 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-muted)] backdrop-blur transition-colors hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]"
        >
          <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
          Open source on GitHub
          <span aria-hidden className="opacity-60 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>

        <h1 className="max-w-4xl text-balance text-center text-5xl font-semibold tracking-tight text-[var(--color-fg)] md:text-7xl">
          The{" "}
          <span className="bg-gradient-to-r from-[#e8ffa8] via-[#c6fe1e] to-[#9ee847] bg-clip-text text-transparent">
            AEO infrastructure
          </span>{" "}
          your marketing site is missing.
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-center text-lg text-[var(--color-fg-muted)] md:text-xl">
          Your blog ranks #1 on Google. ChatGPT cites your competitor. Not a
          content problem — an infrastructure problem. Dualmark gives every
          page a markdown twin AI agents can actually read.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/docs/quickstart"
            className="group inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 font-semibold text-[var(--color-accent-ink)] transition-all hover:bg-[var(--color-accent-strong)]"
          >
            Quickstart
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <InstallCommandClient />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--color-fg-subtle)]">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
            30 seconds to install
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
            Verify in CI with one command
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
            Apache 2.0 · zero telemetry
          </span>
        </div>

        <div className="mt-16 w-full max-w-3xl animate-[var(--animate-fade-in-up)]">
          <VerifyTerminal />
        </div>
      </div>
    </section>
  );
}

function VerifyTerminal() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elev-1)] shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elev-2)] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[oklch(0.65_0.22_27)]/70" />
          <span className="size-3 rounded-full bg-[oklch(0.78_0.16_85)]/70" />
          <span className="size-3 rounded-full bg-[oklch(0.72_0.19_145)]/70" />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
          zsh — dualmark verify
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)] opacity-60">
          107ms
        </span>
      </div>
      <div className="space-y-3 px-6 py-6 font-mono text-sm">
        <div>
          <span className="text-[var(--color-fg-subtle)]">$ </span>
          <span className="text-[var(--color-accent)]">bunx @dualmark/cli</span>{" "}
          verify <span className="text-[var(--color-fg)]">https://yoursite.com/pricing</span>
        </div>
        <div className="grid grid-cols-[140px_1fr] gap-y-1 pt-2 text-xs sm:text-sm">
          <span className="text-[var(--color-fg-subtle)]">URL</span>
          <span className="text-[var(--color-fg)] break-all">https://yoursite.com/pricing</span>
          <span className="text-[var(--color-fg-subtle)]">Markdown twin</span>
          <span className="text-[var(--color-fg)] break-all">https://yoursite.com/pricing.md</span>
          <span className="text-[var(--color-fg-subtle)]">Score</span>
          <span className="font-medium text-[var(--color-success)]">125 / 125</span>
          <span className="text-[var(--color-fg-subtle)]">Conformance</span>
          <span className="font-medium text-[var(--color-success)]">Advanced ✓</span>
        </div>
        <div className="flex items-center gap-1 pt-2">
          <span className="text-[var(--color-fg-subtle)]">$</span>
          <span className="ml-1 inline-block h-4 w-2 animate-[var(--animate-cursor)] bg-[var(--color-fg)]" />
        </div>
      </div>
    </div>
  );
}
