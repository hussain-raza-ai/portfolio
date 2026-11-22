export type PipelineStep = {
  title: string;
  detail: string;
  /** A few words for the compact pipeline on the home page */
  short?: string;
};

export type Project = {
  slug: string;
  title: string;
  /** One line shown in the work list */
  summary: string;
  /** The single result that matters most, shown in the work list */
  outcome: string;
  context: string;
  period: string;
  role: string;
  status: string;
  stack: string[];
  problem: string[];
  pipeline: PipelineStep[];
  built: string[];
  results: string[];
  /** Public source code, when the project's code can be shared */
  code?: string;
};

export const projects: Project[] = [
  {
    slug: "medscribe-ai",
    title: "MedScribe AI",
    summary:
      "Turns a doctor's voice dictation into a structured clinical record, with an AI safety review of every prescription.",
    outcome: "One 30-second dictation fills all 7 fields of the patient record.",
    context: "IMC Hospital, through Contech International",
    period: "2026",
    role: "AI and backend engineer",
    status: "In use, running on-premise",
    stack: [
      "Python",
      "FastAPI",
      "PyTorch (CUDA)",
      "Google MedASR",
      "MedGemma 27B",
      "RapidFuzz",
      "Flutter app",
      "Laravel EMR",
    ],
    problem: [
      "An outpatient doctor in Pakistan can see 60 or more patients a day and writes every prescription by hand. Each record then has to reach the hospital's EMR with the exact medicine and test items that the pharmacy and lab work from.",
      "MedScribe lets the doctor tap record in the hospital's Flutter app, speak the case, and get back a structured record to review and approve.",
    ],
    pipeline: [
      {
        title: "Doctor dictates",
        detail: "The doctor records the case in the hospital's Flutter app, usually in about 30 seconds.",
        short: "About 30 seconds, in the hospital's Flutter app",
      },
      {
        title: "Speech becomes text",
        detail: "Google MedASR, a speech model trained on medical vocabulary, transcribes the audio on the hospital's GPU.",
        short: "Google MedASR, on the hospital's GPU",
      },
      {
        title: "Drugs and tests are matched",
        detail:
          "A rules and RapidFuzz matching engine resolves every medicine and test to the hospital's own catalogue of 12,640 medicines and 1,694 lab tests, down to the item ID the pharmacy dispenses against.",
        short: "RapidFuzz against 14,000+ catalogue items",
      },
      {
        title: "The record is structured",
        detail:
          "The dictation is split into 7 EMR fields: vitals, history, allergies, examination, diagnosis, prescription and lab orders.",
        short: "Split into 7 EMR fields",
      },
      {
        title: "AI safety review",
        detail: "MedGemma 27B checks each prescription for dosing errors, drug interactions and contraindications.",
        short: "MedGemma 27B checks doses and interactions",
      },
      {
        title: "Output is validated in code",
        detail: "Every model output is checked against a schema before it can reach the EMR.",
        short: "Schema checks before anything is saved",
      },
      {
        title: "Doctor approves",
        detail: "The parsed record appears in the app. The doctor reviews it, edits if needed, and approves it into the Laravel EMR.",
        short: "Reviewed, edited if needed, saved to the EMR",
      },
    ],
    built: [
      "Designed and built the FastAPI backend that connects the Flutter app, the speech and language models, and the hospital's Laravel EMR.",
      "Built the matching engine that maps dictated drug and test names to exact catalogue items.",
      "Prototyped the models on rented Vast.ai GPUs, then moved production inference onto the hospital's own GPU server.",
      "Kept the doctor in control: the AI suggests the record and the doctor approves it.",
    ],
    results: [
      "A structured record comes back in about 2 seconds, and the AI safety review in under 5 seconds.",
      "Every drug and test is resolved to a real catalogue item, so the pharmacy and lab receive exact orders.",
      "Runs fully on-premise, so patient data stays inside the hospital network.",
    ],
  },
  {
    slug: "smart-query-routing",
    code: "https://github.com/hussain-raza-ai/smart-query-routing-system",
    title: "Smart Query Routing",
    summary:
      "Reads incoming web and email queries, sends each one to the right department, and drafts a reply for staff to send.",
    outcome: "Queries are classified, routed and drafted without anyone sorting the inbox by hand.",
    context: "Final year project, Virtual University of Pakistan",
    period: "2026",
    role: "Sole developer, AI and full stack",
    status: "Completed and defended at the final viva",
    stack: [
      "Python",
      "FastAPI",
      "React",
      "Tailwind CSS",
      "Supabase (PostgreSQL)",
      "LangChain",
      "Google Gemini",
      "Anthropic Claude",
      "n8n",
      "Google OAuth2",
      "Chart.js",
    ],
    problem: [
      "Questions from students and the public arrive through web forms and email. Someone has to read each one, decide which department owns it, and write a reply, and urgent queries can sit unanswered.",
    ],
    pipeline: [
      {
        title: "A query arrives",
        detail: "From the web form, or from the Gmail inbox through an n8n workflow.",
      },
      {
        title: "Intent is classified",
        detail: "Google Gemini, orchestrated with LangChain, reads the query and decides what it is about.",
      },
      {
        title: "It is routed",
        detail: "The query is assigned to the department that owns it.",
      },
      {
        title: "A reply is drafted",
        detail:
          "Gemini drafts a contextual reply, with Anthropic Claude as a fallback and keyword matching as a last resort, so routing keeps working when the AI services are down.",
      },
      {
        title: "Staff review and send",
        detail: "Staff edit the draft in the dashboard and send it.",
      },
      {
        title: "Nothing is forgotten",
        detail: "n8n escalates any query left open for 24 hours and sends a daily analytics summary.",
      },
    ],
    built: [
      "A FastAPI backend on Supabase with passwordless Google OAuth2 sign-in and role-based access for 5 user roles.",
      "A normalized (3NF) database with row-level security and an append-only audit log of every change.",
      "A React and Tailwind CSS dashboard with status timelines, editable AI drafts and Chart.js analytics.",
      "Self-hosted n8n workflows for Gmail ingestion, SLA escalation and daily summaries.",
    ],
    results: [
      "Every query is classified and routed automatically, with a drafted reply waiting for staff.",
      "Routing keeps working even when both AI providers are unavailable.",
      "Completed as a solo project and defended at the final viva.",
    ],
  },
  {
    slug: "lab-report-extraction",
    title: "Lab Report Extraction",
    summary:
      "Turns unstructured PDF lab reports into structured clinical summaries that reach the doctor before a telemedicine consultation.",
    outcome: "Every lab report reaches the doctor as a structured, verified summary before the call.",
    context: "IMC Hospital telemedicine, through Contech International",
    period: "2026",
    role: "Sole architect and developer",
    status: "Deployed at IMC Hospital",
    stack: ["Python", "FastAPI", "n8n", "Docling OCR", "MedGemma-4B", "Supabase", "Docker", "Vast.ai"],
    problem: [
      "In telemedicine, doctors were spending consultation minutes reading messy PDF lab reports instead of talking to the patient.",
      "The goal was to have a clear, structured summary in the doctor's inbox before the call starts.",
    ],
    pipeline: [
      {
        title: "File is dropped in",
        detail: "A medical assistant uploads the patient's lab report PDF before the consultation.",
      },
      {
        title: "Workflow takes over",
        detail: "An n8n workflow receives the file and sends it to the extraction service as a base64-encoded JSON payload.",
      },
      {
        title: "OCR reads the report",
        detail: "Docling OCR parses the unstructured PDF, including tables.",
      },
      {
        title: "Values are extracted",
        detail:
          "MedGemma-4B pulls out the results and maps markers such as liver function, lipid profile and special chemistry to their reference ranges.",
      },
      {
        title: "Doctor verifies",
        detail: "Every extracted result requires doctor verification, as a patient-safety control.",
      },
      {
        title: "Summary is delivered",
        detail: "A structured, colour-coded summary is emailed to the doctor and stored in Supabase.",
      },
    ],
    built: [
      "Built the end-to-end pipeline as isolated FastAPI services, with n8n as the orchestrator.",
      "Fixed failing multipart uploads in n8n by redesigning file transfer as base64-encoded JSON.",
      "Engineered the MedGemma-4B prompts for structured clinical output.",
    ],
    results: [
      "Results and their reference ranges are pulled out of unstructured PDFs, tables included, into a structured summary.",
      "Doctors receive the summary before the consultation instead of reading raw PDFs during it.",
      "Deployed and in use at IMC Hospital.",
    ],
  },
  {
    slug: "university-erp-lms",
    title: "University ERP and LMS",
    summary:
      "A self-hosted platform that runs a university's whole student lifecycle, from admission to degree completion.",
    outcome: "Admissions, fees, academics, exams and the LMS working as one system.",
    context: "GHURKI University",
    period: "2026, ongoing",
    role: "Architect and implementer",
    status: "Deployed; integrations in progress",
    stack: ["Frappe Framework", "ERPNext v15", "Frappe Education", "Moodle 4.5", "MariaDB", "REST APIs", "Linux"],
    problem: [
      "Student data lived in separate places for admissions, fees, academics and online learning, and moving it between them meant entering the same data more than once.",
    ],
    pipeline: [
      {
        title: "Admission is finalized",
        detail: "Applicants apply and are finalized on the university's public admissions portal.",
      },
      {
        title: "Student enters the ERP",
        detail: "The portal sends admitted students to Frappe through a REST API.",
      },
      {
        title: "Academic life is managed",
        detail: "Frappe Education and ERPNext handle courses, fees, attendance and examinations.",
      },
      {
        title: "Eligibility is checked",
        detail: "Rules for attendance, fee clearance and course prerequisites decide who can sit each exam.",
      },
      {
        title: "Courses appear in the LMS",
        detail: "Students and their course enrolments sync from Frappe to Moodle.",
      },
      {
        title: "Degree is completed",
        detail: "Results flow through to transcripts and degree certificates.",
      },
    ],
    built: [
      "Deployed Frappe ERPNext, Frappe Education and Moodle on a Linux server, managed over SSH and VPN.",
      "Modeled the HEC-standard BSCS curriculum with prerequisite chains.",
      "Built a rule-based compliance layer for attendance, fee clearance and prerequisites, replacing manual eligibility checks with one automated check.",
      "Designed the API-first integration between the admissions portal, the ERP and Moodle.",
      "Chose Frappe and Moodle over OpenEduCat (Odoo) after evaluating both, and assessed on-premises against Frappe Cloud hosting.",
    ],
    results: [
      "The full student lifecycle runs on one platform.",
      "Exam eligibility is decided by one automated check instead of manual review.",
      "One data flow across three systems is designed, with the integrations now being built.",
    ],
  },
  {
    slug: "dr-sara",
    title: "Dr. Sara",
    summary: "An Urdu-speaking voice agent that takes a patient's medical intake before the consultation.",
    outcome: "A real-time voice conversation in Urdu, end to end.",
    context: "IMC Hospital, through Contech International",
    period: "2026",
    role: "AI engineer",
    status: "Built and integrated with the hospital backend",
    stack: ["Python", "Pipecat", "Groq Whisper", "GPT-4o-mini", "Edge TTS", "n8n"],
    problem: [
      "Many patients find it easier to describe their symptoms by speaking in Urdu than by filling in a form.",
    ],
    pipeline: [
      {
        title: "Patient speaks",
        detail: "The patient answers intake questions out loud, in Urdu.",
      },
      {
        title: "Speech becomes text",
        detail: "Groq Whisper transcribes the audio.",
      },
      {
        title: "The agent responds",
        detail: "GPT-4o-mini runs the intake conversation and decides what to ask next.",
      },
      {
        title: "Dr. Sara answers aloud",
        detail: "Edge TTS speaks the reply in Urdu, with Pipecat keeping the conversation real-time.",
      },
      {
        title: "Intake reaches the hospital",
        detail: "An n8n workflow delivers the collected intake data to the IMC backend.",
      },
    ],
    built: [
      "Chained speech-to-text, the language model and text-to-speech into one real-time Pipecat pipeline.",
      "Traced and fixed cascading n8n failures (broken node connections, URL redirects and malformed JSON) to restore delivery of intake data.",
    ],
    results: [
      "Patients complete their intake by talking, in their own language.",
      "Intake data reaches the hospital backend reliably.",
    ],
  },
];

export const inProgress =
  "Computer-vision monitoring that measures workstation idle time from camera feeds using open-source vision models, with object-pickup alerts as the next phase.";

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
