import { Hero } from "./components/sections/Hero";
import { ValuePillars } from "./components/sections/ValuePillars";
import { Workflow } from "./components/sections/Workflow";
import { Showcase } from "./components/sections/Showcase";
import { Testimonials } from "./components/sections/Testimonials";
import { Footer } from "./components/sections/Footer";

function App() {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-20 px-6 pb-20 pt-16 md:px-10">
      <header className="flex items-center justify-between rounded-full border border-border-soft/40 bg-surface-elevated/60 px-6 py-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-primary/20 text-accent-primary">
            <span className="font-display text-xl">Gx</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-content-strong">Godex</span>
            <span className="text-xs uppercase tracking-[0.35em] text-content-subtle">Deep think ops</span>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-content-subtle md:flex">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#showcase">Platform</a>
          <a href="#stories">Stories</a>
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <span className="text-sm text-content-subtle">Early access open</span>
          <a
            className="inline-flex items-center rounded-full bg-accent-secondary/10 px-4 py-2 text-sm font-medium text-accent-secondary"
            href="#cta"
          >
            Talk to us
          </a>
        </div>
      </header>
      <main className="flex flex-col gap-24">
        <Hero />
        <div id="features">
          <ValuePillars />
        </div>
        <div id="workflow">
          <Workflow />
        </div>
        <div id="showcase">
          <Showcase />
        </div>
        <div id="stories">
          <Testimonials />
        </div>
        <div id="cta">
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default App;
