import type { ChatMessageSnapshot, MetadataEntry } from "../domain/chat";

const CHAT_STATE_KEY = "godex.chat.state";
const ACTIVE_STREAM_KEY = "godex.chat.activeStream";

type ActiveStreamMode = "sse" | "fallback";

export interface StoredChatState {
  messages: ChatMessageSnapshot[];
  metadata: MetadataEntry[];
  isStreaming: boolean;
  activeMessageId?: string;
}

export interface ActiveStreamState {
  conversationId: string;
  messageId: string;
  mode: ActiveStreamMode;
  lastEventId?: string;
  fallbackIndex?: number;
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadChatState(): StoredChatState | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(CHAT_STATE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredChatState;
  } catch (error) {
    console.warn("Failed to parse stored chat state", error);
    return null;
  }
}

export function saveChatState(state: StoredChatState) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to persist chat state", error);
  }
}

export function clearChatState() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(CHAT_STATE_KEY);
}

export function loadActiveStreamState(): ActiveStreamState | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(ACTIVE_STREAM_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ActiveStreamState;
  } catch (error) {
    console.warn("Failed to parse active stream state", error);
    return null;
  }
}

export function saveActiveStreamState(state: ActiveStreamState) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(ACTIVE_STREAM_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to persist active stream state", error);
  }
}

export function clearActiveStreamState() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACTIVE_STREAM_KEY);
}
