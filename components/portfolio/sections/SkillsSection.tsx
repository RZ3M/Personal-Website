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
  );
});
