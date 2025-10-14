# Phase 05 – Release readiness & documentation (agent-console-v1)

> **STOP: after completing these tasks, await verification before shipping.**

## Goal
Ensure the streaming console feature is production-ready with documentation, observability hooks, and rollout strategy.

## Deliverables
- `docs/agent-console/operations.md`: capture operational runbooks (restart procedures, env vars, monitoring dashboards).
- `src/services/telemetry.ts`: add lightweight telemetry hooks for stream start/stop/error events (no-op implementation acceptable with TODO for backend wiring).
- `CHANGELOG.md`: summarize feature, tests, and rollout considerations dated appropriately.
- Update `README.md` deployment section with environment variables required for the orchestrator and telemetry.

## Checklist (implementer)
- [ ] Telemetry module exports typed interfaces and no runtime side effects when disabled.
- [ ] Runbook documents retry strategy, failure modes, and alert thresholds.
- [ ] Changelog entry includes migration notes for env variables.
- [ ] README deploy steps mention both development and production configuration updates.

## Self-verify
Run:
- `npm run typecheck`
- `npm run test:services`

STOP. Wait for Phase 05 verification.
