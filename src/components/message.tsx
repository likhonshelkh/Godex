import clsx from "clsx";
import type {
  ChatMessage,
  ChatMessageReasoningPart,
  ChatMessageTextPart,
  ChatMessageToolInvocationPart,
} from "../domain/chat";

interface MessageContentProps {
  message: ChatMessage;
  isStreaming?: boolean;
  className?: string;
}

export function MessageContent({ message, isStreaming = false, className }: MessageContentProps) {
  const parts = message.parts;

  if (parts.length === 0) {
    return (
      <p
        className={clsx(
          "whitespace-pre-wrap text-sm leading-relaxed text-content-subtle",
          className,
        )}
      >
        {isStreaming ? "Godex is thinking…" : "Awaiting response."}
      </p>
    );
  }

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      {parts.map((part, index) => {
        const key = `${message.id}-part-${index}`;
        if (part.type === "text") {
          return <TextPart key={key} part={part} />;
        }
        if (part.type === "reasoning") {
          return <ReasoningPart key={key} part={part} />;
        }
        if (part.type === "tool-invocation") {
          return <ToolInvocationPart key={key} part={part} />;
        }
        return null;
      })}
    </div>
  );
}

function TextPart({ part }: { part: ChatMessageTextPart }) {
  const trimmed = part.text.trim();
  if (trimmed.length === 0) {
    return null;
  }
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-content-strong">
      {part.text}
    </p>
  );
}

function ReasoningPart({ part }: { part: ChatMessageReasoningPart }) {
  return (
    <details className="group rounded-2xl border border-border-soft/40 bg-surface-muted/60 p-4 text-sm text-content-subtle">
      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.3em] text-content-subtle/80">
        Reasoning
      </summary>
      <pre className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-content-subtle">
        {part.reasoning}
      </pre>
    </details>
  );
}

function ToolInvocationPart({ part }: { part: ChatMessageToolInvocationPart }) {
  const { toolInvocation } = part;
  const { toolName, state, args, result } = toolInvocation;
  const stateLabel = state === "call" ? "Tool call" : "Tool result";

  return (
    <div className="rounded-2xl border border-border-soft/40 bg-surface-muted/60 p-4 text-xs text-content-subtle">
      <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-content-subtle/70">
        <span>{stateLabel}</span>
        <span>{toolName}</span>
      </div>
      {state === "call" && args ? (
        <CodeBlock label="Arguments" value={args} />
      ) : null}
      {state === "result" ? <CodeBlock label="Result" value={result} /> : null}
    </div>
  );
}

function CodeBlock({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="mt-2 space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-content-subtle/70">
        {label}
      </p>
      <pre className="max-h-64 overflow-auto rounded-xl bg-black/80 p-3 text-[11px] leading-relaxed text-white/90">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}
