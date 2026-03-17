export interface GearBand {
  floor: number;
  cruise: number;
  ratio: number;
}

const TRUE_IDLE_RPM = 750;
const REDLINE_RPM = 9500;
const LIMITER_ENTRY_RPM = REDLINE_RPM - 18;
const LIMITER_DROP_RPM = REDLINE_RPM - 135;
const LIMITER_RECOVER_RPM = REDLINE_RPM;

type LimiterMode = "off" | "cut" | "recover";

// Virtual RX-8-inspired ratio ladder for the portfolio's 8 section gears.
export const GEAR_BANDS: GearBand[] = [
  { ratio: 3.76, floor: 900, cruise: 2500 }, // Gear 1 — Hero
  { ratio: 2.48, floor: 1200, cruise: 3000 }, // Gear 2 — About
  { ratio: 1.86, floor: 1600, cruise: 3500 }, // Gear 3 — Experience
  { ratio: 1.50, floor: 2000, cruise: 4000 }, // Gear 4 — Projects
  { ratio: 1.22, floor: 2400, cruise: 4500 }, // Gear 5 — Skills
  { ratio: 1.01, floor: 2700, cruise: 5000 }, // Gear 6 — Education
  { ratio: 0.84, floor: 3000, cruise: 5500 }, // Gear 7 — Passions
  { ratio: 0.69, floor: 3400, cruise: 6000 }, // Gear 8 — Contact
];

export interface RpmEngine {
  tick(deltaMs: number): void;
  addScrollEnergy(scrollDelta: number): void;
  addPointerEnergy(pointerSpeed: number): void;
  addClickEnergy(): void;
  addShifterDragEnergy(): void;
  startThrottle(amount?: number): boolean;
  updateThrottle(amount?: number): void;
  stopThrottle(): void;
  upshift(fromGear: number, toGear: number): void;
  downshift(fromGear: number, toGear: number): void;
  setGear(gear: number): void;
  getRpm(): number;
  getThrottle(): number;
  hasThrottleInteracted(): boolean;
  isAtLimiter(): boolean;
}

interface RpmEngineState {
  rpm: number;
  gear: number;
  throttleTarget: number;
  throttlePosition: number;
  ambientEnergy: number;
  oscillationTime: number;
  limiterMode: LimiterMode;
  limiterElapsedMs: number;
  hasThrottleInteracted: boolean;
}

