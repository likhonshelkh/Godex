# Phase 02a – Verification of Streaming contract tests (agent-console-v1)

## Verification Steps
1. Ensure every checklist item in `02-stream-spec.md` is checked.
2. Run `npm run test:services` and confirm tests fail with clear `NotYetImplemented` errors (expected at this phase).
3. Inspect tests for reverse assertions: `rg "NotYetImplemented" src/services/__tests__/godexClient.spec.ts` must return zero matches.
   - Verify Vitest dependency wiring: `node -e "console.log(require('./package.json').devDependencies?.vitest)"` should print the pinned version installed in Phase 02.
4. Check fixtures for deterministic timers: `rg "setTimeout" src/services/__tests__/__fixtures__/streaming.ts` should show explicit mocked timers or comments justifying usage.

## Outcome
- Emit `✅` when all checks pass.
- Otherwise, list failing verifications prefixed with `❌`.
