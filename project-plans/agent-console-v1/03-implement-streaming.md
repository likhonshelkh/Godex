# Phase 03 – Implement streaming orchestration (agent-console-v1)

> **STOP: complete implementation, then await verification before merging.**

## Goal
Replace stubs with working logic that streams reasoning updates from the orchestrator, persists session state, and coordinates stop/resume semantics for the Godex console.

## Deliverables
- `lib/server/agent-orchestrator.ts`: implement real orchestration using `EventSource`-compatible streaming with retry/backoff support and integration hooks for future Gemini backends.
- `src/services/godexClient.ts`: wire REST + SSE requests using `fetch` with AbortController, bridging responses into the existing `ChatSession` interface.
- `src/services/chatSession.ts`: update to consume the new client, including dependency injection to ease testing.
- `src/hooks/useChatSession.ts`: adjust hook to use dependency-injected client (if needed) while preserving existing API.
- Add any supporting utilities (e.g., `src/utils/stream.ts`) needed for clean separation of concerns.

## Checklist (implementer)
- [ ] All Phase 02 tests pass locally.
- [ ] Streaming resumes with stored cursor IDs and handles network dropouts gracefully (tested via mocks).
- [ ] Stop action cancels inflight fetch and surfaces a friendly message.
- [ ] No TODO stubs remain for the implemented functions.

## Self-verify
Run:
- `npm run test:services`
- `npm run typecheck`

STOP. Wait for Phase 03 verification.
