import React from "react";

import { education } from "@/lib/portfolio-data";

export const EducationSection = React.memo(function EducationSection() {
  return (
    <section className="section" id="education">
      <h2 className="section-header reveal">EDUCATION</h2>
      <div className="section-subtitle reveal reveal-delay-1">// PIT CREW TRAINING</div>

      <div className="education-grid">
        {education.map((entry) => (
          <div
            className={`edu-card reveal ${entry.delayClass}`.trim()}
            key={`${entry.school}-${entry.year}`}
          >
            <div className="year-badge">{entry.year}</div>
            <div className="edu-school">{entry.school}</div>
            <div className="edu-degree">{entry.degree}</div>
            <div className="edu-gpa">
              {"gpaValue" in entry ? (
                <>
                  {entry.gpaLabel}{" "}
                  <span className="gpa-value">{entry.gpaValue}</span>
                </>
              ) : (
                entry.gpaText
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
