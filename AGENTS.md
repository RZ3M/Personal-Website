# Repository Guidelines

## Project Purpose & Design Intent
This repository powers Jack Ma's personal portfolio website. The site is not a generic template; it presents professional experience, projects, education, and contact information through a motorsport-inspired visual system. The core theme combines racing telemetry, tachometers, pit-board language, and rotary/Wankel engine references. Interactive details such as the rotary engine canvas, RPM readouts, telemetry strip, H-pattern shifter navigation, and performance-dashboard styling are part of the product, not decoration.

When contributing, preserve that identity. Changes should feel precise, mechanical, high-performance, and intentional. Do not replace the current aesthetic with a neutral SaaS look or simplify away theme-specific elements unless explicitly asked.

## Project Structure & Module Organization
This repository is a small Next.js App Router site for a personal portfolio. Primary app entry points live in [`app/`](./app): [`layout.tsx`](./app/layout.tsx), [`page.tsx`](./app/page.tsx), global styling in [`globals.css`](./app/globals.css), and the app icon in [`icon.svg`](./app/icon.svg). [`components/portfolio/PortfolioApp.tsx`](./components/portfolio/PortfolioApp.tsx) is the top-level composition shell, while section rendering lives in [`components/portfolio/sections/`](./components/portfolio/sections/). Shared interactive systems are split into hooks under [`hooks/`](./hooks), including cursor, particle, scroll/RPM, and typewriter behavior. Rotary-specific rendering lives in [`components/portfolio/rotary-engine.ts`](./components/portfolio/rotary-engine.ts), and the RPM model lives in [`lib/rpm-engine.ts`](./lib/rpm-engine.ts). Portfolio content is stored separately in [`lib/portfolio-data.ts`](./lib/portfolio-data.ts) so text and metrics can be updated without changing rendering logic. Static assets belong in [`public/`](./public). The legacy reference version remains in [`legacy-index.html`](./legacy-index.html).

## Build, Test, and Development Commands
- `npm run dev`: start the local Next.js dev server.
- `npm run build`: create a production build and catch framework/runtime issues.
- `npm run start`: serve the production build locally after `npm run build`.
- `npm run typecheck`: run strict TypeScript checks with `tsc --noEmit`.

Run `npm install` after dependency changes.

## Coding Style & Naming Conventions
Use TypeScript with strict typing and 2-space indentation. Prefer React function components and keep data separate from presentation when possible. Use `PascalCase` for component files and exported components, `camelCase` for variables/functions, and kebab-free route filenames required by Next.js such as `page.tsx` and `layout.tsx`. Preserve the current visual design unless a change is explicitly requested.

There is no formatter or linter configured yet, so keep edits consistent with the surrounding code and avoid unnecessary rewrites.

For UI work, maintain the existing terminology and metaphors: telemetry, RPM, lap times, pit board, and rotary engine references. New copy, sections, or interactions should fit the portfolio's personal-brand tone and not conflict with the racing theme. The telemetry bar, RPM simulation, rotary engine animation, and H-pattern shifter are core product elements; treat them as part of the experience architecture rather than optional decoration. Icons use [`lucide-react`](./package.json) and new iconography should stay visually consistent with that set unless there is a strong reason to diverge.

## Engine Interaction Notes
The RPM system in [`lib/rpm-engine.ts`](./lib/rpm-engine.ts) is no longer a simple decorative pulse. It now models a virtual RX-8-inspired 8-speed ratio ladder across the portfolio's 8 shifter positions. Gear changes should be computed from ratio changes, not fixed RPM add/subtract effects. Large downshifts are expected to create dramatic RPM jumps, and extreme jumps such as high-RPM `G8 -> G1` may push the engine straight into the limiter.

Direct engine interaction is the primary throttle input. The hero engine and mini engine both support press-and-hold throttle through [`hooks/use-rotary-animation.ts`](./hooks/use-rotary-animation.ts), and this interaction should remain the most reliable way to drive the engine to redline. Ambient influences such as scroll, pointer movement, clicks, and shifter drag are secondary flavor inputs; they can move RPM, but they should not overpower held throttle or create unrealistic sustained limiter behavior by themselves.

Limiter behavior is intentional and should be preserved. The desired feel is true redline contact followed by a fuel-cut bounce, with telemetry shake appearing while limiter behavior is active. Do not reintroduce soft ceilings that flatten RPM below redline, and do not replace ratio-based gear transitions with canned blips or fixed drops.

The engine also has a subtle RPM-driven rumble layer applied in [`hooks/use-rotary-animation.ts`](./hooks/use-rotary-animation.ts) and rendered through the shared engine shell in the hero and mini engine containers. Keep this restrained and smooth. The rotary should feel mechanically alive, but not rough like a lumpy piston engine.

## Cursor Interaction Notes
The custom cursor is part of the engine-control UX, not just decoration. Its behavior is currently split between [`hooks/use-cursor-system.ts`](./hooks/use-cursor-system.ts) and [`app/globals.css`](./app/globals.css).

In [`hooks/use-cursor-system.ts`](./hooks/use-cursor-system.ts), the red cursor dot is positioned at `mouseX - 4` / `mouseY - 4`, while the ring is positioned at `ringX - 18` / `ringY - 18`. Hover state is toggled by adding or removing the `hover` class when the pointer moves over clickable targets or engine-interactive targets. Engine telemetry is passed into the ring through `data-engine-hover`, `data-throttle-active`, and the `--throttle-level` CSS variable.

In [`app/globals.css`](./app/globals.css), the default ring is `36px`, clickable hover uses `.cursor-ring.hover` at `56px` with a blue border, and engine hover uses `data-engine-hover="true"` at `62px` with a blue glow. Throttle-active state scales the ring and adds green glow. The throttle ring fill is rendered with a conic gradient driven by `--throttle-level`, and its current fill origin is `from -45deg`.

On mobile, the custom cursor is hidden through the responsive rule that disables `.cursor-dot`, `.cursor-ring`, and `.cursor-trail`.

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
