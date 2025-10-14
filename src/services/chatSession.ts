import {
  ChatMessage,
  ChatStreamEvent,
  StartStreamPayload,
} from "../domain/chat";

export interface StreamHandlers {
  onEvent: (event: ChatStreamEvent) => void;
  onError?: (message: string) => void;
  onClose?: () => void;
}

export class ChatSession {
  private eventSource?: EventSource;
  private fallbackTimer?: ReturnType<typeof setTimeout>;
  private readonly endpoint: string;

  constructor(endpoint = "/api/godex/stream") {
    this.endpoint = endpoint;
  }

  startStream(payload: StartStreamPayload, handlers: StreamHandlers) {
    this.stop();

    if (typeof window === "undefined") {
      this.runFallback(handlers);
      return;
    }

    if ("EventSource" in window) {
      try {
        const url = this.createUrl(payload);
        this.eventSource = new EventSource(url);
        handlers.onEvent({ type: "status", status: "streaming" });

        this.eventSource.onmessage = (event) => {
          try {
            const data: ChatStreamEvent = JSON.parse(event.data);
            handlers.onEvent(data);
          } catch (error) {
            handlers.onEvent({ type: "delta", delta: event.data });
          }
        };

        this.eventSource.onerror = () => {
          handlers.onError?.("Connection lost. Falling back to local preview stream.");
          this.stop();
          this.runFallback(handlers);
        };

        return;
      } catch (error) {
        handlers.onError?.("Unable to connect to streaming endpoint. Showing preview response.");
      }
    }

    this.runFallback(handlers);
  }

  stop() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }

    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = undefined;
    }
  }

  private createUrl(payload: StartStreamPayload) {
    const url = new URL(this.endpoint, window.location.origin);
    const history = payload.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    url.searchParams.set("messages", JSON.stringify(history));

    if (payload.conversationId) {
      url.searchParams.set("conversationId", payload.conversationId);
    }

    return url.toString();
  }

  private runFallback(handlers: StreamHandlers) {
    const script = [
      "Synthesizing mission context and prioritizing blockers…",
      "Queueing environment diagnostics and dependency checks…",
      "Planning execution timeline with parallel validation tracks…",
      "Packaging deliverables and next actions for the team." ,
    ];

    handlers.onEvent({ type: "status", status: "streaming" });

    let index = 0;

    const push = () => {
      if (index < script.length) {
        const delta = `${script[index]}\n\n`;
        handlers.onEvent({ type: "delta", delta });
        index += 1;
        this.fallbackTimer = setTimeout(push, 650);
        return;
      }

      handlers.onEvent({ type: "status", status: "completed" });
      handlers.onClose?.();
    };

    push();
  }
}

export function createAssistantPlaceholder() {
  return ChatMessage.assistantPlaceholder();
}
