import React from "react";

import { projects } from "@/lib/portfolio-data";

export const ProjectsSection = React.memo(function ProjectsSection() {
  return (
    <section className="section" id="projects">
      <h2 className="section-header reveal">PROJECTS</h2>
      <div className="section-subtitle reveal reveal-delay-1">// PIT BOARD</div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div
            className={`project-card reveal ${project.delayClass}`.trim()}
            key={project.name}
          >
            <div className="project-card-inner">
              <div className="project-front">
                <div className="project-badge">{project.badge}</div>
                <div>
                  <div className="project-name">{project.name}</div>
                  <div className="project-brief">{project.brief}</div>
                  <div className="project-flip-hint">
                    HOVER FOR DETAILS <span className="arrow">→</span>
                  </div>
                </div>
              </div>
              <div className="project-back">
                <div className="project-back-title">{project.backTitle}</div>
                <div className="project-back-desc">{project.description}</div>
                <div className="project-tech-stack">
                  {project.techStack.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  {"demoHref" in project ? (
                    <a
                      className="project-link"
                      href={project.demoHref}
                      target="_blank"
                      rel="noopener"
                    >
                      VIEW DEMO <span>→</span>
                    </a>
                  ) : null}
                  <a
                    className="project-link"
                    href={project.href}
                    target="_blank"
                    rel="noopener"
                  >
                    {"linkLabel" in project ? project.linkLabel : "VIEW ON GITHUB"} <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
