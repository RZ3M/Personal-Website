import React from "react";

import { passions } from "@/lib/portfolio-data";

export const PassionsSection = React.memo(function PassionsSection() {
  return (
    <section className="section" id="passions">
      <h2 className="section-header reveal">PASSIONS</h2>
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
  );
});
