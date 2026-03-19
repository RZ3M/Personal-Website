"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { createRotaryEngineRenderer, drawPortLabels } from "@/components/portfolio/rotary-engine";
import { getThemeColors } from "@/lib/theme-colors";
import { createRpmEngine, rpmToRotationSpeed, type RpmEngine } from "@/lib/rpm-engine";
import { useTheme } from "@/hooks/use-theme";

type EngineSurface = "hero" | "mini";

interface CursorTelemetryState {
  isHoveringEngine: boolean;
  isThrottleActive: boolean;
  throttle: number;
}

interface EngineSurfaceBindings {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
  onPointerEnter: () => void;
}

const FULL_THROTTLE = 1;

export function useRotaryAnimation(rpmEngineRef: { current: RpmEngine | null }) {
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const rotaryCanvasRef = useRef<HTMLCanvasElement>(null);
  const rotaryLabelsCanvasRef = useRef<HTMLCanvasElement>(null);
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroVisibleRef = useRef(true);
  const hoverCountRef = useRef(0);
  const activeSurfaceRef = useRef<EngineSurface | null>(null);

  const [displayRpm, setDisplayRpm] = useState(750);
  const [displayThrottle, setDisplayThrottle] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const [isThrottleActive, setIsThrottleActive] = useState(false);
  const [isAtLimiter, setIsAtLimiter] = useState(false);
  const [showThrottleHint, setShowThrottleHint] = useState(true);
  const [isHoveringEngine, setIsHoveringEngine] = useState(false);
  const [engineRumbleStyle, setEngineRumbleStyle] = useState<CSSProperties>({});

  const releaseThrottle = useCallback(() => {
    rpmEngineRef.current?.stopThrottle();
    activeSurfaceRef.current = null;
    setIsThrottleActive(false);
  }, [rpmEngineRef]);

  const handlePointerDown = useCallback(
    (surface: EngineSurface, event: ReactPointerEvent<HTMLElement>) => {
      activeSurfaceRef.current = surface;
      event.currentTarget.setPointerCapture(event.pointerId);
      const firstThrottle = rpmEngineRef.current?.startThrottle(FULL_THROTTLE) ?? false;
      if (firstThrottle) setShowThrottleHint(false);
      setIsThrottleActive(true);
    },
    [rpmEngineRef],
  );

  const handlePointerMove = useCallback(
    (surface: EngineSurface, event: ReactPointerEvent<HTMLElement>) => {
      if (activeSurfaceRef.current !== surface || !(event.buttons & 1)) return;
      rpmEngineRef.current?.updateThrottle(FULL_THROTTLE);
    },
    [rpmEngineRef],
  );

  const handlePointerUp = useCallback(
    (surface: EngineSurface, event: ReactPointerEvent<HTMLElement>) => {
      if (activeSurfaceRef.current !== surface) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      releaseThrottle();
    },
    [releaseThrottle],
  );

  const handlePointerCancel = useCallback(
    (surface: EngineSurface, event: ReactPointerEvent<HTMLElement>) => {
      if (activeSurfaceRef.current !== surface) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      releaseThrottle();
    },
    [releaseThrottle],
  );

  const handlePointerEnter = useCallback(() => {
    hoverCountRef.current += 1;
    setIsHoveringEngine(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    hoverCountRef.current = Math.max(0, hoverCountRef.current - 1);
    if (hoverCountRef.current === 0) setIsHoveringEngine(false);
  }, []);

  const heroEngineBindings: EngineSurfaceBindings = {
    onPointerDown: (event) => handlePointerDown("hero", event),
    onPointerMove: (event) => handlePointerMove("hero", event),
    onPointerUp: (event) => handlePointerUp("hero", event),
    onPointerCancel: (event) => handlePointerCancel("hero", event),
    onPointerLeave: handlePointerLeave,
    onPointerEnter: handlePointerEnter,
  };

  const miniEngineBindings: EngineSurfaceBindings = {
    onPointerDown: (event) => handlePointerDown("mini", event),
    onPointerMove: (event) => handlePointerMove("mini", event),
    onPointerUp: (event) => handlePointerUp("mini", event),
    onPointerCancel: (event) => handlePointerCancel("mini", event),
    onPointerLeave: handlePointerLeave,
    onPointerEnter: handlePointerEnter,
  };

  useEffect(() => {
    const handleWindowPointerUp = () => releaseThrottle();
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("blur", handleWindowPointerUp);
    return () => {
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("blur", handleWindowPointerUp);
    };
  }, [releaseThrottle]);

  useEffect(() => {
    const handleClick = () => rpmEngineRef.current?.addClickEnergy();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [rpmEngineRef]);

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
    let lastUiUpdateTime = 0;
    let elapsedAnimationSec = 0;

    const animate = () => {
      const now = performance.now();
      const deltaMs = now - lastFrameTime;
      const deltaSec = Math.min(deltaMs / 1000, 0.1);
      lastFrameTime = now;
      elapsedAnimationSec += deltaSec;

      const engine = rpmEngineRef.current!;
      engine.tick(deltaMs);
      const rpm = engine.getRpm();
      const throttle = engine.getThrottle();
      const limiterActive = engine.isAtLimiter();
      shaftAngle += rpmToRotationSpeed(rpm, elapsedAnimationSec) * deltaSec;

      const colors = getThemeColors(themeRef.current);
      if (heroVisibleRef.current) {
        heroRenderer.draw(heroCtx, shaftAngle, { rpm, colors, skipPortLabels: true });
        const labelsCanvas = rotaryLabelsCanvasRef.current;
        if (labelsCanvas) {
          const labelsCtx = labelsCanvas.getContext("2d");
          if (labelsCtx) drawPortLabels(labelsCtx, 1040, shaftAngle, { rpm, colors });
        }
      } else {
        miniRenderer.draw(miniCtx, shaftAngle, { skipLabels: true, compact: true, rpm, colors });
      }

      if (now - lastUiUpdateTime > 50) {
        const normalizedRpm = Math.max(0, Math.min(1, rpm / 9500));
        const rumbleIntensity =
          normalizedRpm < 0.16 && throttle < 0.04
            ? 0
            : Math.min(1, normalizedRpm * 0.65 + throttle * 0.35);
        const rumblePhase = now * (0.0105 + normalizedRpm * 0.0018);
        const rumbleX =
          Math.sin(rumblePhase * 1.37) * (0.18 + rumbleIntensity * 0.7);
        const rumbleY =
          Math.cos(rumblePhase * 1.91) * (0.12 + rumbleIntensity * 0.46);
        const rumbleRot =
          Math.sin(rumblePhase * 0.92) * (0.04 + rumbleIntensity * 0.14);

        setDisplayRpm(Math.floor(rpm));
        setDisplayThrottle(throttle);
        setIsAtLimiter(limiterActive);
        setShowThrottleHint(!engine.hasThrottleInteracted());
        setIsThrottleActive(throttle > 0.03);
        setEngineRumbleStyle({
          "--engine-rumble-x": `${rumbleX.toFixed(3)}px`,
          "--engine-rumble-y": `${rumbleY.toFixed(3)}px`,
          "--engine-rumble-rot": `${rumbleRot.toFixed(3)}deg`,
        } as CSSProperties);
        lastUiUpdateTime = now;
      }

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [rpmEngineRef]);

  const cursorTelemetry: CursorTelemetryState = {
    isHoveringEngine,
    isThrottleActive,
    throttle: displayThrottle,
  };

  return {
    cursorTelemetry,
    displayRpm,
    displayThrottle,
    engineRumbleStyle,
    heroVisible,
    heroEngineBindings,
    isAtLimiter,
    isThrottleActive,
    miniEngineBindings,
    miniCanvasRef,
    rotaryCanvasRef,
    rotaryLabelsCanvasRef,
    showThrottleHint,
  };
}
