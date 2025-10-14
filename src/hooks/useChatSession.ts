import { useCallback, useEffect, useReducer, useRef } from "react";
import type { MetadataEntry } from "../domain/chat";
import {
  ChatMessage,
  ChatMessageStatus,
  ChatStreamEvent,
  deserializeMessage,
  serializeMessage,
} from "../domain/chat";
import { ChatSession, createAssistantPlaceholder } from "../services/chatSession";
import type { StoredChatState } from "../services/chatStorage";
import { loadChatState, saveChatState } from "../services/chatStorage";

interface ChatState {
  messages: ChatMessage[];
  metadata: MetadataEntry[];
  isStreaming: boolean;
  error: string | null;
  activeMessageId?: string;
}

type Action =
  | { type: "PUSH_MESSAGE"; message: ChatMessage }
  | { type: "START_STREAM"; placeholder: ChatMessage }
  | { type: "APPEND_DELTA"; id: string; delta: string }
  | { type: "SET_STATUS"; id: string; status: ChatMessageStatus }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "ADD_METADATA"; entry: MetadataEntry }
  | { type: "RESET_STREAM" }
  | { type: "RESET_METADATA" };

const initialState: ChatState = {
  messages: [],
  metadata: [],
  isStreaming: false,
  error: null,
  activeMessageId: undefined,
};

function initializeState(): ChatState {
  if (typeof window === "undefined") {
    return initialState;
  }

  const stored = loadChatState();
  if (!stored) {
    return initialState;
  }

  return {
    messages: stored.messages.map(deserializeMessage),
    metadata: stored.metadata,
    isStreaming: stored.isStreaming,
    error: null,
    activeMessageId: stored.activeMessageId,
  };
}

function cloneMessage(message: ChatMessage) {
  return new ChatMessage({
    id: message.id,
    role: message.role,
    parts: message.parts,
    attachments: message.attachments,
    status: message.status,
    isStreaming: message.isStreaming,
    toolCall: message.toolCall,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  });
}

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "PUSH_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    case "START_STREAM":
      return {
        ...state,
        messages: [...state.messages, action.placeholder],
        activeMessageId: action.placeholder.id,
        isStreaming: true,
        error: null,
      };
    case "APPEND_DELTA":
      return {
        ...state,
        messages: state.messages.map((message) => {
          if (message.id !== action.id) {
            return message;
          }
          const next = cloneMessage(message);
          next.append(action.delta);
          return next;
        }),
      };
    case "SET_STATUS":
      return {
        ...state,
        messages: state.messages.map((message) => {
          if (message.id !== action.id) {
            return message;
          }
          const next = cloneMessage(message);
          if (action.status === "completed") {
            next.complete();
          } else if (action.status === "errored") {
            next.fail();
          } else {
            next.status = action.status;
            next.isStreaming = action.status === "streaming";
          }
          return next;
        }),
        isStreaming: action.status === "streaming",
        activeMessageId:
          action.status === "completed" || action.status === "errored"
            ? undefined
            : state.activeMessageId,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        isStreaming: action.error ? false : state.isStreaming,
        activeMessageId: action.error ? undefined : state.activeMessageId,
      };
    case "ADD_METADATA": {
      const filtered = state.metadata.filter(
        (entry) => entry.label !== action.entry.label,
      );
      return {
        ...state,
        metadata: [...filtered, action.entry],
      };
    }
    case "RESET_STREAM":
      return {
        ...state,
        isStreaming: false,
        activeMessageId: undefined,
      };
    case "RESET_METADATA":
      return {
        ...state,
        metadata: [],
      };
    default:
      return state;
  }
}

export function useChatSession() {
  const [state, dispatch] = useReducer(reducer, initialState, initializeState);
  const sessionRef = useRef<ChatSession | null>(null);

  if (!sessionRef.current) {
    sessionRef.current = new ChatSession();
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const snapshot: StoredChatState = {
      messages: state.messages.map(serializeMessage),
      metadata: state.metadata,
      isStreaming: state.isStreaming,
      activeMessageId: state.activeMessageId,
    };

    saveChatState(snapshot);
  }, [state.messages, state.metadata, state.isStreaming, state.activeMessageId]);

  useEffect(() => {
    const session = sessionRef.current;
    return () => {
      session?.stop();
    };
  }, []);

  const handleStreamEvent = useCallback(
    (id: string) =>
      (event: ChatStreamEvent) => {
        if (event.type === "delta") {
          dispatch({ type: "APPEND_DELTA", id, delta: event.delta });
        }
        if (event.type === "status") {
          dispatch({ type: "SET_STATUS", id, status: event.status });
          if (event.status === "completed" || event.status === "errored") {
            dispatch({ type: "RESET_STREAM" });
          }
        }
        if (event.type === "error") {
          dispatch({ type: "SET_STATUS", id, status: "errored" });
          dispatch({ type: "SET_ERROR", error: event.message });
          dispatch({ type: "RESET_STREAM" });
        }
        if (event.type === "metadata") {
          dispatch({ type: "ADD_METADATA", entry: event });
        }
      },
    [],
  );

  const sendMessage = useCallback(
    (content: string) => {
      const session = sessionRef.current;
      if (!session) {
        return;
      }

      const trimmed = content.trim();
      if (!trimmed) {
        return;
      }

      const userMessage = ChatMessage.user(trimmed);
      const history = [...state.messages, userMessage];

      dispatch({ type: "PUSH_MESSAGE", message: userMessage });
      dispatch({ type: "RESET_METADATA" });

      const assistantPlaceholder = createAssistantPlaceholder();
      dispatch({ type: "START_STREAM", placeholder: assistantPlaceholder });

      session.startStream(
        { messages: history },
        {
          messageId: assistantPlaceholder.id,
          onEvent: handleStreamEvent(assistantPlaceholder.id),
          onError: (message) => dispatch({ type: "SET_ERROR", error: message }),
          onClose: () => dispatch({ type: "RESET_STREAM" }),
        },
      );
    },
    [handleStreamEvent, state.messages],
  );

  const resume = useCallback(() => {
    const session = sessionRef.current;
    if (!session || !state.isStreaming || !state.activeMessageId) {
      return false;
    }

    return session.resume({
      messageId: state.activeMessageId,
      onEvent: handleStreamEvent(state.activeMessageId),
      onError: (message) => dispatch({ type: "SET_ERROR", error: message }),
      onClose: () => dispatch({ type: "RESET_STREAM" }),
    });
  }, [handleStreamEvent, state.activeMessageId, state.isStreaming]);

  const stop = useCallback(() => {
    const session = sessionRef.current;
    if (!session) {
      return;
    }

    session.stop();

    if (state.activeMessageId) {
      dispatch({ type: "SET_STATUS", id: state.activeMessageId, status: "errored" });
      dispatch({ type: "SET_ERROR", error: "Generation stopped by user." });
    }

    dispatch({ type: "RESET_STREAM" });
  }, [state.activeMessageId]);

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", error: null });
  }, []);

  return {
    messages: state.messages,
    metadata: state.metadata,
    isStreaming: state.isStreaming,
    error: state.error,
    sendMessage,
    resume,
    stop,
    clearError,
  };
}
