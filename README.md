# Jack Ma Portfolio

Motorsport-inspired personal portfolio built with Next.js App Router, React, and TypeScript.

This site presents professional experience, projects, skills, education, and contact information through a performance-dashboard visual system. The design language is intentionally centered on telemetry, RPM readouts, pit-board styling, H-pattern shifting, and rotary engine references rather than a generic portfolio template.

## Stack

- Next.js 16
- React 19
- TypeScript
- CSS via [`app/globals.css`](./app/globals.css)
- Lucide React for section/shifter icons

## Features

- Hero section with animated rotary engine canvas
- RPM-driven interaction system tied to page activity
- H-pattern shifter navigation synced to sections
- Fixed telemetry bar with live RPM readout
- Modular section components for about, experience, projects, skills, education, passions, and contact
- Downloadable resume from [`public/Jack_2026.pdf`](./public/Jack_2026.pdf)

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css

components/portfolio/
  PortfolioApp.tsx
  TelemetryBar.tsx
  HPatternShifter.tsx
  rotary-engine.ts
  sections/

hooks/
  use-cursor-system.ts
  use-particle-canvas.ts
  use-rotary-animation.ts
  use-scroll-engine.ts
  use-tagline-typewriter.ts

lib/
  portfolio-data.ts
  rpm-engine.ts

public/
  Jack_2026.pdf
```

## Development

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run the production server locally:

```bash
npm run start
```

Run TypeScript checks:

```bash
npm run typecheck
```

## Notes

- The app uses the Next.js App Router entrypoints in [`app/`](./app).
- Portfolio content is stored in [`lib/portfolio-data.ts`](./lib/portfolio-data.ts).
- RPM behavior and drivetrain-style interaction logic live in [`lib/rpm-engine.ts`](./lib/rpm-engine.ts).
- The legacy single-file reference version is kept in [`legacy-index.html`](./legacy-index.html).

## Design Intent

Changes to this project should preserve the current identity:

- precise, mechanical, high-performance
- motorsport terminology and interaction cues
- rotary/Wankel engine references
- telemetry-driven UI rather than generic SaaS styling

If you change the interface, keep it feeling like instrumentation, not a template.
