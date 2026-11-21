import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The preview card shown when the site is shared on LinkedIn, WhatsApp and elsewhere.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#060708",
          backgroundImage: "radial-gradient(circle at 80% 15%, rgba(255,255,255,0.14), rgba(6,7,8,0) 55%)",
          color: "#F5F5F7",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 600 }}>{site.name}</div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 980,
          }}
        >
          I engineer AI that hears, reads and reasons.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#A6AEC6" }}>
          {`${site.role} at ${site.company}, ${site.location}`}
        </div>
        <div style={{ display: "flex", position: "absolute", left: 0, top: 0, width: 16, height: 630, backgroundImage: "linear-gradient(180deg, #FFD9E4, #D9E6FF, #D9FFF2)" }} />
      </div>
    ),
    { ...size },
  );
}
