export interface GearBand {
  idle: number;
  cruise: number;
  ceiling: number;
}

// Section-mapped gear bands — RPM range rises with engagement depth
export const GEAR_BANDS: GearBand[] = [
  { idle: 1600, cruise: 2500, ceiling: 4000 }, // Gear 1 — Hero
  { idle: 1800, cruise: 3000, ceiling: 5000 }, // Gear 2 — About
  { idle: 2000, cruise: 3500, ceiling: 5500 }, // Gear 3 — Experience
  { idle: 2200, cruise: 4000, ceiling: 6500 }, // Gear 4 — Projects
  { idle: 2400, cruise: 4500, ceiling: 7000 }, // Gear 5 — Skills
  { idle: 2600, cruise: 5000, ceiling: 7500 }, // Gear 6 — Education
  { idle: 2800, cruise: 5500, ceiling: 8500 }, // Gear 7 — Passions
  { idle: 3000, cruise: 6000, ceiling: 9500 }, // Gear 8 — Contact
];

export interface RpmEngine {
  tick(deltaMs: number): void;
  addScrollEnergy(scrollDelta: number): void;
  addPointerEnergy(pointerSpeed: number): void;
  addClickEnergy(): void;
  addShifterDragEnergy(): void;
  upshift(fromGear: number, toGear: number): void;
  downshift(fromGear: number, toGear: number): void;
  setGear(gear: number): void;
  getRpm(): number;
}

interface RpmEngineState {
  rpm: number;
  targetRpm: number;
  gear: number;
  lastInputTime: number;
  revHangUntil: number;
}

export function rpmToRotationSpeed(rpm: number): number {
  // Idle (~1600 RPM) → 0.035 rad/frame ≈ 0.33 rev/sec
  // Redline (~9500 RPM) → 0.165 rad/frame ≈ 1.57 rev/sec
  const base = 0.01 + (rpm / 9500) * 0.155;
  if (rpm < 1200) return Math.max(0.004, base + (Math.random() - 0.5) * 0.004);
  return base;
}

export function createRpmEngine(): RpmEngine {
  const state: RpmEngineState = {
    rpm: 750,
    targetRpm: GEAR_BANDS[0].idle,
    gear: 1,
    lastInputTime: performance.now(),
    revHangUntil: 0,
  };

  return {
    tick(deltaMs: number): void {
      const now = performance.now();
      const deltaSec = Math.min(deltaMs / 1000, 0.1);
      const band = GEAR_BANDS[state.gear - 1];

      // Rev-hang overrides inactivity decay
      if (now >= state.revHangUntil) {
        if (now - state.lastInputTime > 1500) {
          state.targetRpm = band.idle;
        }
      }

      // Clamp target within band
      state.targetRpm = Math.max(band.idle, Math.min(band.ceiling, state.targetRpm));

      // Approach target: fast accel, slower decay
      const diff = state.targetRpm - state.rpm;
      if (diff > 0) {
        state.rpm = Math.min(state.targetRpm, state.rpm + 2500 * deltaSec);
      } else if (diff < 0) {
        state.rpm = Math.max(state.targetRpm, state.rpm - 800 * deltaSec);
      }

      // Hard clamp
      state.rpm = Math.max(750, Math.min(9500, Math.min(band.ceiling, state.rpm)));

      // Idle jitter
      if (state.rpm < band.idle + 200) {
        state.rpm += (Math.random() - 0.5) * 15;
        state.rpm = Math.max(750, state.rpm);
      }
    },

    addScrollEnergy(scrollDelta: number): void {
      const band = GEAR_BANDS[state.gear - 1];
      state.targetRpm = Math.min(band.ceiling, state.targetRpm + scrollDelta * 12);
      state.lastInputTime = performance.now();
    },

    addPointerEnergy(pointerSpeed: number): void {
      const band = GEAR_BANDS[state.gear - 1];
      state.targetRpm = Math.min(band.ceiling, state.targetRpm + pointerSpeed * 1.5);
      state.lastInputTime = performance.now();
    },

    addClickEnergy(): void {
      const band = GEAR_BANDS[state.gear - 1];
      state.targetRpm = Math.min(band.ceiling, state.targetRpm + 300);
      state.lastInputTime = performance.now();
    },

    addShifterDragEnergy(): void {
      const band = GEAR_BANDS[state.gear - 1];
      state.targetRpm = Math.min(band.ceiling, state.targetRpm + 150);
      state.lastInputTime = performance.now();
    },

    upshift(fromGear: number, toGear: number): void {
      const dropAmount = 1500 + Math.max(0, toGear - fromGear - 1) * 500;
      state.rpm = Math.max(750, state.rpm - dropAmount);
      state.revHangUntil = performance.now() + 200;
      state.gear = toGear;
      const band = GEAR_BANDS[toGear - 1];
      state.targetRpm = Math.max(band.idle, Math.min(band.ceiling, state.targetRpm));
    },

    downshift(fromGear: number, toGear: number): void {
      const blipAmount = 1000 + Math.max(0, fromGear - toGear - 1) * 250;
      const band = GEAR_BANDS[toGear - 1];
      state.rpm = Math.min(9500, state.rpm + blipAmount);
      state.gear = toGear;
      state.targetRpm = band.cruise;
    },

    setGear(gear: number): void {
      state.gear = Math.max(1, Math.min(8, gear));
    },

    getRpm(): number {
      return state.rpm;
    },
  };
}
