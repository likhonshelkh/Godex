import type { MetadataEntry } from "../../../domain/chat";

const promptLibrary = [
  {
    title: "Stabilize a release",
    description: "Triage flaky tests, propose patches, and outline rollout safeguards.",
  },
  {
    title: "Design a migration",
    description: "Map legacy services to the new architecture with phased cutovers.",
  },
  {
    title: "Coach the team",
    description: "Summarize sprint progress and prep talking points for leadership.",
  },
];

interface ChatSidePanelProps {
  metadata: MetadataEntry[];
}

export function ChatSidePanel({ metadata }: ChatSidePanelProps) {
  return (
    <aside className="flex flex-col gap-6 rounded-3xl border border-border-soft/40 bg-surface-muted/50 p-6 backdrop-blur">
      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-content-strong">Session insights</h3>
        <p className="text-sm leading-relaxed text-content-subtle">
          Godex surfaces mission metadata as it reasons — connect these updates to your workflow tooling or export to docs.
        </p>
      </div>
      <dl className="grid gap-3 text-sm">
        {metadata.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-soft/60 bg-surface-elevated/40 p-5 text-content-subtle">
            Streaming metadata will appear here once the assistant shares progress.
          </div>
        ) : (
          metadata.map((entry) => (
            <div
              key={entry.label}
              className="rounded-2xl border border-border-soft/40 bg-surface-elevated/60 p-4"
            >
              <dt className="text-xs uppercase tracking-[0.3em] text-accent-secondary">{entry.label}</dt>
              <dd className="mt-2 text-content-strong">{entry.value}</dd>
            </div>
          ))
        )}
      </dl>
      <div className="space-y-3">
        <h4 className="font-semibold text-base text-content-strong">Try these prompts</h4>
        <ul className="grid gap-3 text-sm text-content-subtle">
          {promptLibrary.map((prompt) => (
            <li
              key={prompt.title}
              className="rounded-2xl border border-border-soft/40 bg-surface-elevated/50 p-4"
            >
              <span className="text-content-strong">{prompt.title}</span>
              <p className="mt-1 text-xs leading-relaxed">{prompt.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
