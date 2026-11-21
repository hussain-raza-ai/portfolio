"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

// A small pill bar that sticks under the header on case study pages.
// The section you are reading is highlighted; tap one to jump to it.
export function CaseNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const els = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el));
    // A thin band across the middle of the screen: whichever section crosses it is "current"
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="case-nav" aria-label="Sections of this case study">
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={i.id === active ? "is-active" : undefined} aria-current={i.id === active ? "true" : undefined}>
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
