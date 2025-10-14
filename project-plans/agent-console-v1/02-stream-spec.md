# Phase 02 – Streaming contract tests (agent-console-v1)

> **STOP: do not proceed to later phases until these tests are written and committed.**

## Goal
Define executable specifications that describe how the Godex client should interact with the orchestrator through streaming events and persistence.

## Deliverables
- `vitest.config.ts`: introduce a Vitest configuration aligned with the existing Vite setup.
- `src/services/__tests__/godexClient.spec.ts`: author tests covering `streamConversation()` and `resumeConversation()` behaviour, mocking network transports and ensuring correct event forwarding.
- `src/services/__tests__/__fixtures__/streaming.ts`: reusable helpers for fake SSE payloads and transcript assembly.

## Checklist (implementer)
- [ ] Tests cover happy path streaming, error handling, resume semantics, and `stop()` cancellation hooks.
- [ ] No tests assert stubbed `NotYetImplemented` behaviour; all expectations describe the eventual implementation.
- [ ] Tests are deterministic and rely only on in-memory mocks.

## Self-verify
Run the following and observe failing tests (expected at this phase):
- `npx vitest run src/services/__tests__/godexClient.spec.ts`

STOP. Wait for Phase 02 verification.
