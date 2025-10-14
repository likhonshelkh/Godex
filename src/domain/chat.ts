export type ChatRole = "user" | "assistant" | "system" | "tool";

export interface MetadataEntry {
  label: string;
  value: string;
}

export type ChatMessageStatus = "queued" | "streaming" | "completed" | "errored";

export interface ChatToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ChatToolInvocationStateCall {
  state: "call";
  args: Record<string, unknown>;
}

export interface ChatToolInvocationStateResult {
  state: "result";
  result: unknown;
}

export type ChatToolInvocationState =
  | ChatToolInvocationStateCall
  | ChatToolInvocationStateResult;

export interface ChatToolInvocation {
  toolName: string;
  toolCallId: string;
  state: ChatToolInvocationState["state"];
  args?: Record<string, unknown>;
  result?: unknown;
}

export interface ChatMessageReasoningPart {
  type: "reasoning";
  reasoning: string;
}

export interface ChatMessageTextPart {
  type: "text";
  text: string;
}

export interface ChatMessageToolInvocationPart {
  type: "tool-invocation";
  toolInvocation: ChatToolInvocation;
}

export type ChatMessagePart =
  | ChatMessageReasoningPart
  | ChatMessageTextPart
  | ChatMessageToolInvocationPart;

export interface ChatMessageAttachment {
  id?: string;
  name?: string;
  type: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatMessageOptions {
  id?: string;
  role: ChatRole;
  content?: string;
  parts?: ChatMessagePart[];
  attachments?: ChatMessageAttachment[];
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
  status: ChatMessageStatus;
  isStreaming: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
  readonly toolCall: ChatToolCall | null;
  private _parts: ChatMessagePart[];
  private _attachments: ChatMessageAttachment[];

  constructor({
    id,
    role,
    content = "",
    parts,
    attachments,
    status = "queued",
    isStreaming = false,
    toolCall = null,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: ChatMessageOptions) {
    this.id = id ?? createId(role);
    this.role = role;
    this._parts = normalizeParts(parts, content);
    this._attachments = normalizeAttachments(attachments);
    this.status = status;
    this.isStreaming = isStreaming;
    this.toolCall = toolCall;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static user(content: string) {
    return new ChatMessage({
      role: "user",
      parts: content ? [createTextPart(content)] : [],
      status: "completed",
    });
  }

  static assistantPlaceholder() {
    return new ChatMessage({
      role: "assistant",
      status: "streaming",
      isStreaming: true,
      parts: [],
    });
  }

  get parts(): ChatMessagePart[] {
    return this._parts.map(clonePart);
  }

  get attachments(): ChatMessageAttachment[] {
    return this._attachments.map((attachment) => ({ ...attachment }));
  }

  get content() {
    return extractTextFromParts(this._parts);
  }

  append(delta: string) {
    if (!delta) {
      return;
    }

    const last = this._parts[this._parts.length - 1];
    if (last && last.type === "text") {
      last.text += delta;
    } else {
      this._parts.push(createTextPart(delta));
    }
    this.touch();
  }

  complete(finalContent?: string) {
    if (typeof finalContent === "string") {
      this._parts = normalizeParts(undefined, finalContent);
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

  updateParts(parts: ChatMessagePart[]) {
    this._parts = normalizeParts(parts);
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }
}

export interface ChatMessageSnapshot {
  id: string;
  role: ChatRole;
  parts?: ChatMessagePart[];
  attachments?: ChatMessageAttachment[];
  content?: string;
  status: ChatMessageStatus;
  isStreaming: boolean;
  toolCall: ChatToolCall | null;
  createdAt: string;
  updatedAt: string;
}

export function serializeMessage(message: ChatMessage): ChatMessageSnapshot {
  return {
    id: message.id,
    role: message.role,
    parts: message.parts,
    attachments: message.attachments,
    content: message.content,
    status: message.status,
    isStreaming: message.isStreaming,
    toolCall: message.toolCall,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  };
}

export function deserializeMessage(snapshot: ChatMessageSnapshot): ChatMessage {
  return new ChatMessage({
    id: snapshot.id,
    role: snapshot.role,
    parts: snapshot.parts,
    attachments: snapshot.attachments,
    content: snapshot.content,
    status: snapshot.status,
    isStreaming: snapshot.isStreaming,
    toolCall: snapshot.toolCall,
    createdAt: new Date(snapshot.createdAt),
    updatedAt: new Date(snapshot.updatedAt),
  });
}

function normalizeParts(parts?: ChatMessagePart[], fallbackContent?: string) {
  if (parts && parts.length > 0) {
    return parts.map(clonePart);
  }

  if (fallbackContent && fallbackContent.length > 0) {
    return [createTextPart(fallbackContent)];
  }

  return [];
}

function normalizeAttachments(attachments?: ChatMessageAttachment[]) {
  if (!attachments) {
    return [];
  }

  return attachments.map((attachment) => ({ ...attachment }));
}

function createTextPart(text: string): ChatMessageTextPart {
  return { type: "text", text };
}

function clonePart(part: ChatMessagePart): ChatMessagePart {
  if (part.type === "text") {
    return { type: "text", text: part.text };
  }

  if (part.type === "reasoning") {
    return { type: "reasoning", reasoning: part.reasoning };
  }

  return {
    type: "tool-invocation",
    toolInvocation: {
      toolName: part.toolInvocation.toolName,
      toolCallId: part.toolInvocation.toolCallId,
      state: part.toolInvocation.state,
      args: part.toolInvocation.args ? { ...part.toolInvocation.args } : undefined,
      result:
        part.toolInvocation.result !== undefined
          ? deepClone(part.toolInvocation.result)
          : undefined,
    },
  };
}

function extractTextFromParts(parts: ChatMessagePart[]) {
  return parts
    .filter((part): part is ChatMessageTextPart => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
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
