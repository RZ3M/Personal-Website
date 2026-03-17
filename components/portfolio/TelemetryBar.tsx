import React from "react";

import { sectionNav } from "@/lib/portfolio-data";

interface TelemetryBarProps {
  displayRpm: number;
  scrollPercent: number;
  activeSectionIndex: number;
}

export const TelemetryBar = React.memo(function TelemetryBar({
  displayRpm,
  scrollPercent,
  activeSectionIndex,
}: TelemetryBarProps) {
  return (
    <div className="telemetry-bar">
      <div className="left-data">
        <span>
          <span className="status-dot" />
          SYSTEMS ONLINE
        </span>
      </div>
      <div className="rpm-readout" id="rpmReadout">
        {String(Math.floor(displayRpm)).padStart(4, "0")} RPM
      </div>
      <div className="right-data">
        <span id="teleSection">
          G{activeSectionIndex + 1} {sectionNav[activeSectionIndex]?.label ?? "HERO"}
        </span>
        <span id="teleScroll">{Math.floor(scrollPercent * 100)}%</span>
      </div>
    </div>
  );
});
