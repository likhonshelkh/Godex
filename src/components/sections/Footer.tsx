import { Button } from "../ui/button";

export function Footer() {
  return (
    <footer className="mt-24 flex flex-col gap-10 rounded-[2.25rem] border border-border-soft/60 bg-surface-elevated/70 p-10 text-center shadow-subtle backdrop-blur md:p-16">
      <div className="space-y-4">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-secondary">
          Ready when you are
        </span>
        <h2 className="font-display text-4xl tracking-tight text-balance">
          Build audacious ideas with Godex at your side
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-content-subtle">
          Partner with our team to pilot Godex across your engineering org, align on success metrics, and unlock next-level velocity without compromise.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
        <Button size="lg">Book a discovery call</Button>
        <Button size="lg" intent="secondary">
          Download product deck
        </Button>
      </div>
      <div className="mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-content-subtle">
        <span>© {new Date().getFullYear()} Godex Labs</span>
        <span>Privacy</span>
        <span>Security</span>
        <span>Trust Center</span>
      </div>
    </footer>
  );
}
