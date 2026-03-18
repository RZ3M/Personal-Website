import React from "react";

import { aboutStats } from "@/lib/portfolio-data";

export const AboutSection = React.memo(function AboutSection() {
  return (
    <section className="section" id="about">
      <h2 className="section-header reveal">ABOUT</h2>
      <div className="section-subtitle reveal reveal-delay-1">
        // WHO IS BEHIND THE WHEEL
      </div>

      <div className="about-content">
        <div className="about-text reveal reveal-delay-2">
          <p>
            I&apos;m a <span className="highlight">software engineer</span> based in
            Toronto with a deep love for building things — whether that&apos;s{" "}
            <span className="red">cloud infrastructure</span>,{" "}
            <span className="blue">full-stack applications</span>, or
            physical objects off my 3D printer.
          </p>
          <br />
          <p>
            My world sits at the intersection of{" "}
            <span className="highlight">engineering and creativity</span>. I
            design my own 3D models, obsess over{" "}
            <span className="red">rotary engines</span> (proud former RX-8
            owner — yes, I know about the apex seals), and follow{" "}
            <span className="highlight">Formula 1</span> with the intensity
            of a race strategist.
          </p>
          <br />
          <p>
            That same mix shaped my academic path too, from{" "}
            <span className="blue">Electrical Engineering</span> foundations at
            Waterloo to a <span className="highlight">Computer Science</span>{" "}
            degree at Ontario Tech, giving me equal respect for systems that
            have to perform cleanly on paper and under load.
          </p>
          <br />
          <p>
            When I&apos;m not writing code or automating workflows, you&apos;ll find
            me exploring <span className="blue">AI automation</span>, creating
            art, or diving into whatever creative rabbit hole I&apos;ve
            discovered that week. I bring that same curiosity and
            relentlessness to every line of code I write.
          </p>
        </div>

        <div className="about-stats reveal reveal-delay-3">
          {aboutStats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
