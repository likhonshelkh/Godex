import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const stats = [
  { label: "Tech stack", value: "Vite + React" },
  { label: "Styling", value: "Tailwind CSS" },
  { label: "Content", value: "Concept preview" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-border-soft/60 bg-surface-elevated/70 px-6 py-16 shadow-glow backdrop-blur md:px-12 md:py-20">
      <div className="absolute inset-0 bg-gradient-hero opacity-60" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface-elevated/0 via-surface-elevated/10 to-surface-elevated" aria-hidden />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 text-center md:gap-12">
        <Badge className="mx-auto shadow-subtle">
          <Sparkles className="h-3.5 w-3.5" />
          Meet your autonomous co-engineer
        </Badge>
        <div className="space-y-6">
          <h1 className="font-display text-4xl leading-tight tracking-tight text-balance sm:text-5xl md:text-6xl">
            Explore the Godex concept: an autonomous coding partner for audacious teams
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-content-subtle md:text-xl">
            Preview the workflows, guardrails, and design principles behind Godex without assuming a live automation backend.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <Button className="w-full md:w-auto" size="lg">
            Launch the demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button className="w-full md:w-auto" intent="secondary" size="lg">
            Explore playbooks
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 rounded-3xl border border-border-soft/50 bg-surface-muted/60 p-6 backdrop-blur md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <span className="text-gradient text-3xl font-semibold md:text-4xl">
                {stat.value}
              </span>
              <span className="text-sm font-medium tracking-wide text-content-subtle uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute -right-24 top-16 h-64 w-64 rounded-full bg-gradient-radial opacity-50 blur-3xl md:h-80 md:w-80" aria-hidden />
      <div className="pointer-events-none absolute -left-16 bottom-10 h-48 w-48 rounded-full bg-gradient-radial opacity-40 blur-3xl md:h-72 md:w-72" aria-hidden />
    </section>
  );
}
