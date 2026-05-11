import React from "react";

import { skillPanels } from "@/lib/portfolio-data";

export const SkillsSection = React.memo(function SkillsSection() {
  return (
    <section className="section" id="skills">
      <h2 className="section-header reveal">SKILLS</h2>
      <div className="section-subtitle reveal reveal-delay-1">// TELEMETRY DATA</div>

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
            <div className="skill-tags">
              {panel.skills.map((skill) => (
                <span className={`skill-tag ${panel.color}`} key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
