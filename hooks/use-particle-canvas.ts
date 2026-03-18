"use client";

import { useEffect, useRef } from "react";
import { getThemeColors } from "@/lib/theme-colors";
import { useTheme } from "@/hooks/use-theme";

export function useParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Alias to non-nullable consts so class closures typecheck
    const c = canvas;
    const ctx = context;

    let frameId = 0;
    const particles: Particle[] = [];
    const particleCount = 60;

    class Particle {
      x = 0;
      y = 0;
      vx = 0;
      vy = 0;
      size = 0;
      opacity = 0;
      hue = 355;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * c.width;
        this.y = Math.random() * c.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.05;
        this.hue = Math.random() > 0.5 ? 355 : 195;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > c.width) this.vx *= -1;
        if (this.y < 0 || this.y > c.height) this.vy *= -1;
      }

      draw() {
        const colors = getThemeColors(themeRef.current);
        const rgb = this.hue === 355 ? colors.red : colors.blue;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${this.opacity})`;
        ctx.fill();
      }
    }

    const resizeCanvas = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
    };

    const drawConnections = () => {
      const colors = getThemeColors(themeRef.current);
      for (let first = 0; first < particles.length; first += 1) {
        for (let second = first + 1; second < particles.length; second += 1) {
          const dx = particles[first].x - particles[second].x;
          const dy = particles[first].y - particles[second].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[first].x, particles[first].y);
            ctx.lineTo(particles[second].x, particles[second].y);
            ctx.strokeStyle = `rgba(${colors.red},${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      drawConnections();
      frameId = window.requestAnimationFrame(animateParticles);
    };

    resizeCanvas();
    for (let i = 0; i < particleCount; i += 1) particles.push(new Particle());

    window.addEventListener("resize", resizeCanvas);
    frameId = window.requestAnimationFrame(animateParticles);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return { canvasRef };
}
