import { CircuitBoard, Workflow as WorkflowIcon, ShieldCheck } from "lucide-react";

const pillars = [
  {
    title: "Deep orchestration vision",
    description:
      "Outline how Gemini-powered agents could tackle multi-step builds with native tool handoffs and contextual guardrails.",
    icon: WorkflowIcon,
  },
  {
    title: "Unified execution concept",
    description:
      "Describe the intended blend of local sandboxes, WebContainers, and cloud runtimes that would iterate alongside your team.",
    icon: CircuitBoard,
  },
  {
    title: "Quality fused in",
    description:
      "Showcase the plan for automated architectural patterns, test coverage, and reviews that the full product aims to enforce.",
    icon: ShieldCheck,
  },
];

export function ValuePillars() {
  return (
    <section className="relative mt-24 grid gap-6 md:grid-cols-3">
      {pillars.map(({ icon: Icon, title, description }) => (
        <article key={title} className="surface-card relative flex h-full flex-col gap-5 p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-primary/15 text-accent-primary">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="font-display text-2xl tracking-tight text-balance">{title}</h3>
          <p className="text-base leading-relaxed text-content-subtle">{description}</p>
          <div className="mt-auto h-px w-full bg-gradient-to-r from-transparent via-border-strong/40 to-transparent" />
        </article>
      ))}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2.25rem] border border-border-soft/40" aria-hidden />
    </section>
  );
}
