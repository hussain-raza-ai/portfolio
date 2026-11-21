"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ProjectVisual } from "@/components/ProjectVisual";
import { projects, inProgress } from "@/content/projects";
import { clamp, listenPointer, pointer, spring, step } from "@/lib/motion";

const SPACING = 1500; // px between monoliths along the camera path
const FLAT = "(max-width: 820px), (prefers-reduced-motion: reduce)";

const vars = (v: Record<string, string | number>) => v as CSSProperties;

// The work section is a corridor of glass monoliths. Scrolling moves the camera
// forward through them: the one in focus is sharp and turns to face the pointer,
// the ones ahead wait out of focus, and the one behind flies past the lens.
export function Monoliths() {
  const trackRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = projects.length;

  useEffect(() => {
    const track = trackRef.current;
    const world = worldRef.current;
    if (!track || !world) return;
    listenPointer();

    const mq = window.matchMedia(FLAT);
    const items = Array.from(world.querySelectorAll<HTMLElement>(".monolith"));
    const tilt = items.map(() => ({ x: spring(), y: spring() }));
    const idle = items.map(() => false);
    const cam = { x: spring(), y: spring() };
    let frame = 0;
    let running = false;
    let inView = false;
    let lastActive = -1;
    let lastP = -1;
    let lastMx = 0;
    let lastMy = 0;
    // Layout is measured once (and on resize), never inside the animation frame
    let W = window.innerWidth;
    let H = window.innerHeight;
    let trackTop = 0;
    let travel = 1;
    let sizes = items.map(() => ({ w: 1, h: 1 }));
    const measure = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      trackTop = track.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, track.offsetHeight - H);
      sizes = items.map((el) => ({ w: el.offsetWidth || 1, h: el.offsetHeight || 1 }));
    };

    const clear = () => {
      world.style.transform = "";
      items.forEach((el) => {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.visibility = "";
        el.style.pointerEvents = "";
        el.classList.remove("is-idle");
      });
    };

    const tick = () => {
      const p = clamp((window.scrollY - trackTop) / travel, 0, 1);
      const camZ = p * (count - 1) * SPACING;
      const mx = pointer.active ? pointer.nx - 0.5 : 0;
      const my = pointer.active ? pointer.ny - 0.5 : 0;

      const ry = step(cam.x, mx * 5, 0.06, 0.82);
      const rx = step(cam.y, -my * 3.5, 0.06, 0.82);
      world.style.transform = `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
      let moving = Math.abs(cam.x.velocity) + Math.abs(cam.y.velocity) > 0.002;

      items.forEach((el, i) => {
        const z = camZ - i * SPACING; // 0 = in focus, negative = ahead, positive = passed
        const ahead = clamp(-z / SPACING, 0, 3);
        const side = i % 2 === 0 ? -1 : 1;
        const x = side * W * 0.1 * Math.min(ahead, 1.2);
        const turn = -side * 14 * Math.min(ahead, 1);
        const focus = 1 - clamp(Math.abs(z) / (SPACING * 0.35), 0, 1);

        const t = tilt[i];
        const tx = step(t.x, focus * -my * 9, 0.1, 0.78);
        const ty = step(t.y, focus * mx * 12, 0.1, 0.78);
        if (Math.abs(t.x.velocity) + Math.abs(t.y.velocity) > 0.002) moving = true;

        el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), -50%, ${z.toFixed(1)}px) rotateY(${(turn + ty).toFixed(3)}deg) rotateX(${tx.toFixed(3)}deg)`;
        // The monolith in focus is solid; those waiting ahead are faint so they never compete with it.
        const opacity = z > 0 ? 1 - z / (SPACING * 0.5) : ahead < 1 ? 1 - ahead * 0.66 : 0.34 - (ahead - 1) * 0.17;
        el.style.opacity = clamp(opacity, 0, 1).toFixed(3);
        el.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
        el.style.pointerEvents = focus > 0.4 ? "auto" : "none";
        const isIdle = focus < 0.15;
        if (isIdle !== idle[i]) {
          idle[i] = isIdle;
          el.classList.toggle("is-idle", isIdle);
        }

        if (focus > 0) {
          const { w, h } = sizes[i];
          const left = W / 2 - w / 2;
          const top = H * 0.56 - h / 2;
          el.style.setProperty("--lx", `${(((pointer.x - left) / w) * 100).toFixed(1)}%`);
          el.style.setProperty("--ly", `${(((pointer.y - top) / h) * 100).toFixed(1)}%`);
          el.style.setProperty("--shx", `${(-mx * 60).toFixed(1)}px`);
        }
      });

      const nextActive = Math.round(p * (count - 1));
      if (nextActive !== lastActive) {
        lastActive = nextActive;
        setActive(nextActive);
      }

      const changed = p !== lastP || mx !== lastMx || my !== lastMy;
      lastP = p;
      lastMx = mx;
      lastMy = my;
      if (!changed && !moving) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (running || !inView || mq.matches) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const reset = () => {
      cancelAnimationFrame(frame);
      running = false;
      measure();
      if (mq.matches) clear();
      else kick();
    };

    // Only animate while the corridor is near the viewport, and only when something changed
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          measure();
          kick();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(track);
    mq.addEventListener("change", reset);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("pointermove", kick, { passive: true });
    window.addEventListener("resize", reset);
    reset();

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      mq.removeEventListener("change", reset);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("pointermove", kick);
      window.removeEventListener("resize", reset);
    };
  }, [count]);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const travel = track.offsetHeight - window.innerHeight;
    const top = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (travel * i) / (count - 1), behavior: "smooth" });
  };

  return (
    <section id="work" className="fly" style={vars({ "--count": count })} aria-labelledby="work-title">
      <div className="fly-track" ref={trackRef}>
      {projects.map((p, i) => (
        <span key={p.slug} className="snap-point" style={vars({ "--i": i })} aria-hidden="true" />
      ))}

      <div className="fly-stage">
        <header className="fly-head wrap">
          <h2 id="work-title" className="section-title">
            Five systems, built for real users
          </h2>
          <p className="fly-hint">Scroll to move through them. Select one to open its case study.</p>
        </header>

        <div className="fly-world" ref={worldRef}>
          {projects.map((p, i) => (
            <article key={p.slug} className="monolith" aria-labelledby={`mono-${p.slug}`}>
              <div className="mono-glass">
                <Link href={`/work/${p.slug}`} className="mono-cover" data-cursor="open" tabIndex={-1} aria-hidden="true" />
                <div className="mono-text">
                  <p className="mono-index">
                    {String(i + 1).padStart(2, "0")} of {String(count).padStart(2, "0")}
                  </p>
                  <h3 id={`mono-${p.slug}`} className="mono-title">
                    {p.title}
                  </h3>
                  <p className="mono-context">{p.context}</p>
                  <p className="mono-summary">{p.summary}</p>
                  <p className="mono-outcome">{p.outcome}</p>
                  <ul className="chips">
                    {p.stack.slice(0, 6).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <Link href={`/work/${p.slug}`} className="mono-link" data-cursor>
                    Open the case study
                  </Link>
                </div>
                <div className="mono-visual">
                  <ProjectVisual slug={p.slug} />
                </div>
              </div>
              <div className="mono-shadow" aria-hidden="true" />
            </article>
          ))}
        </div>

        <nav className="fly-rail" aria-label="Jump to a system">
          <ol>
            {projects.map((p, i) => (
              <li key={p.slug}>
                <button type="button" className={i === active ? "is-active" : undefined} onClick={() => goTo(i)}>
                  <span className="rail-dot" aria-hidden="true" />
                  <span className="rail-label">{p.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      </div>

      <p className="fly-more wrap">
        <strong>Also in progress:</strong> {inProgress}
      </p>
    </section>
  );
}
