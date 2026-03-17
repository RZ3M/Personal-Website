import React from "react";

import { HERO_TAGLINE } from "@/lib/portfolio-data";

interface HeroSectionProps {
  rotaryCanvasRef: React.Ref<HTMLCanvasElement>;
  taglineTextRef: React.Ref<HTMLSpanElement>;
  taglineCursorRef: React.Ref<HTMLSpanElement>;
}

export const HeroSection = React.memo(function HeroSection({
  rotaryCanvasRef,
  taglineTextRef,
  taglineCursorRef,
}: HeroSectionProps) {
  return (
    <section className="section hero" id="hero">
      <div className="hero-bg-grid" />

      <div className="rotary-engine-container" id="rotaryEngine">
        <canvas id="rotaryCanvas" width="1040" height="1040" ref={rotaryCanvasRef} />
      </div>

      <h1 className="hero-title">JACK MA</h1>
      <p className="hero-subtitle">
        Software Engineer &nbsp;|&nbsp; Creator &nbsp;|&nbsp; Builder
      </p>
      <p className="hero-tagline">
        <span className="hero-tagline-text" ref={taglineTextRef}>
          {HERO_TAGLINE}
        </span>
        <span className="hero-tagline-cursor" ref={taglineCursorRef} aria-hidden="true" />
      </p>
    </section>
  );
});
