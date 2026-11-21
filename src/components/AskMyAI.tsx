"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { answers, findAnswer, suggested } from "@/content/knowledge";

type Message = { role: "user" | "ai"; text: string; done: boolean };

const GREETING =
  "Hi, I'm Hussain's AI assistant. Ask me about his projects, how MedScribe works, his stack or his experience.";

export function AskMyAI() {
  const [messages, setMessages] = useState<Message[]>([{ role: "ai", text: GREETING, done: true }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef(0);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  function ask(question: string, presetAnswer?: string) {
    const q = question.trim();
    if (!q || busy) return;
    const reply = presetAnswer ?? findAnswer(q);
    const words = reply.split(" ");
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setBusy(true);
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q, done: true }, { role: "ai", text: instant ? reply : "", done: instant }]);
    if (instant) {
      setBusy(false);
      return;
    }

    let i = 0;
    window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      i += 1;
      const done = i >= words.length;
      setMessages((m) => {
        const next = m.slice();
        next[next.length - 1] = { role: "ai", text: words.slice(0, i).join(" "), done };
        return next;
      });
      if (done) {
        window.clearInterval(timerRef.current);
        setBusy(false);
      }
    }, 34);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    ask(input);
  }

  const chips = answers.filter((a) => suggested.includes(a.id));

  return (
    <div className="chat glass">
      <div className="chat-head">
        <span className="chat-avatar" aria-hidden="true" />
        <div>
          <p className="chat-name">Hussain&apos;s AI</p>
          <p className="chat-sub">Answers from the facts on this site</p>
        </div>
      </div>

      <div className="chat-log" ref={listRef} aria-live="polite">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "msg msg-user" : "msg msg-ai"}>
            {m.text}
            {!m.done ? <span className="caret" /> : null}
          </p>
        ))}
      </div>

      <div className="chat-chips">
        {chips.map((c) => (
          <button key={c.id} type="button" className="chip-btn" disabled={busy} onClick={() => ask(c.question, c.answer)}>
            {c.question}
          </button>
        ))}
      </div>

      <form className="chat-form" onSubmit={onSubmit}>
        <label htmlFor="ask-input" className="sr-only">
          Ask a question about Hussain&apos;s work
        </label>
        <input
          id="ask-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about MedScribe, the stack, experience…"
          autoComplete="off"
        />
        <button type="submit" className="send" disabled={busy || !input.trim()}>
          Ask
        </button>
      </form>
    </div>
  );
}
