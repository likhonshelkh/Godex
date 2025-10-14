import {
  ChatMessage,
  ChatStreamEvent,
  StartStreamPayload,
} from "../domain/chat";
import {
  clearActiveStreamState,
  loadActiveStreamState,
  saveActiveStreamState,
} from "./chatStorage";

export interface StreamHandlers {
  messageId: string;
  onEvent: (event: ChatStreamEvent) => void;
  onError?: (message: string) => void;
  onClose?: () => void;
}

export class ChatSession {
  private eventSource?: EventSource;
  private fallbackTimer?: ReturnType<typeof setTimeout>;
  private readonly endpoint: string;
  private conversationId?: string;

  constructor(endpoint = "/api/godex/stream") {
    this.endpoint = endpoint;
  }

  startStream(payload: StartStreamPayload, handlers: StreamHandlers) {
    const conversationId = this.resolveConversationId(payload.conversationId);

    this.closeConnections();
    clearActiveStreamState();

    if (typeof window === "undefined") {
      this.runFallback(handlers, conversationId);
      return;
    }

    if ("EventSource" in window) {
      try {
        this.openEventSource({
          url: this.createUrl({ conversationId, payload }),
          handlers,
          conversationId,
        });
        handlers.onEvent({ type: "status", status: "streaming" });
        saveActiveStreamState({
          conversationId,
          messageId: handlers.messageId,
          mode: "sse",
        });
        return;
      } catch (error) {
        handlers.onError?.("Unable to connect to streaming endpoint. Showing preview response.");
      }
    }

    this.runFallback(handlers, conversationId);
  }

  resume(handlers: StreamHandlers): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    const stored = loadActiveStreamState();
    if (!stored) {
      return false;
    }

    this.conversationId = stored.conversationId;
    this.closeConnections();

    if (stored.mode === "fallback") {
      this.runFallback(handlers, stored.conversationId, stored.fallbackIndex ?? 0);
      return true;
    }

    try {
      this.openEventSource({
        url: this.createUrl({
          conversationId: stored.conversationId,
          resume: true,
          lastEventId: stored.lastEventId,
        }),
        handlers,
        conversationId: stored.conversationId,
      });
      handlers.onEvent({ type: "status", status: "streaming" });
      saveActiveStreamState({
        conversationId: stored.conversationId,
        messageId: handlers.messageId,
        mode: "sse",
        lastEventId: stored.lastEventId,
      });
      return true;
    } catch (error) {
      handlers.onError?.(
        "Unable to reconnect to streaming endpoint. Resuming preview response.",
      );
      this.runFallback(handlers, stored.conversationId, stored.fallbackIndex ?? 0);
      return true;
    }
  }

  stop() {
    this.closeConnections();
    clearActiveStreamState();
  }

  private closeConnections() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }

    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = undefined;
    }
  }

  private resolveConversationId(provided?: string) {
    if (provided) {
      this.conversationId = provided;
      return provided;
    }

    if (this.conversationId) {
      return this.conversationId;
    }

    const id = this.generateConversationId();
    this.conversationId = id;
    return id;
  }

  private generateConversationId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }

    return `conversation-${Date.now()}`;
  }

  private createUrl({
    conversationId,
    payload,
    resume = false,
    lastEventId,
  }: {
    conversationId: string;
    payload?: StartStreamPayload;
    resume?: boolean;
    lastEventId?: string;
  }) {
    const url = new URL(this.endpoint, window.location.origin);

    if (payload) {
      const history = payload.messages.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      url.searchParams.set("messages", JSON.stringify(history));
    }

    url.searchParams.set("conversationId", conversationId);

    if (resume) {
      url.searchParams.set("resume", "1");
    }

    if (lastEventId) {
      url.searchParams.set("lastEventId", lastEventId);
    }

    return url.toString();
  }

  private openEventSource({
    url,
    handlers,
    conversationId,
  }: {
    url: string;
    handlers: StreamHandlers;
    conversationId: string;
  }) {
    const source = new EventSource(url);
    this.eventSource = source;

    source.onmessage = (event) => {
      let parsed: ChatStreamEvent | null = null;
      let shouldPersist = true;

      try {
        parsed = JSON.parse(event.data) as ChatStreamEvent;
      } catch (error) {
        parsed = null;
      }

      if (parsed) {
        handlers.onEvent(parsed);

        if (parsed.type === "status" && parsed.status !== "streaming") {
          clearActiveStreamState();
          shouldPersist = false;
        }

        if (parsed.type === "error") {
          clearActiveStreamState();
          shouldPersist = false;
        }
      } else {
        handlers.onEvent({ type: "delta", delta: event.data });
      }

      if (!shouldPersist) {
        return;
      }

      const lastEventId = event.lastEventId || undefined;
      saveActiveStreamState({
        conversationId,
        messageId: handlers.messageId,
        mode: "sse",
        lastEventId,
      });
    };

    source.onerror = () => {
      handlers.onError?.("Connection lost. Falling back to local preview stream.");
      this.closeConnections();
      this.runFallback(handlers, conversationId);
    };
  }

  private runFallback(
    handlers: StreamHandlers,
    conversationId: string,
    startIndex = 0,
  ) {
    const script = [
      "Synthesizing mission context and prioritizing blockers…",
      "Queueing environment diagnostics and dependency checks…",
      "Planning execution timeline with parallel validation tracks…",
      "Packaging deliverables and next actions for the team.",
    ];

    this.closeConnections();
    this.conversationId = conversationId;

    if (startIndex >= script.length) {
      clearActiveStreamState();
      handlers.onEvent({ type: "status", status: "completed" });
      handlers.onClose?.();
      return;
    }

    handlers.onEvent({ type: "status", status: "streaming" });

    let index = startIndex;

    saveActiveStreamState({
      conversationId,
      messageId: handlers.messageId,
      mode: "fallback",
      fallbackIndex: index,
    });

    const push = () => {
      if (index < script.length) {
        const delta = `${script[index]}\n\n`;
        handlers.onEvent({ type: "delta", delta });
        index += 1;

        saveActiveStreamState({
          conversationId,
          messageId: handlers.messageId,
          mode: "fallback",
          fallbackIndex: index,
        });

        if (index < script.length) {
          this.fallbackTimer = setTimeout(push, 650);
          return;
        }
      }

      clearActiveStreamState();
      handlers.onEvent({ type: "status", status: "completed" });
      handlers.onClose?.();
    };

    push();
  }
}

export function createAssistantPlaceholder() {
  return ChatMessage.assistantPlaceholder();
}
