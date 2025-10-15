# Phase 01 – Landing layout extraction (landing-layout-standardization)

> **STOP: after completing these tasks, await verification before continuing.**

## Goal
Introduce a reusable landing layout shell so future marketing surfaces can mount sections with a shared header, navigation, and framing utilities.

## Deliverables
- `src/components/sections/LandingLayout.tsx`: exports a typed `LandingLayout` component that renders the existing Godex header, navigation links, CTA badge, and wraps children inside the styled container.
- `src/App.tsx`: updated to consume `LandingLayout` and supply marketing sections as children while preserving anchor targets (`#features`, `#workflow`, `#showcase`, `#chat`, `#stories`, `#cta`).
- `src/components/sections/index.ts`: (create or update) re-export `LandingLayout` alongside existing sections for consolidated imports.

## Checklist (implementer)
- [ ] `LandingLayout` accepts typed `navLinks` and `cta` props with sensible defaults for the Godex landing page.
- [ ] Header markup matches prior structure (brand glyph, label, strapline, nav links, CTA/status line) and remains responsive.
- [ ] `App.tsx` no longer implements its own header wrapper logic directly.
- [ ] Tailwind classes for spacing/gaps remain consistent with prior layout to avoid regressions.

## Self-verify
Run:
- `npm run typecheck`

STOP. Wait for Phase 01 verification.
