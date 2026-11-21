"use client";

import { useEffect } from "react";

// Page effects: a soft light that follows the pointer across glass cards, and
// sections below the fold that rise into view as you scroll. Render once per page.
export function Effects() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>(".spot");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Looping animations pause in any section that is off screen
    const pauser =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) entry.target.classList.toggle("is-off", !entry.isIntersecting);
            },
            { rootMargin: "120px 0px" },
          )
        : undefined;
    document.querySelectorAll<HTMLElement>("main section").forEach((el) => pauser?.observe(el));

    let observer: IntersectionObserver | undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              observer?.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
      );
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        // Only hide what is still below the fold, so nothing on screen flickers.
        if (el.getBoundingClientRect().top > window.innerHeight * 0.92) {
          el.classList.add("pre");
          observer?.observe(el);
        }
      });
    }

    return () => {
      window.removeEventListener("pointermove", onMove);
      observer?.disconnect();
      pauser?.disconnect();
    };
  }, []);

  return null;
}
