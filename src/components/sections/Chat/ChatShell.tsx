import { useEffect } from "react";
import { ChatComposer } from "./ChatComposer";
import { ChatSidePanel } from "./ChatSidePanel";
import { ChatTranscript } from "./ChatTranscript";
import { useChatSession } from "../../../hooks/useChatSession";

export function ChatShell() {
  const {
    messages,
    metadata,
    isStreaming,
    error,
    sendMessage,
    resume,
    stop,
    clearError,
  } =
    useChatSession();

  useEffect(() => {
    resume();
  }, [resume]);

  return (
    <section
      id="chat"
      className="relative overflow-hidden rounded-[2.75rem] border border-border-soft/60 bg-surface-elevated/80 p-8 shadow-glow"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-hero opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-accent-primary/20 blur-3xl" aria-hidden />
      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-accent-secondary">
              Command center demo
            </span>
            <h2 className="font-display text-4xl tracking-tight text-balance text-content-strong">
              Pair with Godex in a live reasoning workspace
            </h2>
            <p className="text-sm leading-relaxed text-content-subtle">
              Stream plans, monitor actions, and redirect strategy mid-flight. Responses arrive as progressive updates so you can
              intervene at any moment.
            </p>
          </div>
          <ChatTranscript
            messages={messages}
            isStreaming={isStreaming}
            onStop={stop}
            error={error}
            onClearError={clearError}
          />
          <ChatComposer onSubmit={sendMessage} disabled={isStreaming} />
        </div>
        <ChatSidePanel metadata={metadata} />
      </div>
    </section>
  );
}
