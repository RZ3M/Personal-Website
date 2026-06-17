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
  rotaryLabelsCanvasRef: React.Ref<HTMLCanvasElement>;
  showThrottleHint: boolean;
  taglineTextRef: React.Ref<HTMLSpanElement>;
  taglineCursorRef: React.Ref<HTMLSpanElement>;
}

export const HeroSection = React.memo(function HeroSection({
  engineRumbleStyle,
  heroEngineBindings,
  isThrottleActive,
  rotaryCanvasRef,
  rotaryLabelsCanvasRef,
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
        <div className="cockpit-frame" aria-hidden="true">
          <span className="cockpit-corner cockpit-tl" />
          <span className="cockpit-corner cockpit-tr" />
          <span className="cockpit-corner cockpit-bl" />
          <span className="cockpit-corner cockpit-br" />
          <span className="cockpit-hud cockpit-hud-tl">13B-MSP · ROTARY</span>
          <span className="cockpit-hud cockpit-hud-tr">2-ROTOR · WANKEL</span>
          <span className="cockpit-hud cockpit-hud-bl">REDLINE 9500</span>
          <span className="cockpit-hud cockpit-hud-br" data-throttle-active={isThrottleActive}>
            {isThrottleActive ? "WOT" : "IDLE"}
          </span>
        </div>

        <div className="engine-rumble-shell" style={engineRumbleStyle}>
          <canvas id="rotaryCanvas" width="1040" height="1040" ref={rotaryCanvasRef} />
          <span className="engine-interaction-label" data-visible={showThrottleHint}>
            HOLD TO REV
          </span>
        </div>
        <canvas className="rotary-labels-canvas" ref={rotaryLabelsCanvasRef} width="1040" height={1040} />
      </div>

      <h1 className="hero-title">JACK MA</h1>
      <p className="hero-subtitle">
        Software Engineer &nbsp;|&nbsp; Maker &nbsp;|&nbsp; Artist
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
