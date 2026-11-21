"use client";

import { useEffect, useRef } from "react";
import { capabilities } from "@/content/profile";
import { isFinePointer, prefersReducedMotion } from "@/lib/motion";

// Each skill responds to the pointer like a soft magnet: the chip under the
// cursor lifts, lights up and leans a little towards it, then settles back.
// Pure event handling plus CSS transitions: nothing runs while the mouse is still.
export function SkillField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !isFinePointer() || prefersReducedMotion()) return;
    let hot: HTMLElement | null = null;

    const release = () => {
      if (!hot) return;
      hot.classList.remove("is-hot");
      hot.style.removeProperty("--tx");
      hot.style.removeProperty("--ty");
      hot = null;
    };
    const onMove = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const chip = target?.closest<HTMLElement>(".skill") ?? null;
      if (chip !== hot) {
        release();
        if (chip) {
          hot = chip;
          chip.classList.add("is-hot");
        }
      }
      if (!chip || target !== chip) return;
      // offsetX/Y are in the chip's own (untransformed) space, so the lean never feeds back on itself
      const nx = e.offsetX / Math.max(1, chip.offsetWidth) - 0.5;
      const ny = e.offsetY / Math.max(1, chip.offsetHeight) - 0.5;
      chip.style.setProperty("--tx", `${(nx * 10).toFixed(1)}px`);
      chip.style.setProperty("--ty", `${(ny * 6).toFixed(1)}px`);
      chip.style.setProperty("--hx", `${e.offsetX}px`);
      chip.style.setProperty("--hy", `${e.offsetY}px`);
    };

    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", release);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", release);
    };
  }, []);

  return (
    <div className="skill-field" ref={ref}>
      {capabilities.map((group) => (
        <div key={group.group} className="skill-group">
          <h3 className="skill-group-title">{group.group}</h3>
          <ul className="skill-list">
            {group.items.map((item) => (
              <li key={item} className="skill">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
