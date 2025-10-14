import { FormEvent, KeyboardEvent, useState } from "react";
import { Button } from "../../ui/button";

interface ChatComposerProps {
  onSubmit: (value: string) => void;
  disabled?: boolean;
}

export function ChatComposer({ onSubmit, disabled }: ChatComposerProps) {
  const [value, setValue] = useState("");

  const commit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }
    onSubmit(trimmed);
    setValue("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    commit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      commit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border-soft/40 bg-surface-elevated/70 p-4 shadow-subtle">
      <label htmlFor="chat-input" className="sr-only">
        Message Godex
      </label>
      <div className="flex flex-col gap-3">
        <textarea
          id="chat-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Godex to explore options, triage blockers, or craft delivery plans…"
          rows={3}
          className="min-h-[120px] w-full resize-none rounded-2xl border border-border-soft/30 bg-surface-muted/70 px-4 py-3 text-sm leading-relaxed text-content-strong placeholder:text-content-subtle focus:outline-none focus:ring-2 focus:ring-accent-primary/60"
          aria-disabled={disabled}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-content-subtle">Press Enter to send · Shift + Enter for a new line</span>
          <Button type="submit" size="sm" disabled={disabled || value.trim().length === 0}>
            Send message
          </Button>
        </div>
      </div>
    </form>
  );
}
