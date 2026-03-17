"use client";

import { useEffect, useRef } from "react";

import type { RpmEngine } from "@/lib/rpm-engine";

const HOVER_SELECTOR =
  "a, button, .project-card, .passion-item, .stat-card, .edu-card, .contact-link, .cursor-hover-target";

export function useCursorSystem(rpmEngineRef: { current: RpmEngine | null }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastPointerPosRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const trails = trailRefs.current;

    if (!dot || !ring || trails.length === 0) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    const trailPositions = trails.map(() => ({ x: 0, y: 0 }));
    let frameId = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.left = `${mouseX - 4}px`;
      dot.style.top = `${mouseY - 4}px`;

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

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX - 18}px`;
      ring.style.top = `${ringY - 18}px`;

      for (let i = trails.length - 1; i > 0; i -= 1) {
        trailPositions[i].x = trailPositions[i - 1].x;
        trailPositions[i].y = trailPositions[i - 1].y;
      }
      trailPositions[0].x = mouseX;
      trailPositions[0].y = mouseY;

      trails.forEach((trail, i) => {
        if (!trail) return;
        trail.style.left = `${trailPositions[i].x - 2}px`;
        trail.style.top = `${trailPositions[i].y - 2}px`;
        trail.style.opacity = `${(1 - i / trails.length) * 0.35}`;
        trail.style.transform = `scale(${1 - (i / trails.length) * 0.5})`;
      });

      frameId = window.requestAnimationFrame(animateCursor);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointermove", handleMouseMove as EventListener);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);
    frameId = window.requestAnimationFrame(animateCursor);

    return () => {
      window.cancelAnimationFrame(frameId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointermove", handleMouseMove as EventListener);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  return { dotRef, ringRef, trailRefs };
}
