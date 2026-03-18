"use client";

import React from "react";
import { Moon, Sun, Thermometer } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface TelemetryBarProps {
  displayRpm: number;
  displayThrottle: number;
  isAtLimiter: boolean;
}

export const TelemetryBar = React.memo(function TelemetryBar({
  displayRpm,
  displayThrottle,
  isAtLimiter,
}: TelemetryBarProps) {
  const { theme, toggle } = useTheme();
  const normalizedRpm = Math.max(0, Math.min(1, (displayRpm - 750) / (9500 - 750)));
  const oilTempCelsius = Math.round(72 + normalizedRpm * 46);
  const throttleSegments = 6;
  const activeThrottleSegments = Math.max(
    0,
    Math.min(throttleSegments, Math.round(displayThrottle * throttleSegments)),
  );

  return (
    <div className="telemetry-bar">
      <div className="left-data">
        <span>
          <span className="status-dot" />
          <span className="status-text">SYSTEMS ONLINE</span>
        </span>
      </div>
      <div
        className={`rpm-readout${isAtLimiter ? " redline" : ""}`}
        id="rpmReadout"
      >
        {String(Math.floor(displayRpm)).padStart(4, "0")} RPM
      </div>
      <div className="right-data">
        <div className="telemetry-chip throttle-chip" id="teleThrottle">
          <span className="telemetry-chip-label">THR</span>
          <div className="throttle-hud" aria-hidden="true">
            {Array.from({ length: throttleSegments }, (_, index) => (
              <span
                key={index}
                className={`throttle-bar${index < activeThrottleSegments ? " active" : ""}`}
              />
            ))}
          </div>
        </div>
        <div className="telemetry-chip oil-chip" id="teleOilTemp">
          <Thermometer className="telemetry-chip-icon" aria-hidden="true" />
          <span className="telemetry-chip-label">OIL</span>
          <span className="telemetry-chip-value">{String(oilTempCelsius).padStart(3, "0")}C</span>
        </div>
        <button
          className="telemetry-chip theme-toggle-chip"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark"
            ? <Sun className="telemetry-chip-icon" aria-hidden="true" />
            : <Moon className="telemetry-chip-icon" aria-hidden="true" />
          }
          <span className="telemetry-chip-label theme-toggle-label">
            {theme === "dark" ? "DAY" : "NITE"}
          </span>
        </button>
      </div>
    </div>
  );
});
