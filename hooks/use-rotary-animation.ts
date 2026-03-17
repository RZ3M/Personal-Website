"use client";

import { useEffect, useRef, useState } from "react";

import { createRotaryEngineRenderer } from "@/components/portfolio/rotary-engine";
import { createRpmEngine, rpmToRotationSpeed, type RpmEngine } from "@/lib/rpm-engine";

export function useRotaryAnimation(rpmEngineRef: { current: RpmEngine | null }) {
  const rotaryCanvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroVisibleRef = useRef(true);

  const [displayRpm, setDisplayRpm] = useState(750);
  const [heroVisible, setHeroVisible] = useState(true);

  // Click energy
  useEffect(() => {
    const handleClick = () => rpmEngineRef.current?.addClickEnergy();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Hero visibility — controls which canvas is drawn to
  useEffect(() => {
    const heroSection = document.getElementById("hero");
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          heroVisibleRef.current = entry.isIntersecting;
          setHeroVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.05 },
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  // Rotary animation loop + RPM engine init
  useEffect(() => {
    rpmEngineRef.current = createRpmEngine();

    const heroCanvas = rotaryCanvasRef.current;
    const miniCanvas = miniCanvasRef.current;
    if (!heroCanvas || !miniCanvas) return;

    const heroCtx = heroCanvas.getContext("2d");
    const miniCtx = miniCanvas.getContext("2d");
    if (!heroCtx || !miniCtx) return;

    const heroRenderer = createRotaryEngineRenderer(1040);
    const miniRenderer = createRotaryEngineRenderer(400, { minLineWidth: 2 });

    let shaftAngle = 0;
    let frameId = 0;
    let lastFrameTime = performance.now();
    let lastRpmUpdateTime = 0;

    const animate = () => {
      const now = performance.now();
      const deltaMs = now - lastFrameTime;
      lastFrameTime = now;

      const engine = rpmEngineRef.current!;
      engine.tick(deltaMs);
      const rpm = engine.getRpm();
      shaftAngle += rpmToRotationSpeed(rpm);

      if (heroVisibleRef.current) {
        heroRenderer.draw(heroCtx, shaftAngle);
      } else {
        miniRenderer.draw(miniCtx, shaftAngle, { skipLabels: true, compact: true });
      }

      if (now - lastRpmUpdateTime > 66) {
        setDisplayRpm(Math.floor(rpm));
        lastRpmUpdateTime = now;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return { displayRpm, heroVisible, rotaryCanvasRef, miniCanvasRef };
}
