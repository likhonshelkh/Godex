import { useMemo } from "react";
import clsx from "clsx";
import { ChatMessage, ChatMessageStatus } from "../../../domain/chat";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { MessageContent } from "../../message";

interface ChatTranscriptProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  onStop: () => void;
  error: string | null;
  onClearError: () => void;
}

export function ChatTranscript({
  messages,
  isStreaming,
  onStop,
  error,
  onClearError,
}: ChatTranscriptProps) {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  return (
    <div className="relative flex h-full min-h-[480px] flex-col gap-6 rounded-3xl border border-border-soft/40 bg-surface-muted/50 p-6 backdrop-blur">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg text-content-strong">Mission thread</h3>
          <p className="text-xs uppercase tracking-[0.35em] text-content-subtle">
            Streaming conversation
          </p>
        </div>
        {isStreaming ? (
          <Button intent="ghost" size="sm" onClick={onStop} className="gap-2 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent-secondary/40" aria-hidden />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-secondary" aria-hidden />
            </span>
            Stop
          </Button>
        ) : null}
      </header>
      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        <div
          className="flex flex-1 flex-col gap-4 overflow-y-auto pr-2"
          role="log"
          aria-live="polite"
          aria-busy={isStreaming}
        >
          {messages.length === 0 ? (
            <div className="mt-12 grid place-items-center text-center text-sm text-content-subtle">
              <p>
                Ask Godex to map a migration, orchestrate a release, or synthesize engineering rituals.\nWe'll stream the full
                reasoning trail right here.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                className={clsx(
                  "flex flex-col gap-3 rounded-3xl border p-4 shadow-subtle",
                  message.role === "user"
                    ? "border-accent-primary/30 bg-accent-primary/5"
                    : "border-border-soft/40 bg-surface-elevated/60",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge intent={message.role === "user" ? "accent" : "neutral"} size="compact">
                      {formatRole(message.role)}
                    </Badge>
                    <span className="text-xs text-content-subtle">
                      {formatter.format(message.createdAt)}
                    </span>
                  </div>
                  <StatusPill status={message.status} />
                </div>
                <MessageContent message={message} isStreaming={message.isStreaming} />
                {message.isStreaming ? <StreamingBar /> : null}
              </article>
            ))
          )}
        </div>
        {error ? (
          <div className="flex items-start gap-3 rounded-2xl border border-accent-secondary/50 bg-accent-secondary/10 p-4 text-sm text-accent-secondary" role="alert">
            <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-accent-secondary" aria-hidden />
            <div className="flex-1 space-y-2">
              <p>{error}</p>
              <button
                type="button"
                onClick={onClearError}
                className="text-xs font-medium uppercase tracking-[0.25em] text-accent-secondary/80 transition hover:text-accent-secondary"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function formatRole(role: ChatMessage["role"]) {
  switch (role) {
    case "assistant":
      return "Assistant";
    case "system":
      return "System";
    case "tool":
      return "Tool";
    default:
      return "You";
  }
}

function StatusPill({ status }: { status: ChatMessageStatus }) {
  const label =
    status === "streaming"
      ? "Streaming"
      : status === "completed"
        ? "Complete"
        : status === "errored"
          ? "Attention"
          : "Queued";

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-surface-elevated/50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.3em] text-content-subtle">
      <span
        className={clsx(
          "h-1.5 w-1.5 rounded-full",
          status === "streaming"
            ? "bg-accent-secondary animate-pulse"
            : status === "completed"
              ? "bg-accent-primary"
              : status === "errored"
                ? "bg-red-400"
                : "bg-border-soft",
        )}
      />
      {label}
    </span>
  );
}

function StreamingBar() {
  return (
    <div className="relative h-1.5 overflow-hidden rounded-full bg-surface-muted/80">
      <span className="absolute inset-0 animate-[pulse_1.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-accent-secondary/50 to-transparent" />
    </div>
  );
}
