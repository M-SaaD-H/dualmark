import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/module.ts"],
  format: ["esm", "cjs"],
  dts: { entry: ["src/index.ts"] },
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: "es2022",
  external: [
    "@dualmark/core",
    "@dualmark/converters",
    "@nuxt/kit",
    "@nuxt/schema",
    "nuxt",
    "nitropack",
  ],
});
