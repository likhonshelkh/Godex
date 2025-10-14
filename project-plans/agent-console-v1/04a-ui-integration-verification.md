# Phase 04a – Verification of Console UI integration (agent-console-v1)

## Verification Steps
1. Confirm all checklist boxes in `04-ui-integration.md` are checked.
2. Run `npm run typecheck` and `npm run build`; both must succeed.
3. Execute `npm run test:services` and ensure all tests pass.
4. Confirm screenshot evidence exists: `test -f reports/phase-04a-console-states.png` after capturing streaming, completed, and errored states from the dev server.
5. Validate README updates: `rg "live console" README.md` should locate the new documentation snippet.

## Outcome
- Emit `✅` if all verifications succeed.
- Otherwise, enumerate each failing step prefixed by `❌`.
