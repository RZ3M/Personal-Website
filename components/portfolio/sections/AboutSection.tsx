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
            Toronto with a deep passion for building things, whether that&apos;s{" "}
            <span className="blue">full-stack applications</span>,{" "}
            <span className="highlight">AI automation systems</span>, or{" "}
            <span className="red">CAD models for 3D printing</span>.
          </p>
          <br />
          <p>
            With a background in{" "}
            <span className="blue">Electrical Engineering</span> at the
            <span className="highlight"> University of Waterloo</span> and{" "}
            <span className="blue">Computer Science</span> at{" "}
            <span className="highlight">Ontario Tech University</span>, I have
            equal respect for systems{" "}
            <span className="highlight">digital and physical</span>.
          </p>
          <br />
          <p>
            My world sits at the intersection of{" "}
            <span className="highlight">engineering and art</span>, and to me
            they&apos;re one and the same. A perfectly executing system is as
            beautiful as a Picasso or Van Gogh. When humanity can create
            machinery that works better than the sum of its parts, does that
            machine not have a <span className="red">soul of its own</span>?
          </p>
          <br />
          <p>
            My favourite art piece is{" "}
            <a
              className="highlight"
              href="https://en.wikipedia.org/wiki/The_Garden_of_Earthly_Delights"
              rel="noreferrer"
              target="_blank"
            >
              The Garden of Earthly Delights
            </a>{" "}
            by Bosch, and I previously owned a{" "}
            <span className="red">2010 Mazda RX-8</span>, which inspired this
            website. When I&apos;m not smacking my keyboard, you&apos;ll find me at
            the gym, cooking a tasty meal, or cycling around the city.
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
