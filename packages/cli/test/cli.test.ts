import { describe, it, expect, vi } from "vitest";
import { main } from "../src/main.js";

describe("CLI argument parsing & exit codes", () => {
  it("prints help and exits 0 for no args", async () => {
    const stdout = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const code = await main(["node", "dualmark"]);
    expect(code).toBe(0);
    expect(stdout).toHaveBeenCalled();
    stdout.mockRestore();
  });

  it("prints version and exits 0 for --version", async () => {
    const stdout = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const code = await main(["node", "dualmark", "--version"]);
    expect(code).toBe(0);
    expect(stdout.mock.calls.flat().join("")).toContain("0.1.0");
    stdout.mockRestore();
  });

  it("returns 2 on missing url", async () => {
    const stderr = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    const stdout = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const code = await main(["node", "dualmark", "verify"]);
    expect(code).toBe(2);
    stderr.mockRestore();
    stdout.mockRestore();
  });

  it("returns 2 on invalid url", async () => {
    const stderr = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    const code = await main(["node", "dualmark", "verify", "not a url"]);
    expect(code).toBe(2);
    stderr.mockRestore();
  });

  it("prints help and exits 0 for `verify --help`", async () => {
    const stdout = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const stderr = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    const code = await main(["node", "dualmark", "verify", "--help"]);
    expect(code).toBe(0);
    expect(stderr).not.toHaveBeenCalled();
    expect(stdout.mock.calls.flat().join("")).toContain("Usage:");
    stdout.mockRestore();
    stderr.mockRestore();
  });

  it("prints help and exits 0 for `verify -h`", async () => {
    const stdout = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const code = await main(["node", "dualmark", "verify", "-h"]);
    expect(code).toBe(0);
    expect(stdout.mock.calls.flat().join("")).toContain("Usage:");
    stdout.mockRestore();
  });
});
