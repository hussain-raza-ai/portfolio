export type Role = {
  title: string;
  period: string;
  points: string[];
};

export const experience = {
  company: "Contech International Health Consultants",
  location: "Lahore, on-site",
  note: "Hired full-time after a five-month internship.",
  // Newest first
  roles: [
    {
      title: "AI Engineer",
      period: "Jul 2026 – present",
      points: [
        "Built MedScribe AI and moved its speech and language models onto the hospital's own GPU server.",
        "Delivered the lab-report extraction pipeline used in IMC Hospital's telemedicine service.",
        "Structured the AI services as isolated FastAPI microservices, orchestrated with n8n.",
      ],
    },
    {
      title: "AI Engineering Intern",
      period: "Feb 2026 – Jun 2026",
      points: [
        "Built Dr. Sara, the Urdu voice agent for patient intake.",
        "Prototyped medical LLM inference on Vast.ai cloud GPUs before the move to on-premise hardware.",
        "Set up a university ERP and LMS on Frappe ERPNext, Frappe Education and Moodle, covering admissions, fees, academics and exams.",
      ],
    },
  ] satisfies Role[],
};

export const capabilities: { group: string; items: string[] }[] = [
  {
    group: "Speech and language AI",
    items: [
      "Google MedASR",
      "Groq Whisper",
      "MedGemma 4B and 27B",
      "GPT-4o-mini",
      "Google Gemini",
      "Anthropic Claude",
      "LangChain",
      "Pipecat",
      "Edge TTS",
      "Docling OCR",
      "Prompt engineering",
    ],
  },
  {
    group: "Backend and automation",
    items: [
      "Python",
      "FastAPI",
      "Pydantic",
      "REST APIs and webhooks",
      "n8n",
      "Gmail API",
      "Google OAuth2",
      "RapidFuzz",
      "React",
      "Tailwind CSS",
    ],
  },
  {
    group: "Infrastructure",
    items: [
      "On-premise GPU deployment",
      "PyTorch (CUDA)",
      "Ollama",
      "Docker",
      "Linux servers over SSH and VPN",
      "Vast.ai",
      "Vercel",
      "Git and GitHub",
    ],
  },
  {
    group: "Data and platforms",
    items: [
      "PostgreSQL",
      "Supabase",
      "MariaDB",
      "Row-level security",
      "Frappe ERPNext",
      "Frappe Education",
      "Moodle",
    ],
  },
];

// Newest first
export const education = [
  {
    degree: "BS Computer Science",
    school: "Virtual University of Pakistan",
    period: "2022 – expected Dec 2026",
  },
  {
    degree: "ICS (Intermediate in Computer Science)",
    school: "Federal Government College, Jhelum",
    period: "2019 – 2021",
  },
];

export const certifications = [
  {
    name: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    date: "Dec 2025",
  },
];
