"use client";

import { useEffect, useRef, useState } from "react";

// An example API response, invented for the demo. No patient data.
const RESPONSE = `{
  "success": true,
  "vitals": { "bp": "122/78", "pulse": 72 },
  "history": "Sore throat, mild fever, 3 days",
  "allergies": "No known drug allergies",
  "examination": "Chest clear, throat red",
  "diagnosis": "Acute URTI",
  "medicines": [
    { "name": "BRUFEN 400MG TAB", "catalogue_match": true }
  ],
  "lab_tests": ["CBC", "TSH"],
  "safety_review": "passed"
}`;

type Token = { text: string; kind: "key" | "str" | "num" | "bool" | "punct" };

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  const pattern = /("(?:[^"\\]|\\.)*")(\s*:)?|(\btrue\b|\bfalse\b)|(-?\d+(?:\.\d+)?)|([^"\dtf]+|.)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) {
    if (match[1]) {
      tokens.push({ text: match[1], kind: match[2] ? "key" : "str" });
      if (match[2]) tokens.push({ text: match[2], kind: "punct" });
    } else if (match[3]) tokens.push({ text: match[3], kind: "bool" });
    else if (match[4]) tokens.push({ text: match[4], kind: "num" });
    else tokens.push({ text: match[0], kind: "punct" });
  }
  return tokens;
}

const TOKENS = tokenize(RESPONSE);
const TOTAL = RESPONSE.length;

export function MedScribeStream() {
  const ref = useRef<HTMLPreElement>(null);
  const [shown, setShown] = useState(TOTAL);

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    let visible = false;
    let count = 0;
    setShown(0);

    const step = () => {
      if (!visible) return;
      // Hold the stream while its card is out of focus in the corridor
      if (node.closest(".is-idle, .is-off")) {
        timer = window.setTimeout(step, 600);
        return;
      }
      if (count >= TOTAL) {
        timer = window.setTimeout(() => {
          count = 0;
          setShown(0);
          step();
        }, 3800);
        return;
      }
      count = Math.min(TOTAL, count + 4);
      setShown(count);
      timer = window.setTimeout(step, 33);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      window.clearTimeout(timer);
      if (visible) step();
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  let remaining = shown;
  return (
    <pre className="json" ref={ref} aria-label="Example MedScribe API response">
      <code>
        {TOKENS.map((t, i) => {
          if (remaining <= 0) return null;
          const text = t.text.slice(0, remaining);
          remaining -= t.text.length;
          return (
            <span key={i} className={`j-${t.kind}`}>
              {text}
            </span>
          );
        })}
        {shown < TOTAL ? <span className="caret" /> : null}
      </code>
    </pre>
  );
}
