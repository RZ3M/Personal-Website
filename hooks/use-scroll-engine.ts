"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { sectionNav } from "@/lib/portfolio-data";
import type { RpmEngine } from "@/lib/rpm-engine";

export function useScrollEngine(
  rpmEngineRef: { current: RpmEngine | null },
  previousGearRef: { current: number },
) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const lastScrollYRef = useRef(0);
  const scrollSourceRef = useRef<"user" | "shifter">("user");
  const scrollTargetRef = useRef<number | null>(null);
  const scrollGuardTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleGearEngage = useCallback(
    (index: number) => {
      const newGear = index + 1;
      const oldGear = previousGearRef.current;
      if (newGear > oldGear) rpmEngineRef.current?.upshift(oldGear, newGear);
      else if (newGear < oldGear) rpmEngineRef.current?.downshift(oldGear, newGear);
      previousGearRef.current = newGear;

      clearTimeout(scrollGuardTimeoutRef.current);
      scrollSourceRef.current = "shifter";
      scrollTargetRef.current = index;
      document.getElementById(sectionNav[index].id)?.scrollIntoView({ behavior: "smooth" });
      scrollGuardTimeoutRef.current = setTimeout(() => {
        scrollSourceRef.current = "user";
        scrollTargetRef.current = null;
      }, 2000);
    },
    [rpmEngineRef, previousGearRef],
  );

  // IntersectionObserver for reveals, section visibility, and gauge animations
  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const timelineEntries = Array.from(
      document.querySelectorAll<HTMLElement>(".timeline-entry"),
    );
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".section"));
    const gauges = Array.from(document.querySelectorAll<HTMLElement>(".skill-gauge-fill"));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -15% 0px" },
    );

    const gaugeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const gauge = entry.target as HTMLElement;
            gauge.style.width = `${gauge.dataset.width}%`;
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );

    [...revealElements, ...timelineEntries].forEach((el) => revealObserver.observe(el));
    sections.forEach((s) => sectionObserver.observe(s));
    gauges.forEach((g) => gaugeObserver.observe(g));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      gaugeObserver.disconnect();
    };
  }, []);

  // Scroll handler — feeds RPM engine, tracks active section, detects gear changes
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const nextScrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;
      const scrollDelta = Math.abs(scrollY - lastScrollYRef.current);
      lastScrollYRef.current = scrollY;

      rpmEngineRef.current?.addScrollEnergy(scrollDelta);

      let nextActiveIndex = 0;
      sectionNav.forEach(({ id }, index) => {
        const element = document.getElementById(id);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.5) nextActiveIndex = index;
      });

      setScrollPercent(nextScrollPercent);

      if (scrollSourceRef.current === "shifter") {
        if (nextActiveIndex === scrollTargetRef.current) {
          scrollSourceRef.current = "user";
          scrollTargetRef.current = null;
          setActiveSectionIndex(nextActiveIndex);
        }
        return;
      }

      const newGear = nextActiveIndex + 1;
      const oldGear = previousGearRef.current;
      if (newGear !== oldGear) {
        if (newGear > oldGear) rpmEngineRef.current?.upshift(oldGear, newGear);
        else rpmEngineRef.current?.downshift(oldGear, newGear);
        previousGearRef.current = newGear;
      }

      setActiveSectionIndex(nextActiveIndex);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [rpmEngineRef, previousGearRef]);

  return { activeSectionIndex, scrollPercent, handleGearEngage };
}
