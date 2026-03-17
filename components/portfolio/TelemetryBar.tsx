import React from "react";
import { Thermometer } from "lucide-react";

interface TelemetryBarProps {
  displayRpm: number;
}

export const TelemetryBar = React.memo(function TelemetryBar({
  displayRpm,
}: TelemetryBarProps) {
  const normalizedRpm = Math.max(0, Math.min(1, (displayRpm - 750) / (9500 - 750)));
  const isAtRedline = Math.floor(displayRpm) >= 9500;
  const oilTempCelsius = Math.round(72 + normalizedRpm * 46);
  const throttleSegments = 6;
  const activeThrottleSegments = Math.max(
    1,
    Math.min(throttleSegments, Math.round(normalizedRpm * throttleSegments)),
  );

  return (
    <div className="telemetry-bar">
      <div className="left-data">
        <span>
          <span className="status-dot" />
          SYSTEMS ONLINE
        </span>
      </div>
      <div
        className={`rpm-readout${isAtRedline ? " redline" : ""}`}
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
      </div>
    </div>
  );
});
