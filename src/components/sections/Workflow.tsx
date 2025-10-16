import { ArrowRight, Code2, GitBranch, Lightbulb } from "lucide-react";

const steps = [
  {
    title: "Strategize",
    description:
      "Frame the intent, scope, and constraints in natural language. This concept shows how Godex could translate goals into executable playbooks.",
    icon: Lightbulb,
  },
  {
    title: "Construct",
    description:
      "Explore how autonomous agents might generate code and run tests inside tailored environments while respecting guardrails.",
    icon: Code2,
  },
  {
    title: "Evolve",
    description:
      "Review diffs, share context, and prepare releases with quality gates, dependencies, and notes highlighted for the future product.",
    icon: GitBranch,
  },
];

export function Workflow() {
  return (
    <section className="mt-24 rounded-[2.25rem] border border-border-soft/50 bg-surface-elevated/70 px-8 py-16 shadow-subtle backdrop-blur lg:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <header className="flex flex-col gap-4 text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-secondary">
            Flow state automation
          </span>
          <h2 className="font-display text-4xl tracking-tight text-balance">
            A cinematic workflow that keeps momentum high
          </h2>
          <p className="text-lg leading-relaxed text-content-subtle">
            Follow a transparent journey from idea to shipped feature with smart checkpoints, contextual insights, and collaborative controls—presented here as a forward-looking narrative.
          </p>
        </header>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="group relative flex h-full flex-col gap-5 rounded-3xl border border-border-soft/70 bg-surface-muted/60 p-6 transition-transform duration-500 hover:-translate-y-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-secondary/15 text-accent-secondary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-xl">{title}</h3>
              <p className="text-sm leading-relaxed text-content-subtle">{description}</p>
              {index < steps.length - 1 ? (
                <ArrowRight className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-accent-secondary md:block" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
