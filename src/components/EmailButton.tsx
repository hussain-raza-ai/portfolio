"use client";

import type { MouseEvent, ReactNode } from "react";
import { Magnetic } from "@/components/Magnetic";
import { site } from "@/content/site";

// A plain mailto: link does nothing on computers without a mail app, so on a computer
// this opens a new Gmail message instead. Either way the address is copied and a short
// note confirms it, so a visitor always leaves with the address. Phones keep mailto:,
// which opens the phone's own mail app.
function toast(text: string) {
  document.querySelector(".toast")?.remove();
  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  el.textContent = text;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("is-on"));
  window.setTimeout(() => {
    el.classList.remove("is-on");
    window.setTimeout(() => el.remove(), 300);
  }, 3200);
}

export function EmailButton({ className, label, children }: { className?: string; label?: string; children: ReactNode }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    navigator.clipboard?.writeText(site.email).catch(() => {});
    const phone = window.matchMedia("(pointer: coarse)").matches;
    if (!phone) {
      e.preventDefault();
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(site.email)}`, "_blank", "noopener,noreferrer");
    }
    toast(`Email copied: ${site.email}`);
  };

  return (
    <Magnetic href={`mailto:${site.email}`} className={className} label={label} strength={0.3} onClick={onClick}>
      {children}
    </Magnetic>
  );
}
