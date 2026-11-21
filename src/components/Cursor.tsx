"use client";

import { useEffect, useRef } from "react";
import { isFinePointer, prefersReducedMotion, spring, step } from "@/lib/motion";

// Pointer in the style of iPadOS and visionOS. A soft dot follows the mouse with no lag.
// Over a button, link or icon it melts into a highlight that hugs that control and
// drifts slightly with the hand. Over a large card it becomes an "Open" disc, and over
// a text field it becomes a caret. The spring loop only runs while something is moving.

const HUG = "a, button, summary, [role='tab'], [data-cursor]";
const TEXT =
  "input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";
const PAD = 6;
const BIG_AREA = 300 * 140;

type Mode = "free" | "hug" | "text" | "open";

export function Cursor() {
  const ptrRef = useRef<HTMLDivElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ptr = ptrRef.current;
    const hl = hlRef.current;
    if (!ptr || !hl || !isFinePointer()) return;
    const reduce = prefersReducedMotion();
    const root = document.documentElement;
    root.classList.add("has-cursor");

    let px = -200;
    let py = -200;
    let mode: Mode = "free";
    let target: HTMLElement | null = null;
    let radius = 999;
    const box = { x: spring(), y: spring(), w: spring(), h: spring() };
    let last = { x: 0, y: 0, w: 0, h: 0 };
    let frame = 0;
    let running = false;

    const goal = () => {
      if (mode === "hug" && target) {
        if (!target.isConnected) {
          setMode("free", null);
        } else {
          const r = target.getBoundingClientRect();
          const dx = (px - (r.left + r.width / 2)) * 0.05;
          const dy = (py - (r.top + r.height / 2)) * 0.08;
          return { x: r.left - PAD + dx, y: r.top - PAD + dy, w: r.width + PAD * 2, h: r.height + PAD * 2 };
        }
      }
      return { x: px - 6, y: py - 6, w: 12, h: 12 };
    };

    const tick = () => {
      const g = goal();
      let x = g.x;
      let y = g.y;
      let w = g.w;
      let h = g.h;
      if (!reduce) {
        x = step(box.x, g.x, 0.22, 0.66);
        y = step(box.y, g.y, 0.22, 0.66);
        w = step(box.w, g.w, 0.2, 0.68);
        h = step(box.h, g.h, 0.2, 0.68);
      }
      hl.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      hl.style.width = `${Math.max(0, w).toFixed(2)}px`;
      hl.style.height = `${Math.max(0, h).toFixed(2)}px`;
      hl.style.setProperty("--r", `${Math.max(0, Math.min(radius + PAD, Math.min(w, h) / 2)).toFixed(1)}px`);
      hl.style.setProperty("--gx", `${(px - x).toFixed(1)}px`);
      hl.style.setProperty("--gy", `${(py - y).toFixed(1)}px`);

      const still = Math.abs(g.x - last.x) + Math.abs(g.y - last.y) + Math.abs(g.w - last.w) + Math.abs(g.h - last.h) < 0.05;
      last = g;
      const settled =
        reduce ||
        (Math.abs(x - g.x) < 0.1 &&
          Math.abs(y - g.y) < 0.1 &&
          Math.abs(w - g.w) < 0.1 &&
          Math.abs(h - g.h) < 0.1 &&
          Math.abs(box.x.velocity) + Math.abs(box.y.velocity) + Math.abs(box.w.velocity) + Math.abs(box.h.velocity) < 0.08);
      if (settled && still) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    function setMode(next: Mode, el: HTMLElement | null) {
      if (next === mode && el === target) return;
      const wasHug = mode === "hug";
      mode = next;
      target = el;
      ptr!.classList.toggle("is-hug", next === "hug");
      ptr!.classList.toggle("is-text", next === "text");
      ptr!.classList.toggle("is-open", next === "open");
      if (next === "hug" && el) {
        const r = el.getBoundingClientRect();
        const br = getComputedStyle(el).borderTopLeftRadius;
        radius = br.endsWith("%") ? Math.min(r.width, r.height) / 2 : parseFloat(br) || 10;
        if (!wasHug) {
          // Grow the highlight out of the pointer itself
          box.x.value = px - 6;
          box.y.value = py - 6;
          box.w.value = 12;
          box.h.value = 12;
          box.x.velocity = box.y.velocity = box.w.velocity = box.h.velocity = 0;
        }
        hl!.classList.add("is-on");
      } else {
        hl!.classList.remove("is-on");
      }
      kick();
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px = e.clientX;
      py = e.clientY;
      ptr.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      if (!ptr.classList.contains("is-on")) ptr.classList.add("is-on");
      if (mode === "hug") kick();
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      if (el.closest(TEXT)) return setMode("text", null);
      const t = el.closest<HTMLElement>(HUG);
      if (!t) return setMode("free", null);
      if (t.dataset.cursor === "open") return setMode("open", t);
      const r = t.getBoundingClientRect();
      setMode(r.width * r.height > BIG_AREA ? "open" : "hug", t);
    };

    const onDown = () => {
      ptr.classList.add("is-down");
      hl.classList.add("is-down");
    };
    const onUp = () => {
      ptr.classList.remove("is-down");
      hl.classList.remove("is-down");
    };
    const onLeave = () => {
      ptr.classList.remove("is-on");
      hl.classList.remove("is-on");
    };
    const onEnter = () => {
      if (mode === "hug") hl.classList.add("is-on");
    };
    const onScroll = () => {
      if (mode === "hug") kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("mouseleave", onLeave);
    root.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("mouseenter", onEnter);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={hlRef} className="ptr-hl" aria-hidden="true" />
      <div ref={ptrRef} className="ptr" aria-hidden="true">
        <span className="ptr-core" />
        <span className="ptr-label">Open</span>
      </div>
    </>
  );
}
