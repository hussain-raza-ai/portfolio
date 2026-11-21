"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Magnetic } from "@/components/Magnetic";
import { ContactIcons } from "@/components/ContactIcons";
import { isFinePointer, prefersReducedMotion, spring, step } from "@/lib/motion";
import { site } from "@/content/site";

// The hero: name and intro on the left, the portrait on the right.
// The portrait leans a few degrees towards the pointer. The animation only runs
// while the pointer is moving over the hero, then stops, so it costs nothing at rest.
export function HeroSpatial() {
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = portraitRef.current;
    const hero = el?.closest<HTMLElement>(".hero");
    if (!el || !hero || !isFinePointer() || prefersReducedMotion()) return;

    const rx = spring();
    const ry = spring();
    let tx = 0;
    let ty = 0;
    let frame = 0;
    let running = false;

    const tick = () => {
      const a = step(rx, tx, 0.07, 0.8);
      const b = step(ry, ty, 0.07, 0.8);
      el.style.transform = `perspective(1200px) rotateX(${a.toFixed(2)}deg) rotateY(${b.toFixed(2)}deg)`;
      const settled =
        Math.abs(a - tx) < 0.01 && Math.abs(b - ty) < 0.01 && Math.abs(rx.velocity) < 0.005 && Math.abs(ry.velocity) < 0.005;
      if (settled) {
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
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientY - r.top) / r.height - 0.5) * -5;
      ty = ((e.clientX - r.left) / r.width - 0.5) * 7;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const [first, ...rest] = site.name.split(" ");
  const lineOne = `${first} ${rest[0] ?? ""}`.trim();
  const lineTwo = rest.slice(1).join(" ");

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="pill">
            <span className="pulse" aria-hidden="true" />
            {site.role} at {site.company}, {site.location}
          </p>

          <h1 id="hero-title" className="hero-name">
            <span>{lineOne}</span>
            {/* The space keeps the name readable as one phrase for search engines and screen readers */}
            {lineTwo ? <> <span>{lineTwo}</span></> : null}
          </h1>

          <p className="hero-role">I engineer AI that hears, reads and reasons.</p>

          <p className="hero-lede">
            Speech, document and language AI for IMC Hospital, running on the hospital&apos;s own GPUs, with the
            FastAPI backends and automations that put it to work.
          </p>

          <div className="hero-actions">
            <Magnetic href="#engine" className="btn btn-solid">
              See how my systems work
            </Magnetic>
            <Magnetic href="#ask" className="btn btn-glass">
              Ask my AI
            </Magnetic>
          </div>

          <ContactIcons />
        </div>

        <div className="hero-visual">
          <div className="portrait" ref={portraitRef}>
            <div className="portrait-frame">
              {site.photo ? (
                <Image
                  src={site.photo}
                  alt={`Portrait of ${site.name}`}
                  fill
                  priority
                  sizes="(max-width: 900px) 86vw, 460px"
                  className="portrait-img"
                />
              ) : (
                <div className="portrait-mono" aria-hidden="true">
                  <span>HR</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <a href="#engine" className="scroll-cue">
        <span className="scroll-line" aria-hidden="true" />
        Scroll
      </a>
    </section>
  );
}
