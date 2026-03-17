export interface GearBand {
  floor: number;
  cruise: number;
}

const TRUE_IDLE_RPM = 750;
const REDLINE_RPM = 9500;
const IDLE_SETTLE_DELAY_MS = 1500;

// Section-mapped gear bands — floor rises with gear/load, but redline stays global.
export const GEAR_BANDS: GearBand[] = [
  { floor: 900, cruise: 2500 }, // Gear 1 — Hero
  { floor: 1200, cruise: 3000 }, // Gear 2 — About
  { floor: 1600, cruise: 3500 }, // Gear 3 — Experience
  { floor: 2000, cruise: 4000 }, // Gear 4 — Projects
  { floor: 2400, cruise: 4500 }, // Gear 5 — Skills
  { floor: 2700, cruise: 5000 }, // Gear 6 — Education
  { floor: 3000, cruise: 5500 }, // Gear 7 — Passions
  { floor: 3400, cruise: 6000 }, // Gear 8 — Contact
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

function clampRpm(rpm: number): number {
  return Math.max(TRUE_IDLE_RPM, Math.min(REDLINE_RPM, rpm));
}

function clampTargetRpm(targetRpm: number, floorRpm: number): number {
  return Math.max(floorRpm, Math.min(REDLINE_RPM, targetRpm));
}

export function rpmToRotationSpeed(rpm: number): number {
  // Idle (~1600 RPM) → 0.035 rad/frame ≈ 0.33 rev/sec
  // Redline (~9500 RPM) → 0.165 rad/frame ≈ 1.57 rev/sec
  const base = 0.01 + (rpm / REDLINE_RPM) * 0.155;
  if (rpm < 1200) return Math.max(0.004, base + (Math.random() - 0.5) * 0.004);
  return base;
}

export function createRpmEngine(): RpmEngine {
  const state: RpmEngineState = {
    rpm: TRUE_IDLE_RPM,
    targetRpm: GEAR_BANDS[0].floor,
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
        if (now - state.lastInputTime > IDLE_SETTLE_DELAY_MS) {
          state.targetRpm = band.floor;
        }
      }

      state.targetRpm = clampTargetRpm(state.targetRpm, band.floor);

      // Approach target: fast accel, slower decay
      const diff = state.targetRpm - state.rpm;
      if (diff > 0) {
        state.rpm = Math.min(state.targetRpm, state.rpm + 2500 * deltaSec);
      } else if (diff < 0) {
        state.rpm = Math.max(state.targetRpm, state.rpm - 800 * deltaSec);
      }

      state.rpm = clampRpm(state.rpm);
      if (state.rpm < band.floor) {
        state.rpm = Math.min(band.floor, state.rpm + 1800 * deltaSec);
      }

      // Idle jitter
      if (state.rpm < band.floor + 200) {
        state.rpm += (Math.random() - 0.5) * 15;
        state.rpm = Math.max(TRUE_IDLE_RPM, state.rpm);
      }
    },

    addScrollEnergy(scrollDelta: number): void {
      const band = GEAR_BANDS[state.gear - 1];
      state.targetRpm = clampTargetRpm(state.targetRpm + scrollDelta * 12, band.floor);
      state.lastInputTime = performance.now();
    },

    addPointerEnergy(pointerSpeed: number): void {
      const band = GEAR_BANDS[state.gear - 1];
      state.targetRpm = clampTargetRpm(state.targetRpm + pointerSpeed * 1.5, band.floor);
      state.lastInputTime = performance.now();
    },

    addClickEnergy(): void {
      const band = GEAR_BANDS[state.gear - 1];
      state.targetRpm = clampTargetRpm(state.targetRpm + 300, band.floor);
      state.lastInputTime = performance.now();
    },

    addShifterDragEnergy(): void {
      const band = GEAR_BANDS[state.gear - 1];
      state.targetRpm = clampTargetRpm(state.targetRpm + 150, band.floor);
      state.lastInputTime = performance.now();
    },

    upshift(fromGear: number, toGear: number): void {
      const dropAmount = 1500 + Math.max(0, toGear - fromGear - 1) * 500;
      state.rpm = Math.max(TRUE_IDLE_RPM, state.rpm - dropAmount);
      state.revHangUntil = performance.now() + 200;
      state.gear = toGear;
      const band = GEAR_BANDS[toGear - 1];
      state.targetRpm = clampTargetRpm(Math.max(state.targetRpm - dropAmount * 0.35, band.floor), band.floor);
    },

    downshift(fromGear: number, toGear: number): void {
      const blipAmount = 1000 + Math.max(0, fromGear - toGear - 1) * 250;
      const band = GEAR_BANDS[toGear - 1];
      state.rpm = Math.min(REDLINE_RPM, state.rpm + blipAmount);
      state.gear = toGear;
      state.targetRpm = clampTargetRpm(Math.max(state.rpm, band.cruise), band.floor);
    },

    setGear(gear: number): void {
      state.gear = Math.max(1, Math.min(8, gear));
      const band = GEAR_BANDS[state.gear - 1];
      state.targetRpm = clampTargetRpm(state.targetRpm, band.floor);
    },

    getRpm(): number {
      return state.rpm;
    },
  };
}
