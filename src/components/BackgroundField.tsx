"use client";

import { useEffect, useRef } from "react";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";

const R = 220; // lens radius in px

// The page sits on a quiet engineer's dot grid, drawn once by CSS and never repainted.
// A small lens of brighter dots follows the mouse. It is moved with a transform at most
// once per frame, so the rest of the page never has to redraw because of it.
export function BackgroundField() {
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lens = lensRef.current;
    if (!lens || !isFinePointer() || prefersReducedMotion()) return;
    let x = 0;
    let y = 0;
    let queued = false;

    const draw = () => {
      queued = false;
      const lx = x - R;
      const ly = y - R;
      lens.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      lens.style.backgroundPosition = `${-lx}px ${-ly}px, 0 0`;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX;
      y = e.clientY;
      if (!queued) {
        queued = true;
        requestAnimationFrame(draw);
      }
      if (!lens.classList.contains("is-on")) lens.classList.add("is-on");
    };
    const onLeave = () => lens.classList.remove("is-on");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="stage-bg" aria-hidden="true">
      <div className="lens" ref={lensRef} />
    </div>
  );
}
