# Phase 05a – Verification of Release readiness & documentation (agent-console-v1)

## Verification Steps
1. Confirm all checklist boxes in `05-release-readiness.md` are checked.
2. Run `npm run typecheck` and `npm run test:services`; both must pass.
3. Validate documentation updates:
   - `test -f docs/agent-console/operations.md`
   - `rg "telemetry" src/services/telemetry.ts` to confirm event hooks exist.
   - `rg "orchestrator" README.md` to ensure deployment notes reference the new service.
4. Review `CHANGELOG.md` for a dated entry describing the streaming console rollout.

## Outcome
- Emit `✅` if all steps succeed.
- Otherwise, list each failing verification prefixed with `❌`.
