"use client";

import { useEffect, useRef } from "react";

export function useAnimationLoop(callback: (deltaMs: number) => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const frameIdRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    const loop = () => {
      const now = performance.now();
      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;
      callbackRef.current(deltaMs);
      frameIdRef.current = requestAnimationFrame(loop);
    };

    frameIdRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
    };
  }, []);
}
