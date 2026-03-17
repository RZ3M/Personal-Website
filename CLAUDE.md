# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Personal portfolio website for Jack Ma. The entire visual identity is built around motorsport and rotary (Wankel) engine aesthetics — racing telemetry, tachometers, pit-board language, RPM readouts, wave dividers. This is the product, not decoration. Do not neutralize or simplify the theme.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build (also validates runtime correctness)
npm run typecheck    # Strict TypeScript check (tsc --noEmit)
npm run start        # Serve production build
```

No test framework is configured. **Minimum validation for any change: `npm run typecheck && npm run build`**.

## Architecture

Next.js 16 App Router with React 19, TypeScript strict mode. Single-page portfolio.

- `app/layout.tsx` — Root layout, Google Fonts preload (Orbitron, Rajdhani, Share Tech Mono)
- `app/page.tsx` — Renders `<PortfolioApp />`
- `components/portfolio/PortfolioApp.tsx` — **The main file** (~1,076 lines). Client component containing all interactive logic: custom cursor, particle canvas, rotary engine canvas animation, scroll tracking, IntersectionObserver reveals, wave dividers, and all 8 sections
- `lib/portfolio-data.ts` — All portfolio content (experiences, projects, skills, education, etc.) separated from rendering logic. Edit here to change text/data without touching UI code
- `app/globals.css` — All styles via CSS custom properties. Responsive breakpoints at 900px and 600px
- `index.html` — Legacy single-file reference version (do not modify unless asked)

## Theme & Design Conventions

- Color palette via CSS vars: `--red` (#e63946), `--blue` (#00b4d8), `--orange` (#ff6b35), `--green` (#06d6a0), dark bg `--bg-primary` (#0a0a0f)
- Racing metaphors are structural: telemetry bar (top), tachometer nav (right), lap times (experience), pit board (projects), gauge bars (skills), redline (contact)
- Rotary engine canvas uses real Wankel rotor math: parametric housing curves, eccentric orbit, 3-apex contact points
- New sections/copy must use motorsport terminology and fit the existing tone

## Code Style

- TypeScript strict, 2-space indent, no formatter/linter configured
- PascalCase for components, camelCase for variables/functions
- No UI component library — all custom CSS
- Commit style: conventional prefixes (`style:`, `refactor:`, `fix:`) with concise subjects

## Branches

- `main` — original/legacy version
- `nextjs` — active development branch (Next.js rewrite)
