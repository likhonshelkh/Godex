# Phase 04 – Console UI integration (agent-console-v1)

> **STOP: finish tasks, then pause for verification before releasing.**

## Goal
Expose the new streaming orchestration through the marketing demo console, ensuring metadata side panels and transcript visuals react to real agent output.

## Deliverables
- `src/components/sections/Chat/ChatShell.tsx`: inject the implemented client through context or props, and surface errors/resume states with updated copy.
- `src/components/sections/Chat/ChatComposer.tsx`: wire loading/disabled states based on streaming progress and support a retry action.
- `src/components/sections/Chat/ChatSidePanel.tsx`: show structured metadata (timeline, environments, blockers) emitted by the orchestrator.
- `src/styles/tokens.css` (or relevant file): add tokens/utilities required for new status badges.
- Update documentation snippet in `README.md` to describe the live console behaviour.

## Checklist (implementer)
- [ ] Chat transcript visually distinguishes streaming, completed, and errored messages.
- [ ] Side panel gracefully handles zero metadata entries without layout shifts.
- [ ] Composer retry button only appears when a recoverable error is present.
- [ ] README summary accurately reflects the new interactive experience.

## Self-verify
Run:
- `npm run typecheck`
- `npx vitest run src/services/__tests__/godexClient.spec.ts`
- `npm run build`

STOP. Wait for Phase 04 verification.
