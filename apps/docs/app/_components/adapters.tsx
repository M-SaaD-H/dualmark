import { AstroLogo, CloudflareLogo, NextLogo } from "@/components/brand-logos";
import type { ComponentType, SVGProps } from "react";
import { Section, SectionHeader } from "./section";

interface Adapter {
  name: string;
  pkg: string;
  desc: string;
  install: string;
  score: string;
  status: string;
  accent: string;
  Logo: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
}

const adapters: Adapter[] = [
  {
    name: "Astro",
    pkg: "@dualmark/astro",
    desc: "Astro 5 integration. Auto-generates .md endpoints, ships middleware, generates llms.txt.",
    install: "pnpm add @dualmark/astro",
    score: "80/80",
    status: "Stable",
    accent: "oklch(0.78 0.16 30)",
    Logo: AstroLogo,
  },
  {
    name: "Next.js",
    pkg: "@dualmark/core",
    desc: "App Router middleware + route handler. Use @dualmark/core directly — no adapter needed.",
    install: "pnpm add @dualmark/core",
    score: "120/125",
    status: "Stable",
    accent: "oklch(0.985 0 0)",
    Logo: NextLogo,
  },
  {
    name: "Cloudflare",
    pkg: "@dualmark/cloudflare",
    desc: "Workers edge adapter. Wraps any upstream Worker. Hooks for analytics + telemetry.",
    install: "pnpm add @dualmark/cloudflare",
    score: "125/125",
    status: "Stable",
    accent: "oklch(0.82 0.16 70)",
    Logo: CloudflareLogo,
  },
];

export function Adapters() {
  return (
    <Section id="adapters">
      <SectionHeader
        eyebrow="Framework adapters"
        title={
          <>
            Drop into{" "}
            <span className="text-[var(--color-accent)]">your stack.</span>
          </>
        }
        description="Three first-class integrations today. SvelteKit, Remix, Nuxt, Vercel, Netlify on the roadmap."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adapters.map((a) => (
          <div
            key={a.name}
            className="group relative flex flex-col gap-5 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elev-1)]/50 p-6 transition-all hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-elev-1)]"
          >
            <div
              className="absolute right-0 top-0 size-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
              style={{ background: a.accent }}
            />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev-2)] text-[var(--color-fg)]">
                  <a.Logo size={22} />
                </div>
                <div>
                  <div className="text-lg font-semibold text-[var(--color-fg)]">
                    {a.name}
                  </div>
                  <div className="font-mono text-xs text-[var(--color-fg-subtle)]">
                    {a.pkg}
                  </div>
                </div>
              </div>
              <span className="rounded-full border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-success)]">
                {a.status}
              </span>
            </div>

            <p className="text-sm text-[var(--color-fg-muted)]">{a.desc}</p>

            <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-xs">
              <span className="text-[var(--color-fg-subtle)]">$ </span>
              <span className="text-[var(--color-fg)]">{a.install}</span>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border)] pt-4">
              <span className="text-xs text-[var(--color-fg-subtle)]">
                Reference example score
              </span>
              <span className="font-mono text-sm font-medium text-[var(--color-success)]">
                {a.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
