"use client";

import { useEffect, useRef } from "react";

import { HERO_TAGLINE } from "@/lib/portfolio-data";

export function useTaglineTypewriter() {
  const taglineTextRef = useRef<HTMLSpanElement>(null);
  const taglineCursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const taglineText = taglineTextRef.current;
    const taglineCursor = taglineCursorRef.current;
    if (!taglineText || !taglineCursor) return;

    taglineText.textContent = "";
    taglineCursor.style.opacity = "1";

    let charIndex = 0;
    let blinkCount = 0;
    let typeTimer = 0;
    let startTimer = 0;
    let blinkTimer = 0;

    const typeCharacter = () => {
      if (charIndex < HERO_TAGLINE.length) {
        taglineText.textContent += HERO_TAGLINE[charIndex];
        charIndex += 1;
        typeTimer = window.setTimeout(typeCharacter, 35 + Math.random() * 25);
        return;
      }

      blinkTimer = window.setInterval(() => {
        taglineCursor.style.opacity = blinkCount % 2 === 0 ? "0" : "1";
        blinkCount += 1;
        if (blinkCount > 6) {
          window.clearInterval(blinkTimer);
          taglineCursor.style.opacity = "0";
        }
      }, 500);
    };

    startTimer = window.setTimeout(typeCharacter, 800);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(typeTimer);
      window.clearInterval(blinkTimer);
      taglineCursor.style.opacity = "0";
      taglineText.textContent = HERO_TAGLINE;
    };
  }, []);

  return { taglineTextRef, taglineCursorRef };
}
