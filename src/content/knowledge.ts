// Answers for the "Ask my AI" panel. Every answer is written from facts on this
// site. Questions are matched by keywords in the browser; nothing is sent anywhere.

export type Answer = {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
};

export const answers: Answer[] = [
  {
    id: "medscribe",
    question: "What is MedScribe AI?",
    keywords: ["medscribe", "prescription", "dictation", "voice to", "emr", "medasr", "27b", "rapidfuzz"],
    answer:
      "MedScribe AI turns a doctor's 30-second voice dictation into a structured clinical record across 7 EMR fields: vitals, history, allergies, examination, diagnosis, prescription and lab orders. Google MedASR transcribes the audio, a RapidFuzz matching engine maps every drug and test to IMC Hospital's catalogue of 12,640 medicines and 1,694 lab tests, and MedGemma 27B reviews each prescription for dosing errors, interactions and contraindications. It runs on the hospital's own GPU server, returns a record in about 2 seconds, and the doctor approves every record.",
  },
  {
    id: "lab",
    question: "How does the lab report pipeline work?",
    keywords: ["lab", "report", "ocr", "docling", "pdf", "telemedicine", "extraction", "4b"],
    answer:
      "A medical assistant uploads a patient's PDF lab report before a telemedicine consultation. An n8n workflow sends it to a FastAPI service, Docling OCR reads it, and MedGemma-4B extracts the results and maps them to reference ranges. A doctor verifies every result, and a structured summary lands in the doctor's inbox. It reaches 85–92% extraction accuracy on standard report formats and is deployed at IMC Hospital.",
  },
  {
    id: "sara",
    question: "Tell me about Dr. Sara",
    keywords: ["sara", "urdu", "voice agent", "intake", "pipecat", "whisper"],
    answer:
      "Dr. Sara is an Urdu-speaking voice agent that takes a patient's medical intake before the consultation. Groq Whisper transcribes the patient, GPT-4o-mini runs the conversation, Edge TTS replies aloud in Urdu, and Pipecat keeps it real-time. An n8n workflow delivers the intake data to the hospital backend.",
  },
  {
    id: "fyp",
    question: "What was his final year project?",
    keywords: ["final year", "fyp", "query", "routing", "university project", "gemini", "claude", "email"],
    answer:
      "His final year project at Virtual University is Smart Query Routing, built solo. It classifies incoming web and email queries with Google Gemini through LangChain, routes each one to the right department and drafts a reply, with Anthropic Claude and keyword matching as fallbacks. It has a FastAPI backend on Supabase with Google OAuth2 and role-based access for 5 roles, a React dashboard, and n8n workflows for Gmail ingestion and 24-hour SLA escalation.",
  },
  {
    id: "erp",
    question: "What did he build for the university ERP?",
    keywords: ["erp", "lms", "moodle", "frappe", "erpnext", "student", "ghurki"],
    answer:
      "For GHURKI University he deployed Frappe ERPNext, Frappe Education and Moodle on a Linux server to run the whole student lifecycle. He built a compliance layer that checks attendance, fee clearance and course prerequisites for exam eligibility, and designed the API integration between the admissions portal, the ERP and Moodle. The integrations are being built now.",
  },
  {
    id: "stack",
    question: "What's his tech stack?",
    keywords: ["stack", "skills", "technolog", "tools", "language", "python", "framework"],
    answer:
      "Python and FastAPI for backends; MedGemma 4B and 27B, Google MedASR, Groq Whisper, GPT-4o-mini, Gemini and Claude for AI; LangChain and Pipecat for orchestration; n8n for automation; PyTorch (CUDA), Docker and Linux for deployment; PostgreSQL, Supabase and MariaDB for data; plus Frappe ERPNext and Moodle.",
  },
  {
    id: "experience",
    question: "Where does he work?",
    keywords: ["work", "job", "experience", "contech", "company", "intern", "role", "current"],
    answer:
      "He is an AI Engineer at Contech International Health Consultants in Lahore, building healthcare AI for IMC Hospital. He joined as an AI Engineering Intern in February 2026 and was hired full-time in July 2026, after five months.",
  },
  {
    id: "privacy",
    question: "How does he handle patient data?",
    keywords: ["privacy", "patient data", "on-prem", "on prem", "premise", "secure", "safety", "hipaa"],
    answer:
      "MedScribe's speech and language models run on the hospital's own GPU server, so patient data stays inside the hospital network. Every model output is schema-validated before it can reach the EMR, and a doctor reviews and approves every record and every extracted lab result.",
  },
  {
    id: "education",
    question: "What's his education?",
    keywords: ["education", "degree", "study", "university", "ccna", "certif", "ics", "college", "intermediate", "jhelum", "network", "cisco"],
    answer:
      "He is completing a BS in Computer Science at Virtual University of Pakistan, expected in December 2026. Before that he did his ICS (Intermediate in Computer Science) at Federal Government College, Jhelum, from 2019 to 2021. He also holds the Cisco CCNA: Introduction to Networks certificate (December 2025).",
  },
  {
    id: "contact",
    question: "How can I contact him?",
    keywords: ["contact", "hire", "hiring", "recruit", "cv", "resume", "collaborat", "work together", "email", "reach", "linkedin", "available", "availability", "freelance", "whatsapp", "phone", "number", "gmail"],
    answer:
      "To hire him or talk about a project, email hussainrazashah536@gmail.com or message him on WhatsApp at +92 310 5303331. He is also on LinkedIn, and his CV can be downloaded from the top and bottom of this page.",
  },
];

