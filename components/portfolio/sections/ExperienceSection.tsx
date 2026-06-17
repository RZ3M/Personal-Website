import React from "react";

import { experiences, type ExperiencePart } from "@/lib/portfolio-data";

function SectorPart({ part }: { part: ExperiencePart }) {
  if (part.type === "strong") {
    return <strong className="sector-metric">{part.content}</strong>;
  }
  if (part.type === "tag") {
    return <span className="sector-tag">{part.content}</span>;
  }
  return <>{part.content}</>;
}

export const ExperienceSection = React.memo(function ExperienceSection() {
  return (
    <section className="section" id="experience">
      <h2 className="section-header reveal">EXPERIENCE</h2>
      <div className="section-subtitle reveal reveal-delay-1">// LAP TIMES &amp; SECTOR SPLITS</div>

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

            <ol className="sector-list">
              {experience.bullets.map((parts, sectorIndex) => (
                <li className="sector-row" key={sectorIndex}>
                  <span className="sector-index" aria-hidden="true">
                    S{sectorIndex + 1}
                  </span>
                  <span className="sector-text">
                    {parts.map((part, i) => (
                      <SectorPart key={i} part={part} />
                    ))}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
});
