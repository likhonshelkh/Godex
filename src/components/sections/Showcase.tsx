const highlights = [
  {
    title: "Explainable autonomy",
    description:
      "Every action is documented with rationale, design decisions, and verification logs so your team stays in the loop.",
  },
  {
    title: "Team-aware memory",
    description:
      "Persistent workspaces remember architecture, style guides, and preferences for each squad and repository.",
  },
  {
    title: "AI-native command center",
    description:
      "Visualize progress across agents, queue new missions, and pair program with Godex in a shared canvas.",
  },
];

export function Showcase() {
  return (
    <section className="mt-24 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <div className="space-y-3">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-tertiary">
            Built for scale
          </span>
          <h2 className="font-display text-4xl tracking-tight text-balance">
            A workspace that moves as quickly as your imagination
          </h2>
          <p className="text-lg leading-relaxed text-content-subtle">
            Bring deep-thinking AI into your daily rituals with curated experiences for discovery, delivery, and ongoing maintenance.
          </p>
        </div>
        <div className="grid gap-6">
          {highlights.map((item) => (
            <div key={item.title} className="surface-card flex flex-col gap-3 p-6">
              <h3 className="font-semibold text-xl text-content-strong">{item.title}</h3>
              <p className="text-sm leading-relaxed text-content-subtle">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[2.25rem] border border-border-soft/60 bg-surface-elevated/80 p-8 shadow-glow">
        <div className="absolute inset-0 bg-gradient-hero opacity-50" aria-hidden />
        <div className="relative flex flex-col gap-6">
          <div className="rounded-2xl border border-border-soft/40 bg-surface-muted/60 p-6 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-accent-secondary">
                Mission control
              </span>
              <span className="text-xs text-content-subtle">Autonomous session 42</span>
            </div>
            <p className="mt-4 text-base leading-relaxed text-content-subtle">
              Godex is orchestrating a refactor mission: optimizing Next.js routes, syncing with design tokens, and running regression tests in parallel sandboxes.
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft/40 bg-surface-muted/70 p-6 shadow-subtle">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold text-content-strong">Live output</span>
              <span className="text-xs text-content-subtle">Streaming updates</span>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-content-subtle">
              <li className="rounded-xl bg-surface-elevated/70 px-4 py-3">\"Generated repository audit with 13 improvement tracks\"</li>
              <li className="rounded-xl bg-surface-elevated/70 px-4 py-3">\"Synthesized Tailwind semantic tokens and applied across UI\"</li>
              <li className="rounded-xl bg-surface-elevated/70 px-4 py-3">\"Validated new flows with 52 automated checks\"</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
