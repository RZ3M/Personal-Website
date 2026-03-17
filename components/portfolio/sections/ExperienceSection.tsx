import React, { Fragment } from "react";

import { experiences, type ExperiencePart } from "@/lib/portfolio-data";

function renderExperiencePart(part: ExperiencePart, index: number) {
  if (part.type === "tag") {
    return (
      <span className="tech-tag" key={index}>
        {part.content}
      </span>
    );
  }
  if (part.type === "strong") {
    return <strong key={index}>{part.content}</strong>;
  }
  return <Fragment key={index}>{part.content}</Fragment>;
}

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
            <ul className="timeline-bullets">
              {experience.bullets.map((bullet, bulletIndex) => (
                <li key={bulletIndex}>
                  {bullet.map((part, partIndex) =>
                    renderExperiencePart(part, partIndex),
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
});
