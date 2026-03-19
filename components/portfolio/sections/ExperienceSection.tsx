import React from "react";

import { experiences } from "@/lib/portfolio-data";

export const ExperienceSection = React.memo(function ExperienceSection() {
  return (
    <section className="section" id="experience">
      <h2 className="section-header reveal">EXPERIENCE</h2>
      <div className="section-subtitle reveal reveal-delay-1">// LAP TIMES</div>

      <div className="timeline">
        {experiences.map((experience) => (
          <div className="timeline-entry reveal" key={experience.company}>
            <div className="timeline-lap">
              <span className="lap-flag" />
              {experience.lap}
            </div>
            <div className="timeline-company">{experience.company}</div>
            <div className="timeline-role">{experience.role}</div>
            <div className="timeline-location">{experience.location}</div>
          </div>
        ))}
      </div>
    </section>
  );
});
