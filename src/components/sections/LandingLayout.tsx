import type { ReactElement, ReactNode } from "react";

interface LandingNavLink {
  label: string;
  href: string;
}

interface LandingCta {
  label: string;
  href: string;
}

interface LandingLayoutProps {
  children: ReactNode;
  navLinks?: LandingNavLink[];
  cta?: LandingCta;
  statusText?: string;
}

const defaultNavLinks: LandingNavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Platform", href: "#showcase" },
  { label: "Console", href: "#chat" },
  { label: "Stories", href: "#stories" },
];

const defaultCta: LandingCta = {
  label: "Talk to us",
  href: "#cta",
};

const defaultStatus = "Early access open";

export function LandingLayout({
  children,
  navLinks = defaultNavLinks,
  cta = defaultCta,
  statusText = defaultStatus,
}: LandingLayoutProps): ReactElement {
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
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-content-strong">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          {statusText ? <span className="text-sm text-content-subtle">{statusText}</span> : null}
          {cta ? (
            <a
              className="inline-flex items-center rounded-full bg-accent-secondary/10 px-4 py-2 text-sm font-medium text-accent-secondary"
              href={cta.href}
            >
              {cta.label}
            </a>
          ) : null}
        </div>
      </header>
      <main className="flex flex-col gap-24">{children}</main>
    </div>
  );
}
