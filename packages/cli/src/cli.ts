import { main } from "./main.js";

main(process.argv).then(
  (code) => process.exit(code),
  (err: unknown) => {
    process.stderr.write(
      `fatal: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    process.exit(2);
  },
);
