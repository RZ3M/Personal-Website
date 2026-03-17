import React from "react";

import { HERO_TAGLINE } from "@/lib/portfolio-data";

interface HeroSectionProps {
  engineRumbleStyle: React.CSSProperties;
  heroEngineBindings: {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => void;
    onPointerCancel: (event: React.PointerEvent<HTMLElement>) => void;
    onPointerLeave: () => void;
    onPointerEnter: () => void;
  };
  isThrottleActive: boolean;
  rotaryCanvasRef: React.Ref<HTMLCanvasElement>;
  showThrottleHint: boolean;
  taglineTextRef: React.Ref<HTMLSpanElement>;
  taglineCursorRef: React.Ref<HTMLSpanElement>;
}

export const HeroSection = React.memo(function HeroSection({
  engineRumbleStyle,
  heroEngineBindings,
  isThrottleActive,
  rotaryCanvasRef,
  showThrottleHint,
  taglineTextRef,
  taglineCursorRef,
}: HeroSectionProps) {
  return (
    <section className="section hero" id="hero">
      <div className="hero-bg-grid" />

      <div
        className="rotary-engine-container"
        id="rotaryEngine"
        data-engine-interactive="true"
        data-throttle-active={isThrottleActive}
        {...heroEngineBindings}
      >
        <div className="engine-rumble-shell" style={engineRumbleStyle}>
          <canvas id="rotaryCanvas" width="1040" height="1040" ref={rotaryCanvasRef} />
          <span className="engine-interaction-label" data-visible={showThrottleHint}>
            HOLD TO REV
          </span>
        </div>
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
