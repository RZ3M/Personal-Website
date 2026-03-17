"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import {
  aboutStats,
  contactLinks,
  education,
  experiences,
  passions,
  projects,
  sectionNav,
  skillPanels,
  type ExperiencePart,
} from "../../lib/portfolio-data";
import { HPatternShifter } from "./HPatternShifter";

const HERO_TAGLINE =
  "Engineering elegant systems. Designing real things. Chasing the redline.";
const HOVER_SELECTOR =
  "a, button, .project-card, .passion-item, .stat-card, .edu-card, .contact-link, .cursor-hover-target";

function seededValue(seed: number, index: number) {
  const raw = Math.sin((seed + 1) * 97.13 + index * 12.9898) * 43758.5453;
  return raw - Math.floor(raw);
}

function formatCssNumber(value: number, decimals: number) {
  return Number(value.toFixed(decimals)).toString();
}

const waveBars = Array.from({ length: 7 }, (_, waveIndex) =>
  Array.from({ length: 80 }, (_, barIndex) => ({
    height: formatCssNumber(seededValue(waveIndex + 1, barIndex) * 30 + 5, 4),
    delay: formatCssNumber(barIndex * 0.03, 2),
  })),
);

function WaveDivider({ index }: { index: number }) {
  const bars = waveBars[index - 1];

  return (
    <div className="wave-divider" id={`wave${index}`}>
      {bars.map((bar, barIndex) => (
        <div
          className="wave-bar"
          key={barIndex}
          style={{
            height: `${bar.height}px`,
            animationDelay: `${bar.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function renderExperiencePart(part: ExperiencePart, index: number) {
  if (part.type === "tag") {
    return (
      <span className="tech-tag" key={index}>
        {part.content}
      </span>
    );
  }

  if (part.type === "strong") {
    return <strong key={index}>{part.content}</strong>;
  }

  return <Fragment key={index}>{part.content}</Fragment>;
}

function ContactIcon({ icon }: { icon: (typeof contactLinks)[number]["icon"] }) {
  if (icon === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

export function PortfolioApp() {
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const rotaryCanvasRef = useRef<HTMLCanvasElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorTrailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const lastScrollYRef = useRef(0);
  const rotaryBoostRef = useRef(0);
  const scrollSourceRef = useRef<"user" | "shifter">("user");
  const scrollTargetRef = useRef<number | null>(null);
  const scrollGuardTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  const handleGearEngage = useCallback((index: number) => {
    clearTimeout(scrollGuardTimeoutRef.current);
    scrollSourceRef.current = "shifter";
    scrollTargetRef.current = index;
    document.getElementById(sectionNav[index].id)?.scrollIntoView({ behavior: "smooth" });
    // Fallback: clear guard after 2s if section never enters viewport
    scrollGuardTimeoutRef.current = setTimeout(() => {
      scrollSourceRef.current = "user";
      scrollTargetRef.current = null;
    }, 2000);
  }, []);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const trails = cursorTrailRefs.current;

    if (!dot || !ring || trails.length === 0) {
      return;
    }

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
    };

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(HOVER_SELECTOR)) {
        ring.classList.add("hover");
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
      const nextTarget = event.relatedTarget as Element | null;
      if (!nextTarget?.closest(HOVER_SELECTOR)) {
        ring.classList.remove("hover");
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(HOVER_SELECTOR)) {
        ring.classList.add("hover");
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest(HOVER_SELECTOR)) {
        ring.classList.remove("hover");
      }
    };

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX - 18}px`;
      ring.style.top = `${ringY - 18}px`;

      for (let index = trails.length - 1; index > 0; index -= 1) {
        trailPositions[index].x = trailPositions[index - 1].x;
        trailPositions[index].y = trailPositions[index - 1].y;
      }

      trailPositions[0].x = mouseX;
      trailPositions[0].y = mouseY;

      trails.forEach((trail, index) => {
        if (!trail) {
          return;
        }

        trail.style.left = `${trailPositions[index].x - 2}px`;
        trail.style.top = `${trailPositions[index].y - 2}px`;
        trail.style.opacity = `${(1 - index / trails.length) * 0.35}`;
        trail.style.transform = `scale(${1 - (index / trails.length) * 0.5})`;
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

  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const drawingCanvas = canvas;
    const drawingContext = context;

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
        this.x = Math.random() * drawingCanvas.width;
        this.y = Math.random() * drawingCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.05;
        this.hue = Math.random() > 0.5 ? 355 : 195;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > drawingCanvas.width) {
          this.vx *= -1;
        }
        if (this.y < 0 || this.y > drawingCanvas.height) {
          this.vy *= -1;
        }
      }

      draw() {
        const color =
          this.hue === 355
            ? `rgba(230,57,70,${this.opacity})`
            : `rgba(0,180,216,${this.opacity})`;

        drawingContext.beginPath();
        drawingContext.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        drawingContext.fillStyle = color;
        drawingContext.fill();
      }
    }

    const resizeCanvas = () => {
      drawingCanvas.width = window.innerWidth;
      drawingCanvas.height = window.innerHeight;
    };

    const drawConnections = () => {
      for (let first = 0; first < particles.length; first += 1) {
        for (let second = first + 1; second < particles.length; second += 1) {
          const dx = particles[first].x - particles[second].x;
          const dy = particles[first].y - particles[second].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.08;
            drawingContext.beginPath();
            drawingContext.moveTo(particles[first].x, particles[first].y);
            drawingContext.lineTo(particles[second].x, particles[second].y);
            drawingContext.strokeStyle = `rgba(230,57,70,${opacity})`;
            drawingContext.lineWidth = 0.5;
            drawingContext.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      drawConnections();
      frameId = window.requestAnimationFrame(animateParticles);
    };

    resizeCanvas();
    for (let index = 0; index < particleCount; index += 1) {
      particles.push(new Particle());
    }

    window.addEventListener("resize", resizeCanvas);
    frameId = window.requestAnimationFrame(animateParticles);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = rotaryCanvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const drawingContext = context;

    const canvasCenter = 520;
    const generatingRadius = 150;
    const eccentricity = 25;
    const housingSteps = 360;
    const housingPoints: Array<{ x: number; y: number }> = [];
    for (let index = 0; index <= housingSteps; index += 1) {
      const t = (index / housingSteps) * Math.PI * 2;
      housingPoints.push({
        x:
          canvasCenter +
          generatingRadius * Math.cos(t) +
          eccentricity * Math.cos(3 * t),
        y:
          canvasCenter +
          generatingRadius * Math.sin(t) +
          eccentricity * Math.sin(3 * t),
      });
    }

    const profileResolution = 720;
    const rotorProfile = new Float64Array(profileResolution).fill(Infinity);
    const thetaSteps = 1200;
    const housingProfileSteps = 1200;

    for (let thetaIndex = 0; thetaIndex < thetaSteps; thetaIndex += 1) {
      const theta = (thetaIndex / thetaSteps) * 6 * Math.PI;
      const rotorCenterX = eccentricity * Math.cos(theta);
      const rotorCenterY = eccentricity * Math.sin(theta);
      const rotorAngle = theta / 3;
      const cosRotation = Math.cos(rotorAngle);
      const sinRotation = Math.sin(rotorAngle);

      for (let sampleIndex = 0; sampleIndex < housingProfileSteps; sampleIndex += 1) {
        const s = (sampleIndex / housingProfileSteps) * 2 * Math.PI;
        const housingX =
          generatingRadius * Math.cos(s) + eccentricity * Math.cos(3 * s);
        const housingY =
          generatingRadius * Math.sin(s) + eccentricity * Math.sin(3 * s);
        const dx = housingX - rotorCenterX;
        const dy = housingY - rotorCenterY;
        const rotatedX = dx * cosRotation + dy * sinRotation;
        const rotatedY = -dx * sinRotation + dy * cosRotation;
        const distance = Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY);
        let angle = Math.atan2(rotatedY, rotatedX);
        if (angle < 0) {
          angle += 2 * Math.PI;
        }
        const profileIndex =
          Math.floor((angle / (2 * Math.PI)) * profileResolution) %
          profileResolution;

        if (distance < rotorProfile[profileIndex]) {
          rotorProfile[profileIndex] = distance;
        }
      }
    }

    for (let index = 0; index < profileResolution; index += 1) {
      rotorProfile[index] *= 0.985;
    }

    const getRotorPath = (rotorCenterX: number, rotorCenterY: number, angle: number) => {
      const points = [];
      const apexes = [];

      for (let index = 0; index < 3; index += 1) {
        const apexAngle = angle + index * (2 * Math.PI / 3);
        apexes.push({
          x: rotorCenterX + generatingRadius * Math.cos(apexAngle),
          y: rotorCenterY + generatingRadius * Math.sin(apexAngle),
        });
      }

      for (let index = 0; index < profileResolution; index += 1) {
        const localAngle = (index / profileResolution) * 2 * Math.PI;
        const worldAngle = localAngle + angle;
        const radius = rotorProfile[index];
        points.push({
          x: rotorCenterX + radius * Math.cos(worldAngle),
          y: rotorCenterY + radius * Math.sin(worldAngle),
        });
      }

      return { points, apexes };
    };

    let shaftAngle = 0;
    let frameId = 0;

    const drawRotaryEngine = () => {
      drawingContext.clearRect(0, 0, 1040, 1040);
      drawingContext.save();
      drawingContext.translate(canvasCenter, canvasCenter);
      drawingContext.rotate(-Math.PI / 2);
      drawingContext.translate(-canvasCenter, -canvasCenter);

      const glowGradient = drawingContext.createRadialGradient(
        canvasCenter,
        canvasCenter,
        120,
        canvasCenter,
        canvasCenter,
        240,
      );
      glowGradient.addColorStop(0, "rgba(230,57,70,0.02)");
      glowGradient.addColorStop(1, "rgba(230,57,70,0)");

      drawingContext.beginPath();
      drawingContext.arc(canvasCenter, canvasCenter, 240, 0, Math.PI * 2);
      drawingContext.fillStyle = glowGradient;
      drawingContext.fill();

      drawingContext.beginPath();
      drawingContext.moveTo(housingPoints[0].x, housingPoints[0].y);
      for (let index = 1; index < housingPoints.length; index += 1) {
        drawingContext.lineTo(housingPoints[index].x, housingPoints[index].y);
      }
      drawingContext.closePath();
      drawingContext.strokeStyle = "rgba(230,57,70,0.5)";
      drawingContext.lineWidth = 2;
      drawingContext.stroke();
      drawingContext.strokeStyle = "rgba(230,57,70,0.12)";
      drawingContext.lineWidth = 6;
      drawingContext.stroke();

      const rotorCenterX = canvasCenter + eccentricity * Math.cos(shaftAngle);
      const rotorCenterY = canvasCenter + eccentricity * Math.sin(shaftAngle);
      const rotorAngle = shaftAngle / 3;
      const { points, apexes } = getRotorPath(rotorCenterX, rotorCenterY, rotorAngle);

      drawingContext.beginPath();
      drawingContext.moveTo(points[0].x, points[0].y);
      for (let index = 1; index < points.length; index += 1) {
        drawingContext.lineTo(points[index].x, points[index].y);
      }
      drawingContext.closePath();
      drawingContext.fillStyle = "rgba(230,57,70,0.05)";
      drawingContext.fill();
      drawingContext.strokeStyle = "rgba(230,57,70,0.7)";
      drawingContext.lineWidth = 2;
      drawingContext.stroke();
      drawingContext.strokeStyle = "rgba(230,57,70,0.08)";
      drawingContext.lineWidth = 6;
      drawingContext.stroke();

      const rotorTeeth = 30;
      const rotorGearRadius = 56;
      const toothDepth = 5;
      const gearPoints = rotorTeeth * 4;

      drawingContext.beginPath();
      for (let index = 0; index <= gearPoints; index += 1) {
        const angle = (index / gearPoints) * Math.PI * 2 + rotorAngle;
        const radius = rotorGearRadius + (index % 4 < 2 ? 0 : toothDepth);
        const gearX = rotorCenterX + radius * Math.cos(angle);
        const gearY = rotorCenterY + radius * Math.sin(angle);

        if (index === 0) {
          drawingContext.moveTo(gearX, gearY);
        } else {
          drawingContext.lineTo(gearX, gearY);
        }
      }
      drawingContext.closePath();
      drawingContext.strokeStyle = "rgba(230,57,70,0.2)";
      drawingContext.lineWidth = 1.5;
      drawingContext.stroke();

      drawingContext.beginPath();
      drawingContext.arc(rotorCenterX, rotorCenterY, rotorGearRadius - 2, 0, Math.PI * 2);
      drawingContext.strokeStyle = "rgba(230,57,70,0.1)";
      drawingContext.lineWidth = 1;
      drawingContext.stroke();

      drawingContext.beginPath();
      drawingContext.arc(rotorCenterX, rotorCenterY, 24, 0, Math.PI * 2);
      drawingContext.fillStyle = "rgba(230,57,70,0.03)";
      drawingContext.fill();
      drawingContext.strokeStyle = "rgba(230,57,70,0.18)";
      drawingContext.lineWidth = 1.5;
      drawingContext.stroke();

      apexes.forEach((apex) => {
        drawingContext.beginPath();
        drawingContext.arc(apex.x, apex.y, 4, 0, Math.PI * 2);
        drawingContext.fillStyle = "rgba(0,180,216,0.9)";
        drawingContext.fill();
        drawingContext.beginPath();
        drawingContext.arc(apex.x, apex.y, 9, 0, Math.PI * 2);
        drawingContext.fillStyle = "rgba(0,180,216,0.1)";
        drawingContext.fill();
      });

      drawingContext.beginPath();
      drawingContext.arc(canvasCenter, canvasCenter, 14, 0, Math.PI * 2);
      drawingContext.fillStyle = "rgba(230,57,70,0.04)";
      drawingContext.fill();
      drawingContext.strokeStyle = "rgba(255,255,255,0.15)";
      drawingContext.lineWidth = 1;
      drawingContext.stroke();

      drawingContext.beginPath();
      drawingContext.arc(canvasCenter, canvasCenter, 4, 0, Math.PI * 2);
      drawingContext.fillStyle = "rgba(230,57,70,0.7)";
      drawingContext.fill();

      drawingContext.restore();

      const portDistance = generatingRadius + eccentricity + 36;
      const ports = [
        {
          x: canvasCenter - portDistance * 0.85,
          y: canvasCenter - portDistance * 0.5,
          color: "rgba(0,180,216,0.5)",
          label: "INTAKE",
        },
        {
          x: canvasCenter + portDistance * 0.85,
          y: canvasCenter - portDistance * 0.5,
          color: "rgba(6,214,160,0.5)",
          label: "SPARK",
        },
        {
          x: canvasCenter,
          y: canvasCenter + portDistance * 0.95,
          color: "rgba(255,107,53,0.5)",
          label: "EXHAUST",
        },
      ];

      ports.forEach((port) => {
        drawingContext.beginPath();
        drawingContext.arc(port.x, port.y, 5, 0, Math.PI * 2);
        drawingContext.fillStyle = port.color;
        drawingContext.fill();

        drawingContext.beginPath();
        drawingContext.arc(port.x, port.y, 10, 0, Math.PI * 2);
        drawingContext.fillStyle = port.color.replace("0.5)", "0.08)");
        drawingContext.fill();

        drawingContext.font = '12px "Share Tech Mono"';
        drawingContext.fillStyle = "rgba(255,255,255,0.25)";
        drawingContext.textAlign = "center";
        drawingContext.fillText(port.label, port.x, port.y + 22);
      });
    };

    const animateRotaryEngine = () => {
      shaftAngle += 0.008 + rotaryBoostRef.current;
      rotaryBoostRef.current *= 0.92;
      drawRotaryEngine();
      frameId = window.requestAnimationFrame(animateRotaryEngine);
    };

    frameId = window.requestAnimationFrame(animateRotaryEngine);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const timelineEntries = Array.from(
      document.querySelectorAll<HTMLElement>(".timeline-entry"),
    );
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".section"));
    const waves = Array.from(document.querySelectorAll<HTMLElement>(".wave-divider"));
    const gauges = Array.from(
      document.querySelectorAll<HTMLElement>(".skill-gauge-fill"),
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -15% 0px" },
    );

    const waveObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("active", entry.isIntersecting);
        });
      },
      { threshold: 0.05 },
    );

    const gaugeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const gauge = entry.target as HTMLElement;
            gauge.style.width = `${gauge.dataset.width}%`;
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );

    [...revealElements, ...timelineEntries].forEach((element) =>
      revealObserver.observe(element),
    );
    sections.forEach((section) => sectionObserver.observe(section));
    waves.forEach((wave) => waveObserver.observe(wave));
    gauges.forEach((gauge) => gaugeObserver.observe(gauge));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      waveObserver.disconnect();
      gaugeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextScrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;
      const scrollDelta = Math.abs(scrollY - lastScrollYRef.current);

      lastScrollYRef.current = scrollY;
      rotaryBoostRef.current = Math.max(
        rotaryBoostRef.current,
        0.012 + scrollDelta * 0.015,
      );

      let nextActiveIndex = 0;
      sectionNav.forEach(({ id }, index) => {
        const element = document.getElementById(id);
        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) {
          nextActiveIndex = index;
        }
      });

      setScrollPercent(nextScrollPercent);
      if (scrollSourceRef.current === "shifter") {
        if (nextActiveIndex === scrollTargetRef.current) {
          // Target reached — unlock scroll guard
          scrollSourceRef.current = "user";
          scrollTargetRef.current = null;
          setActiveSectionIndex(nextActiveIndex);
        }
        // Don't update activeSectionIndex while still scrolling to target
        return;
      }
      setActiveSectionIndex(nextActiveIndex);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const tagline = taglineRef.current;
    if (!tagline) {
      return;
    }

    tagline.textContent = "";
    tagline.style.borderRight = "2px solid var(--red)";

    let charIndex = 0;
    let blinkCount = 0;
    let typeTimer = 0;
    let startTimer = 0;
    let blinkTimer = 0;

    const typeCharacter = () => {
      if (charIndex < HERO_TAGLINE.length) {
        tagline.textContent += HERO_TAGLINE[charIndex];
        charIndex += 1;
        typeTimer = window.setTimeout(
          typeCharacter,
          35 + Math.random() * 25,
        );
        return;
      }

      blinkTimer = window.setInterval(() => {
        tagline.style.borderRight =
          blinkCount % 2 === 0
            ? "2px solid transparent"
            : "2px solid var(--red)";
        blinkCount += 1;

        if (blinkCount > 6) {
          window.clearInterval(blinkTimer);
          tagline.style.borderRight = "none";
        }
      }, 500);
    };

    startTimer = window.setTimeout(typeCharacter, 800);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(typeTimer);
      window.clearInterval(blinkTimer);
      tagline.style.borderRight = "none";
      tagline.textContent = HERO_TAGLINE;
    };
  }, []);

  const rpm = Math.floor(scrollPercent * 9000);
  const lap = String(activeSectionIndex + 1).padStart(2, "0");

  return (
    <>
      <div className="cursor-dot" id="cursorDot" ref={cursorDotRef} />
      <div className="cursor-ring" id="cursorRing" ref={cursorRingRef} />
      {Array.from({ length: 12 }, (_, index) => (
        <div
          className="cursor-trail"
          key={index}
          ref={(element) => {
            cursorTrailRefs.current[index] = element;
          }}
        />
      ))}

      <canvas id="particles-canvas" ref={particleCanvasRef} />

      <div className="telemetry-bar">
        <div className="left-data">
          <span>
            <span className="status-dot" />
            SYSTEMS ONLINE
          </span>
          <span>
            LAP: <span id="teleLap">{lap}</span>/08
          </span>
        </div>
        <div className="rpm-readout" id="rpmReadout">
          {String(rpm).padStart(4, "0")} RPM
        </div>
        <div className="right-data">
          <span id="teleSection">G{activeSectionIndex + 1} {sectionNav[activeSectionIndex]?.label ?? "HERO"}</span>
          <span id="teleScroll">{Math.floor(scrollPercent * 100)}%</span>
        </div>
      </div>

      <HPatternShifter
        activeSectionIndex={activeSectionIndex}
        onGearEngage={handleGearEngage}
      />

      <main>
        <section className="section hero" id="hero">
          <div className="hero-bg-grid" />

          <div className="rotary-engine-container" id="rotaryEngine">
            <canvas
              id="rotaryCanvas"
              width="1040"
              height="1040"
              ref={rotaryCanvasRef}
            />
          </div>

          <h1 className="hero-title">JACK MA</h1>
          <p className="hero-subtitle">
            Software Engineer &nbsp;|&nbsp; Creator &nbsp;|&nbsp; Builder
          </p>
          <p className="hero-tagline" ref={taglineRef}>
            {HERO_TAGLINE}
          </p>

          <div className="scroll-indicator">
            <span>Scroll to explore</span>
            <div className="scroll-line" />
          </div>
        </section>
        <WaveDivider index={1} />

        <section className="section" id="about">
          <div className="section-header reveal">ABOUT</div>
          <div className="section-subtitle reveal reveal-delay-1">
            // WHO IS BEHIND THE WHEEL
          </div>

          <div className="about-content">
            <div className="about-text reveal reveal-delay-2">
              <p>
                I&apos;m a <span className="highlight">software engineer</span> based in
                Toronto with a deep love for building things — whether that&apos;s{" "}
                <span className="red">cloud infrastructure</span>,{" "}
                <span className="blue">full-stack applications</span>, or
                physical objects off my 3D printer.
              </p>
              <br />
              <p>
                My world sits at the intersection of{" "}
                <span className="highlight">engineering and creativity</span>. I
                design my own 3D models, obsess over{" "}
                <span className="red">rotary engines</span> (proud former RX-8
                owner — yes, I know about the apex seals), and follow{" "}
                <span className="highlight">Formula 1</span> with the intensity
                of a race strategist.
              </p>
              <br />
              <p>
                When I&apos;m not writing code or automating workflows, you&apos;ll find
                me exploring <span className="blue">AI automation</span>, creating
                art, or diving into whatever creative rabbit hole I&apos;ve
                discovered that week. I bring that same curiosity and
                relentlessness to every line of code I write.
              </p>
            </div>

            <div className="about-stats reveal reveal-delay-3">
              {aboutStats.map((stat) => (
                <div className="stat-card" key={stat.label}>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <WaveDivider index={2} />

        <section className="section" id="experience">
          <div className="section-header reveal">EXPERIENCE</div>
          <div className="section-subtitle reveal reveal-delay-1">// LAP TIMES</div>

          <div className="timeline">
            {experiences.map((experience) => (
              <div className="timeline-entry reveal" key={experience.company}>
                <div className="timeline-lap">
                  <span className="lap-flag" />
                  {experience.lap}
                </div>
                <div className="timeline-company">{experience.company}</div>
                <div className="timeline-role">{experience.role}</div>
                <div className="timeline-location">{experience.location}</div>
                <ul className="timeline-bullets">
                  {experience.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>
                      {bullet.map((part, partIndex) =>
                        renderExperiencePart(part, partIndex),
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <WaveDivider index={3} />

        <section className="section" id="projects">
          <div className="section-header reveal">PROJECTS</div>
          <div className="section-subtitle reveal reveal-delay-1">// PIT BOARD</div>

          <div className="projects-grid">
            {projects.map((project) => (
              <div
                className={`project-card reveal ${project.delayClass}`.trim()}
                key={project.name}
              >
                <div className="project-card-inner">
                  <div className="project-front">
                    <div className="project-badge">{project.badge}</div>
                    <div>
                      <div className="project-name">{project.name}</div>
                      <div className="project-brief">{project.brief}</div>
                      <div className="project-flip-hint">
                        HOVER FOR DETAILS <span className="arrow">→</span>
                      </div>
                    </div>
                  </div>
                  <div className="project-back">
                    <div className="project-back-title">{project.backTitle}</div>
                    <div className="project-back-desc">{project.description}</div>
                    <div className="project-tech-stack">
                      {project.techStack.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                    <a
                      className="project-link"
                      href={project.href}
                      target="_blank"
                      rel="noopener"
                    >
                      VIEW ON GITHUB <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <WaveDivider index={4} />

        <section className="section" id="skills">
          <div className="section-header reveal">SKILLS</div>
          <div className="section-subtitle reveal reveal-delay-1">
            // TELEMETRY DATA
          </div>

          <div className="skills-dashboard">
            {skillPanels.map((panel) => (
              <div
                className={`skill-panel reveal ${panel.delayClass}`.trim()}
                key={panel.title}
              >
                <div className="skill-panel-title">
                  <span className="indicator" />
                  {panel.title}
                </div>
                {panel.skills.map((skill) => (
                  <div className="skill-gauge" key={skill.label}>
                    <span className="skill-gauge-label">{skill.label}</span>
                    <div className="skill-gauge-bar">
                      <div
                        className={`skill-gauge-fill ${panel.color}`}
                        data-width={skill.value}
                      />
                    </div>
                    <span className="skill-gauge-value">{skill.value}%</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
        <WaveDivider index={5} />

        <section className="section" id="education">
          <div className="section-header reveal">EDUCATION</div>
          <div className="section-subtitle reveal reveal-delay-1">
            // PIT CREW TRAINING
          </div>

          <div className="education-grid">
            {education.map((entry) => (
              <div
                className={`edu-card reveal ${entry.delayClass}`.trim()}
                key={`${entry.school}-${entry.year}`}
              >
                <div className="year-badge">{entry.year}</div>
                <div className="edu-school">{entry.school}</div>
                <div className="edu-degree">{entry.degree}</div>
                <div className="edu-gpa">
                  {"gpaValue" in entry ? (
                    <>
                      {entry.gpaLabel}{" "}
                      <span className="gpa-value">{entry.gpaValue}</span>
                    </>
                  ) : (
                    entry.gpaText
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        <WaveDivider index={6} />

        <section className="section" id="passions">
          <div className="section-header reveal">PASSIONS</div>
          <div className="section-subtitle reveal reveal-delay-1">
            // WHAT FUELS THE ENGINE
          </div>

          <div className="passions-grid">
            {passions.map((passion) => (
              <div
                className={`passion-item reveal ${passion.delayClass}`.trim()}
                key={passion.title}
              >
                {"model" in passion ? (
                  <div className="model-viewer">
                    <div className="model-3d" id="model3d">
                      <div className="model-face">▲</div>
                      <div className="model-face">◆</div>
                      <div className="model-face">●</div>
                      <div className="model-face">■</div>
                      <div className="model-face">★</div>
                      <div className="model-face">◎</div>
                    </div>
                  </div>
                ) : (
                  <div className="passion-icon">{passion.icon}</div>
                )}
                <div className="passion-title">{passion.title}</div>
                <div className="passion-desc">{passion.description}</div>
              </div>
            ))}
          </div>
        </section>
        <WaveDivider index={7} />

        <section className="section contact-section" id="contact">
          <div className="section-header reveal">CONTACT</div>
          <div className="section-subtitle reveal reveal-delay-1">
            // LET&apos;S CONNECT
          </div>

          <div className="contact-links reveal reveal-delay-2">
            {contactLinks.map((link) => (
              <a
                className="contact-link"
                href={link.href}
                key={link.label}
                rel={link.href.startsWith("http") ? "noopener" : undefined}
                target={link.href.startsWith("http") ? "_blank" : undefined}
              >
                <ContactIcon icon={link.icon} />
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>JACK MA © 2026 — BUILT WITH PASSION AND HIGH OCTANE</span>
      </footer>
    </>
  );
}
