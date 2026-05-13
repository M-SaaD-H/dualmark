---
"@dualmark/astro": minor
---

Bump `astro` peer dependency to `^6.1.10` (was `^5.0.0`) to resolve two upstream
security advisories that were not backported to Astro 5:

- **GHSA-j687-52p2-xcff** (CVE-2026-41067, moderate) — XSS in `define:vars`
  via incomplete `</script>` tag sanitization. Patched in Astro 6.1.6.
- **GHSA-xr5h-phrj-8vxv** (CVE-2026-45028, low) — Server island encrypted
  parameters vulnerable to cross-component replay. Patched in Astro 6.1.10.

**Breaking for consumers**: `@dualmark/astro` now requires Astro `^6.1.10`,
which in turn requires Node `>=22.12.0`. Astro 5 is no longer supported.
The `engines.node` field on every published `@dualmark/*` package is bumped
to `>=22.12.0` for monorepo consistency.

No source-code changes to `@dualmark/astro` itself — the integration only
uses stable Astro 6 hooks (`astro:config:setup`, `injectRoute`,
`addMiddleware`) and the Content Layer API, which were already the
recommended path in Astro 5.

See Astro 6 upgrade guide: https://docs.astro.build/en/guides/upgrade-to/v6/
