# Phase 01a – Verification of landing layout extraction (landing-layout-standardization)

## Verification Steps
1. Run `npm run typecheck` and confirm it exits successfully.
2. Inspect `src/components/sections/LandingLayout.tsx` to ensure it exports a `LandingLayout` component with typed `navLinks`/`cta` props and default values.
3. Confirm `src/App.tsx` imports `LandingLayout` and no longer contains inline header markup (grep for `header className="flex items-center` should return zero matches in `src/App.tsx`).
4. Verify `src/components/sections/index.ts` re-exports `LandingLayout`.

## Outcome
- Emit `✅` if all checks pass.
- Otherwise list each failure prefixed with `❌` and halt.
