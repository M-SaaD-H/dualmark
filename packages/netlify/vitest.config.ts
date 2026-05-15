import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    name: "@dualmark/netlify",
    environment: "node",
    include: ["test/**/*.test.ts"],
    globals: false,
  },
});
