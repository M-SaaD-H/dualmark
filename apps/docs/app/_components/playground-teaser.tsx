"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Section, SectionHeader } from "./section";

const SUGGESTIONS = [
  { label: "dodopayments.com", url: "https://dodopayments.com" },
  { label: "vercel.com", url: "https://vercel.com" },
  { label: "stripe.com", url: "https://stripe.com" },
  { label: "linear.app", url: "https://linear.app" },
];

export function PlaygroundTeaser() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function go(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const normalized = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    router.push(`/play?url=${encodeURIComponent(normalized)}`);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    go(value);
  }

  return (
    <Section id="score-your-site">
      <SectionHeader
        eyebrow="Try it"
        title={
          <>
            Score your site against{" "}
            <span className="text-[var(--color-accent)]">the spec.</span>
          </>
        }
        description="Paste any URL. We fetch it from our edge, run the same engine as @dualmark/cli, and return a 0–125 conformance score with line-item failures. No install. No signup."
      />

      <form
        onSubmit={onSubmit}
        className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
      >
        <label
          htmlFor="ps-url"
          className="flex w-full flex-1 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev-1)] px-4 transition-colors focus-within:border-[var(--color-accent)]/60"
        >
          <UrlIcon className="size-4 text-[var(--color-fg-subtle)]" />
          <input
            id="ps-url"
            type="url"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://yourcompany.com/pricing"
            className="h-12 w-full bg-transparent font-mono text-sm text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg-subtle)]"
          />
        </label>
        <button
          type="submit"
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 font-semibold text-[var(--color-accent-ink)] transition-all hover:bg-[var(--color-accent-strong)]"
        >
          Score it
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </form>

      <div className="mx-auto mt-5 flex w-full max-w-2xl flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">
          Try:
        </span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s.url}
            type="button"
            onClick={() => go(s.url)}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elev-1)] px-2.5 py-1 font-mono text-xs text-[var(--color-fg-muted)] transition-all hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]"
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-[var(--color-fg-subtle)]">
        Want the full UI with framework detection, failed-check breakdowns, and{" "}
        <em>Fix with AI</em> prompts?{" "}
        <Link
          href="/play"
          className="text-[var(--color-fg-muted)] underline-offset-4 hover:text-[var(--color-fg)] hover:underline"
        >
          Open the playground
        </Link>
        .
      </p>
    </Section>
  );
}

function UrlIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1" />
    </svg>
  );
}
