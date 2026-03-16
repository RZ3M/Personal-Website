# Repository Guidelines

## Project Purpose & Design Intent
This repository powers Jack Ma's personal portfolio website. The site is not a generic template; it presents professional experience, projects, education, and contact information through a motorsport-inspired visual system. The core theme combines racing telemetry, tachometers, pit-board language, and rotary/Wankel engine references. Interactive details such as the rotary engine canvas, RPM readouts, wave dividers, and performance-dashboard styling are part of the product, not decoration.

When contributing, preserve that identity. Changes should feel precise, mechanical, high-performance, and intentional. Do not replace the current aesthetic with a neutral SaaS look or simplify away theme-specific elements unless explicitly asked.

## Project Structure & Module Organization
This repository is a small Next.js App Router site for a personal portfolio. Primary app entry points live in [`app/`](./app): [`layout.tsx`](./app/layout.tsx), [`page.tsx`](./app/page.tsx), and global styling in [`globals.css`](./app/globals.css). Interactive UI logic is centralized in [`components/portfolio/PortfolioApp.tsx`](./components/portfolio/PortfolioApp.tsx). Portfolio content is stored separately in [`lib/portfolio-data.ts`](./lib/portfolio-data.ts) so text and metrics can be updated without changing rendering logic. Static assets belong in [`public/`](./public). The legacy one-file reference version remains in [`index.html`](./index.html).

## Build, Test, and Development Commands
- `npm run dev`: start the local Next.js dev server.
- `npm run build`: create a production build and catch framework/runtime issues.
- `npm run start`: serve the production build locally after `npm run build`.
- `npm run typecheck`: run strict TypeScript checks with `tsc --noEmit`.

Run `npm install` after dependency changes.

## Coding Style & Naming Conventions
Use TypeScript with strict typing and 2-space indentation. Prefer React function components and keep data separate from presentation when possible. Use `PascalCase` for component files and exported components, `camelCase` for variables/functions, and kebab-free route filenames required by Next.js such as `page.tsx` and `layout.tsx`. Preserve the current visual design unless a change is explicitly requested.

There is no formatter or linter configured yet, so keep edits consistent with the surrounding code and avoid unnecessary rewrites.

For UI work, maintain the existing terminology and metaphors: telemetry, RPM, lap times, pit board, and rotary engine references. New copy, sections, or interactions should fit the portfolio's personal-brand tone and not conflict with the racing theme.

## Testing Guidelines
There is no dedicated test framework configured in this repo today. Minimum validation for any change is:
- `npm run typecheck`
- `npm run build`

If you add non-trivial logic, introduce focused tests with the toolchain you add and document the command in `package.json`.

## Commit & Pull Request Guidelines
Recent history uses short conventional-style prefixes such as `style:`, `refactor:`, and concise subject lines. Follow that pattern, for example: `fix: resolve hydration mismatch in wave divider`.

Pull requests should include:
- A brief summary of the user-facing change
- Notes on any architectural or dependency updates
- Validation performed (`npm run typecheck`, `npm run build`)
- Screenshots or a short screen recording for visual UI changes

## Configuration Notes
Google Fonts are loaded at runtime in [`app/layout.tsx`](./app/layout.tsx). Keep that in mind when changing font strategy or working in restricted-network environments.
