"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clamp, isFinePointer, listenPointer, pointer, prefersReducedMotion, spring, step } from "@/lib/motion";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  external?: boolean;
  download?: boolean;
  strength?: number;
  /** Accessible name, also shown as a hover label */
  label?: string;
};

// A link that leans towards the pointer when it comes near, and springs back.
export function Magnetic({ href, className, children, external, download, strength = 0.35, label }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isFinePointer() || prefersReducedMotion()) return;
    listenPointer();
    const x = spring();
    const y = spring();
    const inner = el.querySelector<HTMLElement>(".mag-inner");
    let frame = 0;
    let running = false;

    // Measured without our own offset, so the pull never feeds back on itself
    const hit = () => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - x.value;
      const cy = r.top + r.height / 2 - y.value;
      const dx = pointer.x - cx;
      const dy = pointer.y - cy;
      const inside = Math.abs(dx) < r.width / 2 + 12 && Math.abs(dy) < r.height / 2 + 12;
      return { dx, dy, inside };
    };

    const tick = () => {
      const { dx, dy, inside } = hit();
      // A small, bounded lean towards the hand, like a pointer on iPad: never enough to touch a neighbour
      const tx = inside ? clamp(dx * strength * 0.3, -6, 6) : 0;
      const ty = inside ? clamp(dy * strength * 0.45, -4, 4) : 0;
      const vx = step(x, tx, 0.16, 0.72);
      const vy = step(y, ty, 0.16, 0.72);
      el.style.transform = `translate3d(${vx.toFixed(2)}px, ${vy.toFixed(2)}px, 0)`;
      if (inner) inner.style.transform = `translate3d(${(vx * 0.5).toFixed(2)}px, ${(vy * 0.5).toFixed(2)}px, 0)`;
      const settled = !inside && Math.abs(vx) < 0.05 && Math.abs(vy) < 0.05 && Math.abs(x.velocity) + Math.abs(y.velocity) < 0.05;
      if (settled) {
        el.style.transform = "";
        if (inner) inner.style.transform = "";
        x.value = y.value = x.velocity = y.velocity = 0;
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running || !hit().inside) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", wake, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", wake);
    };
  }, [strength]);

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      data-cursor
      aria-label={label}
      data-label={label}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: true } : {})}
    >
      <span className="mag-inner">{children}</span>
    </a>
  );
}
