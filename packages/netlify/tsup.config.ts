import { defineConfig } from "tsup";

export default defineConfig([
  // ── Node / server build ──────────────────────────────────────────────────
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    treeshake: true,
    target: "es2022",
    external: ["@dualmark/core", "@netlify/edge-functions"],
  },
  // ── Deno / Netlify Edge build (fully self-contained) ─────────────────────
  // @dualmark/core is inlined so the Deno runtime needs no extra resolution.
  // @netlify/edge-functions is types-only — keep external.
  {
    entry: { "index.edge": "src/index.ts" },
    format: ["esm"],
    dts: false,
    sourcemap: true,
    clean: false,
    splitting: false,
    treeshake: true,
    target: "es2022",
    noExternal: ["@dualmark/core"],
    external: ["@netlify/edge-functions"],
    outDir: "dist",
  },
]);
