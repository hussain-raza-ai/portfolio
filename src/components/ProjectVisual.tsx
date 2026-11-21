import type { CSSProperties } from "react";
import { MedScribeStream } from "@/components/MedScribeStream";

const vars = (v: Record<string, string | number>) => v as CSSProperties;

// A small working picture of each system, shown inside its monolith.
export function ProjectVisual({ slug }: { slug: string }) {
  switch (slug) {
    case "medscribe-ai":
      return (
        <div className="terminal">
          <div className="terminal-bar">
            <span className="pulse" aria-hidden="true" />
            <span>POST /clinical/transcribe-url</span>
            <span className="terminal-ok">200 OK in 1.8 s</span>
          </div>
          <MedScribeStream />
        </div>
      );

    case "lab-report-extraction":
      return (
        <div className="lab">
          <div className="doc" aria-hidden="true">
            {["w80", "w55", "w90", "w70", "w85", "w60", "w75", "w65"].map((w, i) => (
              <span key={i} className={`doc-line ${w}`} />
            ))}
            <span className="scan" />
          </div>
          <ul className="extracted" aria-label="Sample extracted values">
            <li>
              <span>Haemoglobin</span>
              <span>13.2 g/dL</span>
              <span className="flag">Normal</span>
            </li>
            <li>
              <span>ALT</span>
              <span>64 U/L</span>
              <span className="flag is-high">High</span>
            </li>
            <li>
              <span>LDL cholesterol</span>
              <span>162 mg/dL</span>
              <span className="flag is-high">High</span>
            </li>
            <li className="fine">Sample values, verified by a doctor before use</li>
          </ul>
        </div>
      );

    case "dr-sara":
      return (
        <div className="sara">
          <div className="wave wave-lg" aria-hidden="true">
            {Array.from({ length: 32 }, (_, i) => (
              <i key={i} style={vars({ "--i": i, "--h": (0.3 + Math.abs(Math.sin(i * 1.3)) * 0.7).toFixed(2) })} />
            ))}
          </div>
          <p className="bubble bubble-ai">
            <span lang="ur" dir="rtl" className="urdu">
              آپ کو بخار کب سے ہے؟
            </span>
            <span className="translation">When did the fever start?</span>
          </p>
          <p className="bubble bubble-patient">
            <span lang="ur" dir="rtl" className="urdu">
              تین دن سے
            </span>
            <span className="translation">For three days</span>
          </p>
        </div>
      );

    case "smart-query-routing":
      return (
        <ul className="routes" aria-label="Example queries being routed">
          {[
            ["Fee deadline?", "Accounts"],
            ["Transcript request", "Exams"],
            ["Change my course", "Registrar"],
          ].map(([query, dept], i) => (
            <li key={dept} style={vars({ "--i": i })}>
              <span className="route-q">{query}</span>
              <span className="route-line" aria-hidden="true">
                <span className="route-dot" />
              </span>
              <span className="route-d">{dept}</span>
            </li>
          ))}
          <li className="route-note">Gemini classifies and drafts; Claude and keyword rules stand by as fallbacks.</li>
        </ul>
      );

    case "university-erp-lms":
      return (
        <div className="flow" aria-hidden="true">
          <span className="flow-node">Admissions portal</span>
          <span className="flow-link">
            <span className="packet" />
          </span>
          <span className="flow-node flow-core">Frappe ERP</span>
          <span className="flow-link">
            <span className="packet" style={vars({ "--d": "0.9s" })} />
          </span>
          <span className="flow-node">Moodle LMS</span>
        </div>
      );

    default:
      return null;
  }
}
