"use client";

import { useEffect, useRef } from "react";

import { useAnimationLoop } from "@/hooks/use-animation-loop";
import type { RpmEngine } from "@/lib/rpm-engine";

const HOVER_SELECTOR =
  "a, button, .project-card, .stat-card, .contact-link, .cursor-hover-target, [data-engine-interactive=\"true\"]";

interface CursorTelemetryState {
  isHoveringEngine: boolean;
  isThrottleActive: boolean;
  throttle: number;
}

export function useCursorSystem(
  rpmEngineRef: { current: RpmEngine | null },
  cursorTelemetry: CursorTelemetryState,
) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastPointerPosRef = useRef({ x: 0, y: 0, time: 0 });
  const telemetryRef = useRef(cursorTelemetry);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const trailPositionsRef = useRef<Array<{ x: number; y: number }>>([]);

  telemetryRef.current = cursorTelemetry;

  // RAF-driven cursor animation loop — called at top level, refs guard readiness
  useAnimationLoop(() => {
    const ring = ringRef.current;
    const trails = trailRefs.current;
    const positions = trailPositionsRef.current;
    if (!ring || positions.length !== trails.length || trails.length === 0) return;

    const { x: mouseX, y: mouseY } = mousePosRef.current;
    ringPosRef.current.x += (mouseX - ringPosRef.current.x) * 0.12;
    ringPosRef.current.y += (mouseY - ringPosRef.current.y) * 0.12;
    ring.style.left = `${ringPosRef.current.x - 18}px`;
    ring.style.top = `${ringPosRef.current.y - 18}px`;
    ring.dataset.engineHover = String(telemetryRef.current.isHoveringEngine);
    ring.dataset.throttleActive = String(telemetryRef.current.isThrottleActive);
    ring.style.setProperty("--throttle-level", telemetryRef.current.throttle.toFixed(3));

    for (let i = trails.length - 1; i > 0; i -= 1) {
      positions[i].x = positions[i - 1].x;
      positions[i].y = positions[i - 1].y;
    }
    positions[0].x = mouseX;
    positions[0].y = mouseY;

    trails.forEach((trail, i) => {
      if (!trail) return;
      trail.style.left = `${positions[i].x - 2}px`;
      trail.style.top = `${positions[i].y - 2}px`;
      trail.style.opacity = `${(1 - i / trails.length) * 0.35}`;
      trail.style.transform = `scale(${1 - (i / trails.length) * 0.5})`;
    });
  });

  // DOM event listeners + trail positions initialization
  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const trails = trailRefs.current;
    if (!dot || !ring || trails.length === 0) return;

    trailPositionsRef.current = trails.map(() => ({ x: 0, y: 0 }));

    const handleMouseMove = (event: MouseEvent) => {
      mousePosRef.current = { x: event.clientX, y: event.clientY };
      dot.style.left = `${event.clientX - 4}px`;
      dot.style.top = `${event.clientY - 4}px`;

      const now = performance.now();
      const last = lastPointerPosRef.current;
      const dt = now - last.time;
      if (dt > 0) {
        const dx = event.clientX - last.x;
        const dy = event.clientY - last.y;
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;
        if (speed > 0.1) rpmEngineRef.current?.addPointerEnergy(speed);
      }
      lastPointerPosRef.current = { x: event.clientX, y: event.clientY, time: now };
    };

    const handleMouseOver = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest(HOVER_SELECTOR)) {
        ring.classList.add("hover");
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
      if (!(event.relatedTarget as Element | null)?.closest(HOVER_SELECTOR)) {
        ring.classList.remove("hover");
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if ((event.target as Element | null)?.closest(HOVER_SELECTOR)) {
        ring.classList.add("hover");
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!(event.target as Element | null)?.closest(HOVER_SELECTOR)) {
        ring.classList.remove("hover");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointermove", handleMouseMove as EventListener);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointermove", handleMouseMove as EventListener);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [rpmEngineRef]);

  return { dotRef, ringRef, trailRefs };
}
