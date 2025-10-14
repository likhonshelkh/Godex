export type ChatRole = "user" | "assistant" | "system" | "tool";

export type ChatMessageStatus = "queued" | "streaming" | "completed" | "errored";

export interface ChatToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ChatMessageOptions {
  id?: string;
  role: ChatRole;
  content?: string;
  status?: ChatMessageStatus;
  isStreaming?: boolean;
  toolCall?: ChatToolCall | null;
  createdAt?: Date;
  updatedAt?: Date;
}

let idCounter = 0;

function createId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export class ChatMessage {
  readonly id: string;
  readonly role: ChatRole;
  content: string;
  status: ChatMessageStatus;
  isStreaming: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
  readonly toolCall: ChatToolCall | null;

  constructor({
    id,
    role,
    content = "",
    status = "queued",
    isStreaming = false,
    toolCall = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: ChatMessageOptions) {
    this.id = id ?? createId(role);
    this.role = role;
    this.content = content;
    this.status = status;
    this.isStreaming = isStreaming;
    this.toolCall = toolCall;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static user(content: string) {
    return new ChatMessage({ role: "user", content, status: "completed" });
  }

  static assistantPlaceholder() {
    return new ChatMessage({ role: "assistant", status: "streaming", isStreaming: true });
  }

  append(delta: string) {
    this.content += delta;
    this.touch();
  }

  complete(finalContent?: string) {
    if (typeof finalContent === "string") {
      this.content = finalContent;
    }
    this.status = "completed";
    this.isStreaming = false;
    this.touch();
  }

  fail() {
    this.status = "errored";
    this.isStreaming = false;
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }
}

export interface StreamDeltaEvent {
  type: "delta";
  delta: string;
}

export interface StreamStatusEvent {
  type: "status";
  status: ChatMessageStatus;
}

export interface StreamErrorEvent {
  type: "error";
  message: string;
}

export interface StreamMetadataEvent {
  type: "metadata";
  label: string;
  value: string;
}

export type ChatStreamEvent =
  | StreamDeltaEvent
  | StreamStatusEvent
  | StreamErrorEvent
  | StreamMetadataEvent;

export interface StartStreamPayload {
  messages: ChatMessage[];
  conversationId?: string;
}