export const suggested = ["medscribe", "lab", "fyp", "stack", "experience", "privacy"];

export const fallback =
  "I can answer questions about Hussain's projects, stack, experience and education. Try asking about MedScribe AI, the lab report pipeline, Dr. Sara or his final year project.";

// Tools from the skills section, so "Does he know Docker?" gets a direct answer.
const skills: [string, string][] = [
  ["python", "Python"],
  ["fastapi", "FastAPI"],
  ["pydantic", "Pydantic"],
  ["react", "React"],
  ["tailwind", "Tailwind CSS"],
  ["n8n", "n8n"],
  ["langchain", "LangChain"],
  ["pipecat", "Pipecat"],
  ["docker", "Docker"],
  ["linux", "Linux servers"],
  ["pytorch", "PyTorch"],
  ["cuda", "CUDA"],
  ["ollama", "Ollama"],
  ["vast", "Vast.ai"],
  ["vercel", "Vercel"],
  ["git", "Git and GitHub"],
  ["postgres", "PostgreSQL"],
  ["supabase", "Supabase"],
  ["mariadb", "MariaDB"],
  ["sql", "SQL"],
  ["medgemma", "MedGemma"],
  ["whisper", "Groq Whisper"],
  ["gpt", "GPT-4o-mini"],
  ["openai", "GPT-4o-mini"],
  ["gemini", "Google Gemini"],
  ["claude", "Anthropic Claude"],
  ["ocr", "Docling OCR"],
  ["rapidfuzz", "RapidFuzz"],
  ["oauth", "Google OAuth2"],
  ["frappe", "Frappe ERPNext"],
  ["moodle", "Moodle"],
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A keyword only counts at the start of a word, so "lab" does not match "collaborate"
// and "ics" does not match "analytics".
const hasWord = (text: string, k: string) => new RegExp(`(^|[^a-z0-9])${escape(k)}`).test(text);

export function findAnswer(input: string): string {
  const text = input.toLowerCase();
  let best: { score: number; answer: string } = { score: 0, answer: fallback };
  for (const a of answers) {
    const score = a.keywords.reduce((sum, k) => (hasWord(text, k) ? sum + k.length : sum), 0);
    if (score > best.score) best = { score, answer: a.answer };
  }

  const known = Array.from(new Set(skills.filter(([term]) => new RegExp(`\\b${term}`).test(text)).map(([, name]) => name)));
  const asksAboutTools = /\b(know|use|used|work with|experience with|familiar|skill)/.test(text);
  if (known.length > 0 && (asksAboutTools || best.score < 6)) {
    const list = known.length === 1 ? known[0] : `${known.slice(0, -1).join(", ")} and ${known[known.length - 1]}`;
    return `Yes. ${list} ${known.length === 1 ? "is" : "are"} part of Hussain's working stack, used in the projects on this page. Ask about a specific project to see how.`;
  }
  return best.answer;
}
