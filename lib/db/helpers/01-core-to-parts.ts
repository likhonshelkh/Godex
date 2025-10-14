import "dotenv/config";
import { createClient } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import type {
  ChatMessageAttachment,
  ChatMessagePart,
  ChatMessageReasoningPart,
  ChatMessageTextPart,
  ChatMessageToolInvocationPart,
} from "../../../src/domain/chat";
import {
  message,
  messageDeprecated,
  vote,
  voteDeprecated,
} from "../schema";

interface LegacyContentRecord {
  type?: string;
  text?: unknown;
  content?: unknown;
  reasoning?: unknown;
  attachments?: unknown;
  parts?: unknown;
  toolInvocation?: unknown;
  toolName?: unknown;
  toolCallId?: unknown;
  state?: unknown;
  args?: unknown;
  result?: unknown;
}

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required for migration");
  }

  const client = createClient({ connectionString });
  await client.connect();

  const db = drizzle(client);

  try {
    await db.transaction(async (tx) => {
      const legacyMessages = await tx.select().from(messageDeprecated);
      console.log(`Found ${legacyMessages.length} legacy messages.`);

      for (const legacy of legacyMessages) {
        const { parts, attachments } = transformLegacyContent(legacy.content);
        await tx
          .insert(message)
          .values({
            id: legacy.id,
            chatId: legacy.chatId,
            role: legacy.role,
            parts,
            attachments,
            createdAt: legacy.createdAt,
          })
          .onConflictDoUpdate({
            target: message.id,
            set: {
              chatId: legacy.chatId,
              role: legacy.role,
              parts,
              attachments,
              createdAt: legacy.createdAt,
            },
          });
      }

      const legacyVotes = await tx.select().from(voteDeprecated);
      console.log(`Found ${legacyVotes.length} legacy votes.`);

      for (const legacyVote of legacyVotes) {
        await tx
          .insert(vote)
          .values({
            chatId: legacyVote.chatId,
            messageId: legacyVote.messageId,
            isUpvoted: legacyVote.isUpvoted,
          })
          .onConflictDoUpdate({
            target: [vote.chatId, vote.messageId],
            set: {
              isUpvoted: legacyVote.isUpvoted,
            },
          });
      }
    });

    console.log("Migration complete.");
  } finally {
    await client.end();
  }
}

function transformLegacyContent(value: unknown) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as LegacyContentRecord;
    const attachments = normalizeAttachments(record.attachments);

    if (Array.isArray(record.parts)) {
      return { parts: normalizeParts(record.parts), attachments };
    }

    if (Array.isArray(record.content)) {
      return { parts: normalizeParts(record.content), attachments };
    }

    if (typeof record.content === "string") {
      return {
        parts: record.content ? [createTextPart(record.content)] : [],
        attachments,
      };
    }

    const maybePart = toPart(record);
    if (maybePart) {
      return { parts: [maybePart], attachments };
    }
  }

  if (Array.isArray(value)) {
    return { parts: normalizeParts(value), attachments: [] };
  }

  if (typeof value === "string") {
    return { parts: value ? [createTextPart(value)] : [], attachments: [] };
  }

  return { parts: [], attachments: [] };
}

function normalizeParts(parts: unknown[]): ChatMessagePart[] {
  const result: ChatMessagePart[] = [];
  for (const part of parts) {
    const transformed = toPart(part);
    if (transformed) {
      result.push(transformed);
    }
  }
  return result;
}

function normalizeAttachments(value: unknown): ChatMessageAttachment[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "object" && item ? { ...(item as ChatMessageAttachment) } : null))
    .filter((item): item is ChatMessageAttachment => item !== null);
}

function toPart(value: unknown): ChatMessagePart | null {
  if (typeof value === "string") {
    return value ? createTextPart(value) : null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as LegacyContentRecord;
  const type = typeof record.type === "string" ? record.type : undefined;

  if (type === "text" && typeof record.text === "string") {
    return createTextPart(record.text);
  }

  if (type === "reasoning" && typeof record.reasoning === "string") {
    return { type: "reasoning", reasoning: record.reasoning } satisfies ChatMessageReasoningPart;
  }

  if (type === "tool-invocation") {
    return createToolInvocationPart(record.toolInvocation ?? record);
  }

  if ((type === "tool_call" || type === "tool-call") && record.toolName) {
    return createToolInvocationPart(record);
  }

  if (typeof record.content === "string") {
    return record.content ? createTextPart(record.content) : null;
  }

  if (Array.isArray(record.parts)) {
    const nested = normalizeParts(record.parts);
    if (nested.length === 1) {
      return nested[0];
    }
    if (nested.length > 1) {
      return { type: "text", text: nested.map((item) => (item.type === "text" ? item.text : "")).join("") };
    }
  }

  return null;
}

function createTextPart(text: string): ChatMessageTextPart {
  return { type: "text", text };
}

function createToolInvocationPart(value: unknown): ChatMessageToolInvocationPart | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as LegacyContentRecord & { toolInvocation?: LegacyContentRecord };
  const source = (record.toolInvocation ?? record) as LegacyContentRecord;
  const toolName = typeof source.toolName === "string" ? source.toolName : undefined;
  const toolCallId = typeof source.toolCallId === "string" ? source.toolCallId : undefined;
  const state = source.state === "result" ? "result" : "call";

  if (!toolName || !toolCallId) {
    return null;
  }

  const args = source.args && typeof source.args === "object" ? source.args : undefined;
  const result = source.result;

  const part: ChatMessageToolInvocationPart = {
    type: "tool-invocation",
    toolInvocation: {
      toolName,
      toolCallId,
      state,
      args: state === "call" ? (args as Record<string, unknown> | undefined) : undefined,
      result: state === "result" ? result : undefined,
    },
  };

  return part;
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
