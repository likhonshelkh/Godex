# Phase 04a – Verification of Console UI integration (agent-console-v1)

## Verification Steps
1. Confirm all checklist boxes in `04-ui-integration.md` are checked.
2. Run `npm run typecheck` and `npm run build`; both must succeed.
3. Execute `npx vitest run src/services/__tests__/godexClient.spec.ts` and ensure all tests pass.
4. Capture a development preview screenshot verifying the chat console states (streaming, completed, error). Use project tooling to attach the artifact.
5. Validate README updates: `rg "live console" README.md` should locate the new documentation snippet.

## Outcome
- Emit `✅` if all verifications succeed.
- Otherwise, enumerate each failing step prefixed by `❌`.
