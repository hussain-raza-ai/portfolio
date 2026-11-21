// Tiny motion toolkit: critically-damped-ish springs and helpers.
// Used instead of a physics library so every interaction stays light and testable.

export type Spring = { value: number; velocity: number };

export function spring(value = 0): Spring {
  return { value, velocity: 0 };
}

/** Advance a spring one frame towards target. stiffness 0..1, damping 0..1 */
export function step(s: Spring, target: number, stiffness = 0.12, damping = 0.78) {
  s.velocity = (s.velocity + (target - s.value) * stiffness) * damping;
  s.value += s.velocity;
  return s.value;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isFinePointer() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}

/** Shared pointer state, updated once per event for every component to read. */
export const pointer = { x: 0, y: 0, vx: 0, vy: 0, nx: 0.5, ny: 0.5, active: false };

let listening = false;
export function listenPointer() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  pointer.x = window.innerWidth / 2;
  pointer.y = window.innerHeight / 2;
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.vx = e.clientX - pointer.x;
      pointer.vy = e.clientY - pointer.y;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.nx = e.clientX / window.innerWidth;
      pointer.ny = e.clientY / window.innerHeight;
      pointer.active = true;
    },
    { passive: true },
  );
}
