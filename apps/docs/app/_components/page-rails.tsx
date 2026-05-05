export function PageRails() {
  const offset = "min(50%, 640px)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 select-none"
    >
      <div
        className="absolute top-0 bottom-0 w-px bg-[var(--color-border-strong)]"
        style={{ left: `calc(50% - ${offset})` }}
      />
      <div
        className="absolute top-0 bottom-0 w-px bg-[var(--color-border-strong)]"
        style={{ right: `calc(50% - ${offset})` }}
      />
    </div>
  );
}
