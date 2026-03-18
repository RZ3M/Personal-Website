# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal portfolio website for Jack Ma. The entire visual identity is built around motorsport and rotary (Wankel) engine aesthetics — racing telemetry, tachometers, pit-board language, RPM readouts, H-pattern shifter navigation, and rotary/Wankel engine references. This is the product, not decoration. Do not neutralize or simplify the theme.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build (also validates runtime correctness)
npm run typecheck    # Strict TypeScript check (tsc --noEmit)
npm run start        # Serve production build
```

No test framework is configured. **Minimum validation for any change: `npm run typecheck && npm run build`**.

## Architecture

Next.js App Router with TypeScript strict mode. Single-page portfolio.

- `app/layout.tsx` — Root layout, Google Fonts (Orbitron, Rajdhani, Share Tech Mono)
- `app/page.tsx` — Renders `<PortfolioApp />`
- `app/globals.css` — All styles via CSS custom properties. Responsive breakpoints at 900px and 600px
- `app/icon.svg` — App icon
- `components/portfolio/PortfolioApp.tsx` — Top-level composition shell
- `components/portfolio/sections/` — Individual section components
- `components/portfolio/rotary-engine.ts` — Wankel engine canvas rendering (real epitrochoid math)
- `components/portfolio/TelemetryBar.tsx` — Fixed top telemetry strip
- `components/portfolio/HPatternShifter.tsx` — H-pattern shifter navigation
- `hooks/use-rotary-animation.ts` — Press-and-hold throttle, RPM-driven rumble, engine animation loop
- `hooks/use-cursor-system.ts` — Custom cursor dot + ring + throttle/hover states
- `hooks/use-particle-canvas.ts` — Background particle system
- `hooks/use-scroll-engine.ts` — Scroll-linked RPM input and active section tracking
- `hooks/use-tagline-typewriter.ts` — Hero typewriter effect
- `lib/rpm-engine.ts` — RPM model: RX-8-inspired 8-speed ratio ladder, limiter, fuel-cut bounce
- `lib/portfolio-data.ts` — All portfolio content (experiences, projects, skills, etc.). Edit here to change text without touching UI code
- `legacy-index.html` — Original single-file reference version (do not modify unless asked)

## Theme & Design Conventions

- Color palette via CSS vars: `--red` (#e63946), `--blue` (#00b4d8), `--orange` (#ff6b35), `--green` (#06d6a0), dark bg `--bg-primary` (#0a0a0f)
- Racing metaphors are structural: telemetry bar (top), H-pattern shifter nav, lap times (experience), pit board (projects), gauge bars (skills), redline (contact)
- Rotary engine uses real Wankel math: epitrochoid housing, numerical rotor envelope, 3-apex contact points
- New sections/copy must use motorsport terminology and fit the existing tone
- Icons use `lucide-react`; new iconography should stay visually consistent

## Engine & RPM System

- `lib/rpm-engine.ts` models a virtual RX-8-inspired 8-speed ratio ladder. Gear changes are computed from ratio changes, not fixed RPM add/subtract effects. Large downshifts create dramatic RPM jumps.
- Primary throttle input is press-and-hold on the hero engine or mini engine (via `hooks/use-rotary-animation.ts`). Scroll, pointer, and click are secondary flavor inputs — they must not overpower held throttle.
- Limiter behavior is intentional: true redline contact → fuel-cut bounce → telemetry shake. Do not introduce soft ceilings below redline.
- RPM-driven rumble is applied in `hooks/use-rotary-animation.ts`. Keep it restrained — mechanical, not rough.

## Cursor System

- Custom cursor split between `hooks/use-cursor-system.ts` and `app/globals.css`.
- Red dot at `mouseX - 4` / `mouseY - 4`; ring at `ringX - 18` / `ringY - 18`.
- Hover state toggled by `hover` class; engine state via `data-engine-hover`, `data-throttle-active`, `--throttle-level` CSS var.
- Default ring: 36px. Clickable hover: 56px blue border. Engine hover: 62px blue glow. Throttle-active: scaled ring + green glow. Throttle fill uses conic gradient from `-45deg`.
- Custom cursor hidden on mobile.

## Code Style

- TypeScript strict, 2-space indent, no formatter/linter configured
- PascalCase for components, camelCase for variables/functions
- No UI component library — all custom CSS
- Commit style: conventional prefixes (`style:`, `refactor:`, `fix:`) with concise subjects

## Branches

- `main` — original/legacy version
- `6speed` — active development branch
