# Phase 01 – Stub streaming backend (agent-console-v1)

> **STOP: complete every task in this phase, then halt and await verification before continuing.**

## Goal
Prepare the Godex console for a production-ready reasoning pipeline by scaffolding backend integration points and client adapters that currently throw `NotYetImplemented` while compiling cleanly.

## Deliverables
- `src/domain/errors.ts`: export a typed `NotYetImplementedError` factory to standardize stub exceptions.
- `lib/server/agent-orchestrator.ts`: add a module that exposes `createAgentOrchestrator()` returning an object with stubbed `start`, `resume`, and `stop` methods that throw `NotYetImplementedError`.
- `src/services/godexClient.ts`: create a typed API client with `streamConversation()` and `resumeConversation()` functions that currently throw `NotYetImplementedError`.
- `src/services/index.ts`: export the newly created client for downstream hooks.
- Update any necessary barrel files to ensure the new exports compile without unused warnings.

## Checklist (implementer)
- [ ] All new functions or methods throw `NotYetImplementedError` and include TODO comments referencing Phase 03 implementation.
- [ ] TypeScript builds without errors via `npm run typecheck`.
- [ ] No existing behaviour changes beyond the new stub modules and exports.

## Self-verify
Run the following before stopping:
- `npm run typecheck`

STOP. Wait for Phase 01 verification.
