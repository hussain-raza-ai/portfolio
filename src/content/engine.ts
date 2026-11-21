// The orchestration view on the home page: what goes in, how it is handled,
// and what comes out. Every tool and path here comes from a real project.

export type EngineItem = { id: string; label: string; detail?: string };
export type Stage = { id: string; label: string; caption: string; tools: EngineItem[] };
export type Flow = { id: string; label: string; summary: string; path: string[] };

export const inputs: EngineItem[] = [
  { id: "voice", label: "Voice", detail: "Urdu and English dictation" },
  { id: "docs", label: "Documents", detail: "lab-report PDFs and scans" },
  { id: "inbox", label: "Email and web", detail: "Gmail inbox and web forms" },
];

export const stages: Stage[] = [
  {
    id: "perceive",
    label: "Perceive",
    caption: "speech, text, catalogues",
    tools: [
      { id: "medasr", label: "Google MedASR" },
      { id: "whisper", label: "Groq Whisper" },
      { id: "docling", label: "Docling OCR" },
      { id: "gmail", label: "Gmail API" },
      { id: "fuzz", label: "RapidFuzz matching" },
    ],
  },
  {
    id: "reason",
    label: "Reason",
    caption: "decide, route, review",
    tools: [
      { id: "mg27", label: "MedGemma 27B" },
      { id: "mg4", label: "MedGemma-4B" },
      { id: "gpt", label: "GPT-4o-mini" },
      { id: "gemini", label: "Gemini + Claude, LangChain" },
      { id: "schema", label: "Schema validation" },
    ],
  },
  {
    id: "act",
    label: "Act",
    caption: "services and workflows",
    tools: [
      { id: "fastapi", label: "FastAPI services" },
      { id: "n8n", label: "n8n workflows" },
      { id: "tts", label: "Edge TTS voice" },
    ],
  },
];

export const outputs: EngineItem[] = [
  { id: "emr", label: "EMR record", detail: "7 fields, doctor-approved" },
  { id: "summary", label: "Doctor summary", detail: "in the inbox before the call" },
  { id: "speech", label: "Spoken reply", detail: "Urdu, in real time" },
  { id: "draft", label: "Drafted reply", detail: "routed to the right desk" },
  { id: "alert", label: "Escalation", detail: "anything open for 24 hours" },
];

export const flows: Flow[] = [
  {
    id: "medscribe",
    label: "MedScribe AI",
    summary:
      "A doctor's dictation is transcribed, every drug and test is matched to the hospital catalogue, MedGemma 27B reviews the prescription, and the validated record is saved to the EMR.",
    path: ["voice", "medasr", "fuzz", "mg27", "schema", "fastapi", "emr"],
  },
  {
    id: "lab",
    label: "Lab reports",
    summary:
      "A PDF lab report is read by Docling OCR, structured by MedGemma-4B behind a FastAPI service, and delivered to the doctor as a summary by an n8n workflow.",
    path: ["docs", "docling", "mg4", "fastapi", "n8n", "summary"],
  },
  {
    id: "sara",
    label: "Dr. Sara",
    summary:
      "A patient speaks Urdu. Groq Whisper transcribes, GPT-4o-mini runs the intake, Edge TTS answers aloud, and n8n hands the intake to the hospital backend.",
    path: ["voice", "whisper", "gpt", "tts", "n8n", "speech"],
  },
  {
    id: "query",
    label: "Smart Query Routing",
    summary:
      "Queries from Gmail and the web are classified and drafted by Gemini, with Claude as fallback, then routed to the right desk, and n8n escalates anything left open for 24 hours.",
    path: ["inbox", "gmail", "gemini", "fastapi", "n8n", "draft", "alert"],
  },
];
