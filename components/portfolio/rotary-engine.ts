// Extracted Wankel rotary engine renderer.
// createRotaryEngineRenderer(canvasSize) precomputes the housing and rotor
// profile once at the given resolution, then returns a draw() function.
// The reference canvas size is 1040; everything scales linearly from there.

import { DARK_COLORS, type ThemeColors } from "@/lib/theme-colors";

const FALLBACK_IDLE_RPM = 750;
const REDLINE_RPM = 9500;

export interface RotaryEngineRenderer {
  draw(
    ctx: CanvasRenderingContext2D,
    shaftAngle: number,
    opts?: { skipLabels?: boolean; skipPortLabels?: boolean; compact?: boolean; rpm?: number; colors?: ThemeColors },
  ): void;
}

export function drawPortLabels(
  ctx: CanvasRenderingContext2D,
  canvasSize: number,
  shaftAngle: number,
  opts?: { rpm?: number; colors?: ThemeColors },
): void {
  const scale = canvasSize / 1040;
  const canvasCenter = canvasSize / 2;
  const generatingRadius = 150 * scale;
  const eccentricity = 25 * scale;
  const rpm = opts?.rpm ?? FALLBACK_IDLE_RPM;
  const c = opts?.colors ?? DARK_COLORS;

  const portDistance = generatingRadius + eccentricity + 36 * scale;
  const cyclePhase = ((shaftAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const phaseWindow = (Math.PI * 2) / 3;
  const normalizedRpm = Math.max(0, Math.min(1, rpm / REDLINE_RPM));
  const pulseRadiusBoost = 2 + 8 * normalizedRpm;
  const glowRadiusBoost = 6 + 18 * normalizedRpm;
  const labelFontSize = Math.max(16 * scale, 18);
  const ports = [
    {
      x: canvasCenter - portDistance * 0.85,
      y: canvasCenter - portDistance * 0.5,
      rgb: c.blue,
      label: "INTAKE",
      phaseOffset: 0,
    },
    {
      x: canvasCenter + portDistance * 0.85,
      y: canvasCenter,
      rgb: c.green,
      label: "SPARK",
      phaseOffset: phaseWindow,
    },
    {
      x: canvasCenter - portDistance * 0.85,
      y: canvasCenter + portDistance * 0.5,
      rgb: c.orange,
      label: "EXHAUST",
      phaseOffset: phaseWindow * 2,
    },
  ];

  ctx.clearRect(0, 0, canvasSize, canvasSize);

  ports.forEach((port) => {
    const phaseDelta = Math.abs(
      ((((cyclePhase - port.phaseOffset) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) -
        Math.PI,
    );
    const proximity = Math.max(0, 1 - phaseDelta / phaseWindow);
    const pulse = 0.45 + proximity * (0.55 + normalizedRpm * 0.35);

    ctx.beginPath();
    ctx.arc(port.x, port.y, (5 + pulse * pulseRadiusBoost) * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${port.rgb},${0.38 + pulse * 0.55})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(port.x, port.y, (10 + pulse * glowRadiusBoost) * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${port.rgb},${0.06 + pulse * 0.14})`;
    ctx.fill();

    ctx.font = `${labelFontSize}px "Share Tech Mono"`;
    ctx.fillStyle = `rgba(${c.white},${0.3 + pulse * 0.55})`;
    ctx.textAlign = "center";
    ctx.fillText(port.label, port.x, port.y + 28 * scale);
  });
}

export function createRotaryEngineRenderer(
  canvasSize: number,
  factoryOpts?: { minLineWidth?: number },
): RotaryEngineRenderer {
  const scale = canvasSize / 1040;
  const minLW = factoryOpts?.minLineWidth ?? 0;
  // lw: apply scale then enforce minimum — keeps thin strokes visible on small canvases
  const lw = (w: number) => Math.max(minLW, w * scale);
  const canvasCenter = canvasSize / 2;
  const generatingRadius = 150 * scale;
  const eccentricity = 25 * scale;

  // Precompute epitrochoid housing outline
  const housingSteps = 360;
  const housingPoints: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= housingSteps; i++) {
    const t = (i / housingSteps) * Math.PI * 2;
    housingPoints.push({
      x: canvasCenter + generatingRadius * Math.cos(t) + eccentricity * Math.cos(3 * t),
      y: canvasCenter + generatingRadius * Math.sin(t) + eccentricity * Math.sin(3 * t),
    });
  }

  // Precompute rotor profile via envelope method
  const profileResolution = 720;
  const rotorProfile = new Float64Array(profileResolution).fill(Infinity);
  const thetaSteps = 1200;
  const housingProfileSteps = 1200;

  for (let thetaIndex = 0; thetaIndex < thetaSteps; thetaIndex++) {
    const theta = (thetaIndex / thetaSteps) * 6 * Math.PI;
    const rcX = eccentricity * Math.cos(theta);
    const rcY = eccentricity * Math.sin(theta);
    const rotorAngle = theta / 3;
    const cosR = Math.cos(rotorAngle);
    const sinR = Math.sin(rotorAngle);

    for (let sampleIndex = 0; sampleIndex < housingProfileSteps; sampleIndex++) {
      const s = (sampleIndex / housingProfileSteps) * 2 * Math.PI;
      const hx = generatingRadius * Math.cos(s) + eccentricity * Math.cos(3 * s);
      const hy = generatingRadius * Math.sin(s) + eccentricity * Math.sin(3 * s);
      const dx = hx - rcX;
      const dy = hy - rcY;
      const rotatedX = dx * cosR + dy * sinR;
      const rotatedY = -dx * sinR + dy * cosR;
      const distance = Math.sqrt(rotatedX * rotatedX + rotatedY * rotatedY);
      let angle = Math.atan2(rotatedY, rotatedX);
      if (angle < 0) angle += 2 * Math.PI;
      const profileIndex =
        Math.floor((angle / (2 * Math.PI)) * profileResolution) % profileResolution;
      if (distance < rotorProfile[profileIndex]) {
        rotorProfile[profileIndex] = distance;
      }
    }
  }

  // Gap tolerance — stays constant regardless of scale
  for (let i = 0; i < profileResolution; i++) {
    rotorProfile[i] *= 0.985;
  }

  function getRotorPath(
    rcX: number,
    rcY: number,
    angle: number,
  ): { points: Array<{ x: number; y: number }>; apexes: Array<{ x: number; y: number }> } {
    const points: Array<{ x: number; y: number }> = [];
    const apexes: Array<{ x: number; y: number }> = [];

    for (let i = 0; i < 3; i++) {
      const apexAngle = angle + (i * 2 * Math.PI) / 3;
      apexes.push({
        x: rcX + generatingRadius * Math.cos(apexAngle),
        y: rcY + generatingRadius * Math.sin(apexAngle),
      });
    }

    for (let i = 0; i < profileResolution; i++) {
      const localAngle = (i / profileResolution) * 2 * Math.PI;
      const worldAngle = localAngle + angle;
      const radius = rotorProfile[i];
      points.push({
        x: rcX + radius * Math.cos(worldAngle),
        y: rcY + radius * Math.sin(worldAngle),
      });
    }

    return { points, apexes };
  }

  return {
    draw(
      ctx: CanvasRenderingContext2D,
      shaftAngle: number,
      opts?: { skipLabels?: boolean; skipPortLabels?: boolean; compact?: boolean; rpm?: number; colors?: ThemeColors },
    ): void {
      const skipLabels = opts?.skipLabels ?? false;
      const skipPortLabels = opts?.skipPortLabels ?? false;
      const compact = opts?.compact ?? false;
      const rpm = opts?.rpm ?? FALLBACK_IDLE_RPM;
      const c = opts?.colors ?? DARK_COLORS;

      ctx.clearRect(0, 0, canvasSize, canvasSize);
      ctx.save();
      ctx.translate(canvasCenter, canvasCenter);
      ctx.rotate(-Math.PI / 2);

      if (compact) {
        // Zoom so the rotor fills ~80% of the canvas — eliminates dead space
        // Engine outer radius = (generatingRadius + eccentricity) = 175 * scale
        // Target: fill 40% of canvasSize from center → zoom = (0.4 * canvasSize) / (175 * scale)
        // This simplifies to the constant 0.4 * 1040 / 175 ≈ 2.37
        const zoom = (canvasSize * 0.4) / (175 * scale);
        ctx.scale(zoom, zoom);
      }

      ctx.translate(-canvasCenter, -canvasCenter);

      // Background glow — full mode only (compact skips this, it's the "particles")
      if (!compact) {
        const glowGradient = ctx.createRadialGradient(
          canvasCenter, canvasCenter, 120 * scale,
          canvasCenter, canvasCenter, 240 * scale,
        );
        glowGradient.addColorStop(0, `rgba(${c.red},0.02)`);
        glowGradient.addColorStop(1, `rgba(${c.red},0)`);
        ctx.beginPath();
        ctx.arc(canvasCenter, canvasCenter, 240 * scale, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      }

      // Housing outline
      ctx.beginPath();
      ctx.moveTo(housingPoints[0].x, housingPoints[0].y);
      for (let i = 1; i < housingPoints.length; i++) {
        ctx.lineTo(housingPoints[i].x, housingPoints[i].y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${c.red},0.5)`;
      ctx.lineWidth = lw(2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${c.red},0.12)`;
      ctx.lineWidth = lw(6);
      ctx.stroke();

      // Outer shell outline — slight offset to give the housing another perimeter layer
      ctx.beginPath();
      housingPoints.forEach((point, index) => {
        const offsetX = canvasCenter + (point.x - canvasCenter) * 1.06;
        const offsetY = canvasCenter + (point.y - canvasCenter) * 1.06;
        if (index === 0) ctx.moveTo(offsetX, offsetY);
        else ctx.lineTo(offsetX, offsetY);
      });
      ctx.closePath();
      ctx.strokeStyle = `rgba(${c.red},0.22)`;
      ctx.lineWidth = lw(1.1);
      ctx.stroke();

      // Rotor
      const rcX = canvasCenter + eccentricity * Math.cos(shaftAngle);
      const rcY = canvasCenter + eccentricity * Math.sin(shaftAngle);
      const rotorAngle = shaftAngle / 3;
      const { points, apexes } = getRotorPath(rcX, rcY, rotorAngle);

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(${c.red},0.05)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${c.red},0.7)`;
      ctx.lineWidth = lw(2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(${c.red},0.08)`;
      ctx.lineWidth = lw(6);
      ctx.stroke();

      // Gear teeth + hub
      const rotorTeeth = 30;
      const rotorGearRadius = 56 * scale;
      const toothDepth = 5 * scale;
      const gearPoints = rotorTeeth * 4;

      ctx.beginPath();
      for (let i = 0; i <= gearPoints; i++) {
        const angle = (i / gearPoints) * Math.PI * 2 + rotorAngle;
        const radius = rotorGearRadius + (i % 4 < 2 ? 0 : toothDepth);
        const gx = rcX + radius * Math.cos(angle);
        const gy = rcY + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${c.red},0.2)`;
      ctx.lineWidth = lw(1.5);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rcX, rcY, rotorGearRadius - lw(2), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${c.red},0.1)`;
      ctx.lineWidth = lw(1);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rcX, rcY, Math.max(lw(4), 24 * scale), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.red},0.03)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${c.red},0.18)`;
      ctx.lineWidth = lw(1.5);
      ctx.stroke();

      // Apex seals
      apexes.forEach((apex) => {
        ctx.beginPath();
        ctx.arc(apex.x, apex.y, Math.max(lw(2), 4 * scale), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.blue},0.9)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(apex.x, apex.y, Math.max(lw(3.5), 9 * scale), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.blue},0.15)`;
        ctx.fill();
      });

      // Shaft center
      ctx.beginPath();
      ctx.arc(canvasCenter, canvasCenter, Math.max(lw(3), 14 * scale), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.red},0.04)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${c.white},0.15)`;
      ctx.lineWidth = lw(1);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(canvasCenter, canvasCenter, Math.max(lw(1.5), 4 * scale), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.red},0.7)`;
      ctx.fill();

      ctx.restore();

      // Port labels (skipped for mini canvas and when rendered on a separate static canvas)
      if (!skipLabels && !skipPortLabels) {
        drawPortLabels(ctx, canvasSize, shaftAngle, { rpm, colors: c });
      }
    },
  };
}
