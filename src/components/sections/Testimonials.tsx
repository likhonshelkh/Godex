const testimonials = [
  {
    quote:
      "Godex translated fuzzy requirements into production-ready code, orchestrated reviews, and documented every decision. It feels like we added an elite engineer overnight.",
    author: "Nia Harper",
    role: "VP Engineering, Aurora Labs",
  },
  {
    quote:
      "The autonomous playbooks are a cheat code. We now ship weekly platform upgrades without burning out our core team.",
    author: "Deon Patel",
    role: "CTO, Lumen Systems",
  },
];

export function Testimonials() {
  return (
    <section className="mt-28 rounded-[2.5rem] border border-border-soft/60 bg-surface-elevated/60 p-10 shadow-subtle backdrop-blur md:p-16">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        {testimonials.map((item) => (
          <blockquote key={item.author} className="surface-card flex h-full flex-col gap-6 p-8">
            <span className="text-5xl leading-none text-accent-primary">“</span>
            <p className="text-lg leading-relaxed text-content-subtle">{item.quote}</p>
            <div className="mt-auto">
              <p className="font-semibold text-content-strong">{item.author}</p>
              <p className="text-sm text-content-subtle">{item.role}</p>
            </div>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
