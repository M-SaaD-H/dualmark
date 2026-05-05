import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/verify.ts", "src/main.ts", "src/cli.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: "es2022",
  external: ["@dualmark/core"],
  banner: ({ format }) => (format === "esm" ? { js: "#!/usr/bin/env node" } : {}),
});
