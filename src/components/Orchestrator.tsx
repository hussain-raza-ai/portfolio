"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flows, inputs, outputs, stages } from "@/content/engine";
import { prefersReducedMotion } from "@/lib/motion";

type Box = { left: number; right: number; cy: number; col: number };

// Column of every item, used to decide how the signal travels between them
const column = new Map<string, number>();
inputs.forEach((i) => column.set(i.id, 0));
stages.forEach((s, si) => s.tools.forEach((t) => column.set(t.id, si + 1)));
outputs.forEach((o) => column.set(o.id, stages.length + 1));

function routePath(ids: string[], boxes: Map<string, Box>) {
  const pts = ids.map((id) => boxes.get(id)).filter((b): b is Box => Boolean(b));
  if (pts.length < 2) return "";
  let d = `M ${pts[0].right} ${pts[0].cy}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    if (a.col === b.col) {
      const bulge = Math.max(a.right, b.right) + 26;
      d += ` C ${bulge} ${a.cy}, ${bulge} ${b.cy}, ${b.right} ${b.cy}`;
    } else {
      const mid = (a.right + b.left) / 2;
      d += ` C ${mid} ${a.cy}, ${mid} ${b.cy}, ${b.left} ${b.cy} L ${b.right} ${b.cy}`;
    }
  }
  return d;
}

function curve(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mid = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`;
}

// A live view of how my systems are wired: inputs on the left, three stages in the
// middle, results on the right. A project's path lights up and signals run along it.
export function Orchestrator() {
  const graphRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paths, setPaths] = useState<{ base: string[]; route: string; w: number; h: number }>({
    base: [],
    route: "",
    w: 0,
    h: 0,
  });
  const flow = flows[active];
  const on = new Set(flow.path);

  const measure = useCallback(() => {
    const graph = graphRef.current;
    if (!graph) return;
    const g = graph.getBoundingClientRect();
    const boxes = new Map<string, Box>();
    graph.querySelectorAll<HTMLElement>("[data-node]").forEach((el) => {
      const r = el.getBoundingClientRect();
      const id = el.dataset.node!;
      boxes.set(id, {
        left: r.left - g.left,
        right: r.right - g.left,
        cy: r.top - g.top + r.height / 2,
        col: column.get(id) ?? 0,
      });
    });
    const cards = Array.from(graph.querySelectorAll<HTMLElement>("[data-stage]")).map((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left - g.left, right: r.right - g.left, cy: r.top - g.top + r.height / 2 };
    });
    if (cards.length < 3) return;

    const base: string[] = [];
    inputs.forEach((i) => {
      const b = boxes.get(i.id);
      if (b) base.push(curve({ x: b.right, y: b.cy }, { x: cards[0].left, y: cards[0].cy }));
    });
    for (let i = 0; i < cards.length - 1; i++) {
      base.push(curve({ x: cards[i].right, y: cards[i].cy }, { x: cards[i + 1].left, y: cards[i + 1].cy }));
    }
    outputs.forEach((o) => {
      const b = boxes.get(o.id);
      const last = cards[cards.length - 1];
      if (b) base.push(curve({ x: last.right, y: last.cy }, { x: b.left, y: b.cy }));
    });

    setPaths({ base, route: routePath(flows[active].path, boxes), w: g.width, h: g.height });
  }, [active]);

  useEffect(() => {
    measure();
    const graph = graphRef.current;
    if (!graph) return;
    const ro = new ResizeObserver(measure);
    ro.observe(graph);
    return () => ro.disconnect();
  }, [measure]);

  // Stop the signal animations while the engine is off screen
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      const svg = graph.querySelector("svg");
      if (!svg) return;
      if (entry.isIntersecting) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
    io.observe(graph);
    return () => io.disconnect();
  }, []);

  // Walk through the projects on its own until someone picks one
  useEffect(() => {
    if (!auto || prefersReducedMotion()) return;
    const timer = window.setInterval(() => setActive((a) => (a + 1) % flows.length), 5200);
    return () => window.clearInterval(timer);
  }, [auto]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <div className="engine pane-glass">
      <div className="engine-bar">
        <p className="engine-name">
          orchestration.engine <span className="engine-sep">/</span>{" "}
          <span className="engine-status">
            <span className="engine-dot" aria-hidden="true" />
            running
          </span>
        </p>
        <p className="engine-motto">signal → decision → action</p>
      </div>

      <div className="engine-tabs" role="tablist" aria-label="Show the path of a project">
        {flows.map((f, i) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? "engine-tab is-active" : "engine-tab"}
            onClick={() => pick(i)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="engine-graph" ref={graphRef}>
        <svg className="engine-wires" width={paths.w} height={paths.h} aria-hidden="true">
          {paths.base.map((d, i) => (
            <path key={i} d={d} className="wire" />
          ))}
          {paths.route ? (
            <g key={flow.id}>
              <path id={`route-${flow.id}`} d={paths.route} className="wire-active" />
              {[0, 1, 2].map((n) => (
                <circle key={n} r="3.5" className="signal" visibility="hidden">
                  {/* Hidden until its motion starts, so it never waits at the corner */}
                  <set attributeName="visibility" to="visible" begin={`${n * 1.05}s`} />
                  <animateMotion dur="3.2s" begin={`${n * 1.05}s`} repeatCount="indefinite" rotate="auto">
                    <mpath href={`#route-${flow.id}`} />
                  </animateMotion>
                </circle>
              ))}
            </g>
          ) : null}
        </svg>

        <div className="engine-col is-io">
          <p className="engine-col-title">Input</p>
          {inputs.map((i) => (
            <div key={i.id} data-node={i.id} className={on.has(i.id) ? "node is-on" : "node"}>
              <p className="node-label">{i.label}</p>
              <p className="node-detail">{i.detail}</p>
            </div>
          ))}
        </div>

        {stages.map((s) => (
          <div key={s.id} className="engine-col">
            <p className="engine-col-title">{s.label}</p>
            <div data-stage={s.id} className={s.tools.some((t) => on.has(t.id)) ? "stage is-on" : "stage"}>
              <p className="stage-caption">{s.caption}</p>
              <ul className="tools">
                {s.tools.map((t) => (
                  <li key={t.id} data-node={t.id} className={on.has(t.id) ? "tool is-on" : "tool"}>
                    <span className="tool-dot" aria-hidden="true" />
                    {t.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="engine-col is-io">
          <p className="engine-col-title">Output</p>
          {outputs.map((o) => (
            <div key={o.id} data-node={o.id} className={on.has(o.id) ? "node is-on" : "node"}>
              <p className="node-label">{o.label}</p>
              <p className="node-detail">{o.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="engine-summary" aria-live="polite">
        <strong>{flow.label}.</strong> {flow.summary}
      </p>
    </div>
  );
}
