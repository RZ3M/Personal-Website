"use client";

import { useRef } from "react";

import { useCursorSystem } from "@/hooks/use-cursor-system";
import { useParticleCanvas } from "@/hooks/use-particle-canvas";
import { useRotaryAnimation } from "@/hooks/use-rotary-animation";
import { useScrollEngine } from "@/hooks/use-scroll-engine";
import { useTaglineTypewriter } from "@/hooks/use-tagline-typewriter";
import type { RpmEngine } from "@/lib/rpm-engine";

import { HPatternShifter } from "./HPatternShifter";
import { TelemetryBar } from "./TelemetryBar";
import { AboutSection } from "./sections/AboutSection";
import { ContactSection } from "./sections/ContactSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { HeroSection } from "./sections/HeroSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { SkillsSection } from "./sections/SkillsSection";

export function PortfolioApp() {
  const rpmEngineRef = useRef<RpmEngine | null>(null);
  const previousGearRef = useRef(1);

  const {
    cursorTelemetry,
    displayRpm,
    displayThrottle,
    engineRumbleStyle,
    heroVisible,
    heroEngineBindings,
    isAtLimiter,
    isThrottleActive,
    miniCanvasRef,
    miniEngineBindings,
    rotaryCanvasRef,
    rotaryLabelsCanvasRef,
    showThrottleHint,
  } = useRotaryAnimation(rpmEngineRef);
  const { dotRef, ringRef, trailRefs } = useCursorSystem(rpmEngineRef, cursorTelemetry);
  const { canvasRef: particleCanvasRef } = useParticleCanvas();
  const { activeSectionIndex, handleGearEngage } = useScrollEngine(
    rpmEngineRef,
    previousGearRef,
  );
  const { taglineTextRef, taglineCursorRef } = useTaglineTypewriter();

  return (
    <>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
      {Array.from({ length: 12 }, (_, index) => (
        <div
          className="cursor-trail"
          key={index}
          ref={(el) => {
            trailRefs.current[index] = el;
          }}
        />
      ))}

      <canvas id="particles-canvas" ref={particleCanvasRef} />

      <TelemetryBar
        displayRpm={displayRpm}
        displayThrottle={displayThrottle}
        isAtLimiter={isAtLimiter}
      />

      <div className="right-nav-column">
        <div
          className="mini-engine-wrapper"
          data-throttle-active={isThrottleActive}
          data-visible={!heroVisible}
          data-engine-interactive="true"
          {...miniEngineBindings}
        >
          <div className="engine-rumble-shell" style={engineRumbleStyle}>
            <canvas
              ref={miniCanvasRef}
              width={400}
              height={400}
              className="mini-rotary-canvas"
            />
            <span className="engine-interaction-label" data-visible={showThrottleHint}>
              HOLD TO REV
            </span>
          </div>
        </div>
        <HPatternShifter
          activeSectionIndex={activeSectionIndex}
          onGearEngage={handleGearEngage}
          onDragMove={() => rpmEngineRef.current?.addShifterDragEnergy()}
        />
      </div>

      <main id="main-content">
        <HeroSection
          engineRumbleStyle={engineRumbleStyle}
          heroEngineBindings={heroEngineBindings}
          isThrottleActive={isThrottleActive}
          rotaryCanvasRef={rotaryCanvasRef}
          rotaryLabelsCanvasRef={rotaryLabelsCanvasRef}
          showThrottleHint={showThrottleHint}
          taglineTextRef={taglineTextRef}
          taglineCursorRef={taglineCursorRef}
        />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <footer className="footer">
        <span>JACK MA © 2026 — BUILT WITH PASSION AND HIGH OCTANE</span>
      </footer>
    </>
  );
}