function clampRpm(rpm: number): number {
  return Math.max(TRUE_IDLE_RPM, Math.min(REDLINE_RPM, rpm));
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function rpmToRotationSpeed(rpm: number): number {
  const normalized = Math.max(0, Math.min(1, rpm / REDLINE_RPM));
  const base = 0.012 + normalized * 0.18 + normalized * normalized * 0.12;
  if (rpm < 1200) return Math.max(0.005, base + (Math.random() - 0.5) * 0.005);
  return base;
}

export function createRpmEngine(): RpmEngine {
  const state: RpmEngineState = {
    rpm: TRUE_IDLE_RPM,
    gear: 1,
    throttleTarget: 0,
    throttlePosition: 0,
    ambientEnergy: 0,
    oscillationTime: 0,
    limiterMode: "off",
    limiterElapsedMs: 0,
    hasThrottleInteracted: false,
  };

  const setThrottleTarget = (amount: number) => {
    state.throttleTarget = clamp01(amount);
  };

  const exitLimiter = () => {
    state.limiterMode = "off";
    state.limiterElapsedMs = 0;
  };

  const shiftToGear = (fromGear: number, toGear: number) => {
    const fromBand = GEAR_BANDS[fromGear - 1];
    const toBand = GEAR_BANDS[toGear - 1];
    const shiftedRpm = state.rpm * (toBand.ratio / fromBand.ratio);

    state.gear = toGear;
    state.rpm = clampRpm(Math.max(shiftedRpm, toBand.floor));

    if (shiftedRpm >= LIMITER_ENTRY_RPM) {
      state.rpm = REDLINE_RPM;
      state.limiterMode = "cut";
      state.limiterElapsedMs = 0;
    } else {
      exitLimiter();
    }
  };

  return {
    tick(deltaMs: number): void {
      const deltaSec = Math.min(deltaMs / 1000, 0.1);
      const band = GEAR_BANDS[state.gear - 1];

      state.oscillationTime += deltaSec;
      state.limiterElapsedMs += deltaMs;

      const throttleResponse = state.throttleTarget > state.throttlePosition ? 7.8 : 12.5;
      state.throttlePosition +=
        (state.throttleTarget - state.throttlePosition) * Math.min(1, throttleResponse * deltaSec);
      state.throttlePosition = clamp01(state.throttlePosition);

      const normalizedRpm = state.rpm / REDLINE_RPM;
      const ambientDecay = 1.25 + normalizedRpm * 2.8 + (state.throttlePosition > 0.06 ? 0.55 : 0);
      state.ambientEnergy = Math.max(0, state.ambientEnergy - ambientDecay * deltaSec);

      if (state.limiterMode === "off") {
        const limiterRequested =
          state.throttlePosition > 0.84 &&
          state.rpm >= LIMITER_ENTRY_RPM &&
          state.ambientEnergy < 0.9;

        if (limiterRequested) {
          state.limiterMode = "cut";
          state.limiterElapsedMs = 0;
        }
      }

      if (state.limiterMode === "cut") {
        const cutDropRate = 8200 + normalizedRpm * 2800;
        state.rpm = Math.max(LIMITER_DROP_RPM, state.rpm - cutDropRate * deltaSec);

        if (state.rpm <= LIMITER_DROP_RPM + 20 || state.limiterElapsedMs >= 48) {
          if (state.throttlePosition > 0.8) {
            state.limiterMode = "recover";
            state.limiterElapsedMs = 0;
          } else {
            exitLimiter();
          }
        }
      } else if (state.limiterMode === "recover") {
        if (state.throttlePosition <= 0.76) {
          exitLimiter();
        } else {
          const recoverRate =
            (10400 + state.throttlePosition * 3200) * Math.max(0.72, 1 - normalizedRpm * 0.08);
          state.rpm = Math.min(REDLINE_RPM, state.rpm + recoverRate * deltaSec);

          if (state.rpm >= LIMITER_RECOVER_RPM || state.limiterElapsedMs >= 84) {
            state.limiterMode = "cut";
            state.limiterElapsedMs = 0;
          }
        }
      } else {
        const throttleLift =
          Math.pow(state.throttlePosition, 0.93) * (REDLINE_RPM - band.floor + 260);
        const ambientLift = state.ambientEnergy * 2800;
        let targetRpm = band.floor + throttleLift + ambientLift;

        const idleWave = Math.sin(state.oscillationTime * 16) * 8;
        const breathingAmplitude = 8 + state.ambientEnergy * 34 + state.throttlePosition * 18;
        const breathingWave =
          Math.sin(state.oscillationTime * (4.1 + state.throttlePosition * 3.7)) * breathingAmplitude;
        targetRpm +=
          state.throttlePosition < 0.04 && state.ambientEnergy < 0.04
            ? idleWave
            : breathingWave;
        targetRpm = Math.max(band.floor, Math.min(REDLINE_RPM + 180, targetRpm));

        if (targetRpm > state.rpm) {
          const riseRate =
            1500 +
            state.throttlePosition * 9000 * Math.max(0.44, 1 - normalizedRpm * 0.32) +
            state.ambientEnergy * 2100;
          state.rpm = Math.min(targetRpm, state.rpm + riseRate * deltaSec);
        } else {
          const highRpmFactor = normalizedRpm * normalizedRpm;
          const overrunFactor = Math.max(0, (state.rpm - 7200) / (REDLINE_RPM - 7200));
          const dropRate =
            650 +
            highRpmFactor * 2600 +
            overrunFactor * 4200 +
            (1 - state.throttlePosition) * 520;
          state.rpm = Math.max(targetRpm, state.rpm - dropRate * deltaSec);
        }
      }

      if (state.limiterMode === "off" && state.rpm < band.floor) {
        state.rpm = Math.min(band.floor, state.rpm + 1700 * deltaSec);
      }

      state.rpm = clampRpm(state.rpm);
    },

    addScrollEnergy(scrollDelta: number): void {
      const energyBoost = Math.min(0.5, scrollDelta / 700);
      const ambientScale = 1 - state.throttlePosition * 0.72;
      state.ambientEnergy = clamp01(state.ambientEnergy + energyBoost * ambientScale);
    },

    addPointerEnergy(pointerSpeed: number): void {
      const energyBoost = Math.min(0.045, pointerSpeed * 0.012);
      const ambientScale = 1 - state.throttlePosition * 0.88;
      state.ambientEnergy = clamp01(state.ambientEnergy + energyBoost * ambientScale);
    },

    addClickEnergy(): void {
      if (state.throttleTarget > 0 || state.throttlePosition > 0.06 || state.limiterMode !== "off") {
        return;
      }

      state.ambientEnergy = clamp01(state.ambientEnergy + 0.04);
      state.rpm = clampRpm(state.rpm + 120);
    },

    addShifterDragEnergy(): void {
      state.ambientEnergy = clamp01(state.ambientEnergy + 0.05);
      state.rpm = clampRpm(state.rpm + 90);
    },

    startThrottle(amount = 1): boolean {
      const band = GEAR_BANDS[state.gear - 1];
      setThrottleTarget(amount);

      const isFirstThrottle = !state.hasThrottleInteracted;
      if (isFirstThrottle) {
        state.hasThrottleInteracted = true;
        state.rpm = Math.max(state.rpm, band.floor + 260);
        state.rpm = clampRpm(state.rpm + 180);
      }

      return isFirstThrottle;
    },

    updateThrottle(amount = 1): void {
      setThrottleTarget(amount);
    },

    stopThrottle(): void {
      setThrottleTarget(0);
      exitLimiter();
    },

    upshift(fromGear: number, toGear: number): void {
      shiftToGear(fromGear, toGear);
      state.ambientEnergy *= 0.64;
    },

    downshift(fromGear: number, toGear: number): void {
      const band = GEAR_BANDS[toGear - 1];
      shiftToGear(fromGear, toGear);
      state.rpm = Math.max(state.rpm, band.cruise);
      state.ambientEnergy = Math.max(state.ambientEnergy, 0.24);
    },

    setGear(gear: number): void {
      state.gear = Math.max(1, Math.min(8, gear));
      exitLimiter();
    },

    getRpm(): number {
      return state.rpm;
    },

    getThrottle(): number {
      return state.throttlePosition;
    },

    hasThrottleInteracted(): boolean {
      return state.hasThrottleInteracted;
    },

    isAtLimiter(): boolean {
      return state.limiterMode !== "off";
    },
  };
}
